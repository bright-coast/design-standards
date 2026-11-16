---
id: css-native-before-js
title: CSS Before JavaScript
category: interaction
order: 39
---
## Rule
<p>Several interactions that used to need a script are now one line of CSS, and the CSS version is faster, works before the script loads, and keeps the browser&rsquo;s own accessibility behaviour. Reach for these four first.</p>
<p><strong>Smooth scrolling.</strong> <code class="tok">scroll-behavior: smooth</code> on the scrolling element makes anchor links and focus jumps glide without a scroll library. Turn it off under <code class="tok">prefers-reduced-motion: reduce</code>, where a long animated scroll is exactly what the person asked not to get.</p>
<p><strong>Truncation.</strong> Cut long text with <code class="tok">text-overflow: ellipsis</code> for a single line, or <code class="tok">line-clamp</code> for two or three lines, instead of trimming strings in code. The full text stays in the page, so search, copy and screen readers still get all of it, and the cut point follows the real width at every screen size. Keep the full text reachable: a tooltip, an expand control or the detail page.</p>
<p><strong>Carousels and paged scrolling.</strong> <code class="tok">scroll-snap-type</code> on the container and <code class="tok">scroll-snap-align</code> on each item give a carousel that settles cleanly on each card, with native touch momentum and keyboard scrolling, and no carousel script.</p>
<p><strong>Native form controls.</strong> <code class="tok">accent-color</code> themes checkboxes, radios, range sliders and progress bars in the project&rsquo;s accent, so they match the design without being rebuilt from divs. A rebuilt control has to recreate focus, keyboard and screen reader behaviour by hand, and usually misses some of it.</p>
## Do
- Smooth scrolling in CSS, switched off under reduced motion
- Ellipsis or line clamp for long text, with the full text still reachable
- Scroll snap for carousels and paged lists
- <code class="tok">accent-color</code> on native checkboxes, radios and sliders
## Avoid
- A scroll library for smooth anchor scrolling
- Cutting strings in code to fit a width
- Rebuilding a checkbox from divs only to change its colour
## Code: CSS
<pre><code>html { scroll-behavior: smooth; }
@media (prefers-reduced-motion: reduce) { html { scroll-behavior: auto; } }

.one-line { overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }
.three-lines { display: -webkit-box; -webkit-box-orient: vertical;
  -webkit-line-clamp: <span class="num">3</span>; line-clamp: <span class="num">3</span>; overflow: hidden; }

.carousel { display: flex; overflow-x: auto; scroll-snap-type: x mandatory; }
.carousel > * { flex: <span class="num">0 0 80%</span>; scroll-snap-align: start; }

:root { accent-color: var(--accent); }</code></pre>
