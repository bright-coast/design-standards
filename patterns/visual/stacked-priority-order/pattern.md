---
id: stacked-priority-order
title: Stacked Priority Order
category: visual
order: 33
---
## Rule
<p>When a layout collapses to one column, the order it stacks in is a decision, not whatever the source happens to say. The summary comes first, so the person knows where they stand. Whatever needs action comes right after it: the overdue invoice, the approval waiting, the form to finish. Supporting panels (history, tips, related items, charts) move below. On a desktop a side panel can sit beside the main content, but on a phone it never pushes the thing that needs doing below the fold.</p>
<p>Write the DOM in priority order and let the wide layout place things with grid areas, rather than writing the DOM in desktop order and fixing the phone with the CSS <code class="tok">order</code> property. The keyboard and screen readers follow the DOM, not the visual order, so a CSS reorder leaves them reaching the supporting panel before the action (<a href="#lp-focus-states">Focus States</a>, Navigation entry 01).</p>
## Do
- Summary first, then what needs action, then supporting panels
- The DOM written in priority order, with grid areas placing it on wide screens
## Avoid
- A panel of tips stacked above the item that needs action
- <span>The CSS <code class="tok">order</code> property used to fix the phone stacking</span>
## Code: CSS
<pre><code><span class="cm">/* DOM order is priority order: summary, action, support */</span>
.page { display: grid; gap: 16px; grid-template-areas: "summary" "action" "support"; }
.summary { grid-area: summary; } .action { grid-area: action; } .support { grid-area: support; }
@media (min-width: 900px) {
  .page { grid-template-columns: minmax(0, 2fr) minmax(0, 1fr);
          grid-template-areas: "summary support" "action support"; } <span class="cm">/* support beside, never above */</span>
}</code></pre>
