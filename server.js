const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");
const Database = require("better-sqlite3");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;
const SHOW_DURATION_MS = 5000;
const MATCH_ROUNDS = 5;
const NEXT_ROUND_DELAY_MS = 1400;
const AUTH_COOKIE_NAME = "cg_auth";
const AUTH_TTL_MS = 1000 * 60 * 60 * 24 * 30;

const dataDir = process.env.DATA_DIR
  ? path.resolve(process.env.DATA_DIR)
  : path.join(__dirname, "data");
fs.mkdirSync(dataDir, { recursive: true });
const db = new Database(path.join(dataDir, "color_game.db"));
db.pragma("journal_mode = WAL");
db.prepare(
  `CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    username_norm TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    created_at TEXT NOT NULL
  )`,
).run();

const authSessions = new Map();

const rooms = new Map();
const roomTimers = new Map();

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

function verifyPassword(password, encodedHash) {
  const [salt, storedHash] = String(encodedHash || "").split(":");
  if (!salt || !storedHash) {
    return false;
  }
  const candidateHash = crypto.scryptSync(password, salt, 64).toString("hex");
  const a = Buffer.from(storedHash, "hex");
  const b = Buffer.from(candidateHash, "hex");
  if (a.length !== b.length) {
    return false;
  }
  return crypto.timingSafeEqual(a, b);
}

function parseCookies(req) {
  const header = req.headers.cookie;
  if (!header) {
    return {};
  }

  const parsed = {};
  const pairs = header.split(";");
  for (const pair of pairs) {
    const [rawKey, ...rawValue] = pair.trim().split("=");
    if (!rawKey) {
      continue;
    }
    parsed[rawKey] = decodeURIComponent(rawValue.join("="));
  }
  return parsed;
}

function setAuthCookie(res, token) {
  res.setHeader(
    "Set-Cookie",
    `${AUTH_COOKIE_NAME}=${encodeURIComponent(token)}; HttpOnly; Path=/; SameSite=Lax; Max-Age=${Math.floor(AUTH_TTL_MS / 1000)}`,
  );
}

function clearAuthCookie(res) {
  res.setHeader("Set-Cookie", `${AUTH_COOKIE_NAME}=; HttpOnly; Path=/; SameSite=Lax; Max-Age=0`);
}

function getSessionFromRequest(req) {
  const cookies = parseCookies(req);
  const token = cookies[AUTH_COOKIE_NAME];
  if (!token) {
    return null;
  }

  const session = authSessions.get(token);
  if (!session) {
    return null;
  }

  if (Date.now() - session.createdAt > AUTH_TTL_MS) {
    authSessions.delete(token);
    return null;
  }

  return { token, ...session };
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function hueCircularDiff(a, b) {
  const raw = Math.abs(a - b);
  return Math.min(raw, 360 - raw);
}

function isColorTooClose(nextColor, previousColor) {
  if (!previousColor) {
    return false;
  }
  return (
    hueCircularDiff(nextColor.hue, previousColor.hue) < 34
    && Math.abs(nextColor.tint - previousColor.tint) < 18
    && Math.abs(nextColor.lightness - previousColor.lightness) < 14
  );
}

function createRandomTarget(previousColor) {
  let candidate = null;

  for (let attempt = 0; attempt < 16; attempt += 1) {
    const next = {
      hue: randomInt(0, 359),
      tint: randomInt(4, 98),
      lightness: randomInt(22, 78),
    };

    candidate = next;
    if (!isColorTooClose(next, previousColor)) {
      break;
    }
  }

  return candidate;
}

function makeRoomCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i += 1) {
    code += chars[randomInt(0, chars.length - 1)];
  }
  return code;
}

