---
id: search-system
title: Search Experience System
category: interaction
order: 19
---
## Rule
<p>Placeholder copy is the first onboarding moment: &ldquo;Search&rdquo; tells someone nothing, &ldquo;Search by name, SKU, or brand&rdquo; tells them everything they can look for. An empty field isn&rsquo;t actually empty: load recent searches the moment the bar gets focus so one tap refills it. Rank autocomplete by clicks rather than alphabet and tag each suggestion with a category badge, keep the whole flow keyboard-driven, and treat a zero-results screen as a recovery moment (popular searches, category jumps) rather than a dead end.</p>
## Do
- Recent searches surfaced the moment the bar gets focus
- Zero-result screens offer a real recovery path
## Avoid
- A bare &ldquo;No matches&rdquo; dead end
## Code: JS
<pre><code>searchInput.addEventListener(<span class="str">'focus'</span>, () => {
  <span class="kw">if</span> (!searchInput.value) showResults(getRecentSearches()); <span class="cm">// not actually empty</span>
});

searchInput.addEventListener(<span class="str">'keydown'</span>, (e) => {
  <span class="kw">if</span> (e.key === <span class="str">'ArrowDown'</span>) moveHighlight(<span class="num">1</span>);
  <span class="kw">if</span> (e.key === <span class="str">'ArrowUp'</span>) moveHighlight(-<span class="num">1</span>);
  <span class="kw">if</span> (e.key === <span class="str">'Enter'</span>) selectHighlighted();
  <span class="kw">if</span> (e.key === <span class="str">'Escape'</span>) closeResults();
});

<span class="kw">function</span> <span class="fn">renderResults</span>(results, query) {
  <span class="kw">if</span> (results.length === <span class="num">0</span>) {
    <span class="kw">return</span> renderZeroState({ popular: getPopularSearches(), query }); <span class="cm">// recovery, not a dead end</span>
  }
  render(results.sort((a, b) => b.clickCount - a.clickCount)); <span class="cm">// ranked by usage, not A-Z</span>
}</code></pre>
