---
id: perfect-card
title: Perfect Card
category: visual
order: 13
---
## Rule
<p>Padding is the single biggest tell between a card that reads as expensive and one that reads as cheap. Generous internal padding (20-24px) signals confidence and craft, while cramped padding (8px, content pressed against the edges) reads as an afterthought regardless of what&rsquo;s inside. Pair it with real type hierarchy (a genuinely bold title, a muted, smaller body line) and a two-shadow stack plus a subtle 1px border for definition. Near-zero radius combined with cramped padding is the classic &ldquo;cheap card&rdquo; signature to avoid.</p>
## Do
- Real type hierarchy (bold title, muted body)
## Avoid
- Cramped padding, near-zero radius
## Extra: caveat-box
<div class="caveat-box"><b>A note on the finish.</b> A dark, glossy card is often read as machine-generated. The numbers are sound; the finish is a style choice to check against AI Slop: What Not To Do.</div>
## Code: CSS
<pre><code>.card {
  padding: 24px; <span class="cm">/* generous, the biggest single tell of quality */</span>
  border-radius: 12px;
  border: 1px solid var(--border-subtle);
  box-shadow: 0 1px 2px rgb(0 0 0 / .06), 0 8px 20px rgb(0 0 0 / .04); <span class="cm">/* two-shadow stack */</span>
  background: var(--surface);
}
.card h3 { font-weight: 700; font-size: 1.05rem; margin-bottom: 4px; } <span class="cm">/* real hierarchy */</span>
.card p  { color: var(--text-muted); font-size: 0.9rem; line-height: 1.5; }</code></pre>
