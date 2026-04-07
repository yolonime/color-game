const SHOW_DURATION_SECONDS = 5;
const FIXED_LIGHTNESS = 50;
const MATCH_ROUNDS = 5;
const NEXT_ROUND_DELAY_MS = 1400;
const ONLINE_MODE_LABELS = window.ColorGuesser?.Constants?.ONLINE_MODE_LABELS || {
  memory: "Mémoire",
  name: "Nom couleur",
  code: "Mode code",
};

const stageColor = document.getElementById("stageColor");
const stageOverlay = document.getElementById("stageOverlay");
const countdown = document.getElementById("countdown");

const hueSlider = document.getElementById("hueSlider");
const tintSlider = document.getElementById("tintSlider");
const lightnessSlider = document.getElementById("lightnessSlider");
const hueValue = document.getElementById("hueValue");
const tintValue = document.getElementById("tintValue");
const lightnessValue = document.getElementById("lightnessValue");
const hueImpactBar = document.getElementById("hueImpactBar");
const tintImpactBar = document.getElementById("tintImpactBar");
const lightnessImpactBar = document.getElementById("lightnessImpactBar");
const playerPreview = document.getElementById("playerPreview");
const guessCodeSection = document.getElementById("guessCodeSection");
const guessCodeInput = document.getElementById("guessCodeInput");
const guessCodeHint = document.getElementById("guessCodeHint");
const submitBtn = document.getElementById("submitBtn");

const modeEyebrow = document.getElementById("modeEyebrow");
const heroSubtitle = document.getElementById("heroSubtitle");
const heroCtaTitle = document.getElementById("heroCtaTitle");
const heroCtaSubtitle = document.getElementById("heroCtaSubtitle");
const brandTitle = document.getElementById("brandTitle");
const gameSection = document.getElementById("gameSection");
const converterSection = document.getElementById("converterSection");

const result = document.getElementById("result");
const colorNameText = document.getElementById("colorNameText");
const scoreText = document.getElementById("scoreText");
const roundHistoryList = document.getElementById("roundHistoryList");
const targetLabel = document.getElementById("targetLabel");
const guessLabel = document.getElementById("guessLabel");
const targetSwatch = document.getElementById("targetSwatch");
const guessSwatch = document.getElementById("guessSwatch");
const detailText = document.getElementById("detailText");

const soloModeBtn = document.getElementById("soloModeBtn");
const nameModeBtn = document.getElementById("nameModeBtn");
const codeModeBtn = document.getElementById("codeModeBtn");
const onlineModeBtn = document.getElementById("onlineModeBtn");
const onlinePanel = document.getElementById("onlinePanel");

const burgerBtn = document.getElementById("burgerBtn");
const trophyBtn = document.getElementById("trophyBtn");
const socialBtn = document.getElementById("socialBtn");
const socialBadge = document.getElementById("socialBadge");
const quickStartBtn = document.getElementById("quickStartBtn");
const nameDifficultyChip = document.getElementById("nameDifficultyChip");
const codeFormatChip = document.getElementById("codeFormatChip");
const onlineModeChip = document.getElementById("onlineModeChip");
const heroOnlinePanel = document.getElementById("heroOnlinePanel");
const heroOnlineStatus = document.getElementById("heroOnlineStatus");
const heroOpenOnlinePanelBtn = document.getElementById("heroOpenOnlinePanelBtn");
const heroCopyRoomCodeBtn = document.getElementById("heroCopyRoomCodeBtn");
const menuBackdrop = document.getElementById("menuBackdrop");
const menuDrawer = document.getElementById("menuDrawer");
const menuCloseBtn = document.getElementById("menuCloseBtn");
const menuStartOnlineMatchBtn = document.getElementById("menuStartOnlineMatchBtn");
const scoreBackdrop = document.getElementById("scoreBackdrop");
const scoreDrawer = document.getElementById("scoreDrawer");
const scoreCloseBtn = document.getElementById("scoreCloseBtn");
const scoreTabPersoBtn = document.getElementById("scoreTabPersoBtn");
const scoreTabGlobalBtn = document.getElementById("scoreTabGlobalBtn");
const scoreTabHistoryBtn = document.getElementById("scoreTabHistoryBtn");
const scorePagePerso = document.getElementById("scorePagePerso");
const scorePageGlobal = document.getElementById("scorePageGlobal");
const scorePageHistory = document.getElementById("scorePageHistory");
const socialBackdrop = document.getElementById("socialBackdrop");
const socialDrawer = document.getElementById("socialDrawer");
const socialCloseBtn = document.getElementById("socialCloseBtn");
const socialPage = document.getElementById("socialPage");

const nameDifficultySection = document.getElementById("nameDifficultySection");
const difficultyEasyBtn = document.getElementById("difficultyEasyBtn");
const difficultyNormalBtn = document.getElementById("difficultyNormalBtn");
const difficultyExpertBtn = document.getElementById("difficultyExpertBtn");
const codeFormatSection = document.getElementById("codeFormatSection");
const codeFormatAutoBtn = document.getElementById("codeFormatAutoBtn");
const codeFormatHexBtn = document.getElementById("codeFormatHexBtn");
const codeFormatRgbBtn = document.getElementById("codeFormatRgbBtn");
const codeFormatHslBtn = document.getElementById("codeFormatHslBtn");
const onlineMemoryModeBtn = document.getElementById("onlineMemoryModeBtn");
const onlineNameModeBtn = document.getElementById("onlineNameModeBtn");
const onlineCodeModeBtn = document.getElementById("onlineCodeModeBtn");
const onlineCodeFormatSection = document.getElementById("onlineCodeFormatSection");
const onlineCodeFormatAutoBtn = document.getElementById("onlineCodeFormatAutoBtn");
const onlineCodeFormatHexBtn = document.getElementById("onlineCodeFormatHexBtn");
const onlineCodeFormatRgbBtn = document.getElementById("onlineCodeFormatRgbBtn");
const onlineCodeFormatHslBtn = document.getElementById("onlineCodeFormatHslBtn");
const codeFormatInlineSection = document.getElementById("codeFormatInlineSection");
const inlineCodeFormatAutoBtn = document.getElementById("inlineCodeFormatAutoBtn");
const inlineCodeFormatHexBtn = document.getElementById("inlineCodeFormatHexBtn");
const inlineCodeFormatRgbBtn = document.getElementById("inlineCodeFormatRgbBtn");
const inlineCodeFormatHslBtn = document.getElementById("inlineCodeFormatHslBtn");
const authUsernameInput = document.getElementById("authUsernameInput");
const authPasswordInput = document.getElementById("authPasswordInput");
const registerBtn = document.getElementById("registerBtn");
const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");
const authStatus = document.getElementById("authStatus");
const accountIdentityCard = document.getElementById("accountIdentityCard");
const accountAvatar = document.getElementById("accountAvatar");
const accountName = document.getElementById("accountName");
const accountPresence = document.getElementById("accountPresence");

const playerNameInput = document.getElementById("playerNameInput");
const roomCodeInput = document.getElementById("roomCodeInput");
const createRoomBtn = document.getElementById("createRoomBtn");
const joinRoomBtn = document.getElementById("joinRoomBtn");
const copyRoomCodeBtn = document.getElementById("copyRoomCodeBtn");
const changeRoomBtn = document.getElementById("changeRoomBtn");
const onlineStatus = document.getElementById("onlineStatus");
const roomInfo = document.getElementById("roomInfo");
const playersList = document.getElementById("playersList");
const leaderboardList = document.getElementById("leaderboardList");
const roomChatMessages = document.getElementById("roomChatMessages");
const roomChatInput = document.getElementById("roomChatInput");
const roomChatSendBtn = document.getElementById("roomChatSendBtn");
const salonSectionToggleBtn = document.getElementById("salonSectionToggleBtn");
const salonSectionBody = document.getElementById("salonSectionBody");
const chatSectionToggleBtn = document.getElementById("chatSectionToggleBtn");
const chatSectionBody = document.getElementById("chatSectionBody");
const resultSectionToggleBtn = document.getElementById("resultSectionToggleBtn");
const resultSectionBody = document.getElementById("resultSectionBody");
const converterColorPicker = document.getElementById("converterColorPicker");
const converterPreviewSwatch = document.getElementById("converterPreviewSwatch");
const converterHueSlider = document.getElementById("converterHueSlider");
const converterSaturationSlider = document.getElementById("converterSaturationSlider");
const converterLightnessSlider = document.getElementById("converterLightnessSlider");
const converterHueValue = document.getElementById("converterHueValue");
const converterSaturationValue = document.getElementById("converterSaturationValue");
const converterLightnessValue = document.getElementById("converterLightnessValue");
const converterHueImpactBar = document.getElementById("converterHueImpactBar");
const converterSaturationImpactBar = document.getElementById("converterSaturationImpactBar");
const converterLightnessImpactBar = document.getElementById("converterLightnessImpactBar");
const converterHexInput = document.getElementById("converterHexInput");
const converterRInput = document.getElementById("converterRInput");
const converterGInput = document.getElementById("converterGInput");
const converterBInput = document.getElementById("converterBInput");
const converterHInput = document.getElementById("converterHInput");
const converterSInput = document.getElementById("converterSInput");
const converterLInput = document.getElementById("converterLInput");
const converterNameText = document.getElementById("converterNameText");
const converterHintText = document.getElementById("converterHintText");
const copyHexBtn = document.getElementById("copyHexBtn");
const copyRgbBtn = document.getElementById("copyRgbBtn");
const copyHslBtn = document.getElementById("copyHslBtn");
const appToast = document.getElementById("appToast");

let targetColor = null;
let countdownInterval = null;
let soloNextRoundTimeout = null;
let scoreAnimationFrame = null;
let scoreAudioContext = null;
let scoreCompletionTimeout = null;
let stageScoreValueEl = null;
let stageScoreCardEl = null;
let stageScoreTierEl = null;
let stageScoreFireworksEl = null;
let stageScoreTierId = "";

let gameMode = "solo";
let localMode = "memory";
let nameModeDifficulty = "normal";
let codeModeFormat = "auto";
let onlineMode = "memory";
let onlineCodeFormat = "auto";

let soloRoundNumber = 0;
let soloTotalScore = 0;
let soloRoundHistory = [];
let isSoloMatchRunning = false;

let onlineRoundNumber = 0;
let onlineTotalRounds = MATCH_ROUNDS;
let onlineRoundHistory = [];
let onlinePlayersCount = 0;
let isOnlineMatchRunning = false;

let currentRoomCode = "";
let isHost = false;
let hasSubmittedOnline = false;
let onlineChatHistory = [];
let lastLeaderboardMaxScore = MATCH_ROUNDS * 100;

let namedColorPool = [];
let lastSoloRandomTarget = null;
let scorePage = "perso";
let lastLeaderboardEntries = [];
let isUpdatingConverter = false;
let isUpdatingGuessCode = false;
let appView = "game";
let authenticatedUser = null;
let persistedTracking = null;
let friendsData = [];
let incomingFriendRequests = [];
let outgoingFriendRequests = [];
let incomingSocialInvites = [];
let outgoingSocialInvites = [];
let socialSelectedFriendId = null;
let socialMessages = [];
let socialFriendSearch = "";
let socialFriendSort = "status";
let friendsPollingInterval = null;
let hasHydratedFriendsPresence = false;
let toastTimeout = null;
let historySourceFilter = "all";
let historyModeFilter = "all";
let historyPeriodFilter = "30d";

const personalStats = {
  rounds: 0,
  totalScore: 0,
  bestRound: 0,
  soloMatches: 0,
  onlineRounds: 0,
};

function toDateTimeLabel(timestamp) {
  if (!timestamp) {
    return "-";
  }
  try {
    return new Date(Number(timestamp)).toLocaleString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "-";
  }
}

function getLastSeenLabel(timestamp) {
  if (!timestamp) {
    return "jamais";
  }
  return toDateTimeLabel(timestamp);
}

function showToast(message) {
  if (!appToast || !message) {
    return;
  }

  appToast.textContent = String(message);
  appToast.classList.remove("hidden");

  if (toastTimeout) {
    clearTimeout(toastTimeout);
  }

  toastTimeout = setTimeout(() => {
    appToast.classList.add("hidden");
    toastTimeout = null;
  }, 2600);
}

function buildAvatarStyleFromUsername(username) {
  const safe = String(username || "Invite");
  let hash = 0;
  for (let i = 0; i < safe.length; i += 1) {
    hash = ((hash << 5) - hash) + safe.charCodeAt(i);
    hash |= 0;
  }

  const hue = Math.abs(hash) % 360;
  const hue2 = (hue + 28) % 360;
  return `linear-gradient(135deg, hsl(${hue}, 62%, 48%), hsl(${hue2}, 66%, 40%))`;
}

function updateAccountIdentityUi() {
  if (!accountAvatar || !accountName || !accountPresence || !accountIdentityCard) {
    return;
  }

  const isLoggedIn = !!authenticatedUser;
  const username = isLoggedIn ? authenticatedUser.username : "Invite";
  const initial = String(username).trim().charAt(0).toUpperCase() || "?";

  accountAvatar.textContent = initial;
  accountAvatar.style.background = isLoggedIn
    ? buildAvatarStyleFromUsername(username)
    : "linear-gradient(135deg, #8a979f, #67757d)";

  accountName.textContent = username;
  accountPresence.textContent = isLoggedIn ? "Connecte" : "Hors ligne";
  accountPresence.classList.toggle("online", isLoggedIn);
  accountIdentityCard.setAttribute("aria-label", isLoggedIn ? `Compte connecte: ${username}` : "Aucun compte connecte");
}

function updateSocialBadge() {
  if (!socialBadge) {
    return;
  }

  const unreadMessages = friendsData.reduce((sum, friend) => sum + Number(friend.unreadCount || 0), 0);
  const count = incomingFriendRequests.length + incomingSocialInvites.length + unreadMessages;
  socialBadge.textContent = String(count);
  socialBadge.classList.toggle("hidden", count <= 0);
}

function startFriendsPolling() {
  if (friendsPollingInterval) {
    clearInterval(friendsPollingInterval);
    friendsPollingInterval = null;
  }

  if (!authenticatedUser) {
    return;
  }

  friendsPollingInterval = setInterval(() => {
    refreshFriendsData();
    refreshSocialInvites();
  }, 15000);
}

function stopFriendsPolling() {
  if (friendsPollingInterval) {
    clearInterval(friendsPollingInterval);
    friendsPollingInterval = null;
  }
}

const socket = typeof io === "function" ? io() : null;

let NAMED_COLOR_BASES = [];
let NAMED_COLOR_VARIANTS = [];

async function loadNamedColorData() {
  try {
    const response = await fetch("/api/named-colors");
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    const data = await response.json();
    NAMED_COLOR_BASES = data.bases || [];
    NAMED_COLOR_VARIANTS = data.variants || [];
    
    // Mettre à jour les difficultés avec les données du serveur
    if (data.difficulties) {
      NAME_DIFFICULTY_VARIANTS.easy = data.difficulties.easy || NAME_DIFFICULTY_VARIANTS.easy;
      NAME_DIFFICULTY_VARIANTS.normal = data.difficulties.normal || NAME_DIFFICULTY_VARIANTS.normal;
      NAME_DIFFICULTY_VARIANTS.expert = data.difficulties.expert || NAME_DIFFICULTY_VARIANTS.expert;
    }
    
    return true;
  } catch (error) {
    console.error("Failed to load color data from API:", error);
    return false;
  }
}

const NAME_DIFFICULTY_VARIANTS = {
  easy: ["base"],
  normal: ["base", "clair", "profond"],
  expert: ["base", "clair", "profond", "vif", "fume"],
};

const NAME_DIFFICULTY_LABELS = {
  easy: "Facile",
  normal: "Normal",
  expert: "Expert",
};

const CODE_FORMAT_LABELS = {
  auto: "Auto",
  hex: "HEX",
  rgb: "RGB",
  hsl: "HSL",
};

