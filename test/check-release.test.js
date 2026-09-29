'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const { makeFullFixture, writeNames } = require('./helpers');
const { runChecks } = require('../scripts/check-release');
const { buildAll, writeAll } = require('../scripts/build');

const EM = String.fromCharCode(0x2014);
const E_ACUTE = String.fromCharCode(0xe9);
const REPLACEMENT = String.fromCharCode(0xfffd);

const failuresOf = (root, opts = {}) => Object.fromEntries(runChecks(root, { namesFile: writeNames(['Acme', '#004D40']), licenceFile: path.join(root, 'LICENSE'), ...opts }).map((r) => [r.name.replace(/^\d+\. /, ''), r.failures]));
// Change a file, then rebuild so only the check under test reacts.
function mutate(root, rel, fn, rebuild = true) {
  const p = path.join(root, rel);
  fs.writeFileSync(p, fn(fs.readFileSync(p, 'utf8')));
  if (rebuild) writeAll(root, buildAll(root));
}
const readJson = (root, rel) => JSON.parse(fs.readFileSync(path.join(root, rel), 'utf8'));
const editJson = (root, rel, fn) => {
  const j = readJson(root, rel);
  fn(j);
  fs.writeFileSync(path.join(root, rel), JSON.stringify(j, null, 2) + '\n');
};
const version = (root) => fs.readFileSync(path.join(root, 'VERSION'), 'utf8').trim();
const PAT = 'patterns/interaction/accordion/pattern.md';
const DEMO = 'patterns/interaction/accordion/demo.html';
const RULE = '<p>Use <code class="tok">0fr</code>.</p>';

