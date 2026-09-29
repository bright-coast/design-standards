---
id: doherty
title: Doherty Threshold
category: feedback
order: 1
---
## Rule
<p>400ms is the real deadline for a response, not a round number. Under it, attention holds and the interaction feels continuous; over it, the brain mentally checks out and starts a separate thought. The fix isn&rsquo;t always a faster backend: paint a skeleton the instant a screen opens (before data has actually arrived) and apply optimistic updates for actions that are near-certain to succeed, so the perceived response lands under the threshold even when the real round trip doesn&rsquo;t.</p>
## Do
- Skeletons paint the instant a screen opens
## Avoid
- A blank, frozen screen while data loads
## Code: JS
<pre><code><span class="kw">function</span> <span class="fn">openScreen</span>() {
  renderSkeleton(); <span class="cm">// paints in the same frame as navigation, well under 400ms</span>
  fetchData().then(renderReal);
}

<span class="kw">async function</span> <span class="fn">likePost</span>(id) {
  setLiked(id, <span class="kw">true</span>); <span class="cm">// perceived response is instant, real request happens after</span>
  <span class="kw">try</span> { <span class="kw">await</span> api.like(id); }
  <span class="kw">catch</span> { setLiked(id, <span class="kw">false</span>); } <span class="cm">// near-certain to succeed, so failure is the rare path</span>
}</code></pre>
