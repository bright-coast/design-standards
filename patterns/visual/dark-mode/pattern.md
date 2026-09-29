---
id: dark-mode
title: Dark Mode
category: visual
order: 4
---
## Rule
<p>Dark mode is not black mode. Build the base surface on a near-black like <code class="tok">#121212</code>, never pure <code class="tok">#000</code>, which creates harsh halation against any bright element and looks cheap on OLED. Desaturate accent colours by roughly 20% in dark mode, since a saturated colour that looks right on white can vibrate uncomfortably against near-black. Use layered, progressively lighter surfaces to signal elevation instead of shadows (which barely read on a dark ground), and build text hierarchy through opacity tiers on a single white rather than several different hardcoded greys.</p>
<p>Six rules, in full. <strong>Near black, not black:</strong> pure black saves OLED battery but kills depth, since nothing can sit lower than black, so start near black (for example a page at #0B0D10, with the card and chip lighter). <strong>Lightness is elevation:</strong> shadows die on dark, so raise surfaces by making them lighter, with page, card, menu and modal each one step lighter. <strong>Three tiers of white:</strong> never pure white text; primary at about 87%, secondary at about 60% and disabled at about 38%, one colour with three alphas. <strong>Calm the accent:</strong> a saturated brand blue glows past its edges on dark, so keep the hue but lighten and desaturate it. <strong>Alpha hairlines:</strong> edges need a 1px line of white at about 8% alpha rather than a fixed grey, because it adapts as the surface gets lighter. <strong>Dim the photos:</strong> bright images pull the eye on a dim page, so lower their brightness to about 90%, and give illustrations a redrawn dark variant rather than a filter.</p>
## Do
- Layered surfaces signal elevation
- Text tiers on one white: about 87% primary, 60% secondary, 38% disabled
- Edges as a 1px white line at about 8% alpha, not a fixed grey
- Photos dimmed to about 90% brightness; illustrations redrawn as a dark variant, not filtered
## Avoid
- Pure white body text glaring on dark
- A saturated brand colour left unchanged on dark, glowing past its edges
## Extra: caveat-box
<div class="caveat-box"><b>Real trade-off, not a free upgrade:</b> near-black elevation surfaces cost more battery on OLED than true black, and several of the lighter "elevated" surface tones can quietly fail WCAG contrast if not checked; a low-contrast button on a near-black surface is the classic miss. Run every elevated surface + text pair through the Color Accessibility check above before shipping; don't assume "near-black" is automatically accessible just because it isn't pure black. Two fair objections: saving battery can matter more than depth, and most of these techniques lower contrast; and an accent desaturated too far looks disabled. Treat the 87, 60 and 38 percent tiers, the 8% alpha hairline and the 90% photo brightness as sensible defaults to check, not rules, and keep the contrast check above.</div>
## Code: CSS
<pre><code>:root[data-theme=<span class="str">"dark"</span>] {
  --bg: #121212; <span class="cm">/* near-black, never pure #000 */</span>
  --surface-1: #1E1E1E; --surface-2: #262626; --surface-3: #2E2E2E; <span class="cm">/* elevation via lightness, not shadow */</span>
  --text-high: rgb(255 255 255 / 0.87); <span class="cm">/* opacity tiers, not separate hex greys */</span>
  --text-med:  rgb(255 255 255 / 0.60);
  --text-low:  rgb(255 255 255 / 0.38);
  --accent: oklch(70% 0.12 175); <span class="cm">/* ~20% less saturated than the light-mode accent */</span>
  --border: rgb(255 255 255 / 0.08); <span class="cm">/* alpha hairline: adapts as the surface gets lighter, unlike a fixed grey */</span>
}
img, video { filter: brightness(0.9); } <span class="cm">/* dim photos to about 90%; give illustrations a redrawn dark variant instead of a filter */</span></code></pre>
