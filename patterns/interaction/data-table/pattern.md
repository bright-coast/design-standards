---
id: data-table
title: Data Table
category: interaction
order: 8
---
## Rule
<p>Sort is a three-state cycle, ascending, descending, back to the original order, not a binary toggle that loses the natural order forever. Numbers need <code class="tok">tabular-nums</code> and right-alignment so every digit lines up on the same grid; proportional left-aligned digits jitter and can&rsquo;t be compared at a glance. Keep the header sticky on vertical scroll and freeze the first column on horizontal scroll, and make the whole row the click target rather than a small checkbox-only hit area. Five to seven visible columns is the ceiling before it stops being a UI problem and starts being a data-design problem. Past that, cut columns or push them behind a detail view rather than shrinking type to fit. One column has to dominate: the identity column (name, title, ID) bolder or larger than the rest, so the eye has one obvious place to land per row. Actions belong on the far right, icon-only with a tooltip or collapsed into one overflow menu, never repeated as buttons across multiple columns.</p>
<p><strong>Cells, rows and row actions.</strong> Right-align numbers with tabular figures and left-align text: centred amounts are wrong because digits never line up, and a column of right-aligned tabular amounts reads like a receipt (it aligns the digits and makes them easy to compare, especially with decimals). Separate rows with one hairline and a hover highlight rather than zebra stripes (an opinion, see the note below). Treat row height as a decision, not padding: for example three settings, compact 40px, default 48px and comfortable 56px, which are demo values. Pin the identity columns and the header so context never leaves the screen when scrolling. An empty cell is a question (missing, zero or still loading?), so show a dash; truncate long text to one line with a tooltip on hover, and never truncate numbers. An action column on every row is noise (50 rows, 50 pencils): reveal row actions on hover or focus, give touch devices a kebab menu, and show a sort arrow only on the column that is actively sorted.</p>
## Do
- Sticky header + frozen first column
- Whole row as the click target
- A density toggle (comfortable/compact) as a first-class per-view setting
- One identity column visually dominant; actions collapsed to the far right
- A dash for an empty cell; text truncated to one line with a tooltip on hover; numbers never truncated
- Row actions revealed on hover or focus, a kebab menu on touch devices
- A sort arrow on the active column only
- One hairline between rows plus a hover highlight
## Avoid
- A binary sort that loses the original order permanently
- 10+ equal-weight columns with no dominant identity column
- Centred amounts, where digits never line up
- A pencil or button repeated on all 50 rows
- A blank cell that could mean missing, zero or still loading
## Extra: caveat-box
<div class="caveat-box"><b>Responsive collapse is a separate concern from desktop sort/density.</b> When the table has to fit a phone, shrinking the font isn&rsquo;t the fix; six moves restructure it instead: <strong>Rank</strong> (decide which columns actually matter), <strong>Stack</strong> (vertical card per row), <strong>Slot</strong> (secondary data into an expandable area), <strong>Label</strong> (inline labels once headers disappear), <strong>Reveal</strong> (progressive disclosure for the rest), <strong>Breakpoint</strong> (a defined point the transform triggers at). All six match established responsive-table practice.
            <div style="margin-top:10px;"><b>Phone-table detail.</b> Six columns need about 700px, so let the table own the breakpoint with one container query (<code class="tok">@container (max-width: 700px)</code>), not a screen-width media query; the same table then also collapses inside a narrow desktop side panel (it turns into cards there). The six moves in full: <strong>Rank</strong>, decide by use, not by position, which columns survive (identity, value, state); the ID column goes first, because nobody reads it on a phone. <strong>Stack</strong>, two lines per row with the name left and the amount right and status and due date underneath, so each row reads as one thumb-sized unit; do not scroll sideways, and avoid full cards because they kill comparison. <strong>Slot</strong>, keep the amount in one right-aligned slot so it is still a column of numbers (tabular digits). <strong>Label</strong>, label only the ambiguous (&ldquo;Due Mar 4&rdquo; needs a label, a dollar amount does not), and move sorting into a control. <strong>Reveal</strong>, hidden is not deleted: tap a row to expand two more fields in place (invoice ID, notes, actions), and open the full record in a bottom sheet, never a new page for a quick look. <strong>Breakpoint</strong>, the container query above. Where this wording of Stack and Slot differs from the shorthand in the paragraph above, this is the fuller version. The 700px figure is a demo number tied to six columns, not a rule. Prioritising columns, two-line stacked rows, bottom sheets and container queries are all standard responsive-table practice.</div></div>
