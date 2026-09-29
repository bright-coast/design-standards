> A Bright Coast AI skill, made by Rob Lee. Part of the Claude Power Setup Guide: github.com/bright-coast/claude-power-setup-guide
> Copyright 2026 Bright Coast AI. For Bright Coast AI clients and people Bright Coast AI has given the guide to, not for copying or redistribution: see LICENSE at github.com/bright-coast/claude-power-setup-guide.

# Motion

The smallest category, but the one where a wrong number is felt by everyone even when nobody can name what’s off.

5 patterns. Use when: animation timing, easing and transitions.

## Animation Timing

An element entering the screen lands best at 200-300ms with an ease-out curve, long enough to read as deliberate motion, short enough not to feel sluggish. Exits should run noticeably faster than their entrance, around 150ms, because something leaving the screen doesn’t need to earn the same attention something new arriving does. Tap/click feedback (a button’s pressed state) needs to register in under 100ms without exception; anything slower reads as lag, not animation. When staggering a list of items into view, roughly 50ms between each item is enough to read as a cascade rather than a delay. A hover response specifically should register around 60ms, and no interaction transition in a dense productivity UI should run past ~150ms or use an overshoot/bounce easing curve. A snappy, no-overshoot response is what makes a tool feel instantly answering rather than animating at you.

To stagger a list in one rule, instead of a hand-set delay on every item, use the CSS function `sibling-index()`, which returns an element’s position among its siblings: `animation-delay: calc(sibling-index() * 100ms)` with the keyframes unchanged. It works for a list of any length, including items added later, with no per-item CSS or JavaScript. It starts at 1, so use `calc((sibling-index() - 1) * 50ms)` when the first item should have no delay. Support is Chrome and Edge 138 and Safari 26.x, with Firefox still missing as of mid-2026, so keep the `--i` variable as the fallback.

Do:
- Tap feedback under 100ms, always
- ~60ms hover response, no overshoot/bounce easing in dense UI
- Stagger with `sibling-index()` where supported, the `--i` variable as the fallback

Avoid:
- Symmetric in/out timing that drags
- A 600ms interface animation: it reads as broken past the 150 to 250ms band

Variant: **Variants held here.** A: entrances land at 200 to 300ms with ease-out. Use when: an element is entering the screen. B: nothing in a dense productivity UI runs past about 150ms, and exits run around 150ms. Use when: the screen is a dense productivity UI, which is this entry’s own wording (Dropdown Design’s 150ms open is variant B). C: interface motion stays in a 150 to 250ms band with 250ms as the shared ceiling. Use when: you want one number for general interface motion. All three are kept on purpose.

Code (CSS):

```css
:root {
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
  --dur-tap: 80ms;    /* feedback, never slower than this */
  --dur-enter: 250ms; /* entrances */
  --dur-exit: 150ms;  /* exits run faster than entrances */
}
.btn:active { transform: scale(.97); transition: transform var(--dur-tap) ease-out; }
.modal-enter { animation: fade-up var(--dur-enter) var(--ease-out); }
.modal-exit  { animation: fade-down var(--dur-exit) ease-in; } /* faster than the enter */

.list-item { animation: fade-up 250ms var(--ease-out) backwards; }
.list-item:nth-child(n) { animation-delay: calc(var(--i, 0) * 50ms); } /* ~50ms stagger */

/* CSS-native stagger where supported: no per-item variable, and it works for items added later */
/* sibling-index() starts at 1, so subtract 1 when the first item should have no delay */
@supports (width: calc(sibling-index() * 1px)) {
  .list-item:nth-child(n) { animation-delay: calc((sibling-index() - 1) * 50ms); }
}
/* a shorter version: li { animation: in .4s backwards; animation-delay: calc(sibling-index() * 100ms); }
   @keyframes in { from { opacity: 0; translate: -20px } } ; the --i rule above stays as the fallback */
```

## Card Hover Anatomy

Lift the card itself with real physical weight (roughly 8px of translateY over about 200ms) and animate what’s inside the card (an image scaling up, actions fading in), never the card’s own outer footprint, which would shove neighbouring cards around in a grid. Stagger any actions that reveal on hover roughly 60ms apart so they cascade in rather than popping simultaneously, and scale an inner image inside an `overflow: hidden` frame so the zoom stays contained within the card’s fixed bounds.

Do:
- Scale the image inside an overflow-hidden frame

Avoid:
- Scaling the whole card, shifting neighbours

Code (CSS):

```css
.card { transition: transform 200ms var(--ease-out), box-shadow 200ms; }
.card:hover { transform: translateY(-8px); } /* lifts the card, doesn't resize its footprint */

.card-image-frame { overflow: hidden; border-radius: 8px 8px 0 0; } /* contains the zoom */
.card-image-frame img { transition: transform 300ms var(--ease-out); }
.card:hover .card-image-frame img { transform: scale(1.08); } /* image scales, card footprint doesn't */

.card-actions { display: flex; gap: 8px; }
.card-actions > * { transition: opacity 150ms, transform 150ms; }
.card-actions > *:nth-child(1) { transition-delay: 0ms; }
.card-actions > *:nth-child(2) { transition-delay: 60ms; } /* ~60ms stagger */
```

