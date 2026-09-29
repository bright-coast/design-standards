---
id: toast
title: Toast Notifications
category: feedback
order: 7
---
## Rule
<p>Position toasts deliberately (bottom-right on desktop, a top-edge banner on mobile) and never dead-centre over active content, where they block exactly what someone is trying to look at. Match the dismiss timing to severity: a routine confirmation clears in a few seconds, a warning holds longer or waits for a manual dismiss. Cap the visible stack at three and pause the auto-dismiss timer on hover so a toast doesn&rsquo;t vanish mid-read, and always pair colour with an icon; colour alone is the same accessibility failure it is everywhere else in this document. The right confirmation still depends on what just happened. An inline edit gets a quiet green flash plus a checkmark on the field itself for about 1.5 seconds, no toast needed. A form submit that keeps someone on the same page gets a toast plus a visible change in the data they're looking at. A form submit that navigates somewhere new shows the confirmation as context on the destination itself, &ldquo;Created John Smith&rdquo; at the top of his new record, rather than a toast that's already gone by the time the new page renders. A batch action gets a plain summary count, &ldquo;Suspended 12 users&rdquo;, not a silent redirect that leaves someone guessing whether it worked.</p>
## Do
- Cap the stack at 3, pause on hover
- Confirmation matches the action: inline flash, toast, destination context, or a batch summary count
## Avoid
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
  toastEl._timer = setTimeout(() => dismiss(toastEl), toastEl.dataset.severity === <span class="str">'warning'</span> ? <span class="num">6000</span> : <span class="num">3000</span>);
});</code></pre>
