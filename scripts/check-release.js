#!/usr/bin/env node
'use strict';
const fs = require('fs');
const path = require('path');
const { execSync, execFileSync } = require('child_process');
const { lfSha256, walk } = require('./lib/lf');
const { HEADER, CREDIT_LINE, LICENCE_LINE, LOCAL_MD_SENTENCE } = require('./lib/headers');
const CATEGORIES = require('./lib/categories');
const { loadPatterns } = require('./lib/repo');
const { isTealFamily, findColors } = require('./lib/color');
const { SKILL_PATH } = require('./lib/catalog');
const { buildAll } = require('./build');
const { MAX_REFERENCE_BYTES } = require('./build-skill');

const LICENCE_BODY = LICENCE_LINE.slice(2);
const TEXT_FILE = /\.(md|json|html|css|js|txt|yml|yaml)$/i;
// Files that legitimately contain names, header text or test strings, so content scans skip them.
const EXEMPT = new Set(['LICENSE', 'scripts/lib/headers.js', 'scripts/check-release.js', 'scripts/lib/color.js', 'package-lock.json']);
// The only files that may carry the @brightcoast.ai handle (the generated page is built from shell.html).
const HANDLE_FILES = new Set(['README.md', 'page/shell.html', 'dist/design-standards.html']);
const HANDLE_OK = 'brightcoast.ai';
const AT_RULES = new Set(['media', 'keyframes', 'font-face', 'container', 'supports', 'layer', 'property', 'import', 'charset', 'page', 'namespace', 'starting-style', 'scope', 'view-transition', 'counter-style', 'position-try', 'tailwind', 'apply', 'theme', 'utility', 'variant']);
// Built from char codes so this file stays ASCII.
const DASH_RE = new RegExp('[' + String.fromCharCode(0x2013) + String.fromCharCode(0x2014) + ']');
const REPLACEMENT_CHAR = String.fromCharCode(0xfffd);

const readLf = (p) => fs.readFileSync(p, 'utf8').replace(/\r\n/g, '\n');
const relTo = (root, p) => path.relative(root, p).replace(/\\/g, '/');

