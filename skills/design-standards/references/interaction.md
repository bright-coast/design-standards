> A Bright Coast AI skill, made by Rob Lee. github.com/bright-coast/design-standards
> Copyright 2026 Bright Coast AI. For Bright Coast AI clients and people Bright Coast AI has given this link to. You may build what you find here into your own work; you may not republish or resell the material itself. See LICENSE at github.com/bright-coast/design-standards.

# Interaction

The mechanics of clicking, dragging, and typing through a screen, the largest category, and the one most directly reusable across products, from an existing app to a brand-new build.

32 patterns. Use when: buttons, menus, tables, dialogs, drawers, drag and drop, keyboard and touch behaviour.

## Accordion Disclosure

`height: auto` cannot be transitioned in CSS, since the browser just snaps between values. The fix is animating a CSS grid row instead: a single-cell grid whose row goes from `0fr` to `1fr` transitions smoothly regardless of the content’s real height, no JS measurement needed. Sync the chevron rotation to the exact same transition so the two never visibly drift apart, even by a couple of frames.

Do:
- Real `<button>` with `aria-expanded` + `aria-controls`
- Single-open for sequential steps, multi-open for FAQ lists

Avoid:
- Chevron rotation on a different timing curve than the panel

Code (CSS + JS):

```css
/* grid-rows trick: transitions cleanly, no JS height measurement */
.accordion-panel {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 250ms ease;
}
.accordion-panel.open { grid-template-rows: 1fr; }
.accordion-panel > .inner { overflow: hidden; } /* clips during animation */
.chevron { transition: transform 250ms ease; }
.accordion-panel.open ~ .chevron { transform: rotate(180deg); }

button.addEventListener('click', () => {
  const open = button.getAttribute('aria-expanded') === 'true';
  button.setAttribute('aria-expanded', String(!open));
  panel.classList.toggle('open', !open);
});
```

## Behind the Button

Client-side validation exists purely for speed: instant feedback with zero round trips. It is never the safety boundary, because anyone can forge a request and send whatever price or quantity they want. The server has to re-run every check independently, recompute totals from its own source of truth, and wrap the related writes (order, line items, inventory, payment) in a single transaction so a mid-write failure rolls back everything instead of leaving a half-created order. When the response lands, repaint the UI with the server’s real ID and total, not the value you optimistically guessed on the client.

Do:
- Recompute price/total server-side from your own catalog
- One DB transaction for all related writes

Avoid:
- Optimistic UI on a payment or other irreversible action

Code (Node / Express):

```js
app.post('/orders', async (req, res) => {
  // never trust req.body.price, look it up server-side
  const items = await db.getItems(req.body.itemIds);
  const total = items.reduce((sum, i) => sum + i.price * i.qty, 0);

  const order = await db.transaction(async (trx) => {
    const [order] = await trx('orders')
      .insert({ total, status: 'pending' }).returning('*');
    await trx('order_items').insert(
      items.map(i => ({ order_id: order.id, ...i }))
    );
    await trx('inventory').decrement('stock', items);
    return order; // throw anywhere above and the whole transaction rolls back
  });

  res.json({ orderId: order.id, total }); // server truth, not the client's guess
});
```

## Bottom Sheets

Phone screens keep getting taller while thumbs stay the same length, which turns the top of the display into a dead zone for one-handed use. A bottom sheet anchors actions where the thumb naturally rests instead of a top-right corner, and unlike a full modal it keeps the page visible behind it so context is never lost. Snap points let it rest half-open or expand to full height depending on how much content is actually needed, and drag-to-dismiss maps the closing gesture to the same direction the sheet opened from.

Do:
- Snap points for half/full height
- Dim + lock body scroll behind the sheet

Avoid:
- Leaving the background scrollable while it’s open

Code (CSS + JS):

```css
.sheet {
  position: fixed; inset: auto 0 0 0;
  border-radius: 16px 16px 0 0;
  transform: translateY(0);
  transition: transform 250ms ease;
  touch-action: none;
}
.sheet[data-snap="half"] { height: 50vh; }
.sheet[data-snap="full"] { height: 92vh; }
.scrim { position: fixed; inset: 0; background: rgb(0 0 0 / .4); }

let startY = 0, dy = 0;
handle.addEventListener('pointerdown', e => {
  startY = e.clientY;
  handle.setPointerCapture(e.pointerId);
});
handle.addEventListener('pointermove', e => {
  dy = Math.max(0, e.clientY - startY);
  sheet.style.transform = `translateY(${dy}px)`;
});
handle.addEventListener('pointerup', () => {
  if (dy > 120) closeSheet(); else sheet.style.transform = '';
});
```

## Bulk Actions

The header checkbox needs three real states, not two: empty, an indeterminate dash for a partial selection, and fully checked. Clicking while indeterminate should always resolve to select-all, never to clearing. When select-all only grabs the rows visible on screen, the affordance needs to name the true scope (“Select all 247 matching”), and that count has to stay live as filters change. Selection itself belongs in application state keyed by row ID, not in the DOM, so it survives pagination instead of silently resetting on the next page.

Do:
- Selection stored by ID, survives paging
- Undo window instead of a confirm modal on bulk delete

Avoid:
- A vague “select all” that hides the real scope

Code (JS):

```js
let selected = new Set(); // row ids, not DOM refs, survives paging

function syncHeaderCheckbox(totalMatching) {
  headerCheckbox.indeterminate = selected.size > 0 && selected.size < totalMatching;
  headerCheckbox.checked = selected.size === totalMatching && totalMatching > 0;
}

headerCheckbox.addEventListener('click', (e) => {
  e.preventDefault(); // we drive checked state manually
  if (selected.size < allMatchingIds.length) {
    selected = new Set(allMatchingIds); // ALL matching, not just this page
  } else {
    selected.clear();
  }
  syncHeaderCheckbox(allMatchingIds.length);
  render();
});
```

## Color Picker UX

A colour picker is a decision that cascades through the rest of the UI, not a gradient with a slider. OKLCH alongside hex matters because hex is machine-friendly but not human-predictable. OKLCH’s lightness/chroma/hue lets someone change one number and get a predictable lighter or darker shade. A live contrast-ratio readout at pick time (not buried in a later review step) kills a failing colour pair before it ever ships, and alpha needs previewing over a checkerboard on both light and dark, since transparency lies against a plain white canvas.

Do:
- Live WCAG contrast badge while picking
- Recent swatches + saved palettes

Avoid:
- Previewing alpha only against white

Code (JS):

```js
function relativeLuminance(hex) {
  const [r, g, b] = hexToRgb(hex).map(c => {
    c /= 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
function contrastRatio(fgHex, bgHex) {
  const [l1, l2] = [relativeLuminance(fgHex), relativeLuminance(bgHex)]
    .sort((a, b) => b - a);
  return (l1 + 0.05) / (l2 + 0.05);
}

const ratio = contrastRatio(pickedColor, pageBackground);
badge.textContent = ratio >= 4.5 ? `Passes AA (${ratio.toFixed(1)}:1)` : `Fails AA (${ratio.toFixed(1)}:1)`;
badge.dataset.pass = ratio >= 4.5;
```

## Command Palette

Cmd+K only works if the matching is fuzzy: typing “stg” should still surface “Settings” and “Storage”, because exact substring matching returns nothing and feels broken. Group results into labeled sections (Recent, Actions, Pages) so a long flat list reads as structure, and drive the whole thing from the keyboard: arrows move the highlight, Enter runs the selection, Escape closes. Never open to a blank void; prefill recent or suggested commands so there’s a starting point before anyone types a character.

Do:
- Prefill recent/suggested commands on open
- Inline spinner for async, never freeze the whole palette

Avoid:
- Exact substring matching that returns nothing for a fair guess

