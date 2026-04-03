const SHOW_DURATION_SECONDS = 5;
const FIXED_LIGHTNESS = 50;
const MATCH_ROUNDS = 5;
const NEXT_ROUND_DELAY_MS = 1400;

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
const quickStartBtn = document.getElementById("quickStartBtn");
const nameDifficultyChip = document.getElementById("nameDifficultyChip");
const codeFormatChip = document.getElementById("codeFormatChip");
const onlineModeChip = document.getElementById("onlineModeChip");
const menuBackdrop = document.getElementById("menuBackdrop");
const menuDrawer = document.getElementById("menuDrawer");
const menuCloseBtn = document.getElementById("menuCloseBtn");
const menuStartOnlineMatchBtn = document.getElementById("menuStartOnlineMatchBtn");
const scoreBackdrop = document.getElementById("scoreBackdrop");
const scoreDrawer = document.getElementById("scoreDrawer");
const scoreCloseBtn = document.getElementById("scoreCloseBtn");
const scoreTabPersoBtn = document.getElementById("scoreTabPersoBtn");
const scoreTabFriendsBtn = document.getElementById("scoreTabFriendsBtn");
const scoreTabGlobalBtn = document.getElementById("scoreTabGlobalBtn");
const scorePagePerso = document.getElementById("scorePagePerso");
const scorePageFriends = document.getElementById("scorePageFriends");
const scorePageGlobal = document.getElementById("scorePageGlobal");

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

const playerNameInput = document.getElementById("playerNameInput");
const roomCodeInput = document.getElementById("roomCodeInput");
const createRoomBtn = document.getElementById("createRoomBtn");
const joinRoomBtn = document.getElementById("joinRoomBtn");
const copyRoomCodeBtn = document.getElementById("copyRoomCodeBtn");
const onlineStatus = document.getElementById("onlineStatus");
const roomInfo = document.getElementById("roomInfo");
const playersList = document.getElementById("playersList");
const leaderboardList = document.getElementById("leaderboardList");
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

let namedColorPool = [];
let lastSoloRandomTarget = null;
let scorePage = "perso";
let lastLeaderboardEntries = [];
let isUpdatingConverter = false;
let isUpdatingGuessCode = false;
let appView = "game";
let authenticatedUser = null;

