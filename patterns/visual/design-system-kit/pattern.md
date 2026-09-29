---
id: design-system-kit
title: Design System Kit
category: visual
order: 6
---
## Rule
<p>Semantic tokens like <code class="tok">--brand</code> or <code class="tok">--error</code> survive a rebrand or a dark-mode pass because the name describes the role, not the literal colour behind it; hardcoded hex scattered across components has to be found and changed one at a time. Build a numbered colour scale (50 through 900) for every hue rather than a handful of arbitrary shades, and a 4px spacing scale so every gap in the product traces back to one shared rhythm. Define components as combinations of variant/size/state rather than one-off classes per screen.</p>
## Do
- Numbered colour scale + 4px spacing scale
## Avoid
- Hardcoded hex and eyeballed gaps
## Code: CSS
<pre><code>:root {
  --blue-50: #EFF2FB; --blue-500: #3B5BDB; --blue-900: #0F1B3E; <span class="cm">/* numbered scale, not one-off hex */</span>
  --space-1: 4px; --space-2: 8px; --space-3: 12px; --space-4: 16px; --space-6: 24px; <span class="cm">/* 4px rhythm */</span>
  --brand: var(--blue-500); --error: #C0392B; --success: #27AE60; <span class="cm">/* semantic layer on top */</span>
}
<span class="cm">/* component = variant + size + state, not a new class per screen */</span>
.btn[data-variant=<span class="str">"primary"</span>][data-size=<span class="str">"md"</span>] { background: var(--brand); padding: var(--space-2) var(--space-4); }
.btn[data-variant=<span class="str">"primary"</span>]:disabled { background: var(--blue-50); color: var(--blue-500); }</code></pre>
