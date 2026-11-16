---
id: bulk-actions
title: Bulk Actions
category: interaction
order: 4
---
## Rule
<p>The header checkbox needs three real states, not two: empty, an indeterminate dash for a partial selection, and fully checked. Clicking while indeterminate should always resolve to select-all, never to clearing. When select-all only grabs the rows visible on screen, the affordance needs to name the true scope (&ldquo;Select all 247 matching&rdquo;), and that count has to stay live as filters change. Selection itself belongs in application state keyed by row ID, not in the DOM, so it survives pagination instead of silently resetting on the next page.</p>
<p><strong>Ranges and counts.</strong> Shift-click selects every row between the last clicked row and this one, and Shift with the arrow keys extends a selection from the keyboard. A bulk destructive button carries the count in its label (Delete 12 invoices), so the scope is read at the moment of the click, and the undo window behind it rests on a reversible soft delete.</p>
## Do
- Selection stored by ID, survives paging
- Undo window instead of a confirm modal on bulk delete
- Shift-click range selection, and Shift plus arrows from the keyboard
- The count in the bulk button label (Delete 12 invoices)
## Avoid
- A vague &ldquo;select all&rdquo; that hides the real scope
## Code: JS
<pre><code><span class="kw">let</span> selected = <span class="kw">new</span> Set(); <span class="cm">// row ids, not DOM refs, survives paging</span>

<span class="kw">function</span> <span class="fn">syncHeaderCheckbox</span>(totalMatching) {
  headerCheckbox.indeterminate = selected.size > <span class="num">0</span> && selected.size &lt; totalMatching;
  headerCheckbox.checked = selected.size === totalMatching && totalMatching > <span class="num">0</span>;
}

headerCheckbox.addEventListener(<span class="str">'click'</span>, (e) => {
  e.preventDefault(); <span class="cm">// we drive checked state manually</span>
  <span class="kw">if</span> (selected.size &lt; allMatchingIds.length) {
    selected = <span class="kw">new</span> Set(allMatchingIds); <span class="cm">// ALL matching, not just this page</span>
  } <span class="kw">else</span> {
    selected.clear();
  }
  syncHeaderCheckbox(allMatchingIds.length);
  render();
});</code></pre>
