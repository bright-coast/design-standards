> A Bright Coast AI skill, made by Rob Lee. github.com/bright-coast/design-standards
> Copyright 2026 Bright Coast AI. For Bright Coast AI clients and people Bright Coast AI has given this link to. You may build what you find here into your own work; you may not republish or resell the material itself. See LICENSE at github.com/bright-coast/design-standards.

# Forms

Data entry is where trust is won or lost fastest, a form that fights back gets abandoned.

20 patterns. Use when: any input, validation, multi-step flow or settings screen.

## Autosave

Firing a save on every keystroke floods the network with redundant requests, so debounce writes to one clean save after roughly a second of pause. Status needs to be an honest state machine: idle, saving, saved, error, never a lie like a permanent “Saved” label that stopped being true the moment the network dropped. Queue edits made offline and replay them oldest-first on reconnect, and guard unsaved work with `beforeunload` so a stray tab-close doesn’t silently lose a paragraph.

The full set of states is six, each with its own honest label: **idle** (nothing to save), **unsaved** while the person is typing and the debounce has not fired yet (Editing… or Unsaved changes), **saving**, **saved** (Saved 2 min ago), **offline** (Offline, changes kept on this device, with the edits queued locally), and **error** (Not saved, Retry). Offline is not an error: nothing is lost, and the label says so.

**Save on Cmd+S or Ctrl+S anyway.** Many people press it out of habit, and some only trust a save they asked for. Catch the shortcut, save immediately instead of waiting for the debounce, and confirm with the same Saved label, rather than letting the browser open its own Save Page dialog.

Do:
- Queue edits offline, replay oldest-first on reconnect
- Separate unsaved and offline states, so the label is never wrong
- Cmd+S or Ctrl+S saves at once and shows the Saved label

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

**Picking a range.** The first click sets the start and the second sets the end; between them, hovering a date previews the range as it would be, so people see the span before they commit. Once set, both edges can be dragged to adjust the range without starting again. On wide screens (about 1200px and up) show a third month, so a range of several weeks fits without paging.

Do:
- Two months side by side, ranges cross boundaries
- Two clicks for a range, a hover preview between them, and draggable edges once set
- A typed, parsed text field for far-past dates (birthdates), not arrow-only navigation
- Native date input on mobile; a custom calendar only where native genuinely falls short

Avoid:
- Repeated “next” clicks for a nearby date

Note: **Concrete cost of arrow-only navigation:** a calendar that opens on today's date makes a 1994 birthday cost roughly 390 clicks of a single arrow. Nobody does that, they abandon the form.

Variant: **Mobile date picking, two variants.** Variant A: hand the job to the platform’s native date input (this entry). Use when: picking a single date, which native inputs do well. Variant B: a full-screen sheet with months scrolling vertically, the range filled in as it is picked, and a large confirm button fixed at the bottom (Select 12 to 15 Mar). Use when: picking a range, which native inputs handle poorly, since they need two separate fields and show no span between them. Both are kept on purpose.

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

**Placeholder colour.** Placeholder text looks clearly lighter than a typed value, so an example never reads as an answer already filled in, yet it is still text and still meets 4.5:1 against the field. On a white field, typed values near #1F2933 and placeholders near #6B7280 (about 4.8:1) keep both apart and both readable.

**Reserve the error slot.** Every field keeps a fixed line under it for its message, about 20px tall and empty until needed, so an error appearing never pushes the fields below it or the submit button down the page.

**Loading, specified.** While a field checks a value against the server (is this username free?), a small spinner sits inside the field at its trailing edge, the field stays editable, and submit is locked until the check settles, so a value nobody has checked yet cannot be sent twice or sent at all.

Do:
- Label outside the field, never placeholder-as-label
- Above the field by default; floating only in tight spaces, never on a textarea; inline-left only on a wide settings page
- “(optional)” on the exception, not an asterisk on every required field
- Placeholder visibly lighter than typed text, and still 4.5:1
- A reserved message line under each field, so an error never shifts the layout
- An in-field spinner during an async check, with submit locked until it settles

