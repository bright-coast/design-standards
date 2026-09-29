---
id: modal-hierarchy
title: Modal Hierarchy
category: interaction
order: 17
---
## Rule
<p>The first question is always &ldquo;does this block the user?&rdquo; A modal takes over the screen with a full scrim and should be reserved for critical or destructive choices that genuinely must be answered before anything else. A bottom sheet is the mobile-first default for non-blocking flows. A drawer is edge-anchored and used for navigation, dimming only the area it covers. A popover anchors to its trigger, stays small (~200px), and is for lightweight menus, never a blocking flow. Reaching for a modal when a popover would do adds friction to something routine.</p>
## Do
- Modals reserved for critical/destructive decisions only
- Popovers anchored to their trigger, small and contextual
## Avoid
- A full-screen modal for a routine, non-blocking action
## Code: JS
<pre><code><span class="kw">function</span> <span class="fn">pickOverlay</span>({ blocksUser, isNavigation, anchoredToTrigger }) {
  <span class="kw">if</span> (blocksUser) <span class="kw">return</span> <span class="str">'modal'</span>;          <span class="cm">// critical/destructive only</span>
  <span class="kw">if</span> (isNavigation) <span class="kw">return</span> <span class="str">'drawer'</span>;       <span class="cm">// edge-anchored, dims only its area</span>
  <span class="kw">if</span> (anchoredToTrigger) <span class="kw">return</span> <span class="str">'popover'</span>; <span class="cm">// small, contextual, ~200px</span>
  <span class="kw">return</span> <span class="str">'sheet'</span>;                          <span class="cm">// mobile-first default, non-blocking</span>
}</code></pre>
