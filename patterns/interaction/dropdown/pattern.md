---
id: dropdown
title: Dropdown Design
category: interaction
order: 12
---
## Rule
<p>The trigger needs to be obviously clickable: a real touch target (~48px), a visible caret, and a genuine hover state, not a 30px box with a faint border. Flip the menu open direction when there isn&rsquo;t room below so it never clips off-screen, wire up full keyboard support (arrows, Enter, Esc), and once a list passes roughly ten items add a search field instead of leaving people to scroll-hunt. Animate the open around 150ms, fast enough to feel instant, slow enough to read as deliberate rather than a hard cut.</p>
<p>Six common dropdown mistakes, in full. <strong>1. Type to filter.</strong> Any list past about 10 rows needs a search field on top; in the demo a 195-country list takes 11.5 seconds of scrolling against 1.4 seconds with three letters typed. <strong>2. Typed dates.</strong> Use a text field that parses plus a month and year jump, because a calendar that opens on today makes a 1994 birthday cost about 390 presses of one arrow (see Date Pickers). <strong>3. Stay open on pick.</strong> A multi-select uses checkboxes, a live count and an explicit Done button, instead of closing and reopening after each pick. <strong>4. Collision-aware.</strong> Render the menu in a portal outside the clipping card, so <code class="tok">overflow: hidden</code> cannot cut it off, and flip it up when the space below runs out. <strong>5. Reasons, not grey.</strong> A disabled option should show the blocker inline and the one action that clears it. <strong>6. No menu under five options.</strong> Use a segmented control or radios: one tap, nothing hidden.</p>
## Do
- Full keyboard support (arrows/Enter/Esc)
- Search once the list passes ~10 items
- Multi-select stays open: checkboxes, a live count, an explicit Done
- Fewer than ~5 options &rarr; segmented control or radios, not a dropdown at all
- Menu rendered in a portal so a clipping parent cannot cut it off, and flipped up when there is no room below
- A disabled option shows the blocker inline and the one action that clears it
## Avoid
- An open animation dragging past ~150ms
- A long list with no type-to-filter (195 countries: 11.5 seconds of scrolling against 1.4 seconds of typing)
- A greyed-out option with no reason given
## Extra: variant-note
<div class="variant-note"><b>Variants held here.</b> Search: add a search field once a list passes about 10 items. Use when: people would otherwise scroll-hunt a long list (the demo&rsquo;s 195-country list). Field Control Thresholds holds the other variant, a searchable combobox from 16 options. Open animation: about 150ms. Use when: the dropdown sits in a dense productivity UI (Animation Timing, variant B). Both are kept on purpose.</div>
## Code: JS
<pre><code><span class="kw">function</span> <span class="fn">openDropdown</span>(trigger, menu) {
  <span class="kw">const</span> rect = trigger.getBoundingClientRect();
  <span class="kw">const</span> opensUp = rect.bottom + menu.offsetHeight > window.innerHeight;
  menu.style.top = opensUp ? <span class="str">'auto'</span> : <span class="str">'100%'</span>;
  menu.style.bottom = opensUp ? <span class="str">'100%'</span> : <span class="str">'auto'</span>;
  menu.classList.add(<span class="str">'open'</span>); <span class="cm">/* CSS: transition 150ms ease */</span>
}

menu.addEventListener(<span class="str">'keydown'</span>, (e) => {
  <span class="kw">if</span> (e.key === <span class="str">'ArrowDown'</span>) moveHighlight(<span class="num">1</span>);
  <span class="kw">if</span> (e.key === <span class="str">'ArrowUp'</span>) moveHighlight(-<span class="num">1</span>);
  <span class="kw">if</span> (e.key === <span class="str">'Enter'</span>) selectHighlighted();
  <span class="kw">if</span> (e.key === <span class="str">'Escape'</span>) closeDropdown();
});

<span class="cm">// collision-aware: portal the menu out of the clipping card, then position it from the trigger's rect</span>
document.body.appendChild(menu); <span class="cm">// overflow: hidden on the card can no longer cut it off</span>

<span class="cm">// reasons, not grey: keep a disabled option in the list, with the blocker and the fix inline</span>
<span class="cm">// &lt;li aria-disabled="true"&gt;Export &lt;small&gt;Needs a paid plan. &lt;a href="/billing"&gt;Upgrade&lt;/a&gt;&lt;/small&gt;&lt;/li&gt;</span></code></pre>
