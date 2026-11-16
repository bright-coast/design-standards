---
id: swipe
title: Swipe Actions
category: interaction
order: 21
---
## Rule
<p>Swipe actions are invisible UI, and without a discovery hint, most people never find them at all. Destructive swipes need real friction: an instant full-swipe delete is a data-loss bug waiting to happen, so reveal the action button on a partial swipe and require a tap (or a full swipe plus an undo toast) to actually commit. Colour-code consistently by consequence across every list in the app, and never make swipe the only path; a long-press menu or a detail-view button needs to reach the same actions.</p>
<p><strong>Feel, direction and discovery.</strong> Past the reveal point, add rubber-band resistance so the row moves less than the finger, and when it crosses the commit line give a small pop (the action icon scales up) plus one haptic tick, so the person knows releasing now commits. Map direction to consequence the same way in every list: one direction for safe actions (right to archive or mark read), the other for destructive ones (left to delete). Teach the hidden gesture once: on the first visit, peek the first row open by about 60px and let it settle back, then never again.</p>
## Do
- Reveal on partial swipe, require a tap or undo to commit
- Always ship a non-swipe fallback path
- Rubber-band resistance, then a pop plus one haptic tick at the commit line
- One direction for safe actions and the other for destructive ones, in every list
- A one-time peek of the first row to teach the gesture
## Avoid
- An instant full-swipe delete with no undo
## Code: JS
<pre><code><span class="kw">let</span> startX = <span class="num">0</span>;
row.addEventListener(<span class="str">'touchstart'</span>, (e) => startX = e.touches[<span class="num">0</span>].clientX);

row.addEventListener(<span class="str">'touchmove'</span>, (e) => {
  <span class="kw">const</span> dx = e.touches[<span class="num">0</span>].clientX - startX;
  row.style.transform = <span class="str">`translateX(${Math.min(0, dx)}px)`</span>; <span class="cm">// reveal only, doesn't commit</span>
});

row.addEventListener(<span class="str">'touchend'</span>, (e) => {
  <span class="kw">const</span> dx = e.changedTouches[<span class="num">0</span>].clientX - startX;
  <span class="kw">if</span> (dx &lt; -<span class="num">80</span>) row.classList.add(<span class="str">'action-revealed'</span>); <span class="cm">// tap the button to actually delete</span>
  <span class="kw">else</span> row.style.transform = <span class="str">''</span>;
});</code></pre>
