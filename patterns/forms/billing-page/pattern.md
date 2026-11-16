---
id: billing-page
title: Billing Page
category: forms
order: 19
---
## Rule
<p>People open a billing page for one number, so the page is laid out in zones, in the order people need them. <strong>The next charge comes first:</strong> the amount and the date (Next charge $120.00 on 1 Dec), at the top, above the plan name and everything else. <strong>The payment method sits second, with its warning beside it:</strong> when the saved card expires before the next charge, a warning appears next to the card itself (Expires 11/26, before your next charge. Update card), shown well ahead of the charge it would fail, not as an email after the payment has already bounced.</p>
<p><strong>Invoice history is ordered the way people scan it:</strong> date, amount, status, download, and the invoice number last. People look for an invoice by when it was, then check how much and whether it was paid; almost nobody searches by invoice number. This is a deliberate exception to the identity-column-first habit of a general <a href="#lp-data-table">Data Table</a> (Interaction), where the identifier is what people scan for. <strong>A plan change shows the money before the button:</strong> the prorated amount due today sits directly above the confirm button, with the new recurring price under it ($63.33 due today, then $360.00 a month), so the first charge is never a surprise. It is the same no-surprise principle as the matching total in <a href="#lp-checkout-safe">Checkout That Feels Safe</a> (entry 16).</p>
<p><strong>Cancel is plain and easy to find:</strong> a text link at the bottom of the page, not a red alarm button and not hidden three screens deep, that opens one short confirmation with Keep plan as the other option. Cancelling is as easy as signing up (<a href="#lp-dark-patterns">Dark Patterns</a>, Psychology entry 07).</p>
## Do
- Next charge amount and date at the very top
- An expiring-card warning beside the payment method, before the charge it would fail
- Invoice rows: date, amount, status, download, invoice number last
- The prorated amount due today directly above the plan-change confirm button
- A plain Cancel plan link at the bottom, one short confirmation
## Avoid
- A billing page that opens on the plan name and makes people hunt for the next charge
- An invoice table that starts with an invoice number nobody remembers
- A plan change confirmed without the amount due today in view
## Code: HTML
<pre><code><span class="cm">&lt;!-- zones in the order people need them --&gt;</span>
&lt;section class="next-charge"&gt;&lt;b&gt;$120.00&lt;/b&gt; on 1 Dec &lt;small&gt;Pro plan, monthly&lt;/small&gt;&lt;/section&gt;
&lt;section class="method"&gt;Visa 4242, expires 11/26
  &lt;p class="warn"&gt;Expires before your next charge. &lt;a href="#card"&gt;Update card&lt;/a&gt;&lt;/p&gt; <span class="cm">&lt;!-- beside the card --&gt;</span>
&lt;/section&gt;
&lt;table class="invoices"&gt; <span class="cm">&lt;!-- date, amount, status, download, number last --&gt;</span>
  &lt;tr&gt;&lt;td&gt;1 Nov 2026&lt;/td&gt;&lt;td&gt;$120.00&lt;/td&gt;&lt;td&gt;Paid&lt;/td&gt;&lt;td&gt;&lt;a&gt;PDF&lt;/a&gt;&lt;/td&gt;&lt;td&gt;INV-2041&lt;/td&gt;&lt;/tr&gt;
&lt;/table&gt;
&lt;p class="due"&gt;$63.33 due today, then $360.00 a month&lt;/p&gt;
&lt;button&gt;Confirm plan change&lt;/button&gt; <span class="cm">&lt;!-- the amount sits right above it --&gt;</span>
&lt;a class="cancel" href="#cancel"&gt;Cancel plan&lt;/a&gt; <span class="cm">&lt;!-- plain, findable, never red --&gt;</span></code></pre>
