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

const NAMED_COLOR_BASES = [
  { name: "Corail", hue: 16, tint: 86 },
  { name: "Saphir", hue: 217, tint: 82 },
  { name: "Menthe", hue: 156, tint: 64 },
  { name: "Miel", hue: 43, tint: 92 },
  { name: "Violet", hue: 275, tint: 70 },
  { name: "Lagune", hue: 190, tint: 75 },
  { name: "Pistache", hue: 94, tint: 68 },
  { name: "Rubis", hue: 352, tint: 76 },
  { name: "Amande", hue: 78, tint: 48 },
  { name: "Tangerine", hue: 28, tint: 92 },
  { name: "Indigo", hue: 239, tint: 64 },
  { name: "Turquoise", hue: 175, tint: 72 },
  { name: "Cramoisi", hue: 348, tint: 73 },
  { name: "Cerise", hue: 356, tint: 82 },
  { name: "Framboise", hue: 337, tint: 78 },
  { name: "Bordeaux", hue: 344, tint: 56 },
  { name: "Magenta", hue: 320, tint: 84 },
  { name: "Fuchsia", hue: 309, tint: 79 },
  { name: "Prune", hue: 291, tint: 53 },
  { name: "Amethyste", hue: 278, tint: 68 },
  { name: "Lavande", hue: 263, tint: 58 },
  { name: "Mauve", hue: 284, tint: 45 },
  { name: "Ultramarine", hue: 231, tint: 82 },
  { name: "Cobalt", hue: 223, tint: 74 },
  { name: "Bleu acier", hue: 208, tint: 46 },
  { name: "Bleu glacier", hue: 199, tint: 62 },
  { name: "Azur", hue: 204, tint: 92 },
  { name: "Ocean", hue: 197, tint: 68 },
  { name: "Petrole", hue: 188, tint: 57 },
  { name: "Canard", hue: 181, tint: 49 },
  { name: "Emeraude", hue: 147, tint: 74 },
  { name: "Jade", hue: 141, tint: 58 },
  { name: "Foret", hue: 123, tint: 52 },
  { name: "Sauge", hue: 112, tint: 34 },
  { name: "Olive", hue: 83, tint: 45 },
  { name: "Citron vert", hue: 96, tint: 78 },
  { name: "Citron", hue: 58, tint: 84 },
  { name: "Or", hue: 48, tint: 86 },
  { name: "Ocre", hue: 39, tint: 61 },
  { name: "Ambre", hue: 35, tint: 88 },
  { name: "Caramel", hue: 26, tint: 59 },
  { name: "Cuivre", hue: 22, tint: 66 },
  { name: "Terracotta", hue: 15, tint: 58 },
  { name: "Saumon", hue: 8, tint: 78 },
  { name: "Poudre", hue: 350, tint: 38 },
  { name: "Peche", hue: 23, tint: 80 },
  { name: "Rose pastel", hue: 333, tint: 47 },
  { name: "Rose vif", hue: 343, tint: 88 },
  { name: "Sable", hue: 36, tint: 32 },
  { name: "Beige", hue: 41, tint: 28 },
  { name: "Ivoire", hue: 52, tint: 24 },
  { name: "Ardoise", hue: 216, tint: 18 },
  { name: "Graphite", hue: 225, tint: 10 },
  { name: "Brume", hue: 206, tint: 16 },
  { name: "Perle", hue: 198, tint: 20 },
];

const NAMED_COLOR_VARIANTS = [
  { id: "base", label: "", hueOffset: 0, tintOffset: 0 },
  { id: "clair", label: " clair", hueOffset: 2, tintOffset: -12 },
  { id: "profond", label: " profond", hueOffset: -2, tintOffset: 10 },
  { id: "vif", label: " vif", hueOffset: 0, tintOffset: 14 },
  { id: "fume", label: " fume", hueOffset: -4, tintOffset: -16 },
];

const CODE_FORMATS = {
  auto: "Auto",
  hex: "HEX",
  rgb: "RGB",
  hsl: "HSL",
};

const ONLINE_MODE_LABELS = {
  memory: "Mémoire",
  name: "Nom couleur",
  code: "Mode code",
};

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

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function wrapHue(value) {
  const wrapped = value % 360;
  return wrapped < 0 ? wrapped + 360 : wrapped;
}

function hsl(h, s, l) {
  return `hsl(${h}, ${s}%, ${l}%)`;
}

