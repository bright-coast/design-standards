---
id: 60-30-10
title: 60-30-10 Colour Balance
category: visual
order: 30
---
## Rule
<p>A simple starting ratio for colour balance. <strong>60% neutral (base):</strong> backgrounds, surfaces, containers and large areas, such as white, light grey or off-white (for example #F7F7F5). <strong>30% secondary (support):</strong> UI elements, icons, borders and secondary content, in grey, muted tones or soft colours (#A3A3A3). <strong>10% accent (highlight):</strong> calls to action, important actions, links and key elements, in the brand colour (a near-black such as #0F0F0F also works, where the accent is contrast rather than hue). Kept to that balance, an interface reads clean, professional and easy to navigate without being boring.</p>
<p>Two cautions. The ratio comes from interior design and is a heuristic, not a measurement anyone checks. And the 30% support grey is for borders, icons and large secondary shapes, not body text: #A3A3A3 on #F7F7F5 is only about 2.4:1, under the 4.5:1 text minimum (Color Accessibility, Visual entry 03).</p>
## Do
- Large areas neutral, accent kept for actions
- One accent colour, used sparingly
- Support grey for borders and icons
## Avoid
- Accent colour spread across large surfaces with no reason
- The light support grey used for body text
## Extra: variant-note
<div class="variant-note"><b>Strict ratio versus a dark hero surface, two variants.</b> Variant A: strict 60-30-10, the accent only on actions and key elements. Use when: list, form and settings screens where the actions should be the only loud thing. Variant B: one dark hero surface well past 10% (for example a finance screen that puts the balance on a large black card, which strictly breaks the rule). Use when: one object is the subject of the screen, such as an account balance or a featured item, and everything else stays neutral. Both kept on purpose.</div>
## Code: CSS
<pre><code>:root {
  --base:    #F7F7F5; <span class="cm">/* 60%: backgrounds, surfaces, containers, large areas */</span>
  --support: #A3A3A3; <span class="cm">/* 30%: UI elements, icons, borders, secondary shapes (not body text, about 2.4:1) */</span>
  --accent:  #0F0F0F; <span class="cm">/* 10%: calls to action, important actions, links, key elements */</span>
}</code></pre>
