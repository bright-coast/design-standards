> A Bright Coast AI skill, made by Rob Lee. github.com/bright-coast/design-standards
> Copyright 2026 Bright Coast AI. For Bright Coast AI clients and people Bright Coast AI has given this link to. You may build what you find here into your own work; you may not republish or resell the material itself. See LICENSE at github.com/bright-coast/design-standards.

# Visual

The layer people notice consciously least and judge most: colour, depth, spacing, and the perceptual rules underneath them.

37 patterns. Use when: colour, type, spacing, depth, icons and layout.

## Border Radius

Nested corners follow real math: a card with 12px radius and 8px padding needs an inner element radius of exactly 4px (outer minus padding), or the inner corner reads as visually off even though nobody can say why. Pick one radius scale for the whole system (4/8/12/16, or similar) instead of eyeballing a number per component, and scale the radius up with element size; a tiny badge and a full page card at the same 8px radius look proportionally wrong on the smaller one. Radius is also a brand lever: sharp corners read technical/serious, generous rounding reads friendly/approachable, so pick deliberately.

The full checklist has six rules. **Nested:** inner radius equals outer radius minus padding (a 12px card with 8px padding gets a 4px inner corner), so nested corners share one centre; otherwise the inner corner bulges. A border counts too: inner radius equals outer radius minus padding minus border width, so a 16px card with a 2px border and 8px padding gets a 6px inner corner. **Scale:** size sets the radius (for example small 4, medium 8, large 16, which are sample values), not 8px on everything; a chip and a modal do not share a corner. **Pill:** full radius is a shape, not a number, so use 9999px only on a single-line element such as a chip, avatar or toggle, never on a multi-line card. **Edges:** an element that touches an edge has no corner there, so a bottom sheet flush to the screen edge gets its top corners rounded and its bottom corners at zero. **Ring:** a selection ring drawn as its own box sits outside the element, so ring radius equals the inner radius plus the gap (8 inside and a 2px gap gives 10 out); if the corners pinch, flip the formula. **Images:** an edge-to-edge image in a rounded card is clipped by the card (`overflow: hidden`) so square image corners do not poke through; for an inset image, subtract the padding and apply the same nested rule.

Do:
- Scale radius with element size
- Subtract the border width as well as the padding when nesting radii
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

**Zero, and the line chart exception.** Bars always start at zero, because their length is the value. A line chart may skip zero when the change is the point (a temperature or a share price), but only with a clearly labelled axis that shows where it starts. **Pies:** a pie with more than about five slices cannot be read; use a sorted bar chart instead. **Palette type follows the data:** categorical colours (distinct hues) for separate groups, a sequential palette (one hue, light to dark) for magnitude, and a diverging palette (two hues meeting at a neutral midpoint) for values above and below a meaningful middle such as zero or a target.

**Emphasis and labels.** The takeaway series is in the accent colour and every other series grey, so title and colour point at the same thing. Label lines at their ends instead of in a legend. Past about five series, a chart turns to spaghetti; switch to a sortable table or to small multiples (one small chart per series, on shared axes). Annotate notable spikes and dips on the chart itself with their cause (Pricing change, Outage). **Aspect ratio:** as a guideline rather than a law, pick a width and height for a line chart that keeps its important slopes near 45 degrees; too wide flattens real change, too tall exaggerates noise.

Do:
- Chart type matched to the actual question
- One accent series, the rest grey

Avoid:
- Gridlines/3D that encode no real data
- A pie with more than about five slices
- A categorical rainbow on data that is really a magnitude

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

**Large text** means about 24px at regular weight or about 19px (18.7px) bold. Only text at that size may drop to 3:1; anything smaller needs 4.5:1. **Text over an image** needs a scrim or a dark gradient under it (for example black at 40 to 60% across the part the text covers), and its contrast is measured at the lightest spot the text crosses, never against the image’s average colour. **Exempt from the minimums:** disabled or inactive controls, logos and wordmarks, and pure decoration. A muted disabled button is not a failure, though it still needs another cue (no hover, a not-allowed cursor, a reason nearby) that it is disabled. **Judge a colour in place:** neighbouring colours change how light or strong a colour looks (the same mid grey reads darker on white than on black), so check swatches on the real surface beside their real neighbours, not alone on an empty artboard.

