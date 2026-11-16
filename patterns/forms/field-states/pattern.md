---
id: field-states
title: Form Field States
category: forms
order: 4
---
## Rule
<p>Every field in a design system needs all six states actually designed, not improvised: default, focus, error, success, disabled, and loading. The label lives outside the field permanently. A placeholder pretending to be a label disappears the instant someone starts typing, so by the time they&rsquo;re three fields deep they&rsquo;ve forgotten what field four was asking for. Above the field is the right default placement: it scans fastest, works best on mobile, and survives translation into a longer language without crowding the control. A floating label that sits inside the field until focus is fine in genuinely tight spaces, but never on a multi-line textarea, where it collides with the first line typed. An inline label to the left of its control only earns its place on a wide settings page where label and control sit side by side on purpose. Placeholder text standing in as the only label is never acceptable at any width, it disappears exactly when someone needs it most. Errors need to combine colour with an icon and a written message; colour alone (a red border) is invisible to a colour-blind user and easy to miss at a glance regardless. Mark the exception, not the norm: label an optional field with a plain &ldquo;(optional)&rdquo; suffix rather than flagging every required field with an asterisk, since most fields in a well-scoped form should be required by design.</p>
<p><strong>Placeholder colour.</strong> Placeholder text looks clearly lighter than a typed value, so an example never reads as an answer already filled in, yet it is still text and still meets 4.5:1 against the field. On a white field, typed values near #1F2933 and placeholders near #6B7280 (about 4.8:1) keep both apart and both readable.</p>
<p><strong>Reserve the error slot.</strong> Every field keeps a fixed line under it for its message, about 20px tall and empty until needed, so an error appearing never pushes the fields below it or the submit button down the page.</p>
<p><strong>Loading, specified.</strong> While a field checks a value against the server (is this username free?), a small spinner sits inside the field at its trailing edge, the field stays editable, and submit is locked until the check settles, so a value nobody has checked yet cannot be sent twice or sent at all.</p>
## Do
- Label outside the field, never placeholder-as-label
- Above the field by default; floating only in tight spaces, never on a textarea; inline-left only on a wide settings page
- &ldquo;(optional)&rdquo; on the exception, not an asterisk on every required field
- Placeholder visibly lighter than typed text, and still 4.5:1
- A reserved message line under each field, so an error never shifts the layout
- An in-field spinner during an async check, with submit locked until it settles
## Avoid
- Border-only red, invisible to colour-blind users
- An error message that pushes the submit button down when it appears
## Extra: variant-note
<div class="variant-note"><b>Placeholder colour, two variants.</b> Variant A: the placeholder is visibly lighter than the typed value, both at 4.5:1 or better (this entry). Use when: a stacked form with labels above fields, where the placeholder shows an example answer. Variant B: placeholders and typed values share one secondary grey, right aligned, because grey means you type here (<a href="#lp-form-colour-semantics">Form Colour Semantics</a>, entry 17). Use when: a settings-style row form where the label sits on the left of each row. Both are kept on purpose.</div>
## Code: CSS
<pre><code>.field { display: flex; flex-direction: column; gap: 6px; }
.field input::placeholder { color: #6B7280; } <span class="cm">/* lighter than typed text, still 4.8:1 on white */</span>
.field-msg { min-height: 20px; } <span class="cm">/* reserved: an error never moves the submit button */</span>
.field.loading { background: url(spinner.svg) no-repeat right 10px center / 16px; } <span class="cm">/* async check in the field */</span>
.field label { font-size: 13px; font-weight: 600; } <span class="cm">/* always visible, never a placeholder */</span>

.field input { border: 1px solid var(--border); transition: border-color 150ms; }
.field input:focus { border-color: var(--accent); outline: 2px solid var(--accent-a20); }
.field.error input { border-color: var(--error); }
.field.success input { border-color: var(--success); }
.field input:disabled { background: var(--surface-muted); cursor: not-allowed; }

.field-msg.error { color: var(--error); display: flex; gap: 4px; align-items: center; }
.field-msg.error::before { content: <span class="str">'⚠'</span>; } <span class="cm">/* icon, not colour alone */</span></code></pre>
