---
id: phone-375
title: Phone Check at 375px
category: visual
order: 29
---
## Rule
<p>A layout that fits the laptop breaks in five predictable spots on a 375px phone, and each has a one-line fix. <strong>Tables:</strong> six columns at 375px hide status and deadline behind a swipe, so under 640px each row becomes a card (ID, status chip, needed by, cost, approver). <strong>Big numbers:</strong> a 48px figure wraps in a narrow card and its plus sign lands alone on a line, so keep amounts on one line (nowrap, tabular digits) and cap the size at about 30px on a phone. <strong>Inputs:</strong> under 16px, iOS Safari zooms the page when the field is tapped, so inputs are 16px on phones, with the right keyboard per field (inputmode, autocomplete, enterkeyhint).</p>
<p><strong>Touch targets:</strong> thumbs miss 28px buttons, so touch screens get 44px targets, scoped to a coarse pointer so a mouse keeps the dense layout. <strong>Bottom bar:</strong> a fixed bottom bar slides under the home indicator and covers the last row, so pad it with the safe area inset and leave room under the content. Make it a habit to check every screen at 375px before calling a layout done.</p>
## Do
- Under 640px, table rows become cards
- Big figures on one line, capped at about 30px
- Inputs at 16px with the right keyboard
- 44px targets on a coarse pointer only
- Safe-area padding under a fixed bottom bar
## Avoid
- A six-column table squeezed into 375px
- 14px inputs that make iOS zoom
- A fixed bar covering the last row
## Extra: variant-note
<div class="variant-note"><b>Table-to-card breakpoint, two values.</b> This entry uses a 640px media query; the phone-table rules under Data Table (Interaction, entry 08) use a container query at about 700px. Both are demo numbers. Use the media query when the table spans the page; use the container query when the same table appears in panels of different widths.</div>
## Code: CSS + HTML
<pre><code>@media (max-width: 640px) { .table-wide { display: none; } .row-cards { display: grid; gap: 8px; } } <span class="cm">/* under 640px: cards */</span>
.kpi-value { white-space: nowrap; font-variant-numeric: tabular-nums; font-size: 30px; } <span class="cm">/* one line, capped */</span>
input, select, textarea { font-size: 16px; } <span class="cm">/* under 16px, iOS Safari zooms in */</span>
&lt;input inputmode="numeric" autocomplete="cc-number" enterkeyhint="next"&gt;
@media (pointer: coarse) { button, .tap { min-height: 44px; } } <span class="cm">/* touch only; a mouse stays dense */</span>
.bottom-bar { position: fixed; bottom: 0; padding-bottom: env(safe-area-inset-bottom); }
main { padding-bottom: calc(64px + env(safe-area-inset-bottom)); } <span class="cm">/* room below the last row */</span>
<span class="cm">&lt;!-- env() insets need &lt;meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"&gt; --&gt;</span></code></pre>
