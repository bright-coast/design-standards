> A Bright Coast AI skill, made by Rob Lee. Part of the Claude Power Setup Guide: github.com/bright-coast/claude-power-setup-guide
> Copyright 2026 Bright Coast AI. For Bright Coast AI clients and people Bright Coast AI has given the guide to, not for copying or redistribution: see LICENSE at github.com/bright-coast/claude-power-setup-guide.

# Feedback

What the interface says back after an action, the difference between a product that feels responsive and one that feels like a black box.

**Six states, not one.** Any view that fetches data or handles input needs an explicit answer for all six: Loading (see Skeleton Loading / Loading States System below), Empty (says why it’s empty and what to do next, not “no data”), Partial, Error (see Error States below), Success (a visible confirmation, not silence, see Toast Notifications / Undo UX below), and Offline. Partial and Offline are the two most commonly skipped, since neither has an obvious home the way a spinner or an error banner does. **Partial** covers the moment some data is in and some isn't: keep whatever already loaded on screen and slot skeleton placeholders in only for what's still coming, mark a single field that failed with an inline “Failed to load, retry” instead of erroring the whole component out, and when paginating to a next page, keep the current page visible with loading confined to the bottom rather than clearing everything first. Never blank a screen that already had real content on it, that's a step backward from where someone already was. **Offline** means detecting the drop (`navigator.onLine` plus actual failed requests, since the flag alone lies often enough not to trust on its own), surfacing a persistent banner that names the degraded mode in plain terms, queuing any mutation that can wait and retrying once the connection returns, disabling only the actions that strictly require the network, and never showing a generic error for a failure that offline status already explains.

11 patterns. Use when: loading, empty and error states, toasts, progress and confirmations.

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

Do:
- Every error needs a real way out
- Whatever was already typed stays in the field after a failure

Avoid:
- A dead-end “OK” with no path forward
- A toast for an error that needs the user to actually do something about it

Code (JS):

```js
function handleError(err) {
  if (err.field) return showInlineError(err.field, plainLanguage(err.code)); // one field, inline
  if (err.transient) return showToast({ msg: plainLanguage(err.code), action: { label: 'Retry', onClick: retry } });
  return showModal({ msg: plainLanguage(err.code), action: { label: 'Contact support', href: '/support' } }); // true blocker
}

const MESSAGES = { 'ERR_402': 'Payment failed, check your card details and try again.' }; // never raw codes
function plainLanguage(code) { return MESSAGES[code] ?? 'Something went wrong. Try again or contact support.'; }
```

## Loading States System

Pick the loading pattern from what’s actually known about the wait: a known content shape gets a skeleton, a known percentage gets a real progress bar, and a short wait of unknown length gets a plain spinner. A button doing its own async work is its own special case: the spinner sits inside the button, the label switches to its verb form, the button holds its own width via a minimum width so nothing shifts around it, and it disables itself for the duration so a second click can't fire the same request twice. Show nothing at all for the first ~300ms; a skeleton that flashes for a tenth of a second before real content arrives reads as a flicker, not helpful feedback. Past 2 seconds, swap a bare “Loading…” for real context, “Loading 1,247 records…” tells someone the wait has a reason. Past 10 seconds, offer a way to cancel rather than leaving them stuck watching a spinner with no exit. For anything genuinely long (past 3 seconds and climbing), show real progress wherever it's measurable, give an ETA once one is knowable, and let the operation keep running in the background with a notification when it finishes, instead of holding someone hostage on the screen that started it. For anything reversible, optimistic UI (see Feedback ’Optimistic UI’) beats a loading state entirely by skipping the wait perception altogether.

Do:
- Nothing at all under ~300ms
- Real context past 2s, a cancel option past 10s
- A button-internal spinner keeps its width and disables itself, so a second click can't double-submit

Avoid:
- A skeleton for every fetch regardless of duration

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

## Notification System

A notification system is really four distinct surfaces (toast, banner, modal, badge), and severity is what should pick which one fires, not habit or whichever component was easiest to reach for. Toasts auto-dismiss and carry undo for low-stakes, reversible events; modals are reserved for things that genuinely block progress. Low-priority toasts need to stack and breathe with a visible gap between them rather than overlapping, and routing everything to the loudest available surface trains people to ignore all of them equally.

