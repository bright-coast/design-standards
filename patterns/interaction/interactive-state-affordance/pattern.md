---
id: interactive-state-affordance
title: Interactive State & Affordance
category: interaction
order: 24
---
## Rule
<p>Every interactive element earns its keep by answering two questions instantly: did my click register, and was this ever clickable in the first place. Feedback within 100 milliseconds is the real deadline; past it, someone starts wondering whether the click landed at all, so a control either changes state immediately or shows a loading indicator the moment it's pressed, never neither. Affordance has to be just as unambiguous: if someone has to wonder whether something is clickable, the design already failed, so clickable things look clickable and decorative things don't. One control needs all six states actually designed, not improvised. Default sits at rest. Hover adds a cursor change plus a visual lift. Focus gets a distinct 2px ring offset 2px from the element, visible against both light and dark backgrounds, never a removed outline with nothing put in its place. Active shows a brief scale down or colour darken on press. Disabled drops to 50% opacity with a not-allowed cursor. Loading swaps in an inline spinner and switches the label to its verb form, such as &ldquo;Saving&hellip;&rdquo;. A button reads as a button through fill or border and padding, never colour alone, and its label names the action rather than saying &ldquo;Click here&rdquo;. A link stays underlined or holds a clearly distinct colour with a pointer cursor on hover; never style plain, non-clickable text the same way, and never make a whole row clickable while also nesting a real button inside it, since the two targets fight each other for the same click. The same states need to reach a screen reader, not just a sighted eye: <code class="tok">aria-pressed</code> for a toggle's own state, <code class="tok">aria-busy</code> while something loads, <code class="tok">aria-disabled</code> always paired with the visual treatment rather than standing in for it, <code class="tok">aria-live="polite"</code> on a status message that updates without a reload, and the real semantic element for the job: a button is an actual <code class="tok">&lt;button&gt;</code>, a link is an actual <code class="tok">&lt;a&gt;</code>.</p>
## Do
- All six states (default, hover, focus, active, disabled, loading) actually designed, not improvised
- Focus ring visible on both light and dark backgrounds, never a removed outline with nothing replacing it
- <code class="tok">aria-pressed</code>/<code class="tok">aria-busy</code>/<code class="tok">aria-disabled</code> paired with the matching visual treatment
## Avoid
- Plain non-clickable text styled like a link, or a clickable row with a real button nested inside it
## Code: CSS + JS
<pre><code><span class="cm">/* all six states, none improvised */</span>
.btn { padding: 8px 16px; border-radius: 6px; cursor: pointer; }
.btn:hover { box-shadow: 0 2px 4px rgb(0 0 0 / .08); }
.btn:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; } <span class="cm">/* never outline: none alone */</span>
.btn:active { transform: scale(.97); }
.btn:disabled { opacity: .5; cursor: not-allowed; }
.btn[aria-busy="true"] { pointer-events: none; }

<span class="kw">function</span> <span class="fn">setLoading</span>(btn, isLoading) {
  btn.setAttribute(<span class="str">'aria-busy'</span>, String(isLoading));
  btn.disabled = isLoading; <span class="cm">// prevents double-submit, not just visual</span>
  btn.textContent = isLoading ? <span class="str">'Saving…'</span> : <span class="str">'Save changes'</span>;
}</code></pre>
