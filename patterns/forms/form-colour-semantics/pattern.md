---
id: form-colour-semantics
title: Form Colour Semantics
category: forms
order: 17
---
## Rule
<p>In a settings-style form, give every colour exactly one job and the form explains itself. Labels are the primary text colour (black on light). Values and placeholders the person types are secondary grey and right aligned: grey means you type here. The tint colour (blue on iOS) means you can tap this, so date chips and pickers sit in the tint colour on a lightly tinted pill. A toggle&rsquo;s on state uses the tint colour too, because active should look active; an orange or grey toggle leaves people unsure whether it is on or off.</p>
<p>Then group by task: the title and location together, every timing control together (all-day, starts, ends, alert), links and notes together, three grouped sections (Form Field Grouping, Forms entry 14). The failure this fixes is a form where every row is the same grey pill, so nobody can tell what is tappable, where the input goes, or which text is a label, and every row costs a small pause. Same content, but clear, logical and systematic.</p>
## Do
- Black = label, grey = typed value, tint colour = tappable
- Toggle on state in the tint colour
- All timing controls in one group
## Avoid
- Every row the same grey pill
- A toggle colour that does not read as on or off
- Tint colour on text that does nothing
## Code: CSS
<pre><code>.row-label { color: var(--ink); }  <span class="cm">/* black = a label */</span>
.row-value, .row input::placeholder { color: var(--ink-2); text-align: right; }  <span class="cm">/* grey = you type here */</span>
.row-chip { color: var(--tint); background: color-mix(in srgb, var(--tint) 12%, transparent); } <span class="cm">/* tint = you can tap this */</span>
.switch[aria-checked=<span class="str">"true"</span>] { background: var(--tint); }  <span class="cm">/* active looks active */</span></code></pre>
