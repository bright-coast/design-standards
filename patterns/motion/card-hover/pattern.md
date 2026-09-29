---
id: card-hover
title: Card Hover Anatomy
category: motion
order: 2
---
## Rule
<p>Lift the card itself with real physical weight (roughly 8px of translateY over about 200ms) and animate what&rsquo;s inside the card (an image scaling up, actions fading in), never the card&rsquo;s own outer footprint, which would shove neighbouring cards around in a grid. Stagger any actions that reveal on hover roughly 60ms apart so they cascade in rather than popping simultaneously, and scale an inner image inside an <code class="tok">overflow: hidden</code> frame so the zoom stays contained within the card&rsquo;s fixed bounds.</p>
## Do
- Scale the image inside an overflow-hidden frame
## Avoid
- Scaling the whole card, shifting neighbours
## Code: CSS
<pre><code>.card { transition: transform 200ms var(--ease-out), box-shadow 200ms; }
.card:hover { transform: translateY(-8px); } <span class="cm">/* lifts the card, doesn't resize its footprint */</span>

.card-image-frame { overflow: hidden; border-radius: 8px 8px 0 0; } <span class="cm">/* contains the zoom */</span>
.card-image-frame img { transition: transform 300ms var(--ease-out); }
.card:hover .card-image-frame img { transform: scale(1.08); } <span class="cm">/* image scales, card footprint doesn't */</span>

.card-actions { display: flex; gap: 8px; }
.card-actions > * { transition: opacity 150ms, transform 150ms; }
.card-actions > *:nth-child(1) { transition-delay: 0ms; }
.card-actions > *:nth-child(2) { transition-delay: 60ms; } <span class="cm">/* ~60ms stagger */</span></code></pre>
