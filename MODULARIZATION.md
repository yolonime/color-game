# 📦 Architecture Modulaire - Color Guesser

## 🎯 Objectif

Découper le monolithe `script.js` (2200+ lignes) en modules logiques, maintenables et réutilisables.

## 📂 Structure Proposée

```
src/
├── client/
│   ├── constants.js         # Constantes jeu, labels, tiers
│   ├── dom.js               # Cache centralisé des éléments DOM
│   ├── game-state.js        # État global du jeu (variables mutables)
│   ├── app.js               # Orchestrateur & entry point
│   │
│   ├── color/
│   │   ├── conversion.js    # HSL ↔ RGB ↔ HEX conversions
│   │   ├── parsing.js       # Parsing input (codes couleur)
│   │   ├── distance.js      # Calcul distance/score couleur
│   │   └── named-colors.js  # Gestion couleurs nommées
│   │
│   ├── code/
│   │   └── management.js    # Sync guess code input ↔ sliders
│   │
│   ├── score/
│   │   └── system.js        # Animations score, tiers visuels
│   │
│   ├── mode/
│   │   ├── config.js        # Config modes (labels, descriptions)
│   │   ├── manager.js       # Switchs modes (setLocalMode, setGameMode)
│   │   └── theme.js         # Theming par mode
│   │
│   ├── converter/
│   │   └── index.js         # Outil convertisseur couleur
│   │
│   ├── ui/
│   │   ├── updater.js       # Mise à jour UI (sliders, préview, SEO)
│   │   ├── menu.js          # Menu drawer, leaderboard
│   │   └── helpers.js       # Helpers UI (pulse, nudge, etc)
│   │
│   ├── game/
│   │   ├── solo.js          # Mode solo (round flow, scoring)
│   │   └── online.js        # Mode online (rooms, reveal, results)
│   │
│   ├── auth.js              # Authentification, sessions
│   ├── socket-manager.js    # Listeners Socket.io
│   ├── events.js            # Event listeners DOM
│   └── app.js               # Orchestrateur
│
├── server/
│   ├── constants.js       # Constantes serveur et labels partagés
│   ├── auth-utils.js      # Cookies, sessions, hash mot de passe
│   └── color-utils.js     # Utilitaires couleur serveur
│
└── (fichiers racine)
    ├── script.js            # ← À progressivement migrer vers src/client/
    ├── server.js
    ├── index.html           # ← Charge l'entry point ES6
    └── ...
```

## 🔄 Stratégie de Modularisation

### Phase 1 : Fondations ✅
- [x] `constants.js` - Constantes & labels
- [x] `dom.js` - Cache DOM centralisé
- [x] `game-state.js` - État global
- [x] `app.js` - Documentationstructure
- **Statut**: Complétée - ES6 modules, entry point en index.js

### Phase 2 : Utilitaires ⏳
- [x] `color/conversion.js` - Conversions couleur (hslToRgb, rgbToHsl, hexToRgb, etc)
- [x] `color/distance.js` - Calcul score basé distance
- [x] `color/named-colors.js` - buildNamedColors, pickNamedColor, refillPool
- [x] `color/parsing.js` - Parsing input codes couleur
- **Statut**: Modules créés avec ES6 exports, exposés via window.ColorGuesser.Color

### Phase 3 : Système Métier ⏳
- [x] `score/system.js` - Scoring, animations, tiers
- [x] `mode/config.js` - Config modes (labels, descriptions)
- [ ] `mode/manager.js` - Switchs modes, setGameMode, setLocalMode, etc
- [ ] `mode/theme.js` - setTheme, data-theme
- **Statut**: Modules utilitaires créés, mode manager à faire (contient logique complexe)

### Phase 4 : UI & UX ⏳
- [x] `ui/updater.js` - updatePlayerPreview, updateSliderImpactBars, updateGuessCodeUi, syncGuessCodeFromSliders, applyGuessCodeInput, setSlidersEnabled
- [x] `ui/menu.js` - toggleMenu, toggleScoreDrawer, renderPlayers, renderLeaderboard, updateMenuButtons, updateSelectedModeButtons
- [x] `ui/helpers.js` - pulseButton, nudgeElement, setElementVisibility, setElementsDisabled, updateActiveButton
- **Statut**: Modules créés, exposés via window.ColorGuesser.UI

