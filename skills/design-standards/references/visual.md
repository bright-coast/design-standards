> A Bright Coast AI skill, made by Rob Lee. Part of the Claude Power Setup Guide: github.com/bright-coast/claude-power-setup-guide
> Copyright 2026 Bright Coast AI. For Bright Coast AI clients and people Bright Coast AI has given the guide to, not for copying or redistribution: see LICENSE at github.com/bright-coast/claude-power-setup-guide.

# Visual

The layer people notice consciously least and judge most: colour, depth, spacing, and the perceptual rules underneath them.

25 patterns. Use when: colour, type, spacing, depth, icons and layout.

## Border Radius

Nested corners follow real math: a card with 12px radius and 8px padding needs an inner element radius of exactly 4px (outer minus padding), or the inner corner reads as visually off even though nobody can say why. Pick one radius scale for the whole system (4/8/12/16, or similar) instead of eyeballing a number per component, and scale the radius up with element size; a tiny badge and a full page card at the same 8px radius look proportionally wrong on the smaller one. Radius is also a brand lever: sharp corners read technical/serious, generous rounding reads friendly/approachable, so pick deliberately.

The full checklist has six rules. **Nested:** inner radius equals outer radius minus padding (a 12px card with 8px padding gets a 4px inner corner), so nested corners share one centre; otherwise the inner corner bulges. **Scale:** size sets the radius (for example small 4, medium 8, large 16, which are sample values), not 8px on everything; a chip and a modal do not share a corner. **Pill:** full radius is a shape, not a number, so use 9999px only on a single-line element such as a chip, avatar or toggle, never on a multi-line card. **Edges:** an element that touches an edge has no corner there, so a bottom sheet flush to the screen edge gets its top corners rounded and its bottom corners at zero. **Ring:** a selection ring drawn as its own box sits outside the element, so ring radius equals the inner radius plus the gap (8 inside and a 2px gap gives 10 out); if the corners pinch, flip the formula. **Images:** an edge-to-edge image in a rounded card is clipped by the card (`overflow: hidden`) so square image corners do not poke through; for an inset image, subtract the padding and apply the same nested rule.

Do:
- Scale radius with element size
- Focus ring radius matches the element’s own radius
- Image corners clipped to their container’s radius, not left square
- Pill radius (9999px) only on single-line shapes such as a chip, avatar or toggle
- No rounded corner where an element touches an edge: a flush bottom sheet keeps only its top corners
- A selection ring drawn as its own box gets the element’s radius plus the gap (8 inside, 10 out for a 2px gap)

Avoid:
- Random per-component radius values
- 9999px on a multi-line card

Code (CSS):

```css
:root {
  --radius-sm: 4px;  --radius-md: 8px;  --radius-lg: 12px;  --radius-xl: 16px;
}
.badge  { border-radius: var(--radius-sm); }
.button { border-radius: var(--radius-md); }
.card   { border-radius: var(--radius-lg); padding: 16px; }
/* nested corner math: outer radius − padding = correct inner radius */
.card .card-inner { border-radius: calc(var(--radius-lg) - 16px); } /* = -4px → clamp to 0 */
.card .card-inner-tight { padding: 8px; border-radius: calc(var(--radius-lg) - 8px); } /* = 4px, correct */

.chip, .avatar, .toggle { border-radius: 9999px; } /* pill: single-line shapes only, never a multi-line card */
.sheet { border-radius: var(--radius-xl) var(--radius-xl) 0 0; } /* flush to the screen edge: no corner where it touches */
.selectable { padding: 2px; } /* the gap between the element and its ring */
.selectable .ring { border-radius: calc(var(--radius-md) + 2px); } /* ring = inner radius (8) + gap (2) = 10; if the corners pinch, flip the formula */
.card { overflow: hidden; } /* edge-to-edge image: the card clips it, so square image corners never poke through */
.card .inset-img { margin: 8px; border-radius: calc(var(--radius-lg) - 8px); } /* inset image: subtract the padding, same nested rule */
```

## Charts That Lie

Every bar chart’s y-axis starts at zero. Truncating it to, say, 90-100 turns a genuinely small 2% change into a bar that looks three times taller than its neighbour, which is a factual misrepresentation even if every number on the chart is technically correct. Match the chart type to the actual question being asked (trend over time is a line, comparison across categories is a bar, part-of-whole is rarely a pie), and title the chart with the takeaway itself, not the bare metric name. Skip gridlines, 3D extrusion, or decorative elements that encode no real data; they add visual noise without adding information.