const SCORE_VISUAL_TIERS = [
  { id: "tier-1", min: 0, label: "Echauffement" },
  { id: "tier-2", min: 45, label: "Solide" },
  { id: "tier-3", min: 70, label: "Excellent" },
  { id: "tier-4", min: 90, label: "Legende" },
];

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function hsl(h, s, l = FIXED_LIGHTNESS) {
  return `hsl(${h}, ${s}%, ${l}%)`;
}

function hslToRgb(h, s, l) {
  const hue = ((h % 360) + 360) % 360;
  const sat = Math.max(0, Math.min(100, s)) / 100;
  const lig = Math.max(0, Math.min(100, l)) / 100;

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
  const toHex = (n) => Math.max(0, Math.min(255, n)).toString(16).padStart(2, "0").toUpperCase();
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function parseRgbText(value) {
  const match = String(value || "").trim().match(/^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/i);
  if (!match) {
    return null;
  }

  const r = Number(match[1]);
  const g = Number(match[2]);
  const b = Number(match[3]);
  if ([r, g, b].some((n) => n < 0 || n > 255)) {
    return null;
  }

  return { r, g, b };
}

function parseHslText(value) {
  const match = String(value || "").trim().match(/^hsl\(\s*(-?\d{1,3}(?:\.\d+)?)\s*,\s*(\d{1,3}(?:\.\d+)?)%\s*,\s*(\d{1,3}(?:\.\d+)?)%\s*\)$/i);
  if (!match) {
    return null;
  }

  const hue = Number(match[1]);
  const saturation = Number(match[2]);
  const lightness = Number(match[3]);

  if (Number.isNaN(hue) || Number.isNaN(saturation) || Number.isNaN(lightness)) {
    return null;
  }
  if (saturation < 0 || saturation > 100 || lightness < 0 || lightness > 100) {
    return null;
  }

  return {
    hue: wrapHue(Math.round(hue)),
    tint: clamp(Math.round(saturation), 0, 100),
    lightness: clamp(Math.round(lightness), 0, 100),
  };
}

function parseColorCodeInput(value) {
  const raw = String(value || "").trim();
  if (!raw) {
    return null;
  }

  const rgbFromHex = hexToRgb(raw);
  if (rgbFromHex) {
    const hslValue = rgbToHsl(rgbFromHex.r, rgbFromHex.g, rgbFromHex.b);
    return {
      hue: hslValue.h,
      tint: hslValue.s,
      lightness: hslValue.l,
    };
  }

  const rgbText = parseRgbText(raw);
  if (rgbText) {
    const hslValue = rgbToHsl(rgbText.r, rgbText.g, rgbText.b);
    return {
      hue: hslValue.h,
      tint: hslValue.s,
      lightness: hslValue.l,
    };
  }

  return parseHslText(raw);
}

function isCodeInputAllowedInCurrentMode() {
  if (gameMode === "online") {
    return onlineMode !== "code";
  }

  return localMode !== "code";
}

function updateGuessCodeUi() {
  if (!guessCodeSection || !guessCodeHint) {
    return;
  }

  const showCodeInput = appView === "game" && isCodeInputAllowedInCurrentMode();
  guessCodeSection.classList.toggle("hidden", !showCodeInput);
  guessCodeSection.style.display = showCodeInput ? "grid" : "none";

  if (!showCodeInput) {
    guessCodeHint.textContent = "Format accepte: #RRGGBB, rgb(r,g,b), hsl(h,s%,l%).";
    guessCodeHint.classList.remove("invalid");
  }
}

function syncGuessCodeFromSliders() {
  if (!guessCodeInput || !guessCodeSection || !guessCodeHint) {
    return;
  }
  if (isUpdatingGuessCode || guessCodeSection.classList.contains("hidden")) {
    return;
  }

  const rgb = hslToRgb(Number(hueSlider.value), Number(tintSlider.value), Number(lightnessSlider.value));
  isUpdatingGuessCode = true;
  guessCodeInput.value = rgbToHex(rgb);
  guessCodeHint.textContent = "Format accepte: #RRGGBB, rgb(r,g,b), hsl(h,s%,l%).";
  guessCodeHint.classList.remove("invalid");
  isUpdatingGuessCode = false;
}

function applyGuessCodeInput() {
  if (!guessCodeInput || !guessCodeSection || !guessCodeHint) {
    return;
  }
  if (isUpdatingGuessCode || guessCodeInput.disabled || guessCodeSection.classList.contains("hidden")) {
    return;
  }

  const parsed = parseColorCodeInput(guessCodeInput.value);
  if (!parsed) {
    guessCodeHint.textContent = "Code invalide. Exemples: #40A0D0, rgb(64,160,208), hsl(200,60%,53%).";
    guessCodeHint.classList.add("invalid");
    return;
  }

  isUpdatingGuessCode = true;
  hueSlider.value = String(parsed.hue);
  tintSlider.value = String(parsed.tint);
  lightnessSlider.value = String(parsed.lightness);
  isUpdatingGuessCode = false;

  guessCodeInput.value = rgbToHex(hslToRgb(parsed.hue, parsed.tint, parsed.lightness));
  guessCodeHint.textContent = "Code applique a la couleur courante.";
  guessCodeHint.classList.remove("invalid");
  updatePlayerPreview();
}

function hexToRgb(hex) {
  const normalized = String(hex || "").trim().toUpperCase();
  const match = normalized.match(/^#?([0-9A-F]{6})$/);
  if (!match) {
    return null;
  }

  const value = match[1];
  return {
    r: Number.parseInt(value.slice(0, 2), 16),
    g: Number.parseInt(value.slice(2, 4), 16),
    b: Number.parseInt(value.slice(4, 6), 16),
  };
}

function rgbToHsl(r, g, b) {
  const rr = Math.max(0, Math.min(255, r)) / 255;
  const gg = Math.max(0, Math.min(255, g)) / 255;
  const bb = Math.max(0, Math.min(255, b)) / 255;

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

function getClosestNamedColor(hue, tint, lightness) {
  let best = null;

  for (const baseColor of NAMED_COLOR_BASES) {
    for (const variant of NAMED_COLOR_VARIANTS) {
      const candidate = {
        name: `${baseColor.name}${variant.label}`,
        hue: wrapHue(baseColor.hue + variant.hueOffset),
        tint: clamp(baseColor.tint + variant.tintOffset, 12, 96),
        lightness: FIXED_LIGHTNESS,
      };

      const hueDiffRaw = Math.abs(hue - candidate.hue);
      const hueDiff = Math.min(hueDiffRaw, 360 - hueDiffRaw) / 180;
      const tintDiff = Math.abs(tint - candidate.tint) / 100;
      const lightDiff = Math.abs(lightness - candidate.lightness) / 100;
      const distance = Math.sqrt((hueDiff * 1.2) ** 2 + (tintDiff * 1) ** 2 + (lightDiff * 0.8) ** 2);

      if (!best || distance < best.distance) {
        best = {
          name: candidate.name,
          distance,
        };
      }
    }
  }

  return best;
}

function renderConverterFromHsl(h, s, l) {
  const safeH = clamp(Math.round(h), 0, 360);
  const safeS = clamp(Math.round(s), 0, 100);
  const safeL = clamp(Math.round(l), 0, 100);

  const rgb = hslToRgb(safeH, safeS, safeL);
  const hex = rgbToHex(rgb);

  converterColorPicker.value = hex;
  converterHexInput.value = hex;
  converterRInput.value = String(rgb.r);
  converterGInput.value = String(rgb.g);
  converterBInput.value = String(rgb.b);
  converterHInput.value = String(safeH);
  converterSInput.value = String(safeS);
  converterLInput.value = String(safeL);
  if (converterHueSlider) {
    converterHueSlider.value = String(safeH);
  }
  if (converterSaturationSlider) {
    converterSaturationSlider.value = String(safeS);
  }
  if (converterLightnessSlider) {
    converterLightnessSlider.value = String(safeL);
  }

  if (converterHueValue) {
    converterHueValue.textContent = String(safeH);
  }
  if (converterSaturationValue) {
    converterSaturationValue.textContent = `${safeS}%`;
  }
  if (converterLightnessValue) {
    converterLightnessValue.textContent = `${safeL}%`;
  }

  if (converterHueImpactBar) {
    converterHueImpactBar.style.setProperty("--progress", `${Math.round((safeH / 360) * 100)}%`);
    converterHueImpactBar.style.background = `linear-gradient(90deg,
      hsl(0, ${safeS}%, ${safeL}%),
      hsl(60, ${safeS}%, ${safeL}%),
      hsl(120, ${safeS}%, ${safeL}%),
      hsl(180, ${safeS}%, ${safeL}%),
      hsl(240, ${safeS}%, ${safeL}%),
      hsl(300, ${safeS}%, ${safeL}%),
      hsl(360, ${safeS}%, ${safeL}%))`;
  }

  if (converterSaturationImpactBar) {
    converterSaturationImpactBar.style.setProperty("--progress", `${safeS}%`);
    converterSaturationImpactBar.style.background = `linear-gradient(90deg, hsl(${safeH}, 0%, ${safeL}%), hsl(${safeH}, 100%, ${safeL}%))`;
  }

  if (converterLightnessImpactBar) {
    converterLightnessImpactBar.style.setProperty("--progress", `${safeL}%`);
    converterLightnessImpactBar.style.background = `linear-gradient(90deg, hsl(${safeH}, ${safeS}%, 0%), hsl(${safeH}, ${safeS}%, 50%), hsl(${safeH}, ${safeS}%, 100%))`;
  }

  converterPreviewSwatch.style.background = hex;
  const match = getClosestNamedColor(safeH, safeS, safeL);
  converterNameText.textContent = match ? `Nom suggere: ${match.name}` : "Nom suggere: -";
  converterHintText.textContent = match
    ? `Proche de la palette artiste (${Math.max(0, Math.round((1 - (match.distance / 2)) * 100))}%).`
    : "Pret.";
}

function initColorConverter() {
  if (!converterColorPicker) {
    return;
  }

  const copyText = async (text, successMessage) => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const temp = document.createElement("textarea");
        temp.value = text;
        temp.setAttribute("readonly", "");
        temp.style.position = "absolute";
        temp.style.left = "-9999px";
        document.body.appendChild(temp);
        temp.select();
        document.execCommand("copy");
        temp.remove();
      }
      converterHintText.textContent = successMessage;
    } catch {
      converterHintText.textContent = "Impossible de copier automatiquement.";
    }
  };

  const updateFromHslInputs = () => {
    if (isUpdatingConverter) {
      return;
    }
    isUpdatingConverter = true;
    renderConverterFromHsl(
      Number(converterHInput.value),
      Number(converterSInput.value),
      Number(converterLInput.value),
    );
    isUpdatingConverter = false;
  };

  const updateFromGaugeSliders = () => {
    if (isUpdatingConverter) {
      return;
    }
    isUpdatingConverter = true;
    renderConverterFromHsl(
      Number(converterHueSlider.value),
      Number(converterSaturationSlider.value),
      Number(converterLightnessSlider.value),
    );
    isUpdatingConverter = false;
  };

  const updateFromRgbInputs = () => {
    if (isUpdatingConverter) {
      return;
    }
    isUpdatingConverter = true;
    const r = clamp(Number(converterRInput.value), 0, 255);
    const g = clamp(Number(converterGInput.value), 0, 255);
    const b = clamp(Number(converterBInput.value), 0, 255);
    const hslValue = rgbToHsl(r, g, b);
    renderConverterFromHsl(hslValue.h, hslValue.s, hslValue.l);
    isUpdatingConverter = false;
  };

  converterColorPicker.addEventListener("input", () => {
    if (isUpdatingConverter) {
      return;
    }
    const rgb = hexToRgb(converterColorPicker.value);
    if (!rgb) {
      return;
    }
    isUpdatingConverter = true;
    const hslValue = rgbToHsl(rgb.r, rgb.g, rgb.b);
    renderConverterFromHsl(hslValue.h, hslValue.s, hslValue.l);
    isUpdatingConverter = false;
  });

  converterHexInput.addEventListener("change", () => {
    if (isUpdatingConverter) {
      return;
    }
    const rgb = hexToRgb(converterHexInput.value);
    if (!rgb) {
      converterHintText.textContent = "HEX invalide. Format attendu: #RRGGBB.";
      return;
    }
    isUpdatingConverter = true;
    const hslValue = rgbToHsl(rgb.r, rgb.g, rgb.b);
    renderConverterFromHsl(hslValue.h, hslValue.s, hslValue.l);
    isUpdatingConverter = false;
  });

  converterRInput.addEventListener("input", updateFromRgbInputs);
  converterGInput.addEventListener("input", updateFromRgbInputs);
  converterBInput.addEventListener("input", updateFromRgbInputs);
  converterHInput.addEventListener("input", updateFromHslInputs);
  converterSInput.addEventListener("input", updateFromHslInputs);
  converterLInput.addEventListener("input", updateFromHslInputs);

  converterHueSlider.addEventListener("input", updateFromGaugeSliders);
  converterSaturationSlider.addEventListener("input", updateFromGaugeSliders);
  converterLightnessSlider.addEventListener("input", updateFromGaugeSliders);

  copyHexBtn.addEventListener("click", () => {
    copyText(converterHexInput.value.trim().toUpperCase(), "HEX copie.");
  });

  copyRgbBtn.addEventListener("click", () => {
    const rgbText = `rgb(${Number(converterRInput.value)}, ${Number(converterGInput.value)}, ${Number(converterBInput.value)})`;
    copyText(rgbText, "RGB copie.");
  });

  copyHslBtn.addEventListener("click", () => {
    const hslText = `hsl(${Number(converterHInput.value)}, ${Number(converterSInput.value)}%, ${Number(converterLInput.value)}%)`;
    copyText(hslText, "HSL copie.");
  });

  renderConverterFromHsl(200, 60, 53);
}

function getColorCodeLabel(hue, tint, lightness = FIXED_LIGHTNESS) {
  const rgb = hslToRgb(hue, tint, lightness);
  const selectedFormat = codeModeFormat === "auto"
    ? ["hex", "rgb", "hsl"][randomInt(0, 2)]
    : codeModeFormat;

  if (selectedFormat === "hex") {
    return {
      format: "HEX",
      value: rgbToHex(rgb),
    };
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

function formatScore(value) {
  return Number(value).toFixed(2);
}

function normalizeScore(score) {
  return Math.max(0, Math.min(100, Number(score) || 0));
}

function getStageScoreDisplayMs(score) {
  const normalized = normalizeScore(score);
  return 1000 + Math.round(normalized * 9);
}

function getCounterDurationMs(score) {
  const normalized = normalizeScore(score);
  return 700 + Math.round(normalized * 3.5);
}

function getScoreVisualTier(score) {
  const normalized = normalizeScore(score);
  let current = SCORE_VISUAL_TIERS[0];

  for (const tier of SCORE_VISUAL_TIERS) {
    if (normalized >= tier.min) {
      current = tier;
    }
  }

  return current;
}

function playScorePopSound() {
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) {
    return;
  }

  try {
    if (!scoreAudioContext) {
      scoreAudioContext = new AudioCtx();
    }

    if (scoreAudioContext.state === "suspended") {
      scoreAudioContext.resume();
    }

    const now = scoreAudioContext.currentTime;
    const osc = scoreAudioContext.createOscillator();
    const gain = scoreAudioContext.createGain();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(620, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.07);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.09, now + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.11);

    osc.connect(gain);
    gain.connect(scoreAudioContext.destination);
    osc.start(now);
    osc.stop(now + 0.12);
  } catch {
    // Ne bloque jamais le jeu si l'audio n'est pas disponible.
  }
}