Avoid:
- Border-only red, invisible to colour-blind users
- An error message that pushes the submit button down when it appears

Variant: **Placeholder colour, two variants.** Variant A: the placeholder is visibly lighter than the typed value, both at 4.5:1 or better (this entry). Use when: a stacked form with labels above fields, where the placeholder shows an example answer. Variant B: placeholders and typed values share one secondary grey, right aligned, because grey means you type here (Form Colour Semantics, entry 17). Use when: a settings-style row form where the label sits on the left of each row. Both are kept on purpose.

Code (CSS):

```css
.field { display: flex; flex-direction: column; gap: 6px; }
.field input::placeholder { color: #6B7280; } /* lighter than typed text, still 4.8:1 on white */
.field-msg { min-height: 20px; } /* reserved: an error never moves the submit button */
.field.loading { background: url(spinner.svg) no-repeat right 10px center / 16px; } /* async check in the field */
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

**On submit, add a summary.** When a submit fails with errors still open, show a short error summary at the top of the form (2 fields need attention) in addition to the inline messages, with each item a link that scrolls to its field and puts focus in it. Move focus to the summary itself when it appears, so a screen reader announces it and a keyboard user starts from it.

Do:
- Live revalidation once a field has errored
- Message states what’s wrong and how to fix it, not just “Invalid”
- An error summary at the top on a failed submit, each item linking to and focusing its field

Avoid:
- Dumping every error at submit, all at once

Variant: **When checking starts, two variants.** Variant A: validate on blur, and live on every keystroke only once a field has errored (this entry). Use when: the field is checked against a format or a rule the person cannot see, such as an email address or a card number. Variant B: check while the person types, from the first character. Use when: the requirements are shown as a live checklist the person is working through, such as password rules ticking off (8 characters, a number) or a username availability check after a 500ms pause; there the feedback is guidance, not an error, and it never turns red mid-typing. Both are kept on purpose; A is the default.

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

A pasted value is cleaned, never rejected: strip the spaces, dashes and dots people copy from statements and emails (4242-4242-4242-4242), keep the digits, and reformat them into the field’s own grouping. The same goes for a pasted phone number with brackets or a leading country code the field already shows.

Do:
- Store raw digits, display the formatted grouping
- Strip separators from a pasted value and reformat it

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

**Judge the whole code, never one box.** The verdict is for the complete code only. Marking single digits right or wrong as they are typed turns the code into a guessing game, because each box can be tried until it turns green; one verdict on the full entry keeps it a secret.

Do:
- Auto-advance focus, backspace jumps back a box
- `inputmode="numeric"` and `autocomplete="one-time-code"` on the input, so phones autofill the SMS code
- Neutral UI until a verdict: green only when the code is correct, red only when it is wrong
- One verdict on the complete code, never per digit

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

A strength meter belongs on account creation only, never on the login form, where it judges a password that already exists and helps nobody. Set `autocomplete="current-password"` on login and `autocomplete="new-password"` where a new password is chosen, so password managers fill the right one and offer to generate a new one.

Do:
- Visibility toggle + a one-tap generated password
- `autocomplete="current-password"` on login, `autocomplete="new-password"` on account creation

Avoid:
- Hiding requirements until after a failed submit
- A strength meter on the login form

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

A minimum and maximum range is one slider with two thumbs, not two separate sliders. The track fills between the thumbs, the thumbs cannot cross (dragging the low thumb stops one step below the high one), and each thumb is its own focusable control with its own label (Minimum price, Maximum price). On the keyboard, the arrow keys move one step, Page Up and Page Down move a bigger step, and Home and End jump to the ends of the range.

Do:
- Float the live value above the thumb while dragging
- Two thumbs in one control for a min and max range, filled between them, never crossing
- Arrow keys for one step, Home and End to jump to the ends

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

**Five more decisions.** Label every step and keep the total visible (Step 2 of 4, Shipping), so people know how far they have to go. Show a full summary of everything entered before the final submit, with a way to edit each part. Give each step one primary action. Never auto-advance when the last field is filled; people move on when they choose to. Make save and continue later easy to find, so a long form never has to be finished in one sitting.

A Skip control, where a step can be skipped, sits in the same place on every step, so people never hunt for it; a skip that moves from corner to corner reads as a trap. Progress is remembered when someone leaves and comes back.

Do:
- Validate inside each step, block Next until valid
- Labelled steps with the total count visible
- A full summary before the final submit
- One primary action per step, and an easy save and continue later
- Skip in one fixed position across every step

Avoid:
- Surfacing a step-one error only at step four
- Auto-advancing to the next step when the last field is filled

Variant: **Step layout, two variants.** Variant A: one step per screen with Next and Back (this entry). Use when: the steps are long, or each needs the full screen. Variant B: every step on one screen, asked one at a time, and each finished step collapses into a single summary line (Where: Lisbon; When: 12 to 15 Mar) that reopens when tapped. Use when: each step is one or two inputs, such as a search or booking flow, so the whole journey stays visible and editable. Both are kept on purpose.

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

**Geometry.** The rail is about twice as wide as the knob’s diameter, and the padding around the knob is small and equal on every side, so the knob sits evenly inside the rail in both positions; a 20px knob in a 44 by 26px rail with 3px of padding is a good default. **Motion:** when a visible state label sits beside the switch (On, Off), it changes in the same motion as the rail and knob, on the same ease-out curve, never a beat later. **Keyboard and state:** Space toggles it, a visible focus ring shows on keyboard focus, and the state is exposed with `aria-checked` so a screen reader says on or off.

Do:
- Rail colour, knob position, shadow move together
- Rail about twice the knob diameter, with even padding around the knob
- The state label changes with the rail and knob, on the same ease-out curve
- Space toggles, a visible focus ring, state in `aria-checked`

Avoid:
- A toggle that skips keyboard/screen readers

Code (CSS + JS):

```css
.toggle { position: relative; width: 44px; height: 26px; border-radius: 999px;
  background: var(--rail-off); transition: background 250ms ease-out; }
