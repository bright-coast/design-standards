---
id: z-index
title: Z-Index Mastery
category: visual
order: 18
---
## Rule
<p><code class="tok">z-index</code> does absolutely nothing on an element with the default <code class="tok">position: static</code>; it only takes effect once an element is positioned. A child element can also never out-rank its own parent&rsquo;s stacking context from outside; if the parent sits at a lower z-index than a sibling, no z-index value on the child, however large, can escape above that sibling. Use <code class="tok">isolation: isolate</code> to deliberately contain a component&rsquo;s whole stacking context so its internal z-index values can&rsquo;t leak out and collide with the rest of the page, and reach for the DevTools Layers panel to see the real stacking order instead of guessing and escalating to <code class="tok">z-index: 9999</code>.</p>
## Do
- <code class="tok">isolation: isolate</code> to contain a component
## Avoid
- Escalating to <code class="tok">z-index: 9999</code> as the fix
## Code: CSS
<pre><code>:root {
  --z-dropdown: 100; --z-sticky-header: 200; --z-modal: 300; --z-toast: 400;
} <span class="cm">/* one shared scale, never invent a one-off 9999 to "fix" a stacking bug */</span></code></pre>
<pre style="margin-top:6px;"><code>.dropdown-menu { position: relative; z-index: var(--z-dropdown); } <span class="cm">/* z-index needs position to do anything */</span>

.widget { isolation: isolate; } <span class="cm">/* contains this component's internal z-index values */</span>
.widget .internal-overlay { z-index: 5; } <span class="cm">/* can never leak above a sibling outside .widget */</span></code></pre>
