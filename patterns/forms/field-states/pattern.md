---
id: field-states
title: Form Field States
category: forms
order: 4
---
## Rule
<p>Every field in a design system needs all six states actually designed, not improvised: default, focus, error, success, disabled, and loading. The label lives outside the field permanently. A placeholder pretending to be a label disappears the instant someone starts typing, so by the time they&rsquo;re three fields deep they&rsquo;ve forgotten what field four was asking for. Above the field is the right default placement: it scans fastest, works best on mobile, and survives translation into a longer language without crowding the control. A floating label that sits inside the field until focus is fine in genuinely tight spaces, but never on a multi-line textarea, where it collides with the first line typed. An inline label to the left of its control only earns its place on a wide settings page where label and control sit side by side on purpose. Placeholder text standing in as the only label is never acceptable at any width, it disappears exactly when someone needs it most. Errors need to combine colour with an icon and a written message; colour alone (a red border) is invisible to a colour-blind user and easy to miss at a glance regardless. Mark the exception, not the norm: label an optional field with a plain &ldquo;(optional)&rdquo; suffix rather than flagging every required field with an asterisk, since most fields in a well-scoped form should be required by design.</p>
## Do
- Label outside the field, never placeholder-as-label
- Above the field by default; floating only in tight spaces, never on a textarea; inline-left only on a wide settings page
- &ldquo;(optional)&rdquo; on the exception, not an asterisk on every required field
## Avoid
- Border-only red, invisible to colour-blind users
## Code: CSS
<pre><code>.field { display: flex; flex-direction: column; gap: 6px; }
.field label { font-size: 13px; font-weight: 600; } <span class="cm">/* always visible, never a placeholder */</span>

.field input { border: 1px solid var(--border); transition: border-color 150ms; }
.field input:focus { border-color: var(--accent); outline: 2px solid var(--accent-a20); }
.field.error input { border-color: var(--error); }
.field.success input { border-color: var(--success); }
.field input:disabled { background: var(--surface-muted); cursor: not-allowed; }

.field-msg.error { color: var(--error); display: flex; gap: 4px; align-items: center; }
.field-msg.error::before { content: <span class="str">'⚠'</span>; } <span class="cm">/* icon, not colour alone */</span></code></pre>
