# Changelog

## 1.6.0 (19 Nov 2026)

Two new rules, Invoice Screen and Less Noise on a Busy Screen, and five rules made more specific: input fields, card shadows, premium motion, stagger spacing and the 60-30-10 accent.

- Invoice Screen (new, Forms): the amount due and a status pill first, with a viewed by client line, the due date and next steps under them; one client row instead of two address blocks; flat line rows with the total in bold; one solid button with quiet outline secondaries.
- Less Noise on a Busy Screen (new, Visual): on white, space groups the blocks and only the main block keeps a light card; no box inside a box; dividers start at the text, never under a section title; no carousel dots when the next card peeks.
- Input Field Details: six checks on every field, a visible label outside the field, 44px tall with 16px text (iOS zooms below 16px), a 2px outline focus ring at a 2px offset, a resting border at 3:1, errors after blur wired with aria-describedby, and the right type and autocomplete.
- Shadow Elevation: five fixes, two layers (contact plus lift), a tint from the background hue at about 8% instead of black at 25%, light from above, a three-step scale with one level per component, and a lighter surface with a one-pixel border in dark mode. New variant note on neutral versus accent-tinted shadows.
- Easing Curves: three details that make motion feel premium, a spring (stiffness 170, damping 21), a stagger of i times 70ms, and about 5% overshoot with a touch of motion blur and an optional landing sound. New variant note on a premium flourish versus a snappy tool.
- Animation Timing: new variant note on stagger spacing, 30 to 50ms for a cascade, about 70ms for a few hero elements, and past 80ms on a long list it feels like waiting.
- 60-30-10 Colour Balance: the 10% is what you click (the main button, one headline word, the light on the hero), with an example palette of warm ivory, deep navy and coral.

## 1.5.3 (19 Nov 2026)

Dropdown Design now says where the caret sits.

- Dropdown Design: the caret sits 12px in from the right edge with about 34px of right padding, set once for every select.
- Dropdown Design: avoid a caret jammed against the edge or text running under it.

## 1.5.2 (18 Nov 2026)

Data Table now says how light a row hover should be.

- Data Table: a row hover is the page background colour on the card, a step lighter than a button's hover grey.
- Data Table: avoid a row hover as dark as a button or chip hover, which makes every row the pointer crosses flash and look selected.

## 1.5.1 (16 Nov 2026)

Eight rules made more specific from a second pass over the same posts: their comments and the remaining carousel slides.

- Optimistic UI: a rollback is never silent; say what failed, with Retry.
- One Time Code: one verdict on the complete code, never per digit.
- Autosave: Cmd+S or Ctrl+S still saves at once.
- Grid System: fluid type keeps a rem term so text zoom still works.
- Typography System: text-wrap balance on headings and pretty on paragraphs.
- Dashboard Tells: forecasts and watch items stay neutral; red only for what needs action now.
- Keyboard Shortcuts: single-key shortcuts stay off while someone types.
- Avatar: use the status dot where a ring already means something else.

## 1.5.0 (16 Nov 2026)

Fifteen new rules, about sixty existing rules made more specific, and skill files that split themselves when a category grows too large.

- 15 new rules, bringing the library to 140.
  - Visual: Avatar; CSS Layout Foundations; Optical Corrections; Glass Panels.
  - Interaction: Permission Requests; Tree View; Keyboard Shortcuts; Pull to Refresh; CSS Before JavaScript.
  - Forms: Billing Page. Content: First Run Without a Tour. Navigation: Breadcrumbs.
  - Psychology: Decoy Effect; Engagement Traps; Dark Patterns. The last two are rules for what never to do to people, each with the honest alternative.
- Enriched across every category, among them Charts That Lie, Icon Rules, Shadow Elevation, Color Accessibility, Dark Mode, Gradients, Pricing Table, Toast Notifications, Tabs System, Focus States, Loading States, Error States, Date Picker, Command Palette, Chat UI, Swipe Actions, Bottom Sheets, Live Cursors and Fitts.
- New "use when" variants where two good approaches disagree: alpha or solid greys in dark mode, red or a domain colour for alerts, the 30 in 60-30-10, a 4px or 8px spacing unit, tooltip delay, a send button that waits for text, a native or custom date range picker, validating on blur or while typing, and a short shake for errors.
- A category reference that grows past the size limit is now split into parts automatically, each listing which rules it holds.

## 1.4.0 (16 Nov 2026)

Two new rules, sharper reviews and audits, and a skill that knows how to work on each kind of request.

- 2 new rules, bringing the library to 125.
  - Visual: Stacked Priority Order (on one column, the summary first, then what needs action, then supporting panels, with the DOM in that order).
  - Interaction: Design Rationale Comments (a code comment gives a reason the code cannot show, never a pointer to the brief or the conversation).
- UX Audit gains a mechanical pass over the code, a severity floor for accessibility failures, report or fix depending on what was asked, and a variant with no minimum number of findings.
- Six Data States gains a variant that builds only the states that can happen and marks the rest n/a with a reason. Error States gives system errors a three part message and a specific fallback.
- Enriched: Destructive Actions, Destructive Action Risk Tiers, Tooltip Design, Visual Hierarchy, Min-Width Zero, Data Table, Stepper Wizard, Password Field UX, Project Design Contract, The Intent Brief, Visual Character, Design Tokens, Success States, Loading States System, Grid System, Phone Check at 375px, Interactive State and Affordance, Disabled, Hover Trap, Focus States and Typography as a System.
- The skill's instructions now match effort to the change, and say how to review a screen, review a change before it merges, build new UI, design without code, restyle, and handle a request that goes against a rule.

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
