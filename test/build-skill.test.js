'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const { makeFixture } = require('./helpers');
const { buildSkill, MAX_REFERENCE_BYTES } = require('../scripts/build-skill');
const H = require('../scripts/lib/headers');

test('SKILL.md follows the guide format', () => {
  const root = makeFixture();
  const version = fs.readFileSync(path.join(root, 'VERSION'), 'utf8').trim();
  const t = buildSkill(root)['skills/design-standards/SKILL.md'];
  assert.ok(t.startsWith(`---\nname: design-standards\ndescription: Use when `));
  assert.match(t, new RegExp('\\nversion: ' + version.replace(/\./g, '\\.') + '\\n---\\n'));
  assert.ok(t.includes(H.HEADER));
  assert.ok(t.includes(H.LOCAL_MD_SENTENCE));
  for (const h of ['## Before you do anything', '## What this does', '## Your changes']) assert.ok(t.includes('\n' + h + '\n'), h);
  assert.ok(t.includes('`skill-updates`'));
  assert.ok(!/\{\{[A-Z_]+\}\}/.test(t));
  assert.ok(t.split('\n').length <= 150);
  assert.ok(t.includes('| Interaction | 1 | `references/interaction.md` |'));
  assert.ok(t.includes('| Forms | 1 | `references/forms.md` |'));
});
test('a reference starts with the header and lists every pattern as markdown', () => {
  const t = buildSkill(makeFixture())['skills/design-standards/references/interaction.md'];
  assert.ok(t.startsWith(H.HEADER + '\n\n# Interaction\n'));
  assert.ok(t.includes('How people click and drag.'));
  assert.ok(t.includes('## Accordion Disclosure'));
  assert.ok(t.includes('Do:\n- Real `<button>`'));
  assert.ok(t.includes('Avoid:\n- Different timing curves'));
  assert.ok(t.includes('Note: **Note.** Text.'));
  assert.ok(t.includes('```css\na { b: c; }\n```'));
  assert.ok(!/<p>|<div|<pre/.test(t));
});
test('code entities are decoded inside the fence (Review Focus 1)', () => {
  const t = buildSkill(makeFixture())['skills/design-standards/references/forms.md'];
  assert.ok(t.includes('```js\nx = <1;\n```'));
});
test('a reference over the size limit fails the build (Review Focus 5)', () => {
  const root = makeFixture();
  const f = path.join(root, 'patterns/forms/inline-validation/pattern.md');
  const big = '<pre><code>' + 'x'.repeat(MAX_REFERENCE_BYTES) + '</code></pre>';
  fs.writeFileSync(f, fs.readFileSync(f, 'utf8').replace('<pre><code>x = &lt;1;</code></pre>', big));
  assert.throws(() => buildSkill(root), /over the \d+ byte limit/);
});
test('output is deterministic and LF only', () => {
  const root = makeFixture();
  const a = buildSkill(root);
  assert.deepStrictEqual(a, buildSkill(root));
  for (const t of Object.values(a)) assert.ok(!t.includes('\r'));
});
