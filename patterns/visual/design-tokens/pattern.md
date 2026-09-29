---
id: design-tokens
title: Design Tokens
category: visual
order: 7
---
## Rule
<p>Name tokens by their role in the interface (<code class="tok">color-primary</code>), never by their literal value (<code class="tok">color-blue-500</code>). The moment brand blue becomes brand purple, a value-named token is now lying about what colour it holds. Layer tokens three deep: primitive (the raw scale), semantic (the role, referencing a primitive), and component (referencing the semantic layer). One primitive edit then cascades everywhere it&rsquo;s referenced, and swapping to dark mode becomes swapping which primitive a semantic token points to, not a rewrite of every component.</p>
## Do
- One primitive edit cascades everywhere
## Avoid
- Baking literal values into token names
## Code: CSS
<pre><code><span class="cm">/* layer 1: primitive, the raw scale, never referenced directly by components */</span>
:root { --navy-700: #1F2933; --blue-500: #3B5BDB; }

<span class="cm">/* layer 2: semantic, named by ROLE, references a primitive */</span>
:root { --color-primary: var(--navy-700); --color-accent: var(--blue-500); }

<span class="cm">/* layer 3: component, references semantic only, never a primitive or raw hex */</span>
.button-primary { background: var(--color-accent); color: white; }
.heading { color: var(--color-primary); }

<span class="cm">/* rebrand navy → charcoal: edit ONE primitive, every semantic + component cascades */</span></code></pre>
