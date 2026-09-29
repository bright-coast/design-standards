'use strict';
const test = require('node:test');
const assert = require('node:assert');
const { hexToHsl, hslToHex, isTealFamily } = require('../scripts/lib/color');

test('round trip keeps a colour within one step', () => {
  const [h, s, l] = hexToHsl('#008080');
  const back = hslToHex(h, s, l);
  assert.strictEqual(back.length, 7);
  assert.ok(Math.abs(parseInt(back.slice(1, 3), 16) - 0x00) <= 1);
});
test('teal family is detected, other colours are not', () => {
  assert.ok(isTealFamily('#008080'));
  assert.ok(isTealFamily('#004D40'));
  assert.ok(isTealFamily('#E0F2F1'));
  assert.ok(!isTealFamily('#3B5BDB'));
  assert.ok(!isTealFamily('#C0392B'));
  assert.ok(!isTealFamily('#808080'));
  assert.ok(!isTealFamily('#fff'));
});
test('numeric character references are not read as colours', () => {
  const { findColors } = require('../scripts/lib/color');
  assert.deepStrictEqual(findColors('<span>&#128465;</span> &#9662;'), []);
  assert.strictEqual(findColors('color:#008080; x &#128465;').length, 1);
});
