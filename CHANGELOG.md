# Changelog

## 1.1.0 (October 2026)

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
