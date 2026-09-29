#!/usr/bin/env node
'use strict';
const fs = require('fs');
const path = require('path');
const { lfSha256Buffer } = require('./lib/lf');
const { buildPage } = require('./build-page');
const { buildSkill } = require('./build-skill');

function buildAll(root) {
  const files = { 'dist/design-standards.html': buildPage(root), ...buildSkill(root) };
  const skillFiles = Object.keys(files).filter((f) => f.startsWith('skills/design-standards/')).sort();
  const release = {
    version: fs.readFileSync(path.join(root, 'VERSION'), 'utf8').trim(),
    files: skillFiles.map((f) => ({ path: f, sha256: lfSha256Buffer(Buffer.from(files[f], 'utf8')) })),
  };
  files['release.json'] = JSON.stringify(release, null, 2) + '\n';
  return files;
}

function writeAll(root, files) {
  fs.rmSync(path.join(root, 'skills'), { recursive: true, force: true });
  for (const [rel, text] of Object.entries(files)) {
    const p = path.join(root, rel);
    fs.mkdirSync(path.dirname(p), { recursive: true });
    fs.writeFileSync(p, text, 'utf8');
  }
}

if (require.main === module) {
  const root = path.join(__dirname, '..');
  const files = buildAll(root);
  writeAll(root, files);
  const skill = Object.keys(files).filter((f) => f.startsWith('skills/')).length;
  console.log(`built dist/design-standards.html, ${skill} skill files and release.json`);
}
module.exports = { buildAll, writeAll };
