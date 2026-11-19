---
id: less-noise
title: Less Noise on a Busy Screen
category: visual
order: 38
---
## Rule
<p>A busy screen gets calmer by taking things away, not by adding more styling. Four cuts. <strong>1. The background decides how much chrome you need:</strong> on grey, every block needs a card and a shadow to stand out; on white, space does that job, so only the main block (the balance, for example) keeps a light card and everything else sits on the page. <strong>2. No box inside a box:</strong> a frame inside a card adds one more edge and no new meaning; remove it and let the text sit under the main figure. <strong>3. Lines separate rows, nothing else:</strong> a section title does not need a line under it, and a row divider starts at the text, not under the icons, so the icons stay in one clean column. <strong>4. No carousel dots when the next card peeks:</strong> a card already showing its edge at the side says &ldquo;swipe&rdquo;, so dots under it say it twice.</p>
<p>This works with <a href="#lp-card-treatment">Card Treatment System</a> (entry 28), which picks a card&rsquo;s border or shadow from its background and never nests cards.</p>
## Do
- A white page where space does the grouping
- One light card, on the main block only
- Supporting text straight under the main figure, no inner frame
- Row dividers that start at the text column
- The next card peeking out instead of dots
## Avoid
- A grey page with a card and a shadow on every block
- A framed box inside a card
- A line under a section title
- Full-width dividers that run under the icons
- Carousel dots under a card that already peeks
## Code: CSS
<pre><code>.screen { background: var(--surface); } <span class="cm">/* white: space groups the blocks, not cards */</span>
.balance { background: var(--surface-2); border-radius: 16px; padding: 20px; } <span class="cm">/* the one light card */</span>
.balance .sub { margin-top: 4px; color: var(--ink-muted); } <span class="cm">/* no inner frame: the text sits under the figure */</span>
.section-title { border: 0; margin: 24px 0 8px; } <span class="cm">/* a title needs no line */</span>
.row { display: grid; grid-template-columns: 40px 1fr; }
.row + .row .row-text { border-top: 1px solid var(--border); } <span class="cm">/* the divider starts at the text; icons stay one column */</span>
.carousel { display: flex; gap: 12px; overflow-x: auto; scroll-snap-type: x mandatory; }
.carousel > * { flex: 0 0 85%; scroll-snap-align: start; } <span class="cm">/* the next card peeks, so no dots */</span></code></pre>
