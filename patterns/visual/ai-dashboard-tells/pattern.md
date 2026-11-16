---
id: ai-dashboard-tells
title: AI Dashboard Tells
category: visual
order: 21
---
## Rule
<p>Five small habits are what make a generated dashboard read as generated, and each has a one-line fix. <strong>The gradient</strong>, a decorative header gradient that encodes nothing, becomes one flat accent colour. <strong>The icon tiles</strong>, four stat tiles in four different accent colours purely for variety, become one shared tile colour, so the number itself is the thing that stands out, not the rainbow around it. <strong>The hierarchy</strong>, every stat rendered at the same size and weight, becomes one primary number and three visibly smaller secondary ones. <strong>The shadows</strong>, drop shadows on every card whether or not it's actually elevated, get reserved only for things that genuinely float above the page (a dropdown, a popover, a toast); flat surfaces get a hairline border instead. <strong>The copy</strong>, a generic personalised greeting ("Welcome back, Jordan") sitting next to a bare number, gets dropped in favour of giving the number itself a shape: a small inline trend line next to the figure reads as real product telemetry in a way a templated greeting never does.</p>
<p><strong>Detail on the fifth tell.</strong> The other half of that copy fix is the bare delta. A badge that says only &ldquo;+12.5% from last month&rdquo; gets the same treatment: name the period it compares against, set the digits in tabular figures (see Tabular Numbers), and replace the badge with a sparkline so the number has a shape.</p>
<p><strong>Three more tells.</strong> <strong>Filled status cards:</strong> a whole card or tile filled with green or red to show status. The fix is a neutral card with a small coloured dot and one word (Healthy, Failing). <strong>Filler charts:</strong> a chart on every card because there is room for one. Each card leads with its latest meaningful change and when (Deployed 4 minutes ago), and a chart appears only where it encodes a trend someone reads. <strong>Bare KPI values:</strong> in a KPI row, colour is spent only on the figure that is off track, so it stands out against neutral neighbours (the Von Restorff effect), and each figure is shown against its goal: the target, a bar showing progress toward it, and the deadline (340 of 500 signups, due 30 June).</p>
## Do
- One flat accent, not a decorative gradient
- One primary stat, three visibly smaller secondaries
- Shadow reserved for what actually floats (dropdown/popover/toast)
- Status as a dot plus one word on a neutral card
- KPI tiles show the target, progress toward it and the deadline; only the off-track figure gets colour
## Avoid
- Four different tile colours doing the job one number should do
- A whole card filled with a status colour
## Extra: caveat-box
<div class="caveat-box"><b>A baseline, not proof.</b> Well-made products also use shadows, coloured icons and gradients, so none of these tells proves a screen was generated. Treat the list as defaults to depart from deliberately: each one is fine when it was decided on purpose and encodes something.</div>
## Code: CSS
<pre><code><span class="cm">/* tell 01, flat accent, not a gradient with nothing to say */</span>
.card-header { background: var(--accent); } <span class="cm">/* not linear-gradient(...) */</span>

<span class="cm">/* tell 02, icon tiles share one colour; the number is the hero */</span>
.stat-icon  { background: var(--accent-tint); color: var(--accent); }
.stat-value { font-size: 28px; font-weight: 700; }

<span class="cm">/* tell 03, one primary stat, three secondary */</span>
.stat-primary   { font-size: 32px; font-weight: 700; }
.stat-secondary { font-size: 18px; font-weight: 500; color: var(--text-med); }

<span class="cm">/* tell 04, shadow only on what actually floats */</span>
.card, .stat-tile { box-shadow: none; border: 1px solid var(--border); }
.dropdown-menu, .popover, .toast { box-shadow: var(--shadow-elevated); }

<span class="cm">/* tell 05, drop the generic greeting, give the number a shape instead */</span>
<span class="cm">/* "Welcome back, Jordan" → a small inline sparkline next to the metric */</span>
<span class="cm">/* ...and a bare "+12.5% from last month" badge: name the period, tabular digits, sparkline instead of the badge */</span>
.delta { font-variant-numeric: tabular-nums; }</code></pre>
