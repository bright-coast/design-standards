> A Bright Coast AI skill, made by Rob Lee. github.com/bright-coast/design-standards
> Copyright 2026 Bright Coast AI. For Bright Coast AI clients and people Bright Coast AI has given this link to. You may build what you find here into your own work; you may not republish or resell the material itself. See LICENSE at github.com/bright-coast/design-standards.

# Feedback

What the interface says back after an action, the difference between a product that feels responsive and one that feels like a black box.

**Six states, not one.** Any view that fetches data or handles input needs an explicit answer for all six: Loading (see Skeleton Loading / Loading States System below), Empty (says why it’s empty and what to do next, not “no data”), Partial, Error (see Error States below), Success (a visible confirmation, not silence, see Toast Notifications / Undo UX below), and Offline. Partial and Offline are the two most commonly skipped, since neither has an obvious home the way a spinner or an error banner does. **Partial** covers the moment some data is in and some isn't: keep whatever already loaded on screen and slot skeleton placeholders in only for what's still coming, mark a single field that failed with an inline “Failed to load, retry” instead of erroring the whole component out, and when paginating to a next page, keep the current page visible with loading confined to the bottom rather than clearing everything first. Never blank a screen that already had real content on it, that's a step backward from where someone already was. **Offline** means detecting the drop (`navigator.onLine` plus actual failed requests, since the flag alone lies often enough not to trust on its own), surfacing a persistent banner that names the degraded mode in plain terms, queuing any mutation that can wait and retrying once the connection returns, disabling only the actions that strictly require the network, and never showing a generic error for a failure that offline status already explains.

13 patterns. Use when: loading, empty and error states, toasts, progress and confirmations.

## Doherty Threshold

400ms is the real deadline for a response, not a round number. Under it, attention holds and the interaction feels continuous; over it, the brain mentally checks out and starts a separate thought. The fix isn’t always a faster backend: paint a skeleton the instant a screen opens (before data has actually arrived) and apply optimistic updates for actions that are near-certain to succeed, so the perceived response lands under the threshold even when the real round trip doesn’t.

Do:
- Skeletons paint the instant a screen opens

Avoid:
- A blank, frozen screen while data loads

Code (JS):

```js
function openScreen() {
  renderSkeleton(); // paints in the same frame as navigation, well under 400ms
  fetchData().then(renderReal);
}

async function likePost(id) {
  setLiked(id, true); // perceived response is instant, real request happens after
  try { await api.like(id); }
  catch { setLiked(id, false); } // near-certain to succeed, so failure is the rare path
}
```

## Error States

Match the error’s surface to its actual severity: an inline message under the specific field it belongs to, a toast for something transient that will resolve itself, a page-level replacement only for a genuinely catastrophic failure, and a modal reserved for a true blocker that needs an immediate decision. A toast is the wrong surface the moment the error demands action rather than just information; it disappears on its own timer, taking the one chance to fix the problem with it. Every error needs a real way out (a retry button, a link to fix the input, a support contact), not a dead-end “OK” that just closes the dialog and leaves the underlying problem exactly where it was. Whatever someone had already typed stays exactly where it was; a validation failure or a failed save is never an excuse to clear a field and make them start over. Write the message in plain language; a raw error code or stack trace means nothing to someone who isn’t the engineer who wrote the code.

**A system error message has three parts.** Say what happened, say why if you know, and say what the person can do now: Your invoice was not saved because the connection dropped. Your changes are still here, so select Retry. The default fallback, the message for an error nobody planned for, still names the thing that failed and the next step (We could not load your invoices. Refresh the page, or try again in a minute). It never says Something went wrong, which tells the person nothing and leaves them stuck.

**Name the cause, then pick the pattern.** Four causes need four treatments. **Validation**, the input is wrong: inline under the field, with the fix (Form Validation Timing, Forms entry 05). **Network**, the request never arrived: keep everything on screen, say the connection dropped, retry once quietly where that is safe, then offer Retry. **Server**, the product failed: say so plainly, keep the person’s input, offer Retry and a support route, and log the technical detail for the team instead of showing it. **Permission**, the person is not allowed: say who can grant access and offer Request access, never a Retry that can only fail again.