function applyStageTier(tier, burstTopTier) {
  if (!stageScoreCardEl) {
    return;
  }

  stageScoreCardEl.classList.remove("tier-1", "tier-2", "tier-3", "tier-4");
  stageScoreCardEl.classList.add(tier.id);

  if (stageScoreTierEl) {
    stageScoreTierEl.textContent = tier.label;
  }

  if (!stageScoreFireworksEl) {
    return;
  }

  const isTopTier = tier.id === "tier-4";
  stageScoreFireworksEl.classList.toggle("hidden", !isTopTier);

  if (isTopTier && burstTopTier) {
    stageScoreFireworksEl.classList.remove("burst");
    void stageScoreFireworksEl.offsetWidth;
    stageScoreFireworksEl.classList.add("burst");
  }
}

function renderStageScore(value) {
  if (!stageScoreCardEl || !stageScoreCardEl.isConnected || !stageScoreValueEl || !stageScoreValueEl.isConnected) {
    const card = document.createElement("div");
    card.className = "stage-score-pop";

    const label = document.createElement("span");
    label.className = "stage-score-label";
    label.textContent = "Score manche";

    const valueEl = document.createElement("strong");
    valueEl.className = "stage-score-value";
    valueEl.textContent = formatScore(0);

    const tierEl = document.createElement("span");
    tierEl.className = "stage-score-tier";
    tierEl.textContent = "Echauffement";

    const fireworks = document.createElement("div");
    fireworks.className = "stage-fireworks hidden";
    for (let i = 0; i < 10; i += 1) {
      const spark = document.createElement("i");
      fireworks.appendChild(spark);
    }

    card.appendChild(label);
    card.appendChild(valueEl);
    card.appendChild(tierEl);
    card.appendChild(fireworks);
    stageOverlay.replaceChildren(card);
    stageScoreCardEl = card;
    stageScoreValueEl = valueEl;
    stageScoreTierEl = tierEl;
    stageScoreFireworksEl = fireworks;
    stageScoreTierId = "";
  }

  stageOverlay.classList.remove("passive");
  stageScoreValueEl.textContent = formatScore(value);

  const nextTier = getScoreVisualTier(value);
  const tierChanged = stageScoreTierId !== nextTier.id;
  stageScoreTierId = nextTier.id;
    applyStageTier(nextTier, tierChanged);
    if (value >= 90) {
      playScorePopSound();
    }
}

function restartStageScoreAnimation() {
  const card = stageScoreCardEl && stageScoreCardEl.isConnected
    ? stageScoreCardEl
    : stageOverlay.querySelector(".stage-score-pop");
  if (!card) {
    return;
  }
  card.classList.remove("score-active");
  void card.offsetWidth;
  card.classList.add("score-active");
}

function animateRoundScore(roundNumber, maxRounds, finalScore, options = {}) {
  const { inStage = false, onComplete = null } = options;

  if (scoreAnimationFrame) {
    cancelAnimationFrame(scoreAnimationFrame);
    scoreAnimationFrame = null;
  }
  if (scoreCompletionTimeout) {
    clearTimeout(scoreCompletionTimeout);
    scoreCompletionTimeout = null;
  }

  const runCompletion = (delayMs = 0) => {
    if (typeof onComplete !== "function") {
      return;
    }

    if (delayMs <= 0) {
      onComplete();
      return;
    }

    scoreCompletionTimeout = setTimeout(() => {
      scoreCompletionTimeout = null;
      onComplete();
    }, delayMs);
  };

  const safeFinalScore = Math.max(0, Number(finalScore) || 0);
  stageScoreTierId = "";
  scoreText.textContent = `Manche ${roundNumber}/${maxRounds}: ${formatScore(0)}/100`;
  if (inStage) {
    renderStageScore(0);
    restartStageScoreAnimation();
  }
  const stageHoldMs = inStage ? getStageScoreDisplayMs(safeFinalScore) : 0;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion) {
    scoreText.textContent = `Manche ${roundNumber}/${maxRounds}: ${formatScore(safeFinalScore)}/100`;
    if (inStage) {
      renderStageScore(safeFinalScore);
    }
    playScorePopSound();
    runCompletion(stageHoldMs);
    return;
  }

  const durationMs = getCounterDurationMs(safeFinalScore);
  const startTime = performance.now();

  const tick = (now) => {
    const progress = Math.min((now - startTime) / durationMs, 1);
    const eased = 1 - ((1 - progress) ** 3);
    const currentScore = safeFinalScore * eased;
    scoreText.textContent = `Manche ${roundNumber}/${maxRounds}: ${formatScore(currentScore)}/100`;
    if (inStage) {
      renderStageScore(currentScore);
    }

    if (progress < 1) {
      scoreAnimationFrame = requestAnimationFrame(tick);
    } else {
      scoreAnimationFrame = null;
      scoreText.textContent = `Manche ${roundNumber}/${maxRounds}: ${formatScore(safeFinalScore)}/100`;
      if (inStage) {
        renderStageScore(safeFinalScore);
      }
      playScorePopSound();
      runCompletion(stageHoldMs);
    }
  };

  scoreAnimationFrame = requestAnimationFrame(tick);
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function wrapHue(value) {
  const wrapped = value % 360;
  return wrapped < 0 ? wrapped + 360 : wrapped;
}

function hueCircularDiff(a, b) {
  const raw = Math.abs(a - b);
  return Math.min(raw, 360 - raw);
}

function isColorTooClose(nextColor, previousColor) {
  if (!previousColor) {
    return false;
  }
  return hueCircularDiff(nextColor.hue, previousColor.hue) < 34 && Math.abs(nextColor.tint - previousColor.tint) < 18;
}

function createRandomTarget(previousColor) {
  let candidate = null;

  for (let attempt = 0; attempt < 16; attempt += 1) {
    const next = {
      hue: randomInt(0, 359),
      tint: randomInt(25, 98),
      lightness: randomInt(22, 78),
    };

    candidate = next;
    if (!isColorTooClose(next, previousColor)) {
      break;
    }
  }

  return candidate;
}

function buildNamedColors(difficulty) {
  const allowed = new Set(NAME_DIFFICULTY_VARIANTS[difficulty] || NAME_DIFFICULTY_VARIANTS.normal);
  const generated = [];

  for (const baseColor of NAMED_COLOR_BASES) {
    for (const variant of NAMED_COLOR_VARIANTS) {
      if (!allowed.has(variant.id)) {
        continue;
      }

      generated.push({
        name: `${baseColor.name}${variant.label}`,
        hue: wrapHue(baseColor.hue + variant.hueOffset),
        tint: clamp(baseColor.tint + variant.tintOffset, 25, 96),
        lightness: FIXED_LIGHTNESS,
      });
    }
  }

  return generated;
}

function shuffleArray(items) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = randomInt(0, i);
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function refillNamedColorPool() {
  namedColorPool = shuffleArray(buildNamedColors(nameModeDifficulty));
}

function getNameDifficultyLabel() {
  return NAME_DIFFICULTY_LABELS[nameModeDifficulty] || NAME_DIFFICULTY_LABELS.normal;
}

function getCodeFormatLabel(format = codeModeFormat) {
  return CODE_FORMAT_LABELS[format] || CODE_FORMAT_LABELS.auto;
}

function pickNamedColor() {
  if (namedColorPool.length === 0) {
    refillNamedColorPool();
  }
  return namedColorPool.pop();
}

function getLocalModeConfig() {
  if (localMode === "name") {
    return {
      eyebrow: "Nom couleur",
      subtitle: "Lis le nom de la couleur, puis retrouve sa teinte avec les curseurs.",
      ctaTitle: "Defi nom de couleur",
      ctaSubtitle: "Le nom apparait, puis tu reconstruis la vraie couleur.",
      startLabel: "Lancer le mode nom couleur",
      stageIntro: "Observe le nom de la couleur",
      stageHidden: "Le nom a disparu. Reproduis la couleur.",
      targetLabel: "Vraie couleur",
    };
  }

  if (localMode === "code") {
    return {
      eyebrow: "Mode code",
      subtitle: "Lis un code couleur HEX ou RGB et reconstruis la couleur avec les curseurs.",
      ctaTitle: "Defi code couleur",
      ctaSubtitle: "Interprete le code affiche, vise juste, puis valide ton score.",
      startLabel: "Lancer le mode code",
      stageIntro: "Observe le code couleur",
      stageHidden: "Le code a disparu. Reproduis la couleur.",
      targetLabel: "Couleur cible",
    };
  }

  return {
    eyebrow: "Memoire",
    subtitle: "Observe la couleur pendant 5 secondes, puis recree-la avec les curseurs.",
    ctaTitle: "Defi memoire chromatique",
    ctaSubtitle: "Partie rapide en 5 manches. Plus tu es precis, plus ton score grimpe.",
    startLabel: "Lancer le mode memoire",
    stageIntro: "Memorise cette couleur",
    stageHidden: "La couleur est cachee. Reproduis-la avec les curseurs.",
    targetLabel: "Couleur cible",
  };
}

function getOnlineModeConfig() {
  if (onlineMode === "name") {
    return {
      eyebrow: "Online",
      subtitle: "Joue en salon avec des noms de couleur a reproduire.",
      ctaTitle: "Defi multijoueur nom couleur",
      ctaSubtitle: "Le host lance 5 manches et tout le monde reconstruit la vraie couleur.",
      startLabel: "Lancer la partie online",
      stageIntro: "Observe le nom de couleur",
      stageHidden: "Le nom a disparu. Reproduis la couleur.",
      targetLabel: "Vraie couleur",
    };
  }

  if (onlineMode === "code") {
    return {
      eyebrow: "Online",
      subtitle: "Joue en salon avec des codes couleur a interpreter.",
      ctaTitle: "Defi multijoueur code couleur",
      ctaSubtitle: `Le format ${getCodeFormatLabel(onlineCodeFormat)} est partage a toute la salle.`,
      startLabel: "Lancer la partie online",
      stageIntro: "Observe le code couleur",
      stageHidden: "Le code a disparu. Reproduis la couleur.",
      targetLabel: "Vraie couleur",
    };
  }

  return {
    eyebrow: "Online",
    subtitle: "Joue en salon avec un classement en temps reel.",
    ctaTitle: "Defi multijoueur",
    ctaSubtitle: "Rejoins un salon et affronte les autres joueurs sur 5 manches.",
    startLabel: "Lancer la partie online",
    stageIntro: "Observe la couleur pendant 5 secondes",
    stageHidden: "La couleur est cachee. Reproduis-la avec les curseurs.",
    targetLabel: "Couleur cible",
  };
}

function updateOnlineModeUi() {
  const isOnline = gameMode === "online";
  const isCodeOnline = isOnline && onlineMode === "code";
  const isHostEditor = !currentRoomCode || isHost;

  onlineModeChip.classList.toggle("hidden", !isOnline);
  onlineModeChip.textContent = `Online: ${ONLINE_MODE_LABELS[onlineMode] || ONLINE_MODE_LABELS.memory}`;

  onlineMemoryModeBtn.classList.toggle("active", onlineMode === "memory");
  onlineNameModeBtn.classList.toggle("active", onlineMode === "name");
  onlineCodeModeBtn.classList.toggle("active", onlineMode === "code");

  onlineMemoryModeBtn.disabled = !isHostEditor;
  onlineNameModeBtn.disabled = !isHostEditor;
  onlineCodeModeBtn.disabled = !isHostEditor;

  onlineCodeFormatSection.classList.toggle("hidden", !isCodeOnline);
  onlineCodeFormatAutoBtn.classList.toggle("active", onlineCodeFormat === "auto");
  onlineCodeFormatHexBtn.classList.toggle("active", onlineCodeFormat === "hex");
  onlineCodeFormatRgbBtn.classList.toggle("active", onlineCodeFormat === "rgb");
  onlineCodeFormatHslBtn.classList.toggle("active", onlineCodeFormat === "hsl");

  onlineCodeFormatAutoBtn.disabled = !isHostEditor;
  onlineCodeFormatHexBtn.disabled = !isHostEditor;
  onlineCodeFormatRgbBtn.disabled = !isHostEditor;
  onlineCodeFormatHslBtn.disabled = !isHostEditor;

  updateOnlineRoomUi();
}

function updateOnlineRoomUi() {
  const hasRoom = !!currentRoomCode;
  const isOnline = gameMode === "online";
  const isGameView = appView === "game";
  const shouldShowHeroOnlinePanel = isOnline && isGameView;

  if (!roomInfo) {
    return;
  }

  if (!isOnline) {
    roomInfo.textContent = "";
    roomInfo.classList.add("is-empty");
    roomInfo.setAttribute("aria-hidden", "true");
    if (copyRoomCodeBtn) {
      copyRoomCodeBtn.classList.add("hidden");
      copyRoomCodeBtn.disabled = true;
    }
    if (changeRoomBtn) {
      changeRoomBtn.classList.add("hidden");
      changeRoomBtn.disabled = true;
    }
    if (createRoomBtn) {
      createRoomBtn.disabled = false;
    }
    if (joinRoomBtn) {
      joinRoomBtn.disabled = false;
    }
    if (roomCodeInput) {
      roomCodeInput.disabled = false;
    }
    if (heroOnlinePanel) {
      heroOnlinePanel.classList.add("hidden");
      heroOnlinePanel.style.display = "none";
      heroOnlinePanel.setAttribute("aria-hidden", "true");
    }
    if (heroOnlineStatus) {
      heroOnlineStatus.textContent = "Passe en ligne pour créer ou rejoindre un salon.";
    }
    if (heroCopyRoomCodeBtn) {
      heroCopyRoomCodeBtn.classList.add("hidden");
      heroCopyRoomCodeBtn.disabled = true;
    }
    if (roomChatInput) {
      roomChatInput.disabled = true;
      roomChatInput.value = "";
    }
    if (roomChatSendBtn) {
      roomChatSendBtn.disabled = true;
    }
    renderRoomChat([]);
    return;
  }

  roomInfo.classList.remove("is-empty");
  roomInfo.textContent = hasRoom
    ? `Salon: ${currentRoomCode}`
    : "Aucun salon actif. Cree ou rejoins un salon pour commencer.";
  roomInfo.setAttribute("aria-hidden", "false");

  if (copyRoomCodeBtn) {
    copyRoomCodeBtn.classList.toggle("hidden", !hasRoom);
    copyRoomCodeBtn.disabled = !hasRoom;
  }

  if (changeRoomBtn) {
    changeRoomBtn.classList.toggle("hidden", !hasRoom);
    changeRoomBtn.disabled = !hasRoom;
  }

  if (createRoomBtn) {
    createRoomBtn.disabled = hasRoom;
  }
  if (joinRoomBtn) {
    joinRoomBtn.disabled = hasRoom;
  }
  if (roomCodeInput) {
    roomCodeInput.disabled = hasRoom;
  }

  if (heroOnlinePanel) {
    heroOnlinePanel.classList.toggle("hidden", !shouldShowHeroOnlinePanel);
    heroOnlinePanel.style.display = shouldShowHeroOnlinePanel ? "flex" : "none";
    heroOnlinePanel.setAttribute("aria-hidden", String(!shouldShowHeroOnlinePanel));
  }

  if (heroOnlineStatus) {
    heroOnlineStatus.textContent = hasRoom
      ? `Salon actif: ${currentRoomCode}`
      : "Aucun salon actif pour le moment.";
  }

  if (heroCopyRoomCodeBtn) {
    heroCopyRoomCodeBtn.classList.toggle("hidden", !hasRoom || !shouldShowHeroOnlinePanel);
    heroCopyRoomCodeBtn.disabled = !hasRoom || !shouldShowHeroOnlinePanel;
  }

  if (roomChatInput) {
    roomChatInput.disabled = !hasRoom;
  }
  if (roomChatSendBtn) {
    roomChatSendBtn.disabled = !hasRoom;
  }
}

function syncOnlineRoomMode() {
  if (!socket || !currentRoomCode || !isHost) {
    return;
  }

  socket.emit("set_room_mode", {
    roomCode: currentRoomCode,
    mode: onlineMode,
    codeFormat: onlineCodeFormat,
  });
}

