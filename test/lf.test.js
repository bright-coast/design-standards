'use strict';
const test = require('node:test');
const assert = require('node:assert');
const { lfSha256Buffer } = require('../scripts/lib/lf');

test('CRLF and LF text give the same fingerprint', () => {
  assert.strictEqual(lfSha256Buffer(Buffer.from('a\r\nb\r\n')), lfSha256Buffer(Buffer.from('a\nb\n')));
});
test('fingerprint of "hello\n" is the known sha256', () => {
  assert.strictEqual(lfSha256Buffer(Buffer.from('hello\n')), '5891b5b522d5df086d0ff0b110fbd9d21bb4fc7163af34d08286a2e846f6be03');
});
test('multi-byte characters survive the latin1 round trip', () => {
  const a = lfSha256Buffer(Buffer.from('caf\u00E9 \u2713\r\n', 'utf8'));
  const b = lfSha256Buffer(Buffer.from('caf\u00E9 \u2713\n', 'utf8'));
  assert.strictEqual(a, b);
});
