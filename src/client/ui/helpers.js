/**
 * UI Helper utilities for animations and interactions
 */

/**
 * Pulse animation on a button element
 * Triggers CSS animation pulse class
 * @param {HTMLElement} button - Button element to animate
 */
export function pulseButton(button) {
  if (!button) {
    return;
  }
  
  button.classList.remove("pulse");
  // Trigger reflow to restart animation
  void button.offsetWidth;
  button.classList.add("pulse");
  
  // Clean up pulse class after animation
  setTimeout(() => button.classList.remove("pulse"), 240);
}

/**
 * Create a nudge animation on an element
 * Used for subtle notifications
 * @param {HTMLElement} element - Element to nudge
 * @param {number} duration - Duration in ms (default 600)
 */
export function nudgeElement(element, duration = 600) {
  if (!element) {
    return;
  }
  
  element.classList.remove("nudge");
  void element.offsetWidth;
  element.classList.add("nudge");
  
  setTimeout(() => element.classList.remove("nudge"), duration);
}

/**
 * Safe element visibility toggle
 * Handles both classList.toggle and style.display
 * @param {HTMLElement} element - Element to toggle
 * @param {boolean} isVisible - Whether to show or hide
 */
export function setElementVisibility(element, isVisible) {
  if (!element) {
    return;
  }
  
  element.classList.toggle("hidden", !isVisible);
  element.style.display = isVisible ? "" : "none";
}

/**
 * Disable/enable a group of interactive elements
 * @param {HTMLElement[]} elements - Elements to disable/enable
 * @param {boolean} isDisabled - Whether to disable
 */
export function setElementsDisabled(elements, isDisabled) {
  for (const el of elements) {
    if (el && el.disabled !== undefined) {
      el.disabled = isDisabled;
    }
  }
}

/**
 * Update class-based active state on button group
 * Removes "active" class from all, adds to target
 * @param {HTMLElement[]} buttons - All buttons in group
 * @param {HTMLElement} activeButton - Button to mark active
 */
export function updateActiveButton(buttons, activeButton) {
  for (const btn of buttons) {
    if (btn) {
      btn.classList.toggle("active", btn === activeButton);
    }
  }
}
