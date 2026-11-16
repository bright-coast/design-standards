---
id: icon-rules
title: Icon Design Rules
category: visual
order: 12
---
## Rule
<p>A round or organic icon shape needs to sit slightly larger than a square one to read as the same optical size. This is the same overshoot correction typography uses for round letterforms like O against flat ones like H. Snap every icon to a fixed grid (typically 24px) with one consistent stroke weight across the whole set, and give every icon a fixed bounding box even as the internal shape varies, so a row of mixed icons stays visually aligned. Mixing filled and outline styles within the same icon set at random reads as an inconsistent, unfinished system.</p>
<p><strong>Live area, caps and joins.</strong> Inside the 24px box, draw within a live area of about 20px, leaving 2px of padding so strokes and round shapes have room to overshoot. One stroke width goes with one cap and one join style for the whole set (round caps and round joins, for example), never round on some icons and square on others. <strong>Snap to whole pixels:</strong> keep coordinates on whole numbers so lines render sharp; with an odd stroke width (1px or 3px) place the line on a half pixel (x = 12.5) so the stroke fills whole pixels rather than blurring across two. <strong>Few sizes, matched to text:</strong> use three icon sizes at most, each paired with a text size, for example 16px icons beside 12 to 14px text, 20px beside 15 to 16px text and 24px beside 18 to 20px text. Optical centring of asymmetric glyphs and icon alignment to a label&rsquo;s cap height are in Optical Corrections.</p>
## Do
- Snap to a fixed grid, one stroke weight
- One cap and join style across the whole set
- Three icon sizes at most, each paired with a text size
## Avoid
- Mixing fill and outline styles at random
- Fractional coordinates that blur a 1px stroke across two pixels
## Code: CSS
<pre><code>.icon {
  width: 24px; height: 24px; <span class="cm">/* fixed bounding box for every icon in the set */</span>
  stroke-width: 1.5px; <span class="cm">/* one consistent stroke weight, never mixed per-icon */</span>
  stroke-linecap: round; stroke-linejoin: round; <span class="cm">/* one cap and join style for the set */</span>
}
.icon-sm { width: 16px; height: 16px; } <span class="cm">/* beside 12 to 14px text */</span>
.icon-md { width: 20px; height: 20px; } <span class="cm">/* beside 15 to 16px text */</span>
.icon-lg { width: 24px; height: 24px; } <span class="cm">/* beside 18 to 20px text */</span></code></pre>
<pre style="margin-top:6px;"><code><span class="cm">/* round/organic icon shapes overshoot the grid slightly to read as the same size */</span>
.icon-circle { transform: scale(1.06); } <span class="cm">/* optical size-match against square icons */</span>
<span class="cm">/* pick ONE style system-wide: filled OR outline, never both mixed in one set */</span></code></pre>
