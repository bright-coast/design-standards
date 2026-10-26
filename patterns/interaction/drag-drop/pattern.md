---
id: drag-drop
title: Drag and Drop
category: interaction
order: 11
---
## Rule
<p>A grabbed item needs to feel like it left the surface: confirm the lift with a slight scale-up, a deeper shadow, and a small tilt together, all at once. Drop zones should speak first: reveal where the item will land before release, not after, using an insertion line to slot between items or a filled highlight to land inside a whole column. On structured surfaces (a kanban board), snap to the nearest valid slot rather than free positioning, and pair every drop with a short undo toast so a wrong move costs one click, not a redo.</p>
## Do
- Reveal the exact drop target before release
- Short undo toast after every drop
## Avoid
- Making a wrong drop permanent with no way back
## Extra: variant-note
<div class="variant-note"><b>Drop placeholder, two variants.</b> Variant A: an insertion line between items. Use when: lists of short, uniform rows, where a line is enough. Variant B: a placeholder the exact height of the dragged card (a 96px card opens a 96px slot), so the column opens once and nothing else moves. Use when: kanban cards of varying height, where a thin line makes every card below jump on drop. Both kept on purpose.</div>
## Code: JS
<pre><code>card.addEventListener(<span class="str">'dragstart'</span>, () => {
  card.classList.add(<span class="str">'lifted'</span>); <span class="cm">/* CSS: scale(1.03) + shadow + slight rotate */</span>
});
card.addEventListener(<span class="str">'dragend'</span>, () => card.classList.remove(<span class="str">'lifted'</span>));

zone.addEventListener(<span class="str">'dragover'</span>, (e) => {
  e.preventDefault();
  zone.classList.add(<span class="str">'drop-target'</span>); <span class="cm">// shows the insertion line / fill before drop</span>
});
zone.addEventListener(<span class="str">'dragleave'</span>, () => zone.classList.remove(<span class="str">'drop-target'</span>));

zone.addEventListener(<span class="str">'drop'</span>, () => {
  <span class="kw">const</span> originalZone = card.parentElement;
  moveCardTo(card, zone); <span class="cm">// snap to nearest valid slot</span>
  showUndoToast(() => moveCardTo(card, originalZone), <span class="num">5000</span>);
});</code></pre>
