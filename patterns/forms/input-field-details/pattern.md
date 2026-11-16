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
## Do
- Field width matched to the expected answer
- inputmode and autocomplete on every text field
- Server errors mapped to the specific field
- <code class="tok">inputmode="numeric"</code> on a text field for codes, postcodes and card numbers
- Autofilled fields styled to match the design
## Avoid
- <code class="tok">type="number"</code> for anything with a leading zero or no arithmetic meaning
- A Reset or Clear button next to Submit
- Confirm email or confirm password fields
- A phone field without a country code, or a money field without its currency symbol
## Code: HTML
<pre><code><span class="cm">&lt;!-- width hints the answer; the right keyboard and autofill on every field --&gt;</span>
&lt;input name="postcode" inputmode="numeric" autocomplete="postal-code" style="width:8ch"&gt;
&lt;input name="address" autocomplete="street-address" style="width:100%"&gt;
&lt;input name="email" type="email" inputmode="email" autocomplete="email"&gt;
&lt;input name="phone" type="tel" autocomplete="tel"&gt;  <span class="cm">&lt;!-- beside a country code picker --&gt;</span>
&lt;textarea name="bio" maxlength="160"&gt;&lt;/textarea&gt;  <span class="cm">&lt;!-- a real limit: show 152 / 160 near the end --&gt;</span>
&lt;input name="code" type="text" inputmode="numeric" autocomplete="one-time-code"&gt;  <span class="cm">&lt;!-- never type="number": 0800 stays 0800 --&gt;</span>

input:autofill { box-shadow: inset 0 0 0 40px var(--field-bg); -webkit-text-fill-color: var(--ink); } <span class="cm">/* no browser wash */</span>
input:-webkit-autofill { box-shadow: inset 0 0 0 40px var(--field-bg); -webkit-text-fill-color: var(--ink); }</code></pre>
