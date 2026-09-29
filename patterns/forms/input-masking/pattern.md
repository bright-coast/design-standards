---
id: input-masking
title: Input Masking
category: forms
order: 6
---
## Rule
<p>Group long numbers into readable chunks as they&rsquo;re typed (a card number in 4-digit blocks, a phone number split by area code), and detect the card brand from the leading digit to show the right icon before the number is even complete. The caret needs to land after the character that was just typed, not jump to the end of the field, which is the usual bug in a hand-rolled mask. Store the raw digits internally and only format for display; validating the masked format on the very first keystroke rejects a perfectly valid number that just isn&rsquo;t finished yet.</p>
## Do
- Store raw digits, display the formatted grouping
## Avoid
- Validating format on the very first keystroke
## Code: JS
<pre><code><span class="kw">function</span> <span class="fn">maskCardNumber</span>(input) {
  <span class="kw">const</span> caretFromEnd = input.value.length - input.selectionStart;
  <span class="kw">const</span> digits = input.value.replace(/\D/g, <span class="str">''</span>).slice(<span class="num">0</span>, <span class="num">16</span>);
  input.value = digits.replace(/(\d{4})(?=\d)/g, <span class="str">'$1 '</span>); <span class="cm">// raw digits stored separately</span>
  <span class="kw">const</span> pos = input.value.length - caretFromEnd;
  input.setSelectionRange(pos, pos); <span class="cm">// caret follows the just-typed char</span>
}

<span class="kw">function</span> <span class="fn">detectBrand</span>(digits) {
  <span class="kw">if</span> (/^4/.test(digits)) <span class="kw">return</span> <span class="str">'visa'</span>;
  <span class="kw">if</span> (/^5[1-5]/.test(digits)) <span class="kw">return</span> <span class="str">'mastercard'</span>;
  <span class="kw">if</span> (/^3[47]/.test(digits)) <span class="kw">return</span> <span class="str">'amex'</span>;
  <span class="kw">return</span> <span class="kw">null</span>; <span class="cm">// shown before the number is even complete</span>
}</code></pre>
