> A Bright Coast AI skill, made by Rob Lee. github.com/bright-coast/design-standards
> Copyright 2026 Bright Coast AI. For Bright Coast AI clients and people Bright Coast AI has given this link to. You may build what you find here into your own work; you may not republish or resell the material itself. See LICENSE at github.com/bright-coast/design-standards.

# Visual

The layer people notice consciously least and judge most: colour, depth, spacing, and the perceptual rules underneath them.

File 1 of 2: 21 of the 37 Visual patterns. Use when: colour, type, spacing, depth, icons and layout.

In this part: Border Radius; Charts That Lie; Color Accessibility; Dark Mode; Depth Layers; Design System Kit; Design Tokens; Gestalt Laws; Golden Ratio; Gradient Design; Grid System; Icon Design Rules; Perfect Card; Proximity Rule; Shadow Elevation; Visual Hierarchy; Von Restorff Effect; Z-Index Mastery; Tabular Numbers; Color System, Not Random Hex; AI Dashboard Tells.

In `references/visual-2.md`: AI Landing Page Tells; Scanning Patterns; Typography as a System; Min-Width Zero for Grid and Flex Children; Equal-Height Cards in a Row; Pricing Table; Card Treatment System; Phone Check at 375px; 60-30-10 Colour Balance; Visual Character: One Decision per Axis; Project Design Contract; Stacked Priority Order; Avatar; CSS Layout Foundations; Optical Corrections; Glass Panels.

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

**Keep a rem term in fluid type.** A `clamp()` whose middle value is only `vw` ignores the browser’s text size setting, so someone who zooms text to 200% sees no change. Mix a rem part into the middle value, such as `clamp(1.5rem, 1rem + 2vw, 3rem)`, and check the page with text zoomed to 200%.

Do:
- Collapse columns per breakpoint (12→6→4→1)
- `scrollbar-gutter: stable` on any scrolling element, so nothing shifts when a scrollbar appears
- `scrollbar-gutter: stable both-edges` when the layout is centred
- The one-column version written first, with columns added at breakpoints
- `clamp()` for sizes that grow with the screen, `@container` for components that live in panels of different widths
- Fluid type mixes rem into the middle value and still grows when text is zoomed

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

**A forecast is information, not an alarm.** Things to keep an eye on (weather, a trend, a deadline still weeks away) stay in neutral grey. Red and the strong status colours belong to what needs action now, so the one real problem on the screen is the only thing that shouts.

Do:
- One flat accent, not a decorative gradient
- One primary stat, three visibly smaller secondaries
- Shadow reserved for what actually floats (dropdown/popover/toast)
- Status as a dot plus one word on a neutral card
- KPI tiles show the target, progress toward it and the deadline; only the off-track figure gets colour
- Watch items and forecasts in neutral grey, red only for what needs action now

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
