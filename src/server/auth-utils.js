const crypto = require("crypto");
const { AUTH_COOKIE_NAME, AUTH_TTL_MS } = require("./constants");

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

function getSessionFromRequest(req, authSessions) {
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

module.exports = {
  hashPassword,
  verifyPassword,
  parseCookies,
  setAuthCookie,
  clearAuthCookie,
  getSessionFromRequest,
};
