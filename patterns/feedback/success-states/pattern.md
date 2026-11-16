---
id: success-states
title: Success States
category: feedback
order: 12
---
## Rule
<p>A done screen is not a dead end, and five decisions keep the person moving. <strong>Say what happened:</strong> what, who and when, with the specifics (Invoice sent to Northwind Labs, INV-2051, EUR 2,400, due 12 Oct, sent just now) instead of Success! Your action was completed; specifics are the proof it worked, and a vague success feels like a maybe. <strong>Offer the next action:</strong> one primary next step and one way back (View invoice, Send another, Back to invoices); a check mark with no button is a dead end, and the person closes the tab right there.</p>
<p><strong>Dismissal follows stakes:</strong> a reversible, low-stakes change (notification settings) gets a toast with Undo that leaves after about 4 seconds; money gets a page that stays, with the plan, amount, card, date, a downloadable receipt and a copy by email, because nobody screenshots a toast. <strong>Leave one open loop:</strong> one thread to pull, such as tracking the payment (sent, opened, paid, notify me when paid), sharing the report, or inviting teammates; a finished task with a thread to pull brings people back (Zeigarnik Effect, Feedback entry 09). <strong>Celebrate the rare win:</strong> confetti is for milestones such as the first invoice paid, never every save; rare joy lands, constant joy is noise (Peak-End Rule, Interaction entry 18).</p>
<p>A success message leaves once it has been read. It never stays pinned on the page, where it goes stale and starts to look like part of the layout. A receipt page for a payment is a page in its own right, not a message left on another screen.</p>
<p><strong>Pending is a state of its own.</strong> When money has been sent but has not arrived, the receipt says so: a visible Pending status with the expected arrival (Arrives by Thu 14 Nov), shown on the receipt and on the same row in the history list. When the transfer settles, that row changes to Completed with the time it completed. Never show Completed for money that is still in flight, and never leave a settled transfer marked Pending.</p>
## Do
- What, who and when, with real specifics
- One primary next action and one way back
- Reversible = toast with Undo; money = a page with a receipt
- Confetti for milestones only
- A success message that leaves once it has been read
- A transfer shows Pending with its expected arrival, on the receipt and in history, until it settles to Completed
## Avoid
- Success! with an OK button and nothing else
- A payment confirmed only by a toast
- Completed shown for money that is still in flight
- Confetti on every save
- A success banner that stays on the page for good
## Code: JS
<pre><code><span class="cm">// success = what + who + when, one primary next step, one way back</span>
<span class="kw">function</span> <span class="fn">onDone</span>(r) {
  <span class="kw">if</span> (r.reversible &amp;&amp; !r.money) toast(`${r.what} saved`, { action: <span class="str">'Undo'</span>, ms: <span class="num">4000</span> }); <span class="cm">// low stakes</span>
  <span class="kw">else</span> showPage(<span class="str">'receipt'</span>, r); <span class="cm">// money: a page that stays, receipt plus email</span>
  <span class="kw">if</span> (r.milestone) confetti(); <span class="cm">// first invoice paid, never every save</span>
}</code></pre>