function setOnlineMode(nextMode, { syncRoom = true } = {}) {
  const normalizedMode = ["memory", "name", "code"].includes(nextMode) ? nextMode : "memory";
  const hasChanged = onlineMode !== normalizedMode;
  onlineMode = normalizedMode;

  if (onlineMode !== "code") {
    onlineCodeFormat = "auto";
  }

  updateOnlineModeUi();
  updateModeCopy();

  if (hasChanged && gameMode === "online") {
    renderStageIntro();
    updateResultLabels();
  }

  if (syncRoom) {
    syncOnlineRoomMode();
  }
}

function leaveOnlineSession() {
  if (socket && currentRoomCode) {
    socket.emit("leave_room");
  }

  currentRoomCode = "";
  isHost = false;
  onlinePlayersCount = 0;
  onlineTotalRounds = MATCH_ROUNDS;
  resetOnlineMatchState();

  playersList.innerHTML = "";
  leaderboardList.innerHTML = "";
  renderScorePages();
  setOnlineStatus("Mode hors ligne.");
  updateOnlineRoomUi();
  updateOnlineModeUi();
  updateMenuButtons();

  if (authenticatedUser && payload.matchFinished) {
    refreshPersistedTracking();
  }
}

function changeOnlineRoom() {
  if (!currentRoomCode) {
    setOnlineStatus("Aucun salon actif. Cree ou rejoins un salon.");
    return;
  }

  if (socket) {
    socket.emit("leave_room");
  }

  currentRoomCode = "";
  isHost = false;
  onlinePlayersCount = 0;
  onlineTotalRounds = MATCH_ROUNDS;
  resetOnlineMatchState();
  resetOnlineScoreHistory();
  clearMatchResultUi();
  playersList.innerHTML = "";
  leaderboardList.innerHTML = "";
  onlineChatHistory = [];
  renderRoomChat([]);
  renderScorePages();
  updateOnlineRoomUi();
  updateMenuButtons();
  setOnlineStatus("Salon quitte. Tu peux rejoindre ou creer un nouveau salon.");
  if (roomCodeInput) {
    roomCodeInput.value = "";
    roomCodeInput.focus();
  }
}

function setOnlineCodeFormat(nextFormat, { syncRoom = true } = {}) {
  const normalizedFormat = ["auto", "hex", "rgb", "hsl"].includes(nextFormat) ? nextFormat : "auto";
  onlineCodeFormat = normalizedFormat;
  updateOnlineModeUi();
  updateModeCopy();

  if (syncRoom) {
    syncOnlineRoomMode();
  }
}

function getTargetForRound() {
  if (localMode === "name") {
    return pickNamedColor();
  }

  const randomTarget = createRandomTarget(lastSoloRandomTarget);
  lastSoloRandomTarget = randomTarget;

  if (localMode === "code") {
    const code = getColorCodeLabel(randomTarget.hue, randomTarget.tint, randomTarget.lightness);
    return {
      name: null,
      code: code.value,
      codeFormat: code.format,
      hue: randomTarget.hue,
      tint: randomTarget.tint,
      lightness: randomTarget.lightness,
    };
  }

  return {
    name: null,
    hue: randomTarget.hue,
    tint: randomTarget.tint,
    lightness: randomTarget.lightness,
  };
}

function pulseButton(button) {
  button.classList.remove("pulse");
  void button.offsetWidth;
  button.classList.add("pulse");
  setTimeout(() => button.classList.remove("pulse"), 240);
}

function setSectionCollapsed(toggleBtn, sectionBody, collapsed) {
  if (!toggleBtn || !sectionBody) {
    return;
  }

  sectionBody.classList.toggle("is-collapsed", collapsed);
  toggleBtn.setAttribute("aria-expanded", String(!collapsed));
  toggleBtn.textContent = collapsed ? "Ouvrir" : "Reduire";
}

function bindCollapsibleSection(toggleBtn, sectionBody) {
  if (!toggleBtn || !sectionBody) {
    return;
  }

  toggleBtn.addEventListener("click", () => {
    const collapsed = sectionBody.classList.contains("is-collapsed");
    setSectionCollapsed(toggleBtn, sectionBody, !collapsed);
  });
}

function initCollapsibleSections() {
  bindCollapsibleSection(salonSectionToggleBtn, salonSectionBody);
  bindCollapsibleSection(chatSectionToggleBtn, chatSectionBody);
  bindCollapsibleSection(resultSectionToggleBtn, resultSectionBody);
}

function setTheme() {
  if (gameMode === "online") {
    document.body.dataset.theme = "online";
    return;
  }

  if (localMode === "name") {
    document.body.dataset.theme = "name";
    return;
  }

  if (localMode === "code") {
    document.body.dataset.theme = "code";
    return;
  }

  document.body.dataset.theme = "memory";
}

function updateSelectedModeButtons() {
  soloModeBtn.classList.toggle("active", gameMode === "solo" && localMode === "memory");
  nameModeBtn.classList.toggle("active", gameMode === "solo" && localMode === "name");
  codeModeBtn.classList.toggle("active", gameMode === "solo" && localMode === "code");
  onlineModeBtn.classList.toggle("active", gameMode === "online");
}

function updateNameDifficultyUi() {
  const isNameLocal = gameMode === "solo" && localMode === "name";
  const isCodeLocal = gameMode === "solo" && localMode === "code";
  nameDifficultySection.classList.toggle("hidden", !isNameLocal);
  nameDifficultyChip.classList.toggle("hidden", !isNameLocal);
  nameDifficultyChip.textContent = `Difficulte: ${getNameDifficultyLabel()}`;
  codeFormatSection.classList.toggle("hidden", !isCodeLocal);
  codeFormatInlineSection.classList.toggle("hidden", !isCodeLocal);
  codeFormatChip.classList.toggle("hidden", !isCodeLocal);
  codeFormatChip.textContent = `Code: ${getCodeFormatLabel()}`;

  difficultyEasyBtn.classList.toggle("active", nameModeDifficulty === "easy");
  difficultyNormalBtn.classList.toggle("active", nameModeDifficulty === "normal");
  difficultyExpertBtn.classList.toggle("active", nameModeDifficulty === "expert");

  codeFormatAutoBtn.classList.toggle("active", codeModeFormat === "auto");
  codeFormatHexBtn.classList.toggle("active", codeModeFormat === "hex");
  codeFormatRgbBtn.classList.toggle("active", codeModeFormat === "rgb");
  codeFormatHslBtn.classList.toggle("active", codeModeFormat === "hsl");

  inlineCodeFormatAutoBtn.classList.toggle("active", codeModeFormat === "auto");
  inlineCodeFormatHexBtn.classList.toggle("active", codeModeFormat === "hex");
  inlineCodeFormatRgbBtn.classList.toggle("active", codeModeFormat === "rgb");
  inlineCodeFormatHslBtn.classList.toggle("active", codeModeFormat === "hsl");
}

function nudgeSliderValue(slider, delta) {
  if (!slider || slider.disabled) {
    return;
  }
  const min = Number(slider.min || 0);
  const max = Number(slider.max || 100);
  const next = clamp(Number(slider.value) + delta, min, max);
  slider.value = String(next);
  updatePlayerPreview();
}

function wheelNudgeSlider(event, slider, normalStep, fastStep) {
  if (!slider || slider.disabled) {
    return;
  }
  event.preventDefault();
  const amount = event.shiftKey ? fastStep : normalStep;
  const direction = event.deltaY > 0 ? -1 : 1;
  nudgeSliderValue(slider, direction * amount);
}

function updateSeoMetadata() {
  const metaDescription = document.getElementById("metaDescription");
  const metaOgTitle = document.getElementById("metaOgTitle");
  const metaOgDescription = document.getElementById("metaOgDescription");
  const metaTwitterTitle = document.getElementById("metaTwitterTitle");
  const metaTwitterDescription = document.getElementById("metaTwitterDescription");

  let title = "Color Guesser - Jeu des couleurs en ligne";
  let description = "Joue a Color Guesser en mode memoire, nom de couleur ou code HEX/RGB/HSL, en solo ou en ligne.";

  if (appView === "converter") {
    title = "Color Helper - Convertisseur couleur HEX RGB HSL";
    description = "Convertisseur couleur en ligne: HEX, RGB et HSL avec apercu instantane et valeurs editables.";
  } else if (gameMode === "online") {
    title = `Color Guesser Online - ${ONLINE_MODE_LABELS[onlineMode] || "Multijoueur"}`;
    description = "Joue a Color Guesser en multijoueur: cree un salon, rejoins tes amis et compare vos scores en direct.";
  } else if (localMode === "name") {
    title = "Color Guesser - Mode Nom de couleur";
    description = "Lis un nom de couleur puis reproduis la teinte exacte avec les curseurs pour gagner un max de points.";
  } else if (localMode === "code") {
    title = "Color Guesser - Mode Code HEX RGB HSL";
    description = "Reproduis une couleur a partir d'un code HEX, RGB ou HSL et entraine ta precision colorimetrique.";
  } else {
    title = "Color Guesser - Mode Memoire";
    description = "Observe la couleur, memorise-la et reproduis-la en 5 manches pour améliorer ta memoire visuelle.";
  }

  document.title = title;
  if (metaDescription) {
    metaDescription.setAttribute("content", description);
  }
  if (metaOgTitle) {
    metaOgTitle.setAttribute("content", title);
  }
  if (metaOgDescription) {
    metaOgDescription.setAttribute("content", description);
  }
  if (metaTwitterTitle) {
    metaTwitterTitle.setAttribute("content", title);
  }
  if (metaTwitterDescription) {
    metaTwitterDescription.setAttribute("content", description);
  }
}

function setSlidersEnabled(isEnabled) {
  hueSlider.disabled = !isEnabled;
  tintSlider.disabled = !isEnabled;
  lightnessSlider.disabled = !isEnabled;
  if (guessCodeInput) {
    guessCodeInput.disabled = !isEnabled;
  }
  submitBtn.disabled = !isEnabled || (gameMode === "online" && hasSubmittedOnline);
}

function updateModeCopy() {
  if (appView === "converter") {
    const converterConfig = {
      eyebrow: "Convertisseur",
      subtitle: "Analyse une couleur et convertis-la en HEX, RGB ou HSL.",
      ctaTitle: "Assistant couleur",
      ctaSubtitle: "Passe au jeu ou au convertisseur avec le titre en haut de page.",
      startLabel: "Retour au jeu",
    };

    modeEyebrow.textContent = converterConfig.eyebrow;
    heroSubtitle.textContent = converterConfig.subtitle;
    heroCtaTitle.textContent = converterConfig.ctaTitle;
    heroCtaSubtitle.textContent = converterConfig.ctaSubtitle;
    quickStartBtn.textContent = converterConfig.startLabel;
    setTheme();
    updateSelectedModeButtons();
    updateNameDifficultyUi();
    updateGuessCodeUi();
    return;
  }

  const config = gameMode === "online" ? getOnlineModeConfig() : getLocalModeConfig();

  modeEyebrow.textContent = config.eyebrow;
  heroSubtitle.textContent = config.subtitle;
  heroCtaTitle.textContent = config.ctaTitle;
  heroCtaSubtitle.textContent = config.ctaSubtitle;
  quickStartBtn.textContent = config.startLabel;

  setTheme();
  updateSelectedModeButtons();
  updateNameDifficultyUi();
  updateOnlineModeUi();
  updateGuessCodeUi();
  updateSeoMetadata();
}

function updateAppView() {
  const isGameView = appView === "game";

  gameSection.classList.toggle("hidden", !isGameView);
  converterSection.classList.toggle("hidden", isGameView);
  onlinePanel.classList.toggle("hidden", !isGameView || gameMode !== "online");
  burgerBtn.classList.toggle("hidden", !isGameView);
  trophyBtn.classList.toggle("hidden", !isGameView);
  socialBtn.classList.toggle("hidden", !isGameView);

  brandTitle.textContent = isGameView ? "Color Guesser" : "Color Helper";
  brandTitle.setAttribute("aria-pressed", String(!isGameView));
  document.body.dataset.view = isGameView ? "game" : "converter";

  updateModeCopy();
  updateGuessCodeUi();
  updateSeoMetadata();
  updateOnlineRoomUi();

  if (!isGameView) {
    closeMenu();
    closeScoreDrawer();
    closeSocialDrawer();
  }
}

function updateResultLabels() {
  if (gameMode === "online") {
    targetLabel.textContent = getOnlineModeConfig().targetLabel;
    guessLabel.textContent = "Votre choix";
    colorNameText.classList.add("hidden");
    colorNameText.textContent = "";
    return;
  }

  const config = getLocalModeConfig();
  targetLabel.textContent = config.targetLabel;
  guessLabel.textContent = localMode === "name" ? "Couleur guessee" : "Votre choix";
  colorNameText.classList.add("hidden");
  colorNameText.textContent = "";
}

function renderStageIntro() {
  updateGuessCodeUi();

  if (gameMode === "online") {
    stageOverlay.classList.remove("passive");
    stageOverlay.textContent = getOnlineModeConfig().stageIntro;
    stageColor.style.background = "hsl(180, 25%, 78%)";
    countdown.textContent = ONLINE_MODE_LABELS[onlineMode] || "Online";
    return;
  }

  stageOverlay.classList.remove("passive");
  stageOverlay.textContent = getLocalModeConfig().stageIntro;
  stageColor.style.background = "linear-gradient(135deg, rgba(255,255,255,0.9), rgba(241,222,191,0.9))";
  countdown.textContent = "";
}

function resetSoloMatchState() {
  isSoloMatchRunning = false;
  soloRoundNumber = 0;
  soloTotalScore = 0;
  soloRoundHistory = [];
  lastSoloRandomTarget = null;
}

function resetOnlineMatchState() {
  isOnlineMatchRunning = false;
  onlineRoundNumber = 0;
  onlineRoundHistory = [];
  hasSubmittedOnline = false;
}

function clearMatchResultUi() {
  targetColor = null;
  result.classList.add("hidden");
  roundHistoryList.innerHTML = "";
  colorNameText.classList.add("hidden");
  colorNameText.textContent = "";
  scoreText.textContent = "";
  detailText.textContent = "";
}

function resetCurrentMatchState() {
  clearRoundTimers();
  resetSoloMatchState();
  resetOnlineMatchState();
  clearMatchResultUi();
  setSlidersEnabled(false);
  updateMenuButtons();
}

function setGameMode(nextMode) {
  const hasModeChanged = gameMode !== nextMode;
  if (hasModeChanged) {
    resetCurrentMatchState();
  }

  gameMode = nextMode;
  updateModeCopy();
  updateMenuButtons();
  updateOnlineModeUi();
  updateOnlineRoomUi();
  updateGuessCodeUi();

  if (appView === "game") {
    onlinePanel.classList.toggle("hidden", gameMode !== "online");
  }

  if (gameMode === "solo") {
    renderStageIntro();
  } else {
    stageOverlay.classList.remove("passive");
    stageOverlay.textContent = "En attente de manche en ligne";
    stageColor.style.background = "hsl(180, 25%, 78%)";
    countdown.textContent = "Online";
  }

  setSlidersEnabled(false);
}

function setLocalMode(nextLocalMode) {
  const switchingSoloVariant = gameMode === "solo" && localMode !== nextLocalMode;

  if (gameMode === "online") {
    leaveOnlineSession();
  }

  localMode = nextLocalMode;
  if (switchingSoloVariant) {
    resetCurrentMatchState();
  }
  if (localMode === "name") {
    refillNamedColorPool();
  }

  setGameMode("solo");
  updateResultLabels();
  updateMenuButtons();
  updateGuessCodeUi();
}

function setNameModeDifficulty(nextDifficulty) {
  nameModeDifficulty = nextDifficulty;
  refillNamedColorPool();
  updateNameDifficultyUi();
}

function setCodeModeFormat(nextFormat) {
  codeModeFormat = nextFormat;
  updateNameDifficultyUi();
}

function clearRoundTimers() {
  clearInterval(countdownInterval);
  clearTimeout(soloNextRoundTimeout);
  countdownInterval = null;
  soloNextRoundTimeout = null;
}

