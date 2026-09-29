---
id: gestalt
title: Gestalt Laws
category: visual
order: 8
---
## Rule
<p>Similarity, proximity, continuity, figure-ground, and common region are the five Gestalt principles that describe how the brain groups visual elements automatically, before any conscious analysis. Shared colour, shape, or size reads as &ldquo;these belong together&rdquo; instantly, so use it deliberately to group related items without needing a label. A shared border or background can group even elements that are physically distant from each other (common region), which is a stronger grouping signal than proximity alone. Scattering visually related items at random locations fights the brain&rsquo;s automatic grouping instead of using it.</p>
## Do
- Shared colour/shape/size to group related items
## Avoid
- Scattering related items at random
## Code: CSS
<pre><code><span class="cm">/* common region: a shared border groups items even when they're not adjacent */</span>
.related-group {
  border: 1px solid var(--border); border-radius: 8px; padding: 12px;
}
<span class="cm">/* similarity: same accent colour signals "these are the same kind of thing" */</span>
.tag-billing { background: var(--blue-50); color: var(--blue-700); }
.tag-billing-related-item { background: var(--blue-50); color: var(--blue-700); } <span class="cm">/* deliberately matched */</span>
<span class="cm">/* proximity: gap inside a group is smaller than the gap between groups (see Proximity Rule below) */</span></code></pre>