Code (JS):

```js
// subsequence fuzzy match: "stg" matches "Settings" (s-t-...-g)
function fuzzyScore(query, target) {
  let qi = 0;
  const t = target.toLowerCase(), q = query.toLowerCase();
  for (const ch of t) {
    if (qi < q.length && ch === q[qi]) qi++;
  }
  return qi === q.length ? q.length / t.length : 0; // 0 = no match
}

function searchCommands(query, commands) {
  if (!query) return groupBy(recentAndSuggested, 'section');
  return groupBy(
    commands
      .map(c => ({ ...c, score: fuzzyScore(query, c.label) }))
      .filter(c => c.score > 0)
      .sort((a, b) => b.score - a.score),
    'section'
  );
}
```

## Context Menu

A context menu measures its available space before it opens: no room below, it flips up; no room to the right, it mirrors left; it’s always anchored to the cursor and always kept inside the viewport. Group actions by intent with dividers rather than a flat list of twelve items, and isolate anything destructive at the bottom in red. Submenus need a “safe triangle” from the cursor to the submenu so moving diagonally toward it doesn’t close it the instant the cursor leaves the parent row.

Do:
- Group with dividers, isolate destructive in red at the bottom
- Safe-triangle hover intent toward submenus

Avoid:
- Closing a submenu the instant the cursor drifts off the row

Variant: **Safe triangle geometry, and two simpler options.** The triangle runs from the cursor’s current position (its apex) to the top and bottom corners of the submenu’s near edge. While the pointer moves inside it, the submenu stays open even as the pointer crosses the rows below; the moment the pointer steps outside, the menu switches to the row under it instantly. Nobody sees the triangle, they just never get annoyed. It is computed from pointer positions, not drawn as an element (the menu-aim technique made famous by a large retailer’s mega menu). Variant A: the safe triangle. Use when: hover-opened submenus where speed matters. Variant B: a short hover-intent delay before switching rows. Use when: a simpler build is acceptable and a small lag is fine. Variant C: open submenus on click, not hover. Use when: touch matters or the menu is rarely used, since a click menu has no diagonal problem.

Code (JS):

```js
function positionMenu(x, y, menuEl) {
  const { innerWidth: vw, innerHeight: vh } = window;
  const { offsetWidth: w, offsetHeight: h } = menuEl;
  menuEl.style.left = (x + w > vw ? x - w : x) + 'px';
  menuEl.style.top = (y + h > vh ? y - h : y) + 'px'; // flips before it clips
}

target.addEventListener('contextmenu', (e) => {
  e.preventDefault();
  positionMenu(e.clientX, e.clientY, menuEl);
  menuEl.classList.add('open');
});

// safe triangle: hold the submenu open while the pointer moves toward it
let lastX = 0, lastY = 0;
row.addEventListener('mousemove', e => {
  const movingTowardSubmenu = e.clientX > lastX && submenu.getBoundingClientRect().left > e.clientX;
  submenu.dataset.armed = movingTowardSubmenu;
  [lastX, lastY] = [e.clientX, e.clientY];
});
```

## Data Table

Sort is a three-state cycle, ascending, descending, back to the original order, not a binary toggle that loses the natural order forever. Numbers need `tabular-nums` and right-alignment so every digit lines up on the same grid; proportional left-aligned digits jitter and can’t be compared at a glance. Keep the header sticky on vertical scroll and freeze the first column on horizontal scroll, and make the whole row the click target rather than a small checkbox-only hit area. Five to seven visible columns is the ceiling before it stops being a UI problem and starts being a data-design problem. Past that, cut columns or push them behind a detail view rather than shrinking type to fit. One column has to dominate: the identity column (name, title, ID) bolder or larger than the rest, so the eye has one obvious place to land per row. Actions belong on the far right, icon-only with a tooltip or collapsed into one overflow menu, never repeated as buttons across multiple columns.

**Cells, rows and row actions.** Right-align numbers with tabular figures and left-align text: centred amounts are wrong because digits never line up, and a column of right-aligned tabular amounts reads like a receipt (it aligns the digits and makes them easy to compare, especially with decimals). Separate rows with one hairline and a hover highlight rather than zebra stripes (an opinion, see the note below). Treat row height as a decision, not padding: for example three settings, compact 40px, default 48px and comfortable 56px, which are demo values. Pin the identity columns and the header so context never leaves the screen when scrolling. An empty cell is a question (missing, zero or still loading?), so show a dash; truncate long text to one line with a tooltip on hover, and never truncate numbers. An action column on every row is noise (50 rows, 50 pencils): reveal row actions on hover or focus, give touch devices a kebab menu, and show a sort arrow only on the column that is actively sorted.

Do:
- Sticky header + frozen first column
- Whole row as the click target
- A density toggle (comfortable/compact) as a first-class per-view setting
- One identity column visually dominant; actions collapsed to the far right
- A dash for an empty cell; text truncated to one line with a tooltip on hover; numbers never truncated
- Row actions revealed on hover or focus, a kebab menu on touch devices
- A sort arrow on the active column only
- One hairline between rows plus a hover highlight

Avoid:
- A binary sort that loses the original order permanently
- 10+ equal-weight columns with no dominant identity column
- Centred amounts, where digits never line up
- A pencil or button repeated on all 50 rows
- A blank cell that could mean missing, zero or still loading

Note: **Responsive collapse is a separate concern from desktop sort/density.** When the table has to fit a phone, shrinking the font isn’t the fix; six moves restructure it instead: **Rank** (decide which columns actually matter), **Stack** (vertical card per row), **Slot** (secondary data into an expandable area), **Label** (inline labels once headers disappear), **Reveal** (progressive disclosure for the rest), **Breakpoint** (a defined point the transform triggers at). All six match established responsive-table practice.
            **Phone-table detail.** Six columns need about 700px, so let the table own the breakpoint with one container query (`@container (max-width: 700px)`), not a screen-width media query; the same table then also collapses inside a narrow desktop side panel (it turns into cards there). The six moves in full: **Rank**, decide by use, not by position, which columns survive (identity, value, state); the ID column goes first, because nobody reads it on a phone. **Stack**, two lines per row with the name left and the amount right and status and due date underneath, so each row reads as one thumb-sized unit; do not scroll sideways, and avoid full cards because they kill comparison. **Slot**, keep the amount in one right-aligned slot so it is still a column of numbers (tabular digits). **Label**, label only the ambiguous (“Due Mar 4” needs a label, a dollar amount does not), and move sorting into a control. **Reveal**, hidden is not deleted: tap a row to expand two more fields in place (invoice ID, notes, actions), and open the full record in a bottom sheet, never a new page for a quick look. **Breakpoint**, the container query above. Where this wording of Stack and Slot differs from the shorthand in the paragraph above, this is the fuller version. The 700px figure is a demo number tied to six columns, not a rule. Prioritising columns, two-line stacked rows, bottom sheets and container queries are all standard responsive-table practice.

Variant: **Phone table, three variants held.** A: scroll sideways inside the table’s own frame. Use when: you need the whole table structure kept and the alternative is cramming the columns. B: Stack as a vertical card per row (the six-move shorthand above; a narrow side panel turns into cards too). Use when: the container is narrow and the columns can restack. C: two-line stacked rows with no full cards (the phone-table detail, which says full cards kill comparison and not to scroll sideways). Use when: rows have to stay comparable at a glance. Cards or no cards, use whichever fits the content.

Note: **Zebra stripes are an opinion, not a rule.** One view holds that stripes fight the content (every other row competes for attention for no reason), so it prefers one hairline between rows plus a hover highlight, and keeps stripes for very wide rows (12 columns). The case against stripes: they make the hover state ambiguous and the design heavier. Many table guidelines still recommend stripes for scanning long rows, so do not treat the hairline-plus-hover advice as settled.

