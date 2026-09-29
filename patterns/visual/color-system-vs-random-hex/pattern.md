---
id: color-system-vs-random-hex
title: Color System, Not Random Hex
category: visual
order: 20
---
## Rule
<p>A UI built from independently-picked hex values (a pink here, a yellow there) reads as amateur even when each individual color looks fine in isolation, because nothing ties them together. A UI built from one generated color system, a single base hue expanded into a tonal scale (e.g. 50/100/200&hellip;900 lightness steps), reads as deliberate, because every shade on screen is provably related to every other shade. <strong>Scope:</strong> this is the principle, not a generation method. The principle (a systematic tonal scale over ad hoc hex picks) is well-established and safe to apply; how the scale is generated is a separate choice.</p>
## Do
- One base hue expanded into a tonal scale
## Avoid
- Independently-picked hex values with no shared relationship
## Code: CSS
<pre><code><span class="cm">/* one base hue, scaled, not independently-picked accent colors */</span>
:root {
  --blue-50:  #E6EAF7;  --blue-100: #B3C0E8;  --blue-300: #3B5BDB;
  --blue-500: #0F339D;  --blue-700: #0B2675;  --blue-900: #06143D;
}
<span class="cm">/* one hue, many steps: every shade is related to every other */</span>
<span class="cm">/* extend the scale by adding steps, not new hues */</span></code></pre>
