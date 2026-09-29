> A Bright Coast AI skill, made by Rob Lee. github.com/bright-coast/design-standards
> Copyright 2026 Bright Coast AI. For Bright Coast AI clients and people Bright Coast AI has given this link to. You may build what you find here into your own work; you may not republish or resell the material itself. See LICENSE at github.com/bright-coast/design-standards.

# Forms

Data entry is where trust is won or lost fastest, a form that fights back gets abandoned.

15 patterns. Use when: any input, validation, multi-step flow or settings screen.

## Autosave

Firing a save on every keystroke floods the network with redundant requests, so debounce writes to one clean save after roughly a second of pause. Status needs to be an honest state machine: idle, saving, saved, error, never a lie like a permanent “Saved” label that stopped being true the moment the network dropped. Queue edits made offline and replay them oldest-first on reconnect, and guard unsaved work with `beforeunload` so a stray tab-close doesn’t silently lose a paragraph.

Do:
- Queue edits offline, replay oldest-first on reconnect

Avoid:
- Silent last-write-wins across two open tabs

Code (JS):

```js
let saveTimer, status = 'idle';

function onEdit(value) {
  setStatus('idle');
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => save(value), 1000); // debounced, not per-keystroke
}

async function save(value) {
  setStatus('saving');
  try { await api.save(value); setStatus('saved'); }
  catch { setStatus('error'); queueOffline(value); } // replayed oldest-first on reconnect
}

window.addEventListener('beforeunload', (e) => {
  if (status === 'idle') e.preventDefault(); // unsaved edit pending
});
```

## Date Pickers

Presets (Today, Last 7 days, Last 30 days, This month) cover roughly 90% of real use, so lead with them and treat a full custom range as the fallback, not the default view. Show two months side by side so a range can cross a month boundary without extra navigation, and support full keyboard control including month/year jumps for anyone picking a date far from today rather than forcing repeated “next” clicks. On mobile, hand the job to the platform's native date input rather than shipping a custom calendar; reach for a custom one on desktop only once the native control genuinely can't do what the screen needs. Either way, keep a typed text field as a real fallback, and let it parse plain language such as “tomorrow” or “next friday” rather than demanding a strict format.

Do:
- Two months side by side, ranges cross boundaries
- A typed, parsed text field for far-past dates (birthdates), not arrow-only navigation
- Native date input on mobile; a custom calendar only where native genuinely falls short

Avoid:
- Repeated “next” clicks for a nearby date

Note: **Concrete cost of arrow-only navigation:** a calendar that opens on today's date makes a 1994 birthday cost roughly 390 clicks of a single arrow. Nobody does that, they abandon the form.

Code (JS):

```js
const PRESETS = [
  { label: 'Today', range: () => [today(), today()] },
  { label: 'Last 7 days', range: () => [daysAgo(7), today()] },
  { label: 'Last 30 days', range: () => [daysAgo(30), today()] },
  { label: 'This month', range: () => [startOfMonth(), today()] },
]; // custom range is a separate, secondary tab, not the default view

picker.addEventListener('keydown', (e) => {
  if (e.key === 'PageUp') shiftMonth(e.shiftKey ? -12 : -1); // shift+PageUp = year jump
  if (e.key === 'PageDown') shiftMonth(e.shiftKey ? 12 : 1);
});
```

## File Upload UX

Upload is a whole system of states, not a bare `<input type="file">`: drag-over feedback, honest per-file progress, error recovery, a preview once it lands, and a queue when multiple files go at once. Support drag-and-drop and a plain click-to-browse button together, never just one; not everyone drags, and not everyone notices a drop zone is a drop zone. Show percent complete plus a time-remaining estimate rather than an indeterminate spinner, since spinners give no sense of whether a large file is almost done or barely started. Once a file lands, let someone remove it before they submit, the same way they'd delete a wrong attachment from an email. On failure, retry inline with the same file still loaded in memory; forcing a full re-select after a failed 200MB upload is a real cost to whoever hit it.

Do:
- Drag-and-drop and click-to-browse both supported, not just one
- Percent + time-remaining, not a bare spinner
- Remove a file before submit, the same as deleting a wrong email attachment

Avoid:
- Forcing a full re-select after a failure

Code (JS):

