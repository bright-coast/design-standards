---
id: pricing-table
title: Pricing Table
category: visual
order: 27
---
## Rule
<p>A pricing table sells by ending the comparison. <strong>Hierarchy:</strong> one loud number per column, the price at about 52px weight 800, the plan name dropped to 14px capitals and the details dimmed, so it reads price, plan, details; with every line at 18px the eye has nowhere to land. <strong>Spacing:</strong> more space between plans than inside them (cards 20px apart, 24px padding, 14px rows, features as checks on one scan line); a single grid with 4px rows reads as a wall of text.</p>
<p><strong>One highlighted tier:</strong> three equal cards are no recommendation, so one plan lifts and two step back. The pick gets the only badge (Most popular; no runner-up badges, since a badge on every card is a badge on none, and silence is what makes the label work), a 2px accent border, and the only filled button; the others get outlined buttons whose labels name the plan or the action (Start with Team, Choose Starter, Talk to sales). <strong>Depth:</strong> raise the choice, not everything, the pick raised about 16px on a soft downward shadow (y 24, blur 48) with a 1px lit top edge and an 18px radius.</p>
<p><strong>Features:</strong> list what changes, not what repeats; the first tier lists its few features (12 lines cut to 4) and each higher tier opens with Everything in Starter, plus, then three lines, because twelve identical checks per card are a wall, not a comparison. <strong>Anchor:</strong> a billing toggle that defaults to yearly, with the old price struck through next to the new one ($30 struck under $24 a month), so the saving needs no maths. <strong>Motion:</strong> hover lifts a plan 4px in 150ms, the toggle rolls the prices in 300ms, and the trial button&rsquo;s spinner becomes a check: feedback in 100ms, done in 300.</p>
## Do
- One loud price per column
- One recommended plan, one badge, one filled button
- Higher tiers list only what they add
- Old price struck through beside the new one
## Avoid
- Three identical cards with a badge on each
- Twelve repeated checks on every tier
- A gradient button on every plan
## Extra: variant-note
<div class="variant-note"><b>How to show the saving, two variants.</b> Variant A: a percent chip on the yearly toggle (-20%). Use when: prices are under about $100, where a percent reads as the bigger number (Jonah Berger&rsquo;s Rule of 100). Variant B: write the saving in money (Save $98 / year: $49 x 12 = $588 against $490 billed annually). Use when: the price or the yearly saving is over about $100, where dollars read bigger. Note that 40% off may still beat save $50, which is the same Rule of 100 split. Both kept on purpose; either way, keep the struck-through old price beside the new one.</div>
## Extra: caveat-box
<div class="caveat-box"><b>An alternative framing worth testing.</b> Some teams prefer good, better, best tiers that emphasise what each tier gains more than what it costs. Not tested here; note it as an option, not a rule.</div>
## Code: CSS
<pre><code>.plans { display: grid; grid-template-columns: repeat(3, 1fr); gap: <span class="num">20px</span>; } <span class="cm">/* more space between plans */</span>
.plan { padding: <span class="num">24px</span>; display: grid; gap: <span class="num">14px</span>; border: 1px solid var(--border); border-radius: <span class="num">18px</span>; } <span class="cm">/* than inside them */</span>
.plan .price { font-size: <span class="num">52px</span>; font-weight: <span class="num">800</span>; font-variant-numeric: tabular-nums; } <span class="cm">/* one loud number */</span>
.plan .name { font-size: <span class="num">14px</span>; text-transform: uppercase; color: var(--ink-2); }
.plan.pick { border: 2px solid var(--accent); transform: translateY(-16px);
  box-shadow: inset 0 1px 0 rgb(255 255 255 / .1), 0 24px 48px rgb(0 0 0 / .18); } <span class="cm">/* raise the choice only */</span>
.plan .btn { border: 1px solid var(--border); background: none; }  <span class="cm">/* outlined */</span>
.plan.pick .btn { background: var(--accent); color: #fff; }       <span class="cm">/* the only filled button */</span>
.plan { transition: transform 150ms ease-out; } .plan:hover { translate: 0 -4px; }</code></pre>
