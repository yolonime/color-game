/**
 * app.js
 * ======
 * Point d'entrée client pour Color Guesser
 * 
 * ARCHITECTURE MODULAIRE (Refactor en cours)
 * ==========================================
 * 
 * Le code est progressivement découpé en modules logiques:
 * 
 * src/client/
 * ├── constants.js       ✅ Toutes les constantes jeu & UI
 * ├── dom.js             ✅ Cache centralisé des éléments DOM (références)
 * ├── game-state.js      ✅ État global du jeu (variables)
 * ├── color-utils.js     ⏳ Conversions couleur, parsing, closest match
 * ├── code-management.js ⏳ Gestion codes couleur (guess code input/sync)
 * ├── score-system.js    ⏳ Animations, calculs scores, tiers visuels
 * ├── mode-manager.js    ⏳ Switchs modes (solo/online, memory/name/code, etc)
 * ├── converter/
 * │   └── index.js       ⏳ Outil convertisseur couleur (init, rendus)
 * ├── ui/
 * │   ├── updater.js     ⏳ Mise à jour UI générale (sliders, modes, seo)
 * │   └── menu.js        ⏳ Menu, leaderboard, scores
 * ├── game/
 * │   ├── solo.js        ⏳ Mode solo (round flow, scoring)
 * │   └── online.js      ⏳ Mode online (room, reveal, results)
 * ├── auth.js            ⏳ Authentification et sessions
 * ├── socket-manager.js  ⏳ Listeners/emits Socket.io
 * ├── events.js          ⏳ Event listeners (buttons, sliders, etc)
 * └── app.js             ✅ Cet fichier (orchestrateur)
 * 
 * STATUT DE MODULARISATION
 * =========================
 * ✅ = Créé et fonctionnel (exports ES6)
 * ⏳ = À créer progressivement
 * 
 * TRANSITION
 * ==========
 * For now, script.js is the "main" file. As modules are extracted,
 * they'll be @import'd into script.js and progressively replace functions.
 *
 * import { CONSTANTS, LABELS } from './constants.js';
 * import { DOM } from './dom.js';
 * import * as GameState from './game-state.js';
 * // ... etc
 */

// À implémenter : initialisation du jeu qui importe tous les modules
console.log('[app.js] Color Guesser modulaire - Architecture prête pour modularisation progressive');
