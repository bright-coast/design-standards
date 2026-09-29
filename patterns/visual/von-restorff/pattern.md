---
id: von-restorff
title: Von Restorff Effect
category: visual
order: 17
---
## Rule
<p>Whatever looks visually different against a calm, consistent baseline is what gets noticed and remembered, also called the isolation effect. It works precisely because everything else is quiet; the moment two elements compete for the same standout treatment, the effect cancels out and neither gets the attention. Isolate exactly one target per view (the recommended pricing tier, the one CTA that matters), and combine scale, colour, and elevation together for that single element rather than spreading a lighter touch of each across several candidates.</p>
## Do
- Isolate exactly one target per view
## Avoid
- Highlighting two or three elements at once
## Code: CSS
<pre><code><span class="cm">/* 3 pricing tiers, ONE isolated as "recommended": scale + colour + elevation combined */</span>
.pricing-tier { border: 1px solid var(--border); border-radius: 12px; padding: 24px; }
.pricing-tier.recommended {
  transform: scale(1.05);
  border: 2px solid var(--accent);
  box-shadow: var(--elevation-3), var(--elevation-glow);
  background: var(--surface-raised);
} <span class="cm">/* the OTHER two tiers get zero special treatment, that's what makes this one land */</span></code></pre>
