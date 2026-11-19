---
id: invoice-screen
title: Invoice Screen
category: forms
order: 20
---
## Rule
<p>An invoice screen answers one question first: how much is owed, and by when. <strong>Lead with the amount due and a status pill:</strong> the amount large at the top with its status beside it (Due, Overdue, Paid), and the due date and next steps right under it, on a plain white page. A quiet <strong>viewed by client</strong> line under the status pill (Viewed by client, 12 Nov) tells the sender whether to chase or wait. <strong>One client row, not two address blocks:</strong> fold the from and to address blocks into a single client row. <strong>Flat rows, not a table:</strong> cut the line-item table down to flat rows of name, quantity and price, with the total in bold at the bottom.</p>
<p><strong>One solid button:</strong> the main action (Send invoice, or Pay now on the client&rsquo;s side) is the only filled button; secondary actions such as Download and Edit sit beside it as quiet outlines. It is the same one-number-first idea as <a href="#lp-billing-page">Billing Page</a> (entry 19), and the amounts line up with <a href="#lp-tabular-numbers">Tabular Numbers</a> (Visual, entry 19).</p>
## Do
- Amount due and status pill first, due date and next steps right under them
- A viewed by client line under the status pill
- One client row instead of two address blocks
- Flat rows of name, quantity and price, the total in bold
- One solid primary button, Download and Edit as quiet outlines
## Avoid
- An invoice that opens on two address blocks with the amount at the bottom
- A gridded line-item table with tax and rate columns nobody reads on screen
- Three filled buttons of equal weight
## Code: HTML
<pre><code><span class="cm">&lt;!-- plain white page; the amount owed leads --&gt;</span>
&lt;header class="due"&gt;
  &lt;h1&gt;$1,240.00&lt;/h1&gt; &lt;span class="pill pill-due"&gt;Due&lt;/span&gt;
  &lt;p class="viewed"&gt;Viewed by client, 12 Nov&lt;/p&gt;
  &lt;p&gt;Due 30 Nov. Pay by card or bank transfer.&lt;/p&gt; <span class="cm">&lt;!-- due date and next steps right under --&gt;</span>
&lt;/header&gt;
&lt;p class="client"&gt;Example Co &middot; you@example.com &middot; 2 High St&lt;/p&gt; <span class="cm">&lt;!-- one row, not two address blocks --&gt;</span>
&lt;ul class="lines"&gt; <span class="cm">&lt;!-- flat rows: name, quantity, price --&gt;</span>
  &lt;li&gt;Design work &lt;span&gt;&amp;times; 1&lt;/span&gt; &lt;span&gt;$900.00&lt;/span&gt;&lt;/li&gt;
  &lt;li&gt;Hosting &lt;span&gt;&amp;times; 2&lt;/span&gt; &lt;span&gt;$340.00&lt;/span&gt;&lt;/li&gt;
  &lt;li class="total"&gt;&lt;b&gt;Total&lt;/b&gt; &lt;b&gt;$1,240.00&lt;/b&gt;&lt;/li&gt;
&lt;/ul&gt;
&lt;button class="btn-primary"&gt;Send invoice&lt;/button&gt;
&lt;button class="btn-outline"&gt;Download&lt;/button&gt; &lt;button class="btn-outline"&gt;Edit&lt;/button&gt; <span class="cm">&lt;!-- quiet secondaries --&gt;</span></code></pre>
