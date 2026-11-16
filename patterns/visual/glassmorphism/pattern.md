---
id: glassmorphism
title: Glass Panels
category: visual
order: 37
---
## Rule
<p>A glass panel is four properties together: a semi-transparent fill (white at about 10 to 20% over dark content, 60 to 70% over light), a backdrop blur of about 12 to 20px, a faint light border (white at about 25%), and a soft shadow. It only reads over colourful or detailed content such as a photo, a gradient mesh or a map; over a plain white page there is nothing to blur and it just looks grey.</p>
<p><strong>Check contrast over the busiest spot.</strong> Text on glass takes its contrast from whatever is behind it, so measure it over the busiest, lightest part of the background the panel can cover, and raise the fill opacity until it passes 4.5:1 everywhere. <strong>Blur is expensive:</strong> <code class="tok">backdrop-filter</code> repaints everything behind the panel whenever anything under it moves, so use it on one or two panels per screen (a navigation bar, one overlay), never on every card in a scrolling list or on an animating layer, and keep a solid fallback.</p>
## Do
- Fill, blur, light border and soft shadow together, over colourful content
- One or two glass panels per screen
## Avoid
- Glass on a plain white page
- Backdrop blur on every card in a list
## Code: CSS
<pre><code>.glass {
  background: rgb(255 255 255 / .14);
  backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgb(255 255 255 / .25);
  box-shadow: 0 8px 32px rgb(0 0 0 / .18);
}
@media (prefers-reduced-transparency: reduce) { .glass { background: rgb(30 30 40 / .92); backdrop-filter: none; } }</code></pre>
