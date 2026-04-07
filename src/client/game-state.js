/**
 * État global du jeu
 * Centralise toutes les variables d'état pour meilleure maintenabilité
 */

import { MATCH_ROUNDS } from "./constants.js";

// ====== État d'exécution animée ======
export let targetColor = null;
export let countdownInterval = null;
export let soloNextRoundTimeout = null;
export let scoreAnimationFrame = null;
export let scoreAudioContext = null;
export let scoreCompletionTimeout = null;

// Éléments DOM score générés dynamiquement
export let stageScoreValueEl = null;
export let stageScoreCardEl = null;
export let stageScoreTierEl = null;
export let stageScoreFireworksEl = null;
export let stageScoreTierId = "";

// ====== Modes de jeu ======
export let gameMode = "solo"; // "solo" | "online"
export let appView = "game"; // "game" | "converter"

// ====== Mode SOLO (hors ligne) ======
export let localMode = "memory"; // "memory" | "name" | "code"
export let nameModeDifficulty = "normal"; // "easy" | "normal" | "expert"
export let codeModeFormat = "auto"; // "auto" | "hex" | "rgb" | "hsl"

// État d'une partie solo en cours
export let soloRoundNumber = 0;
export let soloTotalScore = 0;
export let soloRoundHistory = [];
export let isSoloMatchRunning = false;
export let lastSoloRandomTarget = null;

// ====== Mode ONLINE ======
export let onlineMode = "memory"; // "memory" | "name" | "code"
export let onlineCodeFormat = "auto"; // "auto" | "hex" | "rgb" | "hsl"

// État d'une partie online en cours
export let onlineRoundNumber = 0;
export let onlineTotalRounds = MATCH_ROUNDS;
export let onlineRoundHistory = [];
export let onlinePlayersCount = 0;
export let isOnlineMatchRunning = false;
export let hasSubmittedOnline = false;

// Salon online
export let currentRoomCode = "";
export let isHost = false;

// ====== Couleurs nommées ======
export let namedColorPool = [];
export let NAMED_COLOR_BASES = [];
export let NAMED_COLOR_VARIANTS = [];

// ====== Mise à jour UI ======
export let isUpdatingConverter = false;
export let isUpdatingGuessCode = false;

// ====== Scores et leaderboard ======
export let scorePage = "perso"; // "perso" | "friends" | "global"
export let lastLeaderboardEntries = [];

export const personalStats = {
  rounds: 0,
  totalScore: 0,
  bestRound: 0,
  soloMatches: 0,
  onlineRounds: 0,
};

// ====== Authentification ======
export let authenticatedUser = null;

// ====== WebSocket ======
export const socket = typeof io === "function" ? io() : null;

// ====== Setters centralisés pour faciliter les mutations ======

export function setGameState(newState) {
  Object.assign(window.__gameState || {}, newState);
}

export function setState(key, value) {
  if (key === "gameMode") gameMode = value;
  else if (key === "localMode") localMode = value;
  else if (key === "appView") appView = value;
  else if (key === "onlineMode") onlineMode = value;
  else if (key === "currentRoomCode") currentRoomCode = value;
  else if (key === "authenticatedUser") authenticatedUser = value;
  // ... ajouter d'autres clés au besoin
}

export function getGameState() {
  return {
    gameMode,
    localMode,
    appView,
    onlineMode,
    onlineCodeFormat,
    soloRoundNumber,
    soloTotalScore,
    onlineRoundNumber,
    isOnlineMatchRunning,
    isSoloMatchRunning,
    currentRoomCode,
    isHost,
    authenticatedUser,
  };
}