Code (JS):

```js
// tri-state sort: null -> asc -> desc -> null (original order)
function nextSortState(current) {
  return current === null ? 'asc' : current === 'asc' ? 'desc' : null;
}

function sortRows(rows, originalOrder, col, dir) {
  if (dir === null) return originalOrder; // third click restores it
  const sign = dir === 'asc' ? 1 : -1;
  return [...rows].sort((a, b) => sign * (a[col] > b[col] ? 1 : -1));
}
```

Code (CSS: cells, rows, actions, phone breakpoint):

```css
/* cells: a dash for empty, one line with a tooltip, numbers never truncate */
td.text { max-width: 220px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; } /* put the full text in the title attribute */
td.num  { text-align: right; font-variant-numeric: tabular-nums; } /* no ellipsis on numbers, ever */
td:empty::before { content: '\2013'; color: var(--text-muted); } /* an empty cell is a question: answer it with a dash */

/* rows: one hairline plus a hover highlight, no zebra (an opinion, see the note above) */
tbody tr { border-bottom: 1px solid var(--border); }
tbody tr:hover { background: var(--surface-hover); }
.row-compact { --row: 40px; } .row-default { --row: 48px; } .row-comfortable { --row: 56px; } /* demo values */

/* actions: revealed on hover or focus, a kebab on touch; sort arrow on the active column only */
.row-kebab { display: none; }
.row-actions { opacity: 0; }
tr:hover .row-actions, tr:focus-within .row-actions { opacity: 1; }
@media (hover: none) { .row-actions { display: none; } .row-kebab { display: inline-flex; } }
th:not([aria-sort="ascending"]):not([aria-sort="descending"]) .sort-arrow { visibility: hidden; }

/* phone: the table owns the breakpoint (six columns need about 700px), a container query, not a screen width */
.table-host { container: invoices / inline-size; }
@container invoices (max-width: 700px) {
  .invoice-row { display: grid; grid-template-columns: 1fr auto; } /* name left, amount right */
  .invoice-row .meta { grid-column: 1 / -1; } /* status and due date underneath: two lines per row */
}
```

## Destructive Actions

Name the action on the button itself: “Delete project” instead of a generic “Yes”, because the verb is the actual warning and nobody reads “are you sure?” Hold-to-confirm turns the gesture itself into the safeguard: a ring fills over roughly 300ms of a held press, and releasing early cancels outright. Never place a destructive button where a confirm button usually lives, since muscle memory clicks the familiar spot without reading it, and spend red only on real destruction; a red logout button cries wolf and makes the real delete look routine.

Do:
- Hold-to-confirm as the actual safeguard, not a dialog
- Cooldown/grace period for genuinely irreversible deletes

Avoid:
- Spending red on anything other than real destruction

Code (CSS + JS):

```css
.hold-confirm { position: relative; overflow: hidden; }
.hold-confirm .ring {
  position: absolute; inset: 0;
  background: rgb(192 57 43 / .25);
  transform: scaleX(0); transform-origin: left;
  transition: transform 300ms linear;
}
.hold-confirm.holding .ring { transform: scaleX(1); }

let timer;
btn.addEventListener('pointerdown', () => {
  btn.classList.add('holding');
  timer = setTimeout(() => deleteProject(), 300); // matches the ring's transition
});
['pointerup', 'pointerleave'].forEach(ev =>
  btn.addEventListener(ev, () => {
    clearTimeout(timer); // released early, cancelled
    btn.classList.remove('holding');
  })
);
```

## Disabled Buttons

A disabled button drops out of the tab order entirely, so keyboard users skip past it and a screen reader stays silent about the block. Pointer events are also dead on a disabled element, so a tooltip meant to explain the block can never fire; the reason is unreachable by design. The fix is keeping the button live and validating on click: flag the fields actually blocking submission and move focus to the first one, so the path forward is visible instead of a mystery.

Do:
- Busy state (spinner + `aria-busy`) mid-request, not disabled
- Focus moves to the first blocking field

Avoid:
- Leaving users to guess why submit won’t fire

Variant: **Disabled buttons, two variants.** Variant A: keep the button live and validate on click, moving focus to the first blocking field (this entry). Use when: the block is something the person can fix in the form in front of them. Variant B: a real disabled state at 50% opacity with a not-allowed cursor and aria-disabled (which, unlike the disabled attribute, keeps the button focusable), always with the reason written beside it. Use when: the block is a known state the form cannot fix, such as a plan limit or a missing permission. The full state list is in Interactive State and Affordance (entry 24). Both are kept on purpose.

Code (JS):

```js
submitBtn.addEventListener('click', () => {
  const invalid = [...form.querySelectorAll(':invalid')];
  if (invalid.length) {
    invalid.forEach(f => f.classList.add('field-error'));
    invalid[0].focus(); // path forward is visible, not guessed
    return;
  }
  submitBtn.setAttribute('aria-busy', 'true'); // busy, not disabled
  submit().finally(() => submitBtn.removeAttribute('aria-busy'));
});
```

## Drag and Drop

A grabbed item needs to feel like it left the surface: confirm the lift with a slight scale-up, a deeper shadow, and a small tilt together, all at once. Drop zones should speak first: reveal where the item will land before release, not after, using an insertion line to slot between items or a filled highlight to land inside a whole column. On structured surfaces (a kanban board), snap to the nearest valid slot rather than free positioning, and pair every drop with a short undo toast so a wrong move costs one click, not a redo.

Do:
- Reveal the exact drop target before release
- Short undo toast after every drop

Avoid:
- Making a wrong drop permanent with no way back

Variant: **Drop placeholder, two variants.** Variant A: an insertion line between items. Use when: lists of short, uniform rows, where a line is enough. Variant B: a placeholder the exact height of the dragged card (a 96px card opens a 96px slot), so the column opens once and nothing else moves. Use when: kanban cards of varying height, where a thin line makes every card below jump on drop. Both kept on purpose.

Code (JS):

```js
card.addEventListener('dragstart', () => {
  card.classList.add('lifted'); /* CSS: scale(1.03) + shadow + slight rotate */
});
card.addEventListener('dragend', () => card.classList.remove('lifted'));

zone.addEventListener('dragover', (e) => {
  e.preventDefault();
  zone.classList.add('drop-target'); // shows the insertion line / fill before drop
});
zone.addEventListener('dragleave', () => zone.classList.remove('drop-target'));

zone.addEventListener('drop', () => {
  const originalZone = card.parentElement;
  moveCardTo(card, zone); // snap to nearest valid slot
  showUndoToast(() => moveCardTo(card, originalZone), 5000);
});
```

## Dropdown Design

The trigger needs to be obviously clickable: a real touch target (~48px), a visible caret, and a genuine hover state, not a 30px box with a faint border. Flip the menu open direction when there isn’t room below so it never clips off-screen, wire up full keyboard support (arrows, Enter, Esc), and once a list passes roughly ten items add a search field instead of leaving people to scroll-hunt. Animate the open around 150ms, fast enough to feel instant, slow enough to read as deliberate rather than a hard cut.

Six common dropdown mistakes, in full. **1. Type to filter.** Any list past about 10 rows needs a search field on top; in the demo a 195-country list takes 11.5 seconds of scrolling against 1.4 seconds with three letters typed. **2. Typed dates.** Use a text field that parses plus a month and year jump, because a calendar that opens on today makes a 1994 birthday cost about 390 presses of one arrow (see Date Pickers). **3. Stay open on pick.** A multi-select uses checkboxes, a live count and an explicit Done button, instead of closing and reopening after each pick. **4. Collision-aware.** Render the menu in a portal outside the clipping card, so `overflow: hidden` cannot cut it off, and flip it up when the space below runs out. **5. Reasons, not grey.** A disabled option should show the blocker inline and the one action that clears it. **6. No menu under five options.** Use a segmented control or radios: one tap, nothing hidden.

