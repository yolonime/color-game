/**
 * Game mode configurations
 * Static data for each mode (labels, descriptions, stage text)
 */

// =============================================================================
// Local (Solo) Mode Configurations
// =============================================================================

/**
 * Get configuration for current local game mode
 * @param {string} localMode - Current local mode (memory, name, or code)
 * @param {string} codeFormat - Current code format if in code mode
 * @returns {Object} Mode configuration with labels and descriptions
 */
export function getLocalModeConfig(localMode, codeFormat = "auto") {
  if (localMode === "name") {
    return {
      eyebrow: "Nom couleur",
      subtitle: "Lis le nom de la couleur, puis retrouve sa teinte avec les curseurs.",
      ctaTitle: "Defi nom de couleur",
      ctaSubtitle: "Le nom apparait, puis tu reconstruis la vraie couleur.",
      startLabel: "Lancer le mode nom couleur",
      stageIntro: "Observe le nom de la couleur",
      stageHidden: "Le nom a disparu. Reproduis la couleur.",
      targetLabel: "Vraie couleur",
    };
  }

  if (localMode === "code") {
    return {
      eyebrow: "Mode code",
      subtitle: "Lis un code couleur HEX ou RGB et reconstruis la couleur avec les curseurs.",
      ctaTitle: "Defi code couleur",
      ctaSubtitle: "Interprete le code affiche, vise juste, puis valide ton score.",
      startLabel: "Lancer le mode code",
      stageIntro: "Observe le code couleur",
      stageHidden: "Le code a disparu. Reproduis la couleur.",
      targetLabel: "Couleur cible",
    };
  }

  // Default: memory mode
  return {
    eyebrow: "Memoire",
    subtitle: "Observe la couleur pendant 5 secondes, puis recree-la avec les curseurs.",
    ctaTitle: "Defi memoire chromatique",
    ctaSubtitle: "Partie rapide en 5 manches. Plus tu es precis, plus ton score grimpe.",
    startLabel: "Lancer le mode memoire",
    stageIntro: "Memorise cette couleur",
    stageHidden: "La couleur est cachee. Reproduis-la avec les curseurs.",
    targetLabel: "Couleur cible",
  };
}

// =============================================================================
// Online Mode Configurations
// =============================================================================

/**
 * Get configuration for current online game mode
 * @param {string} onlineMode - Current online mode (memory, name, or code)
 * @param {Function} getCodeFormatLabel - Function to get code format label
 * @param {string} codeFormat - Code format (hex, rgb, hsl, auto)
 * @returns {Object} Mode configuration with labels and descriptions
 */
export function getOnlineModeConfig(onlineMode, getCodeFormatLabel, codeFormat = "auto") {
  if (onlineMode === "name") {
    return {
      eyebrow: "Online",
      subtitle: "Joue en salon avec des noms de couleur a reproduire.",
      ctaTitle: "Defi multijoueur nom couleur",
      ctaSubtitle: "Le host lance 5 manches et tout le monde reconstruit la vraie couleur.",
      startLabel: "Lancer la partie online",
      stageIntro: "Observe le nom de couleur",
      stageHidden: "Le nom a disparu. Reproduis la couleur.",
      targetLabel: "Vraie couleur",
    };
  }

  if (onlineMode === "code") {
    const formatLabel = typeof getCodeFormatLabel === "function" ? getCodeFormatLabel(codeFormat) : codeFormat;
    return {
      eyebrow: "Online",
      subtitle: "Joue en salon avec des codes couleur a interpreter.",
      ctaTitle: "Defi multijoueur code couleur",
      ctaSubtitle: `Le format ${formatLabel} est partage a toute la salle.`,
      startLabel: "Lancer la partie online",
      stageIntro: "Observe le code couleur",
      stageHidden: "Le code a disparu. Reproduis la couleur.",
      targetLabel: "Vraie couleur",
    };
  }

  // Default: online memory
  return {
    eyebrow: "Online",
    subtitle: "Joue en salon avec d'autres joueurs pour reproduire des couleurs.",
    ctaTitle: "Defi multijoueur",
    ctaSubtitle: "Le host lance des manches, tout le monde joue simultanement.",
    startLabel: "Lancer la partie online",
    stageIntro: "Observe la couleur",
    stageHidden: "La couleur est cachee. Reproduis-la.",
    targetLabel: "Vraie couleur",
  };
}

// =============================================================================
// Theme Configuration
// =============================================================================

/**
 * Get theme name for current mode
 * @param {string} gameMode - Game mode (solo or online)
 * @param {string} localMode - Local mode if in solo (memory, name, or code)
 * @returns {string} Theme name to set on data-theme attribute
 */
export function getThemeName(gameMode, localMode = "memory") {
  if (gameMode === "online") {
    return "online";
  }

  if (localMode === "name") {
    return "name";
  }

  if (localMode === "code") {
    return "code";
  }

  return "memory";
}

/**
 * Apply theme to document
 * Updates body data-theme attribute
 * @param {string} themeName - Theme name (memory, name, code, or online)
 */
export function applyTheme(themeName) {
  document.body.dataset.theme = themeName;
}

/**
 * Apply theme based on game mode
 * @param {string} gameMode - Game mode
 * @param {string} localMode - Local mode if in solo
 */
export function setTheme(gameMode, localMode = "memory") {
  const themeName = getThemeName(gameMode, localMode);
  applyTheme(themeName);
}
