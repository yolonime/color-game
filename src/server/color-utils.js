function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function wrapHue(value) {
  const wrapped = value % 360;
  return wrapped < 0 ? wrapped + 360 : wrapped;
}

function hsl(h, s, l) {
  return `hsl(${h}, ${s}%, ${l}%)`;
}

function hslToRgb(h, s, l) {
  const hue = ((h % 360) + 360) % 360;
  const sat = clamp(s, 0, 100) / 100;
  const lig = clamp(l, 0, 100) / 100;

  const c = (1 - Math.abs((2 * lig) - 1)) * sat;
  const hh = hue / 60;
  const x = c * (1 - Math.abs((hh % 2) - 1));

  let r1 = 0;
  let g1 = 0;
  let b1 = 0;

  if (hh >= 0 && hh < 1) {
    r1 = c;
    g1 = x;
  } else if (hh < 2) {
    r1 = x;
    g1 = c;
  } else if (hh < 3) {
    g1 = c;
    b1 = x;
  } else if (hh < 4) {
    g1 = x;
    b1 = c;
  } else if (hh < 5) {
    r1 = x;
    b1 = c;
  } else {
    r1 = c;
    b1 = x;
  }

  const m = lig - (c / 2);
  return {
    r: Math.round((r1 + m) * 255),
    g: Math.round((g1 + m) * 255),
    b: Math.round((b1 + m) * 255),
  };
}

function rgbToHex({ r, g, b }) {
  const toHex = (n) => clamp(Math.round(n), 0, 255).toString(16).padStart(2, "0").toUpperCase();
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function rgbToHsl(r, g, b) {
  const rr = clamp(r, 0, 255) / 255;
  const gg = clamp(g, 0, 255) / 255;
  const bb = clamp(b, 0, 255) / 255;

  const max = Math.max(rr, gg, bb);
  const min = Math.min(rr, gg, bb);
  const delta = max - min;

  let h = 0;
  if (delta !== 0) {
    if (max === rr) {
      h = 60 * (((gg - bb) / delta) % 6);
    } else if (max === gg) {
      h = 60 * (((bb - rr) / delta) + 2);
    } else {
      h = 60 * (((rr - gg) / delta) + 4);
    }
  }
  if (h < 0) {
    h += 360;
  }

  const l = (max + min) / 2;
  const s = delta === 0 ? 0 : delta / (1 - Math.abs((2 * l) - 1));

  return {
    h: Math.round(h),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

function hslDistance(target, guess) {
  const hueDiffRaw = Math.abs(guess.hue - target.hue);
  const hueDiff = Math.min(hueDiffRaw, 360 - hueDiffRaw);
  const tintDiff = Math.abs(guess.tint - target.tint);
  const lightnessDiff = Math.abs(guess.lightness - target.lightness);
  const hueWeight = 1.3;
  const tintWeight = 1;
  const lightnessWeight = 0.9;
  const normalizedHue = hueDiff / 180;
  const normalizedTint = tintDiff / 100;
  const normalizedLightness = lightnessDiff / 100;
  const weightedDistance =
    Math.sqrt(
      (normalizedHue * hueWeight) ** 2
      + (normalizedTint * tintWeight) ** 2
      + (normalizedLightness * lightnessWeight) ** 2,
    ) /
    Math.sqrt(hueWeight ** 2 + tintWeight ** 2 + lightnessWeight ** 2);
  const strictnessExponent = 2.2;
  const score = Math.max(0, Number((((1 - weightedDistance) ** strictnessExponent) * 100).toFixed(2)));
  return { score, hueDiff, tintDiff, lightnessDiff };
}

function hueCircularDiff(a, b) {
  const raw = Math.abs(a - b);
  return Math.min(raw, 360 - raw);
}

function isColorTooClose(nextColor, previousColor) {
  if (!previousColor) {
    return false;
  }
  return (
    hueCircularDiff(nextColor.hue, previousColor.hue) < 34
    && Math.abs(nextColor.tint - previousColor.tint) < 18
    && Math.abs(nextColor.lightness - previousColor.lightness) < 14
  );
}

function createRandomTarget(previousColor) {
  let candidate = null;

  for (let attempt = 0; attempt < 16; attempt += 1) {
    const next = {
      hue: randomInt(0, 359),
      tint: randomInt(4, 98),
      lightness: randomInt(22, 78),
    };

    candidate = next;
    if (!isColorTooClose(next, previousColor)) {
      break;
    }
  }

  return candidate;
}

function shuffleArray(items) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = randomInt(0, i);
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function getColorCodeLabel(hue, tint, lightness = 50, format = "auto") {
  const rgb = hslToRgb(hue, tint, lightness);
  const selectedFormat = format === "auto"
    ? ["hex", "rgb", "hsl"][randomInt(0, 2)]
    : format;

  if (selectedFormat === "hex") {
    return { format: "HEX", value: rgbToHex(rgb) };
  }

  if (selectedFormat === "hsl") {
    return {
      format: "HSL",
      value: `hsl(${Math.round(hue)}, ${Math.round(tint)}%, ${Math.round(lightness)}%)`,
    };
  }

  return {
    format: "RGB",
    value: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,
  };
}

module.exports = {
  randomInt,
  clamp,
  wrapHue,
  hsl,
  hslToRgb,
  rgbToHex,
  rgbToHsl,
  hslDistance,
  hueCircularDiff,
  isColorTooClose,
  createRandomTarget,
  shuffleArray,
  getColorCodeLabel,
};