Do:
- Full keyboard support (arrows/Enter/Esc)
- Search once the list passes ~10 items
- Multi-select stays open: checkboxes, a live count, an explicit Done
- Fewer than ~5 options → segmented control or radios, not a dropdown at all
- Menu rendered in a portal so a clipping parent cannot cut it off, and flipped up when there is no room below
- A disabled option shows the blocker inline and the one action that clears it

Avoid:
- An open animation dragging past ~150ms
- A long list with no type-to-filter (195 countries: 11.5 seconds of scrolling against 1.4 seconds of typing)
- A greyed-out option with no reason given

Variant: **Variants held here.** Search: add a search field once a list passes about 10 items. Use when: people would otherwise scroll-hunt a long list (the demo’s 195-country list). Field Control Thresholds holds the other variant, a searchable combobox from 16 options. Open animation: about 150ms. Use when: the dropdown sits in a dense productivity UI (Animation Timing, variant B). Both are kept on purpose.

Code (JS):

```js
function openDropdown(trigger, menu) {
  const rect = trigger.getBoundingClientRect();
  const opensUp = rect.bottom + menu.offsetHeight > window.innerHeight;
  menu.style.top = opensUp ? 'auto' : '100%';
  menu.style.bottom = opensUp ? '100%' : 'auto';
  menu.classList.add('open'); /* CSS: transition 150ms ease */
}

menu.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowDown') moveHighlight(1);
  if (e.key === 'ArrowUp') moveHighlight(-1);
  if (e.key === 'Enter') selectHighlighted();
  if (e.key === 'Escape') closeDropdown();
});

// collision-aware: portal the menu out of the clipping card, then position it from the trigger's rect
document.body.appendChild(menu); // overflow: hidden on the card can no longer cut it off

// reasons, not grey: keep a disabled option in the list, with the blocker and the fix inline
// <li aria-disabled="true">Export <small>Needs a paid plan. <a href="/billing">Upgrade</a></small></li>
```

## Filter Chips

Every chip needs three visually distinct states: idle, active (filled + check), disabled (dimmed), because if active looks like idle the filter reads as broken. The combination logic should be legible: OR within a group widens the net, AND across groups narrows it. Update the result count on the same frame as the tap, since a number that doesn’t move reads as “nothing happened” and gets tapped twice. Always ship one clear-all reset paired with a live count, and let overflowing chips scroll horizontally with an edge fade rather than wrapping into a wall.

Do:
- Result count updates the same frame as the tap
- Single clear-all reset with a live count

Avoid:
- Active chips that look identical to idle ones

Code (JS):

```js
const active = { colors: new Set(), sizes: new Set() }; // OR within a group

function matches(item) {
  return Object.entries(active).every(([group, values]) => // AND across groups
    values.size === 0 || values.has(item[group])
  );
}

function applyFilters() {
  const matching = allItems.filter(matches);
  countEl.textContent = `${matching.length} matching`; // same frame as the tap
  render(matching);
}
clearAllBtn.addEventListener('click', () => {
  Object.values(active).forEach(s => s.clear());
  applyFilters();
});
```

## Hover Trap

Touch has no hover, so mobile browsers fake one: the first tap gets spent “becoming” a sticky hover state instead of firing the actual action. Never bury a primary action behind hover; it should only ever reveal secondary extras. Gate hover styles with the `hover: hover` media feature rather than sniffing the user agent, since that correctly handles a hybrid touch+mouse laptop where user-agent sniffing gets it wrong. Pad the tappable hit area to 44px even when the visible glyph stays smaller.

Do:
- Primary actions stay reachable without hover
- Pad tap targets to 44px, glyph can stay small

Avoid:
- Hiding a primary action behind a hover-only reveal

Code (CSS):

```css
/* the spec-correct way to detect real hover support */
@media (hover: hover) {
  .card-actions { opacity: 0; }
  .card:hover .card-actions { opacity: 1; }
}
/* touch devices never match the query above, actions stay visible */
.card-actions {
  min-width: 44px; min-height: 44px; /* hit area, not the icon itself */
}
.card-actions svg { width: 20px; height: 20px; } /* glyph stays small */
```

## Inline Editing

Editable text has to whisper its affordance before the click, a pencil icon on hover, a soft background tint, or people file support tickets just to rename something. Keep every pixel identical during the swap from text to input: same font, size, and padding, with only the border going from transparent to accent, so nothing visibly jumps. Enter commits and Escape cancels everywhere; blur is the one genuinely contested behaviour, so pick a single rule for it and never break it inside the same product.

Do:
- Enter commits, Esc cancels, one consistent blur rule
- Save optimistically, roll back with the draft kept on failure

Avoid:
- Zero affordance that hides that a field is editable

Code (JS):

```js
let lastValue = input.value;
function startEdit() { field.classList.add('editing'); input.readOnly = false; input.select(); }
function endEdit() { field.classList.remove('editing'); input.readOnly = true; }

async function commit() {
  const next = input.value;
  lastValue = next; endEdit(); // optimistic, updates before the server confirms
  try { await save(next); }
  catch { input.value = lastValue; showError('Save failed, draft kept'); }
}
function cancel() { input.value = lastValue; endEdit(); }

field.addEventListener('click', startEdit);
input.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') commit();
  if (e.key === 'Escape') cancel();
});
input.addEventListener('blur', commit); // pick ONE rule, keep it everywhere
```

## Live Cursors

The server typically streams roughly 10 cursor positions a second while the screen redraws at 60fps; interpolating between ticks is what makes cursors glide instead of visibly teleporting between discrete points. Hash each user’s colour from their ID rather than assigning it randomly per session, so the same person keeps the same colour across visits and identity is trackable from the corner of an eye. When someone selects an element, lock it and outline it in their colour immediately: two people editing the same shape at once is a corrupted shape.

Do:
- Interpolate between server ticks for smooth movement
- Stable per-user colour hashed from ID

Avoid:
- Two users editing the same locked element at once

Code (JS):

```js
const cursors = new Map();

function onServerTick(id, x, y) {
  const c = cursors.get(id) ?? { x, y, targetX: x, targetY: y, color: hashColor(id) };
  c.targetX = x; c.targetY = y;
  cursors.set(id, c);
}

function raf() {
  for (const c of cursors.values()) {
    c.x += (c.targetX - c.x) * 0.25; // eases toward the latest server tick
    c.y += (c.targetY - c.y) * 0.25;
  }
  renderCursors(cursors);
  requestAnimationFrame(raf);
}
raf();
```

## Modal Hierarchy

The first question is always “does this block the user?” A modal takes over the screen with a full scrim and should be reserved for critical or destructive choices that genuinely must be answered before anything else. A bottom sheet is the mobile-first default for non-blocking flows. A drawer is edge-anchored and used for navigation, dimming only the area it covers. A popover anchors to its trigger, stays small (~200px), and is for lightweight menus, never a blocking flow. Reaching for a modal when a popover would do adds friction to something routine.

Do:
- Modals reserved for critical/destructive decisions only
- Popovers anchored to their trigger, small and contextual

Avoid:
- A full-screen modal for a routine, non-blocking action

Code (JS):

```js
function pickOverlay({ blocksUser, isNavigation, anchoredToTrigger }) {
  if (blocksUser) return 'modal';          // critical/destructive only
  if (isNavigation) return 'drawer';       // edge-anchored, dims only its area
  if (anchoredToTrigger) return 'popover'; // small, contextual, ~200px
  return 'sheet';                          // mobile-first default, non-blocking
}
```

## Peak-End Rule

