/**
 * Color distance calculations and matching utilities
 * Used for scoring closeness to target color and finding named color matches
 */

import { wrapHue, clamp } from './conversion.js';

// =============================================================================
// Distance calculations
// =============================================================================

/**
 * Calculate absolute difference between two hues (accounting for circular hue space)
 * @param {number} a - First hue value (0-360)
 * @param {number} b - Second hue value (0-360)
 * @returns {number} Shortest distance between hues
 */
export function hueCircularDiff(a, b) {
  const raw = Math.abs(a - b);
  return Math.min(raw, 360 - raw);
}

/**
 * Calculate HSL color distance (multi-dimensional)
 * Used for scoring color matches in game
 * @param {number} h1 - First color hue
 * @param {number} s1 - First color saturation
 * @param {number} l1 - First color lightness
 * @param {number} h2 - Second color hue
 * @param {number} s2 - Second color saturation
 * @param {number} l2 - Second color lightness
 * @returns {number} Color distance (0 = identical, higher = more different)
 */
export function hslDistance(h1, s1, l1, h2, s2, l2) {
  const hueDiffRaw = Math.abs(h1 - h2);
  const hueDiff = Math.min(hueDiffRaw, 360 - hueDiffRaw) / 180;
  const satDiff = Math.abs(s1 - s2) / 100;
  const lightDiff = Math.abs(l1 - l2) / 100;

  // Weighted distance: hue is more important, lightness less
  return Math.sqrt((hueDiff * 1.2) ** 2 + (satDiff * 1) ** 2 + (lightDiff * 0.8) ** 2);
}

// =============================================================================
// Color validation
// =============================================================================

/**
 * Check if a color is too close to the previous target
 * Prevents generation of confusingly similar targets
 * @param {Object} nextColor - Color object {hue, tint, lightness}
 * @param {Object|null} previousColor - Previous color or null
 * @returns {boolean} True if colors are too similar
 */
export function isColorTooClose(nextColor, previousColor) {
  if (!previousColor) {
    return false;
  }
  return hueCircularDiff(nextColor.hue, previousColor.hue) < 34 && Math.abs(nextColor.tint - previousColor.tint) < 18;
}

/**
 * Find the closest named color to a given HSL color
 * @param {number} hue - Target hue
 * @param {number} tint - Target saturation (called "tint" in game)
 * @param {number} lightness - Target lightness
 * @param {Array} namedColorBases - Array of base color objects from server
 * @param {Array} namedColorVariants - Array of variant objects from server
 * @param {number} fixedLightness - Fixed lightness value for named colors
 * @returns {Object|null} Best match {name, distance} or null if no colors available
 */
export function getClosestNamedColor(hue, tint, lightness, namedColorBases, namedColorVariants, fixedLightness) {
  if (!namedColorBases || namedColorBases.length === 0 || !namedColorVariants || namedColorVariants.length === 0) {
    return null;
  }

  let best = null;

  for (const baseColor of namedColorBases) {
    for (const variant of namedColorVariants) {
      const candidate = {
        name: `${baseColor.name}${variant.label}`,
        hue: wrapHue(baseColor.hue + variant.hueOffset),
        tint: clamp(baseColor.tint + variant.tintOffset, 12, 96),
        lightness: fixedLightness,
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

/**
 * Create a random target color for game rounds
 * Kept for compatibility with modules that import createRandomTarget
 * @param {number} fixedLightness - Lightness lock (default 50)
 * @returns {{hue:number,tint:number,lightness:number}}
 */
export function createRandomTarget(fixedLightness = 50) {
  return {
    hue: Math.floor(Math.random() * 360),
    tint: Math.floor(Math.random() * 77) + 18,
    lightness: clamp(fixedLightness, 0, 100),
  };
}