.toggle[aria-checked="true"] { background: var(--accent); }
.toggle .knob { position: absolute; top: 3px; left: 3px; width: 20px; height: 20px;
  border-radius: 50%; background: #fff; box-shadow: 0 1px 3px rgb(0 0 0 / .3);
  transition: transform 250ms ease-out; } /* same curve as the rail */
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

Variant: **Variant C of the option-count thresholds.** A segmented control for 2 to 4 exclusive options that must stay in view (7 segments is too many); visible radios up to 5; more than 5 becomes a dropdown, because a longer radio list pushes the rest of the settings off screen. Use when: the choice sits in a settings page with other controls below it. Variant B (visible radios to 7, dropdown 8 to 15) suits a choice that has the screen to itself. All kept on purpose.

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

## Checkout That Feels Safe

Five quiet decisions make a payment form feel safe. **The total stays in view:** the order summary is sticky beside the form (the form moves, the summary does not), and the amount on the pay button matches the order total exactly (Pay $148.00 under Total due $148.00), so nothing changes at the last step; short trust lines sit under it (card details are encrypted, free returns within 30 days). **The card is recognised on digit one:** the brand badge appears from the first digit (4 is Visa, 5 is Mastercard, 3 is Amex); recognised first, judged later.

**Red waits until the field is left:** nothing turns red while the number is being typed; the field is checked on blur (Your card number is incomplete.), and once flagged it stays flagged on every keystroke until it is fixed. This is Form Validation Timing (Forms, entry 05) applied to the card field. **The fastest way to pay sits on top:** Apple Pay and Google Pay above every card field, one tap and no typing against six fields, with an Or pay with card divider below. **Eyes go straight down:** one column with every label above its field, so the eye path is one line and the label stays visible while typing; a two-column grid with placeholder-only labels makes the eye jump seven times.

**Moving money gets one review screen.** Before a transfer or payment is confirmed, one screen repeats the four things that matter together: who receives it, the amount, the fee, and when it will arrive (To Acme Supplies, $2,400.00, fee $0.00, arrives tomorrow by 5pm). The confirm button repeats the amount. Nothing on that screen is new information; it is the last chance to catch a wrong recipient or a wrong figure.

