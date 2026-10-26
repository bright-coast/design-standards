---
id: equal-height-cards
title: Equal-Height Cards in a Row
category: visual
order: 26
---
## Rule
<p>Cards that sit in the same row of a grid are always the same height. Whichever card is tallest sets the height of the row, and the others grow to match it. This holds on every screen width, including two-up on a phone, where a mismatch is most visible because the two cards sit directly side by side with nothing else on the screen to distract from the gap.</p>
<p>Let the grid do the work. A grid stretches its items by default, so do not set <code class="tok">align-items</code> to <code class="tok">start</code> or <code class="tok">center</code> on a grid of cards. The trap is the wrapper. When a card is wrapped in another element (a tooltip cell, a link, a button, a motion wrapper), the wrapper becomes the grid item and stretches, but a stretched wrapper does not stretch its child by itself, so the card inside keeps its content height. Give every wrapper in the chain a full-height rule (<code class="tok">h-full</code>, or <code class="tok">height: 100%</code>) and give the card itself <code class="tok">h-full</code>. Do not fake equal heights with magic pixel numbers; the one exception is a set of cards whose inner rows are deliberately fixed so that they line up internally.</p>
## Do
- Let the grid stretch its items, so the tallest card sets the row
- <span>Pass <code class="tok">h-full</code> through every wrapper (tooltip cell, link, button, motion wrapper) and onto the card itself</span>
- Check the two-up layout on a phone, not only the desktop row
## Avoid
- <span><code class="tok">align-items: start</code> on a card grid</span>
- Leaving an unwrapped card that stretches next to a wrapped card that does not
- Fixed heights or magic pixel numbers to fake it
## Code: Tailwind
<pre><code><span class="cm">&lt;!-- grid stretches by default: no items-start, no fixed heights --&gt;</span>
&lt;div class="grid grid-cols-2 gap-3 lg:grid-cols-4"&gt;

  <span class="cm">&lt;!-- unwrapped card --&gt;</span>
  &lt;Card className="h-full" /&gt;

  <span class="cm">&lt;!-- wrapped card: EVERY wrapper in the chain is h-full, and so is the card --&gt;</span>
  &lt;Tooltip&gt;
    &lt;TooltipTrigger asChild className="h-full"&gt;
      &lt;div className="h-full"&gt;
        &lt;Card className="h-full" /&gt;
      &lt;/div&gt;
    &lt;/TooltipTrigger&gt;
  &lt;/Tooltip&gt;

&lt;/div&gt;</code></pre>
