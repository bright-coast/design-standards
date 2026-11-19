> A Bright Coast AI skill, made by Rob Lee. github.com/bright-coast/design-standards
> Copyright 2026 Bright Coast AI. For Bright Coast AI clients and people Bright Coast AI has given this link to. You may build what you find here into your own work; you may not republish or resell the material itself. See LICENSE at github.com/bright-coast/design-standards.

# Visual

The layer people notice consciously least and judge most: colour, depth, spacing, and the perceptual rules underneath them.

File 2 of 2: 17 of the 38 Visual patterns. Use when: colour, type, spacing, depth, icons and layout.

In this part: AI Landing Page Tells; Scanning Patterns; Typography as a System; Min-Width Zero for Grid and Flex Children; Equal-Height Cards in a Row; Pricing Table; Card Treatment System; Phone Check at 375px; 60-30-10 Colour Balance; Visual Character: One Decision per Axis; Project Design Contract; Stacked Priority Order; Avatar; CSS Layout Foundations; Optical Corrections; Glass Panels; Less Noise on a Busy Screen.

In `references/visual.md`: Border Radius; Charts That Lie; Color Accessibility; Dark Mode; Depth Layers; Design System Kit; Design Tokens; Gestalt Laws; Golden Ratio; Gradient Design; Grid System; Icon Design Rules; Perfect Card; Proximity Rule; Shadow Elevation; Visual Hierarchy; Von Restorff Effect; Z-Index Mastery; Tabular Numbers; Color System, Not Random Hex; AI Dashboard Tells.

## AI Landing Page Tells

The dashboard tells above have a landing-page equivalent: same underlying habit (decoration standing in for a real decision), different surface. **The headline**, an adjective stacked on a vague noun ("Supercharge your workflow with AI"), becomes an outcome stated in plain text, no adjective required. **The blur**, a big ambient gradient glow sitting behind the hero doing pure decoration, gets replaced by putting the colour ON the product screenshot itself, so the accent colour is attached to something real instead of floating in the background. **Two buttons**, a primary and secondary CTA rendered at equal visual weight (both solid, both bright), becomes one true primary (solid) and one visibly quieter secondary (text link or ghost button). **The proof**, a generic "trusted by 10,000+ teams" stat with no attribution, becomes one specific customer quote with a name, role, and face attached; a single credible quote reads as more real than a big round number nobody can check. **Feature cards**, a row of icon-plus-adjective cards (a lightning bolt next to "Fast"), becomes a card that shows the actual product screen doing the thing, not an icon standing in for it.

Do:
- Outcome stated in plain text, not an adjective+noun headline
- Colour lives on the product shot, not an ambient background glow
- One true primary CTA, one visibly quieter secondary
- One named, attributed quote over an uncheckable round-number stat

Avoid:
- Two equal-weight CTAs, especially both left-aligned in a row (breaks the primary/secondary scan pattern)

Code (CSS):

```css
/* tell 01, plain-text outcome headline, not an adjective+noun template */
/* "Supercharge your workflow with AI" → "Close the month in one afternoon." */

/* tell 02, colour lives on the product, not an ambient decorative glow */
.hero { background: var(--surface-base); } /* not radial-gradient(...) behind the hero */
.hero-product-shot .accent-el { background: var(--accent); }

/* tell 03, one true primary CTA, one visibly quieter secondary */
.cta-primary   { background: var(--accent); color: #fff; }
.cta-secondary { background: transparent; text-decoration: underline; font-weight: 500; }

/* tell 04, one attributed quote beats an uncheckable stat */
/* "Trusted by 10,000+ teams" → quote + name + role + avatar */

/* tell 05, feature cards show the product, not an icon+adjective */
.feature-card__media { /* real product screenshot, not an icon glyph */ }
```

## Scanning Patterns

Four scanning shapes cover almost every screen type, and mixing more than one on a single screen destroys scannability rather than adding polish. **F-pattern** suits text-heavy content: article lists, search results, inboxes, log views. Most important information sits top-left, with a horizontal scan across the top, a shorter secondary scan partway down, then a vertical scan down the left edge; headings have to actually carry visual weight for this to hold. **Z-pattern** suits marketing pages and single-screen UIs with few elements: landing pages, modals, empty states. Logo or identity sits top-left, primary action top-right, a diagonal scan runs through the middle, and the call-to-action lands bottom-right. **Layer-cake** fits dashboards: stacked horizontal sections that each scan independently, a KPI summary at the top, drill-down sections in priority order in the middle, secondary data and support links at the bottom. **Spotlight** fits detail pages: one subject identified prominently (avatar, name, status), actions for that subject grouped right next to its identity, related data below in collapsible sections. Pick the one that matches the content before laying anything out, not after the fact.

Do:
- One scanning pattern per screen, chosen before layout starts
- F-pattern headings visually distinct enough to actually carry the scan

Avoid:
- Two patterns fighting on one screen, e.g. a Z-pattern hero glued straight onto an F-pattern list with no visual break

Code (Notes):

```
// pick one per screen, based on content type. not a CSS pattern, a layout decision
const SCAN_PATTERN_BY_CONTENT = {
  'article list, search results, inbox, logs': 'F',
  'landing page, modal, empty state, confirmation': 'Z',
  'dashboard': 'layer-cake',
  'detail page (one subject + its actions + related data)': 'spotlight',
};
```

## Typography as a System