Do:
- Pay button amount identical to the order total
- A review screen with recipient, amount, fee and arrival time together before confirm
- Card brand badge from the first digit
- Wallets above every card field
- One column, labels above fields

Avoid:
- A card number flagged red on the first keystroke
- Placeholder-only labels that vanish while typing
- A two-column payment grid

Code (HTML + JS):

```html
<!-- one column, labels above, wallets first, summary pinned -->
<form class="pay">
  <div class="wallets"><button>Apple Pay</button><button>Google Pay</button></div>
  <p class="divider">Or pay with card</p>
  <label>Card number <input id="cc" inputmode="numeric" autocomplete="cc-number"></label>
  <button>Pay $148.00</button> <!-- same figure as Total due -->
</form>
<aside class="summary">Total due $148.00</aside>

.summary { position: sticky; top: 24px; } /* the form moves, the summary does not */
cc.addEventListener('input', () => {
  badge.dataset.brand = { '4': 'visa', '5': 'mastercard', '3': 'amex' }[cc.value[0]] || ''; // digit one
  if (cc.dataset.flagged) validate(cc); // once flagged, live until fixed
});
cc.addEventListener('blur', () => validate(cc)); // red waits until she leaves the field
```

## Form Colour Semantics

In a settings-style form, give every colour exactly one job and the form explains itself. Labels are the primary text colour (black on light). Values and placeholders the person types are secondary grey and right aligned: grey means you type here. The tint colour (blue on iOS) means you can tap this, so date chips and pickers sit in the tint colour on a lightly tinted pill. A toggle’s on state uses the tint colour too, because active should look active; an orange or grey toggle leaves people unsure whether it is on or off.

Then group by task: the title and location together, every timing control together (all-day, starts, ends, alert), links and notes together, three grouped sections (Form Field Grouping, Forms entry 14). The failure this fixes is a form where every row is the same grey pill, so nobody can tell what is tappable, where the input goes, or which text is a label, and every row costs a small pause. Same content, but clear, logical and systematic.

Do:
- Black = label, grey = typed value, tint colour = tappable
- Toggle on state in the tint colour
- All timing controls in one group

Avoid:
- Every row the same grey pill
- A toggle colour that does not read as on or off
- Tint colour on text that does nothing

Code (CSS):

```css
.row-label { color: var(--ink); }  /* black = a label */
.row-value, .row input::placeholder { color: var(--ink-2); text-align: right; }  /* grey = you type here */
.row-chip { color: var(--tint); background: color-mix(in srgb, var(--tint) 12%, transparent); } /* tint = you can tap this */
.switch[aria-checked="true"] { background: var(--tint); }  /* active looks active */
```

## Input Field Details

The small attributes on a field decide whether it is quick or a fight, especially on a phone. **Width hints the answer:** a postcode field is narrow and an address field is wide, so the box tells people how much to type. **Every text field sets inputmode and autocomplete** (email, tel, postal-code, one-time-code, name), which brings up the right keyboard and lets the browser fill in what it already knows. **A maximum length exists only for a real business limit,** and then a visible counter appears as the limit gets close, never a field that silently stops accepting characters. **An availability check** (is this username free?) runs on blur or after a 500ms pause in typing, never on every keystroke. **A server error lands on its field:** map every error the server returns to the field it belongs to; a generic Form invalid banner is not acceptable.

**Codes are text, not numbers.** Postcodes, verification codes, card numbers and account numbers use `type="text"` with `inputmode="numeric"`, never `type="number"`, which drops leading zeros (0800 becomes 800), adds spinner arrows, and changes the value when someone scrolls over the field. **Autofill keeps the design:** style `:autofill` so a field the browser fills keeps the design’s background and text colours instead of the browser’s yellow or blue wash, which looks like an error state in some themes.

**Habits to refuse.** A Reset or Clear button beside Submit, where one wrong click loses everything. A CAPTCHA before anyone has tried to submit; add it only when it is needed. A sign-up that confirms the email before showing the password field, which forces an extra step for no reason. Separate first and last name fields where one full name field works. A date field that demands one fixed day and month order with no awareness of locale. A phone field with no country code. Confirm email and confirm password fields, when a show toggle does that job. A money field with no currency symbol in view. Clearing any filled field after a validation error, ever.

