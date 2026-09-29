---
id: gradient
title: Gradient Design
category: visual
order: 10
---
## Rule
<p>Neighbouring hues on the colour wheel blend cleanly into each other, while hues from opposite sides create a muddy grey dead zone in the middle of the transition. A blue-to-orange gradient always passes through a flat grey band, an indigo-to-blue gradient never does. Keep lightness moving in one direction only across the gradient; a value that dips and rises again creates a visible, unintentional banding seam. A subtle grain or noise overlay on top of a large gradient hides colour-banding artifacts on cheaper screens, and body text should never sit on a gradient&rsquo;s unpredictable mid-transition zone where contrast is impossible to guarantee.</p>
## Do
- Keep lightness moving one direction only
## Avoid
- Body text on a gradient&rsquo;s mid-transition
## Code: CSS
<pre><code><span class="cm">/* analogous hues (indigo → blue) blend clean; lightness moves one direction only */</span>
.gradient-clean { background: linear-gradient(135deg, #3B5BDB 0%, #3A7CA5 100%); }

<span class="cm">/* grain overlay hides banding on cheap/compressed screens */</span>
.gradient-clean::after {
  content: <span class="str">''</span>; position: absolute; inset: 0; opacity: .04; mix-blend-mode: overlay;
  background-image: url(<span class="str">"data:image/svg+xml,..."</span>); <span class="cm">/* fractal noise SVG */</span>
}
<span class="cm">/* text never sits on the unpredictable mid-transition, pin it to the darker anchor end */</span>
.gradient-clean .headline { color: white; text-shadow: 0 1px 3px rgb(0 0 0 / .3); }</code></pre>
