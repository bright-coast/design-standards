---
id: error-states
title: Error States
category: feedback
order: 2
---
## Rule
<p>Match the error&rsquo;s surface to its actual severity: an inline message under the specific field it belongs to, a toast for something transient that will resolve itself, a page-level replacement only for a genuinely catastrophic failure, and a modal reserved for a true blocker that needs an immediate decision. A toast is the wrong surface the moment the error demands action rather than just information; it disappears on its own timer, taking the one chance to fix the problem with it. Every error needs a real way out (a retry button, a link to fix the input, a support contact), not a dead-end &ldquo;OK&rdquo; that just closes the dialog and leaves the underlying problem exactly where it was. Whatever someone had already typed stays exactly where it was; a validation failure or a failed save is never an excuse to clear a field and make them start over. Write the message in plain language; a raw error code or stack trace means nothing to someone who isn&rsquo;t the engineer who wrote the code.</p>
## Do
- Every error needs a real way out
- Whatever was already typed stays in the field after a failure
## Avoid
- A dead-end &ldquo;OK&rdquo; with no path forward
- A toast for an error that needs the user to actually do something about it
## Code: JS
<pre><code><span class="kw">function</span> <span class="fn">handleError</span>(err) {
  <span class="kw">if</span> (err.field) <span class="kw">return</span> showInlineError(err.field, plainLanguage(err.code)); <span class="cm">// one field, inline</span>
  <span class="kw">if</span> (err.transient) <span class="kw">return</span> showToast({ msg: plainLanguage(err.code), action: { label: <span class="str">'Retry'</span>, onClick: retry } });
  <span class="kw">return</span> showModal({ msg: plainLanguage(err.code), action: { label: <span class="str">'Contact support'</span>, href: <span class="str">'/support'</span> } }); <span class="cm">// true blocker</span>
}

<span class="kw">const</span> MESSAGES = { <span class="str">'ERR_402'</span>: <span class="str">'Payment failed, check your card details and try again.'</span> }; <span class="cm">// never raw codes</span>
<span class="kw">function</span> <span class="fn">plainLanguage</span>(code) { <span class="kw">return</span> MESSAGES[code] ?? <span class="str">'Something went wrong. Try again or contact support.'</span>; }</code></pre>