## Easing Curves

The shape of an easing curve is what the eye actually perceives, even holding distance and total duration constant. Linear motion at constant speed reads as robotic because almost nothing in the physical world moves that way. Ease-out (fast start, gentle stop) is the right default for anything entering the screen, since it mimics how a real object decelerates as it arrives. A small spring overshoot (slightly past the resting position before settling back) adds a satisfying, tactile confirmation feel to success states and toggles. Linear easing is really only appropriate for something that has no start or stop of its own, like a continuously looping spinner.

Do:
- Ease-out as the default for anything entering

Avoid:
- Linear easing on UI that starts and stops
- A spring or bounce on a dropdown or menu (fun once, tiring by the tenth time)

Code (CSS):

```css
:root {
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);      /* default for anything entering */
  --ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);  /* for state changes with no clear start/end */
  --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1); /* slight overshoot, confirmations */
}
.toast-enter { animation: slide-up 250ms var(--ease-out); }
.success-check { animation: pop 400ms var(--ease-spring); } /* overshoots then settles */
.spinner { animation: spin 900ms linear infinite; } /* linear is correct, no start/stop */
```

## Scroll-Driven Animations

Native CSS `animation-timeline: scroll()` turns the scrollbar itself into an animation controller with zero JavaScript and zero scroll-listener jank. The browser drives the animation progress directly from scroll position on its own compositor thread. The related `view()` timeline animates an element specifically as it enters and exits the viewport, ideal for scroll-triggered reveals. Pair either with `position: sticky` for effects like a header that shrinks as it pins to the top. A hand-rolled scroll-listener re-implementation of this is strictly worse: it runs on the main thread and is the classic source of janky parallax.

Do:
- `view()` to animate elements as they enter

Avoid:
- Hand-rolled scroll-listener parallax

Code (CSS):

```css
@keyframes fade-in-up { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: none; } }

.reveal-on-scroll {
  animation: fade-in-up linear both;
  animation-timeline: view(); /* progress driven by the element entering the viewport */
  animation-range: entry 0% cover 30%; /* fully in by 30% scrolled into view */
}

.shrinking-header {
  position: sticky; top: 0;
  animation: shrink-header linear both;
  animation-timeline: scroll(); /* driven by the page's own scroll position, zero JS */
}
@keyframes shrink-header { to { padding-block: 8px; font-size: 14px; } }
/* @supports fallback: browsers without support just render the resting (non-shrunk) state */
```

## Motion That Stays Cheap

Interface motion goes wrong in six ways, and the first three are already covered by Animation Timing and Easing Curves: a 600ms animation reads as broken, so keep interface motion in the 150 to 250ms band; linear easing looks mechanical, so use ease-out (fast off the mark, gentle at the end); and a spring on a dropdown is fun once and tiring by the tenth time, so save the bounce for a celebration. The other three are here. **4. Origin.** Set `transform-origin` so a menu grows out of the thing that opened it, instead of fading in from nowhere. **5. Reduced motion.** If the user turned the setting on, give them a fade and never a flight: an `@media (prefers-reduced-motion)` rule that swaps a 300px move for an opacity fade. **6. The jank.** Animating `width` forces a page relayout every frame, so animate `transform` and `opacity` and stay on the compositor. A width from 12% to 100% and `transform: scaleX()` from 0.12 to 1 look identical in a design file, but in a side-by-side test one can run at 60fps and the other at 12 (illustrative figures; real devices vary). Good motion is invisible until it is wrong.

Do:
- `transform-origin` set to the trigger, so a menu grows out of the thing that opened it
- Animate `transform` and `opacity` only, never `width`, `height` or `left`
- `prefers-reduced-motion` swaps the movement for an opacity fade
- Interface motion inside the 150 to 250ms band, ease-out, with the bounce kept for celebrations

Avoid:
- A 600ms animation
- Animating `width` to draw a progress bar
- A 300px fly-in for someone who asked for reduced motion

Code (CSS):

```css
/* 4. origin: grow from the thing that opened it */
.menu { transform-origin: top left; } /* the trigger's corner, not the menu's own centre */
@keyframes menu-in { from { opacity: 0; transform: scale(.95); } to { opacity: 1; transform: none; } }
.menu.open { animation: menu-in 200ms ease-out both; } /* inside the 150 to 250ms band */

/* 5. reduced motion: a fade, never a flight */
@keyframes fly-in  { from { transform: translateX(300px); } to { transform: none; } }
@keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
.panel { animation: fly-in 200ms ease-out both; }
@media (prefers-reduced-motion: reduce) {
  .panel { animation-name: fade-in; } /* swap the 300px move for an opacity fade */
}

/* 6. the jank: animate transform and opacity, stay on the compositor */
.bar { width: 100%; transform-origin: left; }
.bar.loading { animation: fill 1.2s ease-out both; }
@keyframes fill { from { transform: scaleX(.12); } to { transform: scaleX(1); } } /* not width: 12% to 100%, which relayouts every frame */
```