### Phase 5 : Logique Jeu ⏳
- [x] `game/solo.js` - calculateColorScore, startSoloMatch, advanceSoloRound, recordRoundScore, isSoloMatchComplete, getSoloMatchSummary, formatRoundHeader, getRoundResultMessage, getStageModeMessage, getStageModeBackground, getHiddenStageBackground
- [x] `game/online.js` - initializeOnlineMatch, startOnlineRound, submitOnlineRound, markPlayerReady, allPlayersReady, isOnlineMatchComplete, leaveOnlineRoom, getOnlineWaitingMessage, formatOnlineLeaderboard, updatePlayersList
- [x] `converter/index.js` - updateConverterDisplay, updateConverterGradientBars, copyToClipboard, formatRgbString, formatHslString, getConverterHintText, getInitialConverterState
- **Statut**: Modules logique créés, exposés via window.ColorGuesser.Game et window.ColorGuesser.Converter

### Phase 6 : Réseau & Événements ✅
- [x] `auth.js` - loginRequest, registerRequest, refreshAuthSession, logoutRequest, setAuthenticatedUser, getPlayerName, isAuthenticated, getUserProfile, isValidAuthResponse, formatAuthError
- [x] `socket-manager.js` - initializeSocket, getSocket, isSocketConnected, disconnectSocket, reconnectSocket, onSocketEvent, offSocketEvent, emitJoinRoom, emitLeaveRoom, emitPlayerReady, emitStartRound, emitSubmitRound, emitChatMessage, createRoom, getAvailableRooms, getRoomDetails
- [x] `events.js` - registerEvent, registerEvents, setupSliderEvents, setupButtonEvents, setupFormEvents, setupInputEvents, setupMenuToggleEvent, setupKeyboardShortcuts, setupEnterKeyHandler, setupWindowResizeHandler, triggerCustomEvent, onCustomEvent, throttleEventHandler, debounceEventHandler
- **Statut**: Modules réseau et événements créés, exposés via window.ColorGuesser.Auth, window.ColorGuesser.Socket, window.ColorGuesser.Events - commit 9f8a2c1

### Phase 7 : Intégration ⏳
- Mettre à jour `index.html` avec imports ES6
- Remplacer `<script src="script.js">` par `<script type="module" src="src/client/index.js">` pendant la transition
- Tester chaque module progressivement

## 🎯 Bénéfices Attendus

| Avant | Après |
|-------|-------|
| script.js: 2200+ lignes | Modules de 50-200 lignes chacun |
| Difficile trouver code | Chemin clair: `src/client/mode/manager.js` |
| Pas de réutilisabilité | color/conversion.js importable dans tests |
| Refactoring risqué | Changements isolés par module |
| Dépendances implicites | Imports explicites en haut |

## 📝 Implémentation

### 1. Créer un module
```javascript
// src/client/color/conversion.js
export function hexToRgb(hex) {
  // ... implementation
}

export function hslToRgb(h, s, l) {
  // ... implementation
}
```

### 2. Importer dans script.js
```javascript
// script.js (top)
import { hexToRgb, hslToRgb } from './src/client/color/conversion.js';

// Maintenant hexToRgb() fonctionne comme avant
// mais on SAIT d'où elle vient
```

### 3. Mettre à jour les dépendances
```javascript
// src/client/color/distance.js
import { hslToRgb, hexToRgb } from './conversion.js';

export function hslDistanceScore(target, guess) {
  // ... uses hslToRgb
}
```

### 4. Tester progressivement
```bash
# Valider chaque module
node --check src/client/constants.js
node --check src/client/dom.js
# ... etc
```

## 🚀 Prochaines Étapes

1. **Court terme**: Créer `color/` modules (haute réutilisabilité)
2. **Moyen terme**: Extraire `mode/` et `score/` (logique métier)
3. **Long terme**: Modulariser `game/` et `socket-manager.js`
4. **Final**: Migrer complètement vers ES6 modules

## ❓ Questions Fréquentes

**Q: Pourquoi garder script.js?**
R: Transition progressive. Une fois tous les modules créés, script.js devient juste un orchestrateur.

**Q: Comment gérer les dépendances circulaires?**
R: Planifier les imports pour éviter cycles:
- Constants ne dépendent de rien
- Utils dépendent de Constants
- Logic dépend de Utils
- UI dépend de Logic & Utils

**Q: Quand migrer index.html?**
R: Une fois tous les modules prêts. Pour tester, utiliser:
```html
<script type="module">
  import './src/client/app.js';
</script>
```

## 📞 Responsable

Architecture et guidage: AI Assistant  
Implémentation: Vous et les modules

---

**Status**: 🟡 En cours - Phases 1-6 complétées (All Core Modules), Phase 7 (Integration & Testing) en préparation