function renderRoundHistory(rounds) {
  roundHistoryList.innerHTML = "";

  for (const round of rounds) {
    const item = document.createElement("li");

    const label = document.createElement("span");
    label.className = "round-history-label";
    label.textContent = round.label
      ? `Manche ${round.roundNumber}: ${round.label} - ${formatScore(round.score)}/100`
      : `Manche ${round.roundNumber}: ${formatScore(round.score)}/100`;

    const swatchRow = document.createElement("div");
    swatchRow.className = "round-history-swatches";

    const targetWrap = document.createElement("span");
    targetWrap.className = "round-history-swatch-wrap";
    const targetDot = document.createElement("span");
    targetDot.className = "round-history-swatch";
    targetDot.style.background = hsl(round.target.hue, round.target.tint, round.target.lightness);
    targetWrap.appendChild(targetDot);
    targetWrap.append(" Cible");

    const guessWrap = document.createElement("span");
    guessWrap.className = "round-history-swatch-wrap";
    const guessDot = document.createElement("span");
    guessDot.className = "round-history-swatch";
    guessDot.style.background = hsl(round.guess.hue, round.guess.tint, round.guess.lightness);
    guessWrap.appendChild(guessDot);
    guessWrap.append(" Choix");

    swatchRow.appendChild(targetWrap);
    swatchRow.appendChild(guessWrap);
    item.appendChild(label);
    item.appendChild(swatchRow);
    roundHistoryList.appendChild(item);
  }
}

function toggleMenu() {
  const shouldOpen = menuDrawer.classList.contains("hidden");
  menuDrawer.classList.toggle("hidden", !shouldOpen);
  menuBackdrop.classList.toggle("hidden", !shouldOpen);
  burgerBtn.classList.toggle("open", shouldOpen);
  burgerBtn.setAttribute("aria-expanded", String(shouldOpen));
  pulseButton(burgerBtn);
}

function closeMenu() {
  menuDrawer.classList.add("hidden");
  menuBackdrop.classList.add("hidden");
  burgerBtn.classList.remove("open");
  burgerBtn.setAttribute("aria-expanded", "false");
}

