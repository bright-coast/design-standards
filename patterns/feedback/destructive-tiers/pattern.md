---
id: destructive-tiers
title: Destructive Action Risk Tiers
category: feedback
order: 10
---
## Rule
<p>Not every destructive action deserves the same friction, and matching friction to actual consequence is what makes the friction mean something instead of training people to click through it. Four tiers, escalating with what&rsquo;s actually at stake. <strong>Low</strong> risk, with a clear undo path (delete a draft, remove a filter), gets a single click plus a toast with undo, no modal at all (see Undo UX above). <strong>Medium</strong> risk, with some recovery path (delete a project, remove a teammate), gets a confirmation modal with the destructive button styled red and labelled with the verb (see Destructive Actions in Interaction above for the hold-to-confirm mechanic that pairs with this tier). <strong>High</strong> risk, with real consequences (delete a client&rsquo;s account, wipe a dataset), escalates to a modal that requires typing the resource&rsquo;s name or the word DELETE before the button activates at all. <strong>Critical</strong> risk that genuinely can&rsquo;t be recovered (close an account, revoke every API key) adds a password or 2FA re-entry on top of the typed confirmation. Whatever the tier, focus defaults to Cancel, never to the destructive button itself.</p>
<p><strong>Write the dialog so it reads in one glance.</strong> The title names the action and the object (Delete invoice #1247?), never a bare Are you sure? The body states the consequences in plain words: what disappears, who loses access, and whether it can be undone. Cancel is styled as the secondary button, so the destructive verb is the only strong action in the dialog.</p>
<p><strong>The inverse tier: protective actions get no friction.</strong> An action that protects the person and can be reversed at once (freeze a card, lock an account, pause payouts, sign out every device) gets no confirmation dialog at all. It sits one tap away on the screen where the risk is noticed, such as a Freeze card button on the card&rsquo;s own page and beside a transaction that looks wrong, and the same control undoes it with one tap (Unfreeze). Friction here slows the person down at the exact moment speed matters most.</p>
## Do
- Friction escalates with actual consequence, not with how severe the action feels
- Confirmation dialog focus defaults to Cancel, never the destructive button
- A dialog title that names the action and the object, with the consequences in the body
- Freeze, lock and pause: one tap on the screen where the risk shows up, and one tap to undo
## Avoid
- One &ldquo;are you sure?&rdquo; modal used identically for a draft delete and an account close
- An Are you sure? title that names no object
- A confirmation dialog in front of a protective, reversible action
## Code: JS
<pre><code><span class="cm">// tier -> UI treatment</span>
<span class="kw">const</span> DESTRUCTIVE_TIERS = {
  protective: { ui: <span class="str">'one-tap+same-control-undoes'</span>, confirm: <span class="kw">false</span> }, <span class="cm">// freeze card, lock account</span>
  low:      { ui: <span class="str">'toast+undo'</span>,      confirm: <span class="kw">false</span> },
  medium:   { ui: <span class="str">'modal'</span>,            confirm: <span class="str">'click'</span> },
  high:     { ui: <span class="str">'modal-typed'</span>,      confirm: <span class="str">'type-resource-name'</span> },
  critical: { ui: <span class="str">'modal-typed+2fa'</span>,  confirm: <span class="str">'type-resource-name+reauth'</span> },
};

<span class="kw">function</span> <span class="fn">confirmDialog</span>(tier, resourceName) {
  <span class="kw">return</span> {
    defaultFocus: <span class="str">'cancel'</span>, <span class="cm">// every tier, never the destructive button</span>
    requiresTyping: (tier === <span class="str">'high'</span> || tier === <span class="str">'critical'</span>) ? resourceName : <span class="kw">null</span>,
    requiresReauth: tier === <span class="str">'critical'</span>,
  };
}</code></pre>
