/**
 * Score system and animations
 * Handles score formatting, tiers, and visual feedback
 */

import { SCORE_VISUAL_TIERS } from '../constants.js';

// =============================================================================
// Score Formatting
// =============================================================================

/**
 * Format score value with 2 decimal places
 * @param {number} value - Score value
 * @returns {string} Formatted score (e.g., "85.50")
 */
export function formatScore(value) {
  return Number(value).toFixed(2);
}

/**
 * Normalize score to 0-100 range
 * @param {number} score - Score value
 * @returns {number} Clamped score (0-100)
 */
export function normalizeScore(score) {
  return Math.max(0, Math.min(100, Number(score) || 0));
}

// =============================================================================
// Score Display Timing
// =============================================================================

/**
 * Get display duration for stage score based on score value
 * Higher scores display longer (1000-10000ms)
 * @param {number} score - Score value
 * @returns {number} Display duration in milliseconds
 */
export function getStageScoreDisplayMs(score) {
  const normalized = normalizeScore(score);
  return 1000 + Math.round(normalized * 9);
}

/**
 * Get duration for score counter animation
 * Higher scores animate longer (700-1050ms)
 * @param {number} score - Score value
 * @returns {number} Animation duration in milliseconds
 */
export function getCounterDurationMs(score) {
  const normalized = normalizeScore(score);
  return 700 + Math.round(normalized * 3.5);
}

// =============================================================================
// Score Tiers/Levels
// =============================================================================

/**
 * Get visual tier for a score
 * Used to determine CSS class and label for score display
 * @param {number} score - Score value
 * @returns {Object} Tier object {id, min, label}
 */
export function getScoreVisualTier(score) {
  const normalized = normalizeScore(score);
  let current = SCORE_VISUAL_TIERS[0];

  for (const tier of SCORE_VISUAL_TIERS) {
    if (normalized >= tier.min) {
      current = tier;
    }
  }

  return current;
}

// =============================================================================
// Score Audio Feedback
// =============================================================================

let scoreAudioContext = null;

/**
 * Play a short audio pop sound for score confirmation
 * Used when score is finalized
 * Non-blocking: catches errors silently
 */
export function playScorePopSound() {
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
    // Never block game on audio errors
  }
}

// =============================================================================
// Stage Score Rendering
// =============================================================================

/**
 * Apply visual tier styling to stage score element
 * @param {Object} tier - Tier object {id, label}
 * @param {HTMLElement} stageScoreCardEl - Stage score card element
 * @param {HTMLElement} stageScoreTierEl - Tier label element
 * @param {HTMLElement} stageScoreFireworksEl - Fireworks animation element
 * @param {boolean} burstTopTier - Whether to trigger burst animation
 */
export function applyStageTier(tier, stageScoreCardEl, stageScoreTierEl, stageScoreFireworksEl, burstTopTier) {
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
    // Trigger reflow to restart animation
    void stageScoreFireworksEl.offsetWidth;
    stageScoreFireworksEl.classList.add("burst");
  }
}

/**
 * Update stage score display with value and tier
 * @param {number} value - Score value to display
 * @param {HTMLElement} stageScoreValueEl - Value display element
 * @param {HTMLElement} stageScoreCardEl - Card container
 * @param {HTMLElement} stageScoreTierEl - Tier label
 * @param {HTMLElement} stageScoreFireworksEl - Fireworks element
 * @param {string} prevTierId - Previous tier ID (to detect tier changes)
 * @returns {string} New tier ID
 */
export function renderStageScore(
  value,
  stageScoreValueEl,
  stageScoreCardEl,
  stageScoreTierEl,
  stageScoreFireworksEl,
) {
  if (!stageScoreValueEl || !stageScoreCardEl) {
    return null;
  }

  stageScoreValueEl.textContent = formatScore(value);
  const nextTier = getScoreVisualTier(value);

  return nextTier.id;
}

/**
 * Restart stage score animation by retriggering CSS animation
 * @param {HTMLElement} stageOverlay - Stage overlay element
 */
export function restartStageScoreAnimation(stageOverlay) {
  const card = stageOverlay && stageOverlay.isConnected
    ? stageOverlay.querySelector(".stage-score-pop")
    : null;
  if (!card) {
    return;
  }
  card.classList.remove("score-active");
  // Trigger reflow to restart animation
  void card.offsetWidth;
  card.classList.add("score-active");
}