Do:
- Every error needs a real way out
- Whatever was already typed stays in the field after a failure
- What happened, why if known, and what to do now
- Classify the cause (validation, network, server, permission) and use its treatment

Avoid:
- A Retry button on a permission error
- A dead-end “OK” with no path forward
- A toast for an error that needs the user to actually do something about it
- A Something went wrong fallback that names neither the thing nor the next step

Code (JS):

```js
function handleError(err) {
  if (err.field) return showInlineError(err.field, plainLanguage(err.code)); // one field, inline
  if (err.transient) return showToast({ msg: plainLanguage(err.code), action: { label: 'Retry', onClick: retry } });
  return showModal({ msg: plainLanguage(err.code), action: { label: 'Contact support', href: '/support' } }); // true blocker
}

const MESSAGES = { 'ERR_402': 'Payment failed, check your card details and try again.' }; // never raw codes
function plainLanguage(code, thing = 'your changes') { return MESSAGES[code] ?? `We could not save ${thing}. Check your connection, then try again.`; } // the fallback still names the thing and the next step
```

## Loading States System

Pick the loading pattern from what’s actually known about the wait: a known content shape gets a skeleton, a known percentage gets a real progress bar, and a short wait of unknown length gets a plain spinner. A button doing its own async work is its own special case: the spinner sits inside the button, the label switches to its verb form, the button holds its own width via a minimum width so nothing shifts around it, and it disables itself for the duration so a second click can't fire the same request twice. Show nothing at all for the first ~300ms; a skeleton that flashes for a tenth of a second before real content arrives reads as a flicker, not helpful feedback. Past 2 seconds, swap a bare “Loading…” for real context, “Loading 1,247 records…” tells someone the wait has a reason. Past 10 seconds, offer a way to cancel rather than leaving them stuck watching a spinner with no exit. For anything genuinely long (past 3 seconds and climbing), show real progress wherever it's measurable, give an ETA once one is knowable, and let the operation keep running in the background with a notification when it finishes, instead of holding someone hostage on the screen that started it. For anything reversible, optimistic UI (see Feedback ’Optimistic UI’) beats a loading state entirely by skipping the wait perception altogether.

**Open first, load inside.** A dialog opens the instant it is asked for, with a skeleton inside while its content loads, never after a pause while the data arrives. A route change renders the new page at once, with skeletons only in the parts that wait on async data, so the frame, the heading and the navigation appear straight away.

**Pace a progress bar honestly.** Move the bar the moment work starts, so the person can see it is running, and keep the steadiest movement for the end: a slowdown or a stall near the finish feels far longer than the same pause at the start, and a bar parked at 99% while the slowest step runs is the most irritating wait there is. Where you control the order, run the slow, unpredictable steps early and the quick ones last. Never animate progress that is not tied to real work; a bar that fills on a timer and then waits is a lie people catch.

**Refreshing content that is already on screen.** When cached results exist, show them at once and swap in the fresh ones in place, row by row, with each row keeping its height so nothing reflows. The indicator for that refresh is a thin progress line, 2 to 3px, along the top edge of the panel; never a spinner over content that was readable a moment ago, and never a skeleton that wipes it out (Six Data States, entry 13).

**Guard a submit in code, not only on the button.** The disabled button is the visible half of the double-submit guard. The handler also keeps an in-flight flag and returns early while a request is running, because Enter in a field or a fast double tap can fire before the button repaints. Re-enable when the request settles, on success or on error, never after a fixed delay such as 2 seconds, which unlocks too early on a slow network and leaves a finished form locked on a fast one. For payments and other critical writes, send an idempotency key: one id created per attempt and reused on every retry of that attempt, so the server recognises a duplicate and returns the first result instead of charging twice (Checkout That Feels Safe, Forms entry 16).

Do:
- Nothing at all under ~300ms
- Real context past 2s, a cancel option past 10s
- A button-internal spinner keeps its width and disables itself, so a second click can't double-submit
- Dialogs and new routes that render at once, with skeletons only where data is still coming
- A progress bar that moves at once and never stalls near the end
- Cached results first, refreshed in place under a thin progress line along the top
- An in-flight guard in the handler, released when the request settles, and an idempotency key on payments

Avoid:
- A skeleton for every fetch regardless of duration
- A dialog or page that waits for its data before it appears
- A progress bar driven by a timer instead of real work
- Re-enabling a submit button after a fixed delay

