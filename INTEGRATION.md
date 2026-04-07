# Integration Guide - Color Guesser Modular Architecture

## Overview

This guide documents how to use the new modular Color Guesser architecture. All core modules (Phases 1-6) are complete and exposed via the `window.ColorGuesser` namespace.

## Module Hierarchy

```
window.ColorGuesser
├── Constants          (Phase 1) - Game constants, labels, tiers
├── DOM                (Phase 1) - Cached DOM element references  
├── GameState          (Phase 1) - Global game state
├── Color              (Phase 2) - Color conversion & distance
│   ├── conversion     - HSL/RGB/HEX conversions
│   ├── parsing        - Input parsing and validation
│   ├── distance       - Color distance calculations
│   └── namedColors    - Named color pool management
├── Mode               (Phase 3) - Game mode configuration
│   └── config         - Mode settings, theming, labels
├── Score              (Phase 3) - Scoring system
│   └── system         - Score calculations, animations, tiers
├── UI                 (Phase 4) - User interface helpers
│   ├── helpers        - Button effects, visibility control
│   ├── updater        - UI element updates, slider management
│   └── menu           - Menu, drawer, leaderboard rendering
├── Game               (Phase 5) - Game logic
│   ├── solo           - Solo mode round flow and scoring
│   └── online         - Online mode coordination and results
├── Converter          (Phase 5) - Color converter tool
├── Auth               (Phase 6) - Authentication & sessions
├── Socket             (Phase 6) - WebSocket management
└── Events             (Phase 6) - DOM event handling
```

## Usage Examples

### 1. Color Conversion

```javascript
// Convert hex to RGB
const rgb = ColorGuesser.Color.conversion.hexToRgb('#FF5733');
// → { r: 255, g: 87, b: 51 }

// Convert RGB to HSL
const hsl = ColorGuesser.Color.conversion.rgbToHsl(255, 87, 51);
// → { h: 11, s: 100, l: 60 }

// Format for display
const hex = ColorGuesser.Color.conversion.rgbToHex(255, 87, 51);
// → '#FF5733'
```

### 2. Color Scoring

```javascript
// Calculate solo game score
const score = ColorGuesser.Game.solo.calculateColorScore(
  { h: 10, s: 85, l: 50 },  // guess
  { h: 15, s: 90, l: 55 }   // target
);
// → number (0-1000)

// Get score display tier
const tier = ColorGuesser.Score.system.getScoreVisualTier(score);
// → { tier: 'excellent', color: '#4CAF50', label: 'Excellent!' }
```

### 3. UI Updates

```javascript
// Update player preview color
ColorGuesser.UI.updater.updatePlayerPreview(
  { h: 200, s: 70, l: 50 },
  ColorGuesser.DOM.playerPreview
);

// Pulse a button for feedback
ColorGuesser.UI.helpers.pulseButton(ColorGuesser.DOM.submitBtn);

// Control slider state
ColorGuesser.UI.updater.setSlidersEnabled(true);
```

### 4. Game Mode Management

```javascript
// Get current mode configuration
const modeConfig = ColorGuesser.Mode.config.getLocalModeConfig();
// → { 
//     game: 'memory',
//     difficulty: 'normal',
//     theme: 'light',
//     soundEnabled: true
//   }

// Apply theme
ColorGuesser.Mode.config.applyTheme('dark');

// Get theme name
const theme = ColorGuesser.Mode.config.getThemeName();
// → 'dark'
```

### 5. Authentication

```javascript
// Login user
const result = await ColorGuesser.Auth.loginRequest('PlayerName', 'password123');
if (result.success) {
  ColorGuesser.Auth.setAuthenticatedUser(result.user, updateState);
  const name = ColorGuesser.Auth.getPlayerName(result.user);
  // → 'PlayerName'
}

// Check if authenticated
if (ColorGuesser.Auth.isAuthenticated(authenticatedUser)) {
  const profile = ColorGuesser.Auth.getUserProfile(authenticatedUser);
  console.log(`Stats: ${profile.roundsPlayed} rounds, Best: ${profile.bestScore}`);
}

// Logout
await ColorGuesser.Auth.logoutRequest();
```

