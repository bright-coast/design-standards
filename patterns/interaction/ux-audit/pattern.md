---
id: ux-audit
title: UX Audit Order and Severity
category: interaction
order: 32
---
## Rule
<p>An audit is useful when every line names one element and one concrete fix. Start by writing down the screen&rsquo;s inferred intent (primary user, primary action, worst case); if the intent is unclear, ask before critiquing, because critique without intent comes out wrong. Then rank every finding on four levels. <strong>P0</strong> breaks the primary flow or risks data loss or a wrong action (a destructive button with no confirmation, the primary action below the fold). <strong>P1</strong> degrades usability for most people (unclear tab labels, a twelve-column table, no empty state). <strong>P2</strong> is friction people will hit but get past (missing autocomplete hints, missing hover states). <strong>P3</strong> is polish (a toast that leaves too soon, an inconsistent focus ring). Five to twelve findings is the healthy range: more than twelve is a list of nitpicks, and fewer than five is being too kind.</p>
<p><strong>Walk the lenses in this order.</strong> Intent and hierarchy: the primary action is obvious in three seconds, there is one primary, destructive actions are not styled as primary, and values trace back to the project&rsquo;s tokens. Information architecture: grouped by the person&rsquo;s mental model, one scanning pattern, tables cut to five to seven columns. States: loading, empty, partial, error, success and offline (<a href="#lp-six-data-states">Six Data States</a>, Feedback entry 13). Affordance and feedback: clickable looks clickable, every state is designed, the focus ring is visible, targets are 44px, feedback lands inside 100ms, and friction matches the risk. Forms: seven visible fields at most, labels above, smart defaults, validation on blur, specific errors. Copy: verbs on buttons, tooltips that clarify, no Something went wrong, empty states that teach, you rather than the user. Accessibility: never colour alone, AA contrast on text, labelled icon buttons, focus order matching visual order, the whole flow usable by keyboard. Mobile: one column, no sideways scroll, a sticky primary action on long forms, modals the keyboard cannot cover. Perceived speed: skeletons that match the layout, optimistic updates where safe, progress on long work.</p>
<p><strong>Report shape.</strong> A table sorted P0 first with five columns: number, severity, issue, why it matters to a real person, and the fix. Then the three fixes worth the most, written out in full with code. Then what is working, so a good decision survives the rewrite. A review of a diff before merge uses the same scale grouped as must fix (P0 and P1), should fix (P2) and nice to fix (P3), each pointing at a file and line. A restyle pass is visual only: tokens, type, spacing, finish and interactive states change, while logic, structure and the meaning of the copy stay put, and any structural problem spotted on the way gets one flag line for the audit instead of a silent fix. If the owner disagrees with a finding, record the call once and move on.</p>
## Do
- Inferred intent written first, with every finding tied to it
- Every row names a specific element and an actionable fix
- Five to twelve findings sorted P0 first, then the top three in full, then what is working
## Avoid
- Vague advice such as &ldquo;consider improving the hierarchy&rdquo;
- More than twelve findings, or an audit with no what is working section
- A restyle that quietly changes logic or structure
## Code: TEXT
<pre><code>## Inferred intent
Primary user: ...   Primary action: ...   Worst case: ...

| # | Sev | Issue (named element)            | Why it matters        | Fix                               |
|---|-----|----------------------------------|-----------------------|-----------------------------------|
| 1 | P0  | Row Delete styled like Edit      | one misclick deletes  | move to overflow, typed confirm   |
| 2 | P1  | 12 columns, 3 decision-relevant  | overload on every row | cut to 5, rest in a detail view   |

&#35;&#35; Top 3 fixes (in full, with code)
&#35;&#35; What is working</code></pre>