Variant: **The first moment of a wait, two variants.** Variant A: show nothing for the first ~300ms of a content load, so a fast response never flickers a skeleton (this entry). Use when: data is loading into a screen or a panel. Variant B: acknowledge within 100ms, with the pressed state and a spinner inside the button from the moment of the press (Interactive State and Affordance, Interaction entry 24). Use when: the person just clicked or tapped something. Both are kept on purpose; one action often needs both, B on the button and A on the panel it fills.

Code (JS):

```js
function withLoadingState(promise, { onSlow, delayMs = 300 }) {
  const timer = setTimeout(onSlow, delayMs); // nothing shown before this fires
  return promise.finally(() => clearTimeout(timer));
}

// pick the pattern by what's actually known about the wait
function pickLoader({ knownShape, knownPercent }) {
  if (knownPercent) return 'progress-bar';
  if (knownShape) return 'skeleton';
  return 'spinner'; // short, unknown-length wait
}
```

Code (JS: submit guard):

```js
let inFlight = false;
async function onSubmit(e) {
  e.preventDefault();
  if (inFlight) return; // Enter or a double tap can beat the disabled button
  inFlight = true; button.disabled = true;
  const key = form.dataset.attemptKey ||= crypto.randomUUID(); // same key on every retry of this attempt
  try { await api.pay(data, { headers: { 'Idempotency-Key': key } }); delete form.dataset.attemptKey; }
  finally { inFlight = false; button.disabled = false; } // released on settle, never on a timer
}
```

## Notification System

A notification system is really four distinct surfaces (toast, banner, modal, badge), and severity is what should pick which one fires, not habit or whichever component was easiest to reach for. Toasts auto-dismiss and carry undo for low-stakes, reversible events; modals are reserved for things that genuinely block progress. Low-priority toasts need to stack and breathe with a visible gap between them rather than overlapping, and routing everything to the loudest available surface trains people to ignore all of them equally.

**Banners stay, modals never stack.** A banner stays visible until the person dismisses it or the condition behind it is fixed (You are offline, Your card expires in 6 days); it never times out like a toast, because it describes something that is still true. Toasts may stack, up to three; modals never do. If a second blocking question comes up while a modal is open, finish or close the first one, or replace its content in place. A modal opened on top of another buries the first decision and confuses focus and Escape (Modal Hierarchy, Interaction entry 17).

**Badges.** A badge carries two different signals that need different treatment. A count is an action: it says how many, asks you to act now, and changes with each new item. A status dot is a condition: it says which state, asks for nothing, and reads green for online and red for act now. Never put both on one row, since a dot says something changed, a number says how much, and both together is noise. Cap the count so the width is bounded (one unread shows a single dot or number, 200 shows 99+, whereas an uncapped 661 grows the pill and reflows the nav), and pin the badge to the icon’s top corner so the icon never moves whether it shows one digit or three.

A badge clears the second the view is opened; one that lingers after you have looked trains people to ignore every badge. When the count climbs it ticks up and never resets to zero on screen, because that flash reads as a bug. And badge the decision, not everything: for example, badging Messages, Mentions, Product updates, Promotions and System makes the colour meaningless, while badging only Mentions keeps the signal.

Do:
- Toasts auto-dismiss with undo; modals for true blockers
- Badge counts cap at 99+, width bounded so a real spike can’t break the layout
- Badge pinned to the icon’s top corner, so the icon never moves
- One signal per row: a count or a status dot, never both
- The badge clears the moment the view opens; the count ticks up and never blinks to zero
- Only things that need a decision get a badge
- A banner stays until it is dismissed or its condition is fixed

Avoid:
- Routing everything to the loudest surface
- A modal opened on top of another modal
- Badging every category, until the colour means nothing
- A badge that lingers after the user has looked

Code (JS):

```js
function notify({ severity, message, undo }) {
  if (severity === 'low') return pushToast({ message, undo, autoDismiss: 4000 }); // stacks, breathes
  if (severity === 'medium') return showBanner({ message }); // persistent until dismissed
  if (severity === 'blocking') return showModal({ message }); // only true blockers get here
  bumpBadge(); // passive count, no interruption at all
}
```

Code (JS + CSS: badge rules):

