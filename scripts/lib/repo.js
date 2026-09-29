'use strict';
const fs = require('fs');
const path = require('path');
const CATEGORIES = require('./categories');
const { parsePattern } = require('./pattern');
const lf = (s) => s.replace(/\r\n/g, '\n');

function loadPatterns(root) {
  const base = path.join(root, 'patterns');
  const known = new Set(CATEGORIES.map((c) => c.id));
  for (const e of fs.readdirSync(base, { withFileTypes: true })) {
    if (e.isDirectory() && !known.has(e.name)) throw new Error(`patterns/${e.name} is not a known category`);
  }
  const out = [];
  for (const cat of CATEGORIES) {
    const dir = path.join(base, cat.id);
    if (!fs.existsSync(dir)) continue;
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      if (!e.isDirectory()) continue;
      const rel = `patterns/${cat.id}/${e.name}`;
      const pf = path.join(dir, e.name, 'pattern.md');
      const df = path.join(dir, e.name, 'demo.html');
      if (!fs.existsSync(pf) || !fs.existsSync(df)) throw new Error(`${rel}: pattern.md and demo.html are required`);
      const p = parsePattern(fs.readFileSync(pf, 'utf8'), `${rel}/pattern.md`);
      if (p.id !== e.name) throw new Error(`${rel}: id "${p.id}" must equal the folder name`);
      if (p.category !== cat.id) throw new Error(`${rel}: category "${p.category}" must equal the parent folder`);
      out.push({ ...p, demo: lf(fs.readFileSync(df, 'utf8')).trim() });
    }
  }
  const idx = Object.fromEntries(CATEGORIES.map((c, i) => [c.id, i]));
  out.sort((a, b) => idx[a.category] - idx[b.category] || a.order - b.order);
  const orders = new Set();
  for (const p of out) {
    const k = `${p.category}:${p.order}`;
    if (orders.has(k)) throw new Error(`${p.category}: order ${p.order} is used twice`);
    orders.add(k);
  }
  return out;
}

function loadDek(root, catId) {
  const f = path.join(root, 'patterns', catId, '_category.html');
  return fs.existsSync(f) ? lf(fs.readFileSync(f, 'utf8')).trim() : '';
}
module.exports = { loadPatterns, loadDek };
