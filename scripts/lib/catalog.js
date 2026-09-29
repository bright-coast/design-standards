'use strict';
// Builds catalog.json in the Bright Coast AI skill catalog schema.
// The formatter writes one key per line, 2-space indent, and lists of plain values on one line.
// The schema's `guide` and `overview` keys are omitted (there is no such document here).
const { lfSha256Buffer } = require('./lf');
const { LICENCE_NAME } = require('./headers');

const SKILL_PATH = 'skills/design-standards/SKILL.md';
const REF_PREFIX = 'skills/design-standards/references/';
const SUMMARY = 'Gives Claude a library of design rules for building clear, easy-to-use interfaces, loaded one category at a time, plus a checklist of the tells that make a screen look machine-made. It applies whenever you ask Claude to build, design, review or restyle a page, form, table or dashboard.';

function fmt(v, depth) {
  const pad = '  '.repeat(depth);
  const padIn = '  '.repeat(depth + 1);
  if (Array.isArray(v)) {
    if (v.length === 0) return '[]';
    if (v.every((x) => x === null || typeof x !== 'object')) return '[' + v.map((x) => JSON.stringify(x)).join(', ') + ']';
    return '[\n' + v.map((x) => padIn + fmt(x, depth + 1)).join(',\n') + '\n' + pad + ']';
  }
  if (v !== null && typeof v === 'object') {
    const keys = Object.keys(v);
    if (!keys.length) return '{}';
    return '{\n' + keys.map((k) => padIn + JSON.stringify(k) + ': ' + fmt(v[k], depth + 1)).join(',\n') + '\n' + pad + '}';
  }
  return JSON.stringify(v);
}

// The first plain line under the first "## " heading of CHANGELOG.md, or "First release."
function firstChange(changelog) {
  if (!changelog) return 'First release.';
  const lines = changelog.replace(/\r\n/g, '\n').split('\n');
  const i = lines.findIndex((l) => /^##\s/.test(l));
  if (i < 0) return 'First release.';
  for (let j = i + 1; j < lines.length; j++) {
    if (/^##\s/.test(lines[j])) break;
    const t = lines[j].replace(/^\s*[-*]\s+/, '').trim();
    if (t) return t;
  }
  return 'First release.';
}

// files: map of relPath -> text for every skill file. Returns the catalog.json text.
function buildCatalog({ version, files, changelog }) {
  const hash = (f) => lfSha256Buffer(Buffer.from(files[f], 'utf8'));
  const refs = Object.keys(files).filter((f) => f.startsWith(REF_PREFIX)).sort();
  const catalog = {
    catalog_version: 1,
    repo: 'bright-coast/design-standards',
    ref: 'stable',
    raw_base: 'https://raw.githubusercontent.com/bright-coast/design-standards/stable/',
    license: LICENCE_NAME,
    skills: [{
      id: 'design-standards',
      name: 'Design Standards',
      status: 'ready',
      version,
      sha256: hash(SKILL_PATH),
      category: 'Building',
      summary: SUMMARY,
      needs: [],
      offer_if: 'builds or designs web pages, apps or dashboards',
      path: SKILL_PATH,
      changes: firstChange(changelog),
      files: refs.map((p) => ({ path: p, sha256: hash(p) })),
    }],
  };
  return fmt(catalog, 0) + '\n';
}
module.exports = { buildCatalog, fmt, firstChange, SKILL_PATH };
