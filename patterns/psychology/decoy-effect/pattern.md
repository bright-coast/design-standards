---
id: decoy-effect
title: Decoy Effect
category: psychology
order: 5
---
## Rule
<p>People judge a price by comparing it with whatever is easiest to compare it with. Add a third option that is clearly worse than a similar-priced one (Pro at $14 with far fewer features than Premium at $16) and Premium suddenly looks like a bargain, because Pro against Premium is an easy comparison ($2 more, much more included) while Basic, which has no close neighbour, drops out of the decision. This is the decoy effect, also called asymmetric dominance; it is a research-backed heuristic, not a law, and its strength varies a lot from one market to the next.</p>
<p><strong>Never build a tier whose only job is to look bad.</strong> A plan nobody should buy, priced to push people into a more expensive one, steers them into paying for what they do not need, and it is the kind of thing customers notice and resent. The honest use is the reverse check: every tier on the page is one a real customer could sensibly choose, the tier you highlight is the one that genuinely fits most of them, and the differences between tiers are stated plainly so people compare on substance. When reviewing a pricing page, ask of each tier: who is this actually for? If the answer is nobody, remove it (<a href="#lp-pricing-table">Pricing Table</a>, Visual).</p>
## Do
- Every tier on the page is a sensible choice for some real customer
- Highlight the tier that genuinely fits most people, with the differences stated plainly
- Ask of each tier who it is actually for, and remove any that is for nobody
## Avoid
- A near-identical, slightly cheaper, much weaker tier added only to make another look good
- Hiding the real differences so the comparison only works one way
## Code: JS
<pre><code><span class="cm">// review check for a pricing page: every tier needs a real audience</span>
<span class="kw">const</span> tiers = [
  { name: <span class="str">'Basic'</span>, price: <span class="num">8</span>, forWhom: <span class="str">'one person, light use'</span> },
  { name: <span class="str">'Premium'</span>, price: <span class="num">16</span>, forWhom: <span class="str">'most teams'</span>, highlight: <span class="kw">true</span> },
];
<span class="kw">const</span> decoys = tiers.filter(t =&gt; !t.forWhom); <span class="cm">// a tier for nobody is a decoy: remove it</span></code></pre>
