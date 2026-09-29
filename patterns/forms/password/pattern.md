---
id: password
title: Password Field UX
category: forms
order: 8
---
## Rule
<p>Real strength is entropy: length matters far more than a symbol checkbox, which just pushes everyone toward &ldquo;Password1!&rdquo;-shaped passwords. Show the actual requirements checklist live as someone types, with each line ticking green the moment it&rsquo;s satisfied, rather than surfacing the whole list only after a failed submit. Always pair a visibility toggle with a one-tap generate-a-strong-password option, and never block paste; a blocked paste breaks every password manager and pushes people toward weaker, memorable passwords instead.</p>
## Do
- Visibility toggle + a one-tap generated password
## Avoid
- Hiding requirements until after a failed submit
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
