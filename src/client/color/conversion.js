/**
 * Conversion utilities for color spaces
 * Supports HSL ↔ RGB ↔ HEX conversions
 */

// =============================================================================
// Helpers
// =============================================================================

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function wrapHue(value) {
  const wrapped = value % 360;
  return wrapped < 0 ? wrapped + 360 : wrapped;
}

// =============================================================================
// HSL ↔ RGB conversions
// =============================================================================

/**
 * Format HSL color string
 * @param {number} h - Hue (0-360)
 * @param {number} s - Saturation (0-100)
 * @param {number} l - Lightness (0-100)
 * @returns {string} HSL color string
 */
export function hsl(h, s, l) {
  return `hsl(${h}, ${s}%, ${l}%)`;
}

/**
 * Convert HSL to RGB
 * @param {number} h - Hue (0-360)
 * @param {number} s - Saturation (0-100)
 * @param {number} l - Lightness (0-100)
 * @returns {Object} RGB object {r, g, b} (0-255)
 */
export function hslToRgb(h, s, l) {
  const hue = ((h % 360) + 360) % 360;
  const sat = clamp(s, 0, 100) / 100;
  const lig = clamp(l, 0, 100) / 100;

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

/**
 * Convert RGB to HSL
 * @param {number} r - Red (0-255)
 * @param {number} g - Green (0-255)
 * @param {number} b - Blue (0-255)
 * @returns {Object} HSL object {h, s, l}
 */
export function rgbToHsl(r, g, b) {
  const rr = clamp(r, 0, 255) / 255;
  const gg = clamp(g, 0, 255) / 255;
  const bb = clamp(b, 0, 255) / 255;

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

// =============================================================================
// HEX conversions
// =============================================================================

/**
 * Convert RGB object to HEX string
 * @param {Object} rgb - RGB object {r, g, b}
 * @returns {string} HEX color string (#RRGGBB)
 */
export function rgbToHex({ r, g, b }) {
  const toHex = (n) => Math.max(0, Math.min(255, n)).toString(16).padStart(2, "0").toUpperCase();
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/**
 * Convert HEX string to RGB object
 * @param {string} hex - HEX color string (#RRGGBB or RRGGBB)
 * @returns {Object|null} RGB object {r, g, b} or null if invalid
 */
export function hexToRgb(hex) {
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

// =============================================================================
// Exports for internal use
// =============================================================================

export { clamp, wrapHue };