function hslDistanceScore(target, guess) {
  const hueDiffRaw = Math.abs(guess.hue - target.hue);
  const hueDiff = Math.min(hueDiffRaw, 360 - hueDiffRaw);
  const tintDiff = Math.abs(guess.tint - target.tint);
  const lightnessDiff = Math.abs(guess.lightness - target.lightness);
  const hueWeight = 1.3;
  const tintWeight = 1;
  const lightnessWeight = 0.9;
  const normalizedHue = hueDiff / 180;
  const normalizedTint = tintDiff / 100;
  const normalizedLightness = lightnessDiff / 100;
  const weightedDistance =
    Math.sqrt(
      (normalizedHue * hueWeight) ** 2
      + (normalizedTint * tintWeight) ** 2
      + (normalizedLightness * lightnessWeight) ** 2,
    ) /
    Math.sqrt(hueWeight ** 2 + tintWeight ** 2 + lightnessWeight ** 2);
  const strictnessExponent = 2.2;
  const score = Math.max(0, Number((((1 - weightedDistance) ** strictnessExponent) * 100).toFixed(2)));
  return { score, hueDiff, tintDiff, lightnessDiff };
}

function getRoomPlayerArray(room) {
  return Array.from(room.players.values()).map((player) => ({
    id: player.id,
    name: player.name,
    isHost: room.hostId === player.id,
    submitted: !!player.submitted,
  }));
}

function emitRoomState(roomCode) {
  const room = rooms.get(roomCode);
  if (!room) {
    return;
  }

  io.to(roomCode).emit("room_state", {
    roomCode,
    hostId: room.hostId,
    matchActive: room.matchActive,
    roundNumber: room.roundNumber,
    maxRounds: room.maxRounds,
    phase: room.phase,
    players: getRoomPlayerArray(room),
  });
}

function getLeaderboard(room) {
  return Array.from(room.players.values())
    .map((player) => ({ name: player.name, score: player.totalScore ?? 0 }))
    .sort((a, b) => b.score - a.score);
}

function startRoomRound(roomCode) {
  const room = rooms.get(roomCode);
  if (!room) {
    return;
  }

  const pendingTimer = roomTimers.get(roomCode);
  if (pendingTimer) {
    clearTimeout(pendingTimer);
    roomTimers.delete(roomCode);
  }

  if (!room.matchActive || room.roundNumber >= room.maxRounds) {
    return;
  }

  room.phase = "show";
  room.roundNumber += 1;
  room.target = createRandomTarget(room.lastRandomTarget);
  room.lastRandomTarget = room.target;

  for (const player of room.players.values()) {
    player.submitted = false;
    player.currentGuess = null;
    player.currentResult = null;
  }

  io.to(roomCode).emit("round_started", {
    target: room.target,
    durationMs: SHOW_DURATION_MS,
    roundNumber: room.roundNumber,
    maxRounds: room.maxRounds,
  });
  emitRoomState(roomCode);

  setTimeout(() => {
    const currentRoom = rooms.get(roomCode);
    if (!currentRoom || currentRoom.phase !== "show") {
      return;
    }
    currentRoom.phase = "guess";
    io.to(roomCode).emit("guess_phase");
  }, SHOW_DURATION_MS);
}