Typography is seven decisions made once, so every screen inherits them instead of re-deciding them. **1. One font family.** Use a single family for the whole product; hierarchy comes from size, weight and colour, not from mixing typefaces. **2. Five sizes at most, on one ratio.** Step the sizes by a single ratio (1.25), never hand-picked pixels; a typical cleanup collapses 11 sizes to 5. **3. Three text colours.** Primary, secondary and muted do more than ten sizes: colour ranks inside a line, size ranks between blocks. **4. Two weights.** Use 400 for reading and 600 for scanning; when everything is bold, nothing is. **5. Line height moves opposite to size.** About 1.1 on headings and about 1.5 on body text; the same line height everywhere is often called an AI tell. **6. Letter spacing.** Tighten headings above 24px by about minus 2%, and open small uppercase labels by about plus 5%. **7. Measure and figures.** Cap body text at 45 to 75 characters per line by capping the measure (`max-width` in `ch`), not the container, and set tabular figures (`font-variant-numeric: tabular-nums`) on prices, timers and table columns so digits do not wobble. The digit-width detail lives in Tabular Numbers (Visual, entry 19), which is the second half of this rule.

**Ratio choice.** This entry steps by 1.25 (the classic major third). Golden Ratio (entry 09) steps by 1.618, the opposite choice. From a 16px base, 1.25 gives roughly 16, 20 and 25px in two steps, while 1.618 gives roughly 16, 26 and 42px. The two entries disagree, so pick one ratio per product and stay on it. The demo uses a billing card as its worked example.

On a phone, body text and metadata (dates, captions, counts) stay at 14px or more. Smaller text saves a line and costs every reader a squint.

**Let the browser fix ragged lines.** `text-wrap: balance` on headings evens out the line lengths, so a heading never ends on a single word; `text-wrap: pretty` on paragraphs avoids a lone last word without changing the rest. Both replace manual line breaks and non-breaking spaces, which break as soon as the width or the copy changes.

Do:
- One family; hierarchy from size, weight and colour
- Five sizes at most, stepped by one ratio (1.25), never hand-picked pixels
- Three text colours: primary, secondary, muted
- Two weights: 400 to read, 600 to scan
- Line height about 1.1 on headings and about 1.5 on body
- Tracking about minus 2% above 24px, about plus 5% on small uppercase labels
- Body measure of 45 to 75ch through `max-width`, and `tabular-nums` on prices, timers and table columns
- Body and metadata text at 14px or more on a phone
- `text-wrap: balance` on headings, `text-wrap: pretty` on paragraphs

Avoid:
- Ten hand-picked sizes for ten pieces of text
- Bold on everything, or one line height everywhere
- 12px metadata on a phone screen

Note: **Defaults, not laws.** A 45 to 75 character measure, tabular figures, tighter tracking on large display type, looser tracking on small uppercase labels and a line height that falls as size rises are all standard typographic practice, and 1.25 is the classic major-third scale. “Five sizes max”, “two weights only” and “three text colours” are a tidy opinion: good defaults, but not laws, and some products legitimately use 500 as a third weight. The claim that one line height everywhere is an “AI tell” is plausible but unverified.

Variant: **Font families, two variants.** Variant A: one family for the whole product (rule 1 above). Use when: a product UI, a dashboard or a dense tool, where hierarchy comes from size, weight and colour. Variant B: up to two families from different classes (serif with sans, or mono with sans), with display type at 2.5 times the body size or more. Use when: an editorial, marketing or brand surface needs a voice of its own. Two near-identical faces are never the answer. Variant B comes from Visual Character (entry 31). Both are kept on purpose.

Code (CSS):

```css
:root {
  --font: system-ui, sans-serif; /* 1. one family only */
  /* 2. five sizes, each 1.25x the last (example base 16px) */
  --step--1: 0.8rem; --step-0: 1rem; --step-1: 1.25rem; --step-2: 1.5625rem; --step-3: 1.9531rem;
  /* 3. three text colours: colour ranks inside a line, size ranks between blocks */
  --text-primary: #334155; --text-secondary: #5A5A5A; --text-muted: #767676;
  --w-read: 400; --w-scan: 600; /* 4. two weights */
}
body { font: var(--w-read) var(--step-0)/1.5 var(--font); color: var(--text-secondary); } /* 5. about 1.5 on body */
h1, h2, h3 { font-weight: var(--w-scan); line-height: 1.1; color: var(--text-primary); } /* about 1.1 on headings */
h1 { font-size: var(--step-3); letter-spacing: -0.02em; } /* 6. tighten above 24px by about 2% */
.label { font-size: var(--step--1); text-transform: uppercase; letter-spacing: 0.05em; } /* open small uppercase by about 5% */
p { max-width: 65ch; } /* 7. cap the measure (any value from 45ch to 75ch), not the container */
.price, .timer, td.num { font-variant-numeric: tabular-nums; } /* digits do not wobble */
```

## Min-Width Zero for Grid and Flex Children

A grid or flex item defaults to `min-width: auto`, which means it will not shrink below the intrinsic width of its content. Put a code block or any long unbroken string inside a column (a single-line shell command, a URL, a hash) and that content sets the column’s minimum width. The column grows to fit it, the grid ends up wider than its container, and the page overflows or the column is cut off at the edge, instead of the text scrolling inside its own box. The code block’s own `overflow-x: auto` never gets a chance to work, because the box it was meant to scroll inside has already grown to fit the content.

The fix has two halves that work together. Set `min-width: 0` on the grid or flex child, so it is allowed to shrink below its content, and keep `overflow-x: auto` on the `<pre>`, so the overflow scrolls inside the code block. For a grid you can also fix it at the track: `1fr` is shorthand for `minmax(auto, 1fr)`, so `minmax(0, 1fr)` removes the content-based minimum for that column. Treat it as a standing rule for any layout where a column can hold a code block, not a patch on the one instance that broke, because the same overflow returns on the next side-by-side pair. When the content is genuinely long, such as a full shell command, stacking the blocks top to bottom is safer than trusting side-by-side columns to shrink.

**Start at one column, and protect every wide child.** A grid starts as a single column and adds tracks at breakpoints, so the narrowest screen is the default rather than an afterthought. The `min-width: 0` rule is not only for code blocks: any grid or flex child holding a wide table, a long URL, an email address or any other long string needs it, or that one child pushes the whole layout wider than the screen.

