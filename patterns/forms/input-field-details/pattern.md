---
id: input-field-details
title: Input Field Details
category: forms
order: 18
---
## Rule
<p>The small attributes on a field decide whether it is quick or a fight, especially on a phone. <strong>Width hints the answer:</strong> a postcode field is narrow and an address field is wide, so the box tells people how much to type. <strong>Every text field sets inputmode and autocomplete</strong> (email, tel, postal-code, one-time-code, name), which brings up the right keyboard and lets the browser fill in what it already knows. <strong>A maximum length exists only for a real business limit,</strong> and then a visible counter appears as the limit gets close, never a field that silently stops accepting characters. <strong>An availability check</strong> (is this username free?) runs on blur or after a 500ms pause in typing, never on every keystroke. <strong>A server error lands on its field:</strong> map every error the server returns to the field it belongs to; a generic Form invalid banner is not acceptable.</p>
<p><strong>Codes are text, not numbers.</strong> Postcodes, verification codes, card numbers and account numbers use <code class="tok">type="text"</code> with <code class="tok">inputmode="numeric"</code>, never <code class="tok">type="number"</code>, which drops leading zeros (0800 becomes 800), adds spinner arrows, and changes the value when someone scrolls over the field. <strong>Autofill keeps the design:</strong> style <code class="tok">:autofill</code> so a field the browser fills keeps the design&rsquo;s background and text colours instead of the browser&rsquo;s yellow or blue wash, which looks like an error state in some themes.</p>
<p><strong>Habits to refuse.</strong> A Reset or Clear button beside Submit, where one wrong click loses everything. A CAPTCHA before anyone has tried to submit; add it only when it is needed. A sign-up that confirms the email before showing the password field, which forces an extra step for no reason. Separate first and last name fields where one full name field works. A date field that demands one fixed day and month order with no awareness of locale. A phone field with no country code. Confirm email and confirm password fields, when a show toggle does that job. A money field with no currency symbol in view. Clearing any filled field after a validation error, ever.</p>
<p><strong>Six checks on every field.</strong> <strong>1. The label sits outside the field and stays visible:</strong> a real <code class="tok">&lt;label for="email"&gt;</code>; a placeholder disappears the moment someone types, so it is never the label (<a href="#lp-field-states">Form Field States</a>, entry 04). <strong>2. 44px tall, 16px text:</strong> below a 16px font size, iOS Safari zooms the whole page when the field takes focus. <strong>3. A real focus ring:</strong> a border that only changes shade is easy to miss, so draw <code class="tok">outline: 2px solid var(--accent); outline-offset: 2px;</code> (<a href="#lp-focus-states">Focus States</a>, Navigation entry 01). <strong>4. The resting border meets 3:1</strong> against the background (WCAG 1.4.11, non-text contrast): on a #09090B dark background, a #3F3F46 border is 1.9:1 and fails, while #71717A is 4.1:1 and passes. <strong>5. Errors after blur, not while typing:</strong> validate <code class="tok">onBlur</code>, then the border turns red and a message appears, wired to the field with <code class="tok">aria-describedby="email-error"</code> (<a href="#lp-validation-timing">Form Validation Timing</a>, entry 05). <strong>6. The right type brings the right keyboard:</strong> <code class="tok">type="email" autocomplete="email"</code> gives the @ keyboard and autofill; the same idea for a one-time code is <code class="tok">autocomplete="one-time-code"</code>.</p>
## Do
- Field width matched to the expected answer
- inputmode and autocomplete on every text field
- Server errors mapped to the specific field
- <code class="tok">inputmode="numeric"</code> on a text field for codes, postcodes and card numbers
- Autofilled fields styled to match the design
- A visible <code class="tok">&lt;label for&gt;</code> outside every field
- Fields 44px tall with 16px text
- Resting border at 3:1 against its background, focus drawn with a 2px outline at a 2px offset
## Avoid
- <code class="tok">type="number"</code> for anything with a leading zero or no arithmetic meaning
- A Reset or Clear button next to Submit
- Confirm email or confirm password fields
- A phone field without a country code, or a money field without its currency symbol
- Field text under 16px (iOS zooms the page on focus)
- A focus state that only changes the border shade
- An error shown while the person is still typing
## Code: HTML
<pre><code><span class="cm">&lt;!-- width hints the answer; the right keyboard and autofill on every field --&gt;</span>
&lt;input name="postcode" inputmode="numeric" autocomplete="postal-code" style="width:8ch"&gt;
&lt;input name="address" autocomplete="street-address" style="width:100%"&gt;
&lt;input name="email" type="email" inputmode="email" autocomplete="email"&gt;
&lt;input name="phone" type="tel" autocomplete="tel"&gt;  <span class="cm">&lt;!-- beside a country code picker --&gt;</span>
&lt;textarea name="bio" maxlength="160"&gt;&lt;/textarea&gt;  <span class="cm">&lt;!-- a real limit: show 152 / 160 near the end --&gt;</span>
&lt;input name="code" type="text" inputmode="numeric" autocomplete="one-time-code"&gt;  <span class="cm">&lt;!-- never type="number": 0800 stays 0800 --&gt;</span>

input:autofill { box-shadow: inset 0 0 0 40px var(--field-bg); -webkit-text-fill-color: var(--ink); } <span class="cm">/* no browser wash */</span>
input:-webkit-autofill { box-shadow: inset 0 0 0 40px var(--field-bg); -webkit-text-fill-color: var(--ink); }

<span class="cm">&lt;!-- six checks: label outside, 44px and 16px, real ring, 3:1 border, errors after blur, right type --&gt;</span>
&lt;label for="email"&gt;Email&lt;/label&gt;
&lt;input id="email" name="email" type="email" autocomplete="email" aria-describedby="email-error"&gt;
&lt;p id="email-error" class="field-error"&gt;&lt;/p&gt;  <span class="cm">&lt;!-- filled on blur, never while typing --&gt;</span>

input { height: 44px; font-size: 16px; border: 1px solid #71717A; } <span class="cm">/* 16px stops the iOS zoom; #71717A is 4.1:1 on #09090B */</span>
input:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; } <span class="cm">/* not just a border shade change */</span>
input[aria-invalid="true"] { border-color: var(--danger); } <span class="cm">/* set in the blur handler */</span></code></pre>
