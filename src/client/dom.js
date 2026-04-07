/**
 * Cache et export des éléments DOM
 * Permet une maintenabilité centralisée des sélecteurs
 */

const getCachedElement = (id) => {
  const el = document.getElementById(id);
  if (!el) {
    console.warn(`DOM element with id "${id}" not found`);
  }
  return el;
};

// Stage et jeu
export const DOM = {
  // Stage
  stageColor: getCachedElement("stageColor"),
  stageOverlay: getCachedElement("stageOverlay"),
  countdown: getCachedElement("countdown"),

  // Sliders jeu
  hueSlider: getCachedElement("hueSlider"),
  tintSlider: getCachedElement("tintSlider"),
  lightnessSlider: getCachedElement("lightnessSlider"),
  hueValue: getCachedElement("hueValue"),
  tintValue: getCachedElement("tintValue"),
  lightnessValue: getCachedElement("lightnessValue"),
  hueImpactBar: getCachedElement("hueImpactBar"),
  tintImpactBar: getCachedElement("tintImpactBar"),
  lightnessImpactBar: getCachedElement("lightnessImpactBar"),

  // Aperçu et entrée
  playerPreview: getCachedElement("playerPreview"),
  guessCodeSection: getCachedElement("guessCodeSection"),
  guessCodeInput: getCachedElement("guessCodeInput"),
  guessCodeHint: getCachedElement("guessCodeHint"),
  submitBtn: getCachedElement("submitBtn"),

  // En-têtes et sections
  modeEyebrow: getCachedElement("modeEyebrow"),
  heroSubtitle: getCachedElement("heroSubtitle"),
  heroCtaTitle: getCachedElement("heroCtaTitle"),
  heroCtaSubtitle: getCachedElement("heroCtaSubtitle"),
  brandTitle: getCachedElement("brandTitle"),
  gameSection: getCachedElement("gameSection"),
  converterSection: getCachedElement("converterSection"),

  // Résultats
  result: getCachedElement("result"),
  colorNameText: getCachedElement("colorNameText"),
  scoreText: getCachedElement("scoreText"),
  roundHistoryList: getCachedElement("roundHistoryList"),
  targetLabel: getCachedElement("targetLabel"),
  guessLabel: getCachedElement("guessLabel"),
  targetSwatch: getCachedElement("targetSwatch"),
  guessSwatch: getCachedElement("guessSwatch"),
  detailText: getCachedElement("detailText"),

  // Boutons modes
  soloModeBtn: getCachedElement("soloModeBtn"),
  nameModeBtn: getCachedElement("nameModeBtn"),
  codeModeBtn: getCachedElement("codeModeBtn"),
  onlineModeBtn: getCachedElement("onlineModeBtn"),
  onlinePanel: getCachedElement("onlinePanel"),

  // Header et navigation
  burgerBtn: getCachedElement("burgerBtn"),
  trophyBtn: getCachedElement("trophyBtn"),
  quickStartBtn: getCachedElement("quickStartBtn"),
  nameDifficultyChip: getCachedElement("nameDifficultyChip"),
  codeFormatChip: getCachedElement("codeFormatChip"),
  onlineModeChip: getCachedElement("onlineModeChip"),

  // Hero online panel
  heroOnlinePanel: getCachedElement("heroOnlinePanel"),
  heroOnlineStatus: getCachedElement("heroOnlineStatus"),
  heroOpenOnlinePanelBtn: getCachedElement("heroOpenOnlinePanelBtn"),
  heroCopyRoomCodeBtn: getCachedElement("heroCopyRoomCodeBtn"),

  // Menu
  menuBackdrop: getCachedElement("menuBackdrop"),
  menuDrawer: getCachedElement("menuDrawer"),
  menuCloseBtn: getCachedElement("menuCloseBtn"),
  menuStartOnlineMatchBtn: getCachedElement("menuStartOnlineMatchBtn"),

  // Scores drawer
  scoreBackdrop: getCachedElement("scoreBackdrop"),
  scoreDrawer: getCachedElement("scoreDrawer"),
  scoreCloseBtn: getCachedElement("scoreCloseBtn"),
  scoreTabPersoBtn: getCachedElement("scoreTabPersoBtn"),
  scoreTabFriendsBtn: getCachedElement("scoreTabFriendsBtn"),
  scoreTabGlobalBtn: getCachedElement("scoreTabGlobalBtn"),
  scorePagePerso: getCachedElement("scorePagePerso"),
  scorePageFriends: getCachedElement("scorePageFriends"),
  scorePageGlobal: getCachedElement("scorePageGlobal"),

  // Modes difficulté et format
  nameDifficultySection: getCachedElement("nameDifficultySection"),
  difficultyEasyBtn: getCachedElement("difficultyEasyBtn"),
  difficultyNormalBtn: getCachedElement("difficultyNormalBtn"),
  difficultyExpertBtn: getCachedElement("difficultyExpertBtn"),
  codeFormatSection: getCachedElement("codeFormatSection"),
  codeFormatAutoBtn: getCachedElement("codeFormatAutoBtn"),
  codeFormatHexBtn: getCachedElement("codeFormatHexBtn"),
  codeFormatRgbBtn: getCachedElement("codeFormatRgbBtn"),
  codeFormatHslBtn: getCachedElement("codeFormatHslBtn"),

  // Online modes et formats
  onlineMemoryModeBtn: getCachedElement("onlineMemoryModeBtn"),
  onlineNameModeBtn: getCachedElement("onlineNameModeBtn"),
  onlineCodeModeBtn: getCachedElement("onlineCodeModeBtn"),
  onlineCodeFormatSection: getCachedElement("onlineCodeFormatSection"),
  onlineCodeFormatAutoBtn: getCachedElement("onlineCodeFormatAutoBtn"),
  onlineCodeFormatHexBtn: getCachedElement("onlineCodeFormatHexBtn"),
  onlineCodeFormatRgbBtn: getCachedElement("onlineCodeFormatRgbBtn"),
  onlineCodeFormatHslBtn: getCachedElement("onlineCodeFormatHslBtn"),

  // Formats inline (dans le panel)
  codeFormatInlineSection: getCachedElement("codeFormatInlineSection"),
  inlineCodeFormatAutoBtn: getCachedElement("inlineCodeFormatAutoBtn"),
  inlineCodeFormatHexBtn: getCachedElement("inlineCodeFormatHexBtn"),
  inlineCodeFormatRgbBtn: getCachedElement("inlineCodeFormatRgbBtn"),
  inlineCodeFormatHslBtn: getCachedElement("inlineCodeFormatHslBtn"),

  // Authentification
  authUsernameInput: getCachedElement("authUsernameInput"),
  authPasswordInput: getCachedElement("authPasswordInput"),
  registerBtn: getCachedElement("registerBtn"),
  loginBtn: getCachedElement("loginBtn"),
  logoutBtn: getCachedElement("logoutBtn"),
  authStatus: getCachedElement("authStatus"),

  // Online (salon)
  playerNameInput: getCachedElement("playerNameInput"),
  roomCodeInput: getCachedElement("roomCodeInput"),
  createRoomBtn: getCachedElement("createRoomBtn"),
  joinRoomBtn: getCachedElement("joinRoomBtn"),
  copyRoomCodeBtn: getCachedElement("copyRoomCodeBtn"),
  onlineStatus: getCachedElement("onlineStatus"),
  roomInfo: getCachedElement("roomInfo"),
  playersList: getCachedElement("playersList"),
  leaderboardList: getCachedElement("leaderboardList"),

  // Converter
  converterColorPicker: getCachedElement("converterColorPicker"),
  converterPreviewSwatch: getCachedElement("converterPreviewSwatch"),
  converterHueSlider: getCachedElement("converterHueSlider"),
  converterSaturationSlider: getCachedElement("converterSaturationSlider"),
  converterLightnessSlider: getCachedElement("converterLightnessSlider"),
  converterHueValue: getCachedElement("converterHueValue"),
  converterSaturationValue: getCachedElement("converterSaturationValue"),
  converterLightnessValue: getCachedElement("converterLightnessValue"),
  converterHueImpactBar: getCachedElement("converterHueImpactBar"),
  converterSaturationImpactBar: getCachedElement("converterSaturationImpactBar"),
  converterLightnessImpactBar: getCachedElement("converterLightnessImpactBar"),
  converterHexInput: getCachedElement("converterHexInput"),
  converterRInput: getCachedElement("converterRInput"),
  converterGInput: getCachedElement("converterGInput"),
  converterBInput: getCachedElement("converterBInput"),
  converterHInput: getCachedElement("converterHInput"),
  converterSInput: getCachedElement("converterSInput"),
  converterLInput: getCachedElement("converterLInput"),
  converterNameText: getCachedElement("converterNameText"),
  converterHintText: getCachedElement("converterHintText"),
  copyHexBtn: getCachedElement("copyHexBtn"),
  copyRgbBtn: getCachedElement("copyRgbBtn"),
  copyHslBtn: getCachedElement("copyHslBtn"),
};
