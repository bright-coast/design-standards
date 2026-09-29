'use strict';
const NAMED = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', rsquo: '\u2019', lsquo: '\u2018', rdquo: '\u201D', ldquo: '\u201C', middot: '\u00B7', check: '\u2713', times: '\u00D7', hellip: '\u2026', larr: '\u2190', rarr: '\u2192', ndash: '\u2013', mdash: '\u2014' };

function decodeEntities(s) {
  return s.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (m, e) => {
    if (e[0] === '#') {
      const n = e[1].toLowerCase() === 'x' ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10);
      return String.fromCodePoint(n);
    }
    return Object.prototype.hasOwnProperty.call(NAMED, e) ? NAMED[e] : m;
  });
}
const escapeHtml = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// HTML fragment to Markdown. Code spans are stashed first so their angle brackets survive tag stripping.
function htmlToMd(html) {
  const stash = [];
  let s = html.replace(/<code[^>]*>([\s\S]*?)<\/code>/gi, (m, c) => {
    const t = decodeEntities(c.replace(/<[^>]+>/g, ''));
    const tick = t.includes('`') ? '``' : '`';
    stash.push(tick + t + tick);
    return `\u0000${stash.length - 1}\u0000`;
  });
  s = s.replace(/<\/?(strong|b)(\s[^>]*)?>/gi, '**').replace(/<\/?(em|i)(\s[^>]*)?>/gi, '*')
    .replace(/<br\s*\/?>/gi, '\n').replace(/<\/(p|div|li)>/gi, '\n\n').replace(/<[^>]+>/g, '');
  s = decodeEntities(s).replace(/\u0000(\d+)\u0000/g, (m, i) => stash[Number(i)]);
  return s.replace(/[ \t]+\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim();
}

// The text of every <pre><code> block, highlight spans removed, joined by a blank line.
function codeToText(html) {
  const blocks = [...html.matchAll(/<pre[^>]*>\s*<code[^>]*>([\s\S]*?)<\/code>\s*<\/pre>/gi)].map((m) => m[1]);
  return (blocks.length ? blocks : [html]).map((b) => decodeEntities(b.replace(/<[^>]+>/g, '')).replace(/\s+$/, '')).join('\n\n');
}
function fence(text, lang) {
  let f = '```';
  while (text.includes(f)) f += '`';
  return `${f}${lang}\n${text}\n${f}`;
}
function fenceLang(label) {
  const l = label.toLowerCase();
  if (/^css/.test(l)) return 'css';
  if (/^jsx/.test(l)) return 'jsx';
  if (/^(js|node)/.test(l)) return 'js';
  if (/^html/.test(l)) return 'html';
  return '';
}
const textOf = (html) => decodeEntities(html.replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();
module.exports = { decodeEntities, escapeHtml, htmlToMd, codeToText, fence, fenceLang, textOf };