### 6. Socket Events

```javascript
// Initialize socket connection
const socket = ColorGuesser.Socket.initializeSocket();

// Listen for game events
ColorGuesser.Socket.onSocketEvent('round-started', (data) => {
  console.log('Round started:', data.target);
  displayRound(data);
});

// Emit player ready
ColorGuesser.Socket.emitPlayerReady(roomId, userId);

// Submit round answer
ColorGuesser.Socket.emitSubmitRound(roomId, {
  guess: { h: 200, s: 70, l: 50 },
  submittedAt: Date.now()
});

// Check connection status
const isConnected = ColorGuesser.Socket.isSocketConnected();
```

### 7. Event Binding

```javascript
// Register single event
const cleanup = ColorGuesser.Events.registerEvent(
  '#submitBtn',
  'click',
  (event) => {
    event.preventDefault();
    handleSubmit();
  }
);

// Setup multiple events at once
const cleanupAll = ColorGuesser.Events.setupSliderEvents(
  handleColorSlider,
  handleHueSlider,
  handleSaturationSlider,
  handleLightnessSlider
);

// Keyboard shortcuts
const cleanupKeys = ColorGuesser.Events.setupKeyboardShortcuts({
  'enter': (e) => submitGuess(),
  'escape': (e) => resetSliders(),
  's': (e) => skipRound()
});

// Throttled handler
const throttled = ColorGuesser.Events.throttleEventHandler(updateUI, 100);
```

## Migration Path from script.js

### Step 1: Use Modules in script.js

```javascript
// Old way (in script.js):
function hexToRgb(hex) { /* ... */ }
const rgb = hexToRgb('#FF5733');

// New way:
import * as Conversion from './src/client/color/conversion.js';
const rgb = Conversion.hexToRgb('#FF5733');

// Or via window namespace (when loaded):
const rgb = window.ColorGuesser.Color.conversion.hexToRgb('#FF5733');
```

### Step 2: Extract Complex Functions

```javascript
// Instead of having 200+ lines of scoring logic in script.js
// Use the dedicated module:

// Old:
function calculateScore(guess, target) {
  const hDiff = Math.abs(guess.h - target.h);
  const sDiff = Math.abs(guess.s - target.s);
  const lDiff = Math.abs(guess.l - target.l);
  // ... 50 more lines
  return score;
}

// New:
const score = ColorGuesser.Game.solo.calculateColorScore(guess, target);
```

### Step 3: Delegate Event Handling

```javascript
// Old (scattered throughout script.js):
document.getElementById('submitBtn').addEventListener('click', handleSubmit);
document.getElementById('resetBtn').addEventListener('click', handleReset);
document.getElementById('hueSlider').addEventListener('input', handleHueChange);
// ... more events

// New (centralized):
ColorGuesser.Events.setupButtonEvents({
  onSubmit: handleSubmit,
  onReset: handleReset,
  onSettings: handleSettings
});

ColorGuesser.Events.setupSliderEvents(
  handleColor,
  handleHue,
  handleSaturation,
  handleLightness
);
```

### Step 4: Centralize State Updates

```javascript
// Old:
playerPreview.style.backgroundColor = rgbToHex(rgb);
sliders.forEach(s => s.disabled = phase === 'reveal');
submitBtn.classList.toggle('disabled', isDisabled);

// New:
ColorGuesser.UI.updater.updatePlayerPreview(hslColor, colorElement);
ColorGuesser.UI.updater.setSlidersEnabled(!isReveal);
ColorGuesser.UI.helpers.updateActiveButton(submitBtn, !isDisabled);
```

## Testing Modules

### 1. Check Module Availability

```javascript
// In browser console:
console.log(window.ColorGuesser);
// Should show all namespaces

// Check specific module
console.log(window.ColorGuesser.Color.conversion.hexToRgb);
// Should show function
```

### 2. Test Color Conversion

