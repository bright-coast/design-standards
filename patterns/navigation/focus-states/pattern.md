---
id: focus-states
title: Focus States
category: navigation
order: 1
---
## Rule
<p>Removing <code class="tok">outline: none</code> without putting a real replacement in its place is a genuine accessibility failure, not a legitimate style choice. It leaves keyboard users with no visible indication of where they are on the page at all. <code class="tok">:focus-visible</code> is the correct modern fix: it shows a focus ring only for keyboard navigation, keeping a mouse click free of the ring while Tab still gets one. Inside a modal, trap focus so Tab can&rsquo;t escape to the page behind it, and explicitly return focus to the triggering element when the modal closes. Visual tab order needs to match DOM order; a CSS-only reorder that doesn&rsquo;t match creates a genuinely confusing keyboard-navigation path.</p>
## Do
- <code class="tok">:focus-visible</code> so clicks stay clean, Tab gets a ring
## Avoid
- Visual order drifting from DOM order
## Code: CSS + JS
<pre><code>.btn:focus { outline: none; } <span class="cm">/* mouse click: no ring */</span>
.btn:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; } <span class="cm">/* keyboard: real ring */</span>

<span class="cm">// focus trap: Tab/Shift+Tab cycle within the modal, never escape to the page behind it</span>
modal.addEventListener(<span class="str">'keydown'</span>, (e) => {
  <span class="kw">if</span> (e.key !== <span class="str">'Tab'</span>) <span class="kw">return</span>;
  <span class="kw">const</span> focusable = [...modal.querySelectorAll(<span class="str">'button, [href], input, [tabindex]'</span>)];
  <span class="kw">const</span> [first, last] = [focusable[<span class="num">0</span>], focusable.at(-<span class="num">1</span>)];
  <span class="kw">if</span> (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  <span class="kw">else if</span> (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
});
<span class="kw">const</span> triggerEl = document.activeElement;
closeModal(() => triggerEl.focus()); <span class="cm">// focus returns to what opened it</span></code></pre>
