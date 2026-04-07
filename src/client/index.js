/**
 * src/client/index.js
 * ====================
 * Entry point ES6 du client Color Guesser
 * Importe et configure les modules
 *
 * Pour utiliser en production, mettre à jour index.html:
 * <script type="module">
 *   import './src/client/index.js';
 * </script>
 */

// ====== FOUNDATIONAL MODULES ======
import * as Constants from './constants.js';
import { DOM } from './dom.js';
import * as GameState from './game-state.js';

// ====== Expose au contexte global pour rétro-compatibilité ======
// Cela permet d'utiliser les modules préparés pendant que script.js reste le moteur principal.
window.ColorGuesser = window.ColorGuesser || {};
window.ColorGuesser.Constants = Constants;
window.ColorGuesser.DOM = DOM;
window.ColorGuesser.GameState = GameState;

function loadLegacyScript() {
	return new Promise((resolve, reject) => {
		if (window.__colorGuesserLegacyLoaded) {
			resolve();
			return;
		}

		const legacyScript = document.createElement('script');
		legacyScript.src = 'script.js';
		legacyScript.async = false;
		legacyScript.onload = () => {
			window.__colorGuesserLegacyLoaded = true;
			resolve();
		};
		legacyScript.onerror = () => reject(new Error('Impossible de charger script.js'));
		document.body.appendChild(legacyScript);
	});
}

loadLegacyScript().catch((error) => {
	console.error(error);
});

console.log('✅ Color Guesser client modules loaded', window.ColorGuesser);