```js
const label = (n) => (n > 99 ? '99+' : String(n)); // capped, so the width is bounded (200 shows 99+, never 661)

function setBadge(el, n) {
  el.textContent = label(n); // when the count climbs it ticks up: never reset to 0 on screen and back
  el.hidden = n === 0;
}
function openInbox() { markAllRead(); setBadge(bell, 0); } // open it, clear it: the second the view opens

.bell   { position: relative; }
.badge  { position: absolute; top: 0; right: 0; transform: translate(50%, -50%); overflow: hidden; } /* pinned to the icon's top corner: the icon never moves */
.status-dot { border-radius: 50%; } /* a condition, not a count: green = online, red = act now */
/* one signal per row: render a .badge or a .status-dot, never both; badge only what needs a decision */
```

## Optimistic UI

Update the interface the instant someone acts, sync the real request in the background, and roll back cleanly if it fails. The perceived latency drops to zero even though the network call still takes its normal time. This is reserved for reversible, low-stakes actions where a rollback costs nothing (a like, a follow, an inline edit); trust the success case and design failure as the rare exception rather than the default assumption. Never apply it to a payment or anything else unsafe to silently reverse.

**A rollback is never silent.** When the request fails, put the old state back and say so in the same place, with a way to try again: Could not save this post. Retry. A save, a bookmark or a follow that quietly undoes itself later leaves the person believing something that is no longer true, and they find out only when the thing they saved is gone. If they may already have moved on to another screen, tell them where they are now, not on the screen they left.

Do:
- Reserved for reversible, low-stakes actions
- A failed request restores the old state and says so, with Retry

Avoid:
- Optimistic payments or anything unsafe to undo

Code (JS):

```js
async function optimisticUpdate(id, nextState, apiCall) {
  const previous = getState(id);
  setState(id, nextState); // applied instantly, before the request even starts
  try {
    await apiCall();
  } catch {
    setState(id, previous); // clean rollback, only reachable for reversible actions
    notify({ severity: 'low', message: 'Update failed, reverted.' });
  }
}
```

## Skeleton Loading

A skeleton previews the real content’s shape (card outlines, text-line bars) so the brain starts parsing the layout before the actual data has arrived, which measurably reduces the perceived wait versus a blank screen or spinner. It needs to animate (a shimmer sweep) and match the real content’s dimensions closely, or the layout visibly jumps the moment data replaces it. Skip a loading state entirely for an action just performed by the same user (like a submit that immediately shows its own result); they already know it’s working.

Shape each block like the thing it stands in for: a circle for an avatar, a short bar for a name, longer bars for body text, a rounded rectangle for an image. The shimmer sweeps in the reading direction, left to right in a left-to-right language and right to left under `dir="rtl"`, so it travels the way the eye will read the content that replaces it.

Do:
- Animate the shimmer, match real dimensions
- Circles for avatars, short bars for names, long bars for body text
- Shimmer in the reading direction, reversed under `dir="rtl"`

Avoid:
- A skeleton that jumps to a different layout on load

Code (CSS):

```css
.skeleton {
  background: linear-gradient(90deg, var(--sk-base) 25%, var(--sk-shine) 50%, var(--sk-base) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.4s ease-in-out infinite;
  border-radius: 6px;
}
@keyframes shimmer { to { background-position: -200% 0; } } /* sweeps left to right */
[dir="rtl"] .skeleton { animation-direction: reverse; } /* right to left for RTL reading */

/* match the REAL element's exact dimensions so nothing jumps on swap */
.skeleton-avatar { width: 40px; height: 40px; border-radius: 50%; }
.skeleton-title  { width: 60%; height: 16px; margin-bottom: 8px; }
.skeleton-line   { width: 100%; height: 12px; }

@media (prefers-reduced-motion: reduce) { .skeleton { animation: none; opacity: .6; } }
```

## Toast Notifications

