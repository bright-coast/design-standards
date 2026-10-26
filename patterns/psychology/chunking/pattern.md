---
id: chunking
title: Chunking
category: psychology
order: 4
---
## Rule
<p>Working memory holds about four chunks (Cowan, 2001), not the seven that is often quoted. Ten loose digits (4155550123) overflow four slots and six are lost; the same number in three groups (415 555 0123) fits, with all three chunks kept. Group anything people must hold in their heads while they act on it: phone numbers, card numbers, reference numbers, codes, long IDs, and the steps of a flow.</p>
<p>It is a research-backed heuristic about memory, not a law of layout. The rules in this library that apply it are Input Masking (Forms, entry 06), which formats as people type, and OTP Input (Forms, entry 07).</p>
## Do
- Show and accept long numbers in groups of 3 to 4
- Keep what people must remember to about four chunks
## Avoid
- A 10-digit reference shown as one unbroken string
## Code: JS
<pre><code><span class="cm">// show and type in chunks: 415 555 0123, not 4155550123</span>
<span class="kw">const</span> chunk = (d, sizes = [<span class="num">3</span>, <span class="num">3</span>, <span class="num">4</span>]) =&gt; { <span class="kw">let</span> i = <span class="num">0</span>; <span class="kw">return</span> sizes.map(n =&gt; d.slice(i, i += n)).filter(Boolean).join(<span class="str">' '</span>); };
chunk(<span class="str">'4155550123'</span>); <span class="cm">// "415 555 0123": 3 chunks fit 4 slots</span></code></pre>