The brain doesn’t average an experience. It stores the most intense moment (the peak) and the final moment (the end), then judges the whole flow from those two points alone. Two flows with an identical average satisfaction are remembered completely differently depending on how they finish. Engineer at least one intentional peak (a surprise, a moment of delight) and make sure the ending lands on a high note rather than a flat confirmation. The reverse also holds, and a broken final step tanks the memory of an otherwise smooth flow.

Do:
- Engineer one deliberate peak partway through a flow
- End on a celebratory note, not a flat confirmation

Avoid:
- Spreading effort evenly while the finish gets neglected

Code (JS: flow annotation):

```js
// annotate the flow explicitly, the peak and end are design decisions,
// not something to discover after the fact
const onboardingFlow = [
  { step: 'Welcome' },
  { step: 'Connect calendar' },
  { step: 'AI setup', peak: true, note: 'pre-fills from their own site, the surprise' },
  { step: 'Done', end: true, note: 'a real win shown, not a flat "Setup complete"' },
];
```

## Search Experience System

Placeholder copy is the first onboarding moment: “Search” tells someone nothing, “Search by name, SKU, or brand” tells them everything they can look for. An empty field isn’t actually empty: load recent searches the moment the bar gets focus so one tap refills it. Rank autocomplete by clicks rather than alphabet and tag each suggestion with a category badge, keep the whole flow keyboard-driven, and treat a zero-results screen as a recovery moment (popular searches, category jumps) rather than a dead end.

Do:
- Recent searches surfaced the moment the bar gets focus
- Zero-result screens offer a real recovery path

Avoid:
- A bare “No matches” dead end

Code (JS):

```js
searchInput.addEventListener('focus', () => {
  if (!searchInput.value) showResults(getRecentSearches()); // not actually empty
});

searchInput.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowDown') moveHighlight(1);
  if (e.key === 'ArrowUp') moveHighlight(-1);
  if (e.key === 'Enter') selectHighlighted();
  if (e.key === 'Escape') closeResults();
});

function renderResults(results, query) {
  if (results.length === 0) {
    return renderZeroState({ popular: getPopularSearches(), query }); // recovery, not a dead end
  }
  render(results.sort((a, b) => b.clickCount - a.clickCount)); // ranked by usage, not A-Z
}
```

## Star Rating

Stars should fill ahead of the cursor on hover so someone sees the value they’re about to commit, and snap back to the saved rating when the pointer leaves without clicking. A naive build leaves it stuck on the last hovered star. Averages need fractional fill: a 4.4 renders as four full stars plus a fifth clipped to 44%, since rounding up to five full stars misrepresents the real score. Stagger the fill roughly 30ms per star left to right on commit; popping all five at once reads as flat.

Do:
- Fractional fill for real averages (4.4 → 5th star at 44%)
- Preview snaps back to saved value on pointer-leave

Avoid:
- Rounding a 4.4 average up to a full 5 stars

Code (CSS + JS):

```css
.star {
  background: linear-gradient(90deg, var(--star-fill) var(--fill, 0%), var(--star-empty) var(--fill, 0%));
}

function renderAverage(avg) {
  stars.forEach((star, i) => {
    const fill = Math.max(0, Math.min(1, avg - i)) * 100;
    star.style.setProperty('--fill', fill + '%'); // 4.4 -> stars 1-4 at 100%, star 5 at 40%
  });
}

row.addEventListener('pointerleave', () => renderAverage(savedRating)); // snap back, don't stay stuck
star.addEventListener('pointerenter', (i) => previewFill(i));
```

## Swipe Actions

Swipe actions are invisible UI, and without a discovery hint, most people never find them at all. Destructive swipes need real friction: an instant full-swipe delete is a data-loss bug waiting to happen, so reveal the action button on a partial swipe and require a tap (or a full swipe plus an undo toast) to actually commit. Colour-code consistently by consequence across every list in the app, and never make swipe the only path; a long-press menu or a detail-view button needs to reach the same actions.

Do:
- Reveal on partial swipe, require a tap or undo to commit
- Always ship a non-swipe fallback path

Avoid:
- An instant full-swipe delete with no undo

Code (JS):

```js
let startX = 0;
row.addEventListener('touchstart', (e) => startX = e.touches[0].clientX);

row.addEventListener('touchmove', (e) => {
  const dx = e.touches[0].clientX - startX;
  row.style.transform = `translateX(${Math.min(0, dx)}px)`; // reveal only, doesn't commit
});

row.addEventListener('touchend', (e) => {
  const dx = e.changedTouches[0].clientX - startX;
  if (dx < -80) row.classList.add('action-revealed'); // tap the button to actually delete
  else row.style.transform = '';
});
```

## Tooltip Design

A 300ms delay before a hover tooltip appears stops it firing on every accidental cursor graze. Anchor it to its trigger with an arrow, since a floating label with no arrow above a row of icons leaves people guessing which element it describes. Flip to the opposite side near a viewport edge so it never clips off-screen, and make it dismissible from every direction: mouse-leave, Escape, blur, and an outside tap. Keep the copy tight: cap the width around 300px and hold it to one sentence.

Do:
- ~300ms delay before showing, arrow-anchored
- Dismissible via mouse-leave, Esc, and outside tap

Avoid:
- Documentation-length copy crammed into one tooltip

Code (JS):

```js
let showTimer;
trigger.addEventListener('mouseenter', () => {
  showTimer = setTimeout(() => positionAndShow(trigger, tooltip), 300);
});
trigger.addEventListener('mouseleave', () => { clearTimeout(showTimer); hide(tooltip); });

function positionAndShow(trigger, tooltip) {
  const rect = trigger.getBoundingClientRect();
  const clipsRight = rect.right + tooltip.offsetWidth > window.innerWidth;
  tooltip.dataset.side = clipsRight ? 'left' : 'right'; // flips near an edge
  tooltip.classList.add('show');
}
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') hide(tooltip); });
```

## Chat UI System

A chat thread reads as considered or as generated based on six small decisions, not one big one. **Grouping**: consecutive messages from the same sender share one avatar/name, with tight spacing inside the group (~4px) and a visibly looser gap between different senders (~16px), so the eye reads "who's talking" without re-parsing every line. **Timestamps**: a relative date divider by default ("Today", "2 min"), with the precise timestamp only on hover, not printed on every single bubble. **Optimistic send**: the bubble you just sent renders instantly, before the server confirms it, so sending never feels like it's waiting on the network. **Scroll anchoring**: a new incoming message never yanks someone who's scrolled up back to the bottom; show a "new messages" pill instead, and only auto-scroll if they were already at the bottom when it arrived. **Typing indicator**: lives inline in the message flow itself, in the sender's own row, not as a separate fixed status line disconnected from where the message will actually appear. **Composer**: the input grows with content up to a cap (around 5 lines), then switches to its own internal scroll rather than pushing the whole thread up indefinitely.

Do:
- Group consecutive same-sender messages under one avatar
- "New messages" pill instead of yanking scroll position
- Composer grows to a capped height, then scrolls internally

Avoid:
- A typing indicator floating outside the message flow it refers to
- A timestamp printed on every bubble instead of on hover

Note: **Back end not included.** These six decisions cover front-end behaviour only. Presence, typing indicators and read receipts also need real back-end work (a live connection and presence tracking), and how typing and read receipts behave with several people in one thread is a separate decision.

Code (CSS):

```css
/* tell 01, grouping: tight within a sender, loose between senders */
.msg + .msg[data-same-sender] { margin-top: 4px; }
.msg + .msg:not([data-same-sender]) { margin-top: 16px; }

/* tell 04, scroll anchoring: pill instead of yanking scroll position */
if (isScrolledToBottom(list)) list.scrollTop = list.scrollHeight; // only if already at bottom
else showNewMessagesPill(); // otherwise let them stay where they are

/* tell 06, composer: grows to a cap, then scrolls internally */
.composer { max-height: calc(5 * 1.4em); overflow-y: auto; field-sizing: content; }
```

