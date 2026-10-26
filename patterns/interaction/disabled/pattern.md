---
id: disabled
title: Disabled Buttons
category: interaction
order: 10
---
## Rule
<p>A disabled button drops out of the tab order entirely, so keyboard users skip past it and a screen reader stays silent about the block. Pointer events are also dead on a disabled element, so a tooltip meant to explain the block can never fire; the reason is unreachable by design. The fix is keeping the button live and validating on click: flag the fields actually blocking submission and move focus to the first one, so the path forward is visible instead of a mystery.</p>
## Do
- Busy state (spinner + <code class="tok">aria-busy</code>) mid-request, not disabled
- Focus moves to the first blocking field
## Avoid
- Leaving users to guess why submit won&rsquo;t fire
## Extra: variant-note
<div class="variant-note"><b>Disabled buttons, two variants.</b> Variant A: keep the button live and validate on click, moving focus to the first blocking field (this entry). Use when: the block is something the person can fix in the form in front of them. Variant B: a real disabled state at 50% opacity with a not-allowed cursor and aria-disabled (which, unlike the disabled attribute, keeps the button focusable), always with the reason written beside it. Use when: the block is a known state the form cannot fix, such as a plan limit or a missing permission. The full state list is in Interactive State and Affordance (entry 24). Both are kept on purpose.</div>
## Code: JS
<pre><code>submitBtn.addEventListener(<span class="str">'click'</span>, () => {
  <span class="kw">const</span> invalid = [...form.querySelectorAll(<span class="str">':invalid'</span>)];
  <span class="kw">if</span> (invalid.length) {
    invalid.forEach(f => f.classList.add(<span class="str">'field-error'</span>));
    invalid[<span class="num">0</span>].focus(); <span class="cm">// path forward is visible, not guessed</span>
    <span class="kw">return</span>;
  }
  submitBtn.setAttribute(<span class="str">'aria-busy'</span>, <span class="str">'true'</span>); <span class="cm">// busy, not disabled</span>
  submit().finally(() => submitBtn.removeAttribute(<span class="str">'aria-busy'</span>));
});</code></pre>
