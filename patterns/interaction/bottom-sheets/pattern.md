---
id: bottom-sheets
title: Bottom Sheets
category: interaction
order: 3
---
## Rule
<p>Phone screens keep getting taller while thumbs stay the same length, which turns the top of the display into a dead zone for one-handed use. A bottom sheet anchors actions where the thumb naturally rests instead of a top-right corner, and unlike a full modal it keeps the page visible behind it so context is never lost. Snap points let it rest half-open or expand to full height depending on how much content is actually needed, and drag-to-dismiss maps the closing gesture to the same direction the sheet opened from.</p>
<p><strong>Dismissal, stacking and desktop.</strong> Dismiss on a fast downward flick (faster than about 0.5px per millisecond) or a drag past halfway, whichever comes first; distance alone makes a quick flick bounce back and feel broken. Never stack a sheet on a sheet: replace the content inside the same sheet and add a back arrow at the top left. On desktop the same content becomes a side drawer between 320px and 40% of the screen width, since a bottom sheet stretched across a wide monitor puts content far from the eye.</p>
## Do
- Snap points for half/full height
- Dim + lock body scroll behind the sheet
- Dismiss on a fast flick or a drag past halfway
- On desktop, a side drawer between 320px and 40% of the screen width
## Avoid
- Leaving the background scrollable while it&rsquo;s open
- A sheet opened on top of another sheet
## Code: CSS + JS
<pre><code>.sheet {
  position: fixed; inset: auto 0 0 0;
  border-radius: 16px 16px 0 0;
  transform: translateY(0);
  transition: transform 250ms ease;
  touch-action: none;
}
.sheet[data-snap=<span class="str">"half"</span>] { height: 50vh; }
.sheet[data-snap=<span class="str">"full"</span>] { height: 92vh; }
.scrim { position: fixed; inset: 0; background: rgb(0 0 0 / .4); }

<span class="kw">let</span> startY = <span class="num">0</span>, dy = <span class="num">0</span>;
handle.addEventListener(<span class="str">'pointerdown'</span>, e => {
  startY = e.clientY;
  handle.setPointerCapture(e.pointerId);
});
handle.addEventListener(<span class="str">'pointermove'</span>, e => {
  dy = Math.max(<span class="num">0</span>, e.clientY - startY);
  sheet.style.transform = <span class="str">`translateY(${dy}px)`</span>;
});
handle.addEventListener(<span class="str">'pointerup'</span>, () => {
  <span class="kw">if</span> (dy > <span class="num">120</span>) closeSheet(); <span class="kw">else</span> sheet.style.transform = <span class="str">''</span>;
});</code></pre>
