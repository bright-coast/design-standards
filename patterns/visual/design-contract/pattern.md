---
id: design-contract
title: Project Design Contract
category: visual
order: 32
---
## Rule
<p>Generated screens drift: screen one uses one blue and 24px card padding, screen two a different blue and 16px, and screen three invents a third button style. Each is fine alone, and the set is incoherent. The fix is a written contract per project, a DESIGN.md at the project root that every new screen reads and obeys. <strong>Extract before inventing:</strong> if the project already encodes decisions (a Tailwind config or @theme block, :root custom properties, a theme or tokens file, or the variants of its most reused component), consolidate those into the contract, list the gaps, and decide only the gaps. <strong>Every value carries its reason:</strong> a token without a why is a preference, not a decision. The contract covers colour (surfaces, text, one accent used only for the primary action and key status, semantic status colours), type (family, scale, weights), spacing (base unit, scale, rhythm), shape and elevation (radii and the one separation language), motion (durations and easing), the component variants the project actually uses, and voice (tone, sentence case, verbs on buttons). A short honest file beats a padded template, and it never holds invented placeholder values.</p>
<p><strong>Enforcement is the point.</strong> Every new screen pulls colour, type, spacing, radius, shadow and motion from the contract. A value outside it is either an extension (proposed, added to the contract with its reason, then used) or flagged and replaced with the closest token; it is never invented silently, because silent invention is how drift starts. New component variants are extensions too. The contract is versioned with the code and updated in the same commit as the change it blesses, and when a token changes, the screens it affects get listed. Precedence runs from the owner&rsquo;s instruction, to the contract, to generic defaults. A one-off contradiction gets a one-line flag and is built; a run of them is a change of direction, so update the contract. No second screen gets built in a project that has neither a contract nor an explicit decision to go without one.</p>
<p><strong>A complete contract has seven sections with real values.</strong> The product&rsquo;s world in one line; typography, with how each family loads; colour tokens as hex values, with the accent and the destructive colour at least 40 degrees of hue apart; radii, with where each applies; spacing, its base unit and scale; states (hover, focus and disabled), each derived from the tokens; and status badges, each with its text colour, its tint and the contrast ratio written down (at least 4.5:1). No placeholder survives (no [choice], TODO or TBD), and &ldquo;not measured&rdquo; leaves a section incomplete. <strong>Settle it before any screen, in one of three states.</strong> Absent: write it, and the tokens in the code; when nobody can answer the questions (an unattended run, a handed-over task), decide from the product&rsquo;s world and mark the header (assumed, confirm before shipping). Incomplete: add the missing sections and nothing else. Every value, family and colour already there stays exactly as written, because it is the brand, and a missing value is derived from an existing token (color-mix(in oklab, var(--danger) 12%, white)) rather than a new hex, with the contract line naming the token it comes from. Complete: follow it.</p>
<p><strong>The design-system interview.</strong> When the contract has to be written from scratch and someone can answer, ask at most five questions, all in one message: what the product is, who uses it and the mood it should carry, the character direction, the fixed constraints (brand colours, fonts, platform), and what someone should feel in the first three seconds. If an intent brief already exists, reuse its answers and never ask the same thing twice.</p>
<p><strong>Make every later session read it.</strong> After writing DESIGN.md, ask once whether to add a short pointer to it in the project&rsquo;s CLAUDE.md or AGENTS.md, and with a yes, add it, so every later session reads the contract before building a screen.</p>
## Do
- Existing tokens extracted into the contract before anything new is invented
- A one-line reason beside every value
- The contract updated in the same commit as the change it blesses
- All seven sections filled, with each status contrast ratio written
- At most five interview questions, in one message, reusing the intent brief
- A short pointer to DESIGN.md in CLAUDE.md or AGENTS.md, after asking once
## Avoid
- A silently invented colour, size or radius outside the contract
- A contract filled from a template with made-up values
- A second screen built with no contract and no decision to skip one
- Rewriting a value already in the contract while filling a gap
- Re-asking a question the intent brief already answered
## Code: MARKDOWN
<pre><code># Design System: habit tracker
Character: warm and encouraging, progress never guilt
&#35;&#35; Color
- --bg #FAF7F2 / --surface #FFFFFF: warm off-white; clinical white reads like a report card
- --accent #E8763A: only on Done today and streak highlights
&#35;&#35; Spacing
- base 4px; scale 4/8/12/20/32; airy, one habit at a time
&#35;&#35; States
- hover: accent at 90%; focus: 2px ring in --accent; disabled: 40% opacity
&#35;&#35; Status and badges
- done: #166534 on #DCFCE7, 6.5:1
- missed: #9A3412 on #FFEDD5, 6.4:1
<span class="cm">&lt;!-- off-system: a red streak banner was requested; extension proposed: --warning #D97742 --&gt;</span></code></pre>
