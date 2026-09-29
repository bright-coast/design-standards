'use strict';
const fs = require('fs');
const os = require('os');
const path = require('path');
const { formatPattern } = require('../scripts/lib/pattern');
const REAL = path.join(__dirname, '..');

const PATTERNS = [
  { id: 'accordion', title: 'Accordion Disclosure', category: 'interaction', order: 1, rule: '<p>Use <code class="tok">0fr</code>.</p>', dos: ['Real <code class="tok">&lt;button&gt;</code>'], avoids: ['Different timing curves'], extras: [{ kind: 'caveat-box', html: '<div class="caveat-box"><b>Note.</b> Text.</div>' }], codes: [{ label: 'CSS', html: '<pre><code>a { b: c; }</code></pre>' }] },
  { id: 'inline-validation', title: 'Inline Validation', category: 'forms', order: 1, rule: '<p>Validate on blur.</p>', dos: ['Show the fix'], avoids: [], extras: [], codes: [{ label: 'JS', html: '<pre><code>x = &lt;1;</code></pre>' }] },
];

// A small temporary repo with two sample patterns and stand-in styles and script.
function makeFixture(extraStyles = 'body { color: var(--ds-ink); }', script = 'console.log(1);') {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'ds-fixture-'));
  const put = (rel, text) => { const p = path.join(root, rel); fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, text); };
  const copy = (rel) => { if (fs.existsSync(path.join(REAL, rel))) put(rel, fs.readFileSync(path.join(REAL, rel), 'utf8')); };
  ['VERSION', 'LICENSE', 'themes/neutral.css', 'page/shell.html', 'page/library-intro.html', 'skill-src/SKILL.md.tpl'].forEach(copy);
  put('page/styles.css', extraStyles + '\n');
  put('page/demos.js', script + '\n');
  for (const p of PATTERNS) {
    put(`patterns/${p.category}/${p.id}/pattern.md`, formatPattern(p));
    put(`patterns/${p.category}/${p.id}/demo.html`, '<div class="demo"><div class="demo-stage">demo</div></div>\n');
  }
  put('patterns/interaction/_category.html', 'How people click and drag.\n');
  return root;
}
module.exports = { makeFixture, PATTERNS };
