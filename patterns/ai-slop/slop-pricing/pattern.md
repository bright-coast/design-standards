---
id: slop-pricing
title: Pricing Page Tells
category: ai-slop
order: 7
---
## Rule
<p><strong>Don&rsquo;t.</strong> Ship three identical tier cards, a Popular badge on every one, twelve repeated check marks per card, a gradient button on each plan, and a percent-off chip as the only statement of the saving.</p>
<p><strong>Why it reads as machine-made.</strong> Each one is the default of a generator that was never asked to recommend anything: three equal cards are no recommendation, and a badge on every card is a badge on none.</p>
<p><strong>Fix.</strong> One line per tell in the list below. The full write-up, with the numbers and the percent versus dollars variants, lives in <a href="#lp-pricing-table">Pricing Table</a> (Visual, entry 27); this entry only points to it.</p>
## Avoid
- <span>Three identical tiers. Fix: one tier highlighted, two quiet.</span>
- <span>A badge on every card. Fix: one badge, no runner-up badges.</span>
- <span>Twelve repeated checks per tier. Fix: list the difference (Everything in Starter, plus).</span>
- <span>A gradient button on every plan. Fix: one filled button, the rest outlined, labels naming the plan or action.</span>
- <span>A bare -17% chip. Fix: show the saving in the unit that reads bigger (percent under about $100, dollars over), with the old price struck through.</span>
## Code: TEXT
<pre><code><span class="cm">review pass, pricing page (details and CSS: Visual, entry 27)</span>
[ ] three identical tier cards                 -&gt; one highlighted, two quiet
[ ] a badge on every card                      -&gt; one badge, no runner-up
[ ] twelve repeated checks per tier            -&gt; list the difference
[ ] a gradient button on every plan            -&gt; one filled, the rest outlined
[ ] a bare percent chip                        -&gt; the unit that reads bigger, old price struck</code></pre>
