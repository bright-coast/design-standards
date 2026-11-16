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
<p><strong>Run a mechanical pass over the code before writing findings.</strong> Search the code for each of these, because each one is a fact rather than an opinion: an outline removed with no focus style put in its place, an input with no label, an icon-only button with no accessible name, a click handler on something that is not a button or a link, a click target nested inside another click target, colour as the only way a meaning is shown, text contrast below AA (computed, not judged by eye), touch targets under 44px, a failure the person cannot recover from, a destructive call with no confirmation or undo, and the tells of overflow on a phone (fixed widths, rows that never wrap, 100vw, a wide table with no scroll region of its own). Every hit is its own finding in the table, never folded into one general line.</p>
<p><strong>Severity has a floor.</strong> A failure against WCAG level A or AA is at least P1, and so is any failure the person cannot recover from. A removed focus ring is P1, because a keyboard user is lost on the page; a focus ring that is only inconsistent is P3.</p>
<p><strong>Match the output to the word used.</strong> When someone asks for an audit or a review, give the full report. When they ask to fix or improve a screen, give the fixed code, with only two things above it: the inferred intent, and the three to five P0 or P1 findings the fix deals with.</p>
## Do
- Inferred intent written first, with every finding tied to it
- Every row names a specific element and an actionable fix
- Five to twelve findings sorted P0 first, then the top three in full, then what is working
- A mechanical code pass first, with every hit logged as its own finding
- WCAG A or AA failures, and failures with no recovery, ranked P1 or higher
- Fix or improve answered with fixed code, below the intent and the three to five P0 or P1 findings
## Avoid
- Vague advice such as &ldquo;consider improving the hierarchy&rdquo;
- More than twelve findings, or an audit with no what is working section
- A restyle that quietly changes logic or structure
- Padding the table with nitpicks to reach a target count
- A removed focus ring ranked as polish
## Extra: variant-note
<div class="variant-note"><b>How many findings, two variants.</b> Variant A: five to twelve findings, where more than twelve is a list of nitpicks and fewer than five is being too kind (the rule above). Use when: auditing a whole screen or flow that has never been reviewed. Variant B: no minimum count. A two-row table, or one line saying there is no P0 or P1, is a valid audit, and real findings past twelve go in a one-line Also found list under the table. Use when: the screen is small, has been reviewed before, or genuinely has few problems. Never invent findings to reach a number.</div>
## Code: TEXT
<pre><code>## Inferred intent
Primary user: ...   Primary action: ...   Worst case: ...

| # | Sev | Issue (named element)            | Why it matters        | Fix                               |
|---|-----|----------------------------------|-----------------------|-----------------------------------|
| 1 | P0  | Row Delete styled like Edit      | one misclick deletes  | move to overflow, typed confirm   |
| 2 | P1  | 12 columns, 3 decision-relevant  | overload on every row | cut to 5, rest in a detail view   |

&#35;&#35; Top 3 fixes (in full, with code)
&#35;&#35; What is working</code></pre>
