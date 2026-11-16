---
id: fitts
title: Fitts’s Heuristic
category: psychology
order: 1
---
## Rule
<p>Important buttons should be easy to reach, so a big Save button beats a small one. This is Fitts&rsquo;s heuristic, often written up as &ldquo;Fitts&rsquo;s law&rdquo;; it is a research-backed heuristic, not a law. Its practical side is already in Click Target Sizing (Interaction, entry 25): the 44 by 44 pixel touch zone and the 8 pixel gap between adjacent buttons.</p>
<p><strong>Distance is the other half.</strong> The heuristic is about size and distance together: a target is quicker to hit when it is bigger and when it is closer to where the pointer or thumb already is. So bring the action to the person and cut the travel toward zero: a menu that opens at the cursor (<a href="#lp-context-menu">Context Menu</a>, Interaction entry 07), editing in place instead of on a separate form (<a href="#lp-inline-editing">Inline Editing</a>, Interaction entry 15), a floating action button that is always near the thumb. On a phone, put the primary action within thumb reach near the bottom of the screen, such as a full-width Save fixed above the home indicator, never only in the top corner where a one-handed user has to stretch or shift their grip.</p>
## Do
- The important button (the Save) is big and easy to reach
- Apply the size and gap numbers in Click Target Sizing
- Cut travel distance: menus at the cursor, inline editing, the primary action near the thumb on mobile
## Avoid
- A small, hard-to-reach button for the action that matters most
## Code: CSS
<pre><code><span class="cm">/* the important action is big and easy to reach: a big Save beats a small one (sizes are demo values) */</span>
.btn-save { min-width: 120px; min-height: 44px; }

<span class="cm">/* the touch-zone and gap floors from Click Target Sizing still apply to every other button */</span>
.btn-row { display: flex; gap: 8px; }
.btn-row button { min-width: 44px; min-height: 44px; }</code></pre>
