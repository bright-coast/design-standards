# Changelog

## 1.3.0 (16 Nov 2026)

Sharper rules for choosing a look that is your own, for a complete design contract, and for tables that keep their columns lined up.

- Visual Character now starts from the product's world (three concrete things its users handle all day), insists every font actually loads with a fallback stack, keeps monospace for codes, IDs and keys, sets 4.5:1 for any text in a colour, keeps the signature colour away from the danger red, and adds a drift check against the two default looks generators fall into, read back from the code.
- Project Design Contract now lists the seven sections a complete contract needs (world, typography and how it loads, colour with the accent and danger apart, radii, spacing, states, status badges with their contrast ratios) and what to do before any screen when the contract is missing, incomplete or complete.
- Data Table: one grid for the whole table, so header and rows cannot drift apart.
- The skill's instructions now settle the project's DESIGN.md before building new UI, and check the result from the code rather than from memory.

## 1.2.0 (15 Nov 2026)

Adds a rule for crowded toolbars and five rules that keep gradients vivid and readable.

- 1 new rule, bringing the library to 123.
  - Interaction: Crowded Toolbar: Six Fixes (keep three to five everyday tools, one accent, a word under every icon, rare tools behind More, groups by job, shortcuts for experts).
- Gradient Design gains five rules (interpolate in OKLCH, add a middle stop, route far-apart hues, add grain, keep stops calm behind text) and a "two variants, and when to use each" note: neighbouring hues only, or opposite hues with an OKLCH route.
- Hick's Heuristic now points to the toolbar rule.

## 1.1.0 (26 Oct 2026)

Adds 20 rules and enriches many more: checkout, pricing, success states, data states, phone checks, machine-made copy tells and more.

- 20 new rules, bringing the library to 122.
  - Interaction: Voice Message Recorder, Primary Button Anatomy, Before You Build: The Intent Brief, and UX Audit Order and Severity.
  - Forms: Checkout That Feels Safe, Form Colour Semantics, and Input Field Details.
  - Feedback: Success States, and Six Data States.
  - Visual: Equal-Height Cards in a Row, Pricing Table, Card Treatment System, Phone Check at 375px, 60-30-10 Colour Balance, Visual Character: One Decision per Axis, and Project Design Contract.
  - Motion: View Transitions.
  - The Psychology of the User Experience: Chunking.
  - AI Slop: Pricing Page Tells, and Copy That Reads Machine-Made.
- Richer guidance on existing rules, each kept as a "two variants, and when to use each" note: Context Menu (the safe triangle for submenus), Disabled Buttons, Drag and Drop (drop placeholders), Field Control Thresholds, Loading States System (the first moment of a wait), Undo UX (how long the toast stays), Empty States (illustration or text only) and Typography as a System (one font family or two). Perfect Card gains a note on its finish.
- The AI Slop Quick Checklist grows from 23 to 33 lines, with new writing, pricing page and card checks, and is now entry 9 of its category.
- The psychology index now points to Chunking.

## 1.0.0 (29 Sep 2026)

First release.

- A library of 102 design rules across nine categories: Interaction, Forms, Feedback, Visual, Motion, Navigation, Content, The Psychology of the User Experience, and AI Slop. Each rule has a live demo, a short explanation, what to do and what to avoid, and a code sketch.
- A browsable page that shows every rule, in a neutral theme that works in light and dark. It is one file that opens in any browser.
- A Claude skill that loads the rules a task needs, one category at a time, and starts every new screen with a checklist of the tells that make an interface look machine-made.
- To install it, ask Claude to install the Design Standards skill from the catalog. Every file is checked against a fingerprint in the catalog before it is put in place, and your own preferences live in a separate `local.md` that updates never touch.
- The rules are neutral by design: they never choose your colours, fonts or brand.
- Released under the Bright Coast AI Design Standards Licence 1.0, which lets you build the rules, code samples and patterns into your own work, including products you sell.
