---
id: inline-editing
title: Inline Editing
category: interaction
order: 15
---
## Rule
<p>Editable text has to whisper its affordance before the click, a pencil icon on hover, a soft background tint, or people file support tickets just to rename something. Keep every pixel identical during the swap from text to input: same font, size, and padding, with only the border going from transparent to accent, so nothing visibly jumps. Enter commits and Escape cancels everywhere; blur is the one genuinely contested behaviour, so pick a single rule for it and never break it inside the same product.</p>
## Do
- Enter commits, Esc cancels, one consistent blur rule
- Save optimistically, roll back with the draft kept on failure
## Avoid
- Zero affordance that hides that a field is editable
## Code: JS
<pre><code><span class="kw">let</span> lastValue = input.value;
<span class="kw">function</span> <span class="fn">startEdit</span>() { field.classList.add(<span class="str">'editing'</span>); input.readOnly = <span class="kw">false</span>; input.select(); }
<span class="kw">function</span> <span class="fn">endEdit</span>() { field.classList.remove(<span class="str">'editing'</span>); input.readOnly = <span class="kw">true</span>; }

<span class="kw">async function</span> <span class="fn">commit</span>() {
  <span class="kw">const</span> next = input.value;
  lastValue = next; endEdit(); <span class="cm">// optimistic, updates before the server confirms</span>
  <span class="kw">try</span> { <span class="kw">await</span> save(next); }
  <span class="kw">catch</span> { input.value = lastValue; showError(<span class="str">'Save failed, draft kept'</span>); }
}
<span class="kw">function</span> <span class="fn">cancel</span>() { input.value = lastValue; endEdit(); }

field.addEventListener(<span class="str">'click'</span>, startEdit);
input.addEventListener(<span class="str">'keydown'</span>, (e) => {
  <span class="kw">if</span> (e.key === <span class="str">'Enter'</span>) commit();
  <span class="kw">if</span> (e.key === <span class="str">'Escape'</span>) cancel();
});
input.addEventListener(<span class="str">'blur'</span>, commit); <span class="cm">// pick ONE rule, keep it everywhere</span></code></pre>
