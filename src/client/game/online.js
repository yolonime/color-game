/**
 * Online game mode logic
 * Handles multiplayer room management and round orchestration
 * Note: Socket.io handlers are in Phase 6 (socket-manager.js)
 */

// =============================================================================
// Room State Management
// =============================================================================

/**
 * Initialize online match state
 * @param {string} roomCode - The online room code
 * @param {boolean} isHost - Whether current player is host
 * @param {number} matchRounds - Number of rounds in match
 * @returns {Object} Online match state
 */
export function initializeOnlineMatch(roomCode, isHost, matchRounds = 5) {
  return {
    roomCode,
    isHost,
    roundNumber: 0,
    totalRounds: matchRounds,
    roundHistory: [],
    playersInRoom: [],
    playersReady: new Set(),
    hasSubmittedRound: false,
    isMatchRunning: true,
  };
}

/**
 * Start next online round
 * @param {Object} matchState - Match state (will be mutated)
 * @returns {boolean} True if round started, false if match over
 */
export function startOnlineRound(matchState) {
  if (matchState.roundNumber >= matchState.totalRounds) {
    matchState.isMatchRunning = false;
    return false;
  }

  matchState.roundNumber += 1;
  matchState.hasSubmittedRound = false;
  matchState.playersReady.clear();

  return true;
}

/**
 * Mark current player as ready/submitted
 * @param {Object} matchState - Match state
 * @param {Object} roundData - Round submission {target, guess, score}
 */
export function submitOnlineRound(matchState, roundData) {
  matchState.hasSubmittedRound = true;
  matchState.roundHistory.push({
    roundNumber: matchState.roundNumber,
    ...roundData,
  });
}

/**
 * Track player ready status
 * @param {Object} matchState - Match state
 * @param {string} playerId - Player identifier
 */
export function markPlayerReady(matchState, playerId) {
  matchState.playersReady.add(playerId);
}

/**
 * Check if all players have submitted
 * @param {Object} matchState - Match state
 * @param {number} totalPlayers - Total players in room
 * @returns {boolean} True if all players ready
 */
export function allPlayersReady(matchState, totalPlayers) {
  return matchState.playersReady.size >= totalPlayers;
}

/**
 * Check if online match is complete
 * @param {Object} matchState - Match state
 * @returns {boolean} True if match is over
 */
export function isOnlineMatchComplete(matchState) {
  return matchState.roundNumber >= matchState.totalRounds;
}

/**
 * Leave online room and reset state
 * @param {Object} matchState - Match state (will be mutated)
 */
export function leaveOnlineRoom(matchState) {
  matchState = {
    roomCode: "",
    isHost: false,
    isMatchRunning: false,
    playersInRoom: [],
    playersReady: new Set(),
    hasSubmittedRound: false,
  };
  return matchState;
}

// =============================================================================
// Round Display Logic
// =============================================================================

/**
 * Format waiting message for players
 * @param {number} playersReady - Number of ready players
 * @param {number} totalPlayers - Total players in room
 * @returns {string} Status message
 */
export function getOnlineWaitingMessage(playersReady, totalPlayers) {
  return `En attente: ${playersReady}/${totalPlayers} joueurs prets`;
}

/**
 * Get round intro message for online mode
 * @param {string} onlineMode - Online mode (memory, name, code)
 * @returns {string} Intro message
 */
export function getOnlineRoundIntro(onlineMode) {
  if (onlineMode === "name") return "Observe le nom de couleur";
  if (onlineMode === "code") return "Observe le code couleur";
  return "Observe la couleur";
}

/**
 * Get hidden message for online guessing phase
 * @param {string} onlineMode - Online mode
 * @returns {string} Hidden message
 */
export function getOnlineRoundHidden(onlineMode) {
  if (onlineMode === "name") return "Le nom a disparu. Reproduis la couleur.";
  if (onlineMode === "code") return "Le code a disparu. Reproduis la couleur.";
  return "La couleur est cachee. Reproduis-la.";
}

/**
 * Format match results/leaderboard message
 * @param {Array} leaderboard - Leaderboard entries {name, score}
 * @returns {string} Formatted results
 */
export function formatOnlineLeaderboard(leaderboard) {
  return leaderboard
    .slice(0, 10)
    .map((entry, i) => `${i + 1}. ${entry.name}: ${entry.score.toFixed(2)}/100`)
    .join("\n");
}

// =============================================================================
// Player List Management
// =============================================================================

/**
 * Update players list in match state
 * @param {Object} matchState - Match state
 * @param {Array} players - Array of player objects {name, isHost, submitted}
 */
export function updatePlayersList(matchState, players) {
  matchState.playersInRoom = players.map(p => ({ ...p }));
}

/**
 * Get host player from list
 * @param {Array} players - Player list
 * @returns {Object|null} Host player or null
 */
export function getHostPlayer(players) {
  return players.find(p => p.isHost) || null;
}

/**
 * Filter ready players
 * @param {Array} players - Player list
 * @returns {Array} Players marked as ready
 */
export function getReadyPlayers(players) {
  return players.filter(p => p.submitted);
}
