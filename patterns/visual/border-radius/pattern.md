---
id: border-radius
title: Border Radius
category: visual
order: 1
---
## Rule
<p>Nested corners follow real math: a card with 12px radius and 8px padding needs an inner element radius of exactly 4px (outer minus padding), or the inner corner reads as visually off even though nobody can say why. Pick one radius scale for the whole system (4/8/12/16, or similar) instead of eyeballing a number per component, and scale the radius up with element size; a tiny badge and a full page card at the same 8px radius look proportionally wrong on the smaller one. Radius is also a brand lever: sharp corners read technical/serious, generous rounding reads friendly/approachable, so pick deliberately.</p>
<p>The full checklist has six rules. <strong>Nested:</strong> inner radius equals outer radius minus padding (a 12px card with 8px padding gets a 4px inner corner), so nested corners share one centre; otherwise the inner corner bulges. <strong>Scale:</strong> size sets the radius (for example small 4, medium 8, large 16, which are sample values), not 8px on everything; a chip and a modal do not share a corner. <strong>Pill:</strong> full radius is a shape, not a number, so use 9999px only on a single-line element such as a chip, avatar or toggle, never on a multi-line card. <strong>Edges:</strong> an element that touches an edge has no corner there, so a bottom sheet flush to the screen edge gets its top corners rounded and its bottom corners at zero. <strong>Ring:</strong> a selection ring drawn as its own box sits outside the element, so ring radius equals the inner radius plus the gap (8 inside and a 2px gap gives 10 out); if the corners pinch, flip the formula. <strong>Images:</strong> an edge-to-edge image in a rounded card is clipped by the card (<code class="tok">overflow: hidden</code>) so square image corners do not poke through; for an inset image, subtract the padding and apply the same nested rule.</p>
## Do
- Scale radius with element size
- Focus ring radius matches the element&rsquo;s own radius
- Image corners clipped to their container&rsquo;s radius, not left square
- Pill radius (9999px) only on single-line shapes such as a chip, avatar or toggle
- No rounded corner where an element touches an edge: a flush bottom sheet keeps only its top corners
- A selection ring drawn as its own box gets the element&rsquo;s radius plus the gap (8 inside, 10 out for a 2px gap)
## Avoid
- Random per-component radius values
- 9999px on a multi-line card
## Code: CSS
<pre><code>:root {
  --radius-sm: 4px;  --radius-md: 8px;  --radius-lg: 12px;  --radius-xl: 16px;
}
.badge  { border-radius: var(--radius-sm); }
.button { border-radius: var(--radius-md); }
.card   { border-radius: var(--radius-lg); padding: 16px; }
<span class="cm">/* nested corner math: outer radius − padding = correct inner radius */</span>
.card .card-inner { border-radius: calc(var(--radius-lg) - 16px); } <span class="cm">/* = -4px → clamp to 0 */</span>
.card .card-inner-tight { padding: 8px; border-radius: calc(var(--radius-lg) - 8px); } <span class="cm">/* = 4px, correct */</span>

.chip, .avatar, .toggle { border-radius: 9999px; } <span class="cm">/* pill: single-line shapes only, never a multi-line card */</span>
.sheet { border-radius: var(--radius-xl) var(--radius-xl) 0 0; } <span class="cm">/* flush to the screen edge: no corner where it touches */</span>
.selectable { padding: 2px; } <span class="cm">/* the gap between the element and its ring */</span>
.selectable .ring { border-radius: calc(var(--radius-md) + 2px); } <span class="cm">/* ring = inner radius (8) + gap (2) = 10; if the corners pinch, flip the formula */</span>
.card { overflow: hidden; } <span class="cm">/* edge-to-edge image: the card clips it, so square image corners never poke through */</span>
.card .inset-img { margin: 8px; border-radius: calc(var(--radius-lg) - 8px); } <span class="cm">/* inset image: subtract the padding, same nested rule */</span></code></pre>