Do:
- Chart type matched to the actual question

Avoid:
- Gridlines/3D that encode no real data

Code (JS: chart config):

```js
const chartConfig = {
  type: 'bar',
  scales: { y: { beginAtZero: true } }, // non-negotiable, truncation misrepresents the data
  plugins: {
    title: { text: 'Signups grew 34% after the pricing change' }, // the takeaway, not "Signups"
    legend: { display: false }, // only shown when there's more than one series
  },
  elements: { bar: { borderWidth: 0 } }, // no 3D bevel, no decorative gridlines
};
```

## Color Accessibility

Contrast is always a ratio between a colour and whatever sits directly behind it; there’s no such thing as an accessible colour in isolation. Check every real foreground/background pair against WCAG (4.5:1 for body text, 3:1 for large text and UI components), and give every colour-coded cue a second signal (an icon, a pattern, a text label) so a red/green status distinction doesn’t collapse entirely for a colour-blind user. The usual failure spot is a “decorative” muted grey caption that nobody thought to check, not the obvious high-stakes error text.

Do:
- Second signal (icon/pattern) with every colour cue

Avoid:
- Red-vs-green as the only signal

Code (JS):

```js
function contrastRatio(fg, bg) { /* same relative-luminance formula as Color Picker UX above */ }

const pairs = [
  { name: 'caption grey on card', fg: '#9AA3AF', bg: '#FFFFFF' }, // the usual missed spot
  { name: 'error text', fg: '#C0392B', bg: '#FFFFFF' },
];
pairs.forEach(p => {
  const ratio = contrastRatio(p.fg, p.bg);
  console.log(`${p.name}: ${ratio.toFixed(2)}:1, ${ratio >= 4.5 ? 'PASS' : 'FAIL'} AA body`);
});
// status dot: colour is never the only signal
// <span class="status status-error">⚠ Failed</span>, icon + text label alongside colour
```

## Dark Mode

Dark mode is not black mode. Build the base surface on a near-black like `#121212`, never pure `#000`, which creates harsh halation against any bright element and looks cheap on OLED. Desaturate accent colours by roughly 20% in dark mode, since a saturated colour that looks right on white can vibrate uncomfortably against near-black. Use layered, progressively lighter surfaces to signal elevation instead of shadows (which barely read on a dark ground), and build text hierarchy through opacity tiers on a single white rather than several different hardcoded greys.

