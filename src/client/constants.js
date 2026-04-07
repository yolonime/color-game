/**
 * Constants globales du jeu
 */

export const SHOW_DURATION_SECONDS = 5;
export const FIXED_LIGHTNESS = 50;
export const MATCH_ROUNDS = 5;
export const NEXT_ROUND_DELAY_MS = 1400;

export const NAME_DIFFICULTY_VARIANTS = {
  easy: ["base"],
  normal: ["base", "clair", "profond"],
  expert: ["base", "clair", "profond", "vif", "fume"],
};

export const NAME_DIFFICULTY_LABELS = {
  easy: "Facile",
  normal: "Normal",
  expert: "Expert",
};

export const CODE_FORMAT_LABELS = {
  auto: "Auto",
  hex: "HEX",
  rgb: "RGB",
  hsl: "HSL",
};

export const SCORE_VISUAL_TIERS = [
  { id: "tier-1", min: 0, label: "Echauffement" },
  { id: "tier-2", min: 45, label: "Solide" },
  { id: "tier-3", min: 70, label: "Excellent" },
  { id: "tier-4", min: 90, label: "Legende" },
];
