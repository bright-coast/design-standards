'use strict';
const test = require('node:test');
const assert = require('node:assert');
const { decodeEntities, htmlToMd, codeToText, fence, fenceLang, textOf } = require('../scripts/lib/html');

test('decodes named, decimal and hex entities and leaves unknown ones alone', () => {
  assert.strictEqual(decodeEntities('&lt;b&gt; &amp; &rsquo; &#65; &#x42; &zzz;'), '<b> & \u2019 A B &zzz;');
});
test('inline code keeps literal angle brackets (Review Focus 1)', () => {
  const md = htmlToMd('<p>Use <code class="tok">&lt;button&gt;</code> with <strong>aria-expanded</strong>.</p>');
  assert.strictEqual(md, 'Use `<button>` with **aria-expanded**.');
});
test('code containing a backtick uses a wider span', () => {
  assert.strictEqual(htmlToMd('<code>a`b</code>'), '``a`b``');
});
test('code strips highlight spans and decodes entities', () => {
  const html = '<pre><code><span class="kw">const</span> a = <span class="str">\'&lt;div&gt;\'</span>;</code></pre>';
  assert.strictEqual(codeToText(html), "const a = '<div>';");
});
test('two pre blocks in one panel are all kept', () => {
  assert.strictEqual(codeToText('<pre><code>one</code></pre>\n<pre><code>two</code></pre>'), 'one\n\ntwo');
});
test('fence is longer than any backtick run inside (Review Focus 1)', () => {
  assert.strictEqual(fence('x ``` y', 'js'), '````js\nx ``` y\n````');
  assert.strictEqual(fence('plain', ''), '```\nplain\n```');
});
test('fenceLang maps panel labels', () => {
  assert.strictEqual(fenceLang('CSS + JS'), 'css');
  assert.strictEqual(fenceLang('JSX'), 'jsx');
  assert.strictEqual(fenceLang('Node / Express'), 'js');
  assert.strictEqual(fenceLang('TEXT'), '');
});
test('textOf collapses tags and whitespace', () => {
  assert.strictEqual(textOf('<p>a  <b>b</b></p>\n<p>c</p>'), 'a b c');
});
test('decodeEntities converts entities including middot and times', () => {
  assert.strictEqual(decodeEntities('&middot; &times; &check; &hellip; &rsquo;'), '\u00B7 \u00D7 \u2713 \u2026 \u2019');
});
