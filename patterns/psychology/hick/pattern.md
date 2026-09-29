---
id: hick
title: Hick’s Heuristic
category: psychology
order: 2
---
## Rule
<p>The more choices there are, the longer it takes to decide: three choices are quick to pick from, fifteen are slow. This is Hick&rsquo;s heuristic, often written up as &ldquo;Hick&rsquo;s law&rdquo;; it is a research-backed heuristic, not a law.</p>
<p>Read it precisely. Decision time grows with the number of options; it does not say that fewer options is always better, so it is a cost to weigh against what people need to see, not an instruction to strip choices out. The related rules already in this library are Field Control Thresholds (Forms, entry 15), which picks the control from the option count, and Form Field Grouping (Forms, entry 14), which caps visible fields at seven.</p>
## Do
- Weigh the number of options before designing the choice: more options, more time to decide (3 choices are quick, 15 are slow)
- Pair it with the option-count thresholds in Field Control Thresholds
## Avoid
- Reading it as &ldquo;fewer options is always better&rdquo;; it says decision time grows with the number of options, nothing more
## Code: HTML
<pre><code><span class="cm">&lt;!-- 3 choices: quick to decide, all visible --&gt;</span>
<span class="tag">&lt;fieldset&gt;</span>
  <span class="tag">&lt;label&gt;&lt;input</span> <span class="prop">type</span>=<span class="str">"radio"</span> <span class="prop">name</span>=<span class="str">"plan"</span><span class="tag">&gt;</span> Starter<span class="tag">&lt;/label&gt;</span>
  <span class="tag">&lt;label&gt;&lt;input</span> <span class="prop">type</span>=<span class="str">"radio"</span> <span class="prop">name</span>=<span class="str">"plan"</span><span class="tag">&gt;</span> Growth<span class="tag">&lt;/label&gt;</span>
  <span class="tag">&lt;label&gt;&lt;input</span> <span class="prop">type</span>=<span class="str">"radio"</span> <span class="prop">name</span>=<span class="str">"plan"</span><span class="tag">&gt;</span> Scale<span class="tag">&lt;/label&gt;</span>
<span class="tag">&lt;/fieldset&gt;</span>

<span class="cm">&lt;!-- 15 choices: decision time grows with the number of options; the control to use is in Field Control Thresholds --&gt;</span>
<span class="tag">&lt;select</span> <span class="prop">name</span>=<span class="str">"region"</span><span class="tag">&gt;</span> <span class="cm">&lt;!-- 15 options --&gt;</span> <span class="tag">&lt;/select&gt;</span></code></pre>
