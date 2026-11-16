---
id: optical-corrections
title: Optical Corrections
category: visual
order: 36
---
## Rule
<p>Mathematically centred is not the same as looking centred. The eye judges the visual weight of a shape, not its bounding box, so a few elements need a small deliberate nudge away from the numbers.</p>
<p><strong>Asymmetric glyphs move toward their point.</strong> A play triangle centred by its box looks pushed to the left, because most of its weight sits on the flat side. Shift it toward its point by roughly one sixth of its width (about 2px for a 12px triangle) inside its circle or button. The same applies to any arrow or chevron with a heavy side.</p>
<p><strong>Icons align to the label&rsquo;s cap height.</strong> An icon centred on the text&rsquo;s line box sits slightly low, because the line box includes space for descenders. Centre the icon on the cap height of the label instead, and make the nudge in em units (for example <code class="tok">translateY(-0.08em)</code>) so it stays correct when the text size changes.</p>
<p><strong>Single-line labels sit slightly high.</strong> A one-line button label centred by its line box looks low for the same reason. Trim the text box to the cap height and alphabetic baseline with <code class="tok">text-box: trim-both cap alphabetic</code> where it is supported, or nudge the label up 1 to 2px (about 0.06em) where it is not. Light text on a dark ground is the other common correction; it reads heavier, so it drops about one weight step (see Dark Mode). Round shapes overshooting square ones is in Icon Design Rules.</p>
## Do
- A play triangle moved about one sixth of its width toward its point
- Icon nudges in em units, so they scale with the text
## Avoid
- Trusting the bounding box for a triangle, arrow or chevron
## Code: CSS
<pre><code>.play-btn svg { transform: translateX(16.7%); } <span class="cm">/* about one sixth of the glyph's width, toward the point */</span>

.btn { display: inline-flex; align-items: center; gap: 0.5em; }
.btn .icon { transform: translateY(-0.08em); } <span class="cm">/* onto the cap height, scales with the text */</span>

.btn-label { text-box: trim-both cap alphabetic; } <span class="cm">/* trims the line box to the letters */</span></code></pre>
