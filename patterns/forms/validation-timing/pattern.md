---
id: validation-timing
title: Form Validation Timing
category: forms
order: 5
---
## Rule
<p>Validate on blur, once someone has finished with a field and moved on, not on every keystroke, which flags an email as invalid while it&rsquo;s still half-typed, and not held back entirely until submit, which dumps every problem on the form at once. Once a field has errored, switch to live revalidation on every keystroke for that field alone, so the error clears the instant it&rsquo;s actually fixed. Confirm correct fields too with a quiet success state, not just the broken ones; it tells someone they can stop worrying about that field. The message itself has three parts in order: what&rsquo;s wrong, why it matters, how to fix it. So &ldquo;Invalid email&rdquo; becomes &ldquo;This email is missing the @ symbol&rdquo; or, for a taken address, &ldquo;We already have an account with this email, sign in instead?&rdquo;</p>
## Do
- Live revalidation once a field has errored
- Message states what&rsquo;s wrong and how to fix it, not just &ldquo;Invalid&rdquo;
## Avoid
- Dumping every error at submit, all at once
## Code: JS
<pre><code><span class="kw">const</span> errored = <span class="kw">new</span> Set();

input.addEventListener(<span class="str">'blur'</span>, () => validate(input)); <span class="cm">// first pass: on blur only</span>
input.addEventListener(<span class="str">'input'</span>, () => {
  <span class="kw">if</span> (errored.has(input.name)) validate(input); <span class="cm">// live only once it has errored</span>
});

<span class="kw">function</span> <span class="fn">validate</span>(field) {
  <span class="kw">const</span> ok = field.checkValidity();
  field.closest(<span class="str">'.field'</span>).classList.toggle(<span class="str">'error'</span>, !ok);
  field.closest(<span class="str">'.field'</span>).classList.toggle(<span class="str">'success'</span>, ok && field.value !== <span class="str">''</span>);
  ok ? errored.delete(field.name) : errored.add(field.name);
}</code></pre>
