---
id: notification-system
title: Notification System
category: feedback
order: 4
---
## Rule
<p>A notification system is really four distinct surfaces (toast, banner, modal, badge), and severity is what should pick which one fires, not habit or whichever component was easiest to reach for. Toasts auto-dismiss and carry undo for low-stakes, reversible events; modals are reserved for things that genuinely block progress. Low-priority toasts need to stack and breathe with a visible gap between them rather than overlapping, and routing everything to the loudest available surface trains people to ignore all of them equally.</p>
<p><strong>Badges.</strong> A badge carries two different signals that need different treatment. A count is an action: it says how many, asks you to act now, and changes with each new item. A status dot is a condition: it says which state, asks for nothing, and reads green for online and red for act now. Never put both on one row, since a dot says something changed, a number says how much, and both together is noise. Cap the count so the width is bounded (one unread shows a single dot or number, 200 shows 99+, whereas an uncapped 661 grows the pill and reflows the nav), and pin the badge to the icon&rsquo;s top corner so the icon never moves whether it shows one digit or three.</p>
<p>A badge clears the second the view is opened; one that lingers after you have looked trains people to ignore every badge. When the count climbs it ticks up and never resets to zero on screen, because that flash reads as a bug. And badge the decision, not everything: for example, badging Messages, Mentions, Product updates, Promotions and System makes the colour meaningless, while badging only Mentions keeps the signal.</p>
## Do
- Toasts auto-dismiss with undo; modals for true blockers
- Badge counts cap at 99+, width bounded so a real spike can&rsquo;t break the layout
- Badge pinned to the icon&rsquo;s top corner, so the icon never moves
- One signal per row: a count or a status dot, never both
- The badge clears the moment the view opens; the count ticks up and never blinks to zero
- Only things that need a decision get a badge
## Avoid
- Routing everything to the loudest surface
- Badging every category, until the colour means nothing
- A badge that lingers after the user has looked
## Code: JS
<pre><code><span class="kw">function</span> <span class="fn">notify</span>({ severity, message, undo }) {
  <span class="kw">if</span> (severity === <span class="str">'low'</span>) <span class="kw">return</span> pushToast({ message, undo, autoDismiss: <span class="num">4000</span> }); <span class="cm">// stacks, breathes</span>
  <span class="kw">if</span> (severity === <span class="str">'medium'</span>) <span class="kw">return</span> showBanner({ message }); <span class="cm">// persistent until dismissed</span>
  <span class="kw">if</span> (severity === <span class="str">'blocking'</span>) <span class="kw">return</span> showModal({ message }); <span class="cm">// only true blockers get here</span>
  bumpBadge(); <span class="cm">// passive count, no interruption at all</span>
}</code></pre>
## Code: JS + CSS: badge rules
<pre><code><span class="kw">const</span> label = (n) =&gt; (n &gt; <span class="num">99</span> ? <span class="str">'99+'</span> : String(n)); <span class="cm">// capped, so the width is bounded (200 shows 99+, never 661)</span>

<span class="kw">function</span> <span class="fn">setBadge</span>(el, n) {
  el.textContent = label(n); <span class="cm">// when the count climbs it ticks up: never reset to 0 on screen and back</span>
  el.hidden = n === <span class="num">0</span>;
}
<span class="kw">function</span> <span class="fn">openInbox</span>() { markAllRead(); setBadge(bell, <span class="num">0</span>); } <span class="cm">// open it, clear it: the second the view opens</span>

.bell   { position: relative; }
.badge  { position: absolute; top: 0; right: 0; transform: translate(50%, -50%); overflow: hidden; } <span class="cm">/* pinned to the icon's top corner: the icon never moves */</span>
.status-dot { border-radius: 50%; } <span class="cm">/* a condition, not a count: green = online, red = act now */</span>
<span class="cm">/* one signal per row: render a .badge or a .status-dot, never both; badge only what needs a decision */</span></code></pre>
