---
id: action-priority
title: Action Priority
category: interaction
order: 26
---
## Rule
<p>A screen earns clarity by admitting it only has one truly primary action, rarely two, and letting everything else sit visibly lower. Primary gets the solid, filled treatment in the brand or accent colour at the largest size on the screen, usually top right or leading the main column, and there is only one of it. Secondary covers two to three actions at most, outlined or ghost styled, neutral in colour, sized the same as the primary or a touch smaller. Tertiary is everything else: unlimited in count, living as a text link, an icon button, or folded into an overflow menu instead of competing on the main surface. A screen with more than two solid, equally weighted buttons hasn't been prioritised, it's just been listed. A destructive action never wears the primary style, no matter how important deleting something feels in the moment.</p>
## Do
- One true primary action per screen, at most two
- Secondary actions capped at 2-3, visibly quieter than primary
## Avoid
- Three or more solid, equally weighted buttons competing for the same click
- A destructive action styled as the primary button
## Code: CSS
<pre><code>.action-primary   { background: var(--accent); color: #fff; } <span class="cm">/* 1 per screen, rarely 2 */</span>
.action-secondary { background: transparent; border: 1px solid var(--border); } <span class="cm">/* 2-3 max */</span>
.action-tertiary  { background: none; border: none; color: var(--text-muted); text-decoration: underline; } <span class="cm">/* unlimited, or fold into overflow */</span>

<span class="cm">/* refuse at review time: more than one .action-primary in the same view,</span>
<span class="cm">   or a destructive control wearing .action-primary */</span></code></pre>
