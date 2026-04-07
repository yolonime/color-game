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

// ====== COLOR UTILITIES (Phase 2) ======
import * as ColorConversion from './color/conversion.js';
import * as ColorParsing from './color/parsing.js';
import * as ColorDistance from './color/distance.js';
import * as NamedColors from './color/named-colors.js';

// ====== BUSINESS SYSTEM (Phase 3) ======
import * as ModeConfig from './mode/config.js';
import * as ScoreSystem from './score/system.js';

// ====== Expose au contexte global pour rétro-compatibilité ======
// Cela permet d'utiliser les modules préparés pendant que script.js reste le moteur principal.
window.ColorGuesser = window.ColorGuesser || {};
window.ColorGuesser.Constants = Constants;
window.ColorGuesser.DOM = DOM;
window.ColorGuesser.GameState = GameState;
window.ColorGuesser.Color = {
  conversion: ColorConversion,
  parsing: ColorParsing,
  distance: ColorDistance,
  namedColors: NamedColors,
};
window.ColorGuesser.Mode = {
  config: ModeConfig,
};
window.ColorGuesser.Score = {
  system: ScoreSystem,
};

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
