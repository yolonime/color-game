/**
 * Color code input parsing utilities
 * Supports HEX, RGB, and HSL input formats
 */

import { hexToRgb, rgbToHsl, wrapHue, clamp } from './conversion.js';

// =============================================================================
// RGB parsing
// =============================================================================

/**
 * Parse RGB text format (e.g., "rgb(64, 160, 208)")
 * @param {string} value - Color code input
 * @returns {Object|null} RGB object {r, g, b} or null if invalid
 */
export function parseRgbText(value) {
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

// =============================================================================
// HSL parsing
// =============================================================================

/**
 * Parse HSL text format (e.g., "hsl(200, 60%, 53%)")
 * @param {string} value - Color code input
 * @returns {Object|null} HSL object {hue, tint, lightness} or null if invalid
 */
export function parseHslText(value) {
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

// =============================================================================
// Generic color code parsing
// =============================================================================

/**
 * Parse any color code format (HEX, RGB, or HSL)
 * @param {string} value - Color code input
 * @returns {Object|null} HSL object {hue, tint, lightness} or null if invalid
 */
export function parseColorCodeInput(value) {
  const raw = String(value || "").trim();
  if (!raw) {
    return null;
  }

  // Try HEX first
  const rgbFromHex = hexToRgb(raw);
  if (rgbFromHex) {
    const hslValue = rgbToHsl(rgbFromHex.r, rgbFromHex.g, rgbFromHex.b);
    return {
      hue: hslValue.h,
      tint: hslValue.s,
      lightness: hslValue.l,
    };
  }

  // Try RGB text
  const rgbText = parseRgbText(raw);
  if (rgbText) {
    const hslValue = rgbToHsl(rgbText.r, rgbText.g, rgbText.b);
    return {
      hue: hslValue.h,
      tint: hslValue.s,
      lightness: hslValue.l,
    };
  }

  // Try HSL text
  return parseHslText(raw);
}
