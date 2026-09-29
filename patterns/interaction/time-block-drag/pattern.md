---
id: time-block-drag
title: Time-Block Dragging
category: interaction
order: 27
---
## Rule
<p>A drag that creates or resizes something with a real value attached, a scheduled time block, a price range, a crop area, owes that value back to the user while the drag is still happening, not just a shape sliding around with the result revealed only on release. A small heads-up readout tracking the pointer, showing exactly what start, end, and duration the drop would produce, turns a guess into a controlled action. Snapping to a fixed interval (15 minutes, not a free pixel) removes the fiddly precision nobody actually wants, since no one is trying to end a meeting at 10:47. And once a block exists, only the edge that should move stays draggable: resizing from the bottom handle changes duration while the start time locks in place, so a resize can never accidentally turn into an unintended reschedule.</p>
## Do
- Live start/end/duration HUD tracking the pointer, updated on every pointermove
- Snap to a fixed interval (15 min), not free-pixel positioning
- Lock the start edge once a block exists, resize only from the bottom handle
## Avoid
- Silent dragging with no numeric feedback until release
- Letting either edge move during a resize, ambiguous whether the event moved or changed duration
## Extra: caveat-box
<div class="caveat-box">In a calendar the same mechanics hold (snap to 15 minutes, resize from the bottom edge only, the time label updates while you drag, not after), plus two more: drag on empty space to draw a new event, and move an existing event by its body. See Calendar Week View (entry 28) for the layout rules around it.</div>
## Code: JS: the exact code driving the demo
<pre><code><span class="kw">var</span> SNAP = <span class="num">15</span>, MIN_DUR = <span class="num">15</span>; <span class="cm">// 1px == 1 minute in this demo's column</span>
handle.addEventListener(<span class="str">'pointerdown'</span>, <span class="kw">function</span>(e){
  startH = event.offsetHeight;
  startY = e.clientY;
  handle.setPointerCapture(e.pointerId); <span class="cm">// same handle-capture approach as the resizable-panel pattern</span>
});
handle.addEventListener(<span class="str">'pointermove'</span>, <span class="kw">function</span>(e){
  <span class="kw">var</span> raw = startH + (e.clientY - startY);
  <span class="kw">var</span> snapped = Math.round(raw / SNAP) * SNAP; <span class="cm">// snap to the grid, not the pixel</span>
  <span class="kw">if</span> (snapped < MIN_DUR) snapped = MIN_DUR;
  event.style.height = snapped + <span class="str">'px'</span>; <span class="cm">// top never changes: start stays locked, only duration moves</span>
  hud.textContent = fmt(startMin) + <span class="str">' to '</span> + fmt(startMin + snapped) + <span class="str">' &middot; '</span> + snapped + <span class="str">'m'</span>;
});</code></pre>
