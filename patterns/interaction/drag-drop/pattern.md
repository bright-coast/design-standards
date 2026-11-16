---
id: drag-drop
title: Drag and Drop
category: interaction
order: 11
---
## Rule
<p>A grabbed item needs to feel like it left the surface: confirm the lift with a slight scale-up, a deeper shadow, and a small tilt together, all at once. Drop zones should speak first: reveal where the item will land before release, not after, using an insertion line to slot between items or a filled highlight to land inside a whole column. On structured surfaces (a kanban board), snap to the nearest valid slot rather than free positioning, and pair every drop with a short undo toast so a wrong move costs one click, not a redo.</p>
<p><strong>Pickup and spring-loading.</strong> The pickup also shows in the cursor (a grabbing hand) and at the origin, where a faded ghost of the item stays until the drop, so the person can see where it came from and where it returns if they cancel. When a drag hovers over a closed folder or a collapsed group, open it after about 600ms, so an item can be dropped deep into a tree in one trip.</p>
## Do
- Reveal the exact drop target before release
- Short undo toast after every drop
- A grabbing cursor plus a faded ghost left at the origin
- Closed folders open after about 600ms of hover mid-drag
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