function renderScorePages() {
  const localPersonalAverage = personalStats.rounds > 0 ? personalStats.totalScore / personalStats.rounds : 0;
  const stats = persistedTracking?.stats || null;
  const personalAverage = stats ? Number(stats.averageScore || 0) : localPersonalAverage;
  const bestRound = stats ? Number(stats.bestRound || 0) : personalStats.bestRound;
  const roundsCount = stats ? Number(stats.rounds || 0) : personalStats.rounds;
  const soloRounds = stats ? Number(stats.soloRounds || 0) : personalStats.soloMatches;

  const latestMatch = persistedTracking?.matches?.[0] || null;
  const latestMatchText = latestMatch
    ? `${latestMatch.source === "online" ? "Online" : "Solo"} ${latestMatch.mode} - ${formatScore(latestMatch.totalScore)} pts (${toDateTimeLabel(latestMatch.createdAt)})`
    : "Aucune partie historisee.";

  scorePagePerso.innerHTML = `
    <div class="score-metric-grid">
      <article class="score-metric"><p class="score-metric-label">Moyenne perso</p><p class="score-metric-value">${formatScore(personalAverage)}/100</p></article>
      <article class="score-metric"><p class="score-metric-label">Meilleure manche</p><p class="score-metric-value">${formatScore(bestRound)}</p></article>
      <article class="score-metric"><p class="score-metric-label">Manches jouees</p><p class="score-metric-value">${roundsCount}</p></article>
      <article class="score-metric"><p class="score-metric-label">Manches solo</p><p class="score-metric-value">${soloRounds}</p></article>
    </div>
    <p class="score-empty">Derniere partie: ${latestMatchText}</p>
  `;

  const globalEntries = Array.isArray(persistedTracking?.global)
    ? persistedTracking.global
    : [];

  if (globalEntries.length === 0) {
    scorePageGlobal.innerHTML = '<p class="score-empty">Classement global indisponible. Connecte-toi et joue quelques manches.</p>';
  } else {
    const globalRows = globalEntries
      .map((entry) => `<li>${entry.username}: ${formatScore(entry.averageScore)}/100 (${entry.rounds} manches)</li>`)
      .join("");
    scorePageGlobal.innerHTML = `<ol class="score-list">${globalRows}</ol>`;
  }

  const roundHistoryEntries = Array.isArray(persistedTracking?.rounds)
    ? persistedTracking.rounds
    : [];

  scorePageHistory.innerHTML = `
    <div class="score-history-controls">
      <select id="historySourceSelect" aria-label="Filtrer par source">
        <option value="all" ${historySourceFilter === "all" ? "selected" : ""}>Toutes sources</option>
        <option value="solo" ${historySourceFilter === "solo" ? "selected" : ""}>Solo</option>
        <option value="online" ${historySourceFilter === "online" ? "selected" : ""}>Online</option>
      </select>
      <select id="historyModeSelect" aria-label="Filtrer par mode">
        <option value="all" ${historyModeFilter === "all" ? "selected" : ""}>Tous modes</option>
        <option value="memory" ${historyModeFilter === "memory" ? "selected" : ""}>Memoire</option>
        <option value="name" ${historyModeFilter === "name" ? "selected" : ""}>Nom couleur</option>
        <option value="code" ${historyModeFilter === "code" ? "selected" : ""}>Code</option>
      </select>
      <select id="historyPeriodSelect" aria-label="Filtrer par periode">
        <option value="7d" ${historyPeriodFilter === "7d" ? "selected" : ""}>7 jours</option>
        <option value="30d" ${historyPeriodFilter === "30d" ? "selected" : ""}>30 jours</option>
        <option value="all" ${historyPeriodFilter === "all" ? "selected" : ""}>Tout</option>
      </select>
    </div>
    <div class="score-history-toolbar">
      <p id="historyCount" class="score-empty"></p>
      <button id="historyExportBtn" class="btn btn-ghost" type="button">Exporter CSV</button>
    </div>
    <ol id="historyRoundsList" class="score-history-list"></ol>
  `;

  const sourceSelect = document.getElementById("historySourceSelect");
  const modeSelect = document.getElementById("historyModeSelect");
  const periodSelect = document.getElementById("historyPeriodSelect");
  const exportBtn = document.getElementById("historyExportBtn");
  const list = document.getElementById("historyRoundsList");
  const count = document.getElementById("historyCount");

  const now = Date.now();
  const periodLimitMs = historyPeriodFilter === "7d"
    ? 7 * 24 * 60 * 60 * 1000
    : historyPeriodFilter === "30d"
      ? 30 * 24 * 60 * 60 * 1000
      : null;

  const filteredRounds = roundHistoryEntries.filter((entry) => {
    const sourceOk = historySourceFilter === "all" || entry.source === historySourceFilter;
    const modeOk = historyModeFilter === "all" || entry.mode === historyModeFilter;
    const periodOk = periodLimitMs === null || (now - Number(entry.createdAt || 0)) <= periodLimitMs;
    return sourceOk && modeOk && periodOk;
  });

  count.textContent = `${filteredRounds.length} manche(s) historisee(s)`;

  if (filteredRounds.length === 0) {
    const item = document.createElement("li");
    item.className = "score-empty";
    item.textContent = "Aucune manche pour les filtres actuels.";
    list.appendChild(item);
  } else {
    for (const round of filteredRounds) {
      const item = document.createElement("li");
      const sourceLabel = round.source === "online" ? "Online" : "Solo";
      const modeLabel = ONLINE_MODE_LABELS[round.mode] || round.mode;
      const labelText = round.label ? ` | ${round.label}` : "";
      item.textContent = `${toDateTimeLabel(round.createdAt)} - ${sourceLabel}/${modeLabel} - ${formatScore(round.score)}/100${labelText}`;
      list.appendChild(item);
    }
  }

  const toCsvValue = (value) => {
    const raw = String(value ?? "");
    return `"${raw.replace(/"/g, '""')}"`;
  };

  const exportHistoryCsv = () => {
    if (filteredRounds.length === 0) {
      setOnlineStatus("Aucune ligne a exporter pour ces filtres.");
      return;
    }

    const header = [
      "createdAt",
      "source",
      "mode",
      "roomCode",
      "roundNumber",
      "maxRounds",
      "score",
      "hueDiff",
      "tintDiff",
      "lightnessDiff",
      "label",
    ];

    const lines = filteredRounds.map((entry) => [
      new Date(Number(entry.createdAt || 0)).toISOString(),
      entry.source || "",
      entry.mode || "",
      entry.roomCode || "",
      entry.roundNumber ?? "",
      entry.maxRounds ?? "",
      entry.score ?? "",
      entry.hueDiff ?? "",
      entry.tintDiff ?? "",
      entry.lightnessDiff ?? "",
      entry.label || "",
    ].map(toCsvValue).join(","));

    const csv = [header.join(","), ...lines].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `color-game-history-${Date.now()}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  sourceSelect.addEventListener("change", () => {
    historySourceFilter = sourceSelect.value;
    renderScorePages();
  });

  modeSelect.addEventListener("change", () => {
    historyModeFilter = modeSelect.value;
    renderScorePages();
  });

  periodSelect.addEventListener("change", () => {
    historyPeriodFilter = periodSelect.value;
    renderScorePages();
  });

  exportBtn.addEventListener("click", exportHistoryCsv);
}

function renderSocialPanel() {
  if (!socialPage) {
    return;
  }

  if (!authenticatedUser) {
    socialPage.innerHTML = '<p class="score-empty">Connecte-toi pour acceder aux amis, invitations et messages.</p>';
    return;
  }

  const incomingRequestRows = incomingFriendRequests.length > 0
    ? incomingFriendRequests
      .map((request) => `<li><strong>${request.username}</strong> <span class="social-meta">${toDateTimeLabel(request.createdAt)}</span><div class="social-actions-row"><button class="btn btn-ghost" data-friend-request-action="accept" data-request-id="${request.id}" type="button">Accepter</button><button class="btn btn-ghost" data-friend-request-action="decline" data-request-id="${request.id}" type="button">Refuser</button></div></li>`)
      .join("")
    : '<li class="score-empty">Aucune demande recue.</li>';

  const outgoingRequestRows = outgoingFriendRequests.length > 0
    ? outgoingFriendRequests
      .map((request) => `<li><strong>${request.username}</strong> (${toDateTimeLabel(request.createdAt)})</li>`)
      .join("")
    : '<li class="score-empty">Aucune demande envoyee.</li>';

  const normalizedFriendQuery = socialFriendSearch.trim().toLowerCase();
  const filteredAndSortedFriends = friendsData
    .filter((friend) => !normalizedFriendQuery || String(friend.username || "").toLowerCase().includes(normalizedFriendQuery))
    .sort((a, b) => {
      if (socialFriendSort === "score") {
        return Number(b.averageScore || 0) - Number(a.averageScore || 0);
      }
      if (socialFriendSort === "recent") {
        return Number(b.lastSeenAt || 0) - Number(a.lastSeenAt || 0);
      }

      const onlineGap = Number(b.isOnline) - Number(a.isOnline);
      if (onlineGap !== 0) {
        return onlineGap;
      }
      return String(a.username || "").localeCompare(String(b.username || ""), "fr");
    });

  const friendRows = filteredAndSortedFriends.length > 0
    ? filteredAndSortedFriends
      .map((friend) => {
        const roomDetails = friend.currentRoomCode
          ? ` (salon ${friend.currentRoomCode}${friend.isInMatch ? ", en partie" : ""})`
          : "";
        const statusClass = friend.isOnline ? "online" : "offline";
        const statusText = friend.isOnline
          ? `En ligne${roomDetails}`
          : `Hors ligne (vu: ${getLastSeenLabel(friend.lastSeenAt)})`;
        const unreadCount = Number(friend.unreadCount || 0);
        const unreadPill = unreadCount > 0
          ? `<span class="social-status-pill unread">${unreadCount} non lu${unreadCount > 1 ? "s" : ""}</span>`
          : "";
        return `<li><strong>${friend.username}</strong><div class="social-meta"><span class="social-status-pill ${statusClass}">${friend.isOnline ? "ONLINE" : "OFFLINE"}</span>${unreadPill}${statusText}</div><div class="social-actions-row"><button class="btn btn-ghost" data-social-invite-user-id="${friend.id}" type="button">Inviter</button><button class="btn btn-ghost" data-social-open-chat-user-id="${friend.id}" type="button">Message</button></div></li>`;
      })
      .join("")
    : '<li class="score-empty">Aucun ami trouve pour ce filtre.</li>';

  const incomingInviteRows = incomingSocialInvites.length > 0
    ? incomingSocialInvites
      .map((invite) => `<li><strong>${invite.fromUsername}</strong> <span class="social-meta">invitation ${invite.roomCode} - ${toDateTimeLabel(invite.createdAt)}</span><div class="social-actions-row"><button class="btn btn-ghost" data-social-join-room="${invite.roomCode}" type="button">Rejoindre</button><button class="btn btn-ghost" data-social-invite-action="decline" data-invite-id="${invite.id}" type="button">Ignorer</button></div></li>`)
      .join("")
    : '<li class="score-empty">Aucune invitation recue.</li>';

  const outgoingInviteRows = outgoingSocialInvites.length > 0
    ? outgoingSocialInvites
      .map((invite) => `<li><strong>${invite.toUsername}</strong> - salon ${invite.roomCode} (${toDateTimeLabel(invite.createdAt)})</li>`)
      .join("")
    : '<li class="score-empty">Aucune invitation envoyee.</li>';

  const onlineCount = friendsData.filter((friend) => friend.isOnline).length;
  const selectedFriendId = socialSelectedFriendId || (friendsData[0]?.id ?? null);
  const friendSelectOptions = friendsData
    .map((friend) => `<option value="${friend.id}" ${Number(selectedFriendId) === Number(friend.id) ? "selected" : ""}>${friend.username}</option>`)
    .join("");

  const messageRows = socialMessages.length > 0
    ? socialMessages
      .map((entry) => `<li><strong>${entry.isMine ? "Moi" : entry.fromUsername}</strong>: ${entry.message} <span class="score-empty">(${toDateTimeLabel(entry.createdAt)})</span></li>`)
      .join("")
    : '<li class="score-empty">Aucun message pour cette conversation.</li>';

  socialPage.innerHTML = `
    <div class="social-layout">
    <section class="social-section">
      <p class="social-section-title">Ajouter un ami</p>
      <div class="score-history-toolbar">
      <input id="friendUsernameInput" type="text" maxlength="20" placeholder="Pseudo ami" />
      <button id="friendAddBtn" class="btn btn-ghost" type="button">Envoyer demande</button>
      <button id="friendRefreshBtn" class="btn btn-ghost" type="button">Actualiser</button>
    </div>
      <p class="social-meta">${friendsData.length} ami(s), ${onlineCount} en ligne.</p>
    </section>

    <section class="social-section">
      <p class="social-section-title">Demandes d'ami</p>
      <p class="social-meta">Recues</p>
      <ol class="social-list">${incomingRequestRows}</ol>
      <p class="social-meta" style="margin-top:0.4rem;">Envoyees</p>
      <ol class="social-list">${outgoingRequestRows}</ol>
    </section>

    <section class="social-section">
      <p class="social-section-title">Amis</p>
      <div class="score-history-toolbar">
        <input id="socialFriendSearchInput" type="text" maxlength="30" value="${socialFriendSearch}" placeholder="Rechercher un ami" />
        <select id="socialFriendSortSelect">
          <option value="status" ${socialFriendSort === "status" ? "selected" : ""}>Trier: statut</option>
          <option value="score" ${socialFriendSort === "score" ? "selected" : ""}>Trier: score</option>
          <option value="recent" ${socialFriendSort === "recent" ? "selected" : ""}>Trier: recent</option>
        </select>
      </div>
      <ol class="social-list">${friendRows}</ol>
    </section>

    <section class="social-section">
      <p class="social-section-title">Invitations de salon</p>
      <p class="social-meta">Recues</p>
      <ol class="social-list">${incomingInviteRows}</ol>
      <p class="social-meta" style="margin-top:0.4rem;">Envoyees</p>
      <ol class="social-list">${outgoingInviteRows}</ol>
    </section>

    <section class="social-section">
      <p class="social-section-title">Messages prives</p>
      <div class="score-history-toolbar">
      <select id="socialMessageFriendSelect">${friendSelectOptions || "<option value=''>Aucun ami</option>"}</select>
      <input id="socialMessageInput" type="text" maxlength="260" placeholder="Ecris un message" />
      <button id="socialMessageSendBtn" class="btn btn-ghost" type="button">Envoyer</button>
    </div>
      <ol class="social-list">${messageRows}</ol>
    </section>
    </div>
  `;

  const friendInput = document.getElementById("friendUsernameInput");
  const friendAddBtn = document.getElementById("friendAddBtn");
  const friendRefreshBtn = document.getElementById("friendRefreshBtn");
  const socialFriendSearchInput = document.getElementById("socialFriendSearchInput");
  const socialFriendSortSelect = document.getElementById("socialFriendSortSelect");
  const messageFriendSelect = document.getElementById("socialMessageFriendSelect");
  const messageInput = document.getElementById("socialMessageInput");
  const messageSendBtn = document.getElementById("socialMessageSendBtn");

  if (friendAddBtn) {
    friendAddBtn.addEventListener("click", async () => {
      const username = friendInput?.value?.trim() || "";
      if (!username) {
        authStatus.textContent = "Entre un pseudo ami.";
        return;
      }
      await addFriend(username);
    });
  }

  if (friendRefreshBtn) {
    friendRefreshBtn.addEventListener("click", async () => {
      await refreshFriendsData();
      await refreshSocialInvites();
    });
  }

  if (socialFriendSearchInput) {
    socialFriendSearchInput.addEventListener("input", () => {
      socialFriendSearch = socialFriendSearchInput.value || "";
      renderSocialPanel();
    });
  }

  if (socialFriendSortSelect) {
    socialFriendSortSelect.addEventListener("change", () => {
      socialFriendSort = socialFriendSortSelect.value || "status";
      renderSocialPanel();
    });
  }

  if (messageFriendSelect) {
    messageFriendSelect.addEventListener("change", async () => {
      socialSelectedFriendId = Number(messageFriendSelect.value || 0) || null;
      await refreshSocialMessages();
    });
  }

  if (messageSendBtn) {
    messageSendBtn.addEventListener("click", async () => {
      const friendId = Number(messageFriendSelect?.value || 0);
      const message = messageInput?.value?.trim() || "";
      if (!friendId || !message) {
        return;
      }
      await sendSocialMessage(friendId, message);
      if (messageInput) {
        messageInput.value = "";
      }
    });
  }

  const friendRequestButtons = socialPage.querySelectorAll("button[data-friend-request-action]");
  for (const button of friendRequestButtons) {
    button.addEventListener("click", async () => {
      const requestId = Number(button.getAttribute("data-request-id") || 0);
      const action = button.getAttribute("data-friend-request-action") || "";
      await respondToFriendRequest(requestId, action);
    });
  }

  const inviteFriendButtons = socialPage.querySelectorAll("button[data-social-invite-user-id]");
  for (const button of inviteFriendButtons) {
    button.addEventListener("click", async () => {
      const friendId = Number(button.getAttribute("data-social-invite-user-id") || 0);
      await sendSocialInvite(friendId);
    });
  }

  const openChatButtons = socialPage.querySelectorAll("button[data-social-open-chat-user-id]");
  for (const button of openChatButtons) {
    button.addEventListener("click", async () => {
      const friendId = Number(button.getAttribute("data-social-open-chat-user-id") || 0);
      socialSelectedFriendId = friendId;
      await refreshSocialMessages();
    });
  }

  const joinRoomButtons = socialPage.querySelectorAll("button[data-social-join-room]");
  for (const button of joinRoomButtons) {
    button.addEventListener("click", () => {
      const roomCode = String(button.getAttribute("data-social-join-room") || "").trim().toUpperCase();
      if (!roomCode) {
        return;
      }
      joinRoomFromSocial(roomCode);
    });
  }

  const inviteActionButtons = socialPage.querySelectorAll("button[data-social-invite-action]");
  for (const button of inviteActionButtons) {
    button.addEventListener("click", async () => {
      const inviteId = Number(button.getAttribute("data-invite-id") || 0);
      const action = button.getAttribute("data-social-invite-action") || "";
      await respondToSocialInvite(inviteId, action);
    });
  }
}

function setScorePage(nextPage) {
  scorePage = nextPage;
  scoreTabPersoBtn.classList.toggle("active", scorePage === "perso");
  scoreTabGlobalBtn.classList.toggle("active", scorePage === "global");
  scoreTabHistoryBtn.classList.toggle("active", scorePage === "history");

  scorePagePerso.classList.toggle("hidden", scorePage !== "perso");
  scorePageGlobal.classList.toggle("hidden", scorePage !== "global");
  scorePageHistory.classList.toggle("hidden", scorePage !== "history");
}

function closeScoreDrawer() {
  scoreDrawer.classList.add("hidden");
  scoreBackdrop.classList.add("hidden");
  trophyBtn.classList.remove("open");
  trophyBtn.setAttribute("aria-expanded", "false");
}

function toggleScoreDrawer() {
  const shouldOpen = scoreDrawer.classList.contains("hidden");
  if (shouldOpen) {
    closeMenu();
    closeSocialDrawer();
    renderScorePages();
  }

  scoreDrawer.classList.toggle("hidden", !shouldOpen);
  scoreBackdrop.classList.toggle("hidden", !shouldOpen);
  trophyBtn.classList.toggle("open", shouldOpen);
  trophyBtn.setAttribute("aria-expanded", String(shouldOpen));
  pulseButton(trophyBtn);
}

function closeSocialDrawer() {
  if (!socialDrawer || !socialBackdrop || !socialBtn) {
    return;
  }
  socialDrawer.classList.add("hidden");
  socialBackdrop.classList.add("hidden");
  socialBtn.classList.remove("open");
  socialBtn.setAttribute("aria-expanded", "false");
}

async function toggleSocialDrawer() {
  if (!socialDrawer || !socialBackdrop || !socialBtn) {
    return;
  }

  const shouldOpen = socialDrawer.classList.contains("hidden");
  if (shouldOpen) {
    closeMenu();
    closeScoreDrawer();
    await refreshFriendsData();
    await refreshSocialInvites();
    await refreshSocialMessages();
    renderSocialPanel();
  }

  socialDrawer.classList.toggle("hidden", !shouldOpen);
  socialBackdrop.classList.toggle("hidden", !shouldOpen);
  socialBtn.classList.toggle("open", shouldOpen);
  socialBtn.setAttribute("aria-expanded", String(shouldOpen));
  pulseButton(socialBtn);
}

function updateMenuButtons() {
  if (gameMode === "online") {
    if (!isOnlineMatchRunning) {
      menuStartOnlineMatchBtn.textContent = `Lancer la partie online (${MATCH_ROUNDS} manches)`;
      menuStartOnlineMatchBtn.disabled = !(socket && currentRoomCode && isHost && onlinePlayersCount > 0);
    } else if (onlineRoundNumber < onlineTotalRounds) {
      menuStartOnlineMatchBtn.textContent = "Partie online en cours...";
      menuStartOnlineMatchBtn.disabled = true;
    } else {
      menuStartOnlineMatchBtn.textContent = "Partie terminee";
      menuStartOnlineMatchBtn.disabled = true;
    }
  }

  const hideInSolo = gameMode === "solo" && isSoloMatchRunning;
  const hideInOnline = gameMode === "online" && isOnlineMatchRunning;
  quickStartBtn.classList.toggle("hidden", hideInSolo || hideInOnline);
}

function updatePlayerPreview() {
  const h = Number(hueSlider.value);
  const s = Number(tintSlider.value);
  const l = Number(lightnessSlider.value);
  hueValue.textContent = String(h);
  tintValue.textContent = `${s}%`;
  lightnessValue.textContent = `${l}%`;
  updateSliderImpactBars(h, s, l);
  playerPreview.style.background = hsl(h, s, l);
  syncGuessCodeFromSliders();
}

function updateSliderImpactBars(h, s, l) {
  hueImpactBar.style.setProperty("--progress", `${Math.round((h / 360) * 100)}%`);
  tintImpactBar.style.setProperty("--progress", `${s}%`);
  lightnessImpactBar.style.setProperty("--progress", `${l}%`);

  // Teinte: cercle chromatique complet avec saturation/luminosite courantes.
  hueImpactBar.style.background = `linear-gradient(90deg,
    hsl(0, ${s}%, ${l}%),
    hsl(60, ${s}%, ${l}%),
    hsl(120, ${s}%, ${l}%),
    hsl(180, ${s}%, ${l}%),
    hsl(240, ${s}%, ${l}%),
    hsl(300, ${s}%, ${l}%),
    hsl(360, ${s}%, ${l}%))`;

  // Saturation: du gris vers la couleur vive a teinte/luminosite fixes.
  tintImpactBar.style.background = `linear-gradient(90deg, hsl(${h}, 0%, ${l}%), hsl(${h}, 100%, ${l}%))`;

  // Luminosite: du sombre vers lumineux a teinte/saturation fixes.
  lightnessImpactBar.style.background = `linear-gradient(90deg, hsl(${h}, ${s}%, 0%), hsl(${h}, ${s}%, 50%), hsl(${h}, ${s}%, 100%))`;
}

function beginRound() {
  if (gameMode !== "solo") {
    return;
  }

  clearRoundTimers();
  targetColor = getTargetForRound();
  updateResultLabels();

  if (localMode === "name") {
    stageOverlay.classList.remove("passive");
    stageOverlay.innerHTML = `<div class="name-mode-card"><span>Nom de couleur</span><strong>${targetColor.name}</strong></div>`;
    stageColor.style.background = "linear-gradient(135deg, rgba(34,31,27,0.98), rgba(67,58,50,0.95))";
    countdown.textContent = "Libre";
    setSlidersEnabled(true);
    return;
  }

  if (localMode === "code") {
    stageOverlay.classList.remove("passive");
    stageOverlay.innerHTML = `<div class="name-mode-card"><span>${targetColor.codeFormat}</span><strong>${targetColor.code}</strong></div>`;
    stageColor.style.background = "linear-gradient(135deg, rgba(16,23,34,0.98), rgba(32,52,78,0.95))";
    countdown.textContent = "Libre";
    setSlidersEnabled(true);
    return;
  } else {
    stageOverlay.classList.add("passive");
    stageOverlay.textContent = "Memorise cette couleur";
    stageColor.style.background = hsl(targetColor.hue, targetColor.tint, targetColor.lightness);
  }

  countdown.textContent = `${SHOW_DURATION_SECONDS}s`;
  setSlidersEnabled(false);

  let remaining = SHOW_DURATION_SECONDS;
  countdownInterval = setInterval(() => {
    remaining -= 1;
    countdown.textContent = `${Math.max(remaining, 0)}s`;

    if (remaining <= 0) {
      clearInterval(countdownInterval);
      hideTargetAndEnableGuess();
    }
  }, 1000);
}

function startSoloMatchOrNextRound() {
  if (!isSoloMatchRunning || soloRoundNumber >= MATCH_ROUNDS) {
    isSoloMatchRunning = true;
    personalStats.soloMatches += 1;
    soloRoundNumber = 0;
    soloTotalScore = 0;
    soloRoundHistory = [];
    lastSoloRandomTarget = null;
    if (localMode === "name") {
      refillNamedColorPool();
    }
    result.classList.add("hidden");
  }

  soloRoundNumber += 1;
  updateMenuButtons();
  beginRound();
}

function hideTargetAndEnableGuess() {
  stageOverlay.classList.remove("passive");
  stageOverlay.textContent = getLocalModeConfig().stageHidden;
  stageColor.style.background = "repeating-linear-gradient(135deg, #e9ddc7 0 12px, #f8f1e4 12px 24px)";
  countdown.textContent = "A toi";
  setSlidersEnabled(true);
}

function scoreGuess() {
  if (gameMode !== "solo" || !targetColor) {
    return;
  }

  const guess = {
    hue: Number(hueSlider.value),
    tint: Number(tintSlider.value),
    lightness: Number(lightnessSlider.value),
  };

  const hueDiffRaw = Math.abs(guess.hue - targetColor.hue);
  const hueDiff = Math.min(hueDiffRaw, 360 - hueDiffRaw);
  const tintDiff = Math.abs(guess.tint - targetColor.tint);
  const lightnessDiff = Math.abs(guess.lightness - targetColor.lightness);

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

  soloTotalScore += score;
  personalStats.rounds += 1;
  personalStats.totalScore += score;
  personalStats.bestRound = Math.max(personalStats.bestRound, score);
  soloRoundHistory.push({
    roundNumber: soloRoundNumber,
    score,
    target: { ...targetColor },
    guess,
    label: targetColor.name || targetColor.code || null,
  });

  trackSoloRound({
    mode: localMode,
    roundNumber: soloRoundNumber,
    maxRounds: MATCH_ROUNDS,
    score,
    hueDiff,
    tintDiff,
    lightnessDiff,
    target: { ...targetColor },
    guess,
    label: targetColor.name || targetColor.code || null,
  }).then(() => {
    refreshPersistedTracking();
  });

  targetSwatch.style.background = hsl(targetColor.hue, targetColor.tint, targetColor.lightness);
  guessSwatch.style.background = hsl(guess.hue, guess.tint, guess.lightness);

  if (localMode === "name" && targetColor.name) {
    colorNameText.textContent = `Nom de la couleur: ${targetColor.name}`;
    colorNameText.classList.remove("hidden");
  } else if (localMode === "code" && targetColor.code) {
    colorNameText.textContent = `Code couleur (${targetColor.codeFormat}): ${targetColor.code}`;
    colorNameText.classList.remove("hidden");
  } else {
    colorNameText.textContent = "";
    colorNameText.classList.add("hidden");
  }

  const roundsLeft = Math.max(0, MATCH_ROUNDS - soloRoundNumber);
  const average = soloTotalScore / soloRoundNumber;
  detailText.textContent = `Total: ${formatScore(soloTotalScore)} pts | Moyenne: ${formatScore(average)}/100 | Restantes: ${roundsLeft}`;

  renderRoundHistory(soloRoundHistory);
  result.classList.remove("hidden");

  const completeSoloRoundUi = () => {
    stageOverlay.classList.add("passive");
    if (soloRoundNumber >= MATCH_ROUNDS) {
      isSoloMatchRunning = false;
      stageOverlay.textContent = "Partie solo terminee. Ouvre le menu pour rejouer.";
      countdown.textContent = "FIN";
      updateMenuButtons();
    } else {
      stageOverlay.textContent = score < 45
        ? "Manche ratee. La suivante demarre automatiquement."
        : "Bonne manche. La suivante demarre automatiquement.";

      countdown.textContent = `Prochaine: ${soloRoundNumber + 1}/${MATCH_ROUNDS}`;
      soloNextRoundTimeout = setTimeout(() => {
        if (isSoloMatchRunning && soloRoundNumber < MATCH_ROUNDS) {
          soloRoundNumber += 1;
          updateMenuButtons();
          beginRound();
        }
      }, NEXT_ROUND_DELAY_MS);
    }
  };

  animateRoundScore(soloRoundNumber, MATCH_ROUNDS, score, {
    inStage: true,
    onComplete: completeSoloRoundUi,
  });

  stageColor.style.background = hsl(targetColor.hue, targetColor.tint, targetColor.lightness);
  setSlidersEnabled(false);
}

function renderPlayers(players) {
  playersList.innerHTML = "";
  const matchMaxScore = Math.max(100, (onlineTotalRounds || MATCH_ROUNDS) * 100);
  for (const player of players) {
    const item = document.createElement("li");
    const sharedScore = formatScore(Number(player.totalScore || 0));
    item.textContent = `${player.name}${player.isHost ? " (host)" : ""} - ${sharedScore}/${matchMaxScore}${player.submitted ? " - pret" : ""}`;
    playersList.appendChild(item);
  }
}

function renderLeaderboard(entries, maxScore = MATCH_ROUNDS * 100) {
  lastLeaderboardMaxScore = maxScore;
  lastLeaderboardEntries = entries.map((entry) => ({ ...entry }));
  leaderboardList.innerHTML = "";
  for (const entry of entries) {
    const item = document.createElement("li");
    item.textContent = `${entry.name}: ${formatScore(entry.score)}/${maxScore}`;
    leaderboardList.appendChild(item);
  }

  renderScorePages();
}

function renderRoomChat(messages) {
  if (!roomChatMessages) {
    return;
  }

  roomChatMessages.innerHTML = "";
  if (!messages || messages.length === 0) {
    const empty = document.createElement("li");
    empty.textContent = "Aucun message pour l'instant.";
    roomChatMessages.appendChild(empty);
    return;
  }

  for (const entry of messages) {
    const item = document.createElement("li");
    const safeName = entry.name || "Joueur";
    const text = entry.message || "";
    item.innerHTML = `<span class="chat-author">${safeName}</span>: ${text}`;
    roomChatMessages.appendChild(item);
  }

  roomChatMessages.scrollTop = roomChatMessages.scrollHeight;
}

function sendRoomChatMessage() {
  if (!socket || !currentRoomCode || !roomChatInput) {
    return;
  }

  const message = roomChatInput.value.trim();
  if (!message) {
    return;
  }

  socket.emit("chat_message", {
    roomCode: currentRoomCode,
    message,
  });
  roomChatInput.value = "";
}

function setOnlineStatus(message) {
  onlineStatus.textContent = message;
}

async function refreshPersistedTracking() {
  if (!authenticatedUser) {
    persistedTracking = null;
    renderScorePages();
    return;
  }

  try {
    const response = await fetch("/api/users/me/tracking");
    const data = await response.json();
    if (!response.ok || !data.ok) {
      persistedTracking = null;
      renderScorePages();
      return;
    }

    persistedTracking = data;
    renderScorePages();
  } catch {
    persistedTracking = null;
    renderScorePages();
  }
}

async function refreshFriendsData() {
  if (!authenticatedUser) {
    friendsData = [];
    incomingFriendRequests = [];
    outgoingFriendRequests = [];
    renderScorePages();
    renderSocialPanel();
    updateSocialBadge();
    return;
  }

  try {
    const previousPresence = new Map(friendsData.map((friend) => [Number(friend.id), !!friend.isOnline]));
    const response = await fetch("/api/friends");
    const data = await response.json();
    if (!response.ok || !data.ok) {
      friendsData = [];
      incomingFriendRequests = [];
      outgoingFriendRequests = [];
      renderScorePages();
      renderSocialPanel();
      updateSocialBadge();
      return;
    }

    friendsData = Array.isArray(data.friends) ? data.friends : [];
    incomingFriendRequests = Array.isArray(data.incomingRequests) ? data.incomingRequests : [];
    outgoingFriendRequests = Array.isArray(data.outgoingRequests) ? data.outgoingRequests : [];

    if (hasHydratedFriendsPresence) {
      const justOnline = friendsData
        .filter((friend) => !!friend.isOnline && !previousPresence.get(Number(friend.id)))
        .map((friend) => friend.username);

      if (justOnline.length > 0) {
        const message = justOnline.length === 1
          ? `Ton ami ${justOnline[0]} est en ligne.`
          : `Tes amis ${justOnline.join(", ")} sont en ligne.`;
        setOnlineStatus(message);
      }
    }

    hasHydratedFriendsPresence = true;
    renderScorePages();
    renderSocialPanel();
    updateSocialBadge();
  } catch {
    friendsData = [];
    incomingFriendRequests = [];
    outgoingFriendRequests = [];
    renderScorePages();
    renderSocialPanel();
    updateSocialBadge();
  }
}

async function refreshSocialInvites() {
  if (!authenticatedUser) {
    incomingSocialInvites = [];
    outgoingSocialInvites = [];
    renderSocialPanel();
    updateSocialBadge();
    return;
  }

  try {
    const response = await fetch("/api/social/invites");
    const data = await response.json();
    if (!response.ok || !data.ok) {
      incomingSocialInvites = [];
      outgoingSocialInvites = [];
      renderSocialPanel();
      updateSocialBadge();
      return;
    }

    incomingSocialInvites = Array.isArray(data.incomingInvites) ? data.incomingInvites : [];
    outgoingSocialInvites = Array.isArray(data.outgoingInvites) ? data.outgoingInvites : [];
    renderSocialPanel();
    updateSocialBadge();
  } catch {
    incomingSocialInvites = [];
    outgoingSocialInvites = [];
    renderSocialPanel();
    updateSocialBadge();
  }
}

async function refreshSocialMessages() {
  if (!authenticatedUser || !socialSelectedFriendId) {
    socialMessages = [];
    renderSocialPanel();
    return;
  }

  try {
    const response = await fetch(`/api/social/messages/${socialSelectedFriendId}`);
    const data = await response.json();
    if (!response.ok || !data.ok) {
      socialMessages = [];
      renderSocialPanel();
      return;
    }

    socialMessages = Array.isArray(data.messages) ? data.messages : [];
    renderSocialPanel();
  } catch {
    socialMessages = [];
    renderSocialPanel();
  }
}

async function sendSocialInvite(friendUserId) {
  if (!authenticatedUser) {
    authStatus.textContent = "Connecte-toi pour inviter un ami.";
    return;
  }

  const roomCode = currentRoomCode || roomCodeInput.value.trim().toUpperCase();
  if (!roomCode) {
    setOnlineStatus("Cree ou rejoins un salon avant d'inviter un ami.");
    return;
  }

  try {
    const response = await fetch("/api/social/invite", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ friendUserId, roomCode }),
    });
    const data = await response.json();
    if (!response.ok || !data.ok) {
      throw new Error(data.message || "Invitation impossible.");
    }

    setOnlineStatus(`Invitation envoyee vers le salon ${roomCode}.`);
    showToast(`Invitation envoyee vers ${roomCode}`);
    await refreshSocialInvites();
  } catch (error) {
    setOnlineStatus(error.message || "Erreur envoi invitation.");
  }
}

async function respondToSocialInvite(inviteId, action) {
  if (!authenticatedUser) {
    return;
  }

  try {
    const response = await fetch("/api/social/invites/respond", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ inviteId, action }),
    });
    const data = await response.json();
    if (!response.ok || !data.ok) {
      throw new Error(data.message || "Action invitation impossible.");
    }

    await refreshSocialInvites();
  } catch (error) {
    setOnlineStatus(error.message || "Erreur invitation.");
  }
}

async function sendSocialMessage(friendUserId, message) {
  if (!authenticatedUser) {
    authStatus.textContent = "Connecte-toi pour envoyer un message.";
    return;
  }

  try {
    const response = await fetch("/api/social/message", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ friendUserId, message }),
    });
    const data = await response.json();
    if (!response.ok || !data.ok) {
      throw new Error(data.message || "Message impossible.");
    }

    await refreshSocialMessages();
    showToast("Message envoye");
  } catch (error) {
    authStatus.textContent = error.message || "Erreur envoi message.";
  }
}

function joinRoomFromSocial(roomCode) {
  if (!socket) {
    setOnlineStatus("Serveur online indisponible.");
    return;
  }

  if (appView !== "game") {
    appView = "game";
    updateAppView();
  }

  setGameMode("online");
  socket.emit("join_room", {
    roomCode,
    name: getPlayerName(),
  });
  setOnlineStatus(`Tentative de connexion au salon ${roomCode}...`);
}

async function addFriend(username) {
  if (!authenticatedUser) {
    authStatus.textContent = "Connecte-toi pour ajouter des amis.";
    return;
  }

  try {
    const response = await fetch("/api/friends/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username }),
    });
    const data = await response.json();
    if (!response.ok || !data.ok) {
      throw new Error(data.message || "Impossible d'ajouter cet ami.");
    }

    authStatus.textContent = `Demande envoyee a ${data.request.toUsername}`;
    showToast(`Demande envoyee a ${data.request.toUsername}`);
    await refreshFriendsData();
  } catch (error) {
    authStatus.textContent = error.message || "Erreur lors de l'ajout d'ami.";
  }
}

async function respondToFriendRequest(requestId, action) {
  if (!authenticatedUser) {
    authStatus.textContent = "Connecte-toi pour gerer les demandes d'amis.";
    return;
  }

  try {
    const response = await fetch("/api/friends/respond", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ requestId, action }),
    });
    const data = await response.json();
    if (!response.ok || !data.ok) {
      throw new Error(data.message || "Impossible de traiter la demande.");
    }

    authStatus.textContent = action === "accept"
      ? "Demande d'ami acceptee."
      : "Demande d'ami refusee.";
    showToast(authStatus.textContent);

    await refreshFriendsData();
  } catch (error) {
    authStatus.textContent = error.message || "Erreur lors du traitement de la demande.";
  }
}

async function trackSoloRound(payload) {
  if (!authenticatedUser) {
    return;
  }

  try {
    await fetch("/api/tracking/solo-round", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch {
    // Ignore: le jeu doit rester fluide meme si le suivi echoue.
  }
}

function setAuthenticatedUser(user) {
  authenticatedUser = user;
  const isLoggedIn = !!authenticatedUser;

  logoutBtn.classList.toggle("hidden", !isLoggedIn);
  loginBtn.classList.toggle("hidden", isLoggedIn);
  registerBtn.classList.toggle("hidden", isLoggedIn);

  if (isLoggedIn) {
    authStatus.textContent = `Connecte en tant que ${authenticatedUser.username}.`;
    playerNameInput.value = authenticatedUser.username;
    authUsernameInput.value = authenticatedUser.username;
    authPasswordInput.value = "";
  } else {
    authStatus.textContent = "Non connecte.";
    persistedTracking = null;
    friendsData = [];
    incomingFriendRequests = [];
    outgoingFriendRequests = [];
    incomingSocialInvites = [];
    outgoingSocialInvites = [];
    socialMessages = [];
    socialSelectedFriendId = null;
    hasHydratedFriendsPresence = false;
    stopFriendsPolling();
  }

  if (isLoggedIn) {
    startFriendsPolling();
    showToast(`Bienvenue ${authenticatedUser.username}`);
  }

  if (!isLoggedIn) {
    updateSocialBadge();
  }

  updateAccountIdentityUi();

  renderScorePages();
  renderSocialPanel();
}

function toggleBrandTitle() {
  appView = appView === "game" ? "converter" : "game";
  updateAppView();
  pulseButton(brandTitle);
}

async function authRequest(endpoint, payload) {
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload || {}),
  });

  const data = await response.json();
  if (!response.ok || !data.ok) {
    throw new Error(data.message || "Erreur auth.");
  }

  return data;
}

async function refreshAuthSession() {
  try {
    const response = await fetch("/api/auth/me");
    const data = await response.json();
    if (!response.ok || !data.ok) {
      setAuthenticatedUser(null);
      return;
    }
    setAuthenticatedUser(data.user);
    if (data.user) {
      await refreshPersistedTracking();
      await refreshFriendsData();
      await refreshSocialInvites();
    }
  } catch {
    setAuthenticatedUser(null);
  }
}

function runReveal(target, revealMode = gameMode === "online" ? onlineMode : localMode) {
  clearRoundTimers();
  targetColor = target;
  hasSubmittedOnline = false;
  setSlidersEnabled(false);
  updateResultLabels();

  const revealConfig = gameMode === "online" ? getOnlineModeConfig() : getLocalModeConfig();

  if (revealMode === "name") {
    stageOverlay.classList.remove("passive");
    stageOverlay.innerHTML = `<div class="name-mode-card"><span>Nom couleur</span><strong>${target.name}</strong></div>`;
    stageColor.style.background = "linear-gradient(135deg, rgba(34,31,27,0.98), rgba(67,58,50,0.95))";
  } else if (revealMode === "code") {
    stageOverlay.classList.remove("passive");
    stageOverlay.innerHTML = `<div class="name-mode-card"><span>${target.codeFormat || getCodeFormatLabel(onlineCodeFormat)}</span><strong>${target.code}</strong></div>`;
    stageColor.style.background = "linear-gradient(135deg, rgba(16,23,34,0.98), rgba(32,52,78,0.95))";
  } else {
    stageOverlay.classList.add("passive");
    stageOverlay.textContent = "Memorise cette couleur";
    stageColor.style.background = hsl(target.hue, target.tint, target.lightness);
  }

  let remaining = SHOW_DURATION_SECONDS;
  countdown.textContent = `${remaining}s`;
  countdownInterval = setInterval(() => {
    remaining -= 1;
    countdown.textContent = `${Math.max(remaining, 0)}s`;

    if (remaining <= 0) {
      clearInterval(countdownInterval);
      stageOverlay.classList.remove("passive");
      if (revealMode === "name") {
        stageOverlay.innerHTML = `<div class="name-mode-card"><span>Nom couleur</span><strong>${target.name}</strong><p>Reproduis la couleur.</p></div>`;
      } else if (revealMode === "code") {
        stageOverlay.innerHTML = `<div class="name-mode-card"><span>${target.codeFormat || getCodeFormatLabel(codeModeFormat)}</span><strong>${target.code}</strong><p>Reproduis la couleur.</p></div>`;
      } else {
        stageOverlay.textContent = revealConfig.stageHidden;
      }
      stageColor.style.background = revealMode === "name" || revealMode === "code"
        ? stageColor.style.background
        : "repeating-linear-gradient(135deg, #e9ddc7 0 12px, #f8f1e4 12px 24px)";
      countdown.textContent = "A toi";
      setSlidersEnabled(true);
    }
  }, 1000);
}

function handleOnlineResult(payload) {
  const guess = payload.guess || {
    hue: Number(hueSlider.value),
    tint: Number(tintSlider.value),
    lightness: Number(lightnessSlider.value),
  };

  if (payload.roundNumber && payload.score !== undefined) {
    personalStats.rounds += 1;
    personalStats.onlineRounds += 1;
    personalStats.totalScore += payload.score;
    personalStats.bestRound = Math.max(personalStats.bestRound, payload.score);

    const existingIndex = onlineRoundHistory.findIndex((round) => round.roundNumber === payload.roundNumber);
    const entry = {
      roundNumber: payload.roundNumber,
      score: payload.score,
      target: { ...payload.target },
      guess: { ...guess },
      label: payload.target.name || payload.target.code || null,
    };

    if (existingIndex >= 0) {
      onlineRoundHistory[existingIndex] = entry;
    } else {
      onlineRoundHistory.push(entry);
    }
  }

  const matchMaxScore = (payload.maxRounds || onlineTotalRounds || MATCH_ROUNDS) * 100;

  targetSwatch.style.background = hsl(payload.target.hue, payload.target.tint, payload.target.lightness);
  guessSwatch.style.background = hsl(guess.hue, guess.tint, guess.lightness);

  if (payload.target.name) {
    colorNameText.textContent = `Nom de la couleur: ${payload.target.name}`;
    colorNameText.classList.remove("hidden");
  } else if (payload.target.code) {
    colorNameText.textContent = `Code couleur (${payload.target.codeFormat || ""}): ${payload.target.code}`;
    colorNameText.classList.remove("hidden");
  } else {
    colorNameText.textContent = "";
    colorNameText.classList.add("hidden");
  }

  animateRoundScore(payload.roundNumber, payload.maxRounds, payload.score, {
    inStage: true,
    onComplete: () => {
      stageOverlay.classList.add("passive");
      stageOverlay.textContent = payload.matchFinished
        ? "Partie online terminee. Ouvre le menu pour relancer."
        : "Manche terminee. Attente de la suivante.";
      countdown.textContent = payload.matchFinished ? "FIN" : `Prochaine: ${payload.roundNumber + 1}/${payload.maxRounds}`;
    },
  });
  detailText.textContent = `Ecart teinte: ${Math.round(payload.hueDiff)} deg | ecart teinture: ${Math.round(payload.tintDiff)}% | ecart luminosite: ${Math.round(payload.lightnessDiff ?? 0)}%`;

  renderRoundHistory(onlineRoundHistory);
  result.classList.remove("hidden");
  renderLeaderboard(payload.leaderboard, matchMaxScore);

  stageColor.style.background = hsl(payload.target.hue, payload.target.tint, payload.target.lightness);

  setSlidersEnabled(false);
  isOnlineMatchRunning = !payload.matchFinished;
  onlineRoundNumber = payload.roundNumber;
  onlineTotalRounds = payload.maxRounds;
  updateMenuButtons();
}

function getPlayerName() {
  return playerNameInput.value.trim() || "Joueur";
}

if (socket) {
  socket.on("connect", () => setOnlineStatus("Connecte au serveur online."));
  socket.on("disconnect", () => setOnlineStatus("Connexion perdue avec le serveur."));

  socket.on("room_state", (state) => {
    currentRoomCode = state.roomCode;
    if (currentRoomCode && gameMode !== "online") {
      setGameMode("online");
    }
    isHost = state.hostId === socket.id;
    isOnlineMatchRunning = !!state.matchActive;
    onlineRoundNumber = state.roundNumber || 0;
    onlineTotalRounds = state.maxRounds || MATCH_ROUNDS;
    onlinePlayersCount = state.players.length;
    onlineMode = ["memory", "name", "code"].includes(state.mode) ? state.mode : onlineMode;
    onlineCodeFormat = ["auto", "hex", "rgb", "hsl"].includes(state.codeFormat) ? state.codeFormat : onlineCodeFormat;
    onlineChatHistory = Array.isArray(state.recentChat) ? state.recentChat : onlineChatHistory;
    renderRoomChat(onlineChatHistory);

    updateOnlineRoomUi();
    renderPlayers(state.players);
    updateOnlineModeUi();
    updateModeCopy();
    updateResultLabels();
    updateMenuButtons();
  });

  socket.on("match_started", ({ maxRounds }) => {
    isOnlineMatchRunning = true;
    onlineRoundNumber = 0;
    onlineTotalRounds = maxRounds || MATCH_ROUNDS;
    onlineRoundHistory = [];
    clearMatchResultUi();
    setSlidersEnabled(false);
    renderLeaderboard([], onlineTotalRounds * 100);
    setOnlineStatus(`Partie online lancee (${onlineTotalRounds} manches).`);
    updateMenuButtons();
  });

  socket.on("round_started", ({ target, mode, codeFormat }) => {
    if (gameMode !== "online") {
      setGameMode("online");
    }
    if (mode) {
      onlineMode = ["memory", "name", "code"].includes(mode) ? mode : onlineMode;
    }
    if (codeFormat) {
      onlineCodeFormat = ["auto", "hex", "rgb", "hsl"].includes(codeFormat) ? codeFormat : onlineCodeFormat;
    }
    updateOnlineModeUi();
    setOnlineStatus("Manche demarree.");
    runReveal(target, gameMode === "online" ? onlineMode : localMode);
  });

  socket.on("guess_phase", () => {
    hasSubmittedOnline = false;
    stageOverlay.classList.remove("passive");
    if (gameMode === "online" && targetColor && onlineMode === "name" && targetColor.name) {
      stageOverlay.innerHTML = `<div class="name-mode-card"><span>Nom couleur</span><strong>${targetColor.name}</strong><p>Reproduis la couleur.</p></div>`;
    } else if (gameMode === "online" && targetColor && onlineMode === "code" && targetColor.code) {
      stageOverlay.innerHTML = `<div class="name-mode-card"><span>${targetColor.codeFormat || getCodeFormatLabel(onlineCodeFormat)}</span><strong>${targetColor.code}</strong><p>Reproduis la couleur.</p></div>`;
    } else {
      stageOverlay.textContent = gameMode === "online"
        ? getOnlineModeConfig().stageHidden
        : getLocalModeConfig().stageHidden;
    }
    stageColor.style.background = "repeating-linear-gradient(135deg, #e9ddc7 0 12px, #f8f1e4 12px 24px)";
    countdown.textContent = "A toi";
    setSlidersEnabled(true);
  });

  socket.on("room_chat_message", (entry) => {
    if (!entry || !entry.message) {
      return;
    }

    onlineChatHistory.push(entry);
    if (onlineChatHistory.length > 30) {
      onlineChatHistory.splice(0, onlineChatHistory.length - 30);
    }
    renderRoomChat(onlineChatHistory);
  });

  socket.on("round_result", (payload) => {
    if (payload.playerId === socket.id) {
      handleOnlineResult(payload);
    }
  });

  socket.on("round_result_broadcast", ({ target, leaderboard }) => {
    targetColor = target;
    renderLeaderboard(leaderboard, onlineTotalRounds * 100);
  });

  socket.on("match_finished", ({ leaderboard, maxRounds }) => {
    isOnlineMatchRunning = false;
    onlineRoundNumber = maxRounds || MATCH_ROUNDS;
    renderLeaderboard(leaderboard, (maxRounds || MATCH_ROUNDS) * 100);
    setOnlineStatus("Partie online terminee. Le host peut relancer depuis le menu.");
    updateMenuButtons();
  });

  socket.on("error_message", (message) => setOnlineStatus(message));
}

createRoomBtn.addEventListener("click", () => {
  if (!socket) {
    setOnlineStatus("Serveur online indisponible. Lance le serveur Node.");
    return;
  }

  socket.emit("create_room", { name: getPlayerName(), mode: onlineMode, codeFormat: onlineCodeFormat });
  setOnlineStatus("Salon cree. Partage le code.");
});

joinRoomBtn.addEventListener("click", () => {
  if (!socket) {
    setOnlineStatus("Serveur online indisponible. Lance le serveur Node.");
    return;
  }

  const roomCode = roomCodeInput.value.trim().toUpperCase();
  if (!roomCode) {
    setOnlineStatus("Entre un code salon pour rejoindre.");
    roomCodeInput.focus();
    return;
  }
  socket.emit("join_room", { roomCode, name: getPlayerName() });
  setOnlineStatus("Tentative de connexion au salon...");
});

if (changeRoomBtn) {
  changeRoomBtn.addEventListener("click", () => {
    changeOnlineRoom();
  });
}

if (copyRoomCodeBtn) {
  copyRoomCodeBtn.addEventListener("click", async () => {
    if (!currentRoomCode) {
      return;
    }

    try {
      await navigator.clipboard.writeText(currentRoomCode);
      setOnlineStatus(`Code du salon copie: ${currentRoomCode}`);
    } catch {
      setOnlineStatus(`Copie impossible. Code du salon: ${currentRoomCode}`);
    }
  });
}

if (heroOpenOnlinePanelBtn) {
  heroOpenOnlinePanelBtn.addEventListener("click", () => {
    const panel = document.getElementById("onlinePanel");
    if (panel) {
      panel.classList.remove("hidden");
      panel.scrollIntoView({ block: "start", behavior: "smooth" });
    }
    if (gameMode !== "online") {
      setGameMode("online");
    }
  });
}

if (heroCopyRoomCodeBtn) {
  heroCopyRoomCodeBtn.addEventListener("click", async () => {
    if (!currentRoomCode) {
      return;
    }

    try {
      await navigator.clipboard.writeText(currentRoomCode);
      setOnlineStatus(`Code du salon copie: ${currentRoomCode}`);
    } catch {
      setOnlineStatus(`Copie impossible. Code du salon: ${currentRoomCode}`);
    }
  });
}

if (roomChatSendBtn) {
  roomChatSendBtn.addEventListener("click", () => {
    pulseButton(roomChatSendBtn);
    sendRoomChatMessage();
  });
}

if (roomChatInput) {
  roomChatInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      sendRoomChatMessage();
    }
  });
}

menuStartOnlineMatchBtn.addEventListener("click", () => {
  pulseButton(menuStartOnlineMatchBtn);
  if (!socket || !currentRoomCode || !isHost) {
    return;
  }
  socket.emit("start_match", { roomCode: currentRoomCode });
});

onlineMemoryModeBtn.addEventListener("click", () => {
  pulseButton(onlineMemoryModeBtn);
  setOnlineMode("memory");
});

onlineNameModeBtn.addEventListener("click", () => {
  pulseButton(onlineNameModeBtn);
  setOnlineMode("name");
});

onlineCodeModeBtn.addEventListener("click", () => {
  pulseButton(onlineCodeModeBtn);
  setOnlineMode("code");
});

onlineCodeFormatAutoBtn.addEventListener("click", () => {
  pulseButton(onlineCodeFormatAutoBtn);
  setOnlineCodeFormat("auto");
});

onlineCodeFormatHexBtn.addEventListener("click", () => {
  pulseButton(onlineCodeFormatHexBtn);
  setOnlineCodeFormat("hex");
});

onlineCodeFormatRgbBtn.addEventListener("click", () => {
  pulseButton(onlineCodeFormatRgbBtn);
  setOnlineCodeFormat("rgb");
});

onlineCodeFormatHslBtn.addEventListener("click", () => {
  pulseButton(onlineCodeFormatHslBtn);
  setOnlineCodeFormat("hsl");
});

quickStartBtn.addEventListener("click", () => {
  pulseButton(quickStartBtn);

  if (appView === "converter") {
    appView = "game";
    updateAppView();
    return;
  }

  if (gameMode === "solo") {
    startSoloMatchOrNextRound();
    return;
  }

  if (!socket || !currentRoomCode || !isHost) {
    setOnlineStatus("En online: cree/rejoins un salon et lance en tant que host.");
    return;
  }

  socket.emit("start_match", { roomCode: currentRoomCode });
});

hueSlider.addEventListener("input", updatePlayerPreview);
tintSlider.addEventListener("input", updatePlayerPreview);
lightnessSlider.addEventListener("input", updatePlayerPreview);

if (guessCodeInput) {
  guessCodeInput.addEventListener("change", applyGuessCodeInput);
  guessCodeInput.addEventListener("blur", applyGuessCodeInput);
}
submitBtn.addEventListener("click", scoreGuess);

burgerBtn.addEventListener("click", toggleMenu);
trophyBtn.addEventListener("click", toggleScoreDrawer);
socialBtn.addEventListener("click", toggleSocialDrawer);
brandTitle.addEventListener("click", toggleBrandTitle);
brandTitle.addEventListener("keydown", (event) => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    toggleBrandTitle();
  }
});
menuBackdrop.addEventListener("click", closeMenu);
menuCloseBtn.addEventListener("click", closeMenu);
scoreBackdrop.addEventListener("click", closeScoreDrawer);
scoreCloseBtn.addEventListener("click", closeScoreDrawer);
socialBackdrop.addEventListener("click", closeSocialDrawer);
socialCloseBtn.addEventListener("click", closeSocialDrawer);

scoreTabPersoBtn.addEventListener("click", () => setScorePage("perso"));
scoreTabGlobalBtn.addEventListener("click", () => setScorePage("global"));
scoreTabHistoryBtn.addEventListener("click", () => setScorePage("history"));

registerBtn.addEventListener("click", async () => {
  pulseButton(registerBtn);
  try {
    const data = await authRequest("/api/auth/register", {
      username: authUsernameInput.value.trim(),
      password: authPasswordInput.value,
    });
    setAuthenticatedUser(data.user);
    await refreshPersistedTracking();
    await refreshFriendsData();
    await refreshSocialInvites();
  } catch (error) {
    authStatus.textContent = error.message;
  }
});

loginBtn.addEventListener("click", async () => {
  pulseButton(loginBtn);
  try {
    const data = await authRequest("/api/auth/login", {
      username: authUsernameInput.value.trim(),
      password: authPasswordInput.value,
    });
    setAuthenticatedUser(data.user);
    await refreshPersistedTracking();
    await refreshFriendsData();
    await refreshSocialInvites();
  } catch (error) {
    authStatus.textContent = error.message;
  }
});

logoutBtn.addEventListener("click", async () => {
  pulseButton(logoutBtn);
  try {
    await authRequest("/api/auth/logout", {});
  } catch {
    // Ignore et force un état déconnecté local.
  }
  setAuthenticatedUser(null);
  renderScorePages();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeMenu();
    closeScoreDrawer();
    closeSocialDrawer();
  }
});

submitBtn.addEventListener("click", () => {
  if (gameMode !== "online" || !socket || !currentRoomCode || !targetColor) {
    return;
  }

  hasSubmittedOnline = true;
  setSlidersEnabled(true);
  setOnlineStatus("Choix envoye. Attente des autres joueurs...");

  socket.emit("submit_guess", {
    roomCode: currentRoomCode,
    hue: Number(hueSlider.value),
    tint: Number(tintSlider.value),
    lightness: Number(lightnessSlider.value),
  });
});

soloModeBtn.addEventListener("click", () => {
  pulseButton(soloModeBtn);
  setLocalMode("memory");
});

nameModeBtn.addEventListener("click", () => {
  pulseButton(nameModeBtn);
  setLocalMode("name");
});

codeModeBtn.addEventListener("click", () => {
  pulseButton(codeModeBtn);
  setLocalMode("code");
});

onlineModeBtn.addEventListener("click", () => {
  pulseButton(onlineModeBtn);

  // S'assure que le panel online peut s'afficher immediatement.
  if (appView !== "game") {
    appView = "game";
    updateAppView();
  }

  setGameMode("online");
  updateResultLabels();
  updateAppView();
  updateOnlineRoomUi();
  if (heroOnlinePanel) {
    heroOnlinePanel.scrollIntoView({ block: "center", behavior: "smooth" });
  }
  closeMenu();

  if (!socket) {
    setOnlineStatus("Mode online: serveur non detecte. Lance node server.js.");
  }
});

difficultyEasyBtn.addEventListener("click", () => {
  pulseButton(difficultyEasyBtn);
  setNameModeDifficulty("easy");
});

difficultyNormalBtn.addEventListener("click", () => {
  pulseButton(difficultyNormalBtn);
  setNameModeDifficulty("normal");
});

difficultyExpertBtn.addEventListener("click", () => {
  pulseButton(difficultyExpertBtn);
  setNameModeDifficulty("expert");
});

codeFormatAutoBtn.addEventListener("click", () => {
  pulseButton(codeFormatAutoBtn);
  setCodeModeFormat("auto");
});

codeFormatHexBtn.addEventListener("click", () => {
  pulseButton(codeFormatHexBtn);
  setCodeModeFormat("hex");
});

codeFormatRgbBtn.addEventListener("click", () => {
  pulseButton(codeFormatRgbBtn);
  setCodeModeFormat("rgb");
});

codeFormatHslBtn.addEventListener("click", () => {
  pulseButton(codeFormatHslBtn);
  setCodeModeFormat("hsl");
});

inlineCodeFormatAutoBtn.addEventListener("click", () => {
  pulseButton(inlineCodeFormatAutoBtn);
  setCodeModeFormat("auto");
});

inlineCodeFormatHexBtn.addEventListener("click", () => {
  pulseButton(inlineCodeFormatHexBtn);
  setCodeModeFormat("hex");
});

inlineCodeFormatRgbBtn.addEventListener("click", () => {
  pulseButton(inlineCodeFormatRgbBtn);
  setCodeModeFormat("rgb");
});

inlineCodeFormatHslBtn.addEventListener("click", () => {
  pulseButton(inlineCodeFormatHslBtn);
  setCodeModeFormat("hsl");
});

updatePlayerPreview();
setNameModeDifficulty("normal");
updateAccountIdentityUi();
// Initialise l'app une fois que les données de couleurs sont chargées
(async () => {
  await loadNamedColorData();
  initCollapsibleSections();
  
  setCodeModeFormat("auto");
  setScorePage("perso");
  renderScorePages();
  refreshAuthSession();
  initColorConverter();
  updateAppView();
  updateModeCopy();
  updateResultLabels();
  renderStageIntro();
  setGameMode("solo");
  updateMenuButtons();
  setTheme();
})();