**Six checks on every field.** **1. The label sits outside the field and stays visible:** a real `<label for="email">`; a placeholder disappears the moment someone types, so it is never the label (Form Field States, entry 04). **2. 44px tall, 16px text:** below a 16px font size, iOS Safari zooms the whole page when the field takes focus. **3. A real focus ring:** a border that only changes shade is easy to miss, so draw `outline: 2px solid var(--accent); outline-offset: 2px;` (Focus States, Navigation entry 01). **4. The resting border meets 3:1** against the background (WCAG 1.4.11, non-text contrast): on a #09090B dark background, a #3F3F46 border is 1.9:1 and fails, while #71717A is 4.1:1 and passes. **5. Errors after blur, not while typing:** validate `onBlur`, then the border turns red and a message appears, wired to the field with `aria-describedby="email-error"` (Form Validation Timing, entry 05). **6. The right type brings the right keyboard:** `type="email" autocomplete="email"` gives the @ keyboard and autofill; the same idea for a one-time code is `autocomplete="one-time-code"`.

Do:
- Field width matched to the expected answer
- inputmode and autocomplete on every text field
- Server errors mapped to the specific field
- `inputmode="numeric"` on a text field for codes, postcodes and card numbers
- Autofilled fields styled to match the design
- A visible `<label for>` outside every field
- Fields 44px tall with 16px text
- Resting border at 3:1 against its background, focus drawn with a 2px outline at a 2px offset

Avoid:
- `type="number"` for anything with a leading zero or no arithmetic meaning
- A Reset or Clear button next to Submit
- Confirm email or confirm password fields
- A phone field without a country code, or a money field without its currency symbol
- Field text under 16px (iOS zooms the page on focus)
- A focus state that only changes the border shade
- An error shown while the person is still typing

Code (HTML):

```html
<!-- width hints the answer; the right keyboard and autofill on every field -->
<input name="postcode" inputmode="numeric" autocomplete="postal-code" style="width:8ch">
<input name="address" autocomplete="street-address" style="width:100%">
<input name="email" type="email" inputmode="email" autocomplete="email">
<input name="phone" type="tel" autocomplete="tel">  <!-- beside a country code picker -->
<textarea name="bio" maxlength="160"></textarea>  <!-- a real limit: show 152 / 160 near the end -->
<input name="code" type="text" inputmode="numeric" autocomplete="one-time-code">  <!-- never type="number": 0800 stays 0800 -->

input:autofill { box-shadow: inset 0 0 0 40px var(--field-bg); -webkit-text-fill-color: var(--ink); } /* no browser wash */
input:-webkit-autofill { box-shadow: inset 0 0 0 40px var(--field-bg); -webkit-text-fill-color: var(--ink); }

<!-- six checks: label outside, 44px and 16px, real ring, 3:1 border, errors after blur, right type -->
<label for="email">Email</label>
<input id="email" name="email" type="email" autocomplete="email" aria-describedby="email-error">
<p id="email-error" class="field-error"></p>  <!-- filled on blur, never while typing -->

input { height: 44px; font-size: 16px; border: 1px solid #71717A; } /* 16px stops the iOS zoom; #71717A is 4.1:1 on #09090B */
input:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; } /* not just a border shade change */
input[aria-invalid="true"] { border-color: var(--danger); } /* set in the blur handler */
```

## Billing Page

People open a billing page for one number, so the page is laid out in zones, in the order people need them. **The next charge comes first:** the amount and the date (Next charge $120.00 on 1 Dec), at the top, above the plan name and everything else. **The payment method sits second, with its warning beside it:** when the saved card expires before the next charge, a warning appears next to the card itself (Expires 11/26, before your next charge. Update card), shown well ahead of the charge it would fail, not as an email after the payment has already bounced.

