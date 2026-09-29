'use strict';
const fs = require('fs');
const path = require('path');
const CATEGORIES = require('./lib/categories');
const { loadPatterns, loadDek } = require('./lib/repo');
const { renderPattern } = require('./lib/pattern');
const { escapeHtml } = require('./lib/html');

const read = (root, rel) => fs.readFileSync(path.join(root, rel), 'utf8').replace(/\r\n/g, '\n').trim();
// One pass, so text that was inserted is never scanned for placeholders again, and "$&" style text is safe.
const fill = (template, values) => template.replace(/\{\{([A-Z_]+)\}\}/g, (m, k) => (Object.prototype.hasOwnProperty.call(values, k) ? values[k] : m));

// patterns/<cat>/_category.html: plain text is the dek on its own; HTML is rendered verbatim after the
// category head. A line holding the marker splits it: what follows goes after the last pattern.
const CATEGORY_MARKER = '<!-- patterns -->';
function splitCategoryHtml(raw) {
  const i = raw.indexOf(CATEGORY_MARKER);
  const pre = (i < 0 ? raw : raw.slice(0, i)).trim();
  const post = i < 0 ? '' : raw.slice(i + CATEGORY_MARKER.length).trim();
  return { pre: pre && !pre.startsWith('<') ? `      <p class="lib-cat-dek">${pre}</p>` : pre, post };
}

function renderCategories(root, patterns) {
  return CATEGORIES.filter((c) => patterns.some((p) => p.category === c.id)).map((c) => {
    const items = patterns.filter((p) => p.category === c.id);
    const { pre, post } = splitCategoryHtml(loadDek(root, c.id));
    return [
      `    <div class="lib-cat" id="lib-${c.id}">`,
      `      <div class="lib-cat-head"><h3>${escapeHtml(c.title)}</h3><span class="lib-cat-count">${items.length} patterns</span></div>`,
      pre || null,
      items.map((p) => renderPattern(p, p.demo, p.order)).join('\n\n'),
      post || null,
      '    </div>',
    ].filter((x) => x !== null).join('\n');
  }).join('\n\n');
}

// The category blocks only, for callers that supply their own intro and theme.
const renderLibrary = (root) => renderCategories(root, loadPatterns(root));

function buildPage(root) {
  const patterns = loadPatterns(root);
  const cats = CATEGORIES.filter((c) => patterns.some((p) => p.category === c.id));
  const counts = { VERSION: read(root, 'VERSION'), TOTAL: String(patterns.length), CATS: String(cats.length) };
  const nav = cats.map((c) => `      <a href="#lib-${c.id}">${escapeHtml(c.title)}</a>`).join('\n');
  const library = fill(read(root, 'page/library-intro.html'), counts) + '\n\n' + renderCategories(root, patterns);
  const html = fill(read(root, 'page/shell.html'), {
    ...counts,
    STYLES: read(root, 'themes/neutral.css') + '\n' + read(root, 'page/styles.css'),
    NAV: nav,
    LIBRARY: library,
    SCRIPT: read(root, 'page/demos.js'),
  });
  return html + '\n';
}
module.exports = { buildPage, renderLibrary, fill, splitCategoryHtml, CATEGORY_MARKER };
