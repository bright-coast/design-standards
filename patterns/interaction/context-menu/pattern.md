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