```js
dropzone.addEventListener('dragover', e => { e.preventDefault(); dropzone.classList.add('drag'); });
dropzone.addEventListener('drop', e => {
  e.preventDefault(); dropzone.classList.remove('drag');
  [...e.dataTransfer.files].forEach(uploadWithProgress);
});

function uploadWithProgress(file) {
  const xhr = new XMLHttpRequest();
  const startedAt = performance.now();
  xhr.upload.onprogress = (e) => {
    const pct = Math.round((e.loaded / e.total) * 100);
    const rate = e.loaded / ((performance.now() - startedAt) / 1000);
    const etaSec = Math.round((e.total - e.loaded) / rate);
    updateRow(file, { pct, etaSec });
  };
  xhr.onerror = () => updateRow(file, { error: true, retry: () => uploadWithProgress(file) }); // file stays loaded
  xhr.open('POST', '/upload'); xhr.send(toFormData(file));
}
```

## Form Field States

Every field in a design system needs all six states actually designed, not improvised: default, focus, error, success, disabled, and loading. The label lives outside the field permanently. A placeholder pretending to be a label disappears the instant someone starts typing, so by the time they’re three fields deep they’ve forgotten what field four was asking for. Above the field is the right default placement: it scans fastest, works best on mobile, and survives translation into a longer language without crowding the control. A floating label that sits inside the field until focus is fine in genuinely tight spaces, but never on a multi-line textarea, where it collides with the first line typed. An inline label to the left of its control only earns its place on a wide settings page where label and control sit side by side on purpose. Placeholder text standing in as the only label is never acceptable at any width, it disappears exactly when someone needs it most. Errors need to combine colour with an icon and a written message; colour alone (a red border) is invisible to a colour-blind user and easy to miss at a glance regardless. Mark the exception, not the norm: label an optional field with a plain “(optional)” suffix rather than flagging every required field with an asterisk, since most fields in a well-scoped form should be required by design.

Do:
- Label outside the field, never placeholder-as-label
- Above the field by default; floating only in tight spaces, never on a textarea; inline-left only on a wide settings page
- “(optional)” on the exception, not an asterisk on every required field

Avoid:
- Border-only red, invisible to colour-blind users

Code (CSS):

```css
.field { display: flex; flex-direction: column; gap: 6px; }
.field label { font-size: 13px; font-weight: 600; } /* always visible, never a placeholder */

.field input { border: 1px solid var(--border); transition: border-color 150ms; }
.field input:focus { border-color: var(--accent); outline: 2px solid var(--accent-a20); }
.field.error input { border-color: var(--error); }
.field.success input { border-color: var(--success); }
.field input:disabled { background: var(--surface-muted); cursor: not-allowed; }

.field-msg.error { color: var(--error); display: flex; gap: 4px; align-items: center; }
.field-msg.error::before { content: '⚠'; } /* icon, not colour alone */
```

## Form Validation Timing

Validate on blur, once someone has finished with a field and moved on, not on every keystroke, which flags an email as invalid while it’s still half-typed, and not held back entirely until submit, which dumps every problem on the form at once. Once a field has errored, switch to live revalidation on every keystroke for that field alone, so the error clears the instant it’s actually fixed. Confirm correct fields too with a quiet success state, not just the broken ones; it tells someone they can stop worrying about that field. The message itself has three parts in order: what’s wrong, why it matters, how to fix it. So “Invalid email” becomes “This email is missing the @ symbol” or, for a taken address, “We already have an account with this email, sign in instead?”

Do:
- Live revalidation once a field has errored
- Message states what’s wrong and how to fix it, not just “Invalid”

Avoid:
- Dumping every error at submit, all at once

Code (JS):

```js
const errored = new Set();

input.addEventListener('blur', () => validate(input)); // first pass: on blur only
input.addEventListener('input', () => {
  if (errored.has(input.name)) validate(input); // live only once it has errored
});

function validate(field) {
  const ok = field.checkValidity();
  field.closest('.field').classList.toggle('error', !ok);
  field.closest('.field').classList.toggle('success', ok && field.value !== '');
  ok ? errored.delete(field.name) : errored.add(field.name);
}
```

## Input Masking

