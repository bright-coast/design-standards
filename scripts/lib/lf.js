'use strict';
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// sha256 of text as the repo stores it (LF endings). Same method as the Power Setup Guide's build-catalog.js.
// The latin1 round trip is lossless for every byte, so only CRLF pairs change.
function lfSha256Buffer(buf) {
  const lf = Buffer.from(buf.toString('latin1').replace(/\r\n/g, '\n'), 'latin1');
  return crypto.createHash('sha256').update(lf).digest('hex');
}
const lfSha256 = (file) => lfSha256Buffer(fs.readFileSync(file));

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name === '.git' || e.name === 'node_modules' || e.name === '.superpowers') continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out); else out.push(p);
  }
  return out;
}
module.exports = { lfSha256, lfSha256Buffer, walk };
