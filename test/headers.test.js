'use strict';
const test = require('node:test');
const assert = require('node:assert');
const H = require('../scripts/lib/headers');

test('header is the credit line then the licence line', () => {
  assert.strictEqual(H.HEADER, H.CREDIT_LINE + '\n' + H.LICENCE_LINE);
  assert.ok(H.CREDIT_LINE.startsWith('> A Bright Coast AI skill, made by'));
  assert.ok(H.LICENCE_LINE.endsWith('claude-power-setup-guide.'));
});
