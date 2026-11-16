---
id: shadow-elevation
title: Shadow Elevation
category: visual
order: 15
---
## Rule
<p>Real depth comes from stacking multiple shadow layers, not one blur value scaled up for &ldquo;more elevation&rdquo;. A genuinely floating element has a tight, dark contact shadow close to its edge, a softer mid-range shadow, and a very soft, wide ambient shadow, all three layered together. Tinting the shadow&rsquo;s colour toward the brand accent instead of pure black adds a subtle glow that feels considered rather than generic. Reserve the strongest elevation tier for what actually matters most on screen (an open modal, a dragged card) rather than applying it uniformly and flattening the whole hierarchy.</p>
<p><strong>One light source.</strong> Every shadow in the interface assumes the same light direction, usually from straight above, so every shadow offsets the same way (down, never left on one card and right on another). <strong>How tiers scale:</strong> going up a tier, the offset and blur grow (y 1 and blur 2 at rest, y 20 and blur 32 on a modal) while the opacity of each layer stays roughly the same, about 4 to 8%; a higher element casts a longer, softer shadow, not a darker one. <strong>Trim the halo:</strong> give the wide ambient layer a negative spread (for example 0 20px 32px -8px) so the shadow sits under the element instead of glowing out past its sides. <strong>On dark surfaces</strong> black shadows barely read and Dark Mode raises surfaces with lightness instead; the one exception is a low-opacity glow tinted to the accent (about 15 to 25%), which can stand in for the black ambient layer on a floating element.</p>
## Do
- Tint the glow to brand accent
- Every shadow offset in the same direction
- Offset and blur grow with elevation; opacity stays about the same
## Avoid
- One flat drop shadow used everywhere
- A black ambient shadow on a dark surface
## Code: CSS
<pre><code>:root {
  --elevation-1: 0 1px 2px rgb(0 0 0 / .08);
  --elevation-2: 0 1px 2px rgb(0 0 0 / .06), 0 4px 8px rgb(0 0 0 / .05);
  --elevation-3: 0 2px 4px rgb(0 0 0 / .06), 0 8px 16px rgb(0 0 0 / .05), 0 20px 32px -8px rgb(0 0 0 / .04); <span class="cm">/* negative spread trims the side halo */</span>
  --elevation-glow-dark: 0 12px 32px -6px rgb(59 91 219 / .2); <span class="cm">/* dark surfaces: a tinted glow instead of a black ambient layer */</span>
  --elevation-glow: 0 8px 24px rgba(59, 91, 219, 0.25); <span class="cm">/* tinted to brand accent, not black */</span>
}
.card { box-shadow: var(--elevation-1); } <span class="cm">/* resting */</span>
.modal { box-shadow: var(--elevation-3); } <span class="cm">/* strongest tier reserved for what matters most */</span>
.card.dragging { box-shadow: var(--elevation-3), var(--elevation-glow); }</code></pre>
