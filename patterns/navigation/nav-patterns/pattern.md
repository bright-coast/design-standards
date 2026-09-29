---
id: nav-patterns
title: Navigation Patterns
category: navigation
order: 2
---
## Rule
<p>Bottom tabs are the mobile-native pattern for primary navigation (thumb-reachable, always visible); a persistent sidebar is the desktop-native pattern once a product has five or more top-level sections. Match the pattern to the platform&rsquo;s own convention rather than personal taste. A bottom tab bar ported straight to desktop, or a sidebar squeezed onto mobile, both fight how people already expect to navigate on that device. A command palette (Cmd+K) supplements visible navigation for power users; it should never replace it, since not everyone knows the shortcut exists. Reserve breadcrumbs for genuinely nested hierarchies past two levels deep; a flat one- or two-level structure doesn&rsquo;t need them.</p>
## Do
- Command palette alongside visible nav, not instead
## Avoid
- Burying primary nav in a desktop hamburger
## Code: CSS
<pre><code>.nav-mobile { display: none; }
.nav-desktop { display: flex; flex-direction: column; width: 240px; } <span class="cm">/* persistent sidebar, 5+ sections */</span>

@media (max-width: 768px) {
  .nav-desktop { display: none; } <span class="cm">/* hamburger is NOT the mobile answer either, use tabs */</span>
  .nav-mobile {
    display: flex; position: fixed; bottom: 0; inset-inline: 0;
    justify-content: space-around; padding-bottom: env(safe-area-inset-bottom);
  } <span class="cm">/* bottom tabs, thumb-reachable, always visible */</span>
}
<span class="cm">/* Cmd+K palette is ADDITIVE, .nav-desktop / .nav-mobile still render regardless of it existing */</span></code></pre>
