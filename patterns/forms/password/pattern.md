---
id: password
title: Password Field UX
category: forms
order: 8
---
## Rule
<p>Real strength is entropy: length matters far more than a symbol checkbox, which just pushes everyone toward &ldquo;Password1!&rdquo;-shaped passwords. Show the actual requirements checklist live as someone types, with each line ticking green the moment it&rsquo;s satisfied, rather than surfacing the whole list only after a failed submit. Always pair a visibility toggle with a one-tap generate-a-strong-password option, and never block paste; a blocked paste breaks every password manager and pushes people toward weaker, memorable passwords instead.</p>
<p>A strength meter belongs on account creation only, never on the login form, where it judges a password that already exists and helps nobody. Set <code class="tok">autocomplete="current-password"</code> on login and <code class="tok">autocomplete="new-password"</code> where a new password is chosen, so password managers fill the right one and offer to generate a new one.</p>
## Do
- Visibility toggle + a one-tap generated password
- <span><code class="tok">autocomplete="current-password"</code> on login, <code class="tok">autocomplete="new-password"</code> on account creation</span>
## Avoid
- Hiding requirements until after a failed submit
- A strength meter on the login form
## Code: JS
<pre><code><span class="kw">const</span> RULES = [
  { test: v => v.length >= <span class="num">12</span>, label: <span class="str">'At least 12 characters'</span> }, <span class="cm">// length &gt; symbol tricks</span>
  { test: v => /[A-Z]/.test(v) && /[a-z]/.test(v), label: <span class="str">'Upper and lower case'</span> },
  { test: v => /\d/.test(v), label: <span class="str">'At least one number'</span> },
];

input.addEventListener(<span class="str">'input'</span>, () => { <span class="cm">// live checklist, shown from the first keystroke</span>
  RULES.forEach((rule, i) => checklistItems[i].classList.toggle(<span class="str">'met'</span>, rule.test(input.value)));
});

toggleBtn.addEventListener(<span class="str">'click'</span>, () => input.type = input.type === <span class="str">'password'</span> ? <span class="str">'text'</span> : <span class="str">'password'</span>);
generateBtn.addEventListener(<span class="str">'click'</span>, () => { input.value = generateStrongPassword(<span class="num">16</span>); input.dispatchEvent(<span class="kw">new</span> Event(<span class="str">'input'</span>)); });
<span class="cm">// no paste-blocking handler, password managers must be able to fill this field</span></code></pre>
