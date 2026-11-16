---
id: keyboard-shortcuts
title: Keyboard Shortcuts
category: interaction
order: 37
---
## Rule
<p>A shortcut nobody sees never gets learned. Show each action&rsquo;s shortcut right-aligned on its menu row, in a muted key cap, so every trip through a menu teaches it, and repeat the same shortcut in the action&rsquo;s tooltip (<a href="#lp-tooltip">Tooltip Design</a>). The command palette lists them the same way (<a href="#lp-command-palette">Command Palette</a>).</p>
<p><strong>Teach at the right moment, once.</strong> After someone has done the same action by mouse several times (three is a fair default), show one short, dismissible tip with its shortcut: &ldquo;Tip: Cmd+D duplicates the selected row&rdquo;. Never on the first use, when they are still finding the feature, and never the same tip twice; a tip that keeps returning becomes noise people close without reading.</p>
<p><strong>One action, one binding.</strong> Give each action exactly one shortcut and keep it the same on every screen: if Cmd+D duplicates a row in one list, it duplicates in every list, and it never means delete somewhere else. Show the platform&rsquo;s own modifier (Cmd on a Mac, Ctrl on Windows), and do not take over shortcuts the browser or system already owns.</p>
<p><strong>Single-key shortcuts stay off while someone types.</strong> A shortcut with no modifier (E to archive, R to rename) must not fire while focus is in a text field, a text area or anything editable, or typing a word runs commands. Check the focused element before handling the key, and keep shortcuts with Cmd or Ctrl for actions that must work everywhere.</p>
## Do
- Shortcuts right-aligned on every menu row, and repeated in tooltips
- One short tip after about three mouse uses of the same action, shown once
- One binding per action, the same everywhere in the product
- Ignore single-key shortcuts while focus is in a field
## Avoid
- A shortcut tip on the first use, or the same tip shown again
- One key combination doing different things on different screens
- Overriding browser or system shortcuts
## Code: JS
<pre><code><span class="cm">// count mouse uses; teach the shortcut once, on the third</span>
<span class="kw">function</span> <span class="fn">trackMouseUse</span>(action) {
  <span class="kw">const</span> key = <span class="str">'uses:'</span> + action.id;
  <span class="kw">const</span> uses = Number(store.get(key) || <span class="num">0</span>) + <span class="num">1</span>;
  store.set(key, uses);
  <span class="kw">if</span> (uses === <span class="num">3</span> &amp;&amp; !store.get(<span class="str">'tipShown:'</span> + action.id)) {
    showTip(<span class="str">'Tip: '</span> + action.shortcut + <span class="str">' '</span> + action.verb);
    store.set(<span class="str">'tipShown:'</span> + action.id, <span class="kw">true</span>);
  }
}</code></pre>