## Interactive State & Affordance

Every interactive element earns its keep by answering two questions instantly: did my click register, and was this ever clickable in the first place. Feedback within 100 milliseconds is the real deadline; past it, someone starts wondering whether the click landed at all, so a control either changes state immediately or shows a loading indicator the moment it's pressed, never neither. Affordance has to be just as unambiguous: if someone has to wonder whether something is clickable, the design already failed, so clickable things look clickable and decorative things don't. One control needs all six states actually designed, not improvised. Default sits at rest. Hover adds a cursor change plus a visual lift. Focus gets a distinct 2px ring offset 2px from the element, visible against both light and dark backgrounds, never a removed outline with nothing put in its place. Active shows a brief scale down or colour darken on press. Disabled drops to 50% opacity with a not-allowed cursor. Loading swaps in an inline spinner and switches the label to its verb form, such as “Saving…”. A button reads as a button through fill or border and padding, never colour alone, and its label names the action rather than saying “Click here”. A link stays underlined or holds a clearly distinct colour with a pointer cursor on hover; never style plain, non-clickable text the same way, and never make a whole row clickable while also nesting a real button inside it, since the two targets fight each other for the same click. The same states need to reach a screen reader, not just a sighted eye: `aria-pressed` for a toggle's own state, `aria-busy` while something loads, `aria-disabled` always paired with the visual treatment rather than standing in for it, `aria-live="polite"` on a status message that updates without a reload, and the real semantic element for the job: a button is an actual `<button>`, a link is an actual `<a>`.

Do:
- All six states (default, hover, focus, active, disabled, loading) actually designed, not improvised
- Focus ring visible on both light and dark backgrounds, never a removed outline with nothing replacing it
- `aria-pressed`/`aria-busy`/`aria-disabled` paired with the matching visual treatment

Avoid:
- Plain non-clickable text styled like a link, or a clickable row with a real button nested inside it

Code (CSS + JS):

```css
/* all six states, none improvised */
.btn { padding: 8px 16px; border-radius: 6px; cursor: pointer; }
.btn:hover { box-shadow: 0 2px 4px rgb(0 0 0 / .08); }
.btn:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; } /* never outline: none alone */
.btn:active { transform: scale(.97); }
.btn:disabled { opacity: .5; cursor: not-allowed; }
.btn[aria-busy="true"] { pointer-events: none; }

function setLoading(btn, isLoading) {
  btn.setAttribute('aria-busy', String(isLoading));
  btn.disabled = isLoading; // prevents double-submit, not just visual
  btn.textContent = isLoading ? 'Saving…' : 'Save changes';
}
```

## Click Target Sizing

Touch and accessibility both want generous room to land a tap, and the numbers are specific rather than a vague instruction to “make it bigger”. A button clears 44 by 44 pixels end to end, the iOS and WCAG AAA floor, even when the visual icon sitting inside it is smaller; the touch zone is what counts, not the glyph. A form field's tap target holds at least 48 pixels of height. Two adjacent buttons keep at least 8 pixels of gap between their edges, tight enough to read as a group, wide enough that a thumb doesn't land on the wrong one. A text link inside a paragraph can size naturally with the surrounding copy, but stays visually isolated from any other link sitting right next to it. Anywhere a control's visual size falls under 44 by 44, pad the invisible touch zone out to that floor instead of shrinking the rule to fit the design.

Do:
- 44×44px minimum touch zone on every button and icon button, icon size aside
- 48px minimum height on a form field's tap target

Avoid:
- Two adjacent buttons with less than 8px between their edges

Variant: **Variant B: a 44 by 44px minimum touch zone (48px height for a form field).** Use when: the surface is touch-first, client-facing, or has to meet the iOS and WCAG AAA floor. The same 44px is repeated in Hover Trap. Variant A: tap targets of at least 36 to 40px. Use when: you are matching an existing dense product whose compact rows already ship 36px row actions. Both are kept on purpose.

Code (CSS):

```css
.icon-btn {
  width: 44px; height: 44px; /* touch zone, independent of the icon's own size */
  display: flex; align-items: center; justify-content: center;
}
.icon-btn svg { width: 18px; height: 18px; } /* the icon can stay small; the target can't */

.field input, .field select { min-height: 48px; }
.btn-row { display: flex; gap: 8px; } /* 8px floor between adjacent targets */
```

## Action Priority

A screen earns clarity by admitting it only has one truly primary action, rarely two, and letting everything else sit visibly lower. Primary gets the solid, filled treatment in the brand or accent colour at the largest size on the screen, usually top right or leading the main column, and there is only one of it. Secondary covers two to three actions at most, outlined or ghost styled, neutral in colour, sized the same as the primary or a touch smaller. Tertiary is everything else: unlimited in count, living as a text link, an icon button, or folded into an overflow menu instead of competing on the main surface. A screen with more than two solid, equally weighted buttons hasn't been prioritised, it's just been listed. A destructive action never wears the primary style, no matter how important deleting something feels in the moment.

Do:
- One true primary action per screen, at most two
- Secondary actions capped at 2-3, visibly quieter than primary

Avoid:
- Three or more solid, equally weighted buttons competing for the same click
- A destructive action styled as the primary button

Code (CSS):

```css
.action-primary   { background: var(--accent); color: #fff; } /* 1 per screen, rarely 2 */
.action-secondary { background: transparent; border: 1px solid var(--border); } /* 2-3 max */
.action-tertiary  { background: none; border: none; color: var(--text-muted); text-decoration: underline; } /* unlimited, or fold into overflow */

/* refuse at review time: more than one .action-primary in the same view,
   or a destructive control wearing .action-primary */
```

## Time-Block Dragging

A drag that creates or resizes something with a real value attached, a scheduled time block, a price range, a crop area, owes that value back to the user while the drag is still happening, not just a shape sliding around with the result revealed only on release. A small heads-up readout tracking the pointer, showing exactly what start, end, and duration the drop would produce, turns a guess into a controlled action. Snapping to a fixed interval (15 minutes, not a free pixel) removes the fiddly precision nobody actually wants, since no one is trying to end a meeting at 10:47. And once a block exists, only the edge that should move stays draggable: resizing from the bottom handle changes duration while the start time locks in place, so a resize can never accidentally turn into an unintended reschedule.

Do:
- Live start/end/duration HUD tracking the pointer, updated on every pointermove
- Snap to a fixed interval (15 min), not free-pixel positioning
- Lock the start edge once a block exists, resize only from the bottom handle

Avoid:
- Silent dragging with no numeric feedback until release
- Letting either edge move during a resize, ambiguous whether the event moved or changed duration

Note: In a calendar the same mechanics hold (snap to 15 minutes, resize from the bottom edge only, the time label updates while you drag, not after), plus two more: drag on empty space to draw a new event, and move an existing event by its body. See Calendar Week View (entry 28) for the layout rules around it.

Code (JS: the exact code driving the demo):

```js
var SNAP = 15, MIN_DUR = 15; // 1px == 1 minute in this demo's column
handle.addEventListener('pointerdown', function(e){
  startH = event.offsetHeight;
  startY = e.clientY;
  handle.setPointerCapture(e.pointerId); // same handle-capture approach as the resizable-panel pattern
});
handle.addEventListener('pointermove', function(e){
  var raw = startH + (e.clientY - startY);
  var snapped = Math.round(raw / SNAP) * SNAP; // snap to the grid, not the pixel
  if (snapped < MIN_DUR) snapped = MIN_DUR;
  event.style.height = snapped + 'px'; // top never changes: start stays locked, only duration moves
  hud.textContent = fmt(startMin) + ' to ' + fmt(startMin + snapped) + ' · ' + snapped + 'm';
});
```

