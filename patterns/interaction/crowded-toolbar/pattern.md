---
id: crowded-toolbar
title: Crowded Toolbar: Six Fixes
category: interaction
order: 33
---
## Rule
<p>Find the crop tool. That pause has a name: Hick&rsquo;s heuristic (<a href="#lp-hick">Psychology, entry 02</a>). The more equal choices you show, the longer people take to pick one, and decision time grows with every doubling of options, so twelve icons feel slow before anyone taps. Stop showing every tool. Six fixes for a crowded toolbar:</p>
<p><strong>1. Keep the 3 to 5 tools people use every day.</strong> Count what they tap, not what you shipped. <strong>2. Give one action the accent.</strong> The rest stay quiet so the eye lands on the first try. <strong>3. Put a word under every icon.</strong> A label turns a guess into a glance. <strong>4. Move rare tools behind More.</strong> Rotate, flip and stickers stay one tap away, never in the way. <strong>5. Group what is left by job.</strong> Edit, then adjust: two short groups read faster than one long row. <strong>6. One exception, experts.</strong> Give them shortcuts so they skip the menu entirely.</p>
<p>Where it meets the rest of this library: one accent is Action Priority (entry 26), and the labels under icons are the same call as labelled icon buttons in the UX Audit accessibility lens (entry 32).</p>
## Do
- Three to five everyday tools visible, chosen from usage counts
- One accented action, a word under every icon
- Rare tools behind More, the rest grouped by job, shortcuts for experts
## Avoid
- A long row of equal, unlabelled icons for every feature that shipped
## Code: HTML
<pre><code><span class="tag">&lt;div</span> <span class="prop">role</span>=<span class="str">"toolbar"</span> <span class="prop">aria-label</span>=<span class="str">"Edit photo"</span><span class="tag">&gt;</span>
  <span class="tag">&lt;div</span> <span class="prop">role</span>=<span class="str">"group"</span> <span class="prop">aria-label</span>=<span class="str">"Edit"</span><span class="tag">&gt;</span>
    <span class="tag">&lt;button</span> <span class="prop">class</span>=<span class="str">"tool is-accent"</span> <span class="prop">aria-keyshortcuts</span>=<span class="str">"C"</span><span class="tag">&gt;</span><span class="tag">&lt;svg</span> <span class="prop">aria-hidden</span>=<span class="str">"true"</span><span class="tag">/&gt;</span>Crop<span class="tag">&lt;/button&gt;</span>
    <span class="tag">&lt;button</span> <span class="prop">class</span>=<span class="str">"tool"</span><span class="tag">&gt;</span><span class="tag">&lt;svg</span> <span class="prop">aria-hidden</span>=<span class="str">"true"</span><span class="tag">/&gt;</span>Adjust<span class="tag">&lt;/button&gt;</span>
  <span class="tag">&lt;/div&gt;</span>
  <span class="tag">&lt;div</span> <span class="prop">role</span>=<span class="str">"group"</span> <span class="prop">aria-label</span>=<span class="str">"Add"</span><span class="tag">&gt;</span>
    <span class="tag">&lt;button</span> <span class="prop">class</span>=<span class="str">"tool"</span><span class="tag">&gt;</span><span class="tag">&lt;svg</span> <span class="prop">aria-hidden</span>=<span class="str">"true"</span><span class="tag">/&gt;</span>Text<span class="tag">&lt;/button&gt;</span>
    <span class="tag">&lt;button</span> <span class="prop">class</span>=<span class="str">"tool"</span> <span class="prop">aria-haspopup</span>=<span class="str">"menu"</span><span class="tag">&gt;</span>More<span class="tag">&lt;/button&gt;</span> <span class="cm">&lt;!-- rotate, flip, stickers --&gt;</span>
  <span class="tag">&lt;/div&gt;</span>
<span class="tag">&lt;/div&gt;</span></code></pre>
