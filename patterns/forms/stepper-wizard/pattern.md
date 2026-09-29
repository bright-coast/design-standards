---
id: stepper-wizard
title: Stepper Wizard
category: forms
order: 11
---
## Rule
<p>Chunk a long form by meaning (Personal, Shipping, Payment, Review), not by an arbitrary field count that splits a logically single group across two steps. Validate inside each step and block the Next button until it&rsquo;s valid, so a step-one mistake never surfaces for the first time at step four after everything else has already been filled in. Persist state across Back navigation and even a page refresh; losing a half-completed multi-step form to an accidental reload is one of the more infuriating things software still does.</p>
## Do
- Validate inside each step, block Next until valid
## Avoid
- Surfacing a step-one error only at step four
## Code: JS
<pre><code><span class="kw">const</span> STEPS = [<span class="str">'personal'</span>, <span class="str">'shipping'</span>, <span class="str">'payment'</span>, <span class="str">'review'</span>]; <span class="cm">// chunked by meaning</span>
<span class="kw">let</span> stepIndex = <span class="num">0</span>;
<span class="kw">const</span> formState = JSON.parse(localStorage.getItem(<span class="str">'wizard-draft'</span>) || <span class="str">'{}'</span>); <span class="cm">// survives refresh</span>

<span class="kw">function</span> <span class="fn">goNext</span>() {
  <span class="kw">if</span> (!validateStep(STEPS[stepIndex], formState)) <span class="kw">return</span>; <span class="cm">// blocked here, not at review</span>
  stepIndex++;
  localStorage.setItem(<span class="str">'wizard-draft'</span>, JSON.stringify(formState));
  render();
}
<span class="kw">function</span> <span class="fn">goBack</span>() { stepIndex--; render(); } <span class="cm">// formState untouched, nothing lost</span></code></pre>