Group long numbers into readable chunks as they’re typed (a card number in 4-digit blocks, a phone number split by area code), and detect the card brand from the leading digit to show the right icon before the number is even complete. The caret needs to land after the character that was just typed, not jump to the end of the field, which is the usual bug in a hand-rolled mask. Store the raw digits internally and only format for display; validating the masked format on the very first keystroke rejects a perfectly valid number that just isn’t finished yet.

Do:
- Store raw digits, display the formatted grouping

Avoid:
- Validating format on the very first keystroke

Code (JS):

```js
function maskCardNumber(input) {
  const caretFromEnd = input.value.length - input.selectionStart;
  const digits = input.value.replace(/\D/g, '').slice(0, 16);
  input.value = digits.replace(/(\d{4})(?=\d)/g, '$1 '); // raw digits stored separately
  const pos = input.value.length - caretFromEnd;
  input.setSelectionRange(pos, pos); // caret follows the just-typed char
}

function detectBrand(digits) {
  if (/^4/.test(digits)) return 'visa';
  if (/^5[1-5]/.test(digits)) return 'mastercard';
  if (/^3[47]/.test(digits)) return 'amex';
  return null; // shown before the number is even complete
}
```

## OTP Input

Model the code as a single string in state, not six independent input boxes each tracking their own value; six-box implementations are where paste handling reliably breaks. Treat paste as the primary entry path rather than an edge case, since most codes are copied from an SMS or authenticator app, not typed digit by digit. Auto-advance focus to the next box as each digit lands, let backspace on an empty box jump back to the previous one, and gate resend behind a visible countdown so the retry button isn’t just sitting there inviting spam.

Tag the input with `inputmode="numeric"` and `autocomplete="one-time-code"`. Together they are what let a phone autofill the SMS code.

Colour is reserved for verdicts. Keep the UI neutral (light and grey) while the code is being entered: green appears only when the code is correct and red only when it is wrong, and those two are the only status colours in play. Keep those status colours separate from the brand accent, and see Color Accessibility (Visual, entry 03) for the second-signal rule that any colour-coded verdict still needs.

Do:
- Auto-advance focus, backspace jumps back a box
- `inputmode="numeric"` and `autocomplete="one-time-code"` on the input, so phones autofill the SMS code
- Neutral UI until a verdict: green only when the code is correct, red only when it is wrong

Avoid:
- A wrong code sitting silently, no shake/refocus
- Green or red on the boxes before the code has been judged

Note: **A flourish and an opinion, not a recommended pattern.** One popular animation moves the CSS `transform-origin` to the hub of a ring, so a plain `rotate()` draws an exact circle and the whole spin is two keyframes (`rotate(0deg)` to `rotate(450deg)` on an eased, wind-up-then-brake curve), with no path sampling. That is a sound, established CSS technique, worth knowing for decorative motion. As a UX choice it is a flourish: the choreography (four boxes swing onto a dotted ring, spin a turn and a quarter, settle into one green tile) adds about a second of delay after the person has already typed the code, and it is widely received as too much and machine-made. It is an animation demo, not a rule, and it is not part of this standard. How it is received is listed with the other tells in AI Slop: What Not To Do (entry 05).

Code (JS):

```js
let code = ''; // one string, not six independent box values

boxes[0].addEventListener('paste', (e) => {
  e.preventDefault();
  code = (e.clipboardData.getData('text').match(/\d/g) || []).slice(0, 6).join('');
  syncBoxes(); // paste is the primary path, not an edge case
  if (code.length === 6) submit(code);
});

boxes.forEach((box, i) => box.addEventListener('input', () => {
  code = code.slice(0, i) + box.value + code.slice(i + 1);
  if (box.value && boxes[i + 1]) boxes[i + 1].focus(); // auto-advance
}));
boxes.forEach((box, i) => box.addEventListener('keydown', (e) => {
  if (e.key === 'Backspace' && !box.value && boxes[i - 1]) boxes[i - 1].focus(); // jump back
}));

// phones autofill the SMS code when the input is tagged like this:
// <input inputmode="numeric" autocomplete="one-time-code">

// colour is reserved for verdicts: neutral while typing, green only if the code is correct, red only if it is wrong
// .otp-box.ok { border-color: var(--ok); }  .otp-box.bad { border-color: var(--bad); }  (the only two status colours)
```

