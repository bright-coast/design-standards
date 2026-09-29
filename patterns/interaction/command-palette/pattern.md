---
id: command-palette
title: Command Palette
category: interaction
order: 6
---
## Rule
<p>Cmd+K only works if the matching is fuzzy: typing &ldquo;stg&rdquo; should still surface &ldquo;Settings&rdquo; and &ldquo;Storage&rdquo;, because exact substring matching returns nothing and feels broken. Group results into labeled sections (Recent, Actions, Pages) so a long flat list reads as structure, and drive the whole thing from the keyboard: arrows move the highlight, Enter runs the selection, Escape closes. Never open to a blank void; prefill recent or suggested commands so there&rsquo;s a starting point before anyone types a character.</p>
## Do
- Prefill recent/suggested commands on open
- Inline spinner for async, never freeze the whole palette
## Avoid
- Exact substring matching that returns nothing for a fair guess
## Code: JS
<pre><code><span class="cm">// subsequence fuzzy match: "stg" matches "Settings" (s-t-...-g)</span>
<span class="kw">function</span> <span class="fn">fuzzyScore</span>(query, target) {
  <span class="kw">let</span> qi = <span class="num">0</span>;
  <span class="kw">const</span> t = target.toLowerCase(), q = query.toLowerCase();
  <span class="kw">for</span> (<span class="kw">const</span> ch <span class="kw">of</span> t) {
    <span class="kw">if</span> (qi &lt; q.length && ch === q[qi]) qi++;
  }
  <span class="kw">return</span> qi === q.length ? q.length / t.length : <span class="num">0</span>; <span class="cm">// 0 = no match</span>
}

<span class="kw">function</span> <span class="fn">searchCommands</span>(query, commands) {
  <span class="kw">if</span> (!query) <span class="kw">return</span> groupBy(recentAndSuggested, <span class="str">'section'</span>);
  <span class="kw">return</span> groupBy(
    commands
      .map(c => ({ ...c, score: fuzzyScore(query, c.label) }))
      .filter(c => c.score > <span class="num">0</span>)
      .sort((a, b) => b.score - a.score),
    <span class="str">'section'</span>
  );
}</code></pre>
