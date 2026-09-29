---
id: color-picker
title: Color Picker UX
category: interaction
order: 5
---
## Rule
<p>A colour picker is a decision that cascades through the rest of the UI, not a gradient with a slider. OKLCH alongside hex matters because hex is machine-friendly but not human-predictable. OKLCH&rsquo;s lightness/chroma/hue lets someone change one number and get a predictable lighter or darker shade. A live contrast-ratio readout at pick time (not buried in a later review step) kills a failing colour pair before it ever ships, and alpha needs previewing over a checkerboard on both light and dark, since transparency lies against a plain white canvas.</p>
## Do
- Live WCAG contrast badge while picking
- Recent swatches + saved palettes
## Avoid
- Previewing alpha only against white
## Code: JS
<pre><code><span class="kw">function</span> <span class="fn">relativeLuminance</span>(hex) {
  <span class="kw">const</span> [r, g, b] = hexToRgb(hex).map(c => {
    c /= <span class="num">255</span>;
    <span class="kw">return</span> c &lt;= <span class="num">0.03928</span> ? c / <span class="num">12.92</span> : ((c + <span class="num">0.055</span>) / <span class="num">1.055</span>) ** <span class="num">2.4</span>;
  });
  <span class="kw">return</span> <span class="num">0.2126</span> * r + <span class="num">0.7152</span> * g + <span class="num">0.0722</span> * b;
}
<span class="kw">function</span> <span class="fn">contrastRatio</span>(fgHex, bgHex) {
  <span class="kw">const</span> [l1, l2] = [relativeLuminance(fgHex), relativeLuminance(bgHex)]
    .sort((a, b) => b - a);
  <span class="kw">return</span> (l1 + <span class="num">0.05</span>) / (l2 + <span class="num">0.05</span>);
}

<span class="kw">const</span> ratio = contrastRatio(pickedColor, pageBackground);
badge.textContent = ratio >= <span class="num">4.5</span> ? <span class="str">`Passes AA (${ratio.toFixed(1)}:1)`</span> : <span class="str">`Fails AA (${ratio.toFixed(1)}:1)`</span>;
badge.dataset.pass = ratio >= <span class="num">4.5</span>;</code></pre>