Position toasts deliberately (bottom-right on desktop, a top-edge banner on mobile) and never dead-centre over active content, where they block exactly what someone is trying to look at. Match the dismiss timing to severity: a routine confirmation clears in a few seconds, a warning holds longer or waits for a manual dismiss. Cap the visible stack at three and pause the auto-dismiss timer on hover so a toast doesn’t vanish mid-read, and always pair colour with an icon; colour alone is the same accessibility failure it is everywhere else in this document. The right confirmation still depends on what just happened. An inline edit gets a quiet green flash plus a checkmark on the field itself for about 1.5 seconds, no toast needed. A form submit that keeps someone on the same page gets a toast plus a visible change in the data they're looking at. A form submit that navigates somewhere new shows the confirmation as context on the destination itself, “Created John Smith” at the top of his new record, rather than a toast that's already gone by the time the new page renders. A batch action gets a plain summary count, “Suspended 12 users”, not a silent redirect that leaves someone guessing whether it worked.

**Timing, controls and type markers.** Info and success toasts stay about 4 seconds, warnings about 7, and an error toast never dismisses itself: it waits until the person acknowledges it, because an error that leaves on its own takes the fix with it. Every toast has a visible close button, and on touch screens it can also be swiped away. Mark the type with an icon plus a coloured left border of about 3 to 4px, not a background tint alone, which fades in dark mode and says little to a colour-blind reader. When a toast enters or leaves, the others in the stack slide to their new places on a short spring (about 300ms, little or no overshoot) instead of jumping; under reduced motion they move without it.

Do:
- Cap the stack at 3, pause on hover
- Confirmation matches the action: inline flash, toast, destination context, or a batch summary count
- About 4s for info, about 7s for warnings, errors until acknowledged
- A close button on every toast, and swipe to dismiss on touch
- Icon plus a coloured left border to mark the type; the stack slides on a short spring

Avoid:
- An error toast that dismisses itself
- Colour-only type signalling, no icon
- Silent success, leaving someone to guess whether it actually worked

Code (JS):

```js
const queue = [];
function pushToast(toast) {
  queue.push({ ...toast, id: crypto.randomUUID() });
  if (queue.length > 3) queue.shift(); // stack capped at 3
  render();
}

toastEl.addEventListener('mouseenter', () => clearTimeout(toastEl._timer)); // pause on hover
toastEl.addEventListener('mouseleave', () => {
  toastEl._timer = setTimeout(() => dismiss(toastEl), toastEl.dataset.severity === 'warning' ? 7000 : 4000);
});
```

Code (JS + CSS: durations, close and stack motion):

```js
const DURATION = { info: 4000, success: 4000, warning: 7000, error: null }; // null = stays until acknowledged
const ms = DURATION[toast.type];
if (ms) toastEl._timer = setTimeout(() => dismiss(toastEl), ms);
toastEl.querySelector('.toast-close').onclick = () => dismiss(toastEl); // every toast, every type

.toast { border-left: 4px solid var(--type-colour); } /* plus the type icon, never tint alone */
.toast-stack > * { transition: transform 300ms cubic-bezier(0.22, 1, 0.36, 1); } /* the stack slides, never jumps */
@media (prefers-reduced-motion: reduce) { .toast-stack > * { transition: none; } }
```

## Undo UX

Undo beats a confirmation dialog for most destructive actions: act immediately with zero friction, then offer a real second chance via a toast instead of asking “are you sure?” before anything has even happened, a question people click through without reading anyway. Soft-delete under the hood with a genuine recovery window (not an instant hard-delete dressed up with an undo button that does nothing), and show a visible countdown on the toast so the window’s urgency is honest rather than a guess.

Do:
- Soft-delete with a real recovery window

Avoid:
- Blocking every delete behind a confirm nobody reads

Variant: **Undo toast duration, two variants.** Variant A: about 4 seconds for a reversible, low-stakes change such as a notification setting (Success States, entry 12). Use when: the change is trivial to redo by hand. Variant B: 5 to 10 seconds, longer for anything destructive, with the countdown visible. Use when: the undo recovers something deleted or sent. Both are kept on purpose.

Code (JS):

```js
function deleteWithUndo(item) {
  softDelete(item.id); // happens immediately, no "are you sure" dialog
  const deadline = Date.now() + 5000;
  pushToast({
    message: `Deleted "${item.title}"`,
    countdown: deadline, // toast renders a live countdown against this
    action: { label: 'Undo', onClick: () => restore(item.id) },
    onExpire: () => hardDelete(item.id), // only now is it actually gone
  });
}
```

## Zeigarnik Effect

