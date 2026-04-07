const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");
const Database = require("better-sqlite3");
const {
  SHOW_DURATION_MS,
  MATCH_ROUNDS,
  NEXT_ROUND_DELAY_MS,
  AUTH_COOKIE_NAME,
  AUTH_TTL_MS,
  VALID_ONLINE_MODES,
  VALID_CODE_FORMATS,
  NAMED_COLOR_DIFFICULTIES,
  NAMED_COLOR_BASES,
  NAMED_COLOR_VARIANTS,
  CODE_FORMATS,
  ONLINE_MODE_LABELS,
} = require("./src/server/constants");
const {
  hashPassword,
  verifyPassword,
  parseCookies,
  setAuthCookie,
  clearAuthCookie,
  getSessionFromRequest,
} = require("./src/server/auth-utils");
const {
  randomInt,
  clamp,
  wrapHue,
  hsl,
  hslToRgb,
  rgbToHex,
  rgbToHsl,
  hslDistance,
  hueCircularDiff,
  isColorTooClose,
  createRandomTarget,
  shuffleArray,
  getColorCodeLabel,
} = require("./src/server/color-utils");

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const PORT = process.env.PORT || 3000;

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

function normalizeOnlineMode(mode) {
  return VALID_ONLINE_MODES.has(mode) ? mode : "memory";
}

function normalizeCodeFormat(codeFormat) {
  return VALID_CODE_FORMATS.has(codeFormat) ? codeFormat : "auto";
}

function createPlayerState(socketId, name) {
  return {
    id: socketId,
    name: (name || "Joueur").slice(0, 20),
    submitted: false,
    lastScore: 0,
    totalScore: 0,
    currentGuess: null,
    currentResult: null,
  };
}

function createRoomState(socketId, name, mode, codeFormat) {
  const normalizedMode = normalizeOnlineMode(mode);
  const normalizedCodeFormat = normalizeCodeFormat(codeFormat);

  return {
    hostId: socketId,
    phase: "idle",
    target: null,
    lastRandomTarget: null,
    lastNamedTarget: null,
    matchActive: false,
    roundNumber: 0,
    maxRounds: MATCH_ROUNDS,
    mode: normalizedMode,
    codeFormat: normalizedMode === "code" ? normalizedCodeFormat : "auto",
    namedColorPool: normalizedMode === "name" ? buildNamedColorPool() : [],
    players: new Map([[socketId, createPlayerState(socketId, name)]]),
  };
}

function resetPlayerProgress(player) {
  player.submitted = false;
  player.lastScore = 0;
  player.totalScore = 0;
  player.currentGuess = null;
  player.currentResult = null;
}

function resetRoomForMatch(room) {
  room.matchActive = true;
  room.roundNumber = 0;
  room.phase = "idle";
  room.lastRandomTarget = null;
  room.lastNamedTarget = null;
  room.namedColorPool = room.mode === "name" ? buildNamedColorPool() : [];

  for (const player of room.players.values()) {
    resetPlayerProgress(player);
  }
}

function clearRoomTimer(roomCode) {
  const timer = roomTimers.get(roomCode);
  if (timer) {
    clearTimeout(timer);
    roomTimers.delete(roomCode);
  }
}

function removeSocketFromRoom(socket, roomCode) {
  const room = rooms.get(roomCode);
  if (!room) {
    socket.data.roomCode = null;
    return;
  }

  room.players.delete(socket.id);
  socket.leave(roomCode);
  socket.data.roomCode = null;

  if (room.players.size === 0) {
    clearRoomTimer(roomCode);
    rooms.delete(roomCode);
    return;
  }

  if (room.hostId === socket.id) {
    room.hostId = room.players.keys().next().value;
  }

  emitRoomState(roomCode);
}

function buildNamedColorPool() {
  const allowedVariants = new Set(["base", "clair", "profond"]);
  const generated = [];

  for (const baseColor of NAMED_COLOR_BASES) {
    for (const variant of NAMED_COLOR_VARIANTS) {
      if (!allowedVariants.has(variant.id)) {
        continue;
      }

      generated.push({
        name: `${baseColor.name}${variant.label}`,
        hue: wrapHue(baseColor.hue + variant.hueOffset),
        tint: clamp(baseColor.tint + variant.tintOffset, 12, 96),
        lightness: 50,
      });
    }
  }

  return shuffleArray(generated);
}

function refillNamedColorPool(room) {
  room.namedColorPool = buildNamedColorPool();
}

function createOnlineTarget(room) {
  if (room.mode === "name") {
    if (!room.namedColorPool || room.namedColorPool.length === 0) {
      refillNamedColorPool(room);
    }

    const next = room.namedColorPool.pop();
    room.lastNamedTarget = next;
    return {
      name: next.name,
      hue: next.hue,
      tint: next.tint,
      lightness: next.lightness,
    };
  }

  const next = createRandomTarget(room.lastRandomTarget);
  room.lastRandomTarget = next;

  if (room.mode === "code") {
    const code = getColorCodeLabel(next.hue, next.tint, next.lightness, room.codeFormat);
    return {
      code: code.value,
      codeFormat: code.format,
      hue: next.hue,
      tint: next.tint,
      lightness: next.lightness,
    };
  }

  return {
    hue: next.hue,
    tint: next.tint,
    lightness: next.lightness,
  };
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
    mode: room.mode,
    codeFormat: room.codeFormat,
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
  room.target = createOnlineTarget(room);

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
    mode: room.mode,
    codeFormat: room.codeFormat,
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

app.get("/api/named-colors", (req, res) => {
  res.json({
    bases: NAMED_COLOR_BASES,
    variants: NAMED_COLOR_VARIANTS,
    difficulties: NAMED_COLOR_DIFFICULTIES,
  });
});

app.use(express.static(path.join(__dirname)));

io.on("connection", (socket) => {
  socket.on("create_room", ({ name, mode, codeFormat }) => {
    let roomCode = makeRoomCode();
    while (rooms.has(roomCode)) {
      roomCode = makeRoomCode();
    }

    const room = createRoomState(socket.id, name, mode, codeFormat);

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

    room.players.set(socket.id, createPlayerState(socket.id, name));

    socket.join(normalizedCode);
    socket.data.roomCode = normalizedCode;
    emitRoomState(normalizedCode);
  });

  socket.on("leave_room", () => {
    const roomCode = socket.data.roomCode;
    if (!roomCode) {
      return;
    }

    removeSocketFromRoom(socket, roomCode);
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

    resetRoomForMatch(room);

    io.to(roomCode).emit("match_started", { maxRounds: room.maxRounds });
    startRoomRound(roomCode);
  });

  socket.on("set_room_mode", ({ roomCode, mode, codeFormat }) => {
    const room = rooms.get(roomCode);
    if (!room) {
      return;
    }

    if (room.hostId !== socket.id) {
      socket.emit("error_message", "Seul le host peut changer le mode en ligne.");
      return;
    }

    if (room.matchActive) {
      socket.emit("error_message", "Le mode ne peut pas etre change pendant une partie.");
      return;
    }

    const normalizedMode = normalizeOnlineMode(mode);
    const normalizedCodeFormat = normalizeCodeFormat(codeFormat);

    room.mode = normalizedMode;
    room.codeFormat = normalizedMode === "code" ? normalizedCodeFormat : "auto";
    room.lastRandomTarget = null;
    room.lastNamedTarget = null;
    room.namedColorPool = normalizedMode === "name" ? buildNamedColorPool() : [];
    emitRoomState(roomCode);
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
