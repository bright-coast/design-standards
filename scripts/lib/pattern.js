'use strict';
const { escapeHtml } = require('./html');
const SECTION_RE = /^## (Rule|Do|Avoid|Extra: [a-z-]+|Code: .+)$/;

function parsePattern(text, where) {
  const t = text.replace(/\r\n/g, '\n');
  const m = t.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!m) throw new Error(`${where}: missing frontmatter`);
  const meta = {};
  for (const line of m[1].split('\n')) {
    const kv = line.match(/^([a-z-]+): (.*)$/);
    if (!kv) throw new Error(`${where}: bad frontmatter line "${line}"`);
    meta[kv[1]] = kv[2];
  }
  for (const k of ['id', 'title', 'category', 'order']) if (!(k in meta)) throw new Error(`${where}: frontmatter is missing "${k}"`);
  if (!/^[a-z0-9][a-z0-9-]*$/.test(meta.id)) throw new Error(`${where}: id "${meta.id}" must be lowercase letters, digits and hyphens`);
  const order = Number(meta.order);
  if (!Number.isInteger(order) || order < 1) throw new Error(`${where}: order must be a whole number from 1`);
  const sections = [];
  let cur = null;
  for (const line of m[2].split('\n')) {
    const s = line.match(SECTION_RE);
    if (s) { cur = { name: s[1], lines: [] }; sections.push(cur); }
    else if (cur) cur.lines.push(line);
    else if (line.trim()) throw new Error(`${where}: text before the first section`);
  }
  const body = (name) => { const x = sections.find((s) => s.name === name); return x ? x.lines.join('\n').trim() : ''; };
  const bullets = (name) => body(name).split('\n').filter((l) => l.trim()).map((l) => {
    const b = l.match(/^- (.*)$/);
    if (!b) throw new Error(`${where}: every line under "${name}" must start with "- "`);
    return b[1];
  });
  const extras = sections.filter((s) => s.name.startsWith('Extra: ')).map((s) => ({ kind: s.name.slice(7), html: s.lines.join('\n').trim() }));
  const codes = sections.filter((s) => s.name.startsWith('Code: ')).map((s) => ({ label: s.name.slice(6), html: s.lines.join('\n').trim() }));
  if (!body('Rule')) throw new Error(`${where}: the Rule section is empty`);
  return { id: meta.id, title: meta.title, category: meta.category, order, rule: body('Rule'), dos: bullets('Do'), avoids: bullets('Avoid'), extras, codes };
}

function formatPattern(p) {
  const out = ['---', `id: ${p.id}`, `title: ${p.title}`, `category: ${p.category}`, `order: ${p.order}`, '---', '## Rule', p.rule.trim()];
  if (p.dos.length) out.push('## Do', ...p.dos.map((d) => `- ${d}`));
  if (p.avoids.length) out.push('## Avoid', ...p.avoids.map((d) => `- ${d}`));
  for (const e of p.extras) out.push(`## Extra: ${e.kind}`, e.html.trim());
  for (const c of p.codes) out.push(`## Code: ${c.label}`, c.html.trim());
  const text = out.join('\n') + '\n';
  const bad = text.split('\n').slice(6).find((l) => /^## /.test(l) && !SECTION_RE.test(l));
  if (bad) throw new Error(`${p.id}: a content line starts with "## " and would be read as a section: ${bad.slice(0, 60)}`);
  return text;
}

function renderPattern(p, demoHtml, num) {
  const li = (avoid, mk, t) => `<li${avoid ? ' class="avoid"' : ''}><span class="mk">${mk}</span>${t}</li>`;
  const items = [...p.dos.map((d) => li(false, '&check;', d)), ...p.avoids.map((a) => li(true, '&times;', a))];
  const codes = p.codes.map((c) => `<div class="code-panel"><div class="code-panel-bar"><span class="code-panel-lang">${escapeHtml(c.label)}</span><button class="code-toggle" type="button"><span class="txt">Show code</span><span class="chev">▾</span></button></div>${c.html}</div>`).join('\n');
  const extras = p.extras.map((e) => e.html).join('\n');
  return `<div class="lib-pattern" id="lp-${p.id}">\n${demoHtml}\n<div>\n<div class="lib-pattern-head"><span class="lib-pattern-num">${String(num).padStart(2, '0')}</span><h4>${escapeHtml(p.title)}</h4></div>\n<div class="lib-pattern-body">\n${p.rule}\n</div>\n${items.length ? `<ul class="lib-dodont">${items.join('')}</ul>\n` : ''}${extras ? extras + '\n' : ''}</div>\n${codes}\n</div>`;
}
module.exports = { parsePattern, formatPattern, renderPattern, SECTION_RE };
