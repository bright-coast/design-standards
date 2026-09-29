---
id: click-target-sizing
title: Click Target Sizing
category: interaction
order: 25
---
## Rule
<p>Touch and accessibility both want generous room to land a tap, and the numbers are specific rather than a vague instruction to &ldquo;make it bigger&rdquo;. A button clears 44 by 44 pixels end to end, the iOS and WCAG AAA floor, even when the visual icon sitting inside it is smaller; the touch zone is what counts, not the glyph. A form field's tap target holds at least 48 pixels of height. Two adjacent buttons keep at least 8 pixels of gap between their edges, tight enough to read as a group, wide enough that a thumb doesn't land on the wrong one. A text link inside a paragraph can size naturally with the surrounding copy, but stays visually isolated from any other link sitting right next to it. Anywhere a control's visual size falls under 44 by 44, pad the invisible touch zone out to that floor instead of shrinking the rule to fit the design.</p>
## Do
- 44&times;44px minimum touch zone on every button and icon button, icon size aside
- 48px minimum height on a form field's tap target
## Avoid
- Two adjacent buttons with less than 8px between their edges
## Extra: variant-note
<div class="variant-note"><b>Variant B: a 44 by 44px minimum touch zone (48px height for a form field).</b> Use when: the surface is touch-first, client-facing, or has to meet the iOS and WCAG AAA floor. The same 44px is repeated in Hover Trap. Variant A: tap targets of at least 36 to 40px. Use when: you are matching an existing dense product whose compact rows already ship 36px row actions. Both are kept on purpose.</div>
## Code: CSS
<pre><code>.icon-btn {
  width: 44px; height: 44px; <span class="cm">/* touch zone, independent of the icon's own size */</span>
  display: flex; align-items: center; justify-content: center;
}
.icon-btn svg { width: 18px; height: 18px; } <span class="cm">/* the icon can stay small; the target can't */</span>

.field input, .field select { min-height: 48px; }
.btn-row { display: flex; gap: 8px; } <span class="cm">/* 8px floor between adjacent targets */</span></code></pre>