test('a good repo passes every check', () => {
  const f = failuresOf(makeFullFixture());
  for (const [name, list] of Object.entries(f)) assert.deepStrictEqual(list, [], name);
});
test('the summary numbers every check and leaves 6 to the render check', () => {
  const names = runChecks(makeFullFixture(), { namesFile: writeNames(['Acme']), licenceFile: null }).map((r) => r.name);
  assert.deepStrictEqual(names.map((n) => n.replace(/ .*/, '')), ['1.', '2.', '3.', '4.', '5.', '7.', '8.', '9.', '10.', '11.']);
  assert.ok(/^8\. Catalog/.test(names[6]) && /^7\. Versioning/.test(names[5]));
});
test('a stale build is caught', () => {
  const root = makeFullFixture();
  mutate(root, PAT, (t) => t.replace('Real', 'Genuine'), false);
  assert.ok(failuresOf(root)['Parity and freshness'].some((m) => /stale/.test(m)));
});
test('a creator handle, a Source line and save wording are caught; @media is allowed', () => {
  const root = makeFullFixture();
  mutate(root, PAT, (t) => t.replace(RULE, '<p>By @somecreator. Source: a reel. From the 20 Sep save.</p>'));
  const c = failuresOf(root).Credits;
  assert.ok(c.some((m) => /@somecreator/.test(m)) && c.some((m) => /Source:/.test(m)) && c.some((m) => /save or batch/.test(m)));
  const ok = makeFullFixture();
  mutate(ok, PAT, (t) => t.replace(RULE, '<p>Use <code>@media (min-width: 1px)</code>.</p>'));
  assert.deepStrictEqual(failuresOf(ok).Credits, []);
});
test('the @brightcoast.ai handle is allowed only in README.md and page/shell.html', () => {
  const root = makeFullFixture();
  assert.ok(fs.readFileSync(path.join(root, 'README.md'), 'utf8').includes('@brightcoast.ai'));
  assert.deepStrictEqual(failuresOf(root).Credits, []);
  mutate(root, PAT, (t) => t.replace(RULE, '<p>Write to @brightcoast.ai.</p>'));
  assert.ok(failuresOf(root).Credits.some((m) => /patterns\/interaction\/accordion\/pattern\.md.*@brightcoast\.ai/.test(m)));
  const other = makeFullFixture();
  mutate(other, 'README.md', (t) => t + '\nAlso @somecreator.\n', false);
  assert.ok(failuresOf(other).Credits.some((m) => /README\.md.*@somecreator/.test(m)));
  const shell = makeFullFixture();
  mutate(shell, 'page/shell.html', (t) => t + '\n<!-- @someone -->\n');
  assert.ok(failuresOf(shell).Credits.some((m) => /page\/shell\.html.*@someone/.test(m)));
});
test('brand colours are caught even inside a style attribute (Review Focus 3)', () => {
  const root = makeFullFixture();
  mutate(root, DEMO, (t) => t.replace('demo</div>', '<span style="color:#008080;background:#004d40">x</span></div>'));
  const s = failuresOf(root).Scrub;
  assert.ok(s.some((m) => /teal-family colour #008080/.test(m)), 'teal family');
  assert.ok(s.some((m) => /listed name: #004D40/.test(m)), 'listed exact colour, any case');
});
test('a light teal sample is flagged', () => {
  const root = makeFullFixture();
  mutate(root, DEMO, (t) => t.replace('demo</div>', '<span style="background:#E0F2F1">x</span></div>'));
  assert.ok(failuresOf(root).Scrub.some((m) => /teal-family colour #E0F2F1/.test(m)));
});
test('a non-teal colour is not flagged', () => {
  const root = makeFullFixture();
  mutate(root, DEMO, (t) => t.replace('demo</div>', '<span style="color:#123456;background:rgb(200,30,30);border-color:hsl(10,80%,40%)">x</span></div>'));
  assert.deepStrictEqual(failuresOf(root).Scrub, []);
});
// Each way a teal-family colour can be written, wherever it sits in a demo.
const COLOUR_FORMS = [
  ['a 6 digit hex in style', '<span style="color:#008080">x</span>', '#008080'],
  ['an 8 digit hex in a JS string', '<script>el.style.color = "#008080FF";</script>', '#008080FF'],
  ['a 4 digit hex', '<span style="color:#0888">x</span>', '#0888'],
  ['a 3 digit hex', '<span style="color:#088">x</span>', '#088'],
  ['rgb()', '<span style="color:rgb(0,128,128)">x</span>', 'rgb(0,128,128)'],
  ['rgba() with spaces', '<span style="color:rgba(0 128 128 / 50%)">x</span>', 'rgba(0 128 128 / 50%)'],
  ['hsl()', '<span style="color:hsl(180,100%,25%)">x</span>', 'hsl(180,100%,25%)'],
  ['hsla()', '<span style="color:hsla(180, 100%, 25%, 0.5)">x</span>', 'hsla(180, 100%, 25%, 0.5)'],
  ['the word teal', '<span style="color: teal">x</span>', 'teal'],
  ['the word turquoise', '<span style="color:turquoise">x</span>', 'turquoise'],
  ['the word darkcyan', '<span style="color:DarkCyan">x</span>', 'DarkCyan'],
];
for (const [label, snippet, shown] of COLOUR_FORMS) {
  test(`scrub catches ${label}`, () => {
    const root = makeFullFixture();
    mutate(root, DEMO, (t) => t.replace('demo</div>', snippet + '</div>'));
    assert.ok(failuresOf(root).Scrub.some((m) => m.endsWith(`has a teal-family colour ${shown}`)), failuresOf(root).Scrub.join('|'));
  });
}
test('a class name that merely contains a colour word is not flagged', () => {
  const root = makeFullFixture();
  mutate(root, DEMO, (t) => t.replace('demo</div>', '<span class="teal-card aqua_x">x</span></div>'));
  assert.deepStrictEqual(failuresOf(root).Scrub, []);
});
test('a --bc- token and a listed name are caught', () => {
  const root = makeFullFixture();
  mutate(root, DEMO, (t) => t.replace('demo</div>', 'var(--bc-ink) Acme</div>'));
  const s = failuresOf(root).Scrub;
  assert.ok(s.some((m) => /--bc- token/.test(m)) && s.some((m) => /listed name: Acme/.test(m)));
});
test('a real-looking email is caught, example.com is not, and a trailing dot is not swallowed', () => {
  const root = makeFullFixture();
  mutate(root, PAT, (t) => t.replace('Different timing curves', 'Mail jo@client.com.au. Or you@example.com'));
  const s = failuresOf(root).Scrub;
  assert.ok(s.some((m) => m.endsWith('an email address: jo@client.com.au')), s.join('|'));
  assert.ok(!s.some((m) => /you@example\.com/.test(m)));
});
test('the README licence section is exempt from the name and email checks, the rest is not', () => {
  const root = makeFullFixture();
  mutate(root, 'README.md', (t) => t + '\nAcme wrote to jo@client.com.au.\n\n## Other\n\nPlain.\n', false);
  assert.deepStrictEqual(failuresOf(root).Scrub, []);
  mutate(root, 'README.md', (t) => t.replace('# Design Standards', '# Design Standards\n\nAcme and jo@client.com.au.'), false);
  const s = failuresOf(root).Scrub;
  assert.ok(s.some((m) => /README\.md.*listed name: Acme/.test(m)) && s.some((m) => /README\.md.*jo@client\.com\.au/.test(m)));
});
test('an em dash is caught', () => {
  const root = makeFullFixture();
  mutate(root, PAT, (t) => t.replace('Different timing curves', 'Different ' + EM + ' timing curves'));
  assert.ok(failuresOf(root)['Text rules'].some((m) => /em or en dash/.test(m)));
});
test('an undefined theme token is caught', () => {
  const root = makeFullFixture();
  mutate(root, DEMO, (t) => t.replace('demo</div>', '<i style="color:var(--ds-nope)">x</i></div>'));
  assert.ok(failuresOf(root)['Theme tokens'].some((m) => /--ds-nope/.test(m)));
});
test('a changed LICENSE is caught', () => {
  const root = makeFullFixture();
  const canonical = path.join(root, '..', 'canonical-licence.txt');
  fs.copyFileSync(path.join(root, 'LICENSE'), canonical);
  mutate(root, 'LICENSE', (t) => t + 'extra line\n', false);
  assert.ok(failuresOf(root, { licenceFile: canonical }).Licence.some((m) => /differs from the canonical/.test(m)));
});
test('a missing changelog entry is caught', () => {
  const root = makeFullFixture();
  const v = version(root);
  mutate(root, 'CHANGELOG.md', (t) => t.replace(`## ${v} (`, '## 0.0.1 ('), false);
  assert.ok(failuresOf(root).Versioning.some((m) => m.includes(`no entry headed "## ${v} ("`)));
});
test('a skill missing the local.md sentence is caught', () => {
  const root = makeFullFixture();
  mutate(root, 'skills/design-standards/SKILL.md', (t) => t.replace('If a file called `local.md` sits next to this file', 'Read local.md'), false);
  assert.ok(failuresOf(root)['Skill shape'].some((m) => /local\.md sentence/.test(m)));
});

// Catalog check (root catalog.json against the built skill).
const catalogFails = (root) => failuresOf(root).Catalog;
test('a catalog that is not JSON is caught', () => {
  const root = makeFullFixture();
  fs.writeFileSync(path.join(root, 'catalog.json'), '{ nope');
  assert.ok(catalogFails(root).some((m) => /not valid JSON/.test(m)));
});
test('a missing catalog is caught', () => {
  const root = makeFullFixture();
  fs.rmSync(path.join(root, 'catalog.json'));
  assert.ok(catalogFails(root).some((m) => /catalog\.json is missing/.test(m)));
});
test('a wrong catalog_version, repo, ref, raw_base or licence is caught', () => {
  for (const [key, bad] of [['catalog_version', 2], ['repo', 'someone/else'], ['ref', 'main'], ['raw_base', 'https://example.com/'], ['license', 'MIT']]) {
    const root = makeFullFixture();
    editJson(root, 'catalog.json', (j) => { j[key] = bad; });
    assert.ok(catalogFails(root).some((m) => m.includes(key)), key);
  }
});
test('a catalog without exactly the design-standards skill is caught', () => {
  const root = makeFullFixture();
  editJson(root, 'catalog.json', (j) => { j.skills[0].id = 'other'; });
  assert.ok(catalogFails(root).some((m) => /skill entry/.test(m)));
  const two = makeFullFixture();
  editJson(two, 'catalog.json', (j) => { j.skills.push(j.skills[0]); });
  assert.ok(catalogFails(two).some((m) => /skill entry/.test(m)));
});
test('a catalog version that differs from VERSION is caught', () => {
  const root = makeFullFixture();
  editJson(root, 'catalog.json', (j) => { j.skills[0].version = '0.0.1-test'; });
  assert.ok(catalogFails(root).some((m) => /differs from VERSION/.test(m)));
});
test('a catalog path that does not exist is caught', () => {
  const root = makeFullFixture();
  editJson(root, 'catalog.json', (j) => { j.skills[0].path = 'skills/design-standards/NOPE.md'; });
  assert.ok(catalogFails(root).some((m) => /path .*NOPE\.md/.test(m)));
});
test('a stale skill fingerprint is caught', () => {
  const root = makeFullFixture();
  editJson(root, 'catalog.json', (j) => { j.skills[0].sha256 = '0'.repeat(64); });
  assert.ok(catalogFails(root).some((m) => /skill sha256 is stale/.test(m)));
});
test('a stale reference fingerprint is caught', () => {
  const root = makeFullFixture();
  editJson(root, 'catalog.json', (j) => { j.skills[0].files[0].sha256 = '0'.repeat(64); });
  assert.ok(catalogFails(root).some((m) => /sha256 is stale/.test(m)));
});
test('a listed reference that does not exist is caught', () => {
  const root = makeFullFixture();
  editJson(root, 'catalog.json', (j) => { j.skills[0].files.push({ path: 'skills/design-standards/references/zzz.md', sha256: '0'.repeat(64) }); });
  assert.ok(catalogFails(root).some((m) => /zzz\.md.*does not exist/.test(m)));
});
test('references out of order are caught', () => {
  const root = makeFullFixture();
  editJson(root, 'catalog.json', (j) => { j.skills[0].files.reverse(); });
  assert.ok(catalogFails(root).some((m) => /sorted by path/.test(m)));
});
test('a reference file the catalog does not list is caught', () => {
  const root = makeFullFixture();
  fs.writeFileSync(path.join(root, 'skills/design-standards/references/extra.md'), 'extra\n');
  assert.ok(catalogFails(root).some((m) => /extra\.md.*not listed/.test(m)));
});
test('a catalog that disagrees with release.json is caught', () => {
  const root = makeFullFixture();
  editJson(root, 'release.json', (j) => { j.files.pop(); });
  assert.ok(catalogFails(root).some((m) => /release\.json/.test(m)));
});

// Source ASCII scan.
test('a non-ASCII character or a replacement character in a source file is caught', () => {
  const root = makeFullFixture();
  fs.mkdirSync(path.join(root, 'scripts'), { recursive: true });
  fs.writeFileSync(path.join(root, 'scripts/bad.js'), '// caf' + E_ACUTE + '\n');
  fs.writeFileSync(path.join(root, 'themes/bad.css'), '/* x' + REPLACEMENT + ' */\n');
  const a = failuresOf(root)['Source ASCII'];
  assert.ok(a.some((m) => /scripts\/bad\.js:1 .*non-ASCII/.test(m)));
  assert.ok(a.some((m) => /themes\/bad\.css:1 .*replacement character/.test(m)));
});
// The same forbidden tokens, planted where every scan must ignore them and where every scan must flag them.
const PLANT = (root, rel) => {
  const p = path.join(root, rel);
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, `Acme #008080 by @somecreator Source: a reel ${EM} caf${E_ACUTE} bad${REPLACEMENT}\n`);
};
test('.superpowers and node_modules are ignored by every scan, the same tokens in a normal file are flagged', () => {
  const root = makeFullFixture();
  PLANT(root, '.superpowers/x.md');
  PLANT(root, 'node_modules/x/y.md');
  PLANT(root, 'docs/x.md');
  const f = failuresOf(root);
  for (const name of ['Credits', 'Scrub', 'Text rules', 'Source ASCII']) {
    assert.ok(!f[name].some((m) => /\.superpowers|node_modules/.test(m)), `${name} scanned an ignored folder`);
    assert.ok(f[name].some((m) => m.startsWith('docs/x.md')), `${name} did not flag docs/x.md`);
  }
  assert.ok(f.Scrub.some((m) => /docs\/x\.md:1 contains a listed name: Acme/.test(m)));
  assert.ok(f.Scrub.some((m) => /docs\/x\.md:1 has a teal-family colour #008080/.test(m)));
  assert.ok(f.Credits.some((m) => /docs\/x\.md:1 has a handle: @somecreator/.test(m)));
  assert.ok(f['Text rules'].some((m) => /docs\/x\.md:1 has an em or en dash/.test(m)));
  assert.ok(f['Source ASCII'].some((m) => /docs\/x\.md:1 has a replacement character/.test(m)));
});
test('the source scan covers the README, CHANGELOG, docs and the generated json, strictly', () => {
  for (const rel of ['README.md', 'CHANGELOG.md', 'docs/a.md', 'catalog.json', 'release.json', 'scripts/a.js', 'page/a.html', 'themes/a.css', 'skill-src/a.tpl.md', 'test/a.test.js']) {
    const root = makeFullFixture();
    const p = path.join(root, rel);
    fs.mkdirSync(path.dirname(p), { recursive: true });
    fs.appendFileSync(p, `\ncaf${E_ACUTE}\n`);
    assert.ok(failuresOf(root)['Source ASCII'].some((m) => m.startsWith(rel + ':') && /non-ASCII/.test(m)), rel);
  }
});
test('patterns, dist and skills may carry arrows and check marks, but not U+FFFD, a bare chevron hex or dashes', () => {
  const ARROW = String.fromCharCode(0x2192);
  const CHECK = String.fromCharCode(0x2713);
  const root = makeFullFixture();
  for (const rel of [DEMO, 'dist/design-standards.html', 'skills/design-standards/references/forms.md']) fs.appendFileSync(path.join(root, rel), `\n${ARROW} ${CHECK}\n`);
  assert.deepStrictEqual(failuresOf(root)['Source ASCII'], []);
  const bad = makeFullFixture();
  fs.appendFileSync(path.join(bad, DEMO), `\n<i class="chev">25BE</i>\n`);
  fs.appendFileSync(path.join(bad, 'dist/design-standards.html'), `\nx${REPLACEMENT}\n`);
  fs.appendFileSync(path.join(bad, 'skills/design-standards/references/forms.md'), `\na ${EM} b\n`);
  const a = failuresOf(bad)['Source ASCII'];
  assert.ok(a.some((m) => /demo\.html.*bare hex run/.test(m)));
  assert.ok(a.some((m) => /dist\/design-standards\.html.*replacement character/.test(m)));
  assert.ok(a.some((m) => /forms\.md.*em or en dash/.test(m)));
  const ok = makeFullFixture();
  fs.appendFileSync(path.join(ok, DEMO), `\n<i class="chev">&#x25BE;</i> <i class="chev">${String.fromCharCode(0x25be)}</i>\n`);
  assert.deepStrictEqual(failuresOf(ok)['Source ASCII'], []);
});
test('a bare "Bright Coast" or "BrightCoast" is caught, "Bright Coast AI" is not', () => {
  const root = makeFullFixture();
  fs.mkdirSync(path.join(root, 'docs'), { recursive: true });
  fs.writeFileSync(path.join(root, 'docs/a.md'), 'Bright Coast AI is fine.\n');
  assert.deepStrictEqual(failuresOf(root)['Text rules'], []);
  fs.writeFileSync(path.join(root, 'docs/a.md'), 'The Bright Coast build.\nThe BrightCoast build.\n');
  const t = failuresOf(root)['Text rules'];
  assert.ok(t.some((m) => m.startsWith('docs/a.md:1')) && t.some((m) => m.startsWith('docs/a.md:2')));
});
