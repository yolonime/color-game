/**
 * UI updater functions for color preview, sliders, and code input
 * Handles visual updates when user interacts with controls
 */

import { hslToRgb, rgbToHex, hsl as hslString } from '../color/conversion.js';
import { parseColorCodeInput } from '../color/parsing.js';
import { setElementVisibility } from './helpers.js';

// =============================================================================
// Player Preview & Slider Updates
// =============================================================================

/**
 * Update player preview color swatch and slider value displays
 * @param {Object} domCache - DOM element cache
 * @param {number} hue - Current hue value
 * @param {number} saturation - Current saturation (tint)
 * @param {number} lightness - Current lightness
 */
export function updatePlayerPreview(domCache, hue, saturation, lightness) {
  if (!domCache.hueValue || !domCache.tintValue || !domCache.lightnessValue || !domCache.playerPreview) {
    return;
  }

  const h = Number(hue);
  const s = Number(saturation);
  const l = Number(lightness);

  // Update value displays
  domCache.hueValue.textContent = String(h);
  domCache.tintValue.textContent = `${s}%`;
  domCache.lightnessValue.textContent = `${l}%`;

  // Update visual bars
  updateSliderImpactBars(domCache, h, s, l);

  // Update preview swatch
  domCache.playerPreview.style.background = hslString(h, s, l);
}

/**
 * Update visual impact bars showing gradient of each slider
 * @param {Object} domCache - DOM element cache
 * @param {number} hue - Current hue value (0-360)
 * @param {number} saturation - Current saturation (0-100)  
 * @param {number} lightness - Current lightness (0-100)
 */
export function updateSliderImpactBars(domCache, hue, saturation, lightness) {
  if (!domCache.hueImpactBar || !domCache.tintImpactBar || !domCache.lightnessImpactBar) {
    return;
  }

  const h = Number(hue);
  const s = Number(saturation);
  const l = Number(lightness);

  // Hue bar: full chromatic circle at current saturation/lightness
  domCache.hueImpactBar.style.setProperty("--progress", `${Math.round((h / 360) * 100)}%`);
  domCache.hueImpactBar.style.background = `linear-gradient(90deg,
    hsl(0, ${s}%, ${l}%),
    hsl(60, ${s}%, ${l}%),
    hsl(120, ${s}%, ${l}%),
    hsl(180, ${s}%, ${l}%),
    hsl(240, ${s}%, ${l}%),
    hsl(300, ${s}%, ${l}%),
    hsl(360, ${s}%, ${l}%))`;

  // Saturation bar: gray to vivid at current hue/lightness
  domCache.tintImpactBar.style.setProperty("--progress", `${s}%`);
  domCache.tintImpactBar.style.background = `linear-gradient(90deg, hsl(${h}, 0%, ${l}%), hsl(${h}, 100%, ${l}%))`;

  // Lightness bar: dark to bright at current hue/saturation
  domCache.lightnessImpactBar.style.setProperty("--progress", `${l}%`);
  domCache.lightnessImpactBar.style.background = `linear-gradient(90deg, hsl(${h}, ${s}%, 0%), hsl(${h}, ${s}%, 50%), hsl(${h}, ${s}%, 100%))`;
}

// =============================================================================
// Code Input UI Management
// =============================================================================

/**
 * Update visibility and state of code input section
 * @param {Object} domCache - DOM element cache
 * @param {boolean} appView - Current app view
 * @param {boolean} isCodeInputAllowed - Whether code input is allowed in current mode
 */
export function updateGuessCodeUi(domCache, appView, isCodeInputAllowed) {
  if (!domCache.guessCodeSection || !domCache.guessCodeHint) {
    return;
  }

  const showCodeInput = appView === "game" && isCodeInputAllowed;
  setElementVisibility(domCache.guessCodeSection, showCodeInput);

  if (!showCodeInput) {
    domCache.guessCodeHint.textContent = "Format accepte: #RRGGBB, rgb(r,g,b), hsl(h,s%,l%).";
    domCache.guessCodeHint.classList.remove("invalid");
  }
}