const textFiles = (root) => walk(root).map((p) => relTo(root, p)).filter((r) => TEXT_FILE.test(r) || r === 'VERSION' || r === 'LICENSE');
const scannable = (root) => textFiles(root).filter((r) => !EXEMPT.has(r) && !r.startsWith('test/'));
function eachLine(root, files, fn) {
  for (const r of files) readLf(path.join(root, r)).split('\n').forEach((line, i) => fn(r, i + 1, line));
}
// Zero-based line indexes of the README "## Licence" section (the guide's wording, copied verbatim).
function licenceBlock(lines) {
  const out = new Set();
  let inside = false;
  lines.forEach((l, i) => {
    if (/^## /.test(l)) inside = /^## Licence\s*$/.test(l);
    if (inside) out.add(i);
  });
  return out;
}

// 1. Parity and freshness: the committed generated files equal a fresh build, and every pattern is everywhere.
function checkFresh(root) {
  const fails = [];
  const patterns = loadPatterns(root);
  const expected = buildAll(root);
  for (const [f, text] of Object.entries(expected)) {
    const p = path.join(root, f);
    if (!fs.existsSync(p)) fails.push(`${f} is missing (run: node scripts/build.js)`);
    else if (readLf(p) !== text) fails.push(`${f} is stale: patterns or templates changed since the last build (run: node scripts/build.js)`);
  }
  const refDir = path.join(root, 'skills/design-standards/references');
  if (fs.existsSync(refDir)) for (const f of fs.readdirSync(refDir)) if (!expected[`skills/design-standards/references/${f}`]) fails.push(`references/${f} is not produced by the build`);
  const pagePath = path.join(root, 'dist/design-standards.html');
  const page = fs.existsSync(pagePath) ? readLf(pagePath) : '';
  const pageIds = new Set([...page.matchAll(/class="lib-pattern" id="lp-([a-z0-9-]+)"/g)].map((m) => m[1]));
  for (const p of patterns) if (!pageIds.has(p.id)) fails.push(`the page is missing pattern ${p.id}`);
  for (const id of pageIds) if (!patterns.some((p) => p.id === id)) fails.push(`the page has pattern ${id} that is not in patterns/`);
  for (const c of CATEGORIES) {
    const items = patterns.filter((p) => p.category === c.id);
    if (!items.length) continue;
    const refPath = path.join(refDir, `${c.id}.md`);
    if (!fs.existsSync(refPath)) { fails.push(`references/${c.id}.md is missing`); continue; }
    const titles = [...readLf(refPath).matchAll(/^## (.+)$/gm)].map((m) => m[1]);
    for (const p of items) if (!titles.includes(p.title)) fails.push(`references/${c.id}.md is missing "${p.title}"`);
    if (titles.length !== items.length) fails.push(`references/${c.id}.md has ${titles.length} patterns, patterns/ has ${items.length}`);
    const badge = new RegExp(`id="lib-${c.id}"[\\s\\S]*?lib-cat-count">(\\d+) patterns`).exec(page);
    if (!badge || Number(badge[1]) !== items.length) fails.push(`the page count for ${c.id} is ${badge && badge[1]}, expected ${items.length}`);
  }
  return fails;
}

// 2. Credits: no creator handles, no "Source:" lines, no post provenance wording.
const HANDLE = /(?<![A-Za-z0-9._@/-])@([A-Za-z0-9_][A-Za-z0-9_.-]*)/g;
function checkCredits(root) {
  const fails = [];
  for (const r of scannable(root).filter((f) => !/\.(css|js)$/.test(f))) {
    let t = readLf(path.join(root, r));
    if (r.endsWith('.html')) t = t.replace(/<style[\s\S]*?<\/style>/gi, '').replace(/<script[\s\S]*?<\/script>/gi, '');
    t.split('\n').forEach((line, i) => {
      for (const m of line.matchAll(HANDLE)) {
        const name = m[1].replace(/\.+$/, '');
        if (AT_RULES.has(name.split(/[^a-z-]/)[0])) continue;
        if (name === HANDLE_OK && HANDLE_FILES.has(r)) continue;
        if (line[m.index + m[0].length] === '/') continue;
        fails.push(`${r}:${i + 1} has a handle: @${name}`);
      }
      if (/\bSource( \(|:)/.test(line)) fails.push(`${r}:${i + 1} has a "Source:" credit line`);
      if (/\b\d{1,2} (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]* (batch|save)\b/.test(line)) fails.push(`${r}:${i + 1} has save or batch provenance wording`);
      if (/\bsecond reel\b/i.test(line)) fails.push(`${r}:${i + 1} names a reel`);
    });
  }
  return fails;
}

// 3. Scrub: listed names and colours, --bc- tokens, teal-family colours, real emails, personal paths.
// The README "## Licence" section is exempt from the name and email checks.
const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
function checkScrub(root, namesFile) {
  const fails = [];
  if (!namesFile) fails.push('no --names-file given: the private scrub list is required for a release');
  const terms = namesFile ? fs.readFileSync(namesFile, 'utf8').split(/\r?\n/).map((s) => s.trim()).filter((s) => s && !s.startsWith('//')) : [];
  const res = terms.map((t) => [t, new RegExp('(?<![A-Za-z0-9_])' + escapeRe(t) + '(?![A-Za-z0-9_])', 'i')]);
  const EMAIL = /[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)+/g;
  for (const r of scannable(root)) {
    const lines = readLf(path.join(root, r)).split('\n');
    const skip = r === 'README.md' ? licenceBlock(lines) : new Set();
    lines.forEach((raw, idx) => {
      const n = idx + 1;
      const line = raw.split(CREDIT_LINE).join('').split(LICENCE_LINE).join('').split(LICENCE_BODY).join('');
      if (!skip.has(idx)) {
        for (const [t, re] of res) if (re.test(line)) fails.push(`${r}:${n} contains a listed name: ${t}`);
        for (const m of line.matchAll(EMAIL)) {
          const e = m[0].toLowerCase();
          const ok = e.endsWith('@example.com') || (e.endsWith('@' + HANDLE_OK) && HANDLE_FILES.has(r));
          if (!ok) fails.push(`${r}:${n} has an email address: ${m[0]}`);
        }
      }
      if (/--bc-/.test(line)) fails.push(`${r}:${n} uses a --bc- token`);
      for (const c of findColors(line)) if (isTealFamily(c.hex)) fails.push(`${r}:${n} has a teal-family colour ${c.text}`);
      if (/C:\\Users\\|\/Users\/[a-z]|\/home\/[a-z]/i.test(line)) fails.push(`${r}:${n} has a personal path`);
    });
  }
  return fails;
}

// 4. Text rules.
const SECRETS = [/github_pat_[A-Za-z0-9_]{20,}/, /\bghp_[A-Za-z0-9]{20,}/, /\bsk-[A-Za-z0-9]{20,}/, /\bAKIA[0-9A-Z]{16}\b/, /xox[bpa]-[A-Za-z0-9-]{10,}/, /-----BEGIN [A-Z ]*PRIVATE KEY-----/];
const PHONE = /(?<![\d.])(?:\+?61|0)[\s-]?4\d{2}[\s-]?\d{3}[\s-]?\d{3}(?![\d.])/;
function checkText(root) {
  const fails = [];
  const files = textFiles(root).filter((r) => !r.startsWith('test/') && r !== 'package-lock.json' && r !== 'release.json' && r !== 'scripts/check-release.js');
  eachLine(root, files, (r, n, raw) => {
    const line = raw.split(LICENCE_LINE).join('').split(LICENCE_BODY).join('').split(CREDIT_LINE).join('');
    if (DASH_RE.test(line)) fails.push(`${r}:${n} has an em or en dash`);
    if (/Bright[Cc]oast\b(?!\.ai)/.test(line) || /Bright Coast(?! AI)/.test(line)) fails.push(`${r}:${n} does not write the company as "Bright Coast AI"`);
    for (const re of SECRETS) if (re.test(line)) fails.push(`${r}:${n} looks like a secret`);
    if (PHONE.test(line)) fails.push(`${r}:${n} looks like a phone number`);
  });
  return fails;
}

// 5. Theme tokens: every --ds-* token used is defined, and light, system dark and forced dark define the same colours.
function checkTheme(root) {
  const fails = [];
  const theme = readLf(path.join(root, 'themes/neutral.css'));
  const light = (theme.match(/:root\s*\{([^}]*)\}/) || [])[1] || '';
  const media = (theme.match(/prefers-color-scheme: dark\)\s*\{\s*:root:not\(\[data-theme="light"\]\)\s*\{([^}]*)\}/) || [])[1] || '';
  const forced = (theme.match(/:root\[data-theme="dark"\]\s*\{([^}]*)\}/) || [])[1] || '';
  const names = (b) => new Set([...b.matchAll(/(--ds-[a-z0-9-]+)\s*:/g)].map((m) => m[1]));
  const defined = names(light);
  const colours = new Set([...defined].filter((n) => !n.startsWith('--ds-font-')));
  for (const [label, block] of [['system dark', media], ['forced dark', forced]]) {
    const got = names(block);
    for (const c of colours) if (!got.has(c)) fails.push(`themes/neutral.css: ${label} block does not define ${c}`);
    for (const g of got) if (!colours.has(g)) fails.push(`themes/neutral.css: ${label} block defines ${g}, which the light block does not`);
  }
  const usedIn = ['page/styles.css', 'page/demos.js', 'page/shell.html', 'page/library-intro.html', ...walk(path.join(root, 'patterns')).map((p) => relTo(root, p))];
  for (const r of usedIn) {
    if (!fs.existsSync(path.join(root, r))) continue;
    for (const m of readLf(path.join(root, r)).matchAll(/--ds-[a-z0-9-]+/g)) if (!defined.has(m[0])) fails.push(`${r} uses ${m[0]}, which themes/neutral.css does not define`);
  }
  return [...new Set(fails)];
}

// 7. Versioning.
function checkVersion(root) {
  const fails = [];
  const version = readLf(path.join(root, 'VERSION')).trim();
  const pkg = JSON.parse(readLf(path.join(root, 'package.json')));
  if (pkg.version !== version) fails.push(`package.json version ${pkg.version} differs from VERSION ${version}`);
  const release = JSON.parse(readLf(path.join(root, 'release.json')));
  if (release.version !== version) fails.push(`release.json version ${release.version} differs from VERSION ${version}`);
  for (const f of release.files) {
    const p = path.join(root, f.path);
    if (!fs.existsSync(p)) fails.push(`release.json lists ${f.path}, which does not exist`);
    else if (lfSha256(p) !== f.sha256) fails.push(`${f.path}: the fingerprint in release.json is stale`);
  }
  const fm = readLf(path.join(root, 'skills/design-standards/SKILL.md')).match(/^---\nname: ([^\n]+)\ndescription: ([^\n]+)\nversion: ([^\n]+)\n---\n/);
  if (!fm || fm[3].trim() !== version) fails.push('SKILL.md frontmatter version differs from VERSION');
  if (!new RegExp(`^## ${version.replace(/\./g, '\\.')} \\(`, 'm').test(readLf(path.join(root, 'CHANGELOG.md')))) fails.push(`CHANGELOG.md has no entry headed "## ${version} ("`);
  try {
    const tag = execSync('git describe --tags --abbrev=0', { cwd: root, stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim();
    const changed = execFileSync('git', ['diff', '--name-only', tag, '--', 'patterns'], { cwd: root }).toString().trim() + execSync('git ls-files --others --exclude-standard patterns', { cwd: root }).toString().trim();
    if (changed && tag.replace(/^v/, '') === version) fails.push(`patterns changed since ${tag} but VERSION is still ${version}: bump VERSION, package.json and CHANGELOG.md`);
  } catch (e) { /* no tag yet, or not a git repo */ }
  return fails;
}

// 8. Catalog: the root catalog.json agrees with the built skill and with release.json.
const CATALOG_FIXED = {
  catalog_version: 1,
  repo: 'bright-coast/design-standards',
  ref: 'stable',
  raw_base: 'https://raw.githubusercontent.com/bright-coast/design-standards/stable/',
  license: 'Bright Coast AI Client Skills Licence 1.0',
};
function checkCatalog(root) {
  const fails = [];
  const cp = path.join(root, 'catalog.json');
  if (!fs.existsSync(cp)) return ['catalog.json is missing (run: node scripts/build.js)'];
  let cat;
  try { cat = JSON.parse(readLf(cp)); } catch (e) { return [`catalog.json is not valid JSON: ${e.message}`]; }
  for (const [k, v] of Object.entries(CATALOG_FIXED)) if (cat[k] !== v) fails.push(`catalog.json ${k} is ${JSON.stringify(cat[k])}, expected ${JSON.stringify(v)}`);
  if (!Array.isArray(cat.skills) || cat.skills.length !== 1 || !cat.skills[0] || cat.skills[0].id !== 'design-standards') {
    fails.push('catalog.json must have exactly one skill entry, with id design-standards');
    return fails;
  }
  const s = cat.skills[0];
  const version = readLf(path.join(root, 'VERSION')).trim();
  if (s.version !== version) fails.push(`catalog.json skill version ${s.version} differs from VERSION ${version}`);
  if (s.path !== SKILL_PATH) fails.push(`catalog.json skill path ${s.path} is not ${SKILL_PATH}`);
  const sp = path.join(root, String(s.path));
  if (!fs.existsSync(sp)) fails.push(`catalog.json skill path ${s.path} does not exist`);
  else if (lfSha256(sp) !== s.sha256) fails.push(`catalog.json skill sha256 is stale for ${s.path}`);
  const listed = Array.isArray(s.files) ? s.files : [];
  for (const f of listed) {
    const p = path.join(root, String(f.path));
    if (!fs.existsSync(p)) fails.push(`catalog.json lists ${f.path}, which does not exist`);
    else if (lfSha256(p) !== f.sha256) fails.push(`catalog.json ${f.path}: sha256 is stale`);
  }
  const paths = listed.map((f) => f.path);
  if (paths.some((p, i) => i > 0 && !(paths[i - 1] < p))) fails.push('catalog.json files[] must be sorted by path');
  const refDir = path.join(root, 'skills/design-standards/references');
  if (fs.existsSync(refDir)) for (const f of fs.readdirSync(refDir)) {
    const rel = `skills/design-standards/references/${f}`;
    if (!paths.includes(rel)) fails.push(`${rel} exists but is not listed in catalog.json`);
  }
  const rp = path.join(root, 'release.json');
  if (!fs.existsSync(rp)) fails.push('release.json is missing, so the catalog cannot be compared with it');
  else {
    const fromRelease = JSON.parse(readLf(rp)).files.map((f) => `${f.path} ${f.sha256}`).sort();
    const fromCatalog = [s, ...listed].map((f) => `${f.path} ${f.sha256}`).sort();
    if (JSON.stringify(fromRelease) !== JSON.stringify(fromCatalog)) fails.push('catalog.json fingerprints differ from release.json');
  }
  return fails;
}

// 9. Licence.
function checkLicence(root, licenceFile) {
  const fails = [];
  if (!licenceFile) fails.push('no --licence-file given: the canonical licence copy is required for a release');
  else if (lfSha256(path.join(root, 'LICENSE')) !== lfSha256(licenceFile)) fails.push('LICENSE differs from the canonical Client Skills Licence copy');
  if (!/^## Licence$/m.test(readLf(path.join(root, 'README.md')))) fails.push('README.md has no "## Licence" section');
  if (!readLf(path.join(root, 'skills/design-standards/SKILL.md')).includes(HEADER)) fails.push('SKILL.md does not carry the two standard header lines together');
  const refDir = path.join(root, 'skills/design-standards/references');
  if (fs.existsSync(refDir)) for (const f of fs.readdirSync(refDir)) if (!readLf(path.join(refDir, f)).startsWith(HEADER + '\n')) fails.push(`references/${f} does not start with the two standard header lines`);
  if (!readLf(path.join(root, 'dist/design-standards.html')).includes(LICENCE_BODY)) fails.push('the page footer is missing the licence line');
  return fails;
}

// 10. Skill shape (the guide's format, so it can be vendored unchanged).
function checkSkillShape(root) {
  const fails = [];
  const f = 'skills/design-standards/SKILL.md';
  const t = readLf(path.join(root, f));
  const fm = t.match(/^---\nname: ([^\n]+)\ndescription: ([^\n]+)\nversion: ([^\n]+)\n---\n/);
  if (!fm) fails.push(`${f}: frontmatter must be name, description, version between --- lines`);
  else {
    if (fm[1] !== 'design-standards') fails.push(`${f}: name must be design-standards`);
    if (!/^Use when/.test(fm[2])) fails.push(`${f}: description must start with "Use when"`);
  }
  for (const h of ['## Before you do anything', '## What this does', '## Your changes']) if (!t.includes(`\n${h}\n`)) fails.push(`${f}: missing "${h}"`);
  if (!t.includes(LOCAL_MD_SENTENCE)) fails.push(`${f}: missing the standard local.md sentence`);
  if (!t.includes('`skill-updates`')) fails.push(`${f}: missing the quiet skill-updates check`);
  if (t.split('\n').length > 150) fails.push(`${f}: over 150 lines`);
  const refDir = path.join(root, 'skills/design-standards/references');
  if (fs.existsSync(refDir)) for (const r of fs.readdirSync(refDir)) {
    if (!/^[a-z0-9][a-z0-9-]*\.md$/.test(r)) fails.push(`references/${r}: name must match ^[a-z0-9][a-z0-9-]*\\.md$`);
    if (fs.statSync(path.join(refDir, r)).size > MAX_REFERENCE_BYTES) fails.push(`references/${r}: over ${MAX_REFERENCE_BYTES} bytes`);
  }
  return fails;
}

// 11. Source ASCII: every text file in the repo (walk() skips .git, node_modules and .superpowers).
// Tooling and doc files must be pure ASCII. patterns/, dist/ and skills/ may carry the non-ASCII characters
// demos legitimately use (arrows, check marks), so there only these fail: U+FFFD, a bare hex run where a
// chevron entity was meant, and em or en dashes.
const LOOSE_DIRS = ['patterns/', 'dist/', 'skills/'];
const BARE_CHEV = /class="chev">[0-9A-Fa-f]{4}(?![0-9A-Za-z])/;
function checkSourceAscii(root) {
  const fails = [];
  for (const r of textFiles(root)) {
    const loose = LOOSE_DIRS.some((d) => r.startsWith(d));
    readLf(path.join(root, r)).split('\n').forEach((line, i) => {
      const where = `${r}:${i + 1}`;
      if (line.includes(REPLACEMENT_CHAR)) { fails.push(`${where} has a replacement character (U+FFFD): the file was corrupted`); return; }
      if (loose) {
        if (BARE_CHEV.test(line)) fails.push(`${where} has a bare hex run after class="chev">: the entity lost its &#x prefix`);
        if (DASH_RE.test(line)) fails.push(`${where} has an em or en dash`);
        return;
      }
      for (const ch of line) {
        if (ch.charCodeAt(0) > 127) { fails.push(`${where} has a non-ASCII character (U+${ch.codePointAt(0).toString(16).toUpperCase().padStart(4, '0')}); use an escape or entity`); break; }
      }
    });
  }
  return fails;
}

function runChecks(root, opts = {}) {
  const list = [
    ['1. Parity and freshness', () => checkFresh(root)],
    ['2. Credits', () => checkCredits(root)],
    ['3. Scrub', () => checkScrub(root, opts.namesFile)],
    ['4. Text rules', () => checkText(root)],
    ['5. Theme tokens', () => checkTheme(root)],
    ['7. Versioning', () => checkVersion(root)],
    ['8. Catalog', () => checkCatalog(root)],
    ['9. Licence', () => checkLicence(root, opts.licenceFile)],
    ['10. Skill shape', () => checkSkillShape(root)],
    ['11. Source ASCII', () => checkSourceAscii(root)],
  ];
  return list.map(([name, fn]) => {
    let failures;
    try { failures = fn(); } catch (e) { failures = [`the check crashed: ${e.message}`]; }
    return { name, failures };
  });
}

if (require.main === module) {
  const args = process.argv.slice(2);
  const opt = (flag) => { const i = args.indexOf(flag); return i >= 0 ? args[i + 1] : undefined; };
  const results = runChecks(path.join(__dirname, '..'), { namesFile: opt('--names-file'), licenceFile: opt('--licence-file') });
  let total = 0;
  results.forEach((r, i) => {
    console.log(r.name);
    if (!r.failures.length) console.log('  ok');
    r.failures.slice(0, 40).forEach((m) => console.log('  FAIL ' + m));
    if (r.failures.length > 40) console.log(`  ... and ${r.failures.length - 40} more`);
    total += r.failures.length;
    if (i === 4) console.log('6. Page renders\n  run separately: node scripts/check-render.js');
  });
  console.log(total ? `\n${total} problem(s). Not ready to release.` : '\nAll checks passed.');
  process.exit(total ? 1 : 0);
}
module.exports = { runChecks };