Do:
- Second signal (icon/pattern) with every colour cue
- Text on an image sits on a scrim, checked at the lightest spot it crosses

Avoid:
- Red-vs-green as the only signal
- Disabled controls and logos flagged as contrast failures

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

**Follow the system setting in CSS.** Use `prefers-color-scheme` as the default trigger, with a stored user choice overriding it, and set `color-scheme: light dark` so native form controls, scrollbars and the default canvas switch too; no detection script is needed. **Drop the weight about one step:** light text on a dark ground looks heavier and slightly blurred at the edges, so a heading at 600 on light reads right at 500 on dark, and body text at 400 can go to about 350 with a variable font.

Do:
- Layered surfaces signal elevation
- Text tiers on one white: about 87% primary, 60% secondary, 38% disabled
- Edges as a 1px white line at about 8% alpha, not a fixed grey
- Photos dimmed to about 90% brightness; illustrations redrawn as a dark variant, not filtered
- `color-scheme: light dark` so native controls and scrollbars follow the theme

Avoid:
- Pure white body text glaring on dark
- A saturated brand colour left unchanged on dark, glowing past its edges

Note: **Real trade-off, not a free upgrade:** near-black elevation surfaces cost more battery on OLED than true black, and several of the lighter "elevated" surface tones can quietly fail WCAG contrast if not checked; a low-contrast button on a near-black surface is the classic miss. Run every elevated surface + text pair through the Color Accessibility check above before shipping; don't assume "near-black" is automatically accessible just because it isn't pure black. Two fair objections: saving battery can matter more than depth, and most of these techniques lower contrast; and an accent desaturated too far looks disabled. Treat the 87, 60 and 38 percent tiers, the 8% alpha hairline and the 90% photo brightness as sensible defaults to check, not rules, and keep the contrast check above.

