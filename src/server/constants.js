const SHOW_DURATION_MS = 5000;
const MATCH_ROUNDS = 5;
const NEXT_ROUND_DELAY_MS = 1400;
const AUTH_COOKIE_NAME = "cg_auth";
const AUTH_TTL_MS = 1000 * 60 * 60 * 24 * 30;
const VALID_ONLINE_MODES = new Set(["memory", "name", "code"]);
const VALID_CODE_FORMATS = new Set(["auto", "hex", "rgb", "hsl"]);
const NAMED_COLOR_DIFFICULTIES = {
  easy: ["base"],
  normal: ["base", "clair", "profond"],
  expert: ["base", "clair", "profond", "vif", "fume"],
};

const NAMED_COLOR_BASES = [
  { name: "Corail", hue: 16, tint: 86 },
  { name: "Saphir", hue: 217, tint: 82 },
  { name: "Menthe", hue: 156, tint: 64 },
  { name: "Miel", hue: 43, tint: 92 },
  { name: "Violet", hue: 275, tint: 70 },
  { name: "Lagune", hue: 190, tint: 75 },
  { name: "Pistache", hue: 94, tint: 68 },
  { name: "Rubis", hue: 352, tint: 76 },
  { name: "Amande", hue: 78, tint: 48 },
  { name: "Tangerine", hue: 28, tint: 92 },
  { name: "Indigo", hue: 239, tint: 64 },
  { name: "Turquoise", hue: 175, tint: 72 },
  { name: "Cramoisi", hue: 348, tint: 73 },
  { name: "Cerise", hue: 356, tint: 82 },
  { name: "Framboise", hue: 337, tint: 78 },
  { name: "Bordeaux", hue: 344, tint: 56 },
  { name: "Magenta", hue: 320, tint: 84 },
  { name: "Fuchsia", hue: 309, tint: 79 },
  { name: "Prune", hue: 291, tint: 53 },
  { name: "Amethyste", hue: 278, tint: 68 },
  { name: "Lavande", hue: 263, tint: 58 },
  { name: "Mauve", hue: 284, tint: 45 },
  { name: "Ultramarine", hue: 231, tint: 82 },
  { name: "Cobalt", hue: 223, tint: 74 },
  { name: "Bleu acier", hue: 208, tint: 46 },
  { name: "Bleu glacier", hue: 199, tint: 62 },
  { name: "Azur", hue: 204, tint: 92 },
  { name: "Ocean", hue: 197, tint: 68 },
  { name: "Petrole", hue: 188, tint: 57 },
  { name: "Canard", hue: 181, tint: 49 },
  { name: "Emeraude", hue: 147, tint: 74 },
  { name: "Jade", hue: 141, tint: 58 },
  { name: "Foret", hue: 123, tint: 52 },
  { name: "Sauge", hue: 112, tint: 34 },
  { name: "Olive", hue: 83, tint: 45 },
  { name: "Citron vert", hue: 96, tint: 78 },
  { name: "Citron", hue: 58, tint: 84 },
  { name: "Or", hue: 48, tint: 86 },
  { name: "Ocre", hue: 39, tint: 61 },
  { name: "Ambre", hue: 35, tint: 88 },
  { name: "Caramel", hue: 26, tint: 59 },
  { name: "Cuivre", hue: 22, tint: 66 },
  { name: "Terracotta", hue: 15, tint: 58 },
  { name: "Saumon", hue: 8, tint: 78 },
  { name: "Poudre", hue: 350, tint: 38 },
  { name: "Peche", hue: 23, tint: 80 },
  { name: "Rose pastel", hue: 333, tint: 47 },
  { name: "Rose vif", hue: 343, tint: 88 },
  { name: "Sable", hue: 36, tint: 32 },
  { name: "Beige", hue: 41, tint: 28 },
  { name: "Ivoire", hue: 52, tint: 24 },
  { name: "Ardoise", hue: 216, tint: 18 },
  { name: "Graphite", hue: 225, tint: 10 },
  { name: "Brume", hue: 206, tint: 16 },
  { name: "Perle", hue: 198, tint: 20 },
];

const NAMED_COLOR_VARIANTS = [
  { id: "base", label: "", hueOffset: 0, tintOffset: 0 },
  { id: "clair", label: " clair", hueOffset: 2, tintOffset: -12 },
  { id: "profond", label: " profond", hueOffset: -2, tintOffset: 10 },
  { id: "vif", label: " vif", hueOffset: 0, tintOffset: 14 },
  { id: "fume", label: " fume", hueOffset: -4, tintOffset: -16 },
];

const CODE_FORMATS = {
  auto: "Auto",
  hex: "HEX",
  rgb: "RGB",
  hsl: "HSL",
};

const ONLINE_MODE_LABELS = {
  memory: "Mémoire",
  name: "Nom couleur",
  code: "Mode code",
};

module.exports = {
  SHOW_DURATION_MS,
  MATCH_ROUNDS,
  NEXT_ROUND_DELAY_MS,
  AUTH_COOKIE_NAME,
  AUTH_TTL_MS,
  VALID_ONLINE_MODES,
  VALID_CODE_FORMATS,
  NAMED_COLOR_DIFFICULTIES,
  NAMED_COLOR_BASES,
  NAMED_COLOR_VARIANTS,
  CODE_FORMATS,
  ONLINE_MODE_LABELS,
};
