---
id: live-cursors
title: Live Cursors
category: interaction
order: 16
---
## Rule
<p>The server typically streams roughly 10 cursor positions a second while the screen redraws at 60fps; interpolating between ticks is what makes cursors glide instead of visibly teleporting between discrete points. Hash each user&rsquo;s colour from their ID rather than assigning it randomly per session, so the same person keeps the same colour across visits and identity is trackable from the corner of an eye. When someone selects an element, lock it and outline it in their colour immediately: two people editing the same shape at once is a corrupted shape.</p>
<p><strong>Presence, tags and follow.</strong> Show who is here as a stack of about three avatars plus a count (+4), rendered the moment someone joins, before they move or type. A locked object carries a small tag in the editor&rsquo;s colour (Maya is editing), not just an outline. Clicking a collaborator&rsquo;s avatar enters follow mode: your viewport tracks their pans and zooms, a frame in their colour around the canvas shows you are following, and any pan of your own or Escape stops it.</p>
## Do
- Interpolate between server ticks for smooth movement
- Stable per-user colour hashed from ID
- An avatar stack of about three plus +N, shown the moment someone joins
- Follow mode from an avatar click, with an obvious way out
## Avoid
- Two users editing the same locked element at once
## Extra: variant-note
<div class="variant-note"><b>Editing locks, two variants.</b> Variant A: a hard lock with an outline and a name tag in the editor&rsquo;s colour (this entry). Use when: discrete objects such as shapes or cards, where two edits at once corrupt the object. Variant B: a soft lock (the tag shows, editing stays possible) or live merging of changes. Use when: text and fields, where edits can be merged and a hard lock only blocks people. Both kept on purpose.</div>
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