Do:
- `min-width: 0` on every grid or flex child that can hold a code block or long string
- `overflow-x: auto` on the `<pre>`, so the overflow scrolls inside its own box
- `minmax(0, 1fr)` in place of `1fr` when you control the grid tracks
- Stack genuinely long commands top to bottom instead of side by side
- Grids that start at one column and add tracks at breakpoints

Avoid:
- Trusting `1fr` columns to shrink around a long single-line command
- Patching only the one column that broke, and leaving the same layout elsewhere
- A wide table inside a grid or flex child left at the default `min-width: auto`

Code (CSS):

```css
.two-col {
  display: grid;
  grid-template-columns: 1fr 1fr; /* 1fr is minmax(auto, 1fr): a long command can widen its column */
  gap: 16px;
}
.two-col > * { min-width: 0; } /* the child may now shrink below its content */
.two-col pre { overflow-x: auto; } /* the overflow scrolls inside the code block */

/* alternative for a grid: fix it at the track instead of the child */
.two-col { grid-template-columns: repeat(2, minmax(0, 1fr)); }

/* same rule for flex: a flex item also defaults to min-width: auto */
.row { display: flex; gap: 16px; }
.row > * { flex: 1; min-width: 0; }
```

## Equal-Height Cards in a Row

Cards that sit in the same row of a grid are always the same height. Whichever card is tallest sets the height of the row, and the others grow to match it. This holds on every screen width, including two-up on a phone, where a mismatch is most visible because the two cards sit directly side by side with nothing else on the screen to distract from the gap.

Let the grid do the work. A grid stretches its items by default, so do not set `align-items` to `start` or `center` on a grid of cards. The trap is the wrapper. When a card is wrapped in another element (a tooltip cell, a link, a button, a motion wrapper), the wrapper becomes the grid item and stretches, but a stretched wrapper does not stretch its child by itself, so the card inside keeps its content height. Give every wrapper in the chain a full-height rule (`h-full`, or `height: 100%`) and give the card itself `h-full`. Do not fake equal heights with magic pixel numbers; the one exception is a set of cards whose inner rows are deliberately fixed so that they line up internally.

Do:
- Let the grid stretch its items, so the tallest card sets the row
- Pass `h-full` through every wrapper (tooltip cell, link, button, motion wrapper) and onto the card itself
- Check the two-up layout on a phone, not only the desktop row

Avoid:
- `align-items: start` on a card grid
- Leaving an unwrapped card that stretches next to a wrapped card that does not
- Fixed heights or magic pixel numbers to fake it

Code (Tailwind):

```
<!-- grid stretches by default: no items-start, no fixed heights -->
<div class="grid grid-cols-2 gap-3 lg:grid-cols-4">

  <!-- unwrapped card -->
  <Card className="h-full" />

  <!-- wrapped card: EVERY wrapper in the chain is h-full, and so is the card -->
  <Tooltip>
    <TooltipTrigger asChild className="h-full">
      <div className="h-full">
        <Card className="h-full" />
      </div>
    </TooltipTrigger>
  </Tooltip>

</div>
```

## Pricing Table

A pricing table sells by ending the comparison. **Hierarchy:** one loud number per column, the price at about 52px weight 800, the plan name dropped to 14px capitals and the details dimmed, so it reads price, plan, details; with every line at 18px the eye has nowhere to land. **Spacing:** more space between plans than inside them (cards 20px apart, 24px padding, 14px rows, features as checks on one scan line); a single grid with 4px rows reads as a wall of text.

**One highlighted tier:** three equal cards are no recommendation, so one plan lifts and two step back. The pick gets the only badge (Most popular; no runner-up badges, since a badge on every card is a badge on none, and silence is what makes the label work), a 2px accent border, and the only filled button; the others get outlined buttons whose labels name the plan or the action (Start with Team, Choose Starter, Talk to sales). **Depth:** raise the choice, not everything, the pick raised about 16px on a soft downward shadow (y 24, blur 48) with a 1px lit top edge and an 18px radius.

**Features:** list what changes, not what repeats; the first tier lists its few features (12 lines cut to 4) and each higher tier opens with Everything in Starter, plus, then three lines, because twelve identical checks per card are a wall, not a comparison. **Anchor:** a billing toggle that defaults to yearly, with the old price struck through next to the new one ($30 struck under $24 a month), so the saving needs no maths. **Motion:** hover lifts a plan 4px in 150ms, the toggle rolls the prices in 300ms, and the trial button’s spinner becomes a check: feedback in 100ms, done in 300.

**Every claim must be true.** The Most popular badge goes only on the tier customers actually choose most, and a struck-through price is a price people really paid before. Never invent a reference price, a popularity figure or a countdown. Within that limit, a real discount can be framed as a saving the customer would lose by not taking it (Monthly billing gives up $98 a year).

Do:
- One loud price per column
- One recommended plan, one badge, one filled button
- Higher tiers list only what they add
- Old price struck through beside the new one

Avoid:
- Three identical cards with a badge on each
- Twelve repeated checks on every tier
- A Most popular badge, an old price or a figure that is not true
- A gradient button on every plan

Variant: **How to show the saving, two variants.** Variant A: a percent chip on the yearly toggle (-20%). Use when: prices are under about $100, where a percent reads as the bigger number (Jonah Berger’s Rule of 100). Variant B: write the saving in money (Save $98 / year: $49 x 12 = $588 against $490 billed annually). Use when: the price or the yearly saving is over about $100, where dollars read bigger. Note that 40% off may still beat save $50, which is the same Rule of 100 split. Both kept on purpose; either way, keep the struck-through old price beside the new one.

Note: **An alternative framing worth testing.** Some teams prefer good, better, best tiers that emphasise what each tier gains more than what it costs. Not tested here; note it as an option, not a rule.

