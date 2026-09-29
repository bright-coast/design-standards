---
id: fitts
title: Fitts’s Heuristic
category: psychology
order: 1
---
## Rule
<p>Important buttons should be easy to reach, so a big Save button beats a small one. This is Fitts&rsquo;s heuristic, often written up as &ldquo;Fitts&rsquo;s law&rdquo;; it is a research-backed heuristic, not a law. Its practical side is already in Click Target Sizing (Interaction, entry 25): the 44 by 44 pixel touch zone and the 8 pixel gap between adjacent buttons.</p>
## Do
- The important button (the Save) is big and easy to reach
- Apply the size and gap numbers in Click Target Sizing
## Avoid
- A small, hard-to-reach button for the action that matters most
## Code: CSS
<pre><code><span class="cm">/* the important action is big and easy to reach: a big Save beats a small one (sizes are demo values) */</span>
.btn-save { min-width: 120px; min-height: 44px; }

<span class="cm">/* the touch-zone and gap floors from Click Target Sizing still apply to every other button */</span>
.btn-row { display: flex; gap: 8px; }
.btn-row button { min-width: 44px; min-height: 44px; }</code></pre>
