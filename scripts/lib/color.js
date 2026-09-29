'use strict';
function expand(hex) {
  const h = hex.replace('#', '');
  const full = h.length === 3 ? [...h].map((c) => c + c).join('') : h;
  if (!/^[0-9a-fA-F]{6}$/.test(full)) return null;
  return parseInt(full, 16);
}
function hexToHsl(hex) {
  const n = expand(hex);
  if (n === null) return null;
  const r = ((n >> 16) & 255) / 255, g = ((n >> 8) & 255) / 255, b = (n & 255) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const l = (max + min) / 2, d = max - min;
  if (d === 0) return [0, 0, l];
  const s = d / (1 - Math.abs(2 * l - 1));
  let h = max === r ? ((g - b) / d) % 6 : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
  h = (h * 60 + 360) % 360;
  return [h, s, l];
}
function hslToHex(h, s, l) {
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  const [r, g, b] = h < 60 ? [c, x, 0] : h < 120 ? [x, c, 0] : h < 180 ? [0, c, x] : h < 240 ? [0, x, c] : h < 300 ? [x, 0, c] : [c, 0, x];
  const to = (v) => Math.round((v + m) * 255).toString(16).padStart(2, '0');
  return ('#' + to(r) + to(g) + to(b)).toUpperCase();
}
// A generic rule, not a brand list: greens leaning blue (hue 160 to 185) with real saturation.
function isTealFamily(hex) {
  const hsl = hexToHsl(hex);
  if (!hsl) return false;
  const [h, s] = hsl;
  return h >= 160 && h <= 185 && s >= 0.25;
}

// CSS named colours in or near the teal family, as hex. Only names that can fall in the rule are listed.
const NAMED = { teal: '#008080', turquoise: '#40E0D0', aqua: '#00FFFF', cyan: '#00FFFF', mediumaquamarine: '#66CDAA', lightseagreen: '#20B2AA', darkcyan: '#008B8B' };
const toHex2 = (v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0');
const num = (s, pctScale) => (s.endsWith('%') ? (parseFloat(s) / 100) * pctScale : parseFloat(s));
// Every colour literal on a line, as [{text, hex}] with hex normalised to 6 digits (alpha dropped).
// Covers 3, 4, 6 and 8 digit hex, rgb()/rgba(), hsl()/hsla() and the named colours above.
function findColors(line) {
  const out = [];
  // (?<!&) skips numeric character references such as &#128465; (an emoji, not a colour).
  for (const m of line.matchAll(/(?<!&)#(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{4}|[0-9a-fA-F]{3})(?![0-9a-zA-Z])/g)) {
    const h = m[0].slice(1);
    const six = h.length <= 4 ? [...h.slice(0, 3)].map((c) => c + c).join('') : h.slice(0, 6);
    out.push({ text: m[0], hex: ('#' + six).toUpperCase() });
  }
  for (const m of line.matchAll(/\brgba?\(([^)]*)\)/gi)) {
    const p = m[1].split(/[\s,/]+/).filter(Boolean);
    if (p.length < 3) continue;
    const [r, g, b] = p.slice(0, 3).map((s) => num(s, 255));
    if ([r, g, b].some(Number.isNaN)) continue;
    out.push({ text: m[0], hex: ('#' + toHex2(r) + toHex2(g) + toHex2(b)).toUpperCase() });
  }
  for (const m of line.matchAll(/\bhsla?\(([^)]*)\)/gi)) {
    const p = m[1].split(/[\s,/]+/).filter(Boolean);
    if (p.length < 3) continue;
    const h = parseFloat(p[0]);
    const s = num(p[1], 1) / (p[1].endsWith('%') ? 1 : 100);
    const l = num(p[2], 1) / (p[2].endsWith('%') ? 1 : 100);
    if ([h, s, l].some(Number.isNaN)) continue;
    out.push({ text: m[0], hex: hslToHex(((h % 360) + 360) % 360, s, l) });
  }
  for (const m of line.matchAll(/(?<![\w-])(teal|turquoise|aqua|cyan|mediumaquamarine|lightseagreen|darkcyan)(?![\w-])/gi)) {
    out.push({ text: m[0], hex: NAMED[m[0].toLowerCase()] });
  }
  return out;
}
module.exports = { hexToHsl, hslToHex, isTealFamily, findColors, NAMED };