## Calendar Week View

A busy week stays readable because of six layout rules, not because of extra chrome. **1. Grid and now.** Seven columns and 24 rows, one hour each; hour labels sit on the grid line, not inside the cell; a red line marks the current time; and the view opens scrolled to now, not to midnight. **2. Colour per calendar.** Show calendar colour as a 3px stripe on the left edge of each event with the fill at about 10%, so the title stays readable on every colour; full fills turn a busy week into a rainbow. **3. Overlaps.** Two events in the same hour sit side by side at half width each, three at a third each; never stacked, and never hidden behind a “+1 more”. **4. Height is duration.** 60px per hour; a 15 minute event still gets a one-line clipped title, and anything shorter is a bar you can hover for the title. **5. Drag on empty space.** Drag on empty space to draw an event, snap to 15 minutes, move it by its body, resize from the bottom edge only, and update the time label while dragging, not after (the mechanics are in Time-Block Dragging, entry 27). **6. All-day row.** All-day events live in a pinned row above the grid that stays put while the hours scroll, so they never eat the morning.

Do:
- Hour labels on the grid line, a red now line, and the view opened scrolled to now
- Calendar colour as a 3px left stripe with a fill of about 10%, not a full fill
- Same-hour events side by side (half width, a third), with a cap of about four and a “+N” fallback beyond it
- Height proportional to duration: 15 minutes keeps a one-line clipped title, shorter becomes a hover-for-title bar
- All-day events in a pinned row above the scrolling hours

Avoid:
- Full-colour fills that turn a busy week into a rainbow
- Stacking overlapping events on top of each other
- Opening the view at midnight

Note: **Craft choices, and one opinion.** Most of this is standard calendar convention (a now line, colour-coded calendars, side-by-side overlaps, height proportional to duration, a pinned all-day strip, 15 minute snapping). The exact numbers (60px per hour, the 3px stripe, the 10% fill) are example choices, not standards, and the “never a plus one” overlap rule is an opinion: with four or five overlapping events the side-by-side columns become too narrow to read, which is why the major calendar apps cap the columns and show “+N” beyond that. Use a cap of about four, then fall back to “+N”. One answer for three or more all-day events is to divide the row again and show the detail on hover only, which gets thin as the count grows.

Code (CSS + JS):

```css
/* 7 columns, 24 rows, 60px per hour; hour labels sit on the grid line, not inside the cell */
.cwv-grid  { display: grid; grid-template-columns: 44px repeat(7, 1fr); }
.cwv-day   { position: relative; height: calc(24 * 60px);
             background-image: repeating-linear-gradient(to bottom, var(--border) 0 1px, transparent 1px 60px); }
.cwv-hour  { position: absolute; transform: translateY(-50%); }
.cwv-now   { position: absolute; left: 0; right: 0; height: 2px; background: #c0392b; } /* the red now line */

/* colour per calendar: a 3px stripe plus a fill of about 10%, so the title stays readable on every colour */
.cwv-event { border-left: 3px solid var(--cal); background: color-mix(in srgb, var(--cal) 10%, var(--card)); }

/* all-day events: a pinned row above the scrolling hours */
.cwv-allday { position: sticky; top: 0; z-index: 3; background: var(--card); }

const PX_PER_MIN = 1; // 60px per hour, so height is duration
function place(ev, overlapping) { // overlapping = events sharing the same hour, in start order
  const n = Math.min(overlapping.length, 4); // about four columns is the readable limit, then show "+N"
  const col = overlapping.indexOf(ev) % n;
  ev.el.style.top    = ev.startMin * PX_PER_MIN + 'px';
  ev.el.style.height = (ev.endMin - ev.startMin) * PX_PER_MIN + 'px'; // 15 minutes = 15px: one clipped line; shorter = a hover bar (title attribute)
  ev.el.style.width  = (100 / n) + '%';   // two events: half each; three: a third each; never stacked
  ev.el.style.left   = col * (100 / n) + '%';
}
scroller.scrollTop = nowMinutes * PX_PER_MIN - 120; // open scrolled to now (with a little context above), not midnight
```

## Voice Message Recorder

A hold-to-record voice button makes five decisions, and each one gives the gesture a visible way out. **Press:** the timer starts and the button swells out past the thumb in the same frame as the press, before the first word, so the person can see it is recording; feedback hidden under the thumb leaves them asking whether it heard them. **Cancel:** sliding left past a fixed line turns the hint into a trash can, so releasing before the line sends and releasing past it deletes. **Lock:** for a long message, sliding up locks the recording and frees the thumb; a stop button and a send button replace the gesture, so nothing ends by accident.

**Mic check:** a live input waveform moves with the voice, and a flat line for 2 seconds raises a banner (No sound for 2 seconds. Your mic looks muted.) with an Unmute button, before a whole minute is wasted. **Playback:** the listener’s bubble shows the length as a scrubbable waveform, with a draggable playhead, timestamps as jump points, a 1x to 1.5x speed toggle, and the time shown as time left, counting down.

Do:
- Timer and swell visible past the thumb on press, before any sound
- A fixed cancel line: past it, release deletes
- Slide up to lock long messages, then explicit stop and send
- A flat waveform for 2 seconds raises a muted-mic warning with Unmute

Avoid:
- Recording feedback hidden under the thumb
- A long recording that ends the moment the thumb slips

Code (JS):

```js
// hold to record, slide left to cancel, slide up to lock
const CANCEL_X = -120; // px left of the start point: past it, release deletes
const LOCK_Y = -80;    // px above the start point: past it, recording locks
mic.addEventListener('pointerdown', e => {
  start = { x: e.clientX, y: e.clientY }; recorder.start();
  ui.showTimerAndSwell(); // same frame as the press, before any sound
});
mic.addEventListener('pointermove', e => {
  ui.setCancelHint(e.clientX - start.x < CANCEL_X ? 'trash' : 'slide');
  if (e.clientY - start.y < LOCK_Y) { locked = true; ui.showStopAndSend(); }
});
mic.addEventListener('pointerup', e => {
  if (locked) return; // only the stop or send button ends a locked recording
  (e.clientX - start.x < CANCEL_X) ? recorder.discard() : recorder.send();
});
// mic check: flat input for 2 seconds means a muted mic
if (msSinceLevelAbove(0.02) > 2000) ui.banner('No sound for 2 seconds. Your mic looks muted.', 'Unmute');
```

## Primary Button Anatomy

Six decisions make a primary button read as the main action, and none of them is the colour. **Size:** 48px tall (never under 44px; a 40px button is a target the thumb misses) with 24px of side padding. **Label:** 17px, weight 600, sentence case with no shouting capitals, and a verb plus an object that says exactly what the tap will do: Add to cart, never OK, Submit or Click here. **Contrast:** the label at 4.5:1 or better and the button’s edge at 3:1 or better against the page (7:1 is the AAA text level); a flat grey fill at 1.6:1 has no edge and disappears, so a 1px rim at about 4:1 and a white label at about 14:1 fix it.

**Depth:** light comes from above, so a lit top edge (1px of white at 16%) and a shadow that falls down (y 8, blur 24); a recessed 6px track and a rim light in the one accent are optional extras (see the caveat). **Detail:** one icon only, 20px, sitting 10px from the label, and for a pill the radius is height / 2 (24 on a 48px button). **Motion:** hover answers in 200ms, a press sinks the button 1px in 120ms, and a slow action shows a spinner that becomes a check (Added), easing out over about 200ms: feedback in 100ms, done in 300.

Do:
- 48px tall, 24px side padding
- A verb plus an object, 17px semibold, sentence case
- Label at 4.5:1, edge at 3:1 against the page
- A spinner that becomes a check on a slow action

