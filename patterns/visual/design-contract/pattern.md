---
id: design-contract
title: Project Design Contract
category: visual
order: 32
---
## Rule
<p>Generated screens drift: screen one uses one blue and 24px card padding, screen two a different blue and 16px, and screen three invents a third button style. Each is fine alone, and the set is incoherent. The fix is a written contract per project, a DESIGN.md at the project root that every new screen reads and obeys. <strong>Extract before inventing:</strong> if the project already encodes decisions (a Tailwind config or @theme block, :root custom properties, a theme or tokens file, or the variants of its most reused component), consolidate those into the contract, list the gaps, and decide only the gaps. <strong>Every value carries its reason:</strong> a token without a why is a preference, not a decision. The contract covers colour (surfaces, text, one accent used only for the primary action and key status, semantic status colours), type (family, scale, weights), spacing (base unit, scale, rhythm), shape and elevation (radii and the one separation language), motion (durations and easing), the component variants the project actually uses, and voice (tone, sentence case, verbs on buttons). A short honest file beats a padded template, and it never holds invented placeholder values.</p>
<p><strong>Enforcement is the point.</strong> Every new screen pulls colour, type, spacing, radius, shadow and motion from the contract. A value outside it is either an extension (proposed, added to the contract with its reason, then used) or flagged and replaced with the closest token; it is never invented silently, because silent invention is how drift starts. New component variants are extensions too. The contract is versioned with the code and updated in the same commit as the change it blesses, and when a token changes, the screens it affects get listed. Precedence runs from the owner&rsquo;s instruction, to the contract, to generic defaults. A one-off contradiction gets a one-line flag and is built; a run of them is a change of direction, so update the contract. No second screen gets built in a project that has neither a contract nor an explicit decision to go without one.</p>
## Do
- Existing tokens extracted into the contract before anything new is invented
- A one-line reason beside every value
- The contract updated in the same commit as the change it blesses
## Avoid
- A silently invented colour, size or radius outside the contract
- A contract filled from a template with made-up values
- A second screen built with no contract and no decision to skip one
## Code: MARKDOWN
<pre><code># Design System: habit tracker
Character: warm and encouraging, progress never guilt
&#35;&#35; Color
- --bg #FAF7F2 / --surface #FFFFFF: warm off-white; clinical white reads like a report card
- --accent #E8763A: only on Done today and streak highlights
&#35;&#35; Spacing
- base 4px; scale 4/8/12/20/32; airy, one habit at a time
<span class="cm">&lt;!-- off-system: a red streak banner was requested; extension proposed: --warning #D97742 --&gt;</span></code></pre>
