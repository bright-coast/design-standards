---
id: easing
title: Easing Curves
category: motion
order: 3
---
## Rule
<p>The shape of an easing curve is what the eye actually perceives, even holding distance and total duration constant. Linear motion at constant speed reads as robotic because almost nothing in the physical world moves that way. Ease-out (fast start, gentle stop) is the right default for anything entering the screen, since it mimics how a real object decelerates as it arrives. A small spring overshoot (slightly past the resting position before settling back) adds a satisfying, tactile confirmation feel to success states and toggles. Linear easing is really only appropriate for something that has no start or stop of its own, like a continuously looping spinner.</p>
<p><strong>Exits ease in.</strong> Something leaving the screen uses ease-in (gentle start, fast finish), the mirror of an entrance: it accelerates away the way a real object does when it leaves, and it is out of sight before the eye settles on it. <strong>Anticipation, kept small.</strong> A tiny wind-up in the opposite direction before a move or a bounce makes motion feel physical, which suits illustration and marketing motion. In product UI keep it to a few pixels or a scale of about 0.97, and only on a deliberate, occasional action such as a launch or a send, never on every button press or menu.</p>
<p><strong>Three details that make motion feel premium.</strong> <strong>1. Swap linear for a spring:</strong> for example <code class="tok">spring(k 170, c 21)</code>, a stiffness of 170 and a damping of 21, which settles the way a real object does; in plain CSS, <code class="tok">--ease-spring</code> below stands in. <strong>2. Stagger:</strong> let each element arrive on its own beat, <code class="tok">delay: i &times; 70ms</code>, rather than moving everything at once (the spacing variants are in <a href="#lp-animation-timing">Animation Timing</a>, entry 01). <strong>3. The tiny stuff:</strong> about 5% overshoot before settling, a touch of motion blur on fast moves, and, optionally, a sound effect that lands with the movement.</p>
## Do
- Ease-out as the default for anything entering
- Ease-in for anything leaving
- Anticipation only as a few pixels of wind-up, on rare deliberate actions
- A spring (stiffness 170, damping 21) in place of linear where the motion should feel physical
- About 5% overshoot, a touch of blur on fast moves, an optional landing sound, on hero and confirmation moments
## Avoid
- Linear easing on UI that starts and stops
- A spring or bounce on a dropdown or menu (fun once, tiring by the tenth time)
- Overshoot, blur or sound on an interaction someone repeats all day
## Extra: variant-note
<div class="variant-note"><b>Premium flourish versus a snappy tool, two variants.</b> Variant A: a spring with about 5% overshoot, a touch of motion blur on fast moves and an optional landing sound. Use when: hero sections, onboarding, celebrations, confirmations and other occasional moments meant to be noticed. Variant B: no overshoot and nothing past about 150ms (<a href="#lp-animation-timing">Animation Timing</a>, variant B). Use when: dense productivity UI, menus, dropdowns and anything someone triggers many times a day. Both kept on purpose.</div>
## Code: CSS
<pre><code>:root {
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);      <span class="cm">/* default for anything entering */</span>
  --ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);  <span class="cm">/* for state changes with no clear start/end */</span>
  --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1); <span class="cm">/* slight overshoot, confirmations */</span>
}
.toast-enter { animation: slide-up 250ms var(--ease-out); }
.success-check { animation: pop 400ms var(--ease-spring); } <span class="cm">/* overshoots then settles */</span>
.spinner { animation: spin 900ms linear infinite; } <span class="cm">/* linear is correct, no start/stop */</span>

<span class="cm">/* premium motion: a spring, each element on its own beat, about 5% overshoot, blur only while fast */</span>
<span class="cm">/* in a physics library: { type: "spring", stiffness: 170, damping: 21 } */</span>
.hero-item { animation: rise 500ms var(--ease-spring) backwards; animation-delay: calc(var(--i, 0) * 70ms); }
@keyframes rise {
  0%   { translate: 0 40px; opacity: 0; filter: blur(2px); } <span class="cm">/* a touch of blur on the fast part */</span>
  60%  { translate: 0 -2px; opacity: 1; filter: blur(0); }   <span class="cm">/* about 5% past the 40px move */</span>
  100% { translate: 0 0; }
}
<span class="cm">/* optional: play a short landing sound on animationend, never on a routine control */</span></code></pre>
