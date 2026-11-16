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

function renderPattern(p) {
  const out = [`## ${p.title}`, '', htmlToMd(p.rule), ''];
  if (p.dos.length) out.push('Do:', ...p.dos.map((d) => `- ${htmlToMd(d)}`), '');
  if (p.avoids.length) out.push('Avoid:', ...p.avoids.map((d) => `- ${htmlToMd(d)}`), '');
  for (const e of p.extras) if (LABELS[e.kind]) out.push(`${LABELS[e.kind]}: ${htmlToMd(e.html)}`, '');
  for (const c of p.codes) out.push(`Code (${c.label}):`, '', fence(codeToText(c.html), fenceLang(c.label)), '');
  return out.join('\n');
}

// A category too big for one file is split into parts: <id>.md, <id>-2.md and so on.
// Each part names the patterns it holds and where the others are, so a reader loads only what it needs.
const partFile = (id, i) => (i === 0 ? `${id}.md` : `${id}-${i + 1}.md`);
const PART_FILE = /^([a-z0-9][a-z0-9-]*?)(?:-(\d+))?\.md$/;

function renderReference(cat, items, dekHtml, part) {
  const out = [HEADER, '', `# ${cat.title}`, ''];
  if (dekHtml) out.push(htmlToMd(dekHtml), '');
  if (part && part.count > 1) {
    out.push(`File ${part.index + 1} of ${part.count}: ${items.length} of the ${part.total} ${cat.title} patterns. Use when: ${cat.when}.`, '');
    out.push(`In this part: ${items.map((p) => p.title).join('; ')}.`, '');
    for (const o of part.others) out.push(`In \`references/${o.file}\`: ${o.titles.join('; ')}.`, '');
  } else {
    out.push(`${items.length} patterns. Use when: ${cat.when}.`, '');
  }
  for (const p of items) out.push(renderPattern(p));
  return out.join('\n').replace(/\n{3,}/g, '\n\n').trimEnd() + '\n';
}

// The fewest parts that fit, cut at pattern boundaries into parts of similar size.
function splitCategory(cat, items, dekHtml) {
  const whole = renderReference(cat, items, dekHtml);
  if (Buffer.byteLength(whole, 'utf8') <= MAX_REFERENCE_BYTES) return [{ file: partFile(cat.id, 0), text: whole, items }];
  const sizes = items.map((p) => Buffer.byteLength(renderPattern(p), 'utf8'));
  const big = sizes.findIndex((n) => n > MAX_REFERENCE_BYTES * 0.8);
  if (big >= 0) throw new Error(`pattern ${items[big].id} in references/${cat.id}.md is ${sizes[big]} bytes, over the ${MAX_REFERENCE_BYTES} byte limit`);
  const total = sizes.reduce((a, b) => a + b, 0);
  for (let count = 2; count <= MAX_REFERENCE_FILES; count++) {
    const target = total / count;
    const groups = [[]];
    let acc = 0;
    items.forEach((p, i) => {
      if (acc >= target && groups.length < count) { groups.push([]); acc = 0; }
      groups[groups.length - 1].push(p);
      acc += sizes[i];
    });
    const parts = groups.map((g, i) => ({ file: partFile(cat.id, i), items: g }));
    parts.forEach((pt, i) => {
      const others = parts.filter((o) => o !== pt).map((o) => ({ file: o.file, titles: o.items.map((p) => p.title) }));
      pt.text = renderReference(cat, pt.items, dekHtml, { index: i, count: parts.length, total: items.length, others });
    });
    if (parts.every((pt) => Buffer.byteLength(pt.text, 'utf8') <= MAX_REFERENCE_BYTES)) return parts;
  }
  throw new Error(`references/${cat.id}.md cannot be split under the ${MAX_REFERENCE_BYTES} byte limit`);
}

function buildSkill(root) {
  const patterns = loadPatterns(root);
  const cats = CATEGORIES.filter((c) => patterns.some((p) => p.category === c.id));
  const split = cats.map((c) => ({ c, parts: splitCategory(c, patterns.filter((p) => p.category === c.id), loadDek(root, c.id)) }));
  const fileCount = split.reduce((n, x) => n + x.parts.length, 0);
  if (fileCount > MAX_REFERENCE_FILES) throw new Error(`${fileCount} reference files, over the ${MAX_REFERENCE_FILES} file limit`);
  const table = [
    '| Category | Patterns | File | Load it when the task involves |',
    '|---|---|---|---|',
    ...split.map(({ c, parts }) => {
      const filesCell = parts.map((pt) => `\`references/${pt.file}\``).join(', ');
      const when = parts.length > 1 ? `${c.when} (in ${parts.length} parts: the opening lines of each part say which part holds each pattern)` : c.when;
      return `| ${c.title} | ${patterns.filter((p) => p.category === c.id).length} | ${filesCell} | ${when} |`;
    }),
  ].join('\n');
  const files = {};
  files['skills/design-standards/SKILL.md'] = fill(read(root, 'skill-src/SKILL.md.tpl'), {
    VERSION: read(root, 'VERSION'), TOTAL: String(patterns.length), CATEGORY_TABLE: table, HEADER, LOCAL_MD_SENTENCE,
  }) + '\n';
  for (const { parts } of split) for (const pt of parts) files[`skills/design-standards/references/${pt.file}`] = pt.text;
  return files;
}
module.exports = { buildSkill, renderReference, splitCategory, partFile, PART_FILE, MAX_REFERENCE_BYTES, MAX_REFERENCE_FILES };
