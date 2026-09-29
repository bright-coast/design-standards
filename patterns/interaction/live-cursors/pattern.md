---
id: live-cursors
title: Live Cursors
category: interaction
order: 16
---
## Rule
<p>The server typically streams roughly 10 cursor positions a second while the screen redraws at 60fps; interpolating between ticks is what makes cursors glide instead of visibly teleporting between discrete points. Hash each user&rsquo;s colour from their ID rather than assigning it randomly per session, so the same person keeps the same colour across visits and identity is trackable from the corner of an eye. When someone selects an element, lock it and outline it in their colour immediately: two people editing the same shape at once is a corrupted shape.</p>
## Do
- Interpolate between server ticks for smooth movement
- Stable per-user colour hashed from ID
## Avoid
- Two users editing the same locked element at once
## Code: JS
<pre><code><span class="kw">const</span> cursors = <span class="kw">new</span> Map();

<span class="kw">function</span> <span class="fn">onServerTick</span>(id, x, y) {
  <span class="kw">const</span> c = cursors.get(id) ?? { x, y, targetX: x, targetY: y, color: hashColor(id) };
  c.targetX = x; c.targetY = y;
  cursors.set(id, c);
}

<span class="kw">function</span> <span class="fn">raf</span>() {
  <span class="kw">for</span> (<span class="kw">const</span> c <span class="kw">of</span> cursors.values()) {
    c.x += (c.targetX - c.x) * <span class="num">0.25</span>; <span class="cm">// eases toward the latest server tick</span>
    c.y += (c.targetY - c.y) * <span class="num">0.25</span>;
  }
  renderCursors(cursors);
  requestAnimationFrame(raf);
}
raf();</code></pre>
