---
id: accordion
title: Accordion Disclosure
category: interaction
order: 1
---
## Rule
<p><code class="tok">height: auto</code> cannot be transitioned in CSS, since the browser just snaps between values. The fix is animating a CSS grid row instead: a single-cell grid whose row goes from <code class="tok">0fr</code> to <code class="tok">1fr</code> transitions smoothly regardless of the content&rsquo;s real height, no JS measurement needed. Sync the chevron rotation to the exact same transition so the two never visibly drift apart, even by a couple of frames.</p>
## Do
- Real <code class="tok">&lt;button&gt;</code> with <code class="tok">aria-expanded</code> + <code class="tok">aria-controls</code>
- Single-open for sequential steps, multi-open for FAQ lists
## Avoid
- Chevron rotation on a different timing curve than the panel
## Code: CSS + JS
<pre><code><span class="cm">/* grid-rows trick: transitions cleanly, no JS height measurement */</span>
.accordion-panel {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 250ms ease;
}
.accordion-panel.open { grid-template-rows: 1fr; }
.accordion-panel > .inner { overflow: hidden; } <span class="cm">/* clips during animation */</span>
.chevron { transition: transform 250ms ease; }
.accordion-panel.open ~ .chevron { transform: rotate(180deg); }

button.addEventListener(<span class="str">'click'</span>, () => {
  <span class="kw">const</span> open = button.getAttribute(<span class="str">'aria-expanded'</span>) === <span class="str">'true'</span>;
  button.setAttribute(<span class="str">'aria-expanded'</span>, String(!open));
  panel.classList.toggle(<span class="str">'open'</span>, !open);
});</code></pre>
