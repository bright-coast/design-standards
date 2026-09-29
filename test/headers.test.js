'use strict';
const test = require('node:test');
const assert = require('node:assert');
const H = require('../scripts/lib/headers');

test('header is the credit line then the licence line', () => {
  assert.strictEqual(H.HEADER, H.CREDIT_LINE + '\n' + H.LICENCE_LINE);
  assert.strictEqual(H.CREDIT_LINE, '> A Bright Coast AI skill, made by Rob Lee. github.com/bright-coast/design-standards');
  assert.strictEqual(H.LICENCE_LINE, '> Copyright 2026 Bright Coast AI. For Bright Coast AI clients and people Bright Coast AI has given this link to. You may build what you find here into your own work; you may not republish or resell the material itself. See LICENSE at github.com/bright-coast/design-standards.');
});
test('the licence name and title are the Design Standards Licence 1.0', () => {
  assert.strictEqual(H.LICENCE_NAME, 'Bright Coast AI Design Standards Licence 1.0');
  assert.strictEqual(H.LICENCE_TITLE, 'Bright Coast AI Design Standards Licence, version 1.0 (29 September 2026)');
});
