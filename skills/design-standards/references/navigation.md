> A Bright Coast AI skill, made by Rob Lee. github.com/bright-coast/design-standards
> Copyright 2026 Bright Coast AI. For Bright Coast AI clients and people Bright Coast AI has given this link to. You may build what you find here into your own work; you may not republish or resell the material itself. See LICENSE at github.com/bright-coast/design-standards.

# Navigation

How someone moves through a product without losing their place.

5 patterns. Use when: tabs, breadcrumbs, pagination and moving between screens.

## Focus States

Removing `outline: none` without putting a real replacement in its place is a genuine accessibility failure, not a legitimate style choice. It leaves keyboard users with no visible indication of where they are on the page at all. `:focus-visible` is the correct modern fix: it shows a focus ring only for keyboard navigation, keeping a mouse click free of the ring while Tab still gets one. Inside a modal, trap focus so Tab can’t escape to the page behind it, and explicitly return focus to the triggering element when the modal closes. Visual tab order needs to match DOM order; a CSS-only reorder that doesn’t match creates a genuinely confusing keyboard-navigation path.

Elements that appear on scroll, such as a sticky call to action or a banner that slides in, never take keyboard focus when they show up. Pulling focus mid-scroll drops a keyboard or screen reader user somewhere they did not choose.

**A ring that moves nothing.** Draw focus with `outline` or a `box-shadow` ring, never by thickening the border from 1px to 2px, which grows the box and nudges everything around it on every focus. **The trap wraps and Escape leaves:** in a modal, Tab on the last element goes to the first and Shift+Tab on the first goes to the last, and Escape closes the modal and returns focus to its trigger. **Skip link:** the first focusable element on every page is a Skip to content link, hidden until it receives focus, so a keyboard user can jump past the navigation instead of tabbing through it on every page.

Do:
- `:focus-visible` so clicks stay clean, Tab gets a ring
- Focus drawn with outline or box-shadow, so the layout never shifts
- Modal focus wraps at both ends, Escape closes and returns focus
- A Skip to content link as the first focusable element, visible on focus

Avoid:
- A focus style that thickens the border and moves the layout
- Visual order drifting from DOM order
- A sticky banner or call to action that takes focus when it appears on scroll

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
modal.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(() => triggerEl.focus()); });

.input:focus-visible { box-shadow: 0 0 0 3px var(--accent-a30); } /* ring, border width unchanged: nothing moves */
.skip-link { position: absolute; left: 8px; top: -40px; }
.skip-link:focus { top: 8px; } /* first focusable element, hidden until focused */
```

## Navigation Patterns

Bottom tabs are the mobile-native pattern for primary navigation (thumb-reachable, always visible); a persistent sidebar is the desktop-native pattern once a product has five or more top-level sections. Match the pattern to the platform’s own convention rather than personal taste. A bottom tab bar ported straight to desktop, or a sidebar squeezed onto mobile, both fight how people already expect to navigate on that device. A command palette (Cmd+K) supplements visible navigation for power users; it should never replace it, since not everyone knows the shortcut exists. Reserve breadcrumbs for genuinely nested hierarchies past two levels deep; a flat one- or two-level structure doesn’t need them (anatomy in Breadcrumbs, entry 05).

**Group a long list.** A sidebar with more than about eight items is split into groups by category, each with a small heading (Workspace, Billing, Settings), and the gap between groups is clearly larger than the gap between items, about 24px against 4px. One evenly spaced list of fifteen items makes every item equally hard to find.

Do:
- Command palette alongside visible nav, not instead
- Long sidebars grouped by category, with small headings and a larger gap between groups

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

**Pick the pattern by the task.** Numbered pages suit lists people jump around in and come back to (search results, admin tables), because a page number is a place. Load more suits browsing where people want control over when more arrives (a product grid), and it keeps the footer reachable. Infinite scroll suits feeds read top to bottom with no particular item in mind, and even there, give it a stopping point (Engagement Traps, Psychology entry 06). **Truncate numbered links in one shape:** first, a gap, the pages around the current one, a gap, last (1 … 6 7 8 … 42), so the first and last pages are always one click away.

Do:
- Page number lives in the URL
- Numbered pages for jumping, load more for control, infinite scroll only for feeds
- Truncate as first, gap, neighbours of the current page, gap, last

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

**Five more details.** On desktop, an overflowing tab row adds chevron buttons at each end alongside the edge fade, because a mouse user has no swipe. Arrow keys move between tabs, while Tab moves focus out of the tab list to the panel (one tab stop for the whole list, through a roving `tabindex`). Focused and selected look different: the selected tab carries the indicator, the focused tab carries a focus ring, and the two can sit on different tabs at once. On mobile, up to five tabs become a segmented control and more than five become a picker in a bottom sheet, with every target at least 44px tall. On switch, animate the content container’s height to the new panel’s height so the page below does not jump, with a brief pause of about 50ms between the old content fading out and the new one fading in.

Do:
- Full keyboard operation (arrows/Home/End)
- Chevron buttons on desktop when tabs overflow; Tab leaves the tab list
- Distinct focus and selected styles
- Mobile: a segmented control up to five tabs, a bottom sheet beyond five, 44px targets
- Container height animates on switch, so nothing below jumps

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

## Breadcrumbs

A deep page needs a way back that does not depend on the browser’s back button, and a breadcrumb is that way back once a hierarchy is more than two levels deep (Navigation Patterns, entry 02). **Every level is a link except the current page:** each crumb takes the person one click up to that level, and the last crumb is plain text marked with `aria-current="page"`, because a link to the page you are on does nothing. **The last crumb matches the page title** word for word (Invoices &rsaquo; INV-2041 on a page headed INV-2041), so the trail and the heading confirm each other.

**Past about four levels, fold the middle and keep both ends.** Show the first level, an ellipsis button, and the last two levels (Home &rsaquo; … &rsaquo; 2026 &rsaquo; INV-2041); the ellipsis opens the hidden levels in a small menu. The ends carry the meaning: where the trail starts and where the person is now. **On mobile, replace the trail with one back link to the parent** (&lsaquo; Invoices), at least 44px tall, because a full trail wraps onto several lines or shrinks into targets too small to tap.

Do:
- Every level a link, the current page plain text with `aria-current="page"`
- The last crumb matches the page title exactly
- Past about four levels: first level, an ellipsis that expands, the last two levels
- On mobile, one back link to the parent, at least 44px tall

Avoid:
- The current page shown as a link to itself
- Truncating from the start or the end instead of the middle
- A full trail on a phone that wraps or shrinks below a tappable size

Code (HTML + CSS):

```html
<nav aria-label="Breadcrumb">
  <ol class="crumbs">
    <li><a href="/">Home</a></li>
    <li><button aria-label="Show 2 more levels">&hellip;</button></li> <!-- the middle folds, the ends stay -->
    <li><a href="/billing/invoices/2026">2026</a></li>
    <li aria-current="page">INV-2041</li> <!-- not a link, matches the page title -->
  </ol>
  <a class="crumb-back" href="/billing/invoices/2026">&lsaquo; 2026</a>
</nav>

.crumb-back { display: none; }
@media (max-width: 600px) {
  .crumbs { display: none; }
  .crumb-back { display: inline-flex; align-items: center; min-height: 44px; } /* one parent link, a real target */
}
```