/**
 * Sync code input value from current slider values
 * @param {Object} domCache - DOM element cache
 * @param {number} hue - Current hue
 * @param {number} saturation - Current saturation
 * @param {number} lightness - Current lightness
 * @param {boolean} isUpdatingGuessCode - Guard flag to prevent loops
 * @returns {boolean} Whether guard prevented update
 */
export function syncGuessCodeFromSliders(domCache, hue, saturation, lightness, isUpdatingGuessCode) {
  if (!domCache.guessCodeInput || !domCache.guessCodeSection || !domCache.guessCodeHint) {
    return true;
  }
  if (isUpdatingGuessCode || domCache.guessCodeSection.classList.contains("hidden")) {
    return true;
  }

  const rgb = hslToRgb(Number(hue), Number(saturation), Number(lightness));
  domCache.guessCodeInput.value = rgbToHex(rgb);
  domCache.guessCodeHint.textContent = "Format accepte: #RRGGBB, rgb(r,g,b), hsl(h,s%,l%).";
  domCache.guessCodeHint.classList.remove("invalid");
  
  return false;
}

/**
 * Apply color code input to sliders
 * @param {Object} domCache - DOM element cache
 * @param {string} codeValue - Color code input (HEX, RGB, or HSL)
 * @param {boolean} isUpdatingGuessCode - Guard flag
 * @param {Function} updateCallback - Callback to trigger preview update
 * @returns {Object|null} Parsed color {hue, tint, lightness} or null if invalid
 */
export function applyGuessCodeInput(domCache, codeValue, isUpdatingGuessCode, updateCallback) {
  if (!domCache.guessCodeInput || !domCache.guessCodeSection || !domCache.guessCodeHint) {
    return null;
  }
  if (isUpdatingGuessCode || domCache.guessCodeInput.disabled || domCache.guessCodeSection.classList.contains("hidden")) {
    return null;
  }

  const parsed = parseColorCodeInput(codeValue);
  
  if (!parsed) {
    domCache.guessCodeHint.textContent = "Code invalide. Exemples: #40A0D0, rgb(64,160,208), hsl(200,60%,53%).";
    domCache.guessCodeHint.classList.add("invalid");
    return null;
  }

  // Update sliders
  if (domCache.hueSlider) domCache.hueSlider.value = String(parsed.hue);
  if (domCache.tintSlider) domCache.tintSlider.value = String(parsed.tint);
  if (domCache.lightnessSlider) domCache.lightnessSlider.value = String(parsed.lightness);

  // Sync back to code input
  const rgb = hslToRgb(parsed.hue, parsed.tint, parsed.lightness);
  domCache.guessCodeInput.value = rgbToHex(rgb);
  domCache.guessCodeHint.textContent = "Code applique a la couleur courante.";
  domCache.guessCodeHint.classList.remove("invalid");

  // Update preview
  if (typeof updateCallback === "function") {
    updateCallback();
  }

  return parsed;
}

// =============================================================================
// Slider Control State
// =============================================================================

/**
 * Enable/disable slider and code input controls
 * @param {Object} domCache - DOM element cache
 * @param {boolean} isEnabled - Whether controls should be enabled
 * @param {Object} options - Additional options
 * @param {boolean} options.submitDisabled - Whether submit button should also be disabled
 */
export function setSlidersEnabled(domCache, isEnabled, options = {}) {
  const { submitDisabled = false } = options;

  if (domCache.hueSlider) domCache.hueSlider.disabled = !isEnabled;
  if (domCache.tintSlider) domCache.tintSlider.disabled = !isEnabled;
  if (domCache.lightnessSlider) domCache.lightnessSlider.disabled = !isEnabled;
  if (domCache.guessCodeInput) domCache.guessCodeInput.disabled = !isEnabled;
  if (domCache.submitBtn) domCache.submitBtn.disabled = submitDisabled || !isEnabled;
}
