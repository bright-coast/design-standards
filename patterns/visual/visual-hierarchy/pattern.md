---
id: visual-hierarchy
title: Visual Hierarchy
category: visual
order: 16
---
## Rule
<p>Size, colour, contrast, whitespace, and font weight all stack together to create exactly one clear focal point on a given screen. Hierarchy is what tells someone&rsquo;s eye where to land first without them having to think about it. Spend the single accent colour on the one truly key action per screen; a screen with five differently-coloured buttons has no hierarchy at all, just noise. Colour carries meaning, not rank; the ranking itself comes from size, weight, and position working together. Whitespace itself is an importance signal: the element with the most breathing room around it reads as the most important one on the page, independent of its own size. The numbers make the rule testable rather than a matter of taste. Adjacent heading levels need at least a 1.25&times; size jump between them, and a primary call-to-action needs to stand at least 1.5&times; the height of body text, or the size difference doesn't actually register. Weight carries its own tier: 600 to 700 for a primary heading, 500 to 600 for a secondary one, 400 for body copy, and 400 at 60 to 70% opacity for captions and meta text, never colour alone doing that job. Spacing scales with the hierarchy it separates: 48 to 64px between major sections, 24 to 32px between subsections, 8 to 16px within one group, and a heading always carries more space above it than below, which is what visually ties it to the content that follows rather than the content it just left. A genuine test for any screen: squint at it, or blur it, and check whether the one thing that matters most is still obviously the one thing that matters most.</p>
## Do
- Spend one accent colour on the one key action
- At least 1.25&times; between heading levels, 1.5&times; for a primary CTA over body text
- More space above a heading than below it
## Avoid
- Colouring every element differently
- Three equal-weight primary buttons, or a sidebar with 15+ items at one visual level
- All-caps or italic body text, or body text centred in anything wider than about 80 characters
## Code: CSS
<pre><code><span class="cm">/* one accent, spent deliberately on the single primary action */</span>
.btn-primary   { background: var(--accent); color: white; font-weight: 600; }
.btn-secondary { background: transparent; border: 1px solid var(--border); color: var(--text); }
.btn-tertiary  { background: none; color: var(--text-muted); text-decoration: underline; }
<span class="cm">/* everything else de-emphasized by weight/contrast, not a competing colour */</span>

.hero-title { font-size: 2.5rem; font-weight: 800; margin-bottom: 32px; } <span class="cm">/* whitespace = importance signal */</span></code></pre>