The mind keeps an unfinished task active in working memory and drops a finished one almost instantly. A visibly incomplete progress bar pulls attention back in a way a completed one never does. A profile-completeness meter with one deliberate box left unchecked (“Add a photo”) exploits exactly this to bring someone back to finish it. The open loop has to tie to an outcome the person actually wants, not a made-up metric; manufacturing progress nobody asked to track just reads as manipulative busywork.

**The head start.** An onboarding checklist can open with one genuine item already ticked (Account created, 1 of 3 done). A task that is already under way feels worth finishing, so people carry on instead of closing the app. The ticked item has to be something the person really did; pre-ticking an invented step is the manufactured progress this entry warns against. Applied to a first run in First Run Without a Tour (Content, entry 05).

Do:
- One deliberate box left unchecked in onboarding
- A checklist that opens with one real step already ticked (1 of 3)

Avoid:
- Manufacturing progress nobody asked to track

Code (JS):

```js
const profileSteps = [
  { key: 'name', done: true },
  { key: 'avatar', done: false }, // deliberately left open, pulls the user back
  { key: 'bio', done: true },
];
const pct = Math.round((profileSteps.filter(s => s.done).length / profileSteps.length) * 100);
// "Profile 90% complete, add a photo to finish" ties the open loop to a real, wanted outcome
```

## Destructive Action Risk Tiers

Not every destructive action deserves the same friction, and matching friction to actual consequence is what makes the friction mean something instead of training people to click through it. Four tiers, escalating with what’s actually at stake. **Low** risk, with a clear undo path (delete a draft, remove a filter), gets a single click plus a toast with undo, no modal at all (see Undo UX above). **Medium** risk, with some recovery path (delete a project, remove a teammate), gets a confirmation modal with the destructive button styled red and labelled with the verb (see Destructive Actions in Interaction above for the hold-to-confirm mechanic that pairs with this tier). **High** risk, with real consequences (delete a client’s account, wipe a dataset), escalates to a modal that requires typing the resource’s name or the word DELETE before the button activates at all. **Critical** risk that genuinely can’t be recovered (close an account, revoke every API key) adds a password or 2FA re-entry on top of the typed confirmation. Whatever the tier, focus defaults to Cancel, never to the destructive button itself.

