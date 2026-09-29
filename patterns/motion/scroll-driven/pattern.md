---
id: scroll-driven
title: Scroll-Driven Animations
category: motion
order: 4
---
## Rule
<p>Native CSS <code class="tok">animation-timeline: scroll()</code> turns the scrollbar itself into an animation controller with zero JavaScript and zero scroll-listener jank. The browser drives the animation progress directly from scroll position on its own compositor thread. The related <code class="tok">view()</code> timeline animates an element specifically as it enters and exits the viewport, ideal for scroll-triggered reveals. Pair either with <code class="tok">position: sticky</code> for effects like a header that shrinks as it pins to the top. A hand-rolled scroll-listener re-implementation of this is strictly worse: it runs on the main thread and is the classic source of janky parallax.</p>
## Do
- <code class="tok">view()</code> to animate elements as they enter
## Avoid
- Hand-rolled scroll-listener parallax
## Code: CSS
<pre><code>@keyframes fade-in-up { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: none; } }

.reveal-on-scroll {
  animation: fade-in-up linear both;
  animation-timeline: view(); <span class="cm">/* progress driven by the element entering the viewport */</span>
  animation-range: entry 0% cover 30%; <span class="cm">/* fully in by 30% scrolled into view */</span>
}

.shrinking-header {
  position: sticky; top: 0;
  animation: shrink-header linear both;
  animation-timeline: scroll(); <span class="cm">/* driven by the page's own scroll position, zero JS */</span>
}
@keyframes shrink-header { to { padding-block: 8px; font-size: 14px; } }
<span class="cm">/* @supports fallback: browsers without support just render the resting (non-shrunk) state */</span></code></pre>
