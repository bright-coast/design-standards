---
id: focus-states
title: Focus States
category: navigation
order: 1
---
## Rule
<p>Removing <code class="tok">outline: none</code> without putting a real replacement in its place is a genuine accessibility failure, not a legitimate style choice. It leaves keyboard users with no visible indication of where they are on the page at all. <code class="tok">:focus-visible</code> is the correct modern fix: it shows a focus ring only for keyboard navigation, keeping a mouse click free of the ring while Tab still gets one. Inside a modal, trap focus so Tab can&rsquo;t escape to the page behind it, and explicitly return focus to the triggering element when the modal closes. Visual tab order needs to match DOM order; a CSS-only reorder that doesn&rsquo;t match creates a genuinely confusing keyboard-navigation path.</p>
<p>Elements that appear on scroll, such as a sticky call to action or a banner that slides in, never take keyboard focus when they show up. Pulling focus mid-scroll drops a keyboard or screen reader user somewhere they did not choose.</p>
<p><strong>A ring that moves nothing.</strong> Draw focus with <code class="tok">outline</code> or a <code class="tok">box-shadow</code> ring, never by thickening the border from 1px to 2px, which grows the box and nudges everything around it on every focus. <strong>The trap wraps and Escape leaves:</strong> in a modal, Tab on the last element goes to the first and Shift+Tab on the first goes to the last, and Escape closes the modal and returns focus to its trigger. <strong>Skip link:</strong> the first focusable element on every page is a Skip to content link, hidden until it receives focus, so a keyboard user can jump past the navigation instead of tabbing through it on every page.</p>
## Do
- <code class="tok">:focus-visible</code> so clicks stay clean, Tab gets a ring
- Focus drawn with outline or box-shadow, so the layout never shifts
- Modal focus wraps at both ends, Escape closes and returns focus
- A Skip to content link as the first focusable element, visible on focus
## Avoid
- A focus style that thickens the border and moves the layout
- Visual order drifting from DOM order
- A sticky banner or call to action that takes focus when it appears on scroll
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
closeModal(() => triggerEl.focus()); <span class="cm">// focus returns to what opened it</span>
modal.addEventListener(<span class="str">'keydown'</span>, (e) => { <span class="kw">if</span> (e.key === <span class="str">'Escape'</span>) closeModal(() => triggerEl.focus()); });

.input:focus-visible { box-shadow: 0 0 0 3px var(--accent-a30); } <span class="cm">/* ring, border width unchanged: nothing moves */</span>
.skip-link { position: absolute; left: 8px; top: -40px; }
.skip-link:focus { top: 8px; } <span class="cm">/* first focusable element, hidden until focused */</span></code></pre>
