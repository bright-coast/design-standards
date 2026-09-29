'use strict';
const test = require('node:test');
const assert = require('node:assert');
const { parsePattern, formatPattern, renderPattern } = require('../scripts/lib/pattern');

const SAMPLE = {
  id: 'accordion', title: 'Accordion & Disclosure', category: 'interaction', order: 1,
  rule: '<p>Use <code class="tok">0fr</code>.</p>',
  dos: ['Real <code class="tok">&lt;button&gt;</code>'], avoids: ['Different timing curves'],
  extras: [{ kind: 'caveat-box', html: '<div class="caveat-box"><b>Note.</b> Text.</div>' }],
  codes: [{ label: 'CSS + JS', html: '<pre><code>a { b: c; }</code></pre>' }],
};

test('format then parse returns the same pattern', () => {
  assert.deepStrictEqual(parsePattern(formatPattern(SAMPLE), 'x'), SAMPLE);
});
test('missing frontmatter key is a clear error', () => {
  assert.throws(() => parsePattern('---\nid: a\n---\n## Rule\n<p>x</p>\n', 'p.md'), /missing "title"/);
});
test('a content line starting with "## " fails at format time (Review Focus 5)', () => {
  assert.throws(() => formatPattern({ ...SAMPLE, rule: '<p>x</p>\n## Not a section' }), /would be read as a section/);
});
test('bad bullet line is rejected', () => {
  const t = formatPattern(SAMPLE).replace('- Real', 'Real');
  assert.throws(() => parsePattern(t, 'p.md'), /must start with "- "/);
});
test('render escapes the title, keeps the demo, and orders do before avoid', () => {
  const html = renderPattern(SAMPLE, '<div class="demo">D</div>', 3);
  assert.ok(html.includes('<h4>Accordion &amp; Disclosure</h4>'));
  assert.ok(html.includes('<span class="lib-pattern-num">03</span>'));
  assert.ok(html.indexOf('&check;') < html.indexOf('&times;'));
  assert.ok(html.includes('<div class="demo">D</div>'));
  assert.ok(html.includes('id="lp-accordion"'));
  assert.ok(html.includes('class="code-toggle"'));
});
test('a pattern with only avoid items renders no do items', () => {
  const html = renderPattern({ ...SAMPLE, dos: [] }, '<div class="demo"></div>', 1);
  assert.ok(!html.includes('&check;'));
  assert.ok(html.includes('&times;'));
});
test('the code-toggle renders the chevron character correctly', () => {
  const html = renderPattern(SAMPLE, '<div class="demo">D</div>', 1);
  const chevron = String.fromCharCode(0x25BE);
  const chevronSpan = `<span class="chev">${chevron}</span>`;
  assert.ok(html.includes(chevronSpan), `Expected chevron span to contain: ${JSON.stringify(chevronSpan)}`);
});
