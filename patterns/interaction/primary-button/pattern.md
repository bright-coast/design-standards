---
id: primary-button
title: Primary Button Anatomy
category: interaction
order: 30
---
## Rule
<p>Six decisions make a primary button read as the main action, and none of them is the colour. <strong>Size:</strong> 48px tall (never under 44px; a 40px button is a target the thumb misses) with 24px of side padding. <strong>Label:</strong> 17px, weight 600, sentence case with no shouting capitals, and a verb plus an object that says exactly what the tap will do: Add to cart, never OK, Submit or Click here. <strong>Contrast:</strong> the label at 4.5:1 or better and the button&rsquo;s edge at 3:1 or better against the page (7:1 is the AAA text level); a flat grey fill at 1.6:1 has no edge and disappears, so a 1px rim at about 4:1 and a white label at about 14:1 fix it.</p>
<p><strong>Depth:</strong> light comes from above, so a lit top edge (1px of white at 16%) and a shadow that falls down (y 8, blur 24); a recessed 6px track and a rim light in the one accent are optional extras (see the caveat). <strong>Detail:</strong> one icon only, 20px, sitting 10px from the label, and for a pill the radius is height / 2 (24 on a 48px button). <strong>Motion:</strong> hover answers in 200ms, a press sinks the button 1px in 120ms, and a slow action shows a spinner that becomes a check (Added), easing out over about 200ms: feedback in 100ms, done in 300.</p>
## Do
- 48px tall, 24px side padding
- A verb plus an object, 17px semibold, sentence case
- Label at 4.5:1, edge at 3:1 against the page
- A spinner that becomes a check on a slow action
## Avoid
- OK, Submit or Click here as the label
- A flat grey fill with no visible edge
- Two icons on one button
## Extra: caveat-box
<div class="caveat-box"><b>The finish draws real pushback.</b> A glossy treatment (recessed track, rim light) is often read as dated, or as the way machine-generated buttons look. Treat size, label, contrast and motion as the rules and the depth finish as an optional style, checked against AI Slop: What Not To Do before use. Keyboard focus needs its own visible state too (Focus States, Navigation entry 01).</div>
## Extra: variant-note
<div class="variant-note"><b>Corner shape, two variants.</b> Variant A: a pill, radius = height / 2. Use when: the product&rsquo;s shapes and type are round and friendly and the button stands on its own. Variant B: a small-radius rectangle from the system radius scale. Use when: the product is dense or technical, or the button sits beside inputs and cards that share that small radius. Both kept on purpose.</div>
## Extra: variant-note
<div class="variant-note"><b>Visible size versus hit area, two variants.</b> Variant A: the visible button is 48px tall. Use when: it is the primary action on a touch screen. Variant B: the visible button may be smaller as long as its hit area and clearance reach 44px (consistent with Click Target Sizing, Interaction entry 25). Use when: secondary or dense controls.</div>
## Code: CSS
<pre><code>.btn-primary {
  min-height: <span class="num">48px</span>; padding: <span class="num">0 24px</span>;      <span class="cm">/* never under 44px tall */</span>
  border-radius: <span class="num">24px</span>;                <span class="cm">/* height / 2 for a pill; variant B: var(--radius-sm) */</span>
  font-size: <span class="num">17px</span>; font-weight: <span class="num">600</span>;  <span class="cm">/* sentence case, verb + object */</span>
  display: inline-flex; align-items: center; gap: <span class="num">10px</span>; <span class="cm">/* one 20px icon, 10px from the label */</span>
  box-shadow: inset 0 1px 0 rgb(255 255 255 / .16), <span class="cm">/* lit top edge */</span>
              0 0 0 1px var(--btn-edge),            <span class="cm">/* edge at 3:1 or better against the page */</span>
              0 8px 24px rgb(0 0 0 / .22);          <span class="cm">/* shadow falls down */</span>
  transition: box-shadow 200ms ease-out, transform 120ms ease-out;
}
.btn-primary:active { transform: translateY(1px); }  <span class="cm">/* press sinks 1px */</span>
.btn-primary:focus-visible { outline: 2px solid var(--focus); outline-offset: 2px; }</code></pre>
