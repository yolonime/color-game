/**
 * Solo game mode logic and orchestration
 * Handles round progression, scoring, and single-player game flow
 */

import { hsl as hslString } from '../color/conversion.js';

// =============================================================================
// Target Color Management
// =============================================================================

/**
 * Calculate score for a color guess compared to target
 * Uses weighted multi-dimensional distance in HSL space
 * 
 * @param {Object} guess - Guessed color {hue, tint, lightness}
 * @param {Object} target - Target color {hue, tint, lightness}
 * @returns {number} Score 0-100
 */
export function calculateColorScore(guess, target) {
  const hueDiffRaw = Math.abs(guess.hue - target.hue);
  const hueDiff = Math.min(hueDiffRaw, 360 - hueDiffRaw);
  const tintDiff = Math.abs(guess.tint - target.tint);
  const lightnessDiff = Math.abs(guess.lightness - target.lightness);

  // Weighted distance calculation - hue is more critical
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

  // Strictness curve: curve makes differences more noticeable
  const strictnessExponent = 2.2;
  const score = Math.max(0, Number((((1 - weightedDistance) ** strictnessExponent) * 100).toFixed(2)));

  return score;
}

// =============================================================================
// Round State Management
// =============================================================================

/**
 * Initialize a solo match
 * Resets round counters and score tracking
 * @param {Object} stats - Personal stats object (will be mutated)
 * @param {Object} options - Match options
 * @param {boolean} options.refillColorPool - Whether to refill named color pool
 */
export function startSoloMatch(stats, options = {}) {
  const { refillColorPool = false } = options;

  stats.soloMatches = (stats.soloMatches || 0) + 1;
  
  return {
    roundNumber: 0,
    totalScore: 0,
    roundHistory: [],
    previousColor: null,
    isMatchRunning: true,
    lastScore: 0,
  };
}

/**
 * Advance to next solo round
 * @param {Object} roundState - Round state object (will be mutated)
 * @param {number} maxRounds - Maximum rounds per match (typically 5)
 */
export function advanceSoloRound(roundState, maxRounds) {
  roundState.roundNumber += 1;
  return {
    ...roundState,
    isComplete: roundState.roundNumber >= maxRounds,
  };
}

/**
 * Record score for completed round
 * @param {Object} roundState - Round state
 * @param {number} score - Score achieved (0-100)
 * @param {Object} details - Round details {target, guess, label}
 * @returns {Object} Updated round state
 */
export function recordRoundScore(roundState, score, details) {
  return {
    ...roundState,
    totalScore: roundState.totalScore + score,
    roundHistory: [
      ...roundState.roundHistory,
      {
        roundNumber: roundState.roundNumber,
        score,
        ...details,
      },
    ],
    lastScore: score,
    previousColor: details.target,
  };
}

/**
 * Check if match is complete
 * @param {number} roundNumber - Current round number
 * @param {number} maxRounds - Max rounds
 * @returns {boolean} True if match is over
 */
export function isSoloMatchComplete(roundNumber, maxRounds) {
  return roundNumber >= maxRounds;
}

/**
 * get match summary stats
 * @param {Array} roundHistory - Array of completed rounds
 * @param {number} totalScore - Total accumulated score
 * @param {number} matchCount - Number of matches played total
 * @returns {Object} Summary stats
 */
export function getSoloMatchSummary(roundHistory, totalScore, matchCount = 0) {
  const roundCount = roundHistory.length;
  const averageScore = roundCount > 0 ? totalScore / roundCount : 0;
  const bestRound = roundHistory.length > 0
    ? Math.max(...roundHistory.map(r => r.score))
    : 0;

  return {
    totalScore,
    averageScore,
    bestRound,
    roundsPlayed: roundCount,
    matchCount,
  };
}

// =============================================================================
// Round Display Logic
// =============================================================================

/**
 * Format round header text
 * @param {number} currentRound - Current round number
 * @param {number} maxRounds - Total rounds
 * @param {number} averageScore - Average score so far
 * @param {number} totalScore - Total score so far
 * @returns {string} Formatted text
 */
export function formatRoundHeader(currentRound, maxRounds, totalScore, averageScore) {
  return `Manche ${currentRound}/${maxRounds}: ${totalScore.toFixed(2)} pts | Moyenne: ${averageScore.toFixed(2)}/100`;
}

/**
 * Get appropriate message for round result
 * @param {number} score - Score achieved (0-100)
 * @param {number} roundNumber - Current round
 * @param {number} maxRounds - Max rounds
 * @param {boolean} isLastRound - Whether this is the final round
 * @returns {Object} Message configuration {overlay, countdown}
 */
export function getRoundResultMessage(score, roundNumber, maxRounds, isLastRound) {
  if (isLastRound) {
    return {
      overlay: "Partie solo terminee. Ouvre le menu pour rejouer.",
      countdown: "FIN",
    };
  }

  const quality = score < 45 ? "ratee" : "bonne";
  return {
    overlay: `Manche ${quality}. La suivante demarre automatiquement.`,
    countdown: `Prochaine: ${roundNumber + 1}/${maxRounds}`,
  };
}

/**
 * Get stage message text for mode
 * @param {string} localMode - Current local mode (memory, name, or code)
 * @param {string} stagePhase - Phase of round (intro, hidden)
 * @returns {string} Stage message
 */
export function getStageModeMessage(localMode, stagePhase) {
  if (stagePhase === "intro") {
    if (localMode === "name") return "Observe le nom de la couleur";
    if (localMode === "code") return "Observe le code couleur";
    return "Memorise cette couleur";
  }

  // stagePhase === "hidden"
  if (localMode === "name") return "Le nom a disparu. Reproduis la couleur.";
  if (localMode === "code") return "Le code a disparu. Reproduis la couleur.";
  return "La couleur est cachee. Reproduis-la avec les curseurs.";
}

/**
 * Get background gradient for stage color display
 * @param {string} localMode - Current local mode
 * @param {number} hue - Hue value (for color mode)
 * @param {number} saturation - Saturation value
 * @param {number} lightness - Lightness value
 * @returns {string} CSS background value
 */
export function getStageModeBackground(localMode, hue, saturation, lightness) {
  if (localMode === "name") {
    return "linear-gradient(135deg, rgba(34,31,27,0.98), rgba(67,58,50,0.95))";
  }
  if (localMode === "code") {
    return "linear-gradient(135deg, rgba(16,23,34,0.98), rgba(32,52,78,0.95))";
  }
  // memory mode - show actual color
  return hslString(hue, saturation, lightness);
}

/**
 * Get hidden stage pattern (shown while user guesses)
 * @returns {string} CSS background value
 */
export function getHiddenStageBackground() {
  return "repeating-linear-gradient(135deg, #e9ddc7 0 12px, #f8f1e4 12px 24px)";
}
