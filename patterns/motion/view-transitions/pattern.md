---
id: view-transitions
title: View Transitions
category: motion
order: 6
---
## Rule
<p>The View Transitions API morphs one state into another with no animation library. <strong>A card becomes a page:</strong> give the card image and the page header the same <code class="tok">view-transition-name</code>; the browser snapshots the old and new states and interpolates size, position and corner radius (in the demo width 379 to 1080px, top 201 to 64px, radius 15 to 0px). In a single-page app, one <code class="tok">document.startViewTransition()</code> call wraps the DOM update. <strong>Every row, its own name:</strong> give each list item a unique name and sorting or filtering slides every row with no animation code; one item, one name, because a duplicate name throws an InvalidStateError and the transition is skipped.</p>
<p><strong>A theme toggle that spreads:</strong> animate <code class="tok">::view-transition-new(root)</code> with a clip-path circle that grows from the click position, a circular wipe in one rule (600ms in the demo). <strong>A modal born from its button:</strong> the button holds the name, and on open the name moves to the dialog, so it grows out of the place that was tapped instead of fading in from nowhere. <strong>Across real page loads:</strong> <code class="tok">@view-transition { navigation: auto; }</code> on both pages gives the same morph on a multi-page site with no framework (Chrome 126+, Safari 18.2+); without support the page swaps instantly, so nothing breaks. Respect reduced motion by turning the animations off under <code class="tok">prefers-reduced-motion</code>.</p>
## Do
- One shared name on the two states that should morph
- A unique name per list row
- Modals grow from the button that opened them
- Instant swap as the fallback, reduced motion honoured
## Avoid
- An animation library for a morph the browser can do
- Two elements sharing one name on the same page
## Code: CSS + JS
<pre><code>.card img, .page header { view-transition-name: hero; } <span class="cm">/* same name, two snapshots */</span>
document.startViewTransition(() =&gt; showPage()); <span class="cm">// SPA: wrap the DOM update</span>

li { view-transition-name: var(--trip); } <span class="cm">/* &lt;li style="--trip: trip-1"&gt;, one item, one name */</span>

::view-transition-new(root) { animation: reveal 600ms; }
@keyframes reveal { from { clip-path: circle(0 at var(--x) var(--y)); } } <span class="cm">/* --x, --y = click position */</span>

btn.style.viewTransitionName = <span class="str">"share"</span>;
document.startViewTransition(() =&gt; {
  btn.style.viewTransitionName = <span class="str">"none"</span>;
  dialog.style.viewTransitionName = <span class="str">"share"</span>; <span class="cm">// the name moves to the dialog</span>
  dialog.showModal();
});

@view-transition { navigation: auto; } <span class="cm">/* on both pages: cross-document, no framework */</span>
@media (prefers-reduced-motion: reduce) { ::view-transition-group(*) { animation: none; } }</code></pre>
