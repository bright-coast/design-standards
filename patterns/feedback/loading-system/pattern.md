---
id: loading-system
title: Loading States System
category: feedback
order: 3
---
## Rule
<p>Pick the loading pattern from what&rsquo;s actually known about the wait: a known content shape gets a skeleton, a known percentage gets a real progress bar, and a short wait of unknown length gets a plain spinner. A button doing its own async work is its own special case: the spinner sits inside the button, the label switches to its verb form, the button holds its own width via a minimum width so nothing shifts around it, and it disables itself for the duration so a second click can't fire the same request twice. Show nothing at all for the first ~300ms; a skeleton that flashes for a tenth of a second before real content arrives reads as a flicker, not helpful feedback. Past 2 seconds, swap a bare &ldquo;Loading&hellip;&rdquo; for real context, &ldquo;Loading 1,247 records&hellip;&rdquo; tells someone the wait has a reason. Past 10 seconds, offer a way to cancel rather than leaving them stuck watching a spinner with no exit. For anything genuinely long (past 3 seconds and climbing), show real progress wherever it's measurable, give an ETA once one is knowable, and let the operation keep running in the background with a notification when it finishes, instead of holding someone hostage on the screen that started it. For anything reversible, optimistic UI (see Feedback &rsquo;Optimistic UI&rsquo;) beats a loading state entirely by skipping the wait perception altogether.</p>
<p><strong>Open first, load inside.</strong> A dialog opens the instant it is asked for, with a skeleton inside while its content loads, never after a pause while the data arrives. A route change renders the new page at once, with skeletons only in the parts that wait on async data, so the frame, the heading and the navigation appear straight away.</p>
<p><strong>Pace a progress bar honestly.</strong> Move the bar the moment work starts, so the person can see it is running, and keep the steadiest movement for the end: a slowdown or a stall near the finish feels far longer than the same pause at the start, and a bar parked at 99% while the slowest step runs is the most irritating wait there is. Where you control the order, run the slow, unpredictable steps early and the quick ones last. Never animate progress that is not tied to real work; a bar that fills on a timer and then waits is a lie people catch.</p>
<p><strong>Refreshing content that is already on screen.</strong> When cached results exist, show them at once and swap in the fresh ones in place, row by row, with each row keeping its height so nothing reflows. The indicator for that refresh is a thin progress line, 2 to 3px, along the top edge of the panel; never a spinner over content that was readable a moment ago, and never a skeleton that wipes it out (<a href="#lp-six-data-states">Six Data States</a>, entry 13).</p>
<p><strong>Guard a submit in code, not only on the button.</strong> The disabled button is the visible half of the double-submit guard. The handler also keeps an in-flight flag and returns early while a request is running, because Enter in a field or a fast double tap can fire before the button repaints. Re-enable when the request settles, on success or on error, never after a fixed delay such as 2 seconds, which unlocks too early on a slow network and leaves a finished form locked on a fast one. For payments and other critical writes, send an idempotency key: one id created per attempt and reused on every retry of that attempt, so the server recognises a duplicate and returns the first result instead of charging twice (<a href="#lp-checkout-safe">Checkout That Feels Safe</a>, Forms entry 16).</p>
## Do
- Nothing at all under ~300ms
- Real context past 2s, a cancel option past 10s
- A button-internal spinner keeps its width and disables itself, so a second click can't double-submit
- Dialogs and new routes that render at once, with skeletons only where data is still coming
- A progress bar that moves at once and never stalls near the end
- Cached results first, refreshed in place under a thin progress line along the top
- An in-flight guard in the handler, released when the request settles, and an idempotency key on payments
## Avoid
- A skeleton for every fetch regardless of duration
- A dialog or page that waits for its data before it appears
- A progress bar driven by a timer instead of real work
- Re-enabling a submit button after a fixed delay
## Extra: variant-note
<div class="variant-note"><b>The first moment of a wait, two variants.</b> Variant A: show nothing for the first ~300ms of a content load, so a fast response never flickers a skeleton (this entry). Use when: data is loading into a screen or a panel. Variant B: acknowledge within 100ms, with the pressed state and a spinner inside the button from the moment of the press (Interactive State and Affordance, Interaction entry 24). Use when: the person just clicked or tapped something. Both are kept on purpose; one action often needs both, B on the button and A on the panel it fills.</div>
## Code: JS
<pre><code><span class="kw">function</span> <span class="fn">withLoadingState</span>(promise, { onSlow, delayMs = <span class="num">300</span> }) {
  <span class="kw">const</span> timer = setTimeout(onSlow, delayMs); <span class="cm">// nothing shown before this fires</span>
  <span class="kw">return</span> promise.finally(() => clearTimeout(timer));
}

<span class="cm">// pick the pattern by what's actually known about the wait</span>
<span class="kw">function</span> <span class="fn">pickLoader</span>({ knownShape, knownPercent }) {
  <span class="kw">if</span> (knownPercent) <span class="kw">return</span> <span class="str">'progress-bar'</span>;
  <span class="kw">if</span> (knownShape) <span class="kw">return</span> <span class="str">'skeleton'</span>;
  <span class="kw">return</span> <span class="str">'spinner'</span>; <span class="cm">// short, unknown-length wait</span>
}</code></pre>
## Code: JS: submit guard
<pre><code><span class="kw">let</span> inFlight = <span class="kw">false</span>;
<span class="kw">async function</span> <span class="fn">onSubmit</span>(e) {
  e.preventDefault();
  <span class="kw">if</span> (inFlight) <span class="kw">return</span>; <span class="cm">// Enter or a double tap can beat the disabled button</span>
  inFlight = <span class="kw">true</span>; button.disabled = <span class="kw">true</span>;
  <span class="kw">const</span> key = form.dataset.attemptKey ||= crypto.randomUUID(); <span class="cm">// same key on every retry of this attempt</span>
  <span class="kw">try</span> { <span class="kw">await</span> api.pay(data, { headers: { <span class="str">'Idempotency-Key'</span>: key } }); delete form.dataset.attemptKey; }
  <span class="kw">finally</span> { inFlight = <span class="kw">false</span>; button.disabled = <span class="kw">false</span>; } <span class="cm">// released on settle, never on a timer</span>
}</code></pre>
