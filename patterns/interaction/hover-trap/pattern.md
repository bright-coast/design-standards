---
id: hover-trap
title: Hover Trap
category: interaction
order: 14
---
## Rule
<p>Touch has no hover, so mobile browsers fake one: the first tap gets spent &ldquo;becoming&rdquo; a sticky hover state instead of firing the actual action. Never bury a primary action behind hover; it should only ever reveal secondary extras. Gate hover styles with the <code class="tok">hover: hover</code> media feature rather than sniffing the user agent, since that correctly handles a hybrid touch+mouse laptop where user-agent sniffing gets it wrong. Pad the tappable hit area to 44px even when the visible glyph stays smaller.</p>
## Do
- Primary actions stay reachable without hover
- Pad tap targets to 44px, glyph can stay small
## Avoid
- Hiding a primary action behind a hover-only reveal
## Code: CSS
<pre><code><span class="cm">/* the spec-correct way to detect real hover support */</span>
<span class="kw">@media</span> (hover: hover) {
  .card-actions { opacity: 0; }
  .card:hover .card-actions { opacity: 1; }
}
<span class="cm">/* touch devices never match the query above, actions stay visible */</span>
.card-actions {
  min-width: 44px; min-height: 44px; <span class="cm">/* hit area, not the icon itself */</span>
}
.card-actions svg { width: 20px; height: 20px; } <span class="cm">/* glyph stays small */</span></code></pre>
