---
id: gradient
title: Gradient Design
category: visual
order: 10
---
## Rule
<p>Neighbouring hues on the colour wheel blend cleanly into each other, while hues from opposite sides create a muddy grey dead zone in the middle of the transition. A blue-to-orange gradient always passes through a flat grey band, an indigo-to-blue gradient never does. Keep lightness moving in one direction only across the gradient; a value that dips and rises again creates a visible, unintentional banding seam. A subtle grain or noise overlay on top of a large gradient hides colour-banding artifacts on cheaper screens, and body text should never sit on a gradient&rsquo;s unpredictable mid-transition zone where contrast is impossible to guarantee.</p>
<p><strong>Five rules for gradients that stay vivid and readable.</strong> Blue to yellow looks simple, but by default the browser mixes in RGB, so the middle drops to a muddy grey (#3b5bdb to #f5d90a passes through #989a72). <strong>1. Interpolate in OKLCH.</strong> One clause in your CSS, same two colours, and the middle stays bright (the same pair passes through a bright green, about #22b573). <strong>2. Add a middle stop.</strong> You pick the colour in between instead of letting the math pick it. <strong>3. Far apart needs a route.</strong> Opposite hues (168&deg; apart) go grey on a straight path, so use OKLCH and a middle stop; neighbours (55&deg; apart) blend fine. <strong>4. Add grain.</strong> On big dark gradients, a faint noise layer hides the banding. <strong>5. Calm behind text.</strong> Behind text, keep the stops close in lightness so every word stays readable: white text measures 1.2:1 on the pale end of a wide gradient and 8.2:1 on a calm, close-lightness one.</p>
## Do
- Keep lightness moving one direction only
- <code class="tok">linear-gradient(in oklch ...)</code> for any pair that is not neighbours
- A hand-picked middle stop on far-apart hues
- Stops close in lightness wherever text sits on top
## Avoid
- Body text on a gradient&rsquo;s mid-transition
- Default RGB mixing across opposite hues (the grey middle)
## Extra: variant-note
<div class="variant-note"><b>Neighbouring hues only versus opposite hues with a route, two variants.</b> Variant A: neighbouring hues only, as in the first paragraph. Use when: the CSS has to work without OKLCH support, or the palette is fixed to analogous colours. Variant B: opposite hues with a route (rules 1 to 3). Use when: the design needs two far-apart colours; interpolate in OKLCH and add a middle stop rather than avoiding the pair. Both kept on purpose.</div>
## Code: CSS
<pre><code><span class="cm">/* analogous hues (indigo → blue) blend clean; lightness moves one direction only */</span>
.gradient-clean { background: linear-gradient(135deg, #3B5BDB 0%, #3A7CA5 100%); }

<span class="cm">/* grain overlay hides banding on cheap/compressed screens */</span>
.gradient-clean::after {
  content: <span class="str">''</span>; position: absolute; inset: 0; opacity: .04; mix-blend-mode: overlay;
  background-image: url(<span class="str">"data:image/svg+xml,..."</span>); <span class="cm">/* fractal noise SVG */</span>
}
<span class="cm">/* text never sits on the unpredictable mid-transition, pin it to the darker anchor end */</span>
.gradient-clean .headline { color: white; text-shadow: 0 1px 3px rgb(0 0 0 / .3); }

<span class="cm">/* far-apart hues: interpolate in OKLCH (rule 1) and pick the middle yourself (rule 2) */</span>
.gradient-vivid { background: linear-gradient(in oklch 90deg, #3b5bdb, #22b573, #f5d90a); }
<span class="cm">/* behind text: stops close in lightness (rule 5) */</span>
.gradient-text-safe { background: linear-gradient(in oklch 135deg, #3b2fa0, #6a35b0); color: white; }</code></pre>
