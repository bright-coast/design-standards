> A Bright Coast AI skill, made by Rob Lee. Part of the Claude Power Setup Guide: github.com/bright-coast/claude-power-setup-guide
> Copyright 2026 Bright Coast AI. For Bright Coast AI clients and people Bright Coast AI has given the guide to, not for copying or redistribution: see LICENSE at github.com/bright-coast/claude-power-setup-guide.

# Navigation

How someone moves through a product without losing their place.

4 patterns. Use when: tabs, breadcrumbs, pagination and moving between screens.

## Focus States

Removing `outline: none` without putting a real replacement in its place is a genuine accessibility failure, not a legitimate style choice. It leaves keyboard users with no visible indication of where they are on the page at all. `:focus-visible` is the correct modern fix: it shows a focus ring only for keyboard navigation, keeping a mouse click free of the ring while Tab still gets one. Inside a modal, trap focus so Tab can’t escape to the page behind it, and explicitly return focus to the triggering element when the modal closes. Visual tab order needs to match DOM order; a CSS-only reorder that doesn’t match creates a genuinely confusing keyboard-navigation path.

Do:
- `:focus-visible` so clicks stay clean, Tab gets a ring

Avoid:
- Visual order drifting from DOM order

Code (CSS + JS):

```css
.btn:focus { outline: none; } /* mouse click: no ring */
.btn:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; } /* keyboard: real ring */

// focus trap: Tab/Shift+Tab cycle within the modal, never escape to the page behind it
modal.addEventListener('keydown', (e) => {
  if (e.key !== 'Tab') return;
  const focusable = [...modal.querySelectorAll('button, [href], input, [tabindex]')];
  const [first, last] = [focusable[0], focusable.at(-1)];
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
});
const triggerEl = document.activeElement;
closeModal(() => triggerEl.focus()); // focus returns to what opened it
```

## Navigation Patterns

Bottom tabs are the mobile-native pattern for primary navigation (thumb-reachable, always visible); a persistent sidebar is the desktop-native pattern once a product has five or more top-level sections. Match the pattern to the platform’s own convention rather than personal taste. A bottom tab bar ported straight to desktop, or a sidebar squeezed onto mobile, both fight how people already expect to navigate on that device. A command palette (Cmd+K) supplements visible navigation for power users; it should never replace it, since not everyone knows the shortcut exists. Reserve breadcrumbs for genuinely nested hierarchies past two levels deep; a flat one- or two-level structure doesn’t need them.

Do:
- Command palette alongside visible nav, not instead

Avoid:
- Burying primary nav in a desktop hamburger

Code (CSS):

```css
.nav-mobile { display: none; }
.nav-desktop { display: flex; flex-direction: column; width: 240px; } /* persistent sidebar, 5+ sections */

@media (max-width: 768px) {
  .nav-desktop { display: none; } /* hamburger is NOT the mobile answer either, use tabs */
  .nav-mobile {
    display: flex; position: fixed; bottom: 0; inset-inline: 0;
    justify-content: space-around; padding-bottom: env(safe-area-inset-bottom);
  } /* bottom tabs, thumb-reachable, always visible */
}
/* Cmd+K palette is ADDITIVE, .nav-desktop / .nav-mobile still render regardless of it existing */
```

## Pagination

Cursor-based pagination (a pointer to “the row after this ID”) stays stable even while rows are actively being inserted or deleted underneath it; offset-based pagination (“skip N rows”) silently duplicates or skips rows the instant the underlying dataset shifts between page loads, because “row 20” refers to a different row than it did a second ago. Keep the current page (or cursor) in the URL so a reload or a shared link lands on the same page instead of resetting to page one, and restore the scroll position when returning from a detail view back to a list.

Do:
- Page number lives in the URL

Avoid:
- Rendering every page-number link, not truncated

Code (JS):

```js
// cursor pagination, stable even while rows are being inserted/deleted concurrently
async function fetchPage(cursor) {
  const res = await api.get(`/items?after=${cursor ?? ''}&limit=20`);
  const url = new URL(location);
  url.searchParams.set('cursor', res.nextCursor); // lives in the URL, reload/share lands on the same page
  history.replaceState(null, '', url);
  return res.items;
}

// on returning from a detail view
sessionStorage.setItem('list-scroll', String(window.scrollY)); // saved before navigating away
window.scrollTo(0, Number(sessionStorage.getItem('list-scroll') ?? 0)); // restored on return
```

## Tabs System

The active-tab indicator needs to physically slide from the old position to the new one, never teleport instantly. The slide is what tells the eye which direction the change moved in. When a tab row overflows the available width, it scrolls horizontally with an edge fade hinting more is there; it should never wrap onto a second line, which breaks the single-row mental model tabs depend on. Support full keyboard operation (arrow keys move between tabs, Home/End jump to the first/last), and fade the content out then back in on switch rather than a hard instant cut, which reads as a glitch. A desktop tab bar simply shrunk down rarely survives the transition to mobile without redesigning as its own pattern.

Do:
- Full keyboard operation (arrows/Home/End)

Avoid:
- A shrunk desktop tab bar reused on mobile

Code (CSS + JS):

```css
.tab-list { display: flex; overflow-x: auto; scrollbar-width: none; } /* scrolls, never wraps */
.tab-indicator {
  position: absolute; height: 2px; background: var(--accent);
  transition: transform 200ms var(--ease-out), width 200ms var(--ease-out); /* slides, never teleports */
}

tabList.addEventListener('keydown', (e) => {
  const tabs = [...tabList.querySelectorAll('[role=tab]')];
  const i = tabs.indexOf(document.activeElement);
  if (e.key === 'ArrowRight') tabs[(i + 1) % tabs.length].focus();
  if (e.key === 'ArrowLeft') tabs[(i - 1 + tabs.length) % tabs.length].focus();
  if (e.key === 'Home') tabs[0].focus();
  if (e.key === 'End') tabs.at(-1).focus();
});
```
