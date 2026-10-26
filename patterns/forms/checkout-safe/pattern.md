---
id: checkout-safe
title: Checkout That Feels Safe
category: forms
order: 16
---
## Rule
<p>Five quiet decisions make a payment form feel safe. <strong>The total stays in view:</strong> the order summary is sticky beside the form (the form moves, the summary does not), and the amount on the pay button matches the order total exactly (Pay $148.00 under Total due $148.00), so nothing changes at the last step; short trust lines sit under it (card details are encrypted, free returns within 30 days). <strong>The card is recognised on digit one:</strong> the brand badge appears from the first digit (4 is Visa, 5 is Mastercard, 3 is Amex); recognised first, judged later.</p>
<p><strong>Red waits until the field is left:</strong> nothing turns red while the number is being typed; the field is checked on blur (Your card number is incomplete.), and once flagged it stays flagged on every keystroke until it is fixed. This is Form Validation Timing (Forms, entry 05) applied to the card field. <strong>The fastest way to pay sits on top:</strong> Apple Pay and Google Pay above every card field, one tap and no typing against six fields, with an Or pay with card divider below. <strong>Eyes go straight down:</strong> one column with every label above its field, so the eye path is one line and the label stays visible while typing; a two-column grid with placeholder-only labels makes the eye jump seven times.</p>
## Do
- Pay button amount identical to the order total
- Card brand badge from the first digit
- Wallets above every card field
- One column, labels above fields
## Avoid
- A card number flagged red on the first keystroke
- Placeholder-only labels that vanish while typing
- A two-column payment grid
## Code: HTML + JS
<pre><code><span class="cm">&lt;!-- one column, labels above, wallets first, summary pinned --&gt;</span>
&lt;form class="pay"&gt;
  &lt;div class="wallets"&gt;&lt;button&gt;Apple Pay&lt;/button&gt;&lt;button&gt;Google Pay&lt;/button&gt;&lt;/div&gt;
  &lt;p class="divider"&gt;Or pay with card&lt;/p&gt;
  &lt;label&gt;Card number &lt;input id="cc" inputmode="numeric" autocomplete="cc-number"&gt;&lt;/label&gt;
  &lt;button&gt;Pay $148.00&lt;/button&gt; <span class="cm">&lt;!-- same figure as Total due --&gt;</span>
&lt;/form&gt;
&lt;aside class="summary"&gt;Total due $148.00&lt;/aside&gt;

.summary { position: sticky; top: 24px; } <span class="cm">/* the form moves, the summary does not */</span>
cc.addEventListener(<span class="str">'input'</span>, () =&gt; {
  badge.dataset.brand = { <span class="str">'4'</span>: <span class="str">'visa'</span>, <span class="str">'5'</span>: <span class="str">'mastercard'</span>, <span class="str">'3'</span>: <span class="str">'amex'</span> }[cc.value[0]] || <span class="str">''</span>; <span class="cm">// digit one</span>
  <span class="kw">if</span> (cc.dataset.flagged) validate(cc); <span class="cm">// once flagged, live until fixed</span>
});
cc.addEventListener(<span class="str">'blur'</span>, () =&gt; validate(cc)); <span class="cm">// red waits until she leaves the field</span></code></pre>
