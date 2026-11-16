---
id: pull-to-refresh
title: Pull to Refresh
category: interaction
order: 38
---
## Rule
<p>A pull only refreshes once it passes a clear threshold, about 64 to 80px of content movement. Release before that and the list snaps back with no reload, so a slightly too long scroll to the top never triggers a network call by accident.</p>
<p><strong>Resistance, not a wall.</strong> While pulling, the content moves less than the finger (about half the distance, tapering further the longer the pull), so the pull feels like stretching something rather than dragging the page. On release it settles back with a slight overshoot and an ease-out, never a hard stop.</p>
<p><strong>Signal the threshold before release.</strong> The stretch indicator fills as the pull grows, and at the threshold it becomes the loading spinner, with one short haptic tick, so the person knows letting go now will refresh. One tick only: no buzz on every pixel of the pull.</p>
<p><strong>Refresh without blocking.</strong> The list stays scrollable and tappable while the refresh runs. New items are inserted in place at the top, and if the person has scrolled down in the meantime their position is held (a &ldquo;3 new&rdquo; pill can take them up), never a jump that throws away where they were reading.</p>
## Do
- A threshold of about 64 to 80px; an earlier release snaps back with no reload
- Content moving about half the finger distance, settling with a slight overshoot
- The indicator turns into the spinner at the threshold, with one haptic tick
- New items inserted in place while the list stays usable
## Avoid
- A refresh that fires on any small pull
- Blocking the list with an overlay until the refresh finishes
- Jumping the reader&rsquo;s position when new items arrive
## Code: JS
<pre><code><span class="kw">const</span> THRESHOLD = <span class="num">72</span>; <span class="cm">// px of content movement</span>
<span class="kw">let</span> armed = <span class="kw">false</span>;
<span class="kw">function</span> <span class="fn">onPull</span>(fingerDy) {
  <span class="kw">const</span> dy = THRESHOLD * <span class="num">1.6</span> * (<span class="num">1</span> - Math.exp(-fingerDy / (THRESHOLD * <span class="num">3</span>))); <span class="cm">// rubber band</span>
  list.style.transform = <span class="str">`translateY(${dy}px)`</span>;
  indicator.style.setProperty(<span class="str">'--fill'</span>, Math.min(dy / THRESHOLD, <span class="num">1</span>));
  <span class="kw">if</span> (dy >= THRESHOLD &amp;&amp; !armed) { armed = <span class="kw">true</span>; indicator.classList.add(<span class="str">'spinning'</span>); navigator.vibrate?.(<span class="num">10</span>); }
  <span class="kw">if</span> (dy &lt; THRESHOLD &amp;&amp; armed) { armed = <span class="kw">false</span>; indicator.classList.remove(<span class="str">'spinning'</span>); }
}
<span class="kw">function</span> <span class="fn">onRelease</span>() {
  settleBack(); <span class="cm">// ease-out with a slight overshoot</span>
  <span class="kw">if</span> (armed) refresh().then(items => insertAtTop(items, { keepScrollPosition: <span class="kw">true</span> }));
}</code></pre>