function tryCloseRound(roomCode) {
  const room = rooms.get(roomCode);
  if (!room || room.phase !== "guess") {
    return;
  }

  const players = Array.from(room.players.values());
  const allSubmitted = players.length > 0 && players.every((player) => player.submitted);
  if (!allSubmitted) {
    return;
  }

  room.phase = "result";
  const leaderboard = getLeaderboard(room);
  const matchFinished = room.roundNumber >= room.maxRounds;
  room.matchActive = !matchFinished;

  io.to(roomCode).emit("round_result_broadcast", {
    target: room.target,
    leaderboard,
    roundNumber: room.roundNumber,
    maxRounds: room.maxRounds,
    matchFinished,
  });

  for (const player of players) {
    io.to(player.id).emit("round_result", {
      playerId: player.id,
      target: room.target,
      guess: player.currentGuess,
      score: player.currentResult.score,
      hueDiff: Math.round(player.currentResult.hueDiff),
      tintDiff: Math.round(player.currentResult.tintDiff),
      lightnessDiff: Math.round(player.currentResult.lightnessDiff),
      leaderboard,
      roundNumber: room.roundNumber,
      maxRounds: room.maxRounds,
      matchFinished,
    });
  }

  if (matchFinished) {
    io.to(roomCode).emit("match_finished", {
      leaderboard,
      maxRounds: room.maxRounds,
    });
  } else {
    room.phase = "waiting_next";
    roomTimers.set(roomCode, setTimeout(() => {
      roomTimers.delete(roomCode);
      const currentRoom = rooms.get(roomCode);
      if (!currentRoom || !currentRoom.matchActive) {
        return;
      }
      startRoomRound(roomCode);
    }, NEXT_ROUND_DELAY_MS));
  }

  emitRoomState(roomCode);
}

app.use(express.json());

app.post("/api/auth/register", (req, res) => {
  const username = String(req.body?.username || "").trim();
  const password = String(req.body?.password || "");

  if (username.length < 3 || username.length > 20) {
    res.status(400).json({ ok: false, message: "Pseudo invalide (3 a 20 caracteres)." });
    return;
  }

  if (password.length < 6 || password.length > 128) {
    res.status(400).json({ ok: false, message: "Mot de passe invalide (6 caracteres minimum)." });
    return;
  }

  const usernameNorm = username.toLowerCase();
  const existing = db.prepare("SELECT id FROM users WHERE username_norm = ?").get(usernameNorm);
  if (existing) {
    res.status(409).json({ ok: false, message: "Ce pseudo est deja pris." });
    return;
  }

  const passwordHash = hashPassword(password);
  const createdAt = new Date().toISOString();
  const result = db
    .prepare("INSERT INTO users (username, username_norm, password_hash, created_at) VALUES (?, ?, ?, ?)")
    .run(username, usernameNorm, passwordHash, createdAt);

  const token = crypto.randomUUID();
  authSessions.set(token, {
    userId: result.lastInsertRowid,
    username,
    createdAt: Date.now(),
  });

  setAuthCookie(res, token);
  res.json({ ok: true, user: { id: result.lastInsertRowid, username } });
});

app.post("/api/auth/login", (req, res) => {
  const username = String(req.body?.username || "").trim();
  const password = String(req.body?.password || "");
  const user = db.prepare("SELECT id, username, password_hash FROM users WHERE username_norm = ?").get(username.toLowerCase());

  if (!user || !verifyPassword(password, user.password_hash)) {
    res.status(401).json({ ok: false, message: "Identifiants invalides." });
    return;
  }

  const token = crypto.randomUUID();
  authSessions.set(token, {
    userId: user.id,
    username: user.username,
    createdAt: Date.now(),
  });

  setAuthCookie(res, token);
  res.json({ ok: true, user: { id: user.id, username: user.username } });
});

app.get("/api/auth/me", (req, res) => {
  const session = getSessionFromRequest(req);
  if (!session) {
    res.json({ ok: true, user: null });
    return;
  }

  res.json({ ok: true, user: { id: session.userId, username: session.username } });
});

app.post("/api/auth/logout", (req, res) => {
  const session = getSessionFromRequest(req);
  if (session) {
    authSessions.delete(session.token);
  }
  clearAuthCookie(res);
  res.json({ ok: true });
});

app.use(express.static(path.join(__dirname)));

