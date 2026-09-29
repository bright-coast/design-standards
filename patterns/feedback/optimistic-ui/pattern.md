---
id: optimistic-ui
title: Optimistic UI
category: feedback
order: 5
---
## Rule
<p>Update the interface the instant someone acts, sync the real request in the background, and roll back cleanly if it fails. The perceived latency drops to zero even though the network call still takes its normal time. This is reserved for reversible, low-stakes actions where a rollback costs nothing (a like, a follow, an inline edit); trust the success case and design failure as the rare exception rather than the default assumption. Never apply it to a payment or anything else unsafe to silently reverse.</p>
## Do
- Reserved for reversible, low-stakes actions
## Avoid
- Optimistic payments or anything unsafe to undo
## Code: JS
<pre><code><span class="kw">async function</span> <span class="fn">optimisticUpdate</span>(id, nextState, apiCall) {
  <span class="kw">const</span> previous = getState(id);
  setState(id, nextState); <span class="cm">// applied instantly, before the request even starts</span>
  <span class="kw">try</span> {
    <span class="kw">await</span> apiCall();
  } <span class="kw">catch</span> {
    setState(id, previous); <span class="cm">// clean rollback, only reachable for reversible actions</span>
    notify({ severity: <span class="str">'low'</span>, message: <span class="str">'Update failed, reverted.'</span> });
  }
}</code></pre>