## Password Field UX

Real strength is entropy: length matters far more than a symbol checkbox, which just pushes everyone toward “Password1!”-shaped passwords. Show the actual requirements checklist live as someone types, with each line ticking green the moment it’s satisfied, rather than surfacing the whole list only after a failed submit. Always pair a visibility toggle with a one-tap generate-a-strong-password option, and never block paste; a blocked paste breaks every password manager and pushes people toward weaker, memorable passwords instead.

Do:
- Visibility toggle + a one-tap generated password

Avoid:
- Hiding requirements until after a failed submit

Code (JS):

```js
const RULES = [
  { test: v => v.length >= 12, label: 'At least 12 characters' }, // length > symbol tricks
  { test: v => /[A-Z]/.test(v) && /[a-z]/.test(v), label: 'Upper and lower case' },
  { test: v => /\d/.test(v), label: 'At least one number' },
];

input.addEventListener('input', () => { // live checklist, shown from the first keystroke
  RULES.forEach((rule, i) => checklistItems[i].classList.toggle('met', rule.test(input.value)));
});

toggleBtn.addEventListener('click', () => input.type = input.type === 'password' ? 'text' : 'password');
generateBtn.addEventListener('click', () => { input.value = generateStrongPassword(16); input.dispatchEvent(new Event('input')); });
// no paste-blocking handler, password managers must be able to fill this field
```

## Range Sliders

Fill the track up to the thumb so the value reads at a glance without needing the number label, and make the entire row a draggable hit area rather than a thin 4px hairline that’s genuinely hard to grab on a touch screen. Snap to defined steps whenever clean values actually matter (percentages, price bands), and float the live numeric value in a small bubble above the thumb while dragging so precision doesn’t depend on reading a separate, disconnected label.

Do:
- Float the live value above the thumb while dragging

Avoid:
- A slider that can’t be driven by arrow keys

Code (CSS + JS):

```css
input[type=range] {
  -webkit-appearance: none; height: 32px; /* full row is the hit area, not a thin track */
  background: linear-gradient(90deg, var(--accent) var(--fill, 0%), var(--track) var(--fill, 0%));
  border-radius: 999px;
}
input[type=range]::-webkit-slider-thumb {
  -webkit-appearance: none; width: 20px; height: 20px; border-radius: 50%;
  background: var(--accent); box-shadow: 0 2px 6px rgb(0 0 0 / .2);
}

slider.addEventListener('input', () => {
  const pct = ((slider.value - slider.min) / (slider.max - slider.min)) * 100;
  slider.style.setProperty('--fill', pct + '%');
  bubble.textContent = slider.value; bubble.style.left = pct + '%'; // floats above the thumb
});
// native input[type=range] already supports arrow-key stepping, don't override onkeydown
```

## Settings System

Match the apply model to what’s actually at stake: a low-risk toggle (dark mode, notifications) applies instantly with no Save button, while a high-stakes identity field (email, billing) needs an explicit Save so a stray click can’t silently change something significant. Group settings by the task someone came to do, not by how the database happens to be organised, and make the whole page searchable once it passes roughly fifteen options. A destructive setting change belongs in a clearly separated danger zone, type-to-confirm gated.

Do:
- Group by task, make it searchable

Avoid:
- One flat list ordered by the data model

Code (JS):

```js
const SETTINGS = [
  { key: 'darkMode', group: 'Appearance', apply: 'instant' },   // low-risk, no Save button
  { key: 'email', group: 'Account', apply: 'explicit' },     // identity field, needs Save
  { key: 'deleteAccount', group: 'Danger zone', apply: 'confirm-typed' },
];

function onChange(setting, value) {
  if (setting.apply === 'instant') return save(setting.key, value); // fires immediately
  if (setting.apply === 'explicit') markDirty(setting.key, value);   // waits for Save click
  if (setting.apply === 'confirm-typed') openTypeToConfirm(setting);   // e.g. type account email to delete
}
```

## Stepper Wizard

Chunk a long form by meaning (Personal, Shipping, Payment, Review), not by an arbitrary field count that splits a logically single group across two steps. Validate inside each step and block the Next button until it’s valid, so a step-one mistake never surfaces for the first time at step four after everything else has already been filled in. Persist state across Back navigation and even a page refresh; losing a half-completed multi-step form to an accidental reload is one of the more infuriating things software still does.

