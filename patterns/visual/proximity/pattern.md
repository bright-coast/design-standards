---
id: proximity
title: Proximity Rule
category: visual
order: 14
---
## Rule
<p>Spacing alone is enough to group a UI without a single border or background colour. The trick is simply making the gap within a related group of elements noticeably smaller than the gap between separate groups. A label sitting 4px above its input and 24px above the next field group reads as belonging to that field, unambiguously, purely from the numbers. Equal spacing applied everywhere erases this signal entirely and forces someone to read labels carefully to figure out which field a stray line of helper text actually belongs to. Reach for the grouping signals in order: proximity first, since it&rsquo;s free and the strongest of the three; similarity second, matching colour/shape/size to imply the same category; a visible divider only once proximity and similarity together still aren&rsquo;t enough. A divider every 2-3 items is over-using the last resort, and nested cards inside cards is the sign to stop and regroup with spacing instead.</p>
## Do
- Tight related fields, wider section breaks
- Proximity, then similarity, then a divider, in that order
## Avoid
- Equal spacing everywhere, erasing hierarchy
- Cards nested inside cards instead of just regrouping with space
## Code: CSS
<pre><code>.form-section { display: flex; flex-direction: column; gap: 24px; } <span class="cm">/* between groups: wide */</span>
.field-group { display: flex; flex-direction: column; gap: 4px; }    <span class="cm">/* within a group: tight */</span>
.field-group label { font-size: 13px; }
.field-group .helper-text { font-size: 12px; color: var(--text-muted); margin-top: 2px; } <span class="cm">/* tightest, clearly this field's */</span></code></pre>