```javascript
// Test round-trip conversion
const hex = '#FF5733';
const rgb = ColorGuesser.Color.conversion.hexToRgb(hex);
const hexBack = ColorGuesser.Color.conversion.rgbToHex(rgb.r, rgb.g, rgb.b);
console.assert(hexBack === hex, 'Conversion failed');
```

### 3. Test Authentication

```javascript
// Register and login
const registerResult = await ColorGuesser.Auth.registerRequest('TestUser', 'pass123');
const loginResult = await ColorGuesser.Auth.loginRequest('TestUser', 'pass123');
console.assert(loginResult.success, 'Login failed');
```

### 4. Test Socket Connection

```javascript
// Initialize and check
ColorGuesser.Socket.initializeSocket();
setTimeout(() => {
  const status = ColorGuesser.Socket.getSocketStatus();
  console.log('Socket connected:', status.connected);
}, 1000);
```

## File Structure

```
src/client/
├── index.js                    # Entry point, module aggregator
├── constants.js                # Game constants & labels
├── dom.js                       # DOM element cache
├── game-state.js               # Global state object
├── app.js                       # Orchestration hooks
│
├── color/
│   ├── conversion.js           # 180 lines - color math
│   ├── parsing.js              # 82 lines - input parsing  
│   ├── distance.js             # 103 lines - distance scoring
│   └── named-colors.js         # 108 lines - color pool
│
├── mode/
│   └── config.js               # 128 lines - mode settings
│
├── score/
│   └── system.js               # 352 lines - scoring engine
│
├── ui/
│   ├── helpers.js              # 62 lines - UI effects
│   ├── updater.js              # 268 lines - UI updates
│   └── menu.js                 # 193 lines - menu/leaderboard
│
├── game/
│   ├── solo.js                 # 306 lines - solo logic
│   └── online.js               # 227 lines - online logic
│
├── converter/
│   └── index.js                # 175 lines - converter tool
│
├── auth.js                     # 157 lines - authentication
├── socket-manager.js           # 341 lines - websocket
└── events.js                   # 355 lines - DOM events
```

## Performance Considerations

### Bundle Size
- **Total**: ~3,100 lines across 21 modules
- **Comparison**: Old monolith (script.js) = 2,200 lines + server files
- **Benefit**: Tree-shaking enabled - unused modules can be excluded

### Module Load Order
1. Constants (no dependencies)
2. DOM (depends on Constants)
3. GameState (depends on Constants)
4. Color utilities (depends on Constants)
5. Business logic (depends on Color + GameState)
6. UI & Game (depends on all above)
7. Network (depends on Auth + Socket)
8. Events (depends on DOM + all handlers)

### Lazy Loading
Not impacting this architecture yet, but modules can be lazy-loaded:

```javascript
// Load auth only when login modal opens
const Auth = await import('./auth.js');
const result = await Auth.loginRequest(name, password);
```

## Debugging

### Enable Debug Logs

```javascript
// List all registered events
console.log('Registered events:', ColorGuesser.Events.getRegisteredEvents());

// Check socket status
console.log('Socket:', ColorGuesser.Socket.getSocketStatus());

// Get event handler count
console.log('Handlers:', ColorGuesser.Events.getEventHandlerCount());
```

### Check Namespace

```javascript
// Validate all modules loaded
const required = [
  'Color', 'Mode', 'Score', 'UI', 'Game', 
  'Converter', 'Auth', 'Socket', 'Events'
];

required.forEach(mod => {
  console.assert(
    window.ColorGuesser[mod],
    `Missing module: ${mod}`
  );
});
```

## Next Steps

1. **Gradual Migration**: Replace functions in script.js one by one
2. **Testing**: Create unit tests for each module
3. **Performance**: Monitor bundle size and load times
4. **Cleanup**: Remove old functions from script.js as migrations complete
5. **Documentation**: Keep this guide updated as modules evolve

---

**Integration Status**: Phase 6 modules complete. Script.js remains as main orchestrator while migration proceeds. All modules accessible via `window.ColorGuesser` namespace.
