---
id: css-layout-foundations
title: CSS Layout Foundations
category: visual
order: 35
---
## Rule
<p>Four habits keep layout CSS short and predictable. <strong>Percentage heights need a parent height:</strong> <code class="tok">height: 100%</code> only works when the parent has an explicit height; inside a parent sized by its content it does nothing. Instead of chaining it through every wrapper, let a flex or grid parent stretch its children (both stretch by default), or use <code class="tok">min-height</code> so the box can still grow.</p>
<p><strong>Space siblings with gap:</strong> <code class="tok">gap</code> on the flex or grid parent, not a margin on every child. Gap only appears between items, so nothing needs cancelling on the last one. <strong>Centre with alignment:</strong> a grid parent with <code class="tok">place-items: center</code>. Absolute positioning plus <code class="tok">translate(-50%, -50%)</code> takes the element out of the flow and can land on half pixels; keep it for overlays that genuinely float. <strong>Control specificity with cascade layers:</strong> declare <code class="tok">@layer reset, base, components, utilities;</code> once, and a later layer wins whatever the selectors, so nobody escalates to chained classes, IDs or <code class="tok">!important</code>.</p>
## Do
- <code class="tok">gap</code> on the parent; <code class="tok">place-items: center</code> to centre
- One <code class="tok">@layer</code> order at the top of the stylesheet
## Avoid
- <code class="tok">height: 100%</code> inside a parent with no set height
- Longer selectors or <code class="tok">!important</code> to win a specificity fight
## Code: CSS
<pre><code>.cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; } <span class="cm">/* children stretch; gap, not margins */</span>
.empty-state { display: grid; place-items: center; min-height: 240px; }
@layer reset, base, components, utilities;
@layer utilities { .mt-0 { margin-top: 0; } } <span class="cm">/* beats any components selector */</span></code></pre>
