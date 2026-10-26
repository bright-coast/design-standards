---
id: loading-system
title: Loading States System
category: feedback
order: 3
---
## Rule
<p>Pick the loading pattern from what&rsquo;s actually known about the wait: a known content shape gets a skeleton, a known percentage gets a real progress bar, and a short wait of unknown length gets a plain spinner. A button doing its own async work is its own special case: the spinner sits inside the button, the label switches to its verb form, the button holds its own width via a minimum width so nothing shifts around it, and it disables itself for the duration so a second click can't fire the same request twice. Show nothing at all for the first ~300ms; a skeleton that flashes for a tenth of a second before real content arrives reads as a flicker, not helpful feedback. Past 2 seconds, swap a bare &ldquo;Loading&hellip;&rdquo; for real context, &ldquo;Loading 1,247 records&hellip;&rdquo; tells someone the wait has a reason. Past 10 seconds, offer a way to cancel rather than leaving them stuck watching a spinner with no exit. For anything genuinely long (past 3 seconds and climbing), show real progress wherever it's measurable, give an ETA once one is knowable, and let the operation keep running in the background with a notification when it finishes, instead of holding someone hostage on the screen that started it. For anything reversible, optimistic UI (see Feedback &rsquo;Optimistic UI&rsquo;) beats a loading state entirely by skipping the wait perception altogether.</p>
## Do
- Nothing at all under ~300ms
- Real context past 2s, a cancel option past 10s
- A button-internal spinner keeps its width and disables itself, so a second click can't double-submit
## Avoid
- A skeleton for every fetch regardless of duration
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
