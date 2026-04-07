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

db.prepare(
  `CREATE TABLE IF NOT EXISTS user_sessions (
    token TEXT PRIMARY KEY,
    user_id INTEGER NOT NULL,
    username TEXT NOT NULL,
    created_at INTEGER NOT NULL,
    last_seen_at INTEGER NOT NULL,
    expires_at INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  )`,
).run();

db.prepare(
  `CREATE TABLE IF NOT EXISTS user_round_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    source TEXT NOT NULL,
    mode TEXT NOT NULL,
    room_code TEXT,
    round_number INTEGER,
    max_rounds INTEGER,
    score REAL NOT NULL,
    hue_diff REAL,
    tint_diff REAL,
    lightness_diff REAL,
    target_hue REAL,
    target_tint REAL,
    target_lightness REAL,
    guess_hue REAL,
    guess_tint REAL,
    guess_lightness REAL,
    label TEXT,
    created_at INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  )`,
).run();

db.prepare(
  `CREATE TABLE IF NOT EXISTS user_match_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    source TEXT NOT NULL,
    mode TEXT NOT NULL,
    room_code TEXT,
    rounds_played INTEGER NOT NULL,
    total_score REAL NOT NULL,
    best_round REAL NOT NULL,
    average_score REAL NOT NULL,
    created_at INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  )`,
).run();

db.prepare(
  `CREATE TABLE IF NOT EXISTS user_activity_log (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    event_type TEXT NOT NULL,
    metadata_json TEXT,
    created_at INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  )`,
).run();

db.prepare(
  `CREATE TABLE IF NOT EXISTS user_friends (
    user_id INTEGER NOT NULL,
    friend_user_id INTEGER NOT NULL,
    created_at INTEGER NOT NULL,
    PRIMARY KEY (user_id, friend_user_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (friend_user_id) REFERENCES users(id) ON DELETE CASCADE
  )`,
).run();

db.prepare(
  `CREATE TABLE IF NOT EXISTS user_friend_requests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    requester_user_id INTEGER NOT NULL,
    recipient_user_id INTEGER NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    created_at INTEGER NOT NULL,
    responded_at INTEGER,
    FOREIGN KEY (requester_user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (recipient_user_id) REFERENCES users(id) ON DELETE CASCADE
  )`,
).run();

db.prepare(
  `CREATE TABLE IF NOT EXISTS user_social_invites (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    from_user_id INTEGER NOT NULL,
    to_user_id INTEGER NOT NULL,
    room_code TEXT NOT NULL,
    message TEXT,
    status TEXT NOT NULL DEFAULT 'pending',
    created_at INTEGER NOT NULL,
    responded_at INTEGER,
    FOREIGN KEY (from_user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (to_user_id) REFERENCES users(id) ON DELETE CASCADE
  )`,
).run();

db.prepare(
  `CREATE TABLE IF NOT EXISTS user_direct_messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    from_user_id INTEGER NOT NULL,
    to_user_id INTEGER NOT NULL,
    message TEXT NOT NULL,
    created_at INTEGER NOT NULL,
    FOREIGN KEY (from_user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (to_user_id) REFERENCES users(id) ON DELETE CASCADE
  )`,
).run();

db.prepare(
  `CREATE TABLE IF NOT EXISTS user_dm_thread_state (
    user_id INTEGER NOT NULL,
    friend_user_id INTEGER NOT NULL,
    last_read_at INTEGER NOT NULL DEFAULT 0,
    PRIMARY KEY (user_id, friend_user_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (friend_user_id) REFERENCES users(id) ON DELETE CASCADE
  )`,
).run();

db.prepare("CREATE INDEX IF NOT EXISTS idx_round_history_user_created ON user_round_history (user_id, created_at DESC)").run();
db.prepare("CREATE INDEX IF NOT EXISTS idx_match_history_user_created ON user_match_history (user_id, created_at DESC)").run();
db.prepare("CREATE INDEX IF NOT EXISTS idx_activity_log_user_created ON user_activity_log (user_id, created_at DESC)").run();
db.prepare("CREATE INDEX IF NOT EXISTS idx_sessions_expires ON user_sessions (expires_at)").run();
db.prepare("CREATE INDEX IF NOT EXISTS idx_user_friends_friend ON user_friends (friend_user_id)").run();
db.prepare("CREATE INDEX IF NOT EXISTS idx_friend_requests_recipient ON user_friend_requests (recipient_user_id, status)").run();
db.prepare("CREATE INDEX IF NOT EXISTS idx_friend_requests_requester ON user_friend_requests (requester_user_id, status)").run();
db.prepare("CREATE INDEX IF NOT EXISTS idx_social_invites_to_user ON user_social_invites (to_user_id, status, created_at DESC)").run();
db.prepare("CREATE INDEX IF NOT EXISTS idx_social_invites_from_user ON user_social_invites (from_user_id, status, created_at DESC)").run();
db.prepare("CREATE INDEX IF NOT EXISTS idx_direct_messages_users ON user_direct_messages (from_user_id, to_user_id, created_at DESC)").run();
db.prepare("CREATE INDEX IF NOT EXISTS idx_dm_thread_state_user_friend ON user_dm_thread_state (user_id, friend_user_id)").run();