// =============================================================================
// Round Score Animation
// =============================================================================

/**
 * Animate score counter from 0 to final score
 * Handles both inline and stage display
 * @param {Object} options - Configuration
 * @param {number} options.roundNumber - Current round number
 * @param {number} options.maxRounds - Total rounds
 * @param {number} options.finalScore - Final score to animate to
 * @param {HTMLElement} options.scoreText - Score display element
 * @param {HTMLElement} options.stageOverlay - Stage overlay (optional)
 * @param {HTMLElement} options.stageScoreCardEl - Stage score card (optional)
 * @param {HTMLElement} options.stageScoreValueEl - Stage score value (optional)
 * @param {HTMLElement} options.stageScoreTierEl - Stage score tier (optional)
 * @param {HTMLElement} options.stageScoreFireworksEl - Stage fireworks (optional)
 * @param {boolean} options.inStage - Whether to animate in stage overlay
 * @param {Function} options.onComplete - Callback when animation completes
 */
export function animateRoundScore(options = {}) {
  const {
    roundNumber = 1,
    maxRounds = 5,
    finalScore = 0,
    scoreText = null,
    stageOverlay = null,
    stageScoreCardEl = null,
    stageScoreValueEl = null,
    stageScoreTierEl = null,
    stageScoreFireworksEl = null,
    inStage = false,
    onComplete = null,
  } = options;

  const safeFinalScore = Math.max(0, Number(finalScore) || 0);
  
  if (!scoreText) {
    return;
  }

  // Display initial score
  scoreText.textContent = `Manche ${roundNumber}/${maxRounds}: ${formatScore(0)}/100`;
  
  if (inStage && stageOverlay && stageScoreValueEl) {
    restartStageScoreAnimation(stageOverlay);
  }

  const stageHoldMs = inStage ? getStageScoreDisplayMs(safeFinalScore) : 0;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reduceMotion) {
    // Skip animation for users who prefer reduced motion
    scoreText.textContent = `Manche ${roundNumber}/${maxRounds}: ${formatScore(safeFinalScore)}/100`;
    if (inStage && stageScoreValueEl) {
      stageScoreValueEl.textContent = formatScore(safeFinalScore);
      if (stageScoreCardEl && stageScoreTierEl && stageScoreFireworksEl) {
        const tier = getScoreVisualTier(safeFinalScore);
        applyStageTier(tier, stageScoreCardEl, stageScoreTierEl, stageScoreFireworksEl, true);
      }
    }
    playScorePopSound();
    if (onComplete) {
      setTimeout(onComplete, stageHoldMs);
    }
    return;
  }

  // Animate score counter
  const durationMs = getCounterDurationMs(safeFinalScore);
  const startTime = performance.now();
  let animationFrameId = null;

  const tick = (now) => {
    const progress = Math.min((now - startTime) / durationMs, 1);
    const eased = 1 - ((1 - progress) ** 3);
    const currentScore = safeFinalScore * eased;
    
    scoreText.textContent = `Manche ${roundNumber}/${maxRounds}: ${formatScore(currentScore)}/100`;
    
    if (inStage && stageScoreValueEl) {
      stageScoreValueEl.textContent = formatScore(currentScore);
    }

    if (progress < 1) {
      animationFrameId = requestAnimationFrame(tick);
    } else {
      animationFrameId = null;
      scoreText.textContent = `Manche ${roundNumber}/${maxRounds}: ${formatScore(safeFinalScore)}/100`;
      
      if (inStage && stageScoreValueEl && stageScoreCardEl && stageScoreTierEl && stageScoreFireworksEl) {
        stageScoreValueEl.textContent = formatScore(safeFinalScore);
        const tier = getScoreVisualTier(safeFinalScore);
        applyStageTier(tier, stageScoreCardEl, stageScoreTierEl, stageScoreFireworksEl, true);
      }
      
      playScorePopSound();
      
      if (onComplete) {
        setTimeout(onComplete, stageHoldMs);
      }
    }
  };

  animationFrameId = requestAnimationFrame(tick);
}
