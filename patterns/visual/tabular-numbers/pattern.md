---
id: tabular-numbers
title: Tabular Numbers
category: visual
order: 19
---
## Rule
<p>Default proportional fonts give each digit a different width (a &ldquo;1&rdquo; is narrower than an &ldquo;8&rdquo;), so a stacked column of numbers or decimals never quite lines up. The decimal points drift left and right down the column even though every value is correctly formatted. One line of CSS fixes it: <code class="tok">font-variant-numeric: tabular-nums;</code> forces every digit glyph to occupy the same fixed width, so a column of prices, stats, or table cells locks into a straight line without any manual padding or a monospace font swap. Apply it anywhere numbers stack vertically (pricing tables, dashboards, stat tiles), not globally on body text, since tabular spacing looks slightly loose in running prose.</p>
## Do
- <code class="tok">tabular-nums</code> on any stacked numeric column
## Avoid
- Manual padding or a monospace font swap to fake alignment
## Extra: caveat-box
<div class="caveat-box"><b>Timers too.</b> A number that changes in place, such as a countdown or a running timer, needs tabular figures as well, so the digits do not shift sideways as they tick.</div>
## Code: CSS
<pre><code>.stat-value, .price-cell, .table-cell-numeric {
  font-variant-numeric: tabular-nums;
} <span class="cm">/* every digit glyph becomes the same fixed width */</span>

<span class="cm">/* don't apply globally, running prose reads slightly loose with tabular spacing */</span>
body { font-variant-numeric: normal; }</code></pre>