const authSessions = new Map();
const activeUsers = new Map();

const rooms = new Map();
const roomTimers = new Map();

const insertSessionStmt = db.prepare(
  `INSERT OR REPLACE INTO user_sessions
    (token, user_id, username, created_at, last_seen_at, expires_at)
   VALUES (?, ?, ?, ?, ?, ?)`,
);
const getSessionStmt = db.prepare(
  `SELECT token, user_id, username, created_at, last_seen_at, expires_at
   FROM user_sessions
   WHERE token = ?`,
);
const updateSessionActivityStmt = db.prepare(
  "UPDATE user_sessions SET last_seen_at = ?, expires_at = ? WHERE token = ?",
);
const deleteSessionStmt = db.prepare("DELETE FROM user_sessions WHERE token = ?");
const cleanupExpiredSessionsStmt = db.prepare("DELETE FROM user_sessions WHERE expires_at < ?");
const insertFriendStmt = db.prepare("INSERT OR IGNORE INTO user_friends (user_id, friend_user_id, created_at) VALUES (?, ?, ?)");
const areFriendsStmt = db.prepare("SELECT 1 AS existsFlag FROM user_friends WHERE user_id = ? AND friend_user_id = ?");
const getUserByUsernameNormStmt = db.prepare("SELECT id, username FROM users WHERE username_norm = ?");
const getPendingFriendRequestBetweenStmt = db.prepare(
  `SELECT id
   FROM user_friend_requests
   WHERE status = 'pending'
     AND ((requester_user_id = ? AND recipient_user_id = ?) OR (requester_user_id = ? AND recipient_user_id = ?))
   LIMIT 1`,
);
const insertFriendRequestStmt = db.prepare(
  `INSERT INTO user_friend_requests (requester_user_id, recipient_user_id, status, created_at)
   VALUES (?, ?, 'pending', ?)`,
);
const getIncomingFriendRequestStmt = db.prepare(
  `SELECT r.id, r.created_at AS createdAt, u.id AS userId, u.username
   FROM user_friend_requests r
   JOIN users u ON u.id = r.requester_user_id
   WHERE r.recipient_user_id = ? AND r.status = 'pending'
   ORDER BY r.created_at DESC`,
);
const getOutgoingFriendRequestStmt = db.prepare(
  `SELECT r.id, r.created_at AS createdAt, u.id AS userId, u.username
   FROM user_friend_requests r
   JOIN users u ON u.id = r.recipient_user_id
   WHERE r.requester_user_id = ? AND r.status = 'pending'
   ORDER BY r.created_at DESC`,
);
const getIncomingFriendRequestByIdStmt = db.prepare(
  `SELECT id, requester_user_id AS requesterUserId, recipient_user_id AS recipientUserId
   FROM user_friend_requests
   WHERE id = ? AND recipient_user_id = ? AND status = 'pending'`,
);
const updateFriendRequestStatusStmt = db.prepare(
  "UPDATE user_friend_requests SET status = ?, responded_at = ? WHERE id = ?",
);
const insertSocialInviteStmt = db.prepare(
  `INSERT INTO user_social_invites (from_user_id, to_user_id, room_code, message, status, created_at)
   VALUES (?, ?, ?, ?, 'pending', ?)`,
);
const getIncomingSocialInvitesStmt = db.prepare(
  `SELECT i.id, i.room_code AS roomCode, i.message, i.created_at AS createdAt,
          u.id AS fromUserId, u.username AS fromUsername
   FROM user_social_invites i
   JOIN users u ON u.id = i.from_user_id
   WHERE i.to_user_id = ? AND i.status = 'pending'
   ORDER BY i.created_at DESC
   LIMIT 30`,
);
const getOutgoingSocialInvitesStmt = db.prepare(
  `SELECT i.id, i.room_code AS roomCode, i.message, i.created_at AS createdAt,
          u.id AS toUserId, u.username AS toUsername
   FROM user_social_invites i
   JOIN users u ON u.id = i.to_user_id
   WHERE i.from_user_id = ? AND i.status = 'pending'
   ORDER BY i.created_at DESC
   LIMIT 30`,
);
const getIncomingSocialInviteByIdStmt = db.prepare(
  `SELECT id, from_user_id AS fromUserId, to_user_id AS toUserId
   FROM user_social_invites
   WHERE id = ? AND to_user_id = ? AND status = 'pending'`,
);
const updateSocialInviteStatusStmt = db.prepare(
  "UPDATE user_social_invites SET status = ?, responded_at = ? WHERE id = ?",
);
const insertDirectMessageStmt = db.prepare(
  `INSERT INTO user_direct_messages (from_user_id, to_user_id, message, created_at)
   VALUES (?, ?, ?, ?)`,
);
const getDirectMessagesBetweenStmt = db.prepare(
  `SELECT m.id, m.from_user_id AS fromUserId, m.to_user_id AS toUserId,
          m.message, m.created_at AS createdAt,
          uf.username AS fromUsername, ut.username AS toUsername
   FROM user_direct_messages m
   JOIN users uf ON uf.id = m.from_user_id
   JOIN users ut ON ut.id = m.to_user_id
   WHERE (m.from_user_id = ? AND m.to_user_id = ?) OR (m.from_user_id = ? AND m.to_user_id = ?)
   ORDER BY m.created_at DESC
   LIMIT 60`,
);
const getUnreadDirectMessagesByFriendStmt = db.prepare(
  `SELECT m.from_user_id AS friendUserId,
          COUNT(*) AS unreadCount
   FROM user_direct_messages m
   LEFT JOIN user_dm_thread_state t
     ON t.user_id = ? AND t.friend_user_id = m.from_user_id
   WHERE m.to_user_id = ?
     AND m.created_at > COALESCE(t.last_read_at, 0)
   GROUP BY m.from_user_id`,
);
const upsertThreadReadStateStmt = db.prepare(
  `INSERT INTO user_dm_thread_state (user_id, friend_user_id, last_read_at)
   VALUES (?, ?, ?)
   ON CONFLICT(user_id, friend_user_id)
   DO UPDATE SET last_read_at = excluded.last_read_at`,
);
const getFriendsStmt = db.prepare(
  `SELECT u.id, u.username,
          COALESCE(ROUND(AVG(h.score), 2), 0) AS averageScore,
          COALESCE(MAX(h.score), 0) AS bestRound,
          COUNT(h.id) AS rounds,
          MAX(s.last_seen_at) AS lastSeenAt
   FROM user_friends f
   JOIN users u ON u.id = f.friend_user_id
   LEFT JOIN user_round_history h ON h.user_id = u.id
   LEFT JOIN user_sessions s ON s.user_id = u.id
   WHERE f.user_id = ?
   GROUP BY u.id, u.username
   ORDER BY averageScore DESC, rounds DESC, u.username ASC`,
);

