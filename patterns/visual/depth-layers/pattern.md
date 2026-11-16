---
id: depth-layers
title: Depth Layers
category: visual
order: 5
---
## Rule
<p>Three CSS levers create real perceived depth without a visual redesign: layered box-shadows (a tight contact shadow plus a soft ambient one), a subtle parallax speed differential between background and foreground on scroll, and a small hover z-lift. Stack a tight shadow with a wider ambient one rather than one flat blur value; that combination is what makes an element read as physically raised. Keep hover lifts subtle: a few pixels of translateY and roughly 3% scale reads as responsive; push either further and it starts to feel gimmicky rather than tactile.</p>
<p><strong>A perspective tilt, sparingly.</strong> A tiny 3D tilt toward the pointer (about 2 to 4 degrees, under a perspective of around 800 to 1000px) can add lift to one hero card or product shot. Keep it to one element per screen, never on cards in a list or anything holding text people need to read, and switch it off under <code class="tok">prefers-reduced-motion</code>.</p>
## Do
- Stack tight + mid + ambient shadows
- A tilt of at most a few degrees, on one hero element only
## Avoid
- Parallax/scale pushed far enough to distract
## Code: CSS
<pre><code>.elevated {
  box-shadow:
    0 1px 2px rgb(0 0 0 / .08),   <span class="cm">/* tight contact shadow */</span>
    0 4px 8px rgb(0 0 0 / .06),   <span class="cm">/* mid */</span>
    0 12px 24px rgb(0 0 0 / .05); <span class="cm">/* soft ambient */</span>
  transition: transform 200ms ease, box-shadow 200ms ease;
}
.elevated:hover {
  transform: translateY(-2px) scale(1.03); <span class="cm">/* subtle: a few px, ~3% */</span>
  box-shadow: 0 2px 4px rgb(0 0 0 / .1), 0 8px 16px rgb(0 0 0 / .08), 0 20px 32px rgb(0 0 0 / .06);
}
.hero-card { transform: perspective(900px) rotateX(var(--tilt-x, 0deg)) rotateY(var(--tilt-y, 0deg)); } <span class="cm">/* set by the pointer, kept within 3deg */</span>
@media (prefers-reduced-motion: reduce) { .hero-card { transform: none; } }
.parallax-bg { transform: translateY(calc(var(--scroll-y) * 0.3px)); } <span class="cm">/* moves slower than foreground */</span></code></pre>
