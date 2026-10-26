---
id: undo
title: Undo UX
category: feedback
order: 8
---
## Rule
<p>Undo beats a confirmation dialog for most destructive actions: act immediately with zero friction, then offer a real second chance via a toast instead of asking &ldquo;are you sure?&rdquo; before anything has even happened, a question people click through without reading anyway. Soft-delete under the hood with a genuine recovery window (not an instant hard-delete dressed up with an undo button that does nothing), and show a visible countdown on the toast so the window&rsquo;s urgency is honest rather than a guess.</p>
## Do
- Soft-delete with a real recovery window
## Avoid
- Blocking every delete behind a confirm nobody reads
## Extra: variant-note
<div class="variant-note"><b>Undo toast duration, two variants.</b> Variant A: about 4 seconds for a reversible, low-stakes change such as a notification setting (Success States, entry 12). Use when: the change is trivial to redo by hand. Variant B: 5 to 10 seconds, longer for anything destructive, with the countdown visible. Use when: the undo recovers something deleted or sent. Both are kept on purpose.</div>
## Code: JS
<pre><code><span class="kw">function</span> <span class="fn">deleteWithUndo</span>(item) {
  softDelete(item.id); <span class="cm">// happens immediately, no "are you sure" dialog</span>
  <span class="kw">const</span> deadline = Date.now() + <span class="num">5000</span>;
  pushToast({
    message: <span class="str">`Deleted "${item.title}"`</span>,
    countdown: deadline, <span class="cm">// toast renders a live countdown against this</span>
    action: { label: <span class="str">'Undo'</span>, onClick: () => restore(item.id) },
    onExpire: () => hardDelete(item.id), <span class="cm">// only now is it actually gone</span>
  });
}</code></pre>