Do:
- Validate inside each step, block Next until valid

Avoid:
- Surfacing a step-one error only at step four

Code (JS):

```js
const STEPS = ['personal', 'shipping', 'payment', 'review']; // chunked by meaning
let stepIndex = 0;
const formState = JSON.parse(localStorage.getItem('wizard-draft') || '{}'); // survives refresh

function goNext() {
  if (!validateStep(STEPS[stepIndex], formState)) return; // blocked here, not at review
  stepIndex++;
  localStorage.setItem('wizard-draft', JSON.stringify(formState));
  render();
}
function goBack() { stepIndex--; render(); } // formState untouched, nothing lost
```

## Toggle Anatomy

A good toggle morphs over roughly 250ms: the rail colour, the knob position, and the knob’s shadow all move together on the same curve, rather than snapping instantly between on and off. For an async toggle backed by a real API call, flip optimistically the instant it’s tapped and show a small spinner inside the knob itself while the request is in flight, rolling back with a shake if it fails. It must remain a real, focusable, keyboard- and screen-reader-operable control, built on `<button role="switch">` or a checkbox, never a plain `<div>` with a click handler.

Do:
- Rail colour, knob position, shadow move together

Avoid:
- A toggle that skips keyboard/screen readers

Code (CSS + JS):

```css
.toggle { position: relative; width: 44px; height: 26px; border-radius: 999px;
  background: var(--rail-off); transition: background 250ms ease; }
.toggle[aria-checked="true"] { background: var(--accent); }
.toggle .knob { position: absolute; top: 3px; left: 3px; width: 20px; height: 20px;
  border-radius: 50%; background: #fff; box-shadow: 0 1px 3px rgb(0 0 0 / .3);
  transition: transform 250ms ease; } /* same curve as the rail */
.toggle[aria-checked="true"] .knob { transform: translateX(18px); }

toggle.addEventListener('click', async () => {
  const next = toggle.getAttribute('aria-checked') !== 'true';
  toggle.setAttribute('aria-checked', String(next)); // optimistic flip
  try { await api.setSetting(next); }
  catch { toggle.setAttribute('aria-checked', String(!next)); } // roll back on failure
});
toggle.addEventListener('keydown', e => { if (e.key === ' ' || e.key === 'Enter') toggle.click(); });
```

## :has() Parent Queries

The `:has()` relational pseudo-class lets a parent's style react to what's inside it, closing off a whole category of state that used to require JavaScript just to toggle a class. Five uses worth knowing: **selection**, a pricing-plan card highlights itself with `.plan:has(:checked)` when its own radio is selected, no click handler. **Validation**, a field wrapper turns red with `.field:has(:user-invalid)` the moment its input fails constraint validation, live, with zero `onChange`/`useState`. **Layout**, a shell can switch to a two-column grid only when a specific child exists, e.g. `.app:has(aside)`, so layout follows what's actually in the DOM instead of a JS-tracked boolean prop. **Quantity**, a grid can query its own child count, e.g. `.plans:has(:nth-child(n+5))`, and switch to a denser layout once it crosses a threshold: a quantity query in pure CSS. **Document-level reaction**, `body:has(dialog[open])` can lock background scroll and dim the app the instant any dialog anywhere opens, in one rule, instead of a JS class toggled on every open/close. Browser support is broad but not universal (Chrome 105+, Safari 15.4+, Firefox 121+, Edge 105+); check the project's actual support target before relying on it for anything load-bearing.

Do:
- `.plan:has(:checked)` instead of a click handler + class toggle
- `:has(:user-invalid)` for live validation styling with zero JS state
- Check real browser-support targets before depending on `:has()`

Avoid:
- Reaching for a JS state toggle when the parent can just query its own children

Code (CSS):

```css
/* 01, selection: the card reacts to its own radio, no click handler */
.plan:has(:checked) { border-color: var(--accent); }

/* 02, validation: the wrapper reacts to its own input's validity, live */
.field:has(:user-invalid) { border-color: var(--err); }

/* 03, layout: follows the DOM, not a JS-tracked prop */
.app:has(aside) { grid-template-columns: 280px 1fr; }

/* 04, quantity: the grid counts its own children */
.plans:has(:nth-child(n+5)) { --density: compact; }

/* 05, document-level: any open dialog locks + dims the whole app */
body:has(dialog[open]) { overflow: hidden; }
body:has(dialog[open]) .app { opacity: .4; pointer-events: none; }
```

