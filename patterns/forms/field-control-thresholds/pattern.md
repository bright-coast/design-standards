---
id: field-control-thresholds
title: Field Control Thresholds
category: forms
order: 15
---
## Rule
<p>The right control for a choice depends on how many options it holds, and the thresholds are concrete enough to apply without debate. Two or three options fit a segmented control or a small radio group, visible all at once with no extra tap. Four to seven options still fit visible radio buttons; that beats a dropdown at this size because every option is scannable without opening anything. Eight to fifteen options is where a dropdown earns its place, once the list is too long to show comfortably but still short enough to scroll by eye. Sixteen or more calls for a searchable combobox, and past fifty a dropdown should hand off to async search rather than trying to render the whole list at once. A checkbox and a toggle are not interchangeable either: a checkbox implies the change only takes effect once the form is explicitly saved, a toggle implies it applies the instant it's flipped, and mixing both metaphors on one screen makes someone guess which promise a given control is making.</p>
## Do
- 4-7 options as visible radio buttons, not a dropdown
- 16+ options get a searchable combobox, not a long static list
- Checkbox for &ldquo;applies on Save&rdquo;, toggle for &ldquo;applies now&rdquo;, never mixed on one screen
## Avoid
- A 20-option dropdown with no search, forcing a scroll-and-squint
## Extra: variant-note
<div class="variant-note"><b>Variant B of the dropdown search threshold.</b> A plain dropdown for 8 to 15 options, a searchable combobox from 16, async search past 50. Use when: you are picking the control from the option count. Variant A, search from about 10 items, is in Dropdown Design. Both are kept on purpose.</div>
## Code: Notes
<pre><code><span class="cm">// option count decides the control, not house habit</span>
<span class="kw">function</span> <span class="fn">pickControl</span>(optionCount) {
  <span class="kw">if</span> (optionCount &lt;= <span class="num">3</span>) <span class="kw">return</span> <span class="str">'segmented-or-radio'</span>;
  <span class="kw">if</span> (optionCount &lt;= <span class="num">7</span>) <span class="kw">return</span> <span class="str">'visible-radio-list'</span>;
  <span class="kw">if</span> (optionCount &lt;= <span class="num">15</span>) <span class="kw">return</span> <span class="str">'dropdown'</span>;
  <span class="kw">if</span> (optionCount &lt;= <span class="num">50</span>) <span class="kw">return</span> <span class="str">'searchable-combobox'</span>;
  <span class="kw">return</span> <span class="str">'async-autocomplete'</span>;
}</code></pre>
