---
id: color-a11y
title: Color Accessibility
category: visual
order: 3
---
## Rule
<p>Contrast is always a ratio between a colour and whatever sits directly behind it; there&rsquo;s no such thing as an accessible colour in isolation. Check every real foreground/background pair against WCAG (4.5:1 for body text, 3:1 for large text and UI components), and give every colour-coded cue a second signal (an icon, a pattern, a text label) so a red/green status distinction doesn&rsquo;t collapse entirely for a colour-blind user. The usual failure spot is a &ldquo;decorative&rdquo; muted grey caption that nobody thought to check, not the obvious high-stakes error text.</p>
<p><strong>Large text</strong> means about 24px at regular weight or about 19px (18.7px) bold. Only text at that size may drop to 3:1; anything smaller needs 4.5:1. <strong>Text over an image</strong> needs a scrim or a dark gradient under it (for example black at 40 to 60% across the part the text covers), and its contrast is measured at the lightest spot the text crosses, never against the image&rsquo;s average colour. <strong>Exempt from the minimums:</strong> disabled or inactive controls, logos and wordmarks, and pure decoration. A muted disabled button is not a failure, though it still needs another cue (no hover, a not-allowed cursor, a reason nearby) that it is disabled. <strong>Judge a colour in place:</strong> neighbouring colours change how light or strong a colour looks (the same mid grey reads darker on white than on black), so check swatches on the real surface beside their real neighbours, not alone on an empty artboard.</p>
## Do
- Second signal (icon/pattern) with every colour cue
- Text on an image sits on a scrim, checked at the lightest spot it crosses
## Avoid
- Red-vs-green as the only signal
- Disabled controls and logos flagged as contrast failures
## Code: JS
<pre><code><span class="kw">function</span> <span class="fn">contrastRatio</span>(fg, bg) { <span class="cm">/* same relative-luminance formula as Color Picker UX above */</span> }

<span class="kw">const</span> pairs = [
  { name: <span class="str">'caption grey on card'</span>, fg: <span class="str">'#9AA3AF'</span>, bg: <span class="str">'#FFFFFF'</span> }, <span class="cm">// the usual missed spot</span>
  { name: <span class="str">'error text'</span>, fg: <span class="str">'#C0392B'</span>, bg: <span class="str">'#FFFFFF'</span> },
];
pairs.forEach(p => {
  <span class="kw">const</span> ratio = contrastRatio(p.fg, p.bg);
  console.log(<span class="str">`${p.name}: ${ratio.toFixed(2)}:1, ${ratio >= 4.5 ? 'PASS' : 'FAIL'} AA body`</span>);
});
<span class="cm">// status dot: colour is never the only signal</span>
<span class="cm">// <span class="tag">&lt;span class="status status-error"&gt;</span>⚠ Failed<span class="tag">&lt;/span&gt;</span>, icon + text label alongside colour</span></code></pre>
