/**
 * DOM event listeners and binding
 * Manages all user interaction events and UI delegations
 */

import { DOM } from "./dom.js";

// Event handler registry
let eventHandlers = {};

// =============================================================================
// Event Registration & Delegation
// =============================================================================

/**
 * Register event handler on element with cleanup support
 * @param {string} selector - CSS selector or element ID
 * @param {string} eventType - Event type (click, input, change, etc)
 * @param {Function} handler - Event handler callback
 * @returns {Function} Cleanup function
 */
export function registerEvent(selector, eventType, handler) {
  let element = null;

  // Handle ID selector
  if (selector.startsWith("#")) {
    element = document.getElementById(selector.slice(1));
  } else if (selector.startsWith(".")) {
    // For class selectors, use event delegation
    document.addEventListener(eventType, (event) => {
      if (event.target.matches(selector)) {
        handler(event);
      }
    });
  } else {
    // Try to find by selector
    element = document.querySelector(selector);
  }

  // Direct element handler
  if (element) {
    element.addEventListener(eventType, handler);

    // Store for cleanup
    const key = `${selector}:${eventType}`;
    if (!eventHandlers[key]) {
      eventHandlers[key] = [];
    }
    eventHandlers[key].push({ element, handler });

    // Return cleanup function
    return () => {
      element.removeEventListener(eventType, handler);
      eventHandlers[key] = eventHandlers[key].filter((h) => h.handler !== handler);
    };
  }

  return () => {};
}

/**
 * Register multiple events at once
 * @param {Array<Object>} registrations - Array of {selector, eventType, handler}
 * @returns {Function} Cleanup all function
 */
export function registerEvents(registrations) {
  const cleanups = registrations.map((reg) =>
    registerEvent(reg.selector, reg.eventType, reg.handler)
  );

  return () => {
    cleanups.forEach((cleanup) => cleanup());
  };
}

/**
 * Unregister all handlers for element
 * @param {string} selector - CSS selector or element ID
 */
export function unregisterEvents(selector) {
  Object.keys(eventHandlers).forEach((key) => {
    if (key.startsWith(selector)) {
      eventHandlers[key].forEach(({ element, handler }) => {
        element?.removeEventListener(
          key.split(":")[1],
          handler
        );
      });
      delete eventHandlers[key];
    }
  });
}

/**
 * Clear all registered event handlers
 */
export function clearAllEvents() {
  Object.values(eventHandlers).forEach((handlers) => {
    handlers.forEach(({ element, handler, eventType }) => {
      const type = eventType || "click";
      element?.removeEventListener(type, handler);
    });
  });
  eventHandlers = {};
}

// =============================================================================
// UI Interaction Events
// =============================================================================

/**
 * Setup slider input handlers
 * @param {Function} onColorSliderChange - Callback for slider changes
 * @param {Function} onHueSliderChange - Callback for hue changes
 * @param {Function} onSaturationSliderChange - Callback for saturation changes
 * @param {Function} onLightnessSliderChange - Callback for lightness changes
 * @returns {Function} Cleanup function
 */
export function setupSliderEvents(
  onColorSliderChange,
  onHueSliderChange,
  onSaturationSliderChange,
  onLightnessSliderChange
) {
  const dom = DOM;

  const cleanups = [];

  if (dom.guessSliders) {
    cleanups.push(
      registerEvent(`#${dom.guessSliders.id}`, "input", onColorSliderChange)
    );
  }

  if (dom.hueSlider) {
    cleanups.push(
      registerEvent(`#${dom.hueSlider.id}`, "input", onHueSliderChange)
    );
  }

  if (dom.saturationSlider) {
    cleanups.push(
      registerEvent(
        `#${dom.saturationSlider.id}`,
        "input",
        onSaturationSliderChange
      )
    );
  }

  if (dom.lightnessSlider) {
    cleanups.push(
      registerEvent(
        `#${dom.lightnessSlider.id}`,
        "input",
        onLightnessSliderChange
      )
    );
  }

  return () => cleanups.forEach((cleanup) => cleanup());
}

/**
 * Setup button click handlers
 * @param {Object} handlers - Object with handler functions
 * @returns {Function} Cleanup function
 */
export function setupButtonEvents(handlers) {
  const dom = DOM;
  const cleanups = [];

  const buttonMap = {
    submitBtn: handlers.onSubmit,
    skipBtn: handlers.onSkip,
    resetBtn: handlers.onReset,
    settingsBtn: handlers.onSettings,
    leaderboardBtn: handlers.onLeaderboard,
    menuBtn: handlers.onMenu,
    startSoloBtn: handlers.onStartSolo,
    startOnlineBtn: handlers.onStartOnline,
    converterBtn: handlers.onConverter,
  };

  Object.entries(buttonMap).forEach(([domKey, handler]) => {
    if (dom[domKey] && handler) {
      cleanups.push(
        registerEvent(`#${dom[domKey].id}`, "click", handler)
      );
    }
  });

  return () => cleanups.forEach((cleanup) => cleanup());
}

/**
 * Setup form submission handlers
 * @param {Function} onLoginSubmit - Login form submission
 * @param {Function} onRegisterSubmit - Registration form submission
 * @returns {Function} Cleanup function
 */