**Badges.** A badge carries two different signals that need different treatment. A count is an action: it says how many, asks you to act now, and changes with each new item. A status dot is a condition: it says which state, asks for nothing, and reads green for online and red for act now. Never put both on one row, since a dot says something changed, a number says how much, and both together is noise. Cap the count so the width is bounded (one unread shows a single dot or number, 200 shows 99+, whereas an uncapped 661 grows the pill and reflows the nav), and pin the badge to the icon’s top corner so the icon never moves whether it shows one digit or three.

A badge clears the second the view is opened; one that lingers after you have looked trains people to ignore every badge. When the count climbs it ticks up and never resets to zero on screen, because that flash reads as a bug. And badge the decision, not everything: for example, badging Messages, Mentions, Product updates, Promotions and System makes the colour meaningless, while badging only Mentions keeps the signal.

Do:
- Toasts auto-dismiss with undo; modals for true blockers
- Badge counts cap at 99+, width bounded so a real spike can’t break the layout
- Badge pinned to the icon’s top corner, so the icon never moves
- One signal per row: a count or a status dot, never both
- The badge clears the moment the view opens; the count ticks up and never blinks to zero
- Only things that need a decision get a badge

Avoid:
- Routing everything to the loudest surface
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

Do:
- Reserved for reversible, low-stakes actions

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

Do:
- Animate the shimmer, match real dimensions

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
@keyframes shimmer { to { background-position: -200% 0; } }

/* match the REAL element's exact dimensions so nothing jumps on swap */
.skeleton-avatar { width: 40px; height: 40px; border-radius: 50%; }
.skeleton-title  { width: 60%; height: 16px; margin-bottom: 8px; }
.skeleton-line   { width: 100%; height: 12px; }

@media (prefers-reduced-motion: reduce) { .skeleton { animation: none; opacity: .6; } }
```

## Toast Notifications

Position toasts deliberately (bottom-right on desktop, a top-edge banner on mobile) and never dead-centre over active content, where they block exactly what someone is trying to look at. Match the dismiss timing to severity: a routine confirmation clears in a few seconds, a warning holds longer or waits for a manual dismiss. Cap the visible stack at three and pause the auto-dismiss timer on hover so a toast doesn’t vanish mid-read, and always pair colour with an icon; colour alone is the same accessibility failure it is everywhere else in this document. The right confirmation still depends on what just happened. An inline edit gets a quiet green flash plus a checkmark on the field itself for about 1.5 seconds, no toast needed. A form submit that keeps someone on the same page gets a toast plus a visible change in the data they're looking at. A form submit that navigates somewhere new shows the confirmation as context on the destination itself, “Created John Smith” at the top of his new record, rather than a toast that's already gone by the time the new page renders. A batch action gets a plain summary count, “Suspended 12 users”, not a silent redirect that leaves someone guessing whether it worked.

Do:
- Cap the stack at 3, pause on hover
- Confirmation matches the action: inline flash, toast, destination context, or a batch summary count

Avoid:
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
  toastEl._timer = setTimeout(() => dismiss(toastEl), toastEl.dataset.severity === 'warning' ? 6000 : 3000);
});
```

## Undo UX

Undo beats a confirmation dialog for most destructive actions: act immediately with zero friction, then offer a real second chance via a toast instead of asking “are you sure?” before anything has even happened, a question people click through without reading anyway. Soft-delete under the hood with a genuine recovery window (not an instant hard-delete dressed up with an undo button that does nothing), and show a visible countdown on the toast so the window’s urgency is honest rather than a guess.

Do:
- Soft-delete with a real recovery window

Avoid:
- Blocking every delete behind a confirm nobody reads

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

Do:
- One deliberate box left unchecked in onboarding

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

Do:
- Friction escalates with actual consequence, not with how severe the action feels
- Confirmation dialog focus defaults to Cancel, never the destructive button

Avoid:
- One “are you sure?” modal used identically for a draft delete and an account close

Code (JS):

```js
// tier -> UI treatment
const DESTRUCTIVE_TIERS = {
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