io.on("connection", (socket) => {
  socket.on("create_room", ({ name }) => {
    let roomCode = makeRoomCode();
    while (rooms.has(roomCode)) {
      roomCode = makeRoomCode();
    }

    const room = {
      hostId: socket.id,
      phase: "idle",
      target: null,
      lastRandomTarget: null,
      matchActive: false,
      roundNumber: 0,
      maxRounds: MATCH_ROUNDS,
      players: new Map(),
    };

    room.players.set(socket.id, {
      id: socket.id,
      name: (name || "Joueur").slice(0, 20),
      submitted: false,
      lastScore: 0,
      totalScore: 0,
      currentGuess: null,
      currentResult: null,
    });

    rooms.set(roomCode, room);
    socket.join(roomCode);
    socket.data.roomCode = roomCode;
    emitRoomState(roomCode);
  });

  socket.on("join_room", ({ roomCode, name }) => {
    const normalizedCode = String(roomCode || "").trim().toUpperCase();
    const room = rooms.get(normalizedCode);
    if (!room) {
      socket.emit("error_message", "Salon introuvable.");
      return;
    }

    room.players.set(socket.id, {
      id: socket.id,
      name: (name || "Joueur").slice(0, 20),
      submitted: false,
      lastScore: 0,
      totalScore: 0,
      currentGuess: null,
      currentResult: null,
    });

    socket.join(normalizedCode);
    socket.data.roomCode = normalizedCode;
    emitRoomState(normalizedCode);
  });

  socket.on("start_match", ({ roomCode }) => {
    const room = rooms.get(roomCode);
    if (!room) {
      return;
    }

    if (room.hostId !== socket.id) {
      socket.emit("error_message", "Seul le host peut lancer la partie.");
      return;
    }

    room.matchActive = true;
    room.roundNumber = 0;
    room.phase = "idle";
    room.lastRandomTarget = null;

    for (const player of room.players.values()) {
      player.submitted = false;
      player.lastScore = 0;
      player.totalScore = 0;
      player.currentGuess = null;
      player.currentResult = null;
    }

    io.to(roomCode).emit("match_started", { maxRounds: room.maxRounds });
    startRoomRound(roomCode);
  });

  socket.on("start_round", ({ roomCode }) => {
    const room = rooms.get(roomCode);
    if (!room) {
      return;
    }

    if (room.hostId !== socket.id) {
      socket.emit("error_message", "Seul le host peut lancer la manche.");
      return;
    }

    if (!room.matchActive) {
      socket.emit("error_message", "Lance d'abord une partie de 5 manches.");
      return;
    }

    if (room.roundNumber >= room.maxRounds) {
      socket.emit("error_message", "La partie est terminee. Relance une nouvelle partie.");
      return;
    }

    startRoomRound(roomCode);
  });

  socket.on("submit_guess", ({ roomCode, hue, tint, lightness }) => {
    const room = rooms.get(roomCode);
    if (!room || room.phase !== "guess") {
      return;
    }

    const player = room.players.get(socket.id);
    if (!player || player.submitted) {
      return;
    }

    const guess = {
      hue: Math.max(0, Math.min(360, Number(hue))),
      tint: Math.max(0, Math.min(100, Number(tint))),
      lightness: Math.max(0, Math.min(100, Number(lightness))),
    };

    const scoreData = hslDistanceScore(room.target, guess);
    player.submitted = true;
    player.currentGuess = guess;
    player.currentResult = scoreData;
    player.lastScore = scoreData.score;
    player.totalScore += scoreData.score;

    emitRoomState(roomCode);
    tryCloseRound(roomCode);
  });

  socket.on("disconnect", () => {
    const roomCode = socket.data.roomCode;
    if (!roomCode) {
      return;
    }

    const room = rooms.get(roomCode);
    if (!room) {
      return;
    }

    room.players.delete(socket.id);
    if (room.players.size === 0) {
      const timer = roomTimers.get(roomCode);
      if (timer) {
        clearTimeout(timer);
        roomTimers.delete(roomCode);
      }
      rooms.delete(roomCode);
      return;
    }

    if (room.hostId === socket.id) {
      room.hostId = room.players.keys().next().value;
    }

    emitRoomState(roomCode);
  });
});

server.listen(PORT, () => {
  console.log(`Color Guesser online sur http://localhost:${PORT}`);
});
