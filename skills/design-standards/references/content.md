> A Bright Coast AI skill, made by Rob Lee. github.com/bright-coast/design-standards
> Copyright 2026 Bright Coast AI. For Bright Coast AI clients and people Bright Coast AI has given this link to. You may build what you find here into your own work; you may not republish or resell the material itself. See LICENSE at github.com/bright-coast/design-standards.

# Content

The words and page-level structure that carry as much weight as any component.

5 patterns. Use when: wording, headings and page-level structure.

## Empty States

A completely blank screen reads as broken to whoever lands on it. A small illustration or icon plus a short line of copy signals “this is intentionally empty,” not “something failed to load.” Give the screen exactly one clear primary CTA that names the actual next step (“Create your first project”), not a vague, generic action. Any empty state worth shipping answers three questions at once: why is this empty, what should the person do about it, and does the copy teach them something about the product rather than just stating a fact. Different causes need different copy, not one shared message. First-time use gets an onboarding CTA (“Create your first project”). A filtered or searched view that came back empty gets a clear-filter affordance (“No invoices match ‘overdue’, clear filter”). Missing permissions gets an explanation plus a real path forward (“You don't have access, ask your admin to share this”), not a dead end. Something genuinely empty by design gets a plain, calm confirmation (“All caught up, no pending reviews”) rather than treating an intentional zero like a problem. A bare “Try refreshing” as the only available action is rarely the real fix and reads as a shrug.

**A blank document is an empty state too.** When someone creates a new document, put the cursor in its first input (the title) so they can type straight away; do this only on create, never on every page load, where stealing focus would jump a keyboard or screen reader user. One short placeholder line can teach the main shortcut instead of a tutorial (Type / for commands). Starting templates can sit below it as a short list of options, and they disappear on the first keystroke, so they help the person who wants them and never stand in the way of the person who already knows what to write.

Do:
- One clear primary CTA, the actual next step
- Copy answers why it's empty and what to do, distinct per cause (first-run, filtered, permissions, by design)
- A new document opens with focus in its first field, on create only
- One placeholder hint that teaches the main shortcut; templates that vanish on the first keystroke

Avoid:
- A generic “Try refreshing” as the only action
- A tutorial overlay on a blank editor where one hint line would do

Variant: **Illustration, two variants.** Variant A: a small illustration or icon plus a short line of copy (this entry). Use when: the design system has illustrations or icons ready for empty states. Variant B: text only, with the copy doing all the teaching. Use when: there is no illustration set yet, since a borrowed or generic picture is worse than none. Both are kept on purpose.

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

The same shape applies to an onboarding sequence. The first step is the hook, the one thing that shows why the product is worth the setup; the last step is the payoff, the moment the person sees their own result. Lower-value steps (preferences, notification settings) go in the middle, or move out of onboarding altogether (First Run Without a Tour, entry 05).

Do:
- Logo leads a navbar, primary CTA closes it
- Onboarding opens on the hook and ends on the payoff, with lower-value steps in the middle

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

## First Run Without a Tour

A product tour is a slideshow people skip, and every slide stands between them and the product. Replace it with a first run that puts them in the real app almost at once. **Ask the minimum, ideally one question, then open the app:** ask only what changes what they see first (What do you want to track first?), and leave role, company size and preferences for later, when there is a reason to ask. Every extra question before the app appears is another chance to close the tab.

**Open on a short checklist that has already started:** three tasks, with one genuine item already ticked (Account created, 1 of 3), so the first screen shows progress under way rather than a blank start (Zeigarnik Effect, Feedback entry 09). Empty areas show one clear action, not a blank list (Empty States, entry 01). **Coach marks, one at a time:** at most one is visible at any moment, anchored to the control it explains and shown at the moment that control is next needed, near the thumb on a phone; never a sequence of tooltips laid over the whole screen on load. **Skip and return:** the Skip control stays in the same place on every step, and the checklist remembers progress when the person comes back, so leaving early costs nothing.

Do:
- One question at most before the real app appears
- A three-item checklist with one real step already ticked
- One coach mark at a time, beside the control it explains, when it is next needed
- Skip in one fixed place; progress remembered on return

Avoid:
- A multi-slide tour before the product appears
- A setup form of questions that change nothing on the first screen
- Several tooltips shown at once over the whole interface

Code (JS):

```js
const checklist = [
  { key: 'account', label: 'Create your account', done: true }, // genuinely done: 1 of 3
  { key: 'first-item', label: 'Add your first budget', done: false },
  { key: 'invite', label: 'Invite someone', done: false },
];
let activeHint = null; // at most one coach mark on screen
function showHint(anchorEl, text) {
  activeHint?.remove();
  activeHint = placeBeside(anchorEl, text); // beside the control it explains, when it is next needed
}
localStorage.setItem('onboarding', JSON.stringify(checklist)); // remembered on return
```
