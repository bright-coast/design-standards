---
id: toggle
title: Toggle Anatomy
category: forms
order: 12
---
## Rule
<p>A good toggle morphs over roughly 250ms: the rail colour, the knob position, and the knob&rsquo;s shadow all move together on the same curve, rather than snapping instantly between on and off. For an async toggle backed by a real API call, flip optimistically the instant it&rsquo;s tapped and show a small spinner inside the knob itself while the request is in flight, rolling back with a shake if it fails. It must remain a real, focusable, keyboard- and screen-reader-operable control, built on <code class="tok">&lt;button role="switch"&gt;</code> or a checkbox, never a plain <code class="tok">&lt;div&gt;</code> with a click handler.</p>
<p><strong>Geometry.</strong> The rail is about twice as wide as the knob&rsquo;s diameter, and the padding around the knob is small and equal on every side, so the knob sits evenly inside the rail in both positions; a 20px knob in a 44 by 26px rail with 3px of padding is a good default. <strong>Motion:</strong> when a visible state label sits beside the switch (On, Off), it changes in the same motion as the rail and knob, on the same ease-out curve, never a beat later. <strong>Keyboard and state:</strong> Space toggles it, a visible focus ring shows on keyboard focus, and the state is exposed with <code class="tok">aria-checked</code> so a screen reader says on or off.</p>
## Do
- Rail colour, knob position, shadow move together
- Rail about twice the knob diameter, with even padding around the knob
- The state label changes with the rail and knob, on the same ease-out curve
- Space toggles, a visible focus ring, state in <code class="tok">aria-checked</code>
## Avoid
- A toggle that skips keyboard/screen readers
## Code: CSS + JS
<pre><code>.toggle { position: relative; width: 44px; height: 26px; border-radius: 999px;
  background: var(--rail-off); transition: background 250ms ease-out; }
.toggle[aria-checked=<span class="str">"true"</span>] { background: var(--accent); }
.toggle .knob { position: absolute; top: 3px; left: 3px; width: 20px; height: 20px;
  border-radius: 50%; background: #fff; box-shadow: 0 1px 3px rgb(0 0 0 / .3);
  transition: transform 250ms ease-out; } <span class="cm">/* same curve as the rail */</span>
.toggle[aria-checked=<span class="str">"true"</span>] .knob { transform: translateX(18px); }

toggle.addEventListener(<span class="str">'click'</span>, <span class="kw">async</span> () => {
  <span class="kw">const</span> next = toggle.getAttribute(<span class="str">'aria-checked'</span>) !== <span class="str">'true'</span>;
  toggle.setAttribute(<span class="str">'aria-checked'</span>, String(next)); <span class="cm">// optimistic flip</span>
  <span class="kw">try</span> { <span class="kw">await</span> api.setSetting(next); }
  <span class="kw">catch</span> { toggle.setAttribute(<span class="str">'aria-checked'</span>, String(!next)); } <span class="cm">// roll back on failure</span>
});
toggle.addEventListener(<span class="str">'keydown'</span>, e => { <span class="kw">if</span> (e.key === <span class="str">' '</span> || e.key === <span class="str">'Enter'</span>) toggle.click(); });</code></pre>