**Invoice history is ordered the way people scan it:** date, amount, status, download, and the invoice number last. People look for an invoice by when it was, then check how much and whether it was paid; almost nobody searches by invoice number. This is a deliberate exception to the identity-column-first habit of a general Data Table (Interaction), where the identifier is what people scan for. **A plan change shows the money before the button:** the prorated amount due today sits directly above the confirm button, with the new recurring price under it ($63.33 due today, then $360.00 a month), so the first charge is never a surprise. It is the same no-surprise principle as the matching total in Checkout That Feels Safe (entry 16).

**Cancel is plain and easy to find:** a text link at the bottom of the page, not a red alarm button and not hidden three screens deep, that opens one short confirmation with Keep plan as the other option. Cancelling is as easy as signing up (Dark Patterns, Psychology entry 07).

Do:
- Next charge amount and date at the very top
- An expiring-card warning beside the payment method, before the charge it would fail
- Invoice rows: date, amount, status, download, invoice number last
- The prorated amount due today directly above the plan-change confirm button
- A plain Cancel plan link at the bottom, one short confirmation

Avoid:
- A billing page that opens on the plan name and makes people hunt for the next charge
- An invoice table that starts with an invoice number nobody remembers
- A plan change confirmed without the amount due today in view

Code (HTML):

```html
<!-- zones in the order people need them -->
<section class="next-charge"><b>$120.00</b> on 1 Dec <small>Pro plan, monthly</small></section>
<section class="method">Visa 4242, expires 11/26
  <p class="warn">Expires before your next charge. <a href="#card">Update card</a></p> <!-- beside the card -->
</section>
<table class="invoices"> <!-- date, amount, status, download, number last -->
  <tr><td>1 Nov 2026</td><td>$120.00</td><td>Paid</td><td><a>PDF</a></td><td>INV-2041</td></tr>
</table>
<p class="due">$63.33 due today, then $360.00 a month</p>
<button>Confirm plan change</button> <!-- the amount sits right above it -->
<a class="cancel" href="#cancel">Cancel plan</a> <!-- plain, findable, never red -->
```

## Invoice Screen

An invoice screen answers one question first: how much is owed, and by when. **Lead with the amount due and a status pill:** the amount large at the top with its status beside it (Due, Overdue, Paid), and the due date and next steps right under it, on a plain white page. A quiet **viewed by client** line under the status pill (Viewed by client, 12 Nov) tells the sender whether to chase or wait. **One client row, not two address blocks:** fold the from and to address blocks into a single client row. **Flat rows, not a table:** cut the line-item table down to flat rows of name, quantity and price, with the total in bold at the bottom.

**One solid button:** the main action (Send invoice, or Pay now on the client’s side) is the only filled button; secondary actions such as Download and Edit sit beside it as quiet outlines. It is the same one-number-first idea as Billing Page (entry 19), and the amounts line up with Tabular Numbers (Visual, entry 19).

Do:
- Amount due and status pill first, due date and next steps right under them
- A viewed by client line under the status pill
- One client row instead of two address blocks
- Flat rows of name, quantity and price, the total in bold
- One solid primary button, Download and Edit as quiet outlines

Avoid:
- An invoice that opens on two address blocks with the amount at the bottom
- A gridded line-item table with tax and rate columns nobody reads on screen
- Three filled buttons of equal weight

Code (HTML):

```html
<!-- plain white page; the amount owed leads -->
<header class="due">
  <h1>$1,240.00</h1> <span class="pill pill-due">Due</span>
  <p class="viewed">Viewed by client, 12 Nov</p>
  <p>Due 30 Nov. Pay by card or bank transfer.</p> <!-- due date and next steps right under -->
</header>
<p class="client">Example Co · you@example.com · 2 High St</p> <!-- one row, not two address blocks -->
<ul class="lines"> <!-- flat rows: name, quantity, price -->
  <li>Design work <span>&times; 1</span> <span>$900.00</span></li>
  <li>Hosting <span>&times; 2</span> <span>$340.00</span></li>
  <li class="total"><b>Total</b> <b>$1,240.00</b></li>
</ul>
<button class="btn-primary">Send invoice</button>
<button class="btn-outline">Download</button> <button class="btn-outline">Edit</button> <!-- quiet secondaries -->
```
