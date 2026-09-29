'use strict';
const fs = require('fs');
const path = require('path');
const CATEGORIES = require('./lib/categories');
const { HEADER, LOCAL_MD_SENTENCE } = require('./lib/headers');
const { loadPatterns, loadDek } = require('./lib/repo');
const { htmlToMd, codeToText, fence, fenceLang } = require('./lib/html');
const { fill } = require('./build-page');

const MAX_REFERENCE_BYTES = 100 * 1024;
const MAX_REFERENCE_FILES = 20;
const LABELS = { 'caveat-box': 'Note', 'variant-note': 'Variant' };
const read = (root, rel) => fs.readFileSync(path.join(root, rel), 'utf8').replace(/\r\n/g, '\n').trim();

function renderReference(cat, items, dekHtml) {
  const out = [HEADER, '', `# ${cat.title}`, ''];
  if (dekHtml) out.push(htmlToMd(dekHtml), '');
  out.push(`${items.length} patterns. Use when: ${cat.when}.`, '');
  for (const p of items) {
    out.push(`## ${p.title}`, '', htmlToMd(p.rule), '');
    if (p.dos.length) out.push('Do:', ...p.dos.map((d) => `- ${htmlToMd(d)}`), '');
    if (p.avoids.length) out.push('Avoid:', ...p.avoids.map((d) => `- ${htmlToMd(d)}`), '');
    for (const e of p.extras) if (LABELS[e.kind]) out.push(`${LABELS[e.kind]}: ${htmlToMd(e.html)}`, '');
    for (const c of p.codes) out.push(`Code (${c.label}):`, '', fence(codeToText(c.html), fenceLang(c.label)), '');
  }
  return out.join('\n').replace(/\n{3,}/g, '\n\n').trimEnd() + '\n';
}

function buildSkill(root) {
  const patterns = loadPatterns(root);
  const cats = CATEGORIES.filter((c) => patterns.some((p) => p.category === c.id));
  if (cats.length > MAX_REFERENCE_FILES) throw new Error(`${cats.length} reference files, over the ${MAX_REFERENCE_FILES} file limit`);
  const table = [
    '| Category | Patterns | File | Load it when the task involves |',
    '|---|---|---|---|',
    ...cats.map((c) => `| ${c.title} | ${patterns.filter((p) => p.category === c.id).length} | \`references/${c.id}.md\` | ${c.when} |`),
  ].join('\n');
  const files = {};
  files['skills/design-standards/SKILL.md'] = fill(read(root, 'skill-src/SKILL.md.tpl'), {
    VERSION: read(root, 'VERSION'), TOTAL: String(patterns.length), CATEGORY_TABLE: table, HEADER, LOCAL_MD_SENTENCE,
  }) + '\n';
  for (const c of cats) {
    const text = renderReference(c, patterns.filter((p) => p.category === c.id), loadDek(root, c.id));
    const bytes = Buffer.byteLength(text, 'utf8');
    if (bytes > MAX_REFERENCE_BYTES) throw new Error(`references/${c.id}.md is ${bytes} bytes, over the ${MAX_REFERENCE_BYTES} byte limit`);
    files[`skills/design-standards/references/${c.id}.md`] = text;
  }
  return files;
}
module.exports = { buildSkill, renderReference, MAX_REFERENCE_BYTES, MAX_REFERENCE_FILES };
