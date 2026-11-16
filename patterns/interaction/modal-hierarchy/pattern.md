---
id: modal-hierarchy
title: Modal Hierarchy
category: interaction
order: 17
---
## Rule
<p>The first question is always &ldquo;does this block the user?&rdquo; A modal takes over the screen with a full scrim and should be reserved for critical or destructive choices that genuinely must be answered before anything else. A bottom sheet is the mobile-first default for non-blocking flows. A drawer is edge-anchored and used for navigation, dimming only the area it covers. A popover anchors to its trigger, stays small (~200px), and is for lightweight menus, never a blocking flow. Reaching for a modal when a popover would do adds friction to something routine.</p>
<p><strong>Motion.</strong> A modal enters with a scale from about 0.96 to 1 plus a fade, ease-out, over about 200ms, with its transform origin set to the trigger or the centre. It exits faster, about 150ms, with the reverse. Its content follows the container with a short stagger of about 30 to 50ms, so the title lands before the actions (<a href="#lp-animation-timing">Animation Timing</a>).</p>
## Do
- Modals reserved for critical/destructive decisions only
- Popovers anchored to their trigger, small and contextual
- Enter at about 200ms (scale 0.96 to 1 plus fade), exit faster at about 150ms
## Avoid
- A full-screen modal for a routine, non-blocking action
## Extra: variant-note
<div class="variant-note"><b>Behind the overlay, two variants.</b> Variant A: dim the page with a scrim (this entry). Use when: the overlay must be answered first and the page behind is noise. Variant B: blur the page lightly (about 8 to 12px) with little or no dimming. Use when: a lightweight overlay such as a command palette or quick switcher, where the page behind should stay recognisable. Keep the blur functional and light enough to read the page through; frosted glass on panels that block nothing is decoration. Both kept on purpose.</div>
## Code: JS
<pre><code><span class="kw">function</span> <span class="fn">pickOverlay</span>({ blocksUser, isNavigation, anchoredToTrigger }) {
  <span class="kw">if</span> (blocksUser) <span class="kw">return</span> <span class="str">'modal'</span>;          <span class="cm">// critical/destructive only</span>
  <span class="kw">if</span> (isNavigation) <span class="kw">return</span> <span class="str">'drawer'</span>;       <span class="cm">// edge-anchored, dims only its area</span>
  <span class="kw">if</span> (anchoredToTrigger) <span class="kw">return</span> <span class="str">'popover'</span>; <span class="cm">// small, contextual, ~200px</span>
  <span class="kw">return</span> <span class="str">'sheet'</span>;                          <span class="cm">// mobile-first default, non-blocking</span>
}</code></pre>