export function setupFormEvents(onLoginSubmit, onRegisterSubmit) {
  const dom = DOM;
  const cleanups = [];

  if (dom.loginForm && onLoginSubmit) {
    cleanups.push(
      registerEvent(`#${dom.loginForm.id}`, "submit", (e) => {
        e.preventDefault();
        onLoginSubmit();
      })
    );
  }

  if (dom.registerForm && onRegisterSubmit) {
    cleanups.push(
      registerEvent(`#${dom.registerForm.id}`, "submit", (e) => {
        e.preventDefault();
        onRegisterSubmit();
      })
    );
  }

  return () => cleanups.forEach((cleanup) => cleanup());
}

/**
 * Setup input field handlers
 * @param {Function} onInputChange - Callback for any input change
 * @returns {Function} Cleanup function
 */
export function setupInputEvents(onInputChange) {
  const dom = DOM;
  const cleanups = [];

  const inputSelectors = [
    dom.playerNameInput,
    dom.passwordInput,
    dom.codeInput,
    dom.gameCodeInput,
  ];

  inputSelectors.forEach((input) => {
    if (input) {
      cleanups.push(
        registerEvent(`#${input.id}`, "input", onInputChange)
      );
    }
  });

  return () => cleanups.forEach((cleanup) => cleanup());
}

/**
 * Setup menu drawer toggle
 * @param {Function} onMenuToggle - Callback when menu toggled
 * @returns {Function} Cleanup function
 */
export function setupMenuToggleEvent(onMenuToggle) {
  const dom = DOM;

  if (!dom.menuBtn) {
    return () => {};
  }

  return registerEvent(`#${dom.menuBtn.id}`, "click", onMenuToggle);
}

// =============================================================================
// Keyboard Events
// =============================================================================

/**
 * Setup keyboard shortcuts
 * @param {Object} shortcuts - Object with key: handler pairs
 * @returns {Function} Cleanup function
 */
export function setupKeyboardShortcuts(shortcuts) {
  const handleKeydown = (e) => {
    const key = e.key.toLowerCase();
    const handler = shortcuts[key];
    if (handler) {
      e.preventDefault();
      handler(e);
    }
  };

  document.addEventListener("keydown", handleKeydown);

  return () => {
    document.removeEventListener("keydown", handleKeydown);
  };
}

/**
 * Setup Enter key handler for input
 * @param {string} inputSelector - Input element selector
 * @param {Function} onEnter - Callback on Enter press
 * @returns {Function} Cleanup function
 */
export function setupEnterKeyHandler(inputSelector, onEnter) {
  return registerEvent(inputSelector, "keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      onEnter(e);
    }
  });
}

// =============================================================================
// Window & Document Events
// =============================================================================

/**
 * Setup window resize handler
 * @param {Function} onResize - Callback on window resize
 * @returns {Function} Cleanup function
 */
export function setupWindowResizeHandler(onResize) {
  const handler = () => {
    onResize(window.innerWidth, window.innerHeight);
  };

  window.addEventListener("resize", handler);

  return () => {
    window.removeEventListener("resize", handler);
  };
}

/**
 * Setup beforeunload handler (page leave warning)
 * @param {Function} onBeforeUnload - Callback before page unload
 */
export function setupBeforeUnloadHandler(onBeforeUnload) {
  window.addEventListener("beforeunload", (e) => {
    const shouldWarn = onBeforeUnload();
    if (shouldWarn) {
      e.preventDefault();
      e.returnValue = "";
    }
  });
}

/**
 * Setup visibility change handler
 * @param {Function} onVisibilityChange - Callback on visibility change
 * @returns {Function} Cleanup function
 */
export function setupVisibilityChangeHandler(onVisibilityChange) {
  const handler = () => {
    const isVisible = document.visibilityState === "visible";
    onVisibilityChange(isVisible);
  };

  document.addEventListener("visibilitychange", handler);

  return () => {
    document.removeEventListener("visibilitychange", handler);
  };
}

// =============================================================================
// Event Helpers & Utilities
// =============================================================================

/**
 * Get event handler count
 * @returns {number} Total registered handlers
 */
export function getEventHandlerCount() {
  let count = 0;
  Object.values(eventHandlers).forEach((handlers) => {
    count += handlers.length;
  });
  return count;
}

/**
 * Get list of registered events
 * @returns {Array<string>} Event keys
 */
export function getRegisteredEvents() {
  return Object.keys(eventHandlers);
}

/**
 * Trigger custom DOM event
 * @param {string} eventName - Event name
 * @param {Object} detail - Event detail data
 */
export function triggerCustomEvent(eventName, detail = {}) {
  const event = new CustomEvent(eventName, { detail });
  document.dispatchEvent(event);
}

/**
 * Listen to custom DOM event
 * @param {string} eventName - Event name
 * @param {Function} handler - Handler function
 * @returns {Function} Cleanup function
 */
export function onCustomEvent(eventName, handler) {
  document.addEventListener(eventName, handler);

  return () => {
    document.removeEventListener(eventName, handler);
  };
}

/**
 * Throttle event handler execution
 * @param {Function} handler - Handler function
 * @param {number} delay - Delay in ms
 * @returns {Function} Throttled handler
 */
export function throttleEventHandler(handler, delay = 100) {
  let lastCall = 0;

  return function (...args) {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      handler.apply(this, args);
    }
  };
}

/**
 * Debounce event handler execution
 * @param {Function} handler - Handler function
 * @param {number} delay - Delay in ms
 * @returns {Function} Debounced handler
 */
export function debounceEventHandler(handler, delay = 300) {
  let timeoutId = null;

  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      handler.apply(this, args);
    }, delay);
  };
}
