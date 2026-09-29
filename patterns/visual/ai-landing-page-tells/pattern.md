---
id: ai-landing-page-tells
title: AI Landing Page Tells
category: visual
order: 22
---
## Rule
<p>The dashboard tells above have a landing-page equivalent: same underlying habit (decoration standing in for a real decision), different surface. <strong>The headline</strong>, an adjective stacked on a vague noun ("Supercharge your workflow with AI"), becomes an outcome stated in plain text, no adjective required. <strong>The blur</strong>, a big ambient gradient glow sitting behind the hero doing pure decoration, gets replaced by putting the colour ON the product screenshot itself, so the accent colour is attached to something real instead of floating in the background. <strong>Two buttons</strong>, a primary and secondary CTA rendered at equal visual weight (both solid, both bright), becomes one true primary (solid) and one visibly quieter secondary (text link or ghost button). <strong>The proof</strong>, a generic "trusted by 10,000+ teams" stat with no attribution, becomes one specific customer quote with a name, role, and face attached; a single credible quote reads as more real than a big round number nobody can check. <strong>Feature cards</strong>, a row of icon-plus-adjective cards (a lightning bolt next to "Fast"), becomes a card that shows the actual product screen doing the thing, not an icon standing in for it.</p>
## Do
- Outcome stated in plain text, not an adjective+noun headline
- Colour lives on the product shot, not an ambient background glow
- One true primary CTA, one visibly quieter secondary
- One named, attributed quote over an uncheckable round-number stat
## Avoid
- Two equal-weight CTAs, especially both left-aligned in a row (breaks the primary/secondary scan pattern)
## Code: CSS
<pre><code><span class="cm">/* tell 01, plain-text outcome headline, not an adjective+noun template */</span>
<span class="cm">/* "Supercharge your workflow with AI" → "Close the month in one afternoon." */</span>

<span class="cm">/* tell 02, colour lives on the product, not an ambient decorative glow */</span>
.hero { background: var(--surface-base); } <span class="cm">/* not radial-gradient(...) behind the hero */</span>
.hero-product-shot .accent-el { background: var(--accent); }

<span class="cm">/* tell 03, one true primary CTA, one visibly quieter secondary */</span>
.cta-primary   { background: var(--accent); color: #fff; }
.cta-secondary { background: transparent; text-decoration: underline; font-weight: 500; }

<span class="cm">/* tell 04, one attributed quote beats an uncheckable stat */</span>
<span class="cm">/* "Trusted by 10,000+ teams" → quote + name + role + avatar */</span>

<span class="cm">/* tell 05, feature cards show the product, not an icon+adjective */</span>
.feature-card__media { /* real product screenshot, not an icon glyph */ }</code></pre>
