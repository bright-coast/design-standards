---
id: error-states
title: Error States
category: feedback
order: 2
---
## Rule
<p>Match the error&rsquo;s surface to its actual severity: an inline message under the specific field it belongs to, a toast for something transient that will resolve itself, a page-level replacement only for a genuinely catastrophic failure, and a modal reserved for a true blocker that needs an immediate decision. A toast is the wrong surface the moment the error demands action rather than just information; it disappears on its own timer, taking the one chance to fix the problem with it. Every error needs a real way out (a retry button, a link to fix the input, a support contact), not a dead-end &ldquo;OK&rdquo; that just closes the dialog and leaves the underlying problem exactly where it was. Whatever someone had already typed stays exactly where it was; a validation failure or a failed save is never an excuse to clear a field and make them start over. Write the message in plain language; a raw error code or stack trace means nothing to someone who isn&rsquo;t the engineer who wrote the code.</p>
<p><strong>A system error message has three parts.</strong> Say what happened, say why if you know, and say what the person can do now: Your invoice was not saved because the connection dropped. Your changes are still here, so select Retry. The default fallback, the message for an error nobody planned for, still names the thing that failed and the next step (We could not load your invoices. Refresh the page, or try again in a minute). It never says Something went wrong, which tells the person nothing and leaves them stuck.</p>
<p><strong>Name the cause, then pick the pattern.</strong> Four causes need four treatments. <strong>Validation</strong>, the input is wrong: inline under the field, with the fix (<a href="#lp-validation-timing">Form Validation Timing</a>, Forms entry 05). <strong>Network</strong>, the request never arrived: keep everything on screen, say the connection dropped, retry once quietly where that is safe, then offer Retry. <strong>Server</strong>, the product failed: say so plainly, keep the person&rsquo;s input, offer Retry and a support route, and log the technical detail for the team instead of showing it. <strong>Permission</strong>, the person is not allowed: say who can grant access and offer Request access, never a Retry that can only fail again.</p>
## Do
- Every error needs a real way out
- Whatever was already typed stays in the field after a failure
- What happened, why if known, and what to do now
- Classify the cause (validation, network, server, permission) and use its treatment
## Avoid
- A Retry button on a permission error
- A dead-end &ldquo;OK&rdquo; with no path forward
- A toast for an error that needs the user to actually do something about it
- A Something went wrong fallback that names neither the thing nor the next step
## Code: JS
<pre><code><span class="kw">function</span> <span class="fn">handleError</span>(err) {
  <span class="kw">if</span> (err.field) <span class="kw">return</span> showInlineError(err.field, plainLanguage(err.code)); <span class="cm">// one field, inline</span>
  <span class="kw">if</span> (err.transient) <span class="kw">return</span> showToast({ msg: plainLanguage(err.code), action: { label: <span class="str">'Retry'</span>, onClick: retry } });
  <span class="kw">return</span> showModal({ msg: plainLanguage(err.code), action: { label: <span class="str">'Contact support'</span>, href: <span class="str">'/support'</span> } }); <span class="cm">// true blocker</span>
}

<span class="kw">const</span> MESSAGES = { <span class="str">'ERR_402'</span>: <span class="str">'Payment failed, check your card details and try again.'</span> }; <span class="cm">// never raw codes</span>
<span class="kw">function</span> <span class="fn">plainLanguage</span>(code, thing = <span class="str">'your changes'</span>) { <span class="kw">return</span> MESSAGES[code] ?? <span class="str">`We could not save ${thing}. Check your connection, then try again.`</span>; } <span class="cm">// the fallback still names the thing and the next step</span></code></pre>
