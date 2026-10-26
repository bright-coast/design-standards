---
id: context-menu
title: Context Menu
category: interaction
order: 7
---
## Rule
<p>A context menu measures its available space before it opens: no room below, it flips up; no room to the right, it mirrors left; it&rsquo;s always anchored to the cursor and always kept inside the viewport. Group actions by intent with dividers rather than a flat list of twelve items, and isolate anything destructive at the bottom in red. Submenus need a &ldquo;safe triangle&rdquo; from the cursor to the submenu so moving diagonally toward it doesn&rsquo;t close it the instant the cursor leaves the parent row.</p>
## Do
- Group with dividers, isolate destructive in red at the bottom
- Safe-triangle hover intent toward submenus
## Avoid
- Closing a submenu the instant the cursor drifts off the row
## Extra: variant-note
<div class="variant-note"><b>Safe triangle geometry, and two simpler options.</b> The triangle runs from the cursor&rsquo;s current position (its apex) to the top and bottom corners of the submenu&rsquo;s near edge. While the pointer moves inside it, the submenu stays open even as the pointer crosses the rows below; the moment the pointer steps outside, the menu switches to the row under it instantly. Nobody sees the triangle, they just never get annoyed. It is computed from pointer positions, not drawn as an element (the menu-aim technique made famous by a large retailer&rsquo;s mega menu). Variant A: the safe triangle. Use when: hover-opened submenus where speed matters. Variant B: a short hover-intent delay before switching rows. Use when: a simpler build is acceptable and a small lag is fine. Variant C: open submenus on click, not hover. Use when: touch matters or the menu is rarely used, since a click menu has no diagonal problem.</div>
## Code: JS
<pre><code><span class="kw">function</span> <span class="fn">positionMenu</span>(x, y, menuEl) {
  <span class="kw">const</span> { innerWidth: vw, innerHeight: vh } = window;
  <span class="kw">const</span> { offsetWidth: w, offsetHeight: h } = menuEl;
  menuEl.style.left = (x + w > vw ? x - w : x) + <span class="str">'px'</span>;
  menuEl.style.top = (y + h > vh ? y - h : y) + <span class="str">'px'</span>; <span class="cm">// flips before it clips</span>
}

target.addEventListener(<span class="str">'contextmenu'</span>, (e) => {
  e.preventDefault();
  positionMenu(e.clientX, e.clientY, menuEl);
  menuEl.classList.add(<span class="str">'open'</span>);
});

<span class="cm">// safe triangle: hold the submenu open while the pointer moves toward it</span>
<span class="kw">let</span> lastX = <span class="num">0</span>, lastY = <span class="num">0</span>;
row.addEventListener(<span class="str">'mousemove'</span>, e => {
  <span class="kw">const</span> movingTowardSubmenu = e.clientX > lastX && submenu.getBoundingClientRect().left > e.clientX;
  submenu.dataset.armed = movingTowardSubmenu;
  [lastX, lastY] = [e.clientX, e.clientY];
});</code></pre>
