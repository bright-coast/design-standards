---
id: easing
title: Easing Curves
category: motion
order: 3
---
## Rule
<p>The shape of an easing curve is what the eye actually perceives, even holding distance and total duration constant. Linear motion at constant speed reads as robotic because almost nothing in the physical world moves that way. Ease-out (fast start, gentle stop) is the right default for anything entering the screen, since it mimics how a real object decelerates as it arrives. A small spring overshoot (slightly past the resting position before settling back) adds a satisfying, tactile confirmation feel to success states and toggles. Linear easing is really only appropriate for something that has no start or stop of its own, like a continuously looping spinner.</p>
<p><strong>Exits ease in.</strong> Something leaving the screen uses ease-in (gentle start, fast finish), the mirror of an entrance: it accelerates away the way a real object does when it leaves, and it is out of sight before the eye settles on it. <strong>Anticipation, kept small.</strong> A tiny wind-up in the opposite direction before a move or a bounce makes motion feel physical, which suits illustration and marketing motion. In product UI keep it to a few pixels or a scale of about 0.97, and only on a deliberate, occasional action such as a launch or a send, never on every button press or menu.</p>
## Do
- Ease-out as the default for anything entering
- Ease-in for anything leaving
- Anticipation only as a few pixels of wind-up, on rare deliberate actions
## Avoid
- Linear easing on UI that starts and stops
- A spring or bounce on a dropdown or menu (fun once, tiring by the tenth time)
## Code: CSS
<pre><code>:root {
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);      <span class="cm">/* default for anything entering */</span>
  --ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);  <span class="cm">/* for state changes with no clear start/end */</span>
  --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1); <span class="cm">/* slight overshoot, confirmations */</span>
}
.toast-enter { animation: slide-up 250ms var(--ease-out); }
.success-check { animation: pop 400ms var(--ease-spring); } <span class="cm">/* overshoots then settles */</span>
.spinner { animation: spin 900ms linear infinite; } <span class="cm">/* linear is correct, no start/stop */</span></code></pre>
