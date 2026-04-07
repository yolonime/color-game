/**
 * Named color management utilities
 * Handles building color pools, picking, and managing difficulty
 */

import { wrapHue, clamp } from './conversion.js';

// =============================================================================
// Helpers
// =============================================================================

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Shuffle an array (returns new array, doesn't mutate)
 * @param {Array} items - Array to shuffle
 * @returns {Array} Shuffled copy of array
 */
export function shuffleArray(items) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = randomInt(0, i);
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

// =============================================================================
// Color pool building
// =============================================================================

/**
 * Build list of named colors based on difficulty setting
 * @param {string} difficulty - Difficulty level (easy, normal, expert)
 * @param {Object} difficultyVariants - NAME_DIFFICULTY_VARIANTS mapping
 * @param {Array} namedColorBases - Named color bases from server
 * @param {Array} namedColorVariants - Named color variants from server
 * @param {number} fixedLightness - Fixed lightness value for named colors
 * @returns {Array} List of named color objects
 */
export function buildNamedColors(
  difficulty,
  difficultyVariants,
  namedColorBases,
  namedColorVariants,
  fixedLightness,
) {
  const allowed = new Set(difficultyVariants[difficulty] || difficultyVariants.normal);
  const generated = [];

  for (const baseColor of namedColorBases) {
    for (const variant of namedColorVariants) {
      if (!allowed.has(variant.id)) {
        continue;
      }

      generated.push({
        name: `${baseColor.name}${variant.label}`,
        hue: wrapHue(baseColor.hue + variant.hueOffset),
        tint: clamp(baseColor.tint + variant.tintOffset, 25, 96),
        lightness: fixedLightness,
      });
    }
  }

  return generated;
}

/**
 * Create a shuffled pool of named colors
 * @param {string} difficulty - Difficulty level
 * @param {Object} difficultyVariants - NAME_DIFFICULTY_VARIANTS mapping
 * @param {Array} namedColorBases - Named color bases from server
 * @param {Array} namedColorVariants - Named color variants from server
 * @param {number} fixedLightness - Fixed lightness value for named colors
 * @returns {Array} Shuffled pool ready for picking
 */
export function refillNamedColorPool(
  difficulty,
  difficultyVariants,
  namedColorBases,
  namedColorVariants,
  fixedLightness,
) {
  const colors = buildNamedColors(
    difficulty,
    difficultyVariants,
    namedColorBases,
    namedColorVariants,
    fixedLightness,
  );
  return shuffleArray(colors);
}

/**
 * Pick a color from pool, refilling if necessary
 * @param {Array} pool - Current color pool (will be mutated)
 * @param {string} difficulty - Difficulty level (for refilling)
 * @param {Object} difficultyVariants - NAME_DIFFICULTY_VARIANTS mapping
 * @param {Array} namedColorBases - Named color bases from server
 * @param {Array} namedColorVariants - Named color variants from server
 * @param {number} fixedLightness - Fixed lightness value for named colors
 * @returns {Object} Color object {name, hue, tint, lightness}
 */
export function pickNamedColor(
  pool,
  difficulty,
  difficultyVariants,
  namedColorBases,
  namedColorVariants,
  fixedLightness,
) {
  if (pool.length === 0) {
    // Refill by mutating the array
    const newPool = refillNamedColorPool(
      difficulty,
      difficultyVariants,
      namedColorBases,
      namedColorVariants,
      fixedLightness,
    );
    pool.push(...newPool);
  }
  return pool.pop();
}

// =============================================================================
// Difficulty labels
// =============================================================================

/**
 * Get label for current difficulty level
 * @param {string} difficulty - Difficulty level
 * @param {Object} difficultyLabels - NAME_DIFFICULTY_LABELS mapping
 * @returns {string} Difficulty label
 */
export function getNameDifficultyLabel(difficulty, difficultyLabels) {
  return difficultyLabels[difficulty] || difficultyLabels.normal || "Normal";
}
