---
id: slop-dashboard
title: Dashboard Tells
category: ai-slop
order: 1
---
## Rule
<p><strong>Don&rsquo;t.</strong> Ship the five defaults nobody chose: a gradient header that encodes nothing, four accent colours on four stat tiles, every stat at the same size and weight, a shadow on every card, and a templated greeting next to a bare number.</p>
<p><strong>Why it reads as machine-made.</strong> Each one is decoration or a default standing in for a decision. They are the five small habits that make a generated dashboard read as generated.</p>
<p><strong>Fix.</strong> One line per tell in the list below. The full write-up, the demo and the CSS live in AI Dashboard Tells (Visual, entry 21), which stays where it is; this entry only points to it.</p>
## Avoid
- <span>A decorative gradient header. Fix: one flat accent colour.</span>
- <span>Four stat tiles in four colours. Fix: one shared tile colour, so the number is the hero.</span>
- <span>Every stat at the same size and weight. Fix: one primary number and three visibly smaller secondaries.</span>
- <span>A drop shadow on every card. Fix: shadow only on what floats (dropdown, popover, toast), a hairline border on the rest.</span>
- <span>&ldquo;Welcome back, Jordan&rdquo; beside a bare &ldquo;+12.5% from last month&rdquo;. Fix: name the period, use tabular digits, and give the number a shape with a sparkline.</span>
## Code: TEXT
<pre><code><span class="cm">review pass, dashboard (details and CSS: Visual, entry 21)</span>
[ ] gradient header that encodes nothing         -&gt; one flat accent
[ ] four accent colours on four stat tiles       -&gt; one shared tile colour
[ ] every stat the same size and weight          -&gt; one primary, three secondary
[ ] a shadow on every card                       -&gt; shadow only on what floats
[ ] "Welcome back, Jordan" and a bare delta      -&gt; name the period, tabular digits, a sparkline</code></pre>
