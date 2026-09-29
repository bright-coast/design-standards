---
id: animation-timing
title: Animation Timing
category: motion
order: 1
---
## Rule
<p>An element entering the screen lands best at 200-300ms with an ease-out curve, long enough to read as deliberate motion, short enough not to feel sluggish. Exits should run noticeably faster than their entrance, around 150ms, because something leaving the screen doesn&rsquo;t need to earn the same attention something new arriving does. Tap/click feedback (a button&rsquo;s pressed state) needs to register in under 100ms without exception; anything slower reads as lag, not animation. When staggering a list of items into view, roughly 50ms between each item is enough to read as a cascade rather than a delay. A hover response specifically should register around 60ms, and no interaction transition in a dense productivity UI should run past ~150ms or use an overshoot/bounce easing curve. A snappy, no-overshoot response is what makes a tool feel instantly answering rather than animating at you.</p>
<p>To stagger a list in one rule, instead of a hand-set delay on every item, use the CSS function <code class="tok">sibling-index()</code>, which returns an element&rsquo;s position among its siblings: <code class="tok">animation-delay: calc(sibling-index() * 100ms)</code> with the keyframes unchanged. It works for a list of any length, including items added later, with no per-item CSS or JavaScript. It starts at 1, so use <code class="tok">calc((sibling-index() - 1) * 50ms)</code> when the first item should have no delay. Support is Chrome and Edge 138 and Safari 26.x, with Firefox still missing as of mid-2026, so keep the <code class="tok">--i</code> variable as the fallback.</p>
## Do
- Tap feedback under 100ms, always
- ~60ms hover response, no overshoot/bounce easing in dense UI
- Stagger with <code class="tok">sibling-index()</code> where supported, the <code class="tok">--i</code> variable as the fallback
## Avoid
- Symmetric in/out timing that drags
- A 600ms interface animation: it reads as broken past the 150 to 250ms band
## Extra: variant-note
<div class="variant-note"><b>Variants held here.</b> A: entrances land at 200 to 300ms with ease-out. Use when: an element is entering the screen. B: nothing in a dense productivity UI runs past about 150ms, and exits run around 150ms. Use when: the screen is a dense productivity UI, which is this entry&rsquo;s own wording (Dropdown Design&rsquo;s 150ms open is variant B). C: interface motion stays in a 150 to 250ms band with 250ms as the shared ceiling. Use when: you want one number for general interface motion. All three are kept on purpose.</div>
## Code: CSS
<pre><code>:root {
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
  --dur-tap: 80ms;    <span class="cm">/* feedback, never slower than this */</span>
  --dur-enter: 250ms; <span class="cm">/* entrances */</span>
  --dur-exit: 150ms;  <span class="cm">/* exits run faster than entrances */</span>
}
.btn:active { transform: scale(.97); transition: transform var(--dur-tap) ease-out; }
.modal-enter { animation: fade-up var(--dur-enter) var(--ease-out); }
.modal-exit  { animation: fade-down var(--dur-exit) ease-in; } <span class="cm">/* faster than the enter */</span>

.list-item { animation: fade-up 250ms var(--ease-out) backwards; }
.list-item:nth-child(n) { animation-delay: calc(var(--i, 0) * 50ms); } <span class="cm">/* ~50ms stagger */</span>

<span class="cm">/* CSS-native stagger where supported: no per-item variable, and it works for items added later */</span>
<span class="cm">/* sibling-index() starts at 1, so subtract 1 when the first item should have no delay */</span>
@supports (width: calc(sibling-index() * 1px)) {
  .list-item:nth-child(n) { animation-delay: calc((sibling-index() - 1) * 50ms); }
}
<span class="cm">/* a shorter version: li { animation: in .4s backwards; animation-delay: calc(sibling-index() * 100ms); }
   @keyframes in { from { opacity: 0; translate: -20px } } ; the --i rule above stays as the fallback */</span></code></pre>