const insertActivityStmt = db.prepare(
  `INSERT INTO user_activity_log (user_id, event_type, metadata_json, created_at)
   VALUES (?, ?, ?, ?)`,
);
const insertRoundHistoryStmt = db.prepare(
  `INSERT INTO user_round_history (
    user_id, source, mode, room_code, round_number, max_rounds,
    score, hue_diff, tint_diff, lightness_diff,
    target_hue, target_tint, target_lightness,
    guess_hue, guess_tint, guess_lightness,
    label, created_at
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
);
const insertMatchHistoryStmt = db.prepare(
  `INSERT INTO user_match_history (
    user_id, source, mode, room_code, rounds_played,
    total_score, best_round, average_score, created_at
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
);

function createAuthSession(userId, username) {
  const token = crypto.randomUUID();
  const now = Date.now();
  insertSessionStmt.run(token, userId, username, now, now, now + AUTH_TTL_MS);
  authSessions.set(token, {
    userId,
    username,
    createdAt: now,
  });
  return token;
}

function touchSession(token) {
  const now = Date.now();
  updateSessionActivityStmt.run(now, now + AUTH_TTL_MS, token);
}

function deleteSession(token) {
  if (!token) {
    return;
  }
  authSessions.delete(token);
  deleteSessionStmt.run(token);
}

function getSessionFromRequest(req) {
  const cookies = parseCookies(req);
  const token = cookies[AUTH_COOKIE_NAME];
  if (!token) {
    return null;
  }

  const now = Date.now();
  const dbSession = getSessionStmt.get(token);
  if (!dbSession) {
    authSessions.delete(token);
    return null;
  }

  if (dbSession.expires_at < now) {
    deleteSession(token);
    return null;
  }

  touchSession(token);
  authSessions.set(token, {
    userId: dbSession.user_id,
    username: dbSession.username,
    createdAt: dbSession.created_at,
  });

  return {
    token,
    userId: dbSession.user_id,
    username: dbSession.username,
    createdAt: dbSession.created_at,
  };
}

function logUserActivity(userId, eventType, metadata = null) {
  if (!userId || !eventType) {
    return;
  }

  let serializedMetadata = null;
  if (metadata && typeof metadata === "object") {
    try {
      serializedMetadata = JSON.stringify(metadata);
    } catch {
      serializedMetadata = null;
    }
  }

  insertActivityStmt.run(userId, eventType, serializedMetadata, Date.now());
}

function markUserOnline(userId) {
  if (!userId) {
    return;
  }
  const current = activeUsers.get(userId) || 0;
  activeUsers.set(userId, current + 1);
}

function markUserOffline(userId) {
  if (!userId) {
    return;
  }
  const current = activeUsers.get(userId) || 0;
  if (current <= 1) {
    activeUsers.delete(userId);
    return;
  }
  activeUsers.set(userId, current - 1);
}

function isUserOnline(userId) {
  return (activeUsers.get(userId) || 0) > 0;
}

function getUserPresence(userId) {
  const presence = {
    isOnline: false,
    socketCount: 0,
    currentRoomCode: null,
    isInMatch: false,
  };

  for (const socket of io.sockets.sockets.values()) {
    if (socket?.data?.authUser?.userId !== userId) {
      continue;
    }

    presence.isOnline = true;
    presence.socketCount += 1;

    const roomCode = socket.data.roomCode;
    if (roomCode && !presence.currentRoomCode) {
      presence.currentRoomCode = roomCode;
      const room = rooms.get(roomCode);
      presence.isInMatch = !!room?.matchActive;
    }
  }

  return presence;
}

function areUsersFriends(userId, otherUserId) {
  if (!userId || !otherUserId) {
    return false;
  }
  return !!areFriendsStmt.get(userId, otherUserId);
}

function recordRoundHistory(userId, payload) {
  if (!userId || !payload) {
    return;
  }

  insertRoundHistoryStmt.run(
    userId,
    String(payload.source || "unknown"),
    String(payload.mode || "memory"),
    payload.roomCode || null,
    payload.roundNumber ?? null,
    payload.maxRounds ?? null,
    Number(payload.score || 0),
    payload.hueDiff ?? null,
    payload.tintDiff ?? null,
    payload.lightnessDiff ?? null,
    payload.target?.hue ?? null,
    payload.target?.tint ?? null,
    payload.target?.lightness ?? null,
    payload.guess?.hue ?? null,
    payload.guess?.tint ?? null,
    payload.guess?.lightness ?? null,
    payload.label || null,
    Date.now(),
  );
}

function recordMatchHistoryFromRounds(userId, source, mode, roomCode, rounds) {
  if (!userId || !Array.isArray(rounds) || rounds.length === 0) {
    return;
  }

  const normalizedScores = rounds.map((round) => Number(round.score || 0));
  const totalScore = normalizedScores.reduce((sum, value) => sum + value, 0);
  const bestRound = Math.max(...normalizedScores);
  const averageScore = totalScore / rounds.length;

  insertMatchHistoryStmt.run(
    userId,
    source,
    mode,
    roomCode || null,
    rounds.length,
    totalScore,
    bestRound,
    averageScore,
    Date.now(),
  );
}

function recordOnlineMatchHistoryForRoom(roomCode, room) {
  if (!roomCode || !room) {
    return;
  }

  for (const player of room.players.values()) {
    if (!player.userId) {
      continue;
    }

    const rounds = db.prepare(
      `SELECT score FROM user_round_history
       WHERE user_id = ? AND source = 'online' AND room_code = ?
       ORDER BY id DESC
       LIMIT ?`,
    ).all(player.userId, roomCode, room.maxRounds).reverse();

    if (rounds.length === 0) {
      continue;
    }

    recordMatchHistoryFromRounds(player.userId, "online", room.mode, roomCode, rounds);
    logUserActivity(player.userId, "online_match_finished", {
      roomCode,
      mode: room.mode,
      rounds: rounds.length,
    });
  }
}

function normalizeOnlineMode(mode) {
  return VALID_ONLINE_MODES.has(mode) ? mode : "memory";
}

function normalizeCodeFormat(codeFormat) {
  return VALID_CODE_FORMATS.has(codeFormat) ? codeFormat : "auto";
}

function createPlayerState(socketId, name, userId = null) {
  return {
    id: socketId,
    userId,
    name: (name || "Joueur").slice(0, 20),
    submitted: false,
    lastScore: 0,
    totalScore: 0,
    currentGuess: null,
    currentResult: null,
  };
}

function createRoomState(socketId, name, mode, codeFormat, userId = null) {
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
    chatMessages: [],
    players: new Map([[socketId, createPlayerState(socketId, name, userId)]]),
  };
}

