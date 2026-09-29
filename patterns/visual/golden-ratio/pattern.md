---
id: golden-ratio
title: Golden Ratio
category: visual
order: 9
---
## Rule
<p>A 1.618 multiplier ties spacing and type scales into a single, self-consistent visual rhythm: each step is 1.618&times; the previous one, so a 16px body size implies a ~26px subheading and a ~42px heading without guessing. For a two-column layout, a 62/38 split favouring the primary content reads as more deliberate than an even 50/50, which has no clear hierarchy. Round every derived result to a clean, usable pixel value rather than keeping the raw irrational multiplier, and don&rsquo;t apply it so rigidly that it fights real content, like a hero image that genuinely needs a 70/30 split.</p>
## Do
- 62/38 split favouring primary content
## Avoid
- Applying it so rigidly it fights real content
## Extra: caveat-box
<div class="caveat-box"><b>Pick one ratio.</b> Typography as a System steps its type sizes by 1.25 (the major third) rather than 1.618. From a 16px base, 1.25 gives roughly 16, 20 and 25px in two steps, while 1.618 gives roughly 16, 26 and 42px. Pick one ratio per product and stay on it.</div>
## Code: JS
<pre><code><span class="kw">const</span> PHI = <span class="num">1.618</span>;
<span class="kw">function</span> <span class="fn">typeScale</span>(base) {
  <span class="kw">return</span> {
    caption: Math.round(base / PHI),        <span class="cm">// ~10px</span>
    body: base,                             <span class="cm">// 16px</span>
    subheading: Math.round(base * PHI),     <span class="cm">// ~26px</span>
    heading: Math.round(base * PHI * PHI),  <span class="cm">// ~42px, rounded to a clean pixel</span>
  };
}
<span class="cm">/* layout: 62/38, not a rigid 50/50 */</span>
.two-col { display: grid; grid-template-columns: 61.8fr 38.2fr; gap: 24px; }</code></pre>