Avoid:
- OK, Submit or Click here as the label
- A flat grey fill with no visible edge
- Two icons on one button

Note: **The finish draws real pushback.** A glossy treatment (recessed track, rim light) is often read as dated, or as the way machine-generated buttons look. Treat size, label, contrast and motion as the rules and the depth finish as an optional style, checked against AI Slop: What Not To Do before use. Keyboard focus needs its own visible state too (Focus States, Navigation entry 01).

Variant: **Corner shape, two variants.** Variant A: a pill, radius = height / 2. Use when: the product’s shapes and type are round and friendly and the button stands on its own. Variant B: a small-radius rectangle from the system radius scale. Use when: the product is dense or technical, or the button sits beside inputs and cards that share that small radius. Both kept on purpose.

Variant: **Visible size versus hit area, two variants.** Variant A: the visible button is 48px tall. Use when: it is the primary action on a touch screen. Variant B: the visible button may be smaller as long as its hit area and clearance reach 44px (consistent with Click Target Sizing, Interaction entry 25). Use when: secondary or dense controls.

Code (CSS):

```css
.btn-primary {
  min-height: 48px; padding: 0 24px;      /* never under 44px tall */
  border-radius: 24px;                /* height / 2 for a pill; variant B: var(--radius-sm) */
  font-size: 17px; font-weight: 600;  /* sentence case, verb + object */
  display: inline-flex; align-items: center; gap: 10px; /* one 20px icon, 10px from the label */
  box-shadow: inset 0 1px 0 rgb(255 255 255 / .16), /* lit top edge */
              0 0 0 1px var(--btn-edge),            /* edge at 3:1 or better against the page */
              0 8px 24px rgb(0 0 0 / .22);          /* shadow falls down */
  transition: box-shadow 200ms ease-out, transform 120ms ease-out;
}
.btn-primary:active { transform: translateY(1px); }  /* press sinks 1px */
.btn-primary:focus-visible { outline: 2px solid var(--focus); outline-offset: 2px; }
```

## Before You Build: The Intent Brief

A screen built straight from the data model comes out shaped like the database: every field, every filter and every action at the same volume. Five answers, written down before any markup, shape it around the person instead. **Who** uses it (role, expertise, how often). **Primary action:** the one thing they do here 80% of the time. **Secondary actions:** the next two or three, the 15% case. **Context:** where and how it is used (a phone between jobs, a focused desk session, a shared screen, an incident at 2am). **Worst case:** the worst thing that can happen here (data loss, the wrong recipient, an irreversible action, a missed deadline). Ask for any missing answers in one message, never drip-fed, and keep the five as a short brief at the top of the work; every later decision should trace back to it.

**Turning answers into layout.** A primary action used 80% of the time gets one prominent button, never a menu item. An irreversible worst case gets a confirmation step plus undo, never a single click. A wrong-data worst case keeps the identifying context (name, ID, timestamp) on screen at all times. A phone check-in gets one column, no sideways scroll and actions within thumb reach. Focused desk work can carry several panes, visible keyboard shortcuts and higher density. An incident at 2am gets high contrast, big targets and no clever interactions. A frequent expert gets density and batch actions without hand-holding tooltips; an occasional novice gets space, progressive disclosure and inline help.

**Shapes the brief rules out.** A table of every field when the primary action needs three. A destructive action sitting next to the primary one. Every available filter shown by default. A modal for the screen’s primary action, where inline editing or a dedicated page belongs (Modal Hierarchy, entry 17). Tabs for sections that are not mutually exclusive. Mockups and demos use realistic placeholder content (a plausible name, a real-looking invoice number), never Lorem Ipsum and never a real customer’s details. When the owner says just build it, write the brief from stated assumptions, mark it as assumed, and keep moving; if the owner overrides a rule after a one-line warning, build it their way.

Do:
- Five answers (who, primary, secondary, context, worst case) written down before any markup
- The worst case sets the friction: irreversible means a confirmation plus undo
- Realistic placeholder content in every mockup

Avoid:
- A table of every database field because the data model has them
- A modal or a menu item for the action people take 80% of the time
- Lorem Ipsum, or a real customer’s details, in a demo

Code (TEXT):

```
INTENT BRIEF (assumed until confirmed)
User:          support agent, daily, non-technical
Primary:       look up one customer during a live call
Secondary:     reset password, view recent activity
Context:       desktop, sometimes a phone, always in a hurry
Worst case:    acting on the wrong customer
Implications:  search owns the top of the page
               name, email and ID stay visible once a customer is open
               suspend and delete sit behind a typed confirmation
```

## UX Audit Order and Severity

An audit is useful when every line names one element and one concrete fix. Start by writing down the screen’s inferred intent (primary user, primary action, worst case); if the intent is unclear, ask before critiquing, because critique without intent comes out wrong. Then rank every finding on four levels. **P0** breaks the primary flow or risks data loss or a wrong action (a destructive button with no confirmation, the primary action below the fold). **P1** degrades usability for most people (unclear tab labels, a twelve-column table, no empty state). **P2** is friction people will hit but get past (missing autocomplete hints, missing hover states). **P3** is polish (a toast that leaves too soon, an inconsistent focus ring). Five to twelve findings is the healthy range: more than twelve is a list of nitpicks, and fewer than five is being too kind.

**Walk the lenses in this order.** Intent and hierarchy: the primary action is obvious in three seconds, there is one primary, destructive actions are not styled as primary, and values trace back to the project’s tokens. Information architecture: grouped by the person’s mental model, one scanning pattern, tables cut to five to seven columns. States: loading, empty, partial, error, success and offline (Six Data States, Feedback entry 13). Affordance and feedback: clickable looks clickable, every state is designed, the focus ring is visible, targets are 44px, feedback lands inside 100ms, and friction matches the risk. Forms: seven visible fields at most, labels above, smart defaults, validation on blur, specific errors. Copy: verbs on buttons, tooltips that clarify, no Something went wrong, empty states that teach, you rather than the user. Accessibility: never colour alone, AA contrast on text, labelled icon buttons, focus order matching visual order, the whole flow usable by keyboard. Mobile: one column, no sideways scroll, a sticky primary action on long forms, modals the keyboard cannot cover. Perceived speed: skeletons that match the layout, optimistic updates where safe, progress on long work.

**Report shape.** A table sorted P0 first with five columns: number, severity, issue, why it matters to a real person, and the fix. Then the three fixes worth the most, written out in full with code. Then what is working, so a good decision survives the rewrite. A review of a diff before merge uses the same scale grouped as must fix (P0 and P1), should fix (P2) and nice to fix (P3), each pointing at a file and line. A restyle pass is visual only: tokens, type, spacing, finish and interactive states change, while logic, structure and the meaning of the copy stay put, and any structural problem spotted on the way gets one flag line for the audit instead of a silent fix. If the owner disagrees with a finding, record the call once and move on.

Do:
- Inferred intent written first, with every finding tied to it
- Every row names a specific element and an actionable fix
- Five to twelve findings sorted P0 first, then the top three in full, then what is working

Avoid:
- Vague advice such as “consider improving the hierarchy”
- More than twelve findings, or an audit with no what is working section
- A restyle that quietly changes logic or structure

Code (TEXT):

```
## Inferred intent
Primary user: ...   Primary action: ...   Worst case: ...

| # | Sev | Issue (named element)            | Why it matters        | Fix                               |
|---|-----|----------------------------------|-----------------------|-----------------------------------|
| 1 | P0  | Row Delete styled like Edit      | one misclick deletes  | move to overflow, typed confirm   |
| 2 | P1  | 12 columns, 3 decision-relevant  | overload on every row | cut to 5, rest in a detail view   |

## Top 3 fixes (in full, with code)
## What is working
```
