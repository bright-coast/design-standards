---
id: grid-system
title: Grid System
category: visual
order: 11
---
## Rule
<p>A 12-column grid maps almost any layout because 12 divides cleanly into halves, thirds, and quarters, giving enough flexibility without infinite arbitrary choices. Gutter width sets the emotional register of a layout: tight gutters read technical and dense, wide gutters read editorial and calm. Collapse the column count at each breakpoint (12 on desktop down to 6, then 4, then a single column on mobile) rather than shrinking 12 narrow columns onto a phone screen. Only break the grid deliberately once it&rsquo;s clearly established as the norm; an occasional full-bleed image is a strong device precisely because everything else respects the grid.</p>
<p>A layout also has to hold still when a scrollbar appears. When content grows past its container, a classic scrollbar takes a few pixels of width and the content nudges sideways. Put <code class="tok">scrollbar-gutter: stable</code> on the scrolling element and the scrollbar&rsquo;s space is reserved from the start, so nothing shifts when it appears. For a centred layout use <code class="tok">scrollbar-gutter: stable both-edges</code>, which reserves the gutter on both sides so the content stays symmetrical. The caveat is that the gutter is a placeholder: with plain <code class="tok">stable</code> the left and right spacing can look unequal, which is what <code class="tok">both-edges</code> addresses. It matters mainly with classic, always-visible scrollbars (Windows and Linux); on macOS with overlay scrollbars there is nothing to reserve, and the reserved space is visible as an empty strip when there is no scrollbar. It is supported in current Chrome, Edge and Firefox, with Safari support arriving in recent versions, so check the current support table before relying on it in a Safari-first product.</p>
## Do
- Collapse columns per breakpoint (12&rarr;6&rarr;4&rarr;1)
- <span><code class="tok">scrollbar-gutter: stable</code> on any scrolling element, so nothing shifts when a scrollbar appears</span>
- <span><code class="tok">scrollbar-gutter: stable both-edges</code> when the layout is centred</span>
## Avoid
- Breaking the grid before establishing it
- A scrolling panel with no reserved gutter, so its content nudges sideways the moment a scrollbar appears
## Code: CSS
<pre><code>.grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 24px; <span class="cm">/* editorial = wide gutter; drop to 12-16px for a dense/technical feel */</span>
}
.col-span-8 { grid-column: span 8; }
.col-span-4 { grid-column: span 4; }

@media (max-width: 1024px) { .grid { grid-template-columns: repeat(6, 1fr); } }
@media (max-width: 768px)  { .grid { grid-template-columns: repeat(4, 1fr); } }
@media (max-width: 480px)  { .grid { grid-template-columns: 1fr; } } <span class="cm">/* single column, not shrunk 12-col */</span>

.full-bleed { grid-column: 1 / -1; } <span class="cm">/* deliberate break, reads as a device because the grid is otherwise respected */</span>

<span class="cm">/* scrolling element: reserve the scrollbar's space from the start, so nothing shifts when it appears */</span>
.scroll-container {
  overflow-y: auto;
  scrollbar-gutter: stable;
}

<span class="cm">/* second version, for centred layouts: gutter reserved on both sides, content stays symmetrical */</span>
.scroll-container {
  overflow-y: auto;
  scrollbar-gutter: stable both-edges;
}</code></pre>
