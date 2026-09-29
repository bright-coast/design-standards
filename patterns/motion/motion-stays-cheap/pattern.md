---
id: motion-stays-cheap
title: Motion That Stays Cheap
category: motion
order: 5
---
## Rule
<p>Interface motion goes wrong in six ways, and the first three are already covered by Animation Timing and Easing Curves: a 600ms animation reads as broken, so keep interface motion in the 150 to 250ms band; linear easing looks mechanical, so use ease-out (fast off the mark, gentle at the end); and a spring on a dropdown is fun once and tiring by the tenth time, so save the bounce for a celebration. The other three are here. <strong>4. Origin.</strong> Set <code class="tok">transform-origin</code> so a menu grows out of the thing that opened it, instead of fading in from nowhere. <strong>5. Reduced motion.</strong> If the user turned the setting on, give them a fade and never a flight: an <code class="tok">@media (prefers-reduced-motion)</code> rule that swaps a 300px move for an opacity fade. <strong>6. The jank.</strong> Animating <code class="tok">width</code> forces a page relayout every frame, so animate <code class="tok">transform</code> and <code class="tok">opacity</code> and stay on the compositor. A width from 12% to 100% and <code class="tok">transform: scaleX()</code> from 0.12 to 1 look identical in a design file, but in a side-by-side test one can run at 60fps and the other at 12 (illustrative figures; real devices vary). Good motion is invisible until it is wrong.</p>
## Do
- <span><code class="tok">transform-origin</code> set to the trigger, so a menu grows out of the thing that opened it</span>
- <span>Animate <code class="tok">transform</code> and <code class="tok">opacity</code> only, never <code class="tok">width</code>, <code class="tok">height</code> or <code class="tok">left</code></span>
- <span><code class="tok">prefers-reduced-motion</code> swaps the movement for an opacity fade</span>
- Interface motion inside the 150 to 250ms band, ease-out, with the bounce kept for celebrations
## Avoid
- A 600ms animation
- <span>Animating <code class="tok">width</code> to draw a progress bar</span>
- A 300px fly-in for someone who asked for reduced motion
## Code: CSS
<pre><code><span class="cm">/* 4. origin: grow from the thing that opened it */</span>
.menu { transform-origin: top left; } <span class="cm">/* the trigger's corner, not the menu's own centre */</span>
@keyframes menu-in { from { opacity: 0; transform: scale(.95); } to { opacity: 1; transform: none; } }
.menu.open { animation: menu-in 200ms ease-out both; } <span class="cm">/* inside the 150 to 250ms band */</span>

<span class="cm">/* 5. reduced motion: a fade, never a flight */</span>
@keyframes fly-in  { from { transform: translateX(300px); } to { transform: none; } }
@keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
.panel { animation: fly-in 200ms ease-out both; }
@media (prefers-reduced-motion: reduce) {
  .panel { animation-name: fade-in; } <span class="cm">/* swap the 300px move for an opacity fade */</span>
}

<span class="cm">/* 6. the jank: animate transform and opacity, stay on the compositor */</span>
.bar { width: 100%; transform-origin: left; }
.bar.loading { animation: fill 1.2s ease-out both; }
@keyframes fill { from { transform: scaleX(.12); } to { transform: scaleX(1); } } <span class="cm">/* not width: 12% to 100%, which relayouts every frame */</span></code></pre>
