> A Bright Coast AI skill, made by Rob Lee. github.com/bright-coast/design-standards
> Copyright 2026 Bright Coast AI. For Bright Coast AI clients and people Bright Coast AI has given this link to. You may build what you find here into your own work; you may not republish or resell the material itself. See LICENSE at github.com/bright-coast/design-standards.

# Content

The words and page-level structure that carry as much weight as any component.

4 patterns. Use when: wording, headings and page-level structure.

## Empty States

A completely blank screen reads as broken to whoever lands on it. A small illustration or icon plus a short line of copy signals “this is intentionally empty,” not “something failed to load.” Give the screen exactly one clear primary CTA that names the actual next step (“Create your first project”), not a vague, generic action. Any empty state worth shipping answers three questions at once: why is this empty, what should the person do about it, and does the copy teach them something about the product rather than just stating a fact. Different causes need different copy, not one shared message. First-time use gets an onboarding CTA (“Create your first project”). A filtered or searched view that came back empty gets a clear-filter affordance (“No invoices match ‘overdue’, clear filter”). Missing permissions gets an explanation plus a real path forward (“You don't have access, ask your admin to share this”), not a dead end. Something genuinely empty by design gets a plain, calm confirmation (“All caught up, no pending reviews”) rather than treating an intentional zero like a problem. A bare “Try refreshing” as the only available action is rarely the real fix and reads as a shrug.

Do:
- One clear primary CTA, the actual next step
- Copy answers why it's empty and what to do, distinct per cause (first-run, filtered, permissions, by design)

Avoid:
- A generic “Try refreshing” as the only action

Code (JS):

```js
const EMPTY_STATES = {
  'first-run': { copy: 'No projects yet', cta: { label: 'Create your first project', action: createProject } },
  'filtered':  { copy: 'No results match your filters', cta: { label: 'Clear filters', action: clearFilters } },
  'error':     { copy: "Couldn't load projects", cta: { label: 'Retry', action: reload } },
}; // distinct copy per type, never one generic message for all three

function renderEmpty(type) {
  const { copy, cta } = EMPTY_STATES[type];
  return `<EmptyIllustration /><p>${copy}</p><button onclick="${cta.action}">${cta.label}</button>`;
}
```

## Landing Page Skeleton

Hero → Proof → Problem → Solution → CTA is the fixed order high-converting landing pages follow, because it mirrors how someone actually decides to trust a page: first orient (what is this), then trust (who else uses it), then feel the pain point, then see the fix, then act. The hero itself needs to answer what/who/why within about three seconds of landing, before anyone has scrolled at all. Repeat the same CTA at both the top and bottom of the page rather than making someone scroll all the way back up once they’re convinced. Burying social proof at the very bottom wastes it; it works hardest placed early, right after the hero.

Do:
- Hero answers what/who/why in ~3 seconds

Avoid:
- Burying social proof at the bottom

Code (HTML structure):

```html
<section class="hero">      <!-- answers what/who/why in ~3s -->
<section class="proof">     <!-- logos/testimonials, early, not buried at the bottom -->
<section class="problem">   <!-- the pain point, named specifically -->
<section class="solution">  <!-- how the product actually fixes it -->
<section class="cta-final"> <!-- SAME cta as the hero, not a scroll back up -->
```

## Microcopy

A button label should name the actual reward someone gets (“Create my free account”), not the raw mechanic behind it (“Submit”). The reward-framed version measurably converts better because it answers “what happens when I click this” in the label itself. An error message should turn into a concrete next step, not just a diagnosis of what went wrong. Labels stay persistently visible above their field rather than vanishing as placeholder text once typing starts. Cold system-speak like “operation failed” or “an error occurred” reads as the product blaming an abstraction instead of a plain-language explanation.

Do:
- Errors turn into a next step, not just a diagnosis

Avoid:
- Cold system-speak like “operation failed”

Code (JS):

```js
const COPY = {
  submitBtn: 'Create my free account',        // names the reward, not "Submit"
  cardDeclined: 'Card declined, try a different card or contact your bank.', // diagnosis + next step
  networkError: "Couldn't save, check your connection and try again.", // never "operation failed"
};
// label: persistent, never placeholder-only, see Form Field States above
```

## Serial Position

Recall across any sequence is U-shaped: people remember the first items strongly (primacy), the last items strongly (recency), and forget almost everything sandwiched in the middle. A navbar puts the logo first and the primary CTA last for exactly this reason; both sit in the high-recall positions by construction. On a landing page or pricing list, lead with the single strongest selling point and close with the single strongest piece of proof, and never let a genuinely critical CTA end up stranded in the low-recall middle of a long list of options.

Do:
- Logo leads a navbar, primary CTA closes it

Avoid:
- Burying a critical CTA in the low-recall middle

Code (HTML structure):

```html
<nav>
  <div class="logo">...</div>          <!-- first position, high recall -->
  <div class="nav-links">...</div>     <!-- middle, lowest recall, least critical items go here -->
  <button class="cta-primary">Sign up</button> <!-- last position, high recall -->
</nav>
<!-- pricing list: strongest USP first, strongest proof/guarantee last, nothing critical in the middle -->
```