Code (CSS):

```css
.plans { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; } /* more space between plans */
.plan { padding: 24px; display: grid; gap: 14px; border: 1px solid var(--border); border-radius: 18px; } /* than inside them */
.plan .price { font-size: 52px; font-weight: 800; font-variant-numeric: tabular-nums; } /* one loud number */
.plan .name { font-size: 14px; text-transform: uppercase; color: var(--ink-2); }
.plan.pick { border: 2px solid var(--accent); transform: translateY(-16px);
  box-shadow: inset 0 1px 0 rgb(255 255 255 / .1), 0 24px 48px rgb(0 0 0 / .18); } /* raise the choice only */
.plan .btn { border: 1px solid var(--border); background: none; }  /* outlined */
.plan.pick .btn { background: var(--accent); color: #fff; }       /* the only filled button */
.plan { transition: transform 150ms ease-out; } .plan:hover { translate: 0 -4px; }
```

## Card Treatment System

A card is a component with rules, not a box for everything. **One card, one entity:** one title, one subject, one place to go (a project, its client and progress, its page). A settings form wrapped in three cards is three cards and zero entities, so use sections with headings instead; a form section is not a card, and cards for everything is a machine-made tell. **The background picks the treatment:** on white, a border; on a tinted page, a shadow; inside a panel, flat. A shadow on white barely reads, a border on grey is noise, and a border plus a shadow on a tint is a double outline.

**One surface, one action:** a clickable card is clickable everywhere, the whole surface opens it and hover lifts the whole thing; two buttons inside means it is a panel, not a card, and list rows move the other actions into a (...) menu. **Never nest cards:** a card inside a card is a box inside a box, so flatten the inner one and let dividers do the grouping (a 24px rhythm). **One media ratio across the grid:** every image cropped to the same ratio (16:9, for example), never stretched, because one tall image breaks the row. **Dark mode kills shadows:** borders come back one step lighter than the surface, and elevation becomes surface tint, with surface 0, 1 and 2 each a step lighter (Dark Mode, Visual entry 04).

Do:
- One entity per card: title, subject, destination
- Border on white, shadow on tint, flat inside a panel
- The whole card is the one click target
- All card media at one cropped ratio

Avoid:
- A settings form split into cards
- A card nested inside a card
- Archive and Open buttons inside a clickable card
- Shadows as elevation in dark mode

Code (CSS):

```css
.bg-white  .card { border: 1px solid var(--border); box-shadow: none; } /* white: border */
.bg-tinted .card { border: 0; box-shadow: 0 1px 2px rgb(0 0 0 / .06), 0 4px 12px rgb(0 0 0 / .06); } /* tinted: shadow */
.panel     .card { border: 0; box-shadow: none; } /* panel: flat */
.card { position: relative; } .card .stretched::after { content: ""; position: absolute; inset: 0; } /* one surface, one action */
.card img { aspect-ratio: 16 / 9; object-fit: cover; } /* one ratio, cropped, never stretched */
@media (prefers-color-scheme: dark) {
  .card { box-shadow: none; border: 1px solid var(--surface-2); background: var(--surface-1); } /* elevation = tint */
}
```

## Phone Check at 375px

A layout that fits the laptop breaks in five predictable spots on a 375px phone, and each has a one-line fix. **Tables:** six columns at 375px hide status and deadline behind a swipe, so under 640px each row becomes a card (ID, status chip, needed by, cost, approver). **Big numbers:** a 48px figure wraps in a narrow card and its plus sign lands alone on a line, so keep amounts on one line (nowrap, tabular digits) and cap the size at about 30px on a phone. **Inputs:** under 16px, iOS Safari zooms the page when the field is tapped, so inputs are 16px on phones, with the right keyboard per field (inputmode, autocomplete, enterkeyhint).

**Touch targets:** thumbs miss 28px buttons, so touch screens get 44px targets, scoped to a coarse pointer so a mouse keeps the dense layout. **Bottom bar:** a fixed bottom bar slides under the home indicator and covers the last row, so pad it with the safe area inset and leave room under the content. Make it a habit to check every screen at 375px before calling a layout done.

**Three more checks.** Any horizontal row of steps, chips, tabs or badges either wraps or scrolls inside its own region, and never pushes the page wider than the screen. Full-height layouts use `100dvh`, not `100vh` or `h-screen`, because a phone browser’s bar comes and goes and `100vh` leaves the bottom of the layout hidden behind it. A label and a value that do not fit on one line stack, with the label above the value, rather than squeezing both into a cramped row.

Do:
- Under 640px, table rows become cards
- Big figures on one line, capped at about 30px
- Inputs at 16px with the right keyboard
- 44px targets on a coarse pointer only
- Safe-area padding under a fixed bottom bar
- Rows of steps, chips, tabs or badges that wrap or scroll in their own region
- Full-height layouts at `100dvh`
- A label above its value when the two do not fit on one line

Avoid:
- A six-column table squeezed into 375px
- 14px inputs that make iOS zoom
- A fixed bar covering the last row
- `100vh` or `h-screen` on a full-height layout
- A row of chips or tabs that makes the whole page scroll sideways

Variant: **Table-to-card breakpoint, two values.** This entry uses a 640px media query; the phone-table rules under Data Table (Interaction, entry 08) use a container query at about 700px. Both are demo numbers. Use the media query when the table spans the page; use the container query when the same table appears in panels of different widths.

Code (CSS + HTML):

