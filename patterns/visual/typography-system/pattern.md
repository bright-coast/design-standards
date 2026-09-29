---
id: typography-system
title: Typography as a System
category: visual
order: 24
---
## Rule
<p>Typography is seven decisions made once, so every screen inherits them instead of re-deciding them. <strong>1. One font family.</strong> Use a single family for the whole product; hierarchy comes from size, weight and colour, not from mixing typefaces. <strong>2. Five sizes at most, on one ratio.</strong> Step the sizes by a single ratio (1.25), never hand-picked pixels; a typical cleanup collapses 11 sizes to 5. <strong>3. Three text colours.</strong> Primary, secondary and muted do more than ten sizes: colour ranks inside a line, size ranks between blocks. <strong>4. Two weights.</strong> Use 400 for reading and 600 for scanning; when everything is bold, nothing is. <strong>5. Line height moves opposite to size.</strong> About 1.1 on headings and about 1.5 on body text; the same line height everywhere is often called an AI tell. <strong>6. Letter spacing.</strong> Tighten headings above 24px by about minus 2%, and open small uppercase labels by about plus 5%. <strong>7. Measure and figures.</strong> Cap body text at 45 to 75 characters per line by capping the measure (<code class="tok">max-width</code> in <code class="tok">ch</code>), not the container, and set tabular figures (<code class="tok">font-variant-numeric: tabular-nums</code>) on prices, timers and table columns so digits do not wobble. The digit-width detail lives in Tabular Numbers (Visual, entry 19), which is the second half of this rule.</p>
<p><strong>Ratio choice.</strong> This entry steps by 1.25 (the classic major third). Golden Ratio (entry 09) steps by 1.618, the opposite choice. From a 16px base, 1.25 gives roughly 16, 20 and 25px in two steps, while 1.618 gives roughly 16, 26 and 42px. The two entries disagree, so pick one ratio per product and stay on it. The demo uses a billing card as its worked example.</p>
## Do
- One family; hierarchy from size, weight and colour
- Five sizes at most, stepped by one ratio (1.25), never hand-picked pixels
- Three text colours: primary, secondary, muted
- Two weights: 400 to read, 600 to scan
- Line height about 1.1 on headings and about 1.5 on body
- Tracking about minus 2% above 24px, about plus 5% on small uppercase labels
- Body measure of 45 to 75ch through <code class="tok">max-width</code>, and <code class="tok">tabular-nums</code> on prices, timers and table columns
## Avoid
- Ten hand-picked sizes for ten pieces of text
- Bold on everything, or one line height everywhere
## Extra: caveat-box
<div class="caveat-box"><b>Defaults, not laws.</b> A 45 to 75 character measure, tabular figures, tighter tracking on large display type, looser tracking on small uppercase labels and a line height that falls as size rises are all standard typographic practice, and 1.25 is the classic major-third scale. &ldquo;Five sizes max&rdquo;, &ldquo;two weights only&rdquo; and &ldquo;three text colours&rdquo; are a tidy opinion: good defaults, but not laws, and some products legitimately use 500 as a third weight. The claim that one line height everywhere is an &ldquo;AI tell&rdquo; is plausible but unverified.</div>
## Code: CSS
<pre><code>:root {
  --font: system-ui, sans-serif; <span class="cm">/* 1. one family only */</span>
  <span class="cm">/* 2. five sizes, each 1.25x the last (example base 16px) */</span>
  --step--1: 0.8rem; --step-0: 1rem; --step-1: 1.25rem; --step-2: 1.5625rem; --step-3: 1.9531rem;
  <span class="cm">/* 3. three text colours: colour ranks inside a line, size ranks between blocks */</span>
  --text-primary: #334155; --text-secondary: #5A5A5A; --text-muted: #767676;
  --w-read: 400; --w-scan: 600; <span class="cm">/* 4. two weights */</span>
}
body { font: var(--w-read) var(--step-0)/1.5 var(--font); color: var(--text-secondary); } <span class="cm">/* 5. about 1.5 on body */</span>
h1, h2, h3 { font-weight: var(--w-scan); line-height: 1.1; color: var(--text-primary); } <span class="cm">/* about 1.1 on headings */</span>
h1 { font-size: var(--step-3); letter-spacing: -0.02em; } <span class="cm">/* 6. tighten above 24px by about 2% */</span>
.label { font-size: var(--step--1); text-transform: uppercase; letter-spacing: 0.05em; } <span class="cm">/* open small uppercase by about 5% */</span>
p { max-width: 65ch; } <span class="cm">/* 7. cap the measure (any value from 45ch to 75ch), not the container */</span>
.price, .timer, td.num { font-variant-numeric: tabular-nums; } <span class="cm">/* digits do not wobble */</span></code></pre>
