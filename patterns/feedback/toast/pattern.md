---
id: toast
title: Toast Notifications
category: feedback
order: 7
---
## Rule
<p>Position toasts deliberately (bottom-right on desktop, a top-edge banner on mobile) and never dead-centre over active content, where they block exactly what someone is trying to look at. Match the dismiss timing to severity: a routine confirmation clears in a few seconds, a warning holds longer or waits for a manual dismiss. Cap the visible stack at three and pause the auto-dismiss timer on hover so a toast doesn&rsquo;t vanish mid-read, and always pair colour with an icon; colour alone is the same accessibility failure it is everywhere else in this document. The right confirmation still depends on what just happened. An inline edit gets a quiet green flash plus a checkmark on the field itself for about 1.5 seconds, no toast needed. A form submit that keeps someone on the same page gets a toast plus a visible change in the data they're looking at. A form submit that navigates somewhere new shows the confirmation as context on the destination itself, &ldquo;Created John Smith&rdquo; at the top of his new record, rather than a toast that's already gone by the time the new page renders. A batch action gets a plain summary count, &ldquo;Suspended 12 users&rdquo;, not a silent redirect that leaves someone guessing whether it worked.</p>
<p><strong>Timing, controls and type markers.</strong> Info and success toasts stay about 4 seconds, warnings about 7, and an error toast never dismisses itself: it waits until the person acknowledges it, because an error that leaves on its own takes the fix with it. Every toast has a visible close button, and on touch screens it can also be swiped away. Mark the type with an icon plus a coloured left border of about 3 to 4px, not a background tint alone, which fades in dark mode and says little to a colour-blind reader. When a toast enters or leaves, the others in the stack slide to their new places on a short spring (about 300ms, little or no overshoot) instead of jumping; under reduced motion they move without it.</p>
## Do
- Cap the stack at 3, pause on hover
- Confirmation matches the action: inline flash, toast, destination context, or a batch summary count
- About 4s for info, about 7s for warnings, errors until acknowledged
- A close button on every toast, and swipe to dismiss on touch
- Icon plus a coloured left border to mark the type; the stack slides on a short spring
## Avoid
- An error toast that dismisses itself
- Colour-only type signalling, no icon
- Silent success, leaving someone to guess whether it actually worked
## Code: JS
<pre><code><span class="kw">const</span> queue = [];
<span class="kw">function</span> <span class="fn">pushToast</span>(toast) {
  queue.push({ ...toast, id: crypto.randomUUID() });
  <span class="kw">if</span> (queue.length > <span class="num">3</span>) queue.shift(); <span class="cm">// stack capped at 3</span>
  render();
}

toastEl.addEventListener(<span class="str">'mouseenter'</span>, () => clearTimeout(toastEl._timer)); <span class="cm">// pause on hover</span>
toastEl.addEventListener(<span class="str">'mouseleave'</span>, () => {
  toastEl._timer = setTimeout(() => dismiss(toastEl), toastEl.dataset.severity === <span class="str">'warning'</span> ? <span class="num">7000</span> : <span class="num">4000</span>);
});</code></pre>
## Code: JS + CSS: durations, close and stack motion
<pre><code><span class="kw">const</span> DURATION = { info: <span class="num">4000</span>, success: <span class="num">4000</span>, warning: <span class="num">7000</span>, error: <span class="kw">null</span> }; <span class="cm">// null = stays until acknowledged</span>
<span class="kw">const</span> ms = DURATION[toast.type];
<span class="kw">if</span> (ms) toastEl._timer = setTimeout(() => dismiss(toastEl), ms);
toastEl.querySelector(<span class="str">'.toast-close'</span>).onclick = () => dismiss(toastEl); <span class="cm">// every toast, every type</span>

.toast { border-left: 4px solid var(--type-colour); } <span class="cm">/* plus the type icon, never tint alone */</span>
.toast-stack > * { transition: transform 300ms cubic-bezier(0.22, 1, 0.36, 1); } <span class="cm">/* the stack slides, never jumps */</span>
@media (prefers-reduced-motion: reduce) { .toast-stack > * { transition: none; } }</code></pre>