function addRoomChatMessage(room, playerName, message) {
  const text = String(message || "").trim().slice(0, 220);
  if (!text) {
    return null;
  }

  const entry = {
    id: crypto.randomUUID(),
    name: String(playerName || "Joueur").slice(0, 20),
    message: text,
    at: Date.now(),
  };

  room.chatMessages.push(entry);
  if (room.chatMessages.length > 60) {
    room.chatMessages.splice(0, room.chatMessages.length - 60);
  }

  return entry;
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
    totalScore: Number(player.totalScore || 0),
    lastScore: Number(player.lastScore || 0),
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
    recentChat: room.chatMessages.slice(-30),
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
    recordOnlineMatchHistoryForRoom(roomCode, room);
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

app.use((req, res, next) => {
  cleanupExpiredSessionsStmt.run(Date.now());
  next();
});

function requireAuth(req, res, next) {
  const session = getSessionFromRequest(req);
  if (!session) {
    res.status(401).json({ ok: false, message: "Authentification requise." });
    return;
  }

  req.authSession = session;
  next();
}

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

  const userId = Number(result.lastInsertRowid);
  const token = createAuthSession(userId, username);

  logUserActivity(userId, "register", {
    username,
  });

  setAuthCookie(res, token);
  res.json({ ok: true, user: { id: userId, username } });
});

