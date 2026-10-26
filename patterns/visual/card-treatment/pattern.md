---
id: card-treatment
title: Card Treatment System
category: visual
order: 28
---
## Rule
<p>A card is a component with rules, not a box for everything. <strong>One card, one entity:</strong> one title, one subject, one place to go (a project, its client and progress, its page). A settings form wrapped in three cards is three cards and zero entities, so use sections with headings instead; a form section is not a card, and cards for everything is a machine-made tell. <strong>The background picks the treatment:</strong> on white, a border; on a tinted page, a shadow; inside a panel, flat. A shadow on white barely reads, a border on grey is noise, and a border plus a shadow on a tint is a double outline.</p>
<p><strong>One surface, one action:</strong> a clickable card is clickable everywhere, the whole surface opens it and hover lifts the whole thing; two buttons inside means it is a panel, not a card, and list rows move the other actions into a (...) menu. <strong>Never nest cards:</strong> a card inside a card is a box inside a box, so flatten the inner one and let dividers do the grouping (a 24px rhythm). <strong>One media ratio across the grid:</strong> every image cropped to the same ratio (16:9, for example), never stretched, because one tall image breaks the row. <strong>Dark mode kills shadows:</strong> borders come back one step lighter than the surface, and elevation becomes surface tint, with surface 0, 1 and 2 each a step lighter (Dark Mode, Visual entry 04).</p>
## Do
- One entity per card: title, subject, destination
- Border on white, shadow on tint, flat inside a panel
- The whole card is the one click target
- All card media at one cropped ratio
## Avoid
- A settings form split into cards
- A card nested inside a card
- Archive and Open buttons inside a clickable card
- Shadows as elevation in dark mode
## Code: CSS
<pre><code>.bg-white  .card { border: 1px solid var(--border); box-shadow: none; } <span class="cm">/* white: border */</span>
.bg-tinted .card { border: 0; box-shadow: 0 1px 2px rgb(0 0 0 / .06), 0 4px 12px rgb(0 0 0 / .06); } <span class="cm">/* tinted: shadow */</span>
.panel     .card { border: 0; box-shadow: none; } <span class="cm">/* panel: flat */</span>
.card { position: relative; } .card .stretched::after { content: <span class="str">""</span>; position: absolute; inset: 0; } <span class="cm">/* one surface, one action */</span>
.card img { aspect-ratio: 16 / 9; object-fit: cover; } <span class="cm">/* one ratio, cropped, never stretched */</span>
@media (prefers-color-scheme: dark) {
  .card { box-shadow: none; border: 1px solid var(--surface-2); background: var(--surface-1); } <span class="cm">/* elevation = tint */</span>
}</code></pre>