Variant: **Text greys as alpha tiers versus solid greys, two variants.** Variant A: one white at about 87, 60 and 38% alpha, as above. Use when: text always sits on a known solid surface. Variant B: solid greys defined per theme (#E0E0E0, #A0A0A0, #6B6B6B on #121212). Use when: text can sit on images, tinted panels or overlapping layers, because alpha text takes on whatever is behind it. The same choice applies to the opacity captions in Visual Hierarchy. Both kept on purpose.

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
:root { color-scheme: light dark; } /* native controls and scrollbars follow the theme */
:root[data-theme="dark"] h2 { font-weight: 500; } /* 600 on light: one step lighter on dark */
img, video { filter: brightness(0.9); } /* dim photos to about 90%; give illustrations a redrawn dark variant instead of a filter */
```

## Depth Layers

Three CSS levers create real perceived depth without a visual redesign: layered box-shadows (a tight contact shadow plus a soft ambient one), a subtle parallax speed differential between background and foreground on scroll, and a small hover z-lift. Stack a tight shadow with a wider ambient one rather than one flat blur value; that combination is what makes an element read as physically raised. Keep hover lifts subtle: a few pixels of translateY and roughly 3% scale reads as responsive; push either further and it starts to feel gimmicky rather than tactile.

**A perspective tilt, sparingly.** A tiny 3D tilt toward the pointer (about 2 to 4 degrees, under a perspective of around 800 to 1000px) can add lift to one hero card or product shot. Keep it to one element per screen, never on cards in a list or anything holding text people need to read, and switch it off under `prefers-reduced-motion`.

Do:
- Stack tight + mid + ambient shadows
- A tilt of at most a few degrees, on one hero element only

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
.hero-card { transform: perspective(900px) rotateX(var(--tilt-x, 0deg)) rotateY(var(--tilt-y, 0deg)); } /* set by the pointer, kept within 3deg */
@media (prefers-reduced-motion: reduce) { .hero-card { transform: none; } }
.parallax-bg { transform: translateY(calc(var(--scroll-y) * 0.3px)); } /* moves slower than foreground */
```

## Design System Kit

Semantic tokens like `--brand` or `--error` survive a rebrand or a dark-mode pass because the name describes the role, not the literal colour behind it; hardcoded hex scattered across components has to be found and changed one at a time. Build a numbered colour scale (50 through 900) for every hue rather than a handful of arbitrary shades, and a 4px spacing scale so every gap in the product traces back to one shared rhythm. Define components as combinations of variant/size/state rather than one-off classes per screen.

Do:
- Numbered colour scale + 4px spacing scale

Avoid:
- Hardcoded hex and eyeballed gaps

Variant: **8px unit versus 4px steps, two variants.** Variant A: a 4px scale (4, 8, 12, 16, 24), as above. Use when: dense product UI such as tables, forms and toolbars, where 12px and other in-between steps are needed. Variant B: one 8px unit and only its multiples (8, 16, 24, 32, 48). Use when: marketing pages and roomier layouts, where fewer, bigger steps keep the rhythm obvious. Either way, 4px is reserved for small adjustments inside a component, never between sections. Both kept on purpose.

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

**No token layer yet? Write the tokens first.** In a project with no tokens, write them before any markup, so the first screen already pulls from them. Hover, active and disabled states derive from existing tokens, through opacity or `color-mix()`, never from a new hex value and never from a fixed 50% opacity applied without reference to the tokens.

Do:
- One primitive edit cascades everywhere
- Tokens written before markup when the project has none
- Hover, active and disabled derived from tokens with opacity or `color-mix()`

Avoid:
- Baking literal values into token names
- A new hex value, or a fixed 50% opacity, for a hover, active or disabled state

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

Note: **Pick one ratio.** Typography as a System steps its type sizes by 1.25 (the major third) rather than 1.618. From a 16px base, 1.25 gives roughly 16, 20 and 25px in two steps, while 1.618 gives roughly 16, 26 and 42px. Pick one ratio per product and stay on it. 1.618 is too steep for dense product UI: its steps run about 16, 26, 42 and 68px, which suits a marketing page with a few big headings but leaves no usable sizes between body and heading in a dashboard or form. For product UI, a ratio of 1.2 to 1.25 fits (see Typography as a System).

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

**Five rules for gradients that stay vivid and readable.** Blue to yellow looks simple, but by default the browser mixes in RGB, so the middle drops to a muddy grey (#3b5bdb to #f5d90a passes through #989a72). **1. Interpolate in OKLCH.** One clause in your CSS, same two colours, and the middle stays bright (the same pair passes through a bright green, about #22b573). **2. Add a middle stop.** You pick the colour in between instead of letting the math pick it. **3. Far apart needs a route.** Opposite hues (168&deg; apart) go grey on a straight path, so use OKLCH and a middle stop; neighbours (55&deg; apart) blend fine. **4. Add grain.** On big dark gradients, a faint noise layer hides the banding. **5. Calm behind text.** Behind text, keep the stops close in lightness so every word stays readable: white text measures 1.2:1 on the pale end of a wide gradient and 8.2:1 on a calm, close-lightness one.

**Angle, mesh and gradient text.** On surfaces, prefer a diagonal of about 135 degrees (top left to bottom right) over a flat left-to-right gradient, which reads like a progress bar. For a hero background, a mesh of about three colour points (two or three layered radial gradients over a base colour) reads more natural than a two-stop linear gradient. A gradient fill on the text itself (`background-clip: text`) belongs on display headlines only; body text, labels and links stay a solid colour, and the headline’s contrast is checked at its palest stop.

Do:
- Keep lightness moving one direction only
- `linear-gradient(in oklch ...)` for any pair that is not neighbours
- A hand-picked middle stop on far-apart hues
- Stops close in lightness wherever text sits on top
- A diagonal of about 135 degrees on surfaces; a three-point mesh for hero backgrounds

Avoid:
- Gradient-filled body text, labels or links
- Body text on a gradient’s mid-transition
- Default RGB mixing across opposite hues (the grey middle)

Variant: **Neighbouring hues only versus opposite hues with a route, two variants.** Variant A: neighbouring hues only, as in the first paragraph. Use when: the CSS has to work without OKLCH support, or the palette is fixed to analogous colours. Variant B: opposite hues with a route (rules 1 to 3). Use when: the design needs two far-apart colours; interpolate in OKLCH and add a middle stop rather than avoiding the pair. Both kept on purpose.

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

/* far-apart hues: interpolate in OKLCH (rule 1) and pick the middle yourself (rule 2) */
.gradient-vivid { background: linear-gradient(in oklch 90deg, #3b5bdb, #22b573, #f5d90a); }
/* behind text: stops close in lightness (rule 5) */
.gradient-text-safe { background: linear-gradient(in oklch 135deg, #3b2fa0, #6a35b0); color: white; }

.hero-mesh { background: radial-gradient(at 15% 20%, #6a35b0, transparent 55%), radial-gradient(at 85% 30%, #3b5bdb, transparent 50%), radial-gradient(at 50% 90%, #c2417a, transparent 55%), #1b1442; } /* three-point mesh */
.display-headline { background: linear-gradient(135deg, #3b5bdb, #6a35b0); -webkit-background-clip: text; background-clip: text; color: transparent; }
```

## Grid System

A 12-column grid maps almost any layout because 12 divides cleanly into halves, thirds, and quarters, giving enough flexibility without infinite arbitrary choices. Gutter width sets the emotional register of a layout: tight gutters read technical and dense, wide gutters read editorial and calm. As defaults, about 8px for a dense tool, 24px for a balanced layout and 40px for an editorial one. Collapse the column count at each breakpoint (12 on desktop down to 6, then 4, then a single column on mobile) rather than shrinking 12 narrow columns onto a phone screen. Only break the grid deliberately once it’s clearly established as the norm; an occasional full-bleed image is a strong device precisely because everything else respects the grid.

A layout also has to hold still when a scrollbar appears. When content grows past its container, a classic scrollbar takes a few pixels of width and the content nudges sideways. Put `scrollbar-gutter: stable` on the scrolling element and the scrollbar’s space is reserved from the start, so nothing shifts when it appears. For a centred layout use `scrollbar-gutter: stable both-edges`, which reserves the gutter on both sides so the content stays symmetrical. The caveat is that the gutter is a placeholder: with plain `stable` the left and right spacing can look unequal, which is what `both-edges` addresses. It matters mainly with classic, always-visible scrollbars (Windows and Linux); on macOS with overlay scrollbars there is nothing to reserve, and the reserved space is visible as an empty strip when there is no scrollbar. It is supported in current Chrome, Edge and Firefox, with Safari support arriving in recent versions, so check the current support table before relying on it in a Safari-first product.

Write the one-column version first, then add columns at breakpoints. Starting from the single column keeps the narrow screen as the default, instead of a squeezed copy of the desktop.

**Fluid values and container queries before more breakpoints.** Sizes that should grow smoothly with the screen (gutters, section padding, display type) use `clamp()`, such as `clamp(16px, 4vw, 40px)`, instead of a new media query at every width. A component that can sit in panels of different widths (a card in a sidebar and in the main column) responds to its container with `@container`, not to the viewport, because the viewport says nothing about the space the component actually has. Keep media queries for page-level layout changes.

Do:
- Collapse columns per breakpoint (12→6→4→1)
- `scrollbar-gutter: stable` on any scrolling element, so nothing shifts when a scrollbar appears
- `scrollbar-gutter: stable both-edges` when the layout is centred
- The one-column version written first, with columns added at breakpoints
- `clamp()` for sizes that grow with the screen, `@container` for components that live in panels of different widths

Avoid:
- A media query for every small size change
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

.page { padding-inline: clamp(16px, 4vw, 40px); } /* fluid, no breakpoint needed */
.panel { container-type: inline-size; }
@container (min-width: 480px) { .card { grid-template-columns: 120px 1fr; } } /* responds to its panel, not the viewport */

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

**Live area, caps and joins.** Inside the 24px box, draw within a live area of about 20px, leaving 2px of padding so strokes and round shapes have room to overshoot. One stroke width goes with one cap and one join style for the whole set (round caps and round joins, for example), never round on some icons and square on others. **Snap to whole pixels:** keep coordinates on whole numbers so lines render sharp; with an odd stroke width (1px or 3px) place the line on a half pixel (x = 12.5) so the stroke fills whole pixels rather than blurring across two. **Few sizes, matched to text:** use three icon sizes at most, each paired with a text size, for example 16px icons beside 12 to 14px text, 20px beside 15 to 16px text and 24px beside 18 to 20px text. Optical centring of asymmetric glyphs and icon alignment to a label’s cap height are in Optical Corrections.

Do:
- Snap to a fixed grid, one stroke weight
- One cap and join style across the whole set
- Three icon sizes at most, each paired with a text size

Avoid:
- Mixing fill and outline styles at random
- Fractional coordinates that blur a 1px stroke across two pixels

Code (CSS):

```css
.icon {
  width: 24px; height: 24px; /* fixed bounding box for every icon in the set */
  stroke-width: 1.5px; /* one consistent stroke weight, never mixed per-icon */
  stroke-linecap: round; stroke-linejoin: round; /* one cap and join style for the set */
}
.icon-sm { width: 16px; height: 16px; } /* beside 12 to 14px text */
.icon-md { width: 20px; height: 20px; } /* beside 15 to 16px text */
.icon-lg { width: 24px; height: 24px; } /* beside 18 to 20px text */

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

Note: **A note on the finish.** A dark, glossy card is often read as machine-generated. The numbers are sound; the finish is a style choice to check against AI Slop: What Not To Do.

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

**One light source.** Every shadow in the interface assumes the same light direction, usually from straight above, so every shadow offsets the same way (down, never left on one card and right on another). **How tiers scale:** going up a tier, the offset and blur grow (y 1 and blur 2 at rest, y 20 and blur 32 on a modal) while the opacity of each layer stays roughly the same, about 4 to 8%; a higher element casts a longer, softer shadow, not a darker one. **Trim the halo:** give the wide ambient layer a negative spread (for example 0 20px 32px -8px) so the shadow sits under the element instead of glowing out past its sides. **On dark surfaces** black shadows barely read and Dark Mode raises surfaces with lightness instead; the one exception is a low-opacity glow tinted to the accent (about 15 to 25%), which can stand in for the black ambient layer on a floating element.

Do:
- Tint the glow to brand accent
- Every shadow offset in the same direction
- Offset and blur grow with elevation; opacity stays about the same

Avoid:
- One flat drop shadow used everywhere
- A black ambient shadow on a dark surface

Code (CSS):

```css
:root {
  --elevation-1: 0 1px 2px rgb(0 0 0 / .08);
  --elevation-2: 0 1px 2px rgb(0 0 0 / .06), 0 4px 8px rgb(0 0 0 / .05);
  --elevation-3: 0 2px 4px rgb(0 0 0 / .06), 0 8px 16px rgb(0 0 0 / .05), 0 20px 32px -8px rgb(0 0 0 / .04); /* negative spread trims the side halo */
  --elevation-glow-dark: 0 12px 32px -6px rgb(59 91 219 / .2); /* dark surfaces: a tinted glow instead of a black ambient layer */
  --elevation-glow: 0 8px 24px rgba(59, 91, 219, 0.25); /* tinted to brand accent, not black */
}
.card { box-shadow: var(--elevation-1); } /* resting */
.modal { box-shadow: var(--elevation-3); } /* strongest tier reserved for what matters most */
.card.dragging { box-shadow: var(--elevation-3), var(--elevation-glow); }
```

## Visual Hierarchy

Size, colour, contrast, whitespace, and font weight all stack together to create exactly one clear focal point on a given screen. Hierarchy is what tells someone’s eye where to land first without them having to think about it. Spend the single accent colour on the one truly key action per screen; a screen with five differently-coloured buttons has no hierarchy at all, just noise. Colour carries meaning, not rank; the ranking itself comes from size, weight, and position working together. Whitespace itself is an importance signal: the element with the most breathing room around it reads as the most important one on the page, independent of its own size. The numbers make the rule testable rather than a matter of taste. Adjacent heading levels need at least a 1.25× size jump between them, and a primary call-to-action needs to stand at least 1.5× the height of body text, or the size difference doesn't actually register. Weight carries its own tier: 600 to 700 for a primary heading, 500 to 600 for a secondary one, 400 for body copy, and 400 at 60 to 70% opacity for captions and meta text, never colour alone doing that job. Spacing scales with the hierarchy it separates: 48 to 64px between major sections, 24 to 32px between subsections, 8 to 16px within one group, and a heading always carries more space above it than below, which is what visually ties it to the content that follows rather than the content it just left. A genuine test for any screen: squint at it, or blur it, and check whether the one thing that matters most is still obviously the one thing that matters most.

**Treat spacing as ratios.** The gap between sections is at least twice the gap between subsections, and the gap between subsections is at least twice the gap inside a group, with every value taken from the project’s own spacing scale; the pixel ranges above are one example of those ratios, not the rule itself. Text levels need a real difference too: two sizes only 1 or 2px apart read as the same level, so count them as one, and either merge them or pull them further apart.

**Three kinds of white space.** Micro white space is the space inside and between small elements: letter and line spacing, a button’s padding, the gap between a label and its field. Macro white space is the space between sections and around the main blocks of a page. Active white space is space added on purpose to pull attention to one thing, such as an empty band around a single call to action. Micro space decides whether a page is readable, macro space decides whether it is calm, and active space decides where the eye goes.

Do:
- Spend one accent colour on the one key action
- At least 1.25× between heading levels, 1.5× for a primary CTA over body text
- More space above a heading than below it
- Section gaps at least 2× subsection gaps, and subsection gaps at least 2× the gaps inside a group, all from the project scale

Avoid:
- Colouring every element differently
- Three equal-weight primary buttons, or a sidebar with 15+ items at one visual level
- All-caps or italic body text, or body text centred in anything wider than about 80 characters
- Two text sizes 1 or 2px apart treated as two levels

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

**A small named scale.** Every z-index in the product comes from one short list of named layers, in order: base, dropdown, sticky, overlay, modal, toast. Each is a token with a gap of 100 between them, so a new layer can slot in without renumbering. Components use the names, never raw numbers, and anything stacking inside a component stays inside its own `isolation: isolate` context with small values (1, 2, 3), so stacking contexts are created on purpose rather than by accident through a stray `transform` or `opacity`.

Do:
- `isolation: isolate` to contain a component
- Six named layer tokens: base, dropdown, sticky, overlay, modal, toast

Avoid:
- Escalating to `z-index: 9999` as the fix

Code (CSS):

```css
:root {
  --z-base: 0; --z-dropdown: 100; --z-sticky: 200; --z-overlay: 300; --z-modal: 400; --z-toast: 500;
} /* one shared scale, never invent a one-off 9999 to "fix" a stacking bug */

.dropdown-menu { position: relative; z-index: var(--z-dropdown); } /* z-index needs position to do anything */

.widget { isolation: isolate; } /* contains this component's internal z-index values */
.widget .internal-overlay { z-index: 5; } /* can never leak above a sibling outside .widget */
```

## Tabular Numbers

Default proportional fonts give each digit a different width (a “1” is narrower than an “8”), so a stacked column of numbers or decimals never quite lines up. The decimal points drift left and right down the column even though every value is correctly formatted. One line of CSS fixes it: `font-variant-numeric: tabular-nums;` forces every digit glyph to occupy the same fixed width, so a column of prices, stats, or table cells locks into a straight line without any manual padding or a monospace font swap. Apply it anywhere numbers stack vertically (pricing tables, dashboards, stat tiles), not globally on body text, since tabular spacing looks slightly loose in running prose.

**Signed money rows.** In a list of transactions, every amount carries an explicit sign, +$120.00 for money in and &minus;$45.60 for money out, so incoming and outgoing rows never look alike. Colour (green for in, neutral or red for out) is only a second signal on top of the sign, never the only one. Use a real minus sign (U+2212), not a hyphen, so it matches the plus in width.

Do:
- `tabular-nums` on any stacked numeric column
- An explicit + or &minus; on every money row, with colour as the second signal

Avoid:
- Manual padding or a monospace font swap to fake alignment
- Money in and money out told apart by colour alone

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

A UI built from independently-picked hex values (a pink here, a yellow there) reads as amateur even when each individual color looks fine in isolation, because nothing ties them together. A UI built from one generated color system, a single base hue expanded into a tonal scale (e.g. 50/100/200…900 lightness steps), reads as deliberate, because every shade on screen is provably related to every other shade. **Scope:** this is the principle, not a generation method. The principle (a systematic tonal scale over ad hoc hex picks) is well-established and safe to apply; how the scale is generated is a separate choice.

**Three deliberate harmonies.** When a palette needs more than one hue, pick it from a harmony rather than by eye. **Monochromatic:** one hue in several lightnesses, the calmest and the default for product UI. **Complementary:** two hues opposite on the colour wheel (blue and orange), one dominant and the other kept for a small accent, which gives the strongest contrast. **Analogous:** three neighbouring hues (blue, indigo, violet), which reads harmonious and suits illustration and marketing surfaces. Each chosen hue still gets its own tonal scale.

Do:
- One base hue expanded into a tonal scale
- Extra hues chosen from a harmony: monochromatic, complementary or analogous

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

**Three more tells.** **Filled status cards:** a whole card or tile filled with green or red to show status. The fix is a neutral card with a small coloured dot and one word (Healthy, Failing). **Filler charts:** a chart on every card because there is room for one. Each card leads with its latest meaningful change and when (Deployed 4 minutes ago), and a chart appears only where it encodes a trend someone reads. **Bare KPI values:** in a KPI row, colour is spent only on the figure that is off track, so it stands out against neutral neighbours (the Von Restorff effect), and each figure is shown against its goal: the target, a bar showing progress toward it, and the deadline (340 of 500 signups, due 30 June).

Do:
- One flat accent, not a decorative gradient
- One primary stat, three visibly smaller secondaries
- Shadow reserved for what actually floats (dropdown/popover/toast)
- Status as a dot plus one word on a neutral card
- KPI tiles show the target, progress toward it and the deadline; only the off-track figure gets colour

Avoid:
- Four different tile colours doing the job one number should do
- A whole card filled with a status colour

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

**Ratio choice.** This entry steps by 1.25 (the classic major third). Golden Ratio (entry 09) steps by 1.618, the opposite choice. From a 16px base, 1.25 gives roughly 16, 20 and 25px in two steps, while 1.618 gives roughly 16, 26 and 42px. The two entries disagree, so pick one ratio per product and stay on it. The demo uses a billing card as its worked example.

On a phone, body text and metadata (dates, captions, counts) stay at 14px or more. Smaller text saves a line and costs every reader a squint.

Do:
- One family; hierarchy from size, weight and colour
- Five sizes at most, stepped by one ratio (1.25), never hand-picked pixels
- Three text colours: primary, secondary, muted
- Two weights: 400 to read, 600 to scan
- Line height about 1.1 on headings and about 1.5 on body
- Tracking about minus 2% above 24px, about plus 5% on small uppercase labels
- Body measure of 45 to 75ch through `max-width`, and `tabular-nums` on prices, timers and table columns
- Body and metadata text at 14px or more on a phone

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

Do:
- Large areas neutral, accent kept for actions
- One accent colour, used sparingly
- Support grey for borders and icons

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

Do:
- Photo, then initials, then a generic icon
- Initials colour hashed from the name, from a contrast-checked palette
- Groups capped at three to five, with +N for the rest

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