```css
@media (max-width: 640px) { .table-wide { display: none; } .row-cards { display: grid; gap: 8px; } } /* under 640px: cards */
.kpi-value { white-space: nowrap; font-variant-numeric: tabular-nums; font-size: 30px; } /* one line, capped */
input, select, textarea { font-size: 16px; } /* under 16px, iOS Safari zooms in */
<input inputmode="numeric" autocomplete="cc-number" enterkeyhint="next">
@media (pointer: coarse) { button, .tap { min-height: 44px; } } /* touch only; a mouse stays dense */
.bottom-bar { position: fixed; bottom: 0; padding-bottom: env(safe-area-inset-bottom); }
main { padding-bottom: calc(64px + env(safe-area-inset-bottom)); } /* room below the last row */
<!-- env() insets need <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"> -->
```

## 60-30-10 Colour Balance

A simple starting ratio for colour balance. **60% neutral (base):** backgrounds, surfaces, containers and large areas, such as white, light grey or off-white (for example #F7F7F5). **30% secondary (support):** UI elements, icons, borders and secondary content, in grey, muted tones or soft colours (#A3A3A3). **10% accent (highlight):** calls to action, important actions, links and key elements, in the brand colour (a near-black such as #0F0F0F also works, where the accent is contrast rather than hue). Kept to that balance, an interface reads clean, professional and easy to navigate without being boring.

Two cautions. The ratio comes from interior design and is a heuristic, not a measurement anyone checks. And the 30% support grey is for borders, icons and large secondary shapes, not body text: #A3A3A3 on #F7F7F5 is only about 2.4:1, under the 4.5:1 text minimum (Color Accessibility, Visual entry 03).

**The 10% is what you click.** Spend the accent on the main button, one word in the headline and the light on the hero, and nowhere else. An example palette that holds the ratio: warm ivory #F3ECE9 for the 60, deep navy #23344E for the 30, coral orange #EC6745 for the 10.

Do:
- Large areas neutral, accent kept for actions
- One accent colour, used sparingly
- Support grey for borders and icons
- The accent on what you click: the main button, one headline word, the light on the hero

Avoid:
- Accent colour spread across large surfaces with no reason
- The light support grey used for body text

Variant: **Strict ratio versus a dark hero surface, two variants.** Variant A: strict 60-30-10, the accent only on actions and key elements. Use when: list, form and settings screens where the actions should be the only loud thing. Variant B: one dark hero surface well past 10% (for example a finance screen that puts the balance on a large black card, which strictly breaks the rule). Use when: one object is the subject of the screen, such as an account balance or a featured item, and everything else stays neutral. Both kept on purpose.

Variant: **What the 30% is, two variants.** Variant A: the 30% is a support grey for borders, icons and secondary shapes, and containers belong to the 60% neutral, as above. Use when: a neutral, mostly white product where the brand lives only in the accent. Variant B: the 30% is a lighter tone of the base hue, used as a surface layer on cards, navigation and containers (for example a pale blue-grey panel on a white page with a strong blue accent). Use when: the product should feel tinted by its brand throughout, and the tonal surface still keeps text on it at 4.5:1. Both kept on purpose.

Code (CSS):

```css
:root {
  --base:    #F7F7F5; /* 60%: backgrounds, surfaces, containers, large areas */
  --support: #A3A3A3; /* 30%: UI elements, icons, borders, secondary shapes (not body text, about 2.4:1) */
  --accent:  #0F0F0F; /* 10%: calls to action, important actions, links, key elements */
}
/* an example palette that holds the ratio; the 10% is what you click */
.warm { --base: #F3ECE9; /* 60: warm ivory */ --support: #23344E; /* 30: deep navy */ --accent: #EC6745; /* 10: coral orange, main button, one headline word, hero light */ }
```

## Visual Character: One Decision per Axis

Every generator has a default look, and a screen left on it reads as machine-made whatever this year’s default happens to be. Character comes from making one explicit decision on each of four axes, written down once (in the Project Design Contract, entry 32) and applied everywhere. This entry does not choose a style; it rules out not choosing. **Type: where does the contrast live?** Either high contrast (display type at 2.5 times the body size or more, a hard weight jump, or a second family) or deliberately low contrast for a dense expert tool; the comfortable middle is no decision. The one family versus two families choice is held as two variants in Typography as a System (entry 24). **Colour: what is the signature?** One signature colour, picked for the product’s temperament and used rarely enough to mean something: the primary action and the one thing that must be found. Its contrast is decided with it: label text on the signature clears 4.5:1, and the signature clears 3:1 against the surface behind it, or the lightness changes until it does. Neutrals are calibrated warm, cool or pure to match the temperament, never the framework’s default grey ramp, and status colours stay semantic.

**Space: what is the rhythm?** Dense and efficient or airy and editorial, chosen once and then applied everywhere, with compression inside groups and release between them; uniform gaps of about 16px everywhere are the tell of undecided space. **Finish: what is the separation language?** One primary way for surfaces to separate: borders, shadows or flat colour planes. All three on one screen means no decision was made. Finish also lives in consistent radii, optical alignment and real hover, focus and active states. Two checks before shipping. Strip the accent: the screen should still work in neutrals alone, because hierarchy is not colour’s job. Then the lineup test: would this screenshot be recognisable among ten generated screens for the same prompt? If not, walk the four axes and find the one still sitting on its default.

**Start from the product’s world.** Before the four axes, name three concrete things the product’s users handle, read or look at all day (a workshop: work orders, parts bins, service bays; payroll: ledgers, payslips, stamps). The family, the signature colour and one memorable element per screen come from those words, not from taste; everything around that one element stays quiet, and on a 1280px desktop the screen is composed (a header band, two columns, display-size type) rather than one narrow column on an empty page. **The font has to load.** Point at the line that loads each family: the project’s own font pipeline, a framework font loader, an installed font package, an @font-face with the file in the repo or, with none of those, a Google Fonts or Bunny Fonts link with preconnect and display=swap, always with a named fallback stack. A bare system stack is the operating system’s default, kept only when the project already uses it or the owner asks for it. In an existing project, read its font setup first and change it only when a new look was asked for. **Check it on a clean machine:** after wiring up a font, confirm it renders on a computer that does not have it installed, or with local fonts ruled out, and see the font file load in the network panel. **Monospace is for codes, IDs and keys only;** figures stay in the text face with tabular-nums.

**Colour on text, and the danger rule.** Any text in a colour clears 4.5:1 on what sits behind it: a word or a count in the signature, and a status tag’s text on its own tint. A signature that only reaches 3:1 is a fill, a dot or a rule, never text. The signature must not read as danger: red and orange-red (hue under about 30 degrees) mark failures and destructive actions in a work tool, so a signature in that range fills no primary button, and any signature keeps its hue at least 40 degrees away from the danger colour. **The drift check.** Generators fall into two default looks. The first is the system sans stack, monospace for figures and small labels, a warm off-white page (around #f6f5f2), 4px radii and a 1px border around every group; three of those five on one screen means it was not decided. The second appears once fonts load: the same few safe families on every product (IBM Plex Sans with Plex Mono, condensed headings, a soft display serif on every title) and a burnt orange signature (around #c2410c) a few degrees from the danger red. They are good faces, but reached for every time they become the new default, so pick from the product’s world first and then check against this list. **Read the result back from the code, not from memory:** list the sizes and weights used, point at each font-loading line, count the monospace uses, count where the signature appears (more than the primary action plus one thing to find is decoration), list the distinct gap values, count the separation devices, and search for framework palette names and raw hex values, because each hit is a default that slipped through. On a phone, headings and large figures stay around 28 to 32px under 640px, so a figure and its sign stay on one line.

**Name the default, then leave it.** Before building, write one line describing the screen any similar app would get (a white card grid, a blue primary button, a row of stat tiles across the top). Then change every part of the plan that matches that line. Compute every contrast ratio with a tool or the formula, never by eye, because a colour that looks readable often is not.

Do:
- One written decision per axis: type, colour, space, finish
- Label text on the signature at 4.5:1, the signature itself at 3:1 against its surface
- The screen still works with the accent stripped out
- A loading line for every font family, with a fallback stack
- The web font checked on a machine that does not have it installed
- Monospace only on codes, IDs and keys; figures in the text face with tabular-nums
- One line describing the screen any similar app would get, and every matching part of the plan changed
- Contrast ratios computed with a tool

Avoid:
- Borders, shadows and flat planes all separating surfaces on one screen
- Uniform 16px gaps everywhere
- A style adopted because it was the default, with no stated reason
- A red or orange-red signature filling the primary button
- Three of the five default-look tells on one screen
- Contrast judged by eye

Variant: **Red alerts versus a domain alert colour, two variants.** Variant A: red or orange-red marks failures, as above. Use when: the default, for any work tool. Variant B: an alert colour from the product’s own palette (a deep magenta, a strong amber). Use when: red already means something else in the product’s world. It stays 40 degrees of hue from the signature, clears 3:1 (4.5:1 as text) and always comes with an icon or a word (Failed, Low). Both kept on purpose.

Code (TEXT):

```
## Character
World:   recipe cards, kitchen timers, cast iron pans
Loads:   Google Fonts link, preconnect, display=swap; fallback Georgia, serif
Type:    high contrast; serif display at 2.6 times the sans body (food is editorial)
Colour:  saffron signature on Start cooking only; warm neutrals, kitchens are not grey
Space:   airy; 8px inside a meta group, 32px between sections
Finish:  flat warm planes, no borders, no shadows
```

## Project Design Contract

Generated screens drift: screen one uses one blue and 24px card padding, screen two a different blue and 16px, and screen three invents a third button style. Each is fine alone, and the set is incoherent. The fix is a written contract per project, a DESIGN.md at the project root that every new screen reads and obeys. **Extract before inventing:** if the project already encodes decisions (a Tailwind config or @theme block, :root custom properties, a theme or tokens file, or the variants of its most reused component), consolidate those into the contract, list the gaps, and decide only the gaps. **Every value carries its reason:** a token without a why is a preference, not a decision. The contract covers colour (surfaces, text, one accent used only for the primary action and key status, semantic status colours), type (family, scale, weights), spacing (base unit, scale, rhythm), shape and elevation (radii and the one separation language), motion (durations and easing), the component variants the project actually uses, and voice (tone, sentence case, verbs on buttons). A short honest file beats a padded template, and it never holds invented placeholder values.

**Enforcement is the point.** Every new screen pulls colour, type, spacing, radius, shadow and motion from the contract. A value outside it is either an extension (proposed, added to the contract with its reason, then used) or flagged and replaced with the closest token; it is never invented silently, because silent invention is how drift starts. New component variants are extensions too. The contract is versioned with the code and updated in the same commit as the change it blesses, and when a token changes, the screens it affects get listed. Precedence runs from the owner’s instruction, to the contract, to generic defaults. A one-off contradiction gets a one-line flag and is built; a run of them is a change of direction, so update the contract. No second screen gets built in a project that has neither a contract nor an explicit decision to go without one.

**A complete contract has seven sections with real values.** The product’s world in one line; typography, with how each family loads; colour tokens as hex values, with the accent and the destructive colour at least 40 degrees of hue apart; radii, with where each applies; spacing, its base unit and scale; states (hover, focus and disabled), each derived from the tokens; and status badges, each with its text colour, its tint and the contrast ratio written down (at least 4.5:1). No placeholder survives (no [choice], TODO or TBD), and “not measured” leaves a section incomplete. **Settle it before any screen, in one of three states.** Absent: write it, and the tokens in the code; when nobody can answer the questions (an unattended run, a handed-over task), decide from the product’s world and mark the header (assumed, confirm before shipping). Incomplete: add the missing sections and nothing else. Every value, family and colour already there stays exactly as written, because it is the brand, and a missing value is derived from an existing token (color-mix(in oklab, var(--danger) 12%, white)) rather than a new hex, with the contract line naming the token it comes from. Complete: follow it.

**The design-system interview.** When the contract has to be written from scratch and someone can answer, ask at most five questions, all in one message: what the product is, who uses it and the mood it should carry, the character direction, the fixed constraints (brand colours, fonts, platform), and what someone should feel in the first three seconds. If an intent brief already exists, reuse its answers and never ask the same thing twice.

**Make every later session read it.** After writing DESIGN.md, ask once whether to add a short pointer to it in the project’s CLAUDE.md or AGENTS.md, and with a yes, add it, so every later session reads the contract before building a screen.

Do:
- Existing tokens extracted into the contract before anything new is invented
- A one-line reason beside every value
- The contract updated in the same commit as the change it blesses
- All seven sections filled, with each status contrast ratio written
- At most five interview questions, in one message, reusing the intent brief
- A short pointer to DESIGN.md in CLAUDE.md or AGENTS.md, after asking once

Avoid:
- A silently invented colour, size or radius outside the contract
- A contract filled from a template with made-up values
- A second screen built with no contract and no decision to skip one
- Rewriting a value already in the contract while filling a gap
- Re-asking a question the intent brief already answered

Code (MARKDOWN):

```
# Design System: habit tracker
Character: warm and encouraging, progress never guilt
## Color
- --bg #FAF7F2 / --surface #FFFFFF: warm off-white; clinical white reads like a report card
- --accent #E8763A: only on Done today and streak highlights
## Spacing
- base 4px; scale 4/8/12/20/32; airy, one habit at a time
## States
- hover: accent at 90%; focus: 2px ring in --accent; disabled: 40% opacity
## Status and badges
- done: #166534 on #DCFCE7, 6.5:1
- missed: #9A3412 on #FFEDD5, 6.4:1
<!-- off-system: a red streak banner was requested; extension proposed: --warning #D97742 -->
```

## Stacked Priority Order

When a layout collapses to one column, the order it stacks in is a decision, not whatever the source happens to say. The summary comes first, so the person knows where they stand. Whatever needs action comes right after it: the overdue invoice, the approval waiting, the form to finish. Supporting panels (history, tips, related items, charts) move below. On a desktop a side panel can sit beside the main content, but on a phone it never pushes the thing that needs doing below the fold.

Write the DOM in priority order and let the wide layout place things with grid areas, rather than writing the DOM in desktop order and fixing the phone with the CSS `order` property. The keyboard and screen readers follow the DOM, not the visual order, so a CSS reorder leaves them reaching the supporting panel before the action (Focus States, Navigation entry 01).

Do:
- Summary first, then what needs action, then supporting panels
- The DOM written in priority order, with grid areas placing it on wide screens

Avoid:
- A panel of tips stacked above the item that needs action
- The CSS `order` property used to fix the phone stacking

Code (CSS):

```css
/* DOM order is priority order: summary, action, support */
.page { display: grid; gap: 16px; grid-template-areas: "summary" "action" "support"; }
.summary { grid-area: summary; } .action { grid-area: action; } .support { grid-area: support; }
@media (min-width: 900px) {
  .page { grid-template-columns: minmax(0, 2fr) minmax(0, 1fr);
          grid-template-areas: "summary support" "action support"; } /* support beside, never above */
}
```

## Avatar

An avatar always shows something. It falls back in a fixed order: the photo, then initials, then a generic person icon, and an image error handler swaps in the initials the moment a photo fails. A broken image icon or an empty grey circle is never a state.

**Initials and colour.** Two initials by default (Ada Lovelace becomes AL), one at the smallest size. The background comes from a hash of the name into a fixed palette of six to eight colours, so the same person gets the same colour everywhere, and every palette colour is checked at 4.5:1 against the initials. **Three sizes:** for example 24px in dense lists, 32px in tables and menus, 40px in headers and profile cards.

**Groups.** Grouped avatars overlap by about a quarter of their width, each with a 2px ring in the surface colour. Show three to five, then a neutral +N circle, with the full list on hover or tap. **Presence** on an avatar is a coloured ring around it (2px, after a 2px gap), not a badge stuck to its corner; the small status dot stays the convention for lists without an avatar. Presence also needs a text equivalent (Online, Away) in the accessible name.

**Check what a ring already means.** In products where a coloured ring around an avatar means the person has a new story or update, a presence ring will be read that way. There, show presence with the small status dot instead.

Do:
- Photo, then initials, then a generic icon
- Initials colour hashed from the name, from a contrast-checked palette
- Groups capped at three to five, with +N for the rest
- Presence as a dot where a ring already means something else

Avoid:
- A broken image icon, or a colour that changes on every render
- A separate presence badge on the avatar’s corner

Code (CSS):

```css
.avatar { --size: 32px; width: var(--size); height: var(--size); border-radius: 9999px; display: grid; place-items: center; overflow: hidden; }
.avatar-sm { --size: 24px; } .avatar-lg { --size: 40px; } /* three sizes only */
.avatar.online { box-shadow: 0 0 0 2px var(--surface), 0 0 0 4px var(--good); } /* gap, then presence ring */
.avatar-group .avatar { box-shadow: 0 0 0 2px var(--surface); }
.avatar-group .avatar + .avatar { margin-left: calc(var(--size) * -.25); } /* overlap by a quarter */
```

## CSS Layout Foundations

Four habits keep layout CSS short and predictable. **Percentage heights need a parent height:** `height: 100%` only works when the parent has an explicit height; inside a parent sized by its content it does nothing. Instead of chaining it through every wrapper, let a flex or grid parent stretch its children (both stretch by default), or use `min-height` so the box can still grow.

**Space siblings with gap:** `gap` on the flex or grid parent, not a margin on every child. Gap only appears between items, so nothing needs cancelling on the last one. **Centre with alignment:** a grid parent with `place-items: center`. Absolute positioning plus `translate(-50%, -50%)` takes the element out of the flow and can land on half pixels; keep it for overlays that genuinely float. **Control specificity with cascade layers:** declare `@layer reset, base, components, utilities;` once, and a later layer wins whatever the selectors, so nobody escalates to chained classes, IDs or `!important`.

Do:
- `gap` on the parent; `place-items: center` to centre
- One `@layer` order at the top of the stylesheet

Avoid:
- `height: 100%` inside a parent with no set height
- Longer selectors or `!important` to win a specificity fight

Code (CSS):

```css
.cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; } /* children stretch; gap, not margins */
.empty-state { display: grid; place-items: center; min-height: 240px; }
@layer reset, base, components, utilities;
@layer utilities { .mt-0 { margin-top: 0; } } /* beats any components selector */
```

## Optical Corrections

Mathematically centred is not the same as looking centred. The eye judges the visual weight of a shape, not its bounding box, so a few elements need a small deliberate nudge away from the numbers.

**Asymmetric glyphs move toward their point.** A play triangle centred by its box looks pushed to the left, because most of its weight sits on the flat side. Shift it toward its point by roughly one sixth of its width (about 2px for a 12px triangle) inside its circle or button. The same applies to any arrow or chevron with a heavy side.

**Icons align to the label’s cap height.** An icon centred on the text’s line box sits slightly low, because the line box includes space for descenders. Centre the icon on the cap height of the label instead, and make the nudge in em units (for example `translateY(-0.08em)`) so it stays correct when the text size changes.

**Single-line labels sit slightly high.** A one-line button label centred by its line box looks low for the same reason. Trim the text box to the cap height and alphabetic baseline with `text-box: trim-both cap alphabetic` where it is supported, or nudge the label up 1 to 2px (about 0.06em) where it is not. Light text on a dark ground is the other common correction; it reads heavier, so it drops about one weight step (see Dark Mode). Round shapes overshooting square ones is in Icon Design Rules.

Do:
- A play triangle moved about one sixth of its width toward its point
- Icon nudges in em units, so they scale with the text

Avoid:
- Trusting the bounding box for a triangle, arrow or chevron

Code (CSS):

```css
.play-btn svg { transform: translateX(16.7%); } /* about one sixth of the glyph's width, toward the point */

.btn { display: inline-flex; align-items: center; gap: 0.5em; }
.btn .icon { transform: translateY(-0.08em); } /* onto the cap height, scales with the text */

.btn-label { text-box: trim-both cap alphabetic; } /* trims the line box to the letters */
```

## Glass Panels

A glass panel is four properties together: a semi-transparent fill (white at about 10 to 20% over dark content, 60 to 70% over light), a backdrop blur of about 12 to 20px, a faint light border (white at about 25%), and a soft shadow. It only reads over colourful or detailed content such as a photo, a gradient mesh or a map; over a plain white page there is nothing to blur and it just looks grey.

**Check contrast over the busiest spot.** Text on glass takes its contrast from whatever is behind it, so measure it over the busiest, lightest part of the background the panel can cover, and raise the fill opacity until it passes 4.5:1 everywhere. **Blur is expensive:** `backdrop-filter` repaints everything behind the panel whenever anything under it moves, so use it on one or two panels per screen (a navigation bar, one overlay), never on every card in a scrolling list or on an animating layer, and keep a solid fallback.

Do:
- Fill, blur, light border and soft shadow together, over colourful content
- One or two glass panels per screen

Avoid:
- Glass on a plain white page
- Backdrop blur on every card in a list

Code (CSS):

```css
.glass {
  background: rgb(255 255 255 / .14);
  backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgb(255 255 255 / .25);
  box-shadow: 0 8px 32px rgb(0 0 0 / .18);
}
@media (prefers-reduced-transparency: reduce) { .glass { background: rgb(30 30 40 / .92); backdrop-filter: none; } }
```

## Less Noise on a Busy Screen

A busy screen gets calmer by taking things away, not by adding more styling. Four cuts. **1. The background decides how much chrome you need:** on grey, every block needs a card and a shadow to stand out; on white, space does that job, so only the main block (the balance, for example) keeps a light card and everything else sits on the page. **2. No box inside a box:** a frame inside a card adds one more edge and no new meaning; remove it and let the text sit under the main figure. **3. Lines separate rows, nothing else:** a section title does not need a line under it, and a row divider starts at the text, not under the icons, so the icons stay in one clean column. **4. No carousel dots when the next card peeks:** a card already showing its edge at the side says “swipe”, so dots under it say it twice.

This works with Card Treatment System (entry 28), which picks a card’s border or shadow from its background and never nests cards.

Do:
- A white page where space does the grouping
- One light card, on the main block only
- Supporting text straight under the main figure, no inner frame
- Row dividers that start at the text column
- The next card peeking out instead of dots

Avoid:
- A grey page with a card and a shadow on every block
- A framed box inside a card
- A line under a section title
- Full-width dividers that run under the icons
- Carousel dots under a card that already peeks

Code (CSS):

```css
.screen { background: var(--surface); } /* white: space groups the blocks, not cards */
.balance { background: var(--surface-2); border-radius: 16px; padding: 20px; } /* the one light card */
.balance .sub { margin-top: 4px; color: var(--ink-muted); } /* no inner frame: the text sits under the figure */
.section-title { border: 0; margin: 24px 0 8px; } /* a title needs no line */
.row { display: grid; grid-template-columns: 40px 1fr; }
.row + .row .row-text { border-top: 1px solid var(--border); } /* the divider starts at the text; icons stay one column */
.carousel { display: flex; gap: 12px; overflow-x: auto; scroll-snap-type: x mandatory; }
.carousel > * { flex: 0 0 85%; scroll-snap-align: start; } /* the next card peeks, so no dots */
```