function hslToRgb(h, s, l) {
  const hue = ((h % 360) + 360) % 360;
  const sat = clamp(s, 0, 100) / 100;
  const lig = clamp(l, 0, 100) / 100;

  const c = (1 - Math.abs((2 * lig) - 1)) * sat;
  const hh = hue / 60;
  const x = c * (1 - Math.abs((hh % 2) - 1));

  let r1 = 0;
  let g1 = 0;
  let b1 = 0;

  if (hh >= 0 && hh < 1) {
    r1 = c;
    g1 = x;
  } else if (hh < 2) {
    r1 = x;
    g1 = c;
  } else if (hh < 3) {
    g1 = c;
    b1 = x;
  } else if (hh < 4) {
    g1 = x;
    b1 = c;
  } else if (hh < 5) {
    r1 = x;
    b1 = c;
  } else {
    r1 = c;
    b1 = x;
  }

  const m = lig - (c / 2);
  return {
    r: Math.round((r1 + m) * 255),
    g: Math.round((g1 + m) * 255),
    b: Math.round((b1 + m) * 255),
  };
}

function rgbToHex({ r, g, b }) {
  const toHex = (n) => clamp(Math.round(n), 0, 255).toString(16).padStart(2, "0").toUpperCase();
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function rgbToHsl(r, g, b) {
  const rr = clamp(r, 0, 255) / 255;
  const gg = clamp(g, 0, 255) / 255;
  const bb = clamp(b, 0, 255) / 255;

  const max = Math.max(rr, gg, bb);
  const min = Math.min(rr, gg, bb);
  const delta = max - min;

  let h = 0;
  if (delta !== 0) {
    if (max === rr) {
      h = 60 * (((gg - bb) / delta) % 6);
    } else if (max === gg) {
      h = 60 * (((bb - rr) / delta) + 2);
    } else {
      h = 60 * (((rr - gg) / delta) + 4);
    }
  }
  if (h < 0) {
    h += 360;
  }

  const l = (max + min) / 2;
  const s = delta === 0 ? 0 : delta / (1 - Math.abs((2 * l) - 1));

  return {
    h: Math.round(h),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

function hslDistance(target, guess) {
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

function shuffleArray(items) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = randomInt(0, i);
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
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

function getColorCodeLabel(hue, tint, lightness = 50, format = "auto") {
  const rgb = hslToRgb(hue, tint, lightness);
  const selectedFormat = format === "auto"
    ? ["hex", "rgb", "hsl"][randomInt(0, 2)]
    : format;

  if (selectedFormat === "hex") {
    return { format: "HEX", value: rgbToHex(rgb) };
  }

  if (selectedFormat === "hsl") {
    return {
      format: "HSL",
      value: `hsl(${Math.round(hue)}, ${Math.round(tint)}%, ${Math.round(lightness)}%)`,
    };
  }

  return {
    format: "RGB",
    value: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,
  };
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
  const DIFFICULTY_VARIANTS = {
    easy: ["base"],
    normal: ["base", "clair", "profond"],
    expert: ["base", "clair", "profond", "vif", "fume"],
  };
  
  res.json({
    bases: NAMED_COLOR_BASES,
    variants: NAMED_COLOR_VARIANTS,
    difficulties: DIFFICULTY_VARIANTS,
  });
});

app.use(express.static(path.join(__dirname)));

io.on("connection", (socket) => {
  socket.on("create_room", ({ name, mode, codeFormat }) => {
    let roomCode = makeRoomCode();
    while (rooms.has(roomCode)) {
      roomCode = makeRoomCode();
    }

    const normalizedMode = ["memory", "name", "code"].includes(mode) ? mode : "memory";
    const normalizedCodeFormat = ["auto", "hex", "rgb", "hsl"].includes(codeFormat) ? codeFormat : "auto";

    const room = {
      hostId: socket.id,
      phase: "idle",
      target: null,
      lastRandomTarget: null,
      lastNamedTarget: null,
      matchActive: false,
      roundNumber: 0,
      maxRounds: MATCH_ROUNDS,
      mode: normalizedMode,
      codeFormat: normalizedCodeFormat,
      namedColorPool: normalizedMode === "name" ? buildNamedColorPool() : [],
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

  socket.on("leave_room", () => {
    const roomCode = socket.data.roomCode;
    if (!roomCode) {
      return;
    }

    const room = rooms.get(roomCode);
    if (!room) {
      socket.data.roomCode = null;
      return;
    }

    room.players.delete(socket.id);
    socket.leave(roomCode);
    socket.data.roomCode = null;

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
    room.lastNamedTarget = null;

    if (room.mode === "name") {
      refillNamedColorPool(room);
    }

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

    const normalizedMode = ["memory", "name", "code"].includes(mode) ? mode : "memory";
    const normalizedCodeFormat = ["auto", "hex", "rgb", "hsl"].includes(codeFormat) ? codeFormat : "auto";

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