const personalStats = {
  rounds: 0,
  totalScore: 0,
  bestRound: 0,
  soloMatches: 0,
  onlineRounds: 0,
};

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

  if (!roomInfo) {
    return;
  }

  roomInfo.classList.toggle("is-empty", !hasRoom);

  if (isOnline) {
    roomInfo.textContent = hasRoom
      ? `Salon: ${currentRoomCode}`
      : "Aucun salon actif. Cree ou rejoins un salon pour commencer.";
  } else {
    roomInfo.textContent = "Mode hors ligne actif.";
  }

  if (copyRoomCodeBtn) {
    copyRoomCodeBtn.classList.toggle("hidden", !hasRoom || !isOnline);
    copyRoomCodeBtn.disabled = !hasRoom || !isOnline;
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
  hasSubmittedOnline = false;
  onlinePlayersCount = 0;
  isOnlineMatchRunning = false;
  onlineRoundNumber = 0;
  onlineTotalRounds = MATCH_ROUNDS;
  onlineRoundHistory = [];

  roomInfo.textContent = "";
  playersList.innerHTML = "";
  leaderboardList.innerHTML = "";
  renderScorePages();
  setOnlineStatus("Mode hors ligne.");
  updateOnlineRoomUi();
  updateOnlineModeUi();
  updateMenuButtons();
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

  brandTitle.textContent = isGameView ? "Color Guesser" : "Color Helper";
  brandTitle.setAttribute("aria-pressed", String(!isGameView));
  document.body.dataset.view = isGameView ? "game" : "converter";

  updateModeCopy();
  updateGuessCodeUi();
  updateSeoMetadata();

  if (!isGameView) {
    closeMenu();
    closeScoreDrawer();
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

function resetCurrentMatchState() {
  clearRoundTimers();

  isSoloMatchRunning = false;
  soloRoundNumber = 0;
  soloTotalScore = 0;
  soloRoundHistory = [];
  lastSoloRandomTarget = null;

  isOnlineMatchRunning = false;
  onlineRoundNumber = 0;
  onlineRoundHistory = [];

  targetColor = null;
  hasSubmittedOnline = false;

  result.classList.add("hidden");
  roundHistoryList.innerHTML = "";
  colorNameText.classList.add("hidden");
  colorNameText.textContent = "";
  scoreText.textContent = "";
  detailText.textContent = "";

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
  const hasModeChanged = localMode !== nextLocalMode || gameMode !== "solo";
  if (hasModeChanged) {
    resetCurrentMatchState();
  }

  leaveOnlineSession();
  localMode = nextLocalMode;
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
  const personalAverage = personalStats.rounds > 0 ? personalStats.totalScore / personalStats.rounds : 0;
  scorePagePerso.innerHTML = `
    <div class="score-metric-grid">
      <article class="score-metric"><p class="score-metric-label">Moyenne perso</p><p class="score-metric-value">${formatScore(personalAverage)}/100</p></article>
      <article class="score-metric"><p class="score-metric-label">Meilleure manche</p><p class="score-metric-value">${formatScore(personalStats.bestRound)}</p></article>
      <article class="score-metric"><p class="score-metric-label">Manches jouées</p><p class="score-metric-value">${personalStats.rounds}</p></article>
      <article class="score-metric"><p class="score-metric-label">Parties solo</p><p class="score-metric-value">${personalStats.soloMatches}</p></article>
    </div>
  `;

  if (lastLeaderboardEntries.length === 0) {
    scorePageFriends.innerHTML = '<p class="score-empty">Aucun score ami pour le moment. Lance une partie en ligne.</p>';
  } else {
    const rows = lastLeaderboardEntries
      .map((entry) => `<li>${entry.name}: ${formatScore(entry.score)}/100</li>`)
      .join("");
    scorePageFriends.innerHTML = `<ol class="score-list">${rows}</ol>`;
  }

  const globalBase = [
    ...lastLeaderboardEntries,
    { name: getPlayerName(), score: personalAverage || 0 },
    { name: "PixelFox", score: 96.2 },
    { name: "HueMaster", score: 93.4 },
    { name: "ColorNinja", score: 91.7 },
    { name: "SaturationPro", score: 88.9 },
  ];

  const globalRows = Array.from(new Map(globalBase.map((entry) => [entry.name, entry])).values())
    .sort((a, b) => b.score - a.score)
    .slice(0, 8)
    .map((entry) => `<li>${entry.name}: ${formatScore(entry.score)}/100</li>`)
    .join("");

  scorePageGlobal.innerHTML = `<ol class="score-list">${globalRows}</ol>`;
}

function setScorePage(nextPage) {
  scorePage = nextPage;
  scoreTabPersoBtn.classList.toggle("active", scorePage === "perso");
  scoreTabFriendsBtn.classList.toggle("active", scorePage === "friends");
  scoreTabGlobalBtn.classList.toggle("active", scorePage === "global");

  scorePagePerso.classList.toggle("hidden", scorePage !== "perso");
  scorePageFriends.classList.toggle("hidden", scorePage !== "friends");
  scorePageGlobal.classList.toggle("hidden", scorePage !== "global");
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
    renderScorePages();
  }

  scoreDrawer.classList.toggle("hidden", !shouldOpen);
  scoreBackdrop.classList.toggle("hidden", !shouldOpen);
  trophyBtn.classList.toggle("open", shouldOpen);
  trophyBtn.setAttribute("aria-expanded", String(shouldOpen));
  pulseButton(trophyBtn);
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
  for (const player of players) {
    const item = document.createElement("li");
    item.textContent = `${player.name}${player.isHost ? " (host)" : ""}${player.submitted ? " - pret" : ""}`;
    playersList.appendChild(item);
  }
}

function renderLeaderboard(entries) {
  lastLeaderboardEntries = entries.map((entry) => ({ ...entry }));
  leaderboardList.innerHTML = "";
  for (const entry of entries) {
    const item = document.createElement("li");
    item.textContent = `${entry.name}: ${formatScore(entry.score)}/100`;
    leaderboardList.appendChild(item);
  }

  renderScorePages();
}

function setOnlineStatus(message) {
  onlineStatus.textContent = message;
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
  }
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
      stageOverlay.textContent = revealConfig.stageHidden;
      stageColor.style.background = "repeating-linear-gradient(135deg, #e9ddc7 0 12px, #f8f1e4 12px 24px)";
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
  renderLeaderboard(payload.leaderboard);

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
    isHost = state.hostId === socket.id;
    isOnlineMatchRunning = !!state.matchActive;
    onlineRoundNumber = state.roundNumber || 0;
    onlineTotalRounds = state.maxRounds || MATCH_ROUNDS;
    onlinePlayersCount = state.players.length;
    onlineMode = ["memory", "name", "code"].includes(state.mode) ? state.mode : onlineMode;
    onlineCodeFormat = ["auto", "hex", "rgb", "hsl"].includes(state.codeFormat) ? state.codeFormat : onlineCodeFormat;

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
    setOnlineStatus(`Partie online lancee (${onlineTotalRounds} manches).`);
    updateMenuButtons();
  });

  socket.on("round_started", ({ target, mode, codeFormat }) => {
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
    stageOverlay.classList.remove("passive");
    stageOverlay.textContent = gameMode === "online"
      ? getOnlineModeConfig().stageHidden
      : getLocalModeConfig().stageHidden;
    stageColor.style.background = "repeating-linear-gradient(135deg, #e9ddc7 0 12px, #f8f1e4 12px 24px)";
    countdown.textContent = "A toi";
    setSlidersEnabled(true);
  });

  socket.on("round_result", (payload) => {
    if (payload.playerId === socket.id) {
      handleOnlineResult(payload);
    }
  });

  socket.on("round_result_broadcast", ({ target, leaderboard }) => {
    targetColor = target;
    renderLeaderboard(leaderboard);
  });

  socket.on("match_finished", ({ leaderboard, maxRounds }) => {
    isOnlineMatchRunning = false;
    onlineRoundNumber = maxRounds || MATCH_ROUNDS;
    renderLeaderboard(leaderboard);
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
  socket.emit("join_room", { roomCode, name: getPlayerName() });
  setOnlineStatus("Tentative de connexion au salon...");
});

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

scoreTabPersoBtn.addEventListener("click", () => setScorePage("perso"));
scoreTabFriendsBtn.addEventListener("click", () => setScorePage("friends"));
scoreTabGlobalBtn.addEventListener("click", () => setScorePage("global"));

registerBtn.addEventListener("click", async () => {
  pulseButton(registerBtn);
  try {
    const data = await authRequest("/api/auth/register", {
      username: authUsernameInput.value.trim(),
      password: authPasswordInput.value,
    });
    setAuthenticatedUser(data.user);
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
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeMenu();
    closeScoreDrawer();
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
  onlinePanel.classList.remove("hidden");
  onlinePanel.scrollIntoView({ block: "start", behavior: "smooth" });
  updateOnlineRoomUi();
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
// Initialise l'app une fois que les données de couleurs sont chargées
(async () => {
  await loadNamedColorData();
  
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
