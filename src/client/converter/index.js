/**
 * Color converter tool utilities
 * Handles color space conversion display and input management
 */

import { hslToRgb, rgbToHex, hsl as hslString } from '../color/conversion.js';
import { getClosestNamedColor } from '../color/distance.js';
import { clamp } from '../color/conversion.js';

// =============================================================================
// Converter Display Updates
// =============================================================================

/**
 * Update converter display from HSL values
 * Updates all input fields, sliders, and gradient bars
 * 
 * @param {Object} domCache - DOM elements for converter
 * @param {number} hue - Hue value (0-360)
 * @param {number} saturation - Saturation value (0-100)
 * @param {number} lightness - Lightness value (0-100)
 * @param {Object} colorData - Named color data {bases, variants, fixedLightness}
 * @param {Function} onNamedColorFound - Callback when named color matches
 */
export function updateConverterDisplay(domCache, hue, saturation, lightness, colorData, onNamedColorFound) {
  const safeH = clamp(Math.round(hue), 0, 360);
  const safeS = clamp(Math.round(saturation), 0, 100);
  const safeL = clamp(Math.round(lightness), 0, 100);

  // Update input fields
  if (domCache.converterHInput) domCache.converterHInput.value = String(safeH);
  if (domCache.converterSInput) domCache.converterSInput.value = String(safeS);
  if (domCache.converterLInput) domCache.converterLInput.value = String(safeL);

  // Update slider values
  if (domCache.converterHueSlider) domCache.converterHueSlider.value = String(safeH);
  if (domCache.converterSaturationSlider) domCache.converterSaturationSlider.value = String(safeS);
  if (domCache.converterLightnessSlider) domCache.converterLightnessSlider.value = String(safeL);

  // Update slider value displays
  if (domCache.converterHueValue) domCache.converterHueValue.textContent = String(safeH);
  if (domCache.converterSaturationValue) domCache.converterSaturationValue.textContent = `${safeS}%`;
  if (domCache.converterLightnessValue) domCache.converterLightnessValue.textContent = `${safeL}%`;

  // Get RGB values
  const rgb = hslToRgb(safeH, safeS, safeL);
  const hex = rgbToHex(rgb);

  // Update RGB inputs
  if (domCache.converterRInput) domCache.converterRInput.value = String(rgb.r);
  if (domCache.converterGInput) domCache.converterGInput.value = String(rgb.g);
  if (domCache.converterBInput) domCache.converterBInput.value = String(rgb.b);

  // Update HEX input
  if (domCache.converterHexInput) domCache.converterHexInput.value = hex;

  // Update color picker
  if (domCache.converterColorPicker) domCache.converterColorPicker.value = hex;

  // Update gradient bars
  updateConverterGradientBars(domCache, safeH, safeS, safeL);

  // Update preview swatch
  if (domCache.converterPreviewSwatch) domCache.converterPreviewSwatch.style.background = hex;

  // Find and display closest named color
  if (colorData && onNamedColorFound) {
    const match = getClosestNamedColor(
      safeH,
      safeS,
      safeL,
      colorData.bases,
      colorData.variants,
      colorData.fixedLightness,
    );
    onNamedColorFound(match);
  }
}

/**
 * Update gradient bars in converter
 * Shows how each slider affects the color
 * @param {Object} domCache - DOM elements
 * @param {number} hue - Current hue
 * @param {number} saturation - Current saturation
 * @param {number} lightness - Current lightness
 */
export function updateConverterGradientBars(domCache, hue, saturation, lightness) {
  // Hue bar: full spectrum at current saturation/lightness
  if (domCache.converterHueImpactBar) {
    domCache.converterHueImpactBar.style.setProperty("--progress", `${Math.round((hue / 360) * 100)}%`);
    domCache.converterHueImpactBar.style.background = `linear-gradient(90deg,
      hsl(0, ${saturation}%, ${lightness}%),
      hsl(60, ${saturation}%, ${lightness}%),
      hsl(120, ${saturation}%, ${lightness}%),
      hsl(180, ${saturation}%, ${lightness}%),
      hsl(240, ${saturation}%, ${lightness}%),
      hsl(300, ${saturation}%, ${lightness}%),
      hsl(360, ${saturation}%, ${lightness}%))`;
  }

  // Saturation bar: gray to vivid
  if (domCache.converterSaturationImpactBar) {
    domCache.converterSaturationImpactBar.style.setProperty("--progress", `${saturation}%`);
    domCache.converterSaturationImpactBar.style.background = `linear-gradient(90deg, hsl(${hue}, 0%, ${lightness}%), hsl(${hue}, 100%, ${lightness}%))`;
  }

  // Lightness bar: dark to bright
  if (domCache.converterLightnessImpactBar) {
    domCache.converterLightnessImpactBar.style.setProperty("--progress", `${lightness}%`);
    domCache.converterLightnessImpactBar.style.background = `linear-gradient(90deg, hsl(${hue}, ${saturation}%, 0%), hsl(${hue}, ${saturation}%, 50%), hsl(${hue}, ${saturation}%, 100%))`;
  }
}

// =============================================================================
// Converter Event Handling
// =============================================================================

/**
 * Copy color value to clipboard
 * Falls back to manual selection if clipboard API unavailable
 * 
 * @param {string} text - Text to copy
 * @returns {Promise<boolean>} True if copy succeeded
 */
export async function copyToClipboard(text) {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // Fallback for older browsers
      const temp = document.createElement("textarea");
      temp.value = text;
      temp.setAttribute("readonly", "");
      temp.style.position = "absolute";
      temp.style.left = "-9999px";
      document.body.appendChild(temp);
      temp.select();
      document.execCommand("copy");
      temp.remove();
      return true;
    }
  } catch {
    return false;
  }
}

/**
 * Format RGB values as RGB string
 * @param {Object} rgb - RGB object {r, g, b}
 * @returns {string} RGB string "rgb(r, g, b)"
 */
export function formatRgbString(rgb) {
  return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
}

/**
 * Format HSL values as HSL string
 * @param {number} hue - Hue
 * @param {number} saturation - Saturation
 * @param {number} lightness - Lightness
 * @returns {string} HSL string "hsl(h, s%, l%)"
 */
export function formatHslString(hue, saturation, lightness) {
  return `hsl(${Math.round(hue)}, ${Math.round(saturation)}%, ${Math.round(lightness)}%)`;
}

/**
 * Get hint text for converter display
 * @param {Object} namedColorMatch - Named color match or null
 * @returns {string} Hint text
 */
export function getConverterHintText(namedColorMatch) {
  if (!namedColorMatch) {
    return "Pret.";
  }

  const confidence = Math.max(0, Math.round((1 - (namedColorMatch.distance / 2)) * 100));
  return `Proche de la palette artiste (${confidence}%).`;
}

/**
 * Get initial converter state
 * @returns {Object} Initial HSL values
 */
export function getInitialConverterState() {
  return {
    hue: 200,
    saturation: 60,
    lightness: 53,
  };
}