## Form Field Grouping

More than seven visible fields on one screen is a cognitive-load problem before it’s a layout problem. Reach for progressive disclosure, a multi-step wizard, or a collapsed “advanced” section, or go back and ask whether every field is actually needed rather than collected just in case. Group what remains by mental model, not by the shape of the database table behind it: “About you” / “How to reach you” / “Your preferences” reads as a conversation; `user_id, created_at, metadata` does not. Three to five fields per group is the ceiling. Past that, split into two groups with their own heading rather than one long one. Every field should carry a default that’s right for most people: country read from locale, currency matched to that country, a date field defaulting to today, time zone taken from the browser rather than asked for, notification preferences starting at “important only” rather than “all”, and any privacy choice starting on the more private option. None of that applies to a destructive or expensive choice, which is never defaulted on (“Yes, subscribe me to everything” starts unchecked, always).

Do:
- Groups named by task/mental model (“Shipping”, “Billing”), not by table name
- 3-5 fields per group before splitting into a new one
- Smart defaults for the 80% case (locale, currency, today's date, browser time zone); never for a destructive or costly choice

Avoid:
- 15 fields visible at once with no grouping, wizard, or progressive disclosure

Note: **The submit button carries the same discipline.** Its label names the action, “Create account” or “Send invoice”, never a bare “Submit”. It sits bottom right of the form on desktop and full width, sticky to the bottom, on mobile. A disabled state only ever appears with a visible reason attached, never a greyed-out button with no explanation. Loading swaps in a spinner and a “Saving…” label. After success, either navigate somewhere new or show a clear confirmation, never neither, silence after submitting reads as a failure even when it wasn't one.

Code (JSX):

```jsx
// grouped by mental model, 3-5 fields per group, 7-field ceiling before splitting into steps
<fieldset><legend>About you</legend>
  <Field label="Full name" />
  <Field label="Work email" />
</fieldset>
<fieldset><legend>Notifications</legend>
  <Field label="Frequency" defaultValue="important only" /> {/* smart default, not "all" */}
</fieldset>
<details><summary>Add company info (optional)</summary>
  <fieldset><Field label="Company" optional /><Field label="Job title" optional /></fieldset>
</details>
```

## Field Control Thresholds

The right control for a choice depends on how many options it holds, and the thresholds are concrete enough to apply without debate. Two or three options fit a segmented control or a small radio group, visible all at once with no extra tap. Four to seven options still fit visible radio buttons; that beats a dropdown at this size because every option is scannable without opening anything. Eight to fifteen options is where a dropdown earns its place, once the list is too long to show comfortably but still short enough to scroll by eye. Sixteen or more calls for a searchable combobox, and past fifty a dropdown should hand off to async search rather than trying to render the whole list at once. A checkbox and a toggle are not interchangeable either: a checkbox implies the change only takes effect once the form is explicitly saved, a toggle implies it applies the instant it's flipped, and mixing both metaphors on one screen makes someone guess which promise a given control is making.

Do:
- 4-7 options as visible radio buttons, not a dropdown
- 16+ options get a searchable combobox, not a long static list
- Checkbox for “applies on Save”, toggle for “applies now”, never mixed on one screen

Avoid:
- A 20-option dropdown with no search, forcing a scroll-and-squint

Variant: **Variant B of the dropdown search threshold.** A plain dropdown for 8 to 15 options, a searchable combobox from 16, async search past 50. Use when: you are picking the control from the option count. Variant A, search from about 10 items, is in Dropdown Design. Both are kept on purpose.

Code (Notes):

```
// option count decides the control, not house habit
function pickControl(optionCount) {
  if (optionCount <= 3) return 'segmented-or-radio';
  if (optionCount <= 7) return 'visible-radio-list';
  if (optionCount <= 15) return 'dropdown';
  if (optionCount <= 50) return 'searchable-combobox';
  return 'async-autocomplete';
}
```