**Write the dialog so it reads in one glance.** The title names the action and the object (Delete invoice #1247?), never a bare Are you sure? The body states the consequences in plain words: what disappears, who loses access, and whether it can be undone. Cancel is styled as the secondary button, so the destructive verb is the only strong action in the dialog.

**The inverse tier: protective actions get no friction.** An action that protects the person and can be reversed at once (freeze a card, lock an account, pause payouts, sign out every device) gets no confirmation dialog at all. It sits one tap away on the screen where the risk is noticed, such as a Freeze card button on the card’s own page and beside a transaction that looks wrong, and the same control undoes it with one tap (Unfreeze). Friction here slows the person down at the exact moment speed matters most.

Do:
- Friction escalates with actual consequence, not with how severe the action feels
- Confirmation dialog focus defaults to Cancel, never the destructive button
- A dialog title that names the action and the object, with the consequences in the body
- Freeze, lock and pause: one tap on the screen where the risk shows up, and one tap to undo

Avoid:
- One “are you sure?” modal used identically for a draft delete and an account close
- An Are you sure? title that names no object
- A confirmation dialog in front of a protective, reversible action

Code (JS):

```js
// tier -> UI treatment
const DESTRUCTIVE_TIERS = {
  protective: { ui: 'one-tap+same-control-undoes', confirm: false }, // freeze card, lock account
  low:      { ui: 'toast+undo',      confirm: false },
  medium:   { ui: 'modal',            confirm: 'click' },
  high:     { ui: 'modal-typed',      confirm: 'type-resource-name' },
  critical: { ui: 'modal-typed+2fa',  confirm: 'type-resource-name+reauth' },
};

function confirmDialog(tier, resourceName) {
  return {
    defaultFocus: 'cancel', // every tier, never the destructive button
    requiresTyping: (tier === 'high' || tier === 'critical') ? resourceName : null,
    requiresReauth: tier === 'critical',
  };
}
```

## Copy to Clipboard

A copy button changes nothing on screen by itself, so it has to prove it worked. **1. Flip instantly.** The copy icon becomes a check on the same frame the copy fires, with no spinner and no delay; a 480ms spinner feels broken next to a 0ms flip. **2. Reset after two seconds.** Hold the check for about two seconds, then fade back to the copy icon; if it stays stuck, the second copy gives no signal at all. **3. Copy the raw value.** Copy the plain string, not the formatted span with its line breaks and hidden zero-width characters, which break when pasted into a terminal (the demo shows a parse error against “authenticated”). **4. Say it out loud.** A silent icon change is invisible to a screen reader, so announce “Copied” through a polite `aria-live` region. **5. Fall back, don’t lie.** On an insecure origin (for example plain http) the modern clipboard call fails, so try `navigator.clipboard.writeText`, catch the failure, fall back to the older `execCommand` copy, and show an honest message if both are blocked. A silent button lies.

Do:
- The icon flips to a check on the same frame the copy fires, no spinner
- The check holds for about 2 seconds, then fades back to the copy icon
- Copy the raw string, never the formatted span
- Announce “Copied” through a polite `aria-live` region
- Try the modern call, catch, fall back to `execCommand`, and show an honest message if both are blocked

Avoid:
- A spinner or delay between the click and the confirmation
- A check that never resets, so the second copy gives no signal
- A silent failure, or a check shown when nothing was copied

Note: **Two accuracy notes.** On an insecure origin the modern clipboard API is usually unavailable altogether (`navigator.clipboard` is undefined) rather than failing silently, so check for it before calling it. And `document.execCommand('copy')` is officially deprecated though still widely supported, so treat the fallback as pragmatic, not ideal. Related entries: Toast Notifications, Undo UX and Interactive State & Affordance.

Code (JS):

```js
async function copyRaw(btn, live) {
  const raw = btn.dataset.copy;           // the plain string, never the formatted span's innerText (line breaks, zero-width characters)
  const ok = await writeClipboard(raw); // no spinner state exists between the click and the check
  if (!ok) { live.textContent = 'Could not copy. Select the text and press Ctrl+C.'; return; } // an honest message, not a lying check
  btn.classList.add('copied');          // copy icon becomes a check, instantly
  live.textContent = 'Copied';           // polite aria-live region: screen readers announce it
  setTimeout(() => { btn.classList.remove('copied'); live.textContent = ''; }, 2000); // reset after about 2 seconds, fade back
}

async function writeClipboard(text) {
  try { await navigator.clipboard.writeText(text); return true; } // navigator.clipboard is undefined on insecure origins, so this throws
  catch (_) {
    const ta = Object.assign(document.createElement('textarea'), { value: text });
    document.body.appendChild(ta); ta.select();
    const ok = document.execCommand('copy'); // deprecated but still widely supported: pragmatic, not ideal
    ta.remove();
    return ok; // false = both paths blocked, so tell the user
  }
}
<!-- <div id="copy-live" aria-live="polite"></div>  the live region must already exist in the DOM -->
```

## Success States

A done screen is not a dead end, and five decisions keep the person moving. **Say what happened:** what, who and when, with the specifics (Invoice sent to Northwind Labs, INV-2051, EUR 2,400, due 12 Oct, sent just now) instead of Success! Your action was completed; specifics are the proof it worked, and a vague success feels like a maybe. **Offer the next action:** one primary next step and one way back (View invoice, Send another, Back to invoices); a check mark with no button is a dead end, and the person closes the tab right there.

**Dismissal follows stakes:** a reversible, low-stakes change (notification settings) gets a toast with Undo that leaves after about 4 seconds; money gets a page that stays, with the plan, amount, card, date, a downloadable receipt and a copy by email, because nobody screenshots a toast. **Leave one open loop:** one thread to pull, such as tracking the payment (sent, opened, paid, notify me when paid), sharing the report, or inviting teammates; a finished task with a thread to pull brings people back (Zeigarnik Effect, Feedback entry 09). **Celebrate the rare win:** confetti is for milestones such as the first invoice paid, never every save; rare joy lands, constant joy is noise (Peak-End Rule, Interaction entry 18).

A success message leaves once it has been read. It never stays pinned on the page, where it goes stale and starts to look like part of the layout. A receipt page for a payment is a page in its own right, not a message left on another screen.

**Pending is a state of its own.** When money has been sent but has not arrived, the receipt says so: a visible Pending status with the expected arrival (Arrives by Thu 14 Nov), shown on the receipt and on the same row in the history list. When the transfer settles, that row changes to Completed with the time it completed. Never show Completed for money that is still in flight, and never leave a settled transfer marked Pending.

Do:
- What, who and when, with real specifics
- One primary next action and one way back
- Reversible = toast with Undo; money = a page with a receipt
- Confetti for milestones only
- A success message that leaves once it has been read
- A transfer shows Pending with its expected arrival, on the receipt and in history, until it settles to Completed

Avoid:
- Success! with an OK button and nothing else
- A payment confirmed only by a toast
- Completed shown for money that is still in flight
- Confetti on every save
- A success banner that stays on the page for good

Code (JS):

```js
// success = what + who + when, one primary next step, one way back
function onDone(r) {
  if (r.reversible && !r.money) toast(`${r.what} saved`, { action: 'Undo', ms: 4000 }); // low stakes
  else showPage('receipt', r); // money: a page that stays, receipt plus email
  if (r.milestone) confetti(); // first invoice paid, never every save
}
```

## Six Data States

Anything that fetches data, accepts input or does async work has six states, and each one is designed rather than left to whatever the happy path happens to render. **Loading** shows a skeleton that matches the final layout, or a progress indicator with intent (Loading States System, entry 03). **Empty** explains why and offers the next action (Empty States, Content entry 01). **Partial** shows what did load and marks what did not. **Error** says what happened and offers a way out (Error States, entry 02). **Success** is a visible confirmation, never just the absence of an error (Success States, entry 12). **Offline** is a degraded mode with an explanation.

**Partial is the most skipped state.** When some items have loaded and more are coming, show the loaded items with skeleton placeholders for the rest. When one field or panel fails, mark only that spot with Failed to load, Retry, rather than turning the whole component into an error. When the next page is loading, keep the current page visible and show the loader at the bottom. Never blank the screen on a partial failure; that throws away data the person already had.

**Offline, at minimum.** Detect it (navigator.onLine plus failed requests). Say so in a persistent banner (Offline, your changes are saved on this device). Queue changes and replay them on reconnect where possible (Autosave, Forms entry 01). Disable the actions that strictly need the network, and raise no errors for failures that being offline already explains. If the product genuinely cannot work offline, say so the first time it happens rather than failing silently. Before calling a data component done, tick all six states; any unticked one is a gap to fix or to name out loud.

**Not every component has all six.** Partial only applies when the data arrives in pieces: paginated, streamed, or pulled from more than one source. Offline only applies to a product that is meant to keep working without a connection. When a state cannot happen, mark it n/a with a one-line reason (n/a, one request returns the whole record) instead of building a screen nobody will ever see.

Do:
- All six states handled: loading, empty, partial, error, success, offline
- A partial failure marks one spot and keeps everything else on screen
- A persistent offline banner, with changes queued for reconnect
- A state that cannot happen marked n/a with its reason, not built

Avoid:
- A component that only renders the happy path
- Blanking the screen when one request out of five fails
- A wall of network errors for something being offline already explains

Variant: **Which states to build, two variants.** Variant A: all six states are mandatory, and every one is designed and ticked (the rule above). Use when: the data is paginated, streamed or pulled from several sources, and the product is meant to work offline. Variant B: build only the states that can actually happen, and mark the rest n/a with a reason; partial is only for paginated, streamed or multi-source data, and offline only for products meant to work offline. Use when: one request returns the whole result, or the product cannot work offline at all. Either way, every state is designed or named n/a out loud, never silently skipped.

Code (JSX):

```jsx
// all six states, in the order they are checked
if (offline && !data)  return <OfflineState onRetry={refetch} />;   // degraded mode, explained
if (isLoading)         return <ListSkeleton rows={5} />;           // same shape as the real list
if (isError)           return <ErrorState title="We couldn't load invoices" onRetry={refetch} />;
if (data.length === 0) return <EmptyState action="Create your first invoice" />;
return (<>
  {offline && <Banner>Offline, your changes are saved on this device</Banner>}
  <List items={data} failed={failedIds} />  {/* partial: a failed row shows Retry inline */}
</>);
```
