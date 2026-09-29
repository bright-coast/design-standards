---
id: microcopy
title: Microcopy
category: content
order: 3
---
## Rule
<p>A button label should name the actual reward someone gets (&ldquo;Create my free account&rdquo;), not the raw mechanic behind it (&ldquo;Submit&rdquo;). The reward-framed version measurably converts better because it answers &ldquo;what happens when I click this&rdquo; in the label itself. An error message should turn into a concrete next step, not just a diagnosis of what went wrong. Labels stay persistently visible above their field rather than vanishing as placeholder text once typing starts. Cold system-speak like &ldquo;operation failed&rdquo; or &ldquo;an error occurred&rdquo; reads as the product blaming an abstraction instead of a plain-language explanation.</p>
## Do
- Errors turn into a next step, not just a diagnosis
## Avoid
- Cold system-speak like &ldquo;operation failed&rdquo;
## Code: JS
<pre><code><span class="kw">const</span> COPY = {
  submitBtn: <span class="str">'Create my free account'</span>,        <span class="cm">// names the reward, not "Submit"</span>
  cardDeclined: <span class="str">'Card declined, try a different card or contact your bank.'</span>, <span class="cm">// diagnosis + next step</span>
  networkError: <span class="str">"Couldn't save, check your connection and try again."</span>, <span class="cm">// never "operation failed"</span>
};
<span class="cm">// label: persistent, never placeholder-only, see Form Field States above</span></code></pre>
