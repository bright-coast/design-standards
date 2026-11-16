---
id: tabs-system
title: Tabs System
category: navigation
order: 4
---
## Rule
<p>The active-tab indicator needs to physically slide from the old position to the new one, never teleport instantly. The slide is what tells the eye which direction the change moved in. When a tab row overflows the available width, it scrolls horizontally with an edge fade hinting more is there; it should never wrap onto a second line, which breaks the single-row mental model tabs depend on. Support full keyboard operation (arrow keys move between tabs, Home/End jump to the first/last), and fade the content out then back in on switch rather than a hard instant cut, which reads as a glitch. A desktop tab bar simply shrunk down rarely survives the transition to mobile without redesigning as its own pattern.</p>
<p><strong>Five more details.</strong> On desktop, an overflowing tab row adds chevron buttons at each end alongside the edge fade, because a mouse user has no swipe. Arrow keys move between tabs, while Tab moves focus out of the tab list to the panel (one tab stop for the whole list, through a roving <code class="tok">tabindex</code>). Focused and selected look different: the selected tab carries the indicator, the focused tab carries a focus ring, and the two can sit on different tabs at once. On mobile, up to five tabs become a segmented control and more than five become a picker in a bottom sheet, with every target at least 44px tall. On switch, animate the content container&rsquo;s height to the new panel&rsquo;s height so the page below does not jump, with a brief pause of about 50ms between the old content fading out and the new one fading in.</p>
## Do
- Full keyboard operation (arrows/Home/End)
- Chevron buttons on desktop when tabs overflow; Tab leaves the tab list
- Distinct focus and selected styles
- Mobile: a segmented control up to five tabs, a bottom sheet beyond five, 44px targets
- Container height animates on switch, so nothing below jumps
## Avoid
- A shrunk desktop tab bar reused on mobile
## Code: CSS + JS
<pre><code>.tab-list { display: flex; overflow-x: auto; scrollbar-width: none; } <span class="cm">/* scrolls, never wraps */</span>
.tab-indicator {
  position: absolute; height: 2px; background: var(--accent);
  transition: transform 200ms var(--ease-out), width 200ms var(--ease-out); <span class="cm">/* slides, never teleports */</span>
}

tabList.addEventListener(<span class="str">'keydown'</span>, (e) => {
  <span class="kw">const</span> tabs = [...tabList.querySelectorAll(<span class="str">'[role=tab]'</span>)];
  <span class="kw">const</span> i = tabs.indexOf(document.activeElement);
  <span class="kw">if</span> (e.key === <span class="str">'ArrowRight'</span>) tabs[(i + <span class="num">1</span>) % tabs.length].focus();
  <span class="kw">if</span> (e.key === <span class="str">'ArrowLeft'</span>) tabs[(i - <span class="num">1</span> + tabs.length) % tabs.length].focus();
  <span class="kw">if</span> (e.key === <span class="str">'Home'</span>) tabs[<span class="num">0</span>].focus();
  <span class="kw">if</span> (e.key === <span class="str">'End'</span>) tabs.at(-<span class="num">1</span>).focus();
});</code></pre>