Six rules, in full. **Near black, not black:** pure black saves OLED battery but kills depth, since nothing can sit lower than black, so start near black (for example a page at #0B0D10, with the card and chip lighter). **Lightness is elevation:** shadows die on dark, so raise surfaces by making them lighter, with page, card, menu and modal each one step lighter. **Three tiers of white:** never pure white text; primary at about 87%, secondary at about 60% and disabled at about 38%, one colour with three alphas. **Calm the accent:** a saturated brand blue glows past its edges on dark, so keep the hue but lighten and desaturate it. **Alpha hairlines:** edges need a 1px line of white at about 8% alpha rather than a fixed grey, because it adapts as the surface gets lighter. **Dim the photos:** bright images pull the eye on a dim page, so lower their brightness to about 90%, and give illustrations a redrawn dark variant rather than a filter.

Do:
- Layered surfaces signal elevation
- Text tiers on one white: about 87% primary, 60% secondary, 38% disabled
- Edges as a 1px white line at about 8% alpha, not a fixed grey
- Photos dimmed to about 90% brightness; illustrations redrawn as a dark variant, not filtered

Avoid:
- Pure white body text glaring on dark
- A saturated brand colour left unchanged on dark, glowing past its edges

Note: **Real trade-off, not a free upgrade:** near-black elevation surfaces cost more battery on OLED than true black, and several of the lighter "elevated" surface tones can quietly fail WCAG contrast if not checked; a low-contrast button on a near-black surface is the classic miss. Run every elevated surface + text pair through the Color Accessibility check above before shipping; don't assume "near-black" is automatically accessible just because it isn't pure black. Two fair objections: saving battery can matter more than depth, and most of these techniques lower contrast; and an accent desaturated too far looks disabled. Treat the 87, 60 and 38 percent tiers, the 8% alpha hairline and the 90% photo brightness as sensible defaults to check, not rules, and keep the contrast check above.

Code (CSS):

```css
:root[data-theme="dark"] {
  --bg: #121212; /* near-black, never pure #000 */
  --surface-1: #1E1E1E; --surface-2: #262626; --surface-3: #2E2E2E; /* elevation via lightness, not shadow */
  --text-high: rgb(255 255 255 / 0.87); /* opacity tiers, not separate hex greys */
  --text-med:  rgb(255 255 255 / 0.60);
  --text-low:  rgb(255 255 255 / 0.38);
  --accent: oklch(70% 0.12 175); /* ~20% less saturated than the light-mode accent */
  --border: rgb(255 255 255 / 0.08); /* alpha hairline: adapts as the surface gets lighter, unlike a fixed grey */
}
img, video { filter: brightness(0.9); } /* dim photos to about 90%; give illustrations a redrawn dark variant instead of a filter */
```

## Depth Layers

Three CSS levers create real perceived depth without a visual redesign: layered box-shadows (a tight contact shadow plus a soft ambient one), a subtle parallax speed differential between background and foreground on scroll, and a small hover z-lift. Stack a tight shadow with a wider ambient one rather than one flat blur value; that combination is what makes an element read as physically raised. Keep hover lifts subtle: a few pixels of translateY and roughly 3% scale reads as responsive; push either further and it starts to feel gimmicky rather than tactile.

Do:
- Stack tight + mid + ambient shadows

Avoid:
- Parallax/scale pushed far enough to distract

Code (CSS):

```css
.elevated {
  box-shadow:
    0 1px 2px rgb(0 0 0 / .08),   /* tight contact shadow */
    0 4px 8px rgb(0 0 0 / .06),   /* mid */
    0 12px 24px rgb(0 0 0 / .05); /* soft ambient */
  transition: transform 200ms ease, box-shadow 200ms ease;
}
.elevated:hover {
  transform: translateY(-2px) scale(1.03); /* subtle: a few px, ~3% */
  box-shadow: 0 2px 4px rgb(0 0 0 / .1), 0 8px 16px rgb(0 0 0 / .08), 0 20px 32px rgb(0 0 0 / .06);
}
.parallax-bg { transform: translateY(calc(var(--scroll-y) * 0.3px)); } /* moves slower than foreground */
```

## Design System Kit

Semantic tokens like `--brand` or `--error` survive a rebrand or a dark-mode pass because the name describes the role, not the literal colour behind it; hardcoded hex scattered across components has to be found and changed one at a time. Build a numbered colour scale (50 through 900) for every hue rather than a handful of arbitrary shades, and a 4px spacing scale so every gap in the product traces back to one shared rhythm. Define components as combinations of variant/size/state rather than one-off classes per screen.

Do:
- Numbered colour scale + 4px spacing scale

Avoid:
- Hardcoded hex and eyeballed gaps

Code (CSS):

```css
:root {
  --blue-50: #EFF2FB; --blue-500: #3B5BDB; --blue-900: #0F1B3E; /* numbered scale, not one-off hex */
  --space-1: 4px; --space-2: 8px; --space-3: 12px; --space-4: 16px; --space-6: 24px; /* 4px rhythm */
  --brand: var(--blue-500); --error: #C0392B; --success: #27AE60; /* semantic layer on top */
}
/* component = variant + size + state, not a new class per screen */
.btn[data-variant="primary"][data-size="md"] { background: var(--brand); padding: var(--space-2) var(--space-4); }
.btn[data-variant="primary"]:disabled { background: var(--blue-50); color: var(--blue-500); }
```

## Design Tokens

Name tokens by their role in the interface (`color-primary`), never by their literal value (`color-blue-500`). The moment brand blue becomes brand purple, a value-named token is now lying about what colour it holds. Layer tokens three deep: primitive (the raw scale), semantic (the role, referencing a primitive), and component (referencing the semantic layer). One primitive edit then cascades everywhere it’s referenced, and swapping to dark mode becomes swapping which primitive a semantic token points to, not a rewrite of every component.

Do:
- One primitive edit cascades everywhere

Avoid:
- Baking literal values into token names

Code (CSS):

```css
/* layer 1: primitive, the raw scale, never referenced directly by components */
:root { --navy-700: #1F2933; --blue-500: #3B5BDB; }

/* layer 2: semantic, named by ROLE, references a primitive */
:root { --color-primary: var(--navy-700); --color-accent: var(--blue-500); }

/* layer 3: component, references semantic only, never a primitive or raw hex */
.button-primary { background: var(--color-accent); color: white; }
.heading { color: var(--color-primary); }

/* rebrand navy → charcoal: edit ONE primitive, every semantic + component cascades */
```

## Gestalt Laws

Similarity, proximity, continuity, figure-ground, and common region are the five Gestalt principles that describe how the brain groups visual elements automatically, before any conscious analysis. Shared colour, shape, or size reads as “these belong together” instantly, so use it deliberately to group related items without needing a label. A shared border or background can group even elements that are physically distant from each other (common region), which is a stronger grouping signal than proximity alone. Scattering visually related items at random locations fights the brain’s automatic grouping instead of using it.

Do:
- Shared colour/shape/size to group related items

Avoid:
- Scattering related items at random

Code (CSS):

```css
/* common region: a shared border groups items even when they're not adjacent */
.related-group {
  border: 1px solid var(--border); border-radius: 8px; padding: 12px;
}
/* similarity: same accent colour signals "these are the same kind of thing" */
.tag-billing { background: var(--blue-50); color: var(--blue-700); }
.tag-billing-related-item { background: var(--blue-50); color: var(--blue-700); } /* deliberately matched */
/* proximity: gap inside a group is smaller than the gap between groups (see Proximity Rule below) */
```

## Golden Ratio

A 1.618 multiplier ties spacing and type scales into a single, self-consistent visual rhythm: each step is 1.618× the previous one, so a 16px body size implies a ~26px subheading and a ~42px heading without guessing. For a two-column layout, a 62/38 split favouring the primary content reads as more deliberate than an even 50/50, which has no clear hierarchy. Round every derived result to a clean, usable pixel value rather than keeping the raw irrational multiplier, and don’t apply it so rigidly that it fights real content, like a hero image that genuinely needs a 70/30 split.

Do:
- 62/38 split favouring primary content

Avoid:
- Applying it so rigidly it fights real content

Note: **Pick one ratio.** Typography as a System steps its type sizes by 1.25 (the major third) rather than 1.618. From a 16px base, 1.25 gives roughly 16, 20 and 25px in two steps, while 1.618 gives roughly 16, 26 and 42px. Pick one ratio per product and stay on it.

Code (JS):

```js
const PHI = 1.618;
function typeScale(base) {
  return {
    caption: Math.round(base / PHI),        // ~10px
    body: base,                             // 16px
    subheading: Math.round(base * PHI),     // ~26px
    heading: Math.round(base * PHI * PHI),  // ~42px, rounded to a clean pixel
  };
}
/* layout: 62/38, not a rigid 50/50 */
.two-col { display: grid; grid-template-columns: 61.8fr 38.2fr; gap: 24px; }
```

## Gradient Design

Neighbouring hues on the colour wheel blend cleanly into each other, while hues from opposite sides create a muddy grey dead zone in the middle of the transition. A blue-to-orange gradient always passes through a flat grey band, an indigo-to-blue gradient never does. Keep lightness moving in one direction only across the gradient; a value that dips and rises again creates a visible, unintentional banding seam. A subtle grain or noise overlay on top of a large gradient hides colour-banding artifacts on cheaper screens, and body text should never sit on a gradient’s unpredictable mid-transition zone where contrast is impossible to guarantee.

Do:
- Keep lightness moving one direction only

Avoid:
- Body text on a gradient’s mid-transition

Code (CSS):

```css
/* analogous hues (indigo → blue) blend clean; lightness moves one direction only */
.gradient-clean { background: linear-gradient(135deg, #3B5BDB 0%, #3A7CA5 100%); }

/* grain overlay hides banding on cheap/compressed screens */
.gradient-clean::after {
  content: ''; position: absolute; inset: 0; opacity: .04; mix-blend-mode: overlay;
  background-image: url("data:image/svg+xml,..."); /* fractal noise SVG */
}
/* text never sits on the unpredictable mid-transition, pin it to the darker anchor end */
.gradient-clean .headline { color: white; text-shadow: 0 1px 3px rgb(0 0 0 / .3); }
```

## Grid System

A 12-column grid maps almost any layout because 12 divides cleanly into halves, thirds, and quarters, giving enough flexibility without infinite arbitrary choices. Gutter width sets the emotional register of a layout: tight gutters read technical and dense, wide gutters read editorial and calm. Collapse the column count at each breakpoint (12 on desktop down to 6, then 4, then a single column on mobile) rather than shrinking 12 narrow columns onto a phone screen. Only break the grid deliberately once it’s clearly established as the norm; an occasional full-bleed image is a strong device precisely because everything else respects the grid.

A layout also has to hold still when a scrollbar appears. When content grows past its container, a classic scrollbar takes a few pixels of width and the content nudges sideways. Put `scrollbar-gutter: stable` on the scrolling element and the scrollbar’s space is reserved from the start, so nothing shifts when it appears. For a centred layout use `scrollbar-gutter: stable both-edges`, which reserves the gutter on both sides so the content stays symmetrical (“for perfect centering”). The caveat is that the gutter is a placeholder: with plain `stable` the left and right spacing can look unequal, which is what `both-edges` addresses. It matters mainly with classic, always-visible scrollbars (Windows and Linux); on macOS with overlay scrollbars there is nothing to reserve, and the reserved space is visible as an empty strip when there is no scrollbar. It is supported in current Chrome, Edge and Firefox, with Safari support arriving in recent versions; browser support was not re-verified on this pass, so check the current support table before relying on it in a Safari-first product.

Do:
- Collapse columns per breakpoint (12→6→4→1)
- `scrollbar-gutter: stable` on any scrolling element, so nothing shifts when a scrollbar appears
- `scrollbar-gutter: stable both-edges` when the layout is centred

Avoid:
- Breaking the grid before establishing it
- A scrolling panel with no reserved gutter, so its content nudges sideways the moment a scrollbar appears

Code (CSS):

```css
.grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 24px; /* editorial = wide gutter; drop to 12-16px for a dense/technical feel */
}
.col-span-8 { grid-column: span 8; }
.col-span-4 { grid-column: span 4; }

@media (max-width: 1024px) { .grid { grid-template-columns: repeat(6, 1fr); } }
@media (max-width: 768px)  { .grid { grid-template-columns: repeat(4, 1fr); } }
@media (max-width: 480px)  { .grid { grid-template-columns: 1fr; } } /* single column, not shrunk 12-col */

.full-bleed { grid-column: 1 / -1; } /* deliberate break, reads as a device because the grid is otherwise respected */

/* scrolling element: reserve the scrollbar's space from the start, so nothing shifts when it appears */
.scroll-container {
  overflow-y: auto;
  scrollbar-gutter: stable;
}

/* second version, for centred layouts: gutter reserved on both sides, content stays symmetrical */
.scroll-container {
  overflow-y: auto;
  scrollbar-gutter: stable both-edges;
}
```

## Icon Design Rules

A round or organic icon shape needs to sit slightly larger than a square one to read as the same optical size. This is the same overshoot correction typography uses for round letterforms like O against flat ones like H. Snap every icon to a fixed grid (typically 24px) with one consistent stroke weight across the whole set, and give every icon a fixed bounding box even as the internal shape varies, so a row of mixed icons stays visually aligned. Mixing filled and outline styles within the same icon set at random reads as an inconsistent, unfinished system.

Do:
- Snap to a fixed grid, one stroke weight

Avoid:
- Mixing fill and outline styles at random

Code (CSS):

```css
.icon {
  width: 24px; height: 24px; /* fixed bounding box for every icon in the set */
  stroke-width: 1.5px; /* one consistent stroke weight, never mixed per-icon */
}

/* round/organic icon shapes overshoot the grid slightly to read as the same size */
.icon-circle { transform: scale(1.06); } /* optical size-match against square icons */
/* pick ONE style system-wide: filled OR outline, never both mixed in one set */
```

## Perfect Card

Padding is the single biggest tell between a card that reads as expensive and one that reads as cheap. Generous internal padding (20-24px) signals confidence and craft, while cramped padding (8px, content pressed against the edges) reads as an afterthought regardless of what’s inside. Pair it with real type hierarchy (a genuinely bold title, a muted, smaller body line) and a two-shadow stack plus a subtle 1px border for definition. Near-zero radius combined with cramped padding is the classic “cheap card” signature to avoid.

Do:
- Real type hierarchy (bold title, muted body)

Avoid:
- Cramped padding, near-zero radius

Code (CSS):

```css
.card {
  padding: 24px; /* generous, the biggest single tell of quality */
  border-radius: 12px;
  border: 1px solid var(--border-subtle);
  box-shadow: 0 1px 2px rgb(0 0 0 / .06), 0 8px 20px rgb(0 0 0 / .04); /* two-shadow stack */
  background: var(--surface);
}
.card h3 { font-weight: 700; font-size: 1.05rem; margin-bottom: 4px; } /* real hierarchy */
.card p  { color: var(--text-muted); font-size: 0.9rem; line-height: 1.5; }
```

## Proximity Rule

Spacing alone is enough to group a UI without a single border or background colour. The trick is simply making the gap within a related group of elements noticeably smaller than the gap between separate groups. A label sitting 4px above its input and 24px above the next field group reads as belonging to that field, unambiguously, purely from the numbers. Equal spacing applied everywhere erases this signal entirely and forces someone to read labels carefully to figure out which field a stray line of helper text actually belongs to. Reach for the grouping signals in order: proximity first, since it’s free and the strongest of the three; similarity second, matching colour/shape/size to imply the same category; a visible divider only once proximity and similarity together still aren’t enough. A divider every 2-3 items is over-using the last resort, and nested cards inside cards is the sign to stop and regroup with spacing instead.

Do:
- Tight related fields, wider section breaks
- Proximity, then similarity, then a divider, in that order

Avoid:
- Equal spacing everywhere, erasing hierarchy
- Cards nested inside cards instead of just regrouping with space

Code (CSS):

```css
.form-section { display: flex; flex-direction: column; gap: 24px; } /* between groups: wide */
.field-group { display: flex; flex-direction: column; gap: 4px; }    /* within a group: tight */
.field-group label { font-size: 13px; }
.field-group .helper-text { font-size: 12px; color: var(--text-muted); margin-top: 2px; } /* tightest, clearly this field's */
```

## Shadow Elevation

Real depth comes from stacking multiple shadow layers, not one blur value scaled up for “more elevation”. A genuinely floating element has a tight, dark contact shadow close to its edge, a softer mid-range shadow, and a very soft, wide ambient shadow, all three layered together. Tinting the shadow’s colour toward the brand accent instead of pure black adds a subtle glow that feels considered rather than generic. Reserve the strongest elevation tier for what actually matters most on screen (an open modal, a dragged card) rather than applying it uniformly and flattening the whole hierarchy.

Do:
- Tint the glow to brand accent

Avoid:
- One flat drop shadow used everywhere

Code (CSS):

```css
:root {
  --elevation-1: 0 1px 2px rgb(0 0 0 / .08);
  --elevation-2: 0 1px 2px rgb(0 0 0 / .06), 0 4px 8px rgb(0 0 0 / .05);
  --elevation-3: 0 2px 4px rgb(0 0 0 / .06), 0 8px 16px rgb(0 0 0 / .05), 0 20px 32px rgb(0 0 0 / .04);
  --elevation-glow: 0 8px 24px rgba(59, 91, 219, 0.25); /* tinted to brand accent, not black */
}
.card { box-shadow: var(--elevation-1); } /* resting */
.modal { box-shadow: var(--elevation-3); } /* strongest tier reserved for what matters most */
.card.dragging { box-shadow: var(--elevation-3), var(--elevation-glow); }
```

## Visual Hierarchy

Size, colour, contrast, whitespace, and font weight all stack together to create exactly one clear focal point on a given screen. Hierarchy is what tells someone’s eye where to land first without them having to think about it. Spend the single accent colour on the one truly key action per screen; a screen with five differently-coloured buttons has no hierarchy at all, just noise. Colour carries meaning, not rank; the ranking itself comes from size, weight, and position working together. Whitespace itself is an importance signal: the element with the most breathing room around it reads as the most important one on the page, independent of its own size. The numbers make the rule testable rather than a matter of taste. Adjacent heading levels need at least a 1.25× size jump between them, and a primary call-to-action needs to stand at least 1.5× the height of body text, or the size difference doesn't actually register. Weight carries its own tier: 600 to 700 for a primary heading, 500 to 600 for a secondary one, 400 for body copy, and 400 at 60 to 70% opacity for captions and meta text, never colour alone doing that job. Spacing scales with the hierarchy it separates: 48 to 64px between major sections, 24 to 32px between subsections, 8 to 16px within one group, and a heading always carries more space above it than below, which is what visually ties it to the content that follows rather than the content it just left. A genuine test for any screen: squint at it, or blur it, and check whether the one thing that matters most is still obviously the one thing that matters most.

Do:
- Spend one accent colour on the one key action
- At least 1.25× between heading levels, 1.5× for a primary CTA over body text
- More space above a heading than below it

Avoid:
- Colouring every element differently
- Three equal-weight primary buttons, or a sidebar with 15+ items at one visual level
- All-caps or italic body text, or body text centred in anything wider than about 80 characters

Code (CSS):

```css
/* one accent, spent deliberately on the single primary action */
.btn-primary   { background: var(--accent); color: white; font-weight: 600; }
.btn-secondary { background: transparent; border: 1px solid var(--border); color: var(--text); }
.btn-tertiary  { background: none; color: var(--text-muted); text-decoration: underline; }
/* everything else de-emphasized by weight/contrast, not a competing colour */

.hero-title { font-size: 2.5rem; font-weight: 800; margin-bottom: 32px; } /* whitespace = importance signal */
```

## Von Restorff Effect

Whatever looks visually different against a calm, consistent baseline is what gets noticed and remembered, also called the isolation effect. It works precisely because everything else is quiet; the moment two elements compete for the same standout treatment, the effect cancels out and neither gets the attention. Isolate exactly one target per view (the recommended pricing tier, the one CTA that matters), and combine scale, colour, and elevation together for that single element rather than spreading a lighter touch of each across several candidates.

Do:
- Isolate exactly one target per view

Avoid:
- Highlighting two or three elements at once

Code (CSS):

```css
/* 3 pricing tiers, ONE isolated as "recommended": scale + colour + elevation combined */
.pricing-tier { border: 1px solid var(--border); border-radius: 12px; padding: 24px; }
.pricing-tier.recommended {
  transform: scale(1.05);
  border: 2px solid var(--accent);
  box-shadow: var(--elevation-3), var(--elevation-glow);
  background: var(--surface-raised);
} /* the OTHER two tiers get zero special treatment, that's what makes this one land */
```

## Z-Index Mastery

`z-index` does absolutely nothing on an element with the default `position: static`; it only takes effect once an element is positioned. A child element can also never out-rank its own parent’s stacking context from outside; if the parent sits at a lower z-index than a sibling, no z-index value on the child, however large, can escape above that sibling. Use `isolation: isolate` to deliberately contain a component’s whole stacking context so its internal z-index values can’t leak out and collide with the rest of the page, and reach for the DevTools Layers panel to see the real stacking order instead of guessing and escalating to `z-index: 9999`.

Do:
- `isolation: isolate` to contain a component

Avoid:
- Escalating to `z-index: 9999` as the fix

Code (CSS):

```css
:root {
  --z-dropdown: 100; --z-sticky-header: 200; --z-modal: 300; --z-toast: 400;
} /* one shared scale, never invent a one-off 9999 to "fix" a stacking bug */

.dropdown-menu { position: relative; z-index: var(--z-dropdown); } /* z-index needs position to do anything */

.widget { isolation: isolate; } /* contains this component's internal z-index values */
.widget .internal-overlay { z-index: 5; } /* can never leak above a sibling outside .widget */
```

## Tabular Numbers

Default proportional fonts give each digit a different width (a “1” is narrower than an “8”), so a stacked column of numbers or decimals never quite lines up. The decimal points drift left and right down the column even though every value is correctly formatted. One line of CSS fixes it: `font-variant-numeric: tabular-nums;` forces every digit glyph to occupy the same fixed width, so a column of prices, stats, or table cells locks into a straight line without any manual padding or a monospace font swap. Apply it anywhere numbers stack vertically (pricing tables, dashboards, stat tiles), not globally on body text, since tabular spacing looks slightly loose in running prose.

Do:
- `tabular-nums` on any stacked numeric column

Avoid:
- Manual padding or a monospace font swap to fake alignment

Note: **Timers too.** A number that changes in place, such as a countdown or a running timer, needs tabular figures as well, so the digits do not shift sideways as they tick.

Code (CSS):

```css
.stat-value, .price-cell, .table-cell-numeric {
  font-variant-numeric: tabular-nums;
} /* every digit glyph becomes the same fixed width */

/* don't apply globally, running prose reads slightly loose with tabular spacing */
body { font-variant-numeric: normal; }
```

## Color System, Not Random Hex

The core thesis: a UI built from independently-picked hex values (a pink here, a yellow there) reads as amateur even when each individual color looks fine in isolation, because nothing ties them together. A UI built from one generated color system, a single base hue expanded into a tonal scale (e.g. 50/100/200…900 lightness steps), reads as deliberate, because every shade on screen is provably related to every other shade. **Scope:** this is the principle, not a generation method. The principle (a systematic tonal scale over ad hoc hex picks) is well-established and safe to apply; how the scale is generated is a separate choice.

Do:
- One base hue expanded into a tonal scale

Avoid:
- Independently-picked hex values with no shared relationship

Code (CSS):

```css
/* one base hue, scaled, not independently-picked accent colors */
:root {
  --blue-50:  #E6EAF7;  --blue-100: #B3C0E8;  --blue-300: #3B5BDB;
  --blue-500: #0F339D;  --blue-700: #0B2675;  --blue-900: #06143D;
}
/* one hue, many steps: every shade is related to every other */
/* extend the scale by adding steps, not new hues */
```

## AI Dashboard Tells

Five small habits are what make a generated dashboard read as generated, and each has a one-line fix. **The gradient**, a decorative header gradient that encodes nothing, becomes one flat accent colour. **The icon tiles**, four stat tiles in four different accent colours purely for variety, become one shared tile colour, so the number itself is the thing that stands out, not the rainbow around it. **The hierarchy**, every stat rendered at the same size and weight, becomes one primary number and three visibly smaller secondary ones. **The shadows**, drop shadows on every card whether or not it's actually elevated, get reserved only for things that genuinely float above the page (a dropdown, a popover, a toast); flat surfaces get a hairline border instead. **The copy**, a generic personalised greeting ("Welcome back, Jordan") sitting next to a bare number, gets dropped in favour of giving the number itself a shape: a small inline trend line next to the figure reads as real product telemetry in a way a templated greeting never does.

**Detail on the fifth tell.** The other half of that copy fix is the bare delta. A badge that says only “+12.5% from last month” gets the same treatment: name the period it compares against, set the digits in tabular figures (see Tabular Numbers), and replace the badge with a sparkline so the number has a shape.

Do:
- One flat accent, not a decorative gradient
- One primary stat, three visibly smaller secondaries
- Shadow reserved for what actually floats (dropdown/popover/toast)

Avoid:
- Four different tile colours doing the job one number should do

Note: **A baseline, not proof.** Well-made products also use shadows, coloured icons and gradients, so none of these tells proves a screen was generated. Treat the list as defaults to depart from deliberately: each one is fine when it was decided on purpose and encodes something.

Code (CSS):

```css
/* tell 01, flat accent, not a gradient with nothing to say */
.card-header { background: var(--accent); } /* not linear-gradient(...) */

/* tell 02, icon tiles share one colour; the number is the hero */
.stat-icon  { background: var(--accent-tint); color: var(--accent); }
.stat-value { font-size: 28px; font-weight: 700; }

/* tell 03, one primary stat, three secondary */
.stat-primary   { font-size: 32px; font-weight: 700; }
.stat-secondary { font-size: 18px; font-weight: 500; color: var(--text-med); }

/* tell 04, shadow only on what actually floats */
.card, .stat-tile { box-shadow: none; border: 1px solid var(--border); }
.dropdown-menu, .popover, .toast { box-shadow: var(--shadow-elevated); }

/* tell 05, drop the generic greeting, give the number a shape instead */
/* "Welcome back, Jordan" → a small inline sparkline next to the metric */
/* ...and a bare "+12.5% from last month" badge: name the period, tabular digits, sparkline instead of the badge */
.delta { font-variant-numeric: tabular-nums; }
```

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

**Ratio choice.** This source steps by 1.25 (the classic major third). Golden Ratio (entry 09) steps by 1.618, the opposite choice. From a 16px base, 1.25 gives roughly 16, 20 and 25px in two steps, while 1.618 gives roughly 16, 26 and 42px. The two entries disagree, so pick one ratio per product and stay on it. This source’s worked example is a billing dashboard.

Do:
- One family; hierarchy from size, weight and colour
- Five sizes at most, stepped by one ratio (1.25), never hand-picked pixels
- Three text colours: primary, secondary, muted
- Two weights: 400 to read, 600 to scan
- Line height about 1.1 on headings and about 1.5 on body
- Tracking about minus 2% above 24px, about plus 5% on small uppercase labels
- Body measure of 45 to 75ch through `max-width`, and `tabular-nums` on prices, timers and table columns

Avoid:
- Ten hand-picked sizes for ten pieces of text
- Bold on everything, or one line height everywhere

Note: **Defaults, not laws.** A 45 to 75 character measure, tabular figures, tighter tracking on large display type, looser tracking on small uppercase labels and a line height that falls as size rises are all standard typographic practice, and 1.25 is the classic major-third scale. “Five sizes max”, “two weights only” and “three text colours” are one designer’s tidy opinion: good defaults, but not laws, and some products legitimately use 500 as a third weight. The claim that one line height everywhere is an “AI tell” is plausible but unverified.

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

Do:
- `min-width: 0` on every grid or flex child that can hold a code block or long string
- `overflow-x: auto` on the `<pre>`, so the overflow scrolls inside its own box
- `minmax(0, 1fr)` in place of `1fr` when you control the grid tracks
- Stack genuinely long commands top to bottom instead of side by side

Avoid:
- Trusting `1fr` columns to shrink around a long single-line command
- Patching only the one column that broke, and leaving the same layout elsewhere

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
