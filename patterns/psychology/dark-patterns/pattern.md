---
id: dark-patterns
title: Dark Patterns
category: psychology
order: 7
---
## Rule
<p>A dark pattern is a design choice that tricks people into a decision they would not make if they saw it clearly. These are never acceptable, however well they test, and several are now regulated in many markets. Three are common enough to name, each with its honest alternative. <strong>Confirmshaming:</strong> never write the decline option to make people feel foolish for saying no (No thanks, I prefer paying full price). Write it in neutral words that say what happens (No thanks, or Not now), styled as a real, readable option rather than faint small print.</p>
<p><strong>Hidden costs:</strong> never show one price and add shipping, service fees and taxes once someone is committed at checkout, so a $29 basket becomes $47 on the last step. Show the full price, fees included, from the first place the price appears, or state the fees beside it, so the figure on the pay button is never a surprise (<a href="#lp-checkout-safe">Checkout That Feels Safe</a>, Forms entry 16). <strong>The roach motel:</strong> never make leaving harder than joining. If signing up takes one click, cancelling takes about the same: a findable Cancel plan link, one short confirmation, done, with no maze of settings pages, guilt screens, waiting periods or required phone calls (<a href="#lp-billing-page">Billing Page</a>, Forms entry 19).</p>
## Do
- Neutral decline wording, as readable as the accept option
- The full price, fees included, from the first place a price appears
- Cancelling as easy as signing up: one link, one short confirmation
## Avoid
- A decline option written to shame (No thanks, I like paying more)
- Fees that appear only at the last step of checkout
- A cancellation path through several screens, an email confirmation or a waiting period
## Code: HTML
<pre><code><span class="cm">&lt;!-- decline in neutral words, as readable as accept --&gt;</span>
&lt;button&gt;Get 20% off&lt;/button&gt; &lt;button class="secondary"&gt;No thanks&lt;/button&gt;

<span class="cm">&lt;!-- the price people see first already includes the fees --&gt;</span>
&lt;p class="price"&gt;$47.00 &lt;small&gt;includes $12 shipping and $6 in fees&lt;/small&gt;&lt;/p&gt;

<span class="cm">&lt;!-- one link out, one confirmation, the same effort as signing up --&gt;</span>
&lt;a href="/billing#cancel"&gt;Cancel plan&lt;/a&gt;</code></pre>
