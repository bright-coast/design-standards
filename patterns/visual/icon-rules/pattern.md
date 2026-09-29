---
id: icon-rules
title: Icon Design Rules
category: visual
order: 12
---
## Rule
<p>A round or organic icon shape needs to sit slightly larger than a square one to read as the same optical size. This is the same overshoot correction typography uses for round letterforms like O against flat ones like H. Snap every icon to a fixed grid (typically 24px) with one consistent stroke weight across the whole set, and give every icon a fixed bounding box even as the internal shape varies, so a row of mixed icons stays visually aligned. Mixing filled and outline styles within the same icon set at random reads as an inconsistent, unfinished system.</p>
## Do
- Snap to a fixed grid, one stroke weight
## Avoid
- Mixing fill and outline styles at random
## Code: CSS
<pre><code>.icon {
  width: 24px; height: 24px; <span class="cm">/* fixed bounding box for every icon in the set */</span>
  stroke-width: 1.5px; <span class="cm">/* one consistent stroke weight, never mixed per-icon */</span>
}</code></pre>
<pre style="margin-top:6px;"><code><span class="cm">/* round/organic icon shapes overshoot the grid slightly to read as the same size */</span>
.icon-circle { transform: scale(1.06); } <span class="cm">/* optical size-match against square icons */</span>
<span class="cm">/* pick ONE style system-wide: filled OR outline, never both mixed in one set */</span></code></pre>