## Extra: variant-note
<div class="variant-note"><b>Phone table, three variants held.</b> A: scroll sideways inside the table&rsquo;s own frame. Use when: you need the whole table structure kept and the alternative is cramming the columns. B: Stack as a vertical card per row (the six-move shorthand above; a narrow side panel turns into cards too). Use when: the container is narrow and the columns can restack. C: two-line stacked rows with no full cards (the phone-table detail, which says full cards kill comparison and not to scroll sideways). Use when: rows have to stay comparable at a glance. Cards or no cards, use whichever fits the content.</div>
## Extra: caveat-box
<div class="caveat-box"><b>Zebra stripes are an opinion, not a rule.</b> One view holds that stripes fight the content (every other row competes for attention for no reason), so it prefers one hairline between rows plus a hover highlight, and keeps stripes for very wide rows (12 columns). The case against stripes: they make the hover state ambiguous and the design heavier. Many table guidelines still recommend stripes for scanning long rows, so do not treat the hairline-plus-hover advice as settled.</div>
## Code: JS
<pre><code><span class="cm">// tri-state sort: null -> asc -> desc -> null (original order)</span>
<span class="kw">function</span> <span class="fn">nextSortState</span>(current) {
  <span class="kw">return</span> current === <span class="kw">null</span> ? <span class="str">'asc'</span> : current === <span class="str">'asc'</span> ? <span class="str">'desc'</span> : <span class="kw">null</span>;
}

<span class="kw">function</span> <span class="fn">sortRows</span>(rows, originalOrder, col, dir) {
  <span class="kw">if</span> (dir === <span class="kw">null</span>) <span class="kw">return</span> originalOrder; <span class="cm">// third click restores it</span>
  <span class="kw">const</span> sign = dir === <span class="str">'asc'</span> ? <span class="num">1</span> : -<span class="num">1</span>;
  <span class="kw">return</span> [...rows].sort((a, b) => sign * (a[col] > b[col] ? <span class="num">1</span> : -<span class="num">1</span>));
}</code></pre>
## Code: CSS: cells, rows, actions, phone breakpoint
<pre><code><span class="cm">/* cells: a dash for empty, one line with a tooltip, numbers never truncate */</span>
td.text { max-width: 220px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; } <span class="cm">/* put the full text in the title attribute */</span>
td.num  { text-align: right; font-variant-numeric: tabular-nums; } <span class="cm">/* no ellipsis on numbers, ever */</span>
td:empty::before { content: '\2013'; color: var(--text-muted); } <span class="cm">/* an empty cell is a question: answer it with a dash */</span>

<span class="cm">/* rows: one hairline plus a hover highlight, no zebra (an opinion, see the note above) */</span>
tbody tr { border-bottom: 1px solid var(--border); }
tbody tr:hover { background: var(--surface-hover); }
.row-compact { --row: 40px; } .row-default { --row: 48px; } .row-comfortable { --row: 56px; } <span class="cm">/* demo values */</span>

<span class="cm">/* actions: revealed on hover or focus, a kebab on touch; sort arrow on the active column only */</span>
.row-kebab { display: none; }
.row-actions { opacity: 0; }
tr:hover .row-actions, tr:focus-within .row-actions { opacity: 1; }
@media (hover: none) { .row-actions { display: none; } .row-kebab { display: inline-flex; } }
th:not([aria-sort="ascending"]):not([aria-sort="descending"]) .sort-arrow { visibility: hidden; }

<span class="cm">/* phone: the table owns the breakpoint (six columns need about 700px), a container query, not a screen width */</span>
.table-host { container: invoices / inline-size; }
@container invoices (max-width: 700px) {
  .invoice-row { display: grid; grid-template-columns: 1fr auto; } <span class="cm">/* name left, amount right */</span>
  .invoice-row .meta { grid-column: 1 / -1; } <span class="cm">/* status and due date underneath: two lines per row */</span>
}</code></pre>
