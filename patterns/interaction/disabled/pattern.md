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
