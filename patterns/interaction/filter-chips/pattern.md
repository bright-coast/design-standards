---
id: filter-chips
title: Filter Chips
category: interaction
order: 13
---
## Rule
<p>Every chip needs three visually distinct states: idle, active (filled + check), disabled (dimmed), because if active looks like idle the filter reads as broken. The combination logic should be legible: OR within a group widens the net, AND across groups narrows it. Update the result count on the same frame as the tap, since a number that doesn&rsquo;t move reads as &ldquo;nothing happened&rdquo; and gets tapped twice. Always ship one clear-all reset paired with a live count, and let overflowing chips scroll horizontally with an edge fade rather than wrapping into a wall.</p>
## Do
- Result count updates the same frame as the tap
- Single clear-all reset with a live count
## Avoid
- Active chips that look identical to idle ones
## Code: JS
<pre><code><span class="kw">const</span> active = { colors: <span class="kw">new</span> Set(), sizes: <span class="kw">new</span> Set() }; <span class="cm">// OR within a group</span>

<span class="kw">function</span> <span class="fn">matches</span>(item) {
  <span class="kw">return</span> Object.entries(active).every(([group, values]) => <span class="cm">// AND across groups</span>
    values.size === <span class="num">0</span> || values.has(item[group])
  );
}

<span class="kw">function</span> <span class="fn">applyFilters</span>() {
  <span class="kw">const</span> matching = allItems.filter(matches);
  countEl.textContent = <span class="str">`${matching.length} matching`</span>; <span class="cm">// same frame as the tap</span>
  render(matching);
}
clearAllBtn.addEventListener(<span class="str">'click'</span>, () => {
  Object.values(active).forEach(s => s.clear());
  applyFilters();
});</code></pre>
