---
id: tabs-system
title: Tabs System
category: navigation
order: 4
---
## Rule
<p>The active-tab indicator needs to physically slide from the old position to the new one, never teleport instantly. The slide is what tells the eye which direction the change moved in. When a tab row overflows the available width, it scrolls horizontally with an edge fade hinting more is there; it should never wrap onto a second line, which breaks the single-row mental model tabs depend on. Support full keyboard operation (arrow keys move between tabs, Home/End jump to the first/last), and fade the content out then back in on switch rather than a hard instant cut, which reads as a glitch. A desktop tab bar simply shrunk down rarely survives the transition to mobile without redesigning as its own pattern.</p>
## Do
- Full keyboard operation (arrows/Home/End)
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