app.post("/api/auth/login", (req, res) => {
  const username = String(req.body?.username || "").trim();
  const password = String(req.body?.password || "");
  const user = db.prepare("SELECT id, username, password_hash FROM users WHERE username_norm = ?").get(username.toLowerCase());

  if (!user || !verifyPassword(password, user.password_hash)) {
    res.status(401).json({ ok: false, message: "Identifiants invalides." });
    return;
  }

  const token = createAuthSession(user.id, user.username);

  logUserActivity(user.id, "login", {
    username: user.username,
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
    logUserActivity(session.userId, "logout", null);
    deleteSession(session.token);
  }
  clearAuthCookie(res);
  res.json({ ok: true });
});

app.get("/api/friends", requireAuth, (req, res) => {
  const { userId } = req.authSession;
  const unreadRows = getUnreadDirectMessagesByFriendStmt.all(userId, userId);
  const unreadByFriend = new Map(unreadRows.map((row) => [Number(row.friendUserId), Number(row.unreadCount || 0)]));

  const friends = getFriendsStmt.all(userId).map((friend) => {
    const presence = getUserPresence(Number(friend.id));
    return {
      id: friend.id,
      username: friend.username,
      rounds: Number(friend.rounds || 0),
      averageScore: Number(friend.averageScore || 0),
      bestRound: Number(friend.bestRound || 0),
      isOnline: presence.isOnline,
      currentRoomCode: presence.currentRoomCode,
      isInMatch: presence.isInMatch,
      unreadCount: Number(unreadByFriend.get(Number(friend.id)) || 0),
      lastSeenAt: Number(friend.lastSeenAt || 0),
    };
  });

  const incomingRequests = getIncomingFriendRequestStmt.all(userId).map((request) => ({
    id: Number(request.id),
    userId: Number(request.userId),
    username: request.username,
    createdAt: Number(request.createdAt),
  }));

  const outgoingRequests = getOutgoingFriendRequestStmt.all(userId).map((request) => ({
    id: Number(request.id),
    userId: Number(request.userId),
    username: request.username,
    createdAt: Number(request.createdAt),
  }));

  res.json({ ok: true, friends, incomingRequests, outgoingRequests });
});

app.post("/api/friends/add", requireAuth, (req, res) => {
  const { userId } = req.authSession;
  const username = String(req.body?.username || "").trim();

  if (!username || username.length < 3) {
    res.status(400).json({ ok: false, message: "Pseudo ami invalide." });
    return;
  }

  const friend = getUserByUsernameNormStmt.get(username.toLowerCase());
  if (!friend) {
    res.status(404).json({ ok: false, message: "Utilisateur introuvable." });
    return;
  }

  if (Number(friend.id) === Number(userId)) {
    res.status(400).json({ ok: false, message: "Tu ne peux pas t'ajouter toi-meme." });
    return;
  }

  if (areFriendsStmt.get(userId, friend.id)) {
    res.status(409).json({ ok: false, message: "Cet utilisateur est deja dans tes amis." });
    return;
  }

  if (getPendingFriendRequestBetweenStmt.get(userId, friend.id, friend.id, userId)) {
    res.status(409).json({ ok: false, message: "Une demande est deja en attente entre vous." });
    return;
  }

  const now = Date.now();
  insertFriendRequestStmt.run(userId, friend.id, now);

  logUserActivity(userId, "friend_request_sent", {
    friendUserId: friend.id,
    friendUsername: friend.username,
  });

  res.json({ ok: true, request: { toUserId: friend.id, toUsername: friend.username } });
});

app.post("/api/friends/respond", requireAuth, (req, res) => {
  const { userId } = req.authSession;
  const requestId = Number(req.body?.requestId || 0);
  const action = String(req.body?.action || "").trim().toLowerCase();

  if (!requestId || !["accept", "decline"].includes(action)) {
    res.status(400).json({ ok: false, message: "Reponse de demande invalide." });
    return;
  }

  const request = getIncomingFriendRequestByIdStmt.get(requestId, userId);
  if (!request) {
    res.status(404).json({ ok: false, message: "Demande introuvable ou deja traitee." });
    return;
  }

  const now = Date.now();
  if (action === "accept") {
    insertFriendStmt.run(request.requesterUserId, request.recipientUserId, now);
    insertFriendStmt.run(request.recipientUserId, request.requesterUserId, now);
  }

  updateFriendRequestStatusStmt.run(action === "accept" ? "accepted" : "declined", now, requestId);

  logUserActivity(userId, action === "accept" ? "friend_request_accepted" : "friend_request_declined", {
    requestId,
    requesterUserId: request.requesterUserId,
  });

  res.json({ ok: true });
});

app.get("/api/social/invites", requireAuth, (req, res) => {
  const { userId } = req.authSession;
  const incomingInvites = getIncomingSocialInvitesStmt.all(userId).map((invite) => ({
    id: Number(invite.id),
    roomCode: String(invite.roomCode || "").toUpperCase(),
    message: invite.message || "",
    createdAt: Number(invite.createdAt),
    fromUserId: Number(invite.fromUserId),
    fromUsername: invite.fromUsername,
  }));

  const outgoingInvites = getOutgoingSocialInvitesStmt.all(userId).map((invite) => ({
    id: Number(invite.id),
    roomCode: String(invite.roomCode || "").toUpperCase(),
    message: invite.message || "",
    createdAt: Number(invite.createdAt),
    toUserId: Number(invite.toUserId),
    toUsername: invite.toUsername,
  }));

  res.json({ ok: true, incomingInvites, outgoingInvites });
});

app.post("/api/social/invite", requireAuth, (req, res) => {
  const { userId } = req.authSession;
  const friendUserId = Number(req.body?.friendUserId || 0);
  const roomCode = String(req.body?.roomCode || "").trim().toUpperCase();
  const message = String(req.body?.message || "").trim().slice(0, 180);

  if (!friendUserId || !roomCode) {
    res.status(400).json({ ok: false, message: "Invitation invalide." });
    return;
  }

  if (!areUsersFriends(userId, friendUserId)) {
    res.status(403).json({ ok: false, message: "Tu peux inviter uniquement tes amis." });
    return;
  }

  const now = Date.now();
  insertSocialInviteStmt.run(userId, friendUserId, roomCode, message || null, now);

  logUserActivity(userId, "social_invite_sent", {
    friendUserId,
    roomCode,
  });

  res.json({ ok: true });
});

app.post("/api/social/invites/respond", requireAuth, (req, res) => {
  const { userId } = req.authSession;
  const inviteId = Number(req.body?.inviteId || 0);
  const action = String(req.body?.action || "").trim().toLowerCase();

  if (!inviteId || !["accept", "decline"].includes(action)) {
    res.status(400).json({ ok: false, message: "Action invitation invalide." });
    return;
  }

  const invite = getIncomingSocialInviteByIdStmt.get(inviteId, userId);
  if (!invite) {
    res.status(404).json({ ok: false, message: "Invitation introuvable ou deja traitee." });
    return;
  }

  updateSocialInviteStatusStmt.run(action === "accept" ? "accepted" : "declined", Date.now(), inviteId);

  logUserActivity(userId, action === "accept" ? "social_invite_accepted" : "social_invite_declined", {
    inviteId,
    fromUserId: invite.fromUserId,
  });

  res.json({ ok: true });
});

app.get("/api/social/messages/:friendUserId", requireAuth, (req, res) => {
  const { userId } = req.authSession;
  const friendUserId = Number(req.params.friendUserId || 0);

  if (!friendUserId) {
    res.status(400).json({ ok: false, message: "Conversation invalide." });
    return;
  }

  if (!areUsersFriends(userId, friendUserId)) {
    res.status(403).json({ ok: false, message: "Cette conversation n'est pas autorisee." });
    return;
  }

  const messages = getDirectMessagesBetweenStmt
    .all(userId, friendUserId, friendUserId, userId)
    .reverse()
    .map((entry) => ({
      id: Number(entry.id),
      fromUserId: Number(entry.fromUserId),
      toUserId: Number(entry.toUserId),
      fromUsername: entry.fromUsername,
      toUsername: entry.toUsername,
      message: entry.message,
      createdAt: Number(entry.createdAt),
      isMine: Number(entry.fromUserId) === Number(userId),
    }));

  upsertThreadReadStateStmt.run(userId, friendUserId, Date.now());

  res.json({ ok: true, messages });
});

app.post("/api/social/message", requireAuth, (req, res) => {
  const { userId } = req.authSession;
  const friendUserId = Number(req.body?.friendUserId || 0);
  const message = String(req.body?.message || "").trim().slice(0, 260);

  if (!friendUserId || !message) {
    res.status(400).json({ ok: false, message: "Message invalide." });
    return;
  }

  if (!areUsersFriends(userId, friendUserId)) {
    res.status(403).json({ ok: false, message: "Tu peux ecrire uniquement a tes amis." });
    return;
  }

  insertDirectMessageStmt.run(userId, friendUserId, message, Date.now());
  logUserActivity(userId, "direct_message_sent", {
    friendUserId,
  });

  res.json({ ok: true });
});

app.get("/api/users/me/tracking", requireAuth, (req, res) => {
  const { userId } = req.authSession;

  const stats = db.prepare(
    `SELECT
      COUNT(*) AS rounds,
      COALESCE(SUM(score), 0) AS totalScore,
      COALESCE(MAX(score), 0) AS bestRound,
      COALESCE(AVG(score), 0) AS averageScore,
      COALESCE(SUM(CASE WHEN source = 'solo' THEN 1 ELSE 0 END), 0) AS soloRounds,
      COALESCE(SUM(CASE WHEN source = 'online' THEN 1 ELSE 0 END), 0) AS onlineRounds
     FROM user_round_history
     WHERE user_id = ?`,
  ).get(userId);

  const matches = db.prepare(
    `SELECT source, mode, room_code AS roomCode, rounds_played AS roundsPlayed,
            total_score AS totalScore, best_round AS bestRound,
            average_score AS averageScore, created_at AS createdAt
     FROM user_match_history
     WHERE user_id = ?
     ORDER BY created_at DESC
     LIMIT 15`,
  ).all(userId);

  const rounds = db.prepare(
    `SELECT source, mode, room_code AS roomCode, round_number AS roundNumber,
            max_rounds AS maxRounds, score, hue_diff AS hueDiff,
            tint_diff AS tintDiff, lightness_diff AS lightnessDiff,
            label, created_at AS createdAt
     FROM user_round_history
     WHERE user_id = ?
     ORDER BY created_at DESC
     LIMIT 30`,
  ).all(userId);

  const activity = db.prepare(
    `SELECT event_type AS eventType, metadata_json AS metadataJson, created_at AS createdAt
     FROM user_activity_log
     WHERE user_id = ?
     ORDER BY created_at DESC
     LIMIT 40`,
  ).all(userId)
    .map((entry) => {
      let metadata = null;
      if (entry.metadataJson) {
        try {
          metadata = JSON.parse(entry.metadataJson);
        } catch {
          metadata = null;
        }
      }
      return {
        eventType: entry.eventType,
        metadata,
        createdAt: entry.createdAt,
      };
    });

  const global = db.prepare(
    `SELECT u.username,
            ROUND(AVG(h.score), 2) AS averageScore,
            COUNT(*) AS rounds
     FROM user_round_history h
     JOIN users u ON u.id = h.user_id
     GROUP BY h.user_id
     HAVING COUNT(*) >= 3
     ORDER BY averageScore DESC, rounds DESC
     LIMIT 20`,
  ).all();

  res.json({
    ok: true,
    stats: {
      rounds: Number(stats.rounds || 0),
      totalScore: Number(stats.totalScore || 0),
      bestRound: Number(stats.bestRound || 0),
      averageScore: Number(stats.averageScore || 0),
      soloRounds: Number(stats.soloRounds || 0),
      onlineRounds: Number(stats.onlineRounds || 0),
      matches: matches.length,
    },
    matches,
    rounds,
    activity,
    global,
  });
});

app.post("/api/tracking/solo-round", requireAuth, (req, res) => {
  const mode = String(req.body?.mode || "memory");
  const roundNumber = Number(req.body?.roundNumber || 0);
  const maxRounds = Number(req.body?.maxRounds || MATCH_ROUNDS);
  const score = Number(req.body?.score || 0);

  if (!Number.isFinite(score) || score < 0 || score > 100) {
    res.status(400).json({ ok: false, message: "Score invalide." });
    return;
  }

  recordRoundHistory(req.authSession.userId, {
    source: "solo",
    mode,
    roomCode: null,
    roundNumber,
    maxRounds,
    score,
    hueDiff: Number(req.body?.hueDiff || 0),
    tintDiff: Number(req.body?.tintDiff || 0),
    lightnessDiff: Number(req.body?.lightnessDiff || 0),
    target: req.body?.target || null,
    guess: req.body?.guess || null,
    label: req.body?.label || null,
  });

  logUserActivity(req.authSession.userId, "solo_round_submitted", {
    roundNumber,
    maxRounds,
    score,
    mode,
  });

  if (roundNumber >= maxRounds) {
    const rounds = db.prepare(
      `SELECT score FROM user_round_history
       WHERE user_id = ? AND source = 'solo'
       ORDER BY id DESC
       LIMIT ?`,
    ).all(req.authSession.userId, maxRounds).reverse();

    if (rounds.length > 0) {
      recordMatchHistoryFromRounds(req.authSession.userId, "solo", mode, null, rounds);
      logUserActivity(req.authSession.userId, "solo_match_finished", {
        rounds: rounds.length,
        mode,
      });
    }
  }

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
  const socketCookies = parseCookies({ headers: socket.handshake.headers || {} });
  const socketToken = socketCookies[AUTH_COOKIE_NAME];
  const socketSession = socketToken ? getSessionStmt.get(socketToken) : null;
  if (socketSession && socketSession.expires_at >= Date.now()) {
    socket.data.authUser = {
      userId: socketSession.user_id,
      username: socketSession.username,
    };
    markUserOnline(socketSession.user_id);
    touchSession(socketToken);
  } else {
    socket.data.authUser = null;
  }

  socket.on("create_room", ({ name, mode, codeFormat }) => {
    const previousRoomCode = socket.data.roomCode;
    if (previousRoomCode) {
      removeSocketFromRoom(socket, previousRoomCode);
    }

    let roomCode = makeRoomCode();
    while (rooms.has(roomCode)) {
      roomCode = makeRoomCode();
    }

    const room = createRoomState(socket.id, name, mode, codeFormat, socket.data.authUser?.userId || null);

    rooms.set(roomCode, room);
    socket.join(roomCode);
    socket.data.roomCode = roomCode;
    if (socket.data.authUser?.userId) {
      logUserActivity(socket.data.authUser.userId, "create_room", {
        roomCode,
        mode: room.mode,
      });
    }
    emitRoomState(roomCode);
  });

  socket.on("join_room", ({ roomCode, name }) => {
    const normalizedCode = String(roomCode || "").trim().toUpperCase();
    if (!normalizedCode) {
      socket.emit("error_message", "Code salon invalide.");
      return;
    }

    if (socket.data.roomCode === normalizedCode) {
      emitRoomState(normalizedCode);
      return;
    }

    const room = rooms.get(normalizedCode);
    if (!room) {
      socket.emit("error_message", "Salon introuvable.");
      return;
    }

    const previousRoomCode = socket.data.roomCode;
    if (previousRoomCode) {
      removeSocketFromRoom(socket, previousRoomCode);
    }

    room.players.set(socket.id, createPlayerState(socket.id, name, socket.data.authUser?.userId || null));

    socket.join(normalizedCode);
    socket.data.roomCode = normalizedCode;
    if (socket.data.authUser?.userId) {
      logUserActivity(socket.data.authUser.userId, "join_room", {
        roomCode: normalizedCode,
      });
    }
    emitRoomState(normalizedCode);
  });

  socket.on("leave_room", () => {
    const roomCode = socket.data.roomCode;
    if (!roomCode) {
      return;
    }

    if (socket.data.authUser?.userId) {
      logUserActivity(socket.data.authUser.userId, "leave_room", {
        roomCode,
      });
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

    if (player.userId) {
      recordRoundHistory(player.userId, {
        source: "online",
        mode: room.mode,
        roomCode,
        roundNumber: room.roundNumber,
        maxRounds: room.maxRounds,
        score: scoreData.score,
        hueDiff: scoreData.hueDiff,
        tintDiff: scoreData.tintDiff,
        lightnessDiff: scoreData.lightnessDiff,
        target: room.target,
        guess,
        label: room.target?.name || room.target?.code || null,
      });
    }

    emitRoomState(roomCode);
    tryCloseRound(roomCode);
  });

  socket.on("chat_message", ({ roomCode, message }) => {
    const normalizedCode = String(roomCode || "").trim().toUpperCase();
    const room = rooms.get(normalizedCode);
    if (!room) {
      return;
    }

    const player = room.players.get(socket.id);
    if (!player) {
      return;
    }

    const entry = addRoomChatMessage(room, player.name, message);
    if (!entry) {
      return;
    }

    io.to(normalizedCode).emit("room_chat_message", entry);
  });

  socket.on("disconnect", () => {
    if (socket.data.authUser?.userId) {
      markUserOffline(socket.data.authUser.userId);
    }

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
