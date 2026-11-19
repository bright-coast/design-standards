---
id: shadow-elevation
title: Shadow Elevation
category: visual
order: 15
---
## Rule
<p>Real depth comes from stacking multiple shadow layers, not one blur value scaled up for &ldquo;more elevation&rdquo;. A genuinely floating element has a tight, dark contact shadow close to its edge, a softer mid-range shadow, and a very soft, wide ambient shadow, all three layered together. Tinting the shadow&rsquo;s colour toward the brand accent instead of pure black adds a subtle glow that feels considered rather than generic. Reserve the strongest elevation tier for what actually matters most on screen (an open modal, a dragged card) rather than applying it uniformly and flattening the whole hierarchy.</p>
<p><strong>One light source.</strong> Every shadow in the interface assumes the same light direction, usually from straight above, so every shadow offsets the same way (down, never left on one card and right on another). <strong>How tiers scale:</strong> going up a tier, the offset and blur grow (y 1 and blur 2 at rest, y 20 and blur 32 on a modal) while the opacity of each layer stays roughly the same, about 4 to 8%; a higher element casts a longer, softer shadow, not a darker one. <strong>Trim the halo:</strong> give the wide ambient layer a negative spread (for example 0 20px 32px -8px) so the shadow sits under the element instead of glowing out past its sides. <strong>On dark surfaces</strong> black shadows barely read and Dark Mode raises surfaces with lightness instead; the one exception is a low-opacity glow tinted to the accent (about 15 to 25%), which can stand in for the black ambient layer on a floating element.</p>
<p><strong>Five fixes for card shadows.</strong> <strong>1. Two layers, never one:</strong> stop using a single shadow such as <code class="tok">0 4px 20px rgba(0,0,0,.25)</code>. Stack a tight contact shadow, <code class="tok">0 1px 2px rgba(24,24,27,.08)</code> (one pixel down, two of blur), with a wide lift shadow, <code class="tok">0 8px 24px rgba(24,24,27,.08)</code> (eight down, 24 of blur). <strong>2. Tint, don&rsquo;t blacken:</strong> take the shadow colour from the background&rsquo;s hue (zinc-900, rgb 24, 24, 27) at about 8%, never black at 25%. <strong>3. Light from above:</strong> x offset 0 and a positive y on every shadow in the UI, so nothing looks lit by two suns. <strong>4. Elevation is a scale, not a guess:</strong> shadow-1 for a card, shadow-2 for a dropdown, shadow-3 for a modal. Each component gets one level, and no component gets a custom shadow. <strong>5. Dark mode:</strong> shadows vanish on a dark page, so raise elevation with a lighter surface (for example #18181B) and a one-pixel border instead (<a href="#lp-dark-mode">Dark Mode</a>, entry 04).</p>
## Do
- Tint the glow to brand accent
- Every shadow offset in the same direction
- Offset and blur grow with elevation; opacity stays about the same
- Two layers on every card: a contact shadow plus a lift shadow
- Shadow colour from the background&rsquo;s hue at about 8%
- One level per component from a three-step scale (card, dropdown, modal)
- Dark mode: a lighter surface and a one-pixel border instead of a shadow
## Avoid
- One flat drop shadow used everywhere
- A black ambient shadow on a dark surface
- One heavy black shadow such as <code class="tok">0 4px 20px rgba(0,0,0,.25)</code>
- A custom shadow made up for a single component
- A shadow with a sideways x offset
## Extra: variant-note
<div class="variant-note"><b>Shadow tint, two variants.</b> Variant A: a neutral tint from the background&rsquo;s own hue (zinc-900 at about 8%). Use when: resting cards, dropdowns and modals, which is every ordinary shadow. Variant B: a glow tinted to the brand accent. Use when: one highlighted or dragged element that should stand out from the rest, layered on top of its neutral shadow. Both kept on purpose.</div>
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
.card.dragging { box-shadow: var(--elevation-3), var(--elevation-glow); }

<span class="cm">/* five fixes: two layers, zinc tint at 8%, x 0 and y positive, one level per component */</span>
:root {
  --shadow-1: 0 1px 2px rgb(24 24 27 / .08), 0 8px 24px rgb(24 24 27 / .08);  <span class="cm">/* card: contact + lift */</span>
  --shadow-2: 0 2px 4px rgb(24 24 27 / .08), 0 12px 32px rgb(24 24 27 / .08); <span class="cm">/* dropdown */</span>
  --shadow-3: 0 4px 8px rgb(24 24 27 / .08), 0 24px 48px -8px rgb(24 24 27 / .08); <span class="cm">/* modal */</span>
}
<span class="cm">/* not this: box-shadow: 0 4px 20px rgba(0,0,0,.25); one layer, black at 25% */</span>
@media (prefers-color-scheme: dark) {
  .card { box-shadow: none; background: #18181B; border: 1px solid rgb(255 255 255 / .08); } <span class="cm">/* lighter surface + 1px border */</span>
}</code></pre>
