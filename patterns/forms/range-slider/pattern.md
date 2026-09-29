---
id: range-slider
title: Range Sliders
category: forms
order: 9
---
## Rule
<p>Fill the track up to the thumb so the value reads at a glance without needing the number label, and make the entire row a draggable hit area rather than a thin 4px hairline that&rsquo;s genuinely hard to grab on a touch screen. Snap to defined steps whenever clean values actually matter (percentages, price bands), and float the live numeric value in a small bubble above the thumb while dragging so precision doesn&rsquo;t depend on reading a separate, disconnected label.</p>
## Do
- Float the live value above the thumb while dragging
## Avoid
- A slider that can&rsquo;t be driven by arrow keys
## Code: CSS + JS
<pre><code>input[type=range] {
  -webkit-appearance: none; height: 32px; <span class="cm">/* full row is the hit area, not a thin track */</span>
  background: linear-gradient(90deg, var(--accent) var(--fill, 0%), var(--track) var(--fill, 0%));
  border-radius: 999px;
}
input[type=range]::-webkit-slider-thumb {
  -webkit-appearance: none; width: 20px; height: 20px; border-radius: 50%;
  background: var(--accent); box-shadow: 0 2px 6px rgb(0 0 0 / .2);
}

slider.addEventListener(<span class="str">'input'</span>, () => {
  <span class="kw">const</span> pct = ((slider.value - slider.min) / (slider.max - slider.min)) * <span class="num">100</span>;
  slider.style.setProperty(<span class="str">'--fill'</span>, pct + <span class="str">'%'</span>);
  bubble.textContent = slider.value; bubble.style.left = pct + <span class="str">'%'</span>; <span class="cm">// floats above the thumb</span>
});
<span class="cm">// native input[type=range] already supports arrow-key stepping, don't override onkeydown</span></code></pre>
