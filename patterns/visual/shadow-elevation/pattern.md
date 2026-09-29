---
id: shadow-elevation
title: Shadow Elevation
category: visual
order: 15
---
## Rule
<p>Real depth comes from stacking multiple shadow layers, not one blur value scaled up for &ldquo;more elevation&rdquo;. A genuinely floating element has a tight, dark contact shadow close to its edge, a softer mid-range shadow, and a very soft, wide ambient shadow, all three layered together. Tinting the shadow&rsquo;s colour toward the brand accent instead of pure black adds a subtle glow that feels considered rather than generic. Reserve the strongest elevation tier for what actually matters most on screen (an open modal, a dragged card) rather than applying it uniformly and flattening the whole hierarchy.</p>
## Do
- Tint the glow to brand accent
## Avoid
- One flat drop shadow used everywhere
## Code: CSS
<pre><code>:root {
  --elevation-1: 0 1px 2px rgb(0 0 0 / .08);
  --elevation-2: 0 1px 2px rgb(0 0 0 / .06), 0 4px 8px rgb(0 0 0 / .05);
  --elevation-3: 0 2px 4px rgb(0 0 0 / .06), 0 8px 16px rgb(0 0 0 / .05), 0 20px 32px rgb(0 0 0 / .04);
  --elevation-glow: 0 8px 24px rgba(59, 91, 219, 0.25); <span class="cm">/* tinted to brand accent, not black */</span>
}
.card { box-shadow: var(--elevation-1); } <span class="cm">/* resting */</span>
.modal { box-shadow: var(--elevation-3); } <span class="cm">/* strongest tier reserved for what matters most */</span>
.card.dragging { box-shadow: var(--elevation-3), var(--elevation-glow); }</code></pre>
