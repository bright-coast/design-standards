---
id: calendar-week-view
title: Calendar Week View
category: interaction
order: 28
---
## Rule
<p>A busy week stays readable because of six layout rules, not because of extra chrome. <strong>1. Grid and now.</strong> Seven columns and 24 rows, one hour each; hour labels sit on the grid line, not inside the cell; a red line marks the current time; and the view opens scrolled to now, not to midnight. <strong>2. Colour per calendar.</strong> Show calendar colour as a 3px stripe on the left edge of each event with the fill at about 10%, so the title stays readable on every colour; full fills turn a busy week into a rainbow. <strong>3. Overlaps.</strong> Two events in the same hour sit side by side at half width each, three at a third each; never stacked, and never hidden behind a &ldquo;+1 more&rdquo;. <strong>4. Height is duration.</strong> 60px per hour; a 15 minute event still gets a one-line clipped title, and anything shorter is a bar you can hover for the title. <strong>5. Drag on empty space.</strong> Drag on empty space to draw an event, snap to 15 minutes, move it by its body, resize from the bottom edge only, and update the time label while dragging, not after (the mechanics are in Time-Block Dragging, entry 27). <strong>6. All-day row.</strong> All-day events live in a pinned row above the grid that stays put while the hours scroll, so they never eat the morning.</p>
## Do
- Hour labels on the grid line, a red now line, and the view opened scrolled to now
- Calendar colour as a 3px left stripe with a fill of about 10%, not a full fill
- Same-hour events side by side (half width, a third), with a cap of about four and a &ldquo;+N&rdquo; fallback beyond it
- Height proportional to duration: 15 minutes keeps a one-line clipped title, shorter becomes a hover-for-title bar
- All-day events in a pinned row above the scrolling hours
## Avoid
- Full-colour fills that turn a busy week into a rainbow
- Stacking overlapping events on top of each other
- Opening the view at midnight
## Extra: caveat-box
<div class="caveat-box"><b>Craft choices, and one opinion.</b> Most of this is standard calendar convention (a now line, colour-coded calendars, side-by-side overlaps, height proportional to duration, a pinned all-day strip, 15 minute snapping). The exact numbers (60px per hour, the 3px stripe, the 10% fill) are one designer&rsquo;s choices, and the &ldquo;never a plus one&rdquo; overlap rule is an opinion: with four or five overlapping events the side-by-side columns become too narrow to read, which is why the major calendar apps cap the columns and show &ldquo;+N&rdquo; beyond that. Use a cap of about four, then fall back to &ldquo;+N&rdquo;. One answer for three or more all-day events is to divide the row again and show the detail on hover only, which gets thin as the count grows.</div>
## Code: CSS + JS
<pre><code><span class="cm">/* 7 columns, 24 rows, 60px per hour; hour labels sit on the grid line, not inside the cell */</span>
.cwv-grid  { display: grid; grid-template-columns: 44px repeat(7, 1fr); }
.cwv-day   { position: relative; height: calc(24 * 60px);
             background-image: repeating-linear-gradient(to bottom, var(--border) 0 1px, transparent 1px 60px); }
.cwv-hour  { position: absolute; transform: translateY(-50%); }
.cwv-now   { position: absolute; left: 0; right: 0; height: 2px; background: #c0392b; } <span class="cm">/* the red now line */</span>

<span class="cm">/* colour per calendar: a 3px stripe plus a fill of about 10%, so the title stays readable on every colour */</span>
.cwv-event { border-left: 3px solid var(--cal); background: color-mix(in srgb, var(--cal) 10%, var(--card)); }

<span class="cm">/* all-day events: a pinned row above the scrolling hours */</span>
.cwv-allday { position: sticky; top: 0; z-index: 3; background: var(--card); }

<span class="kw">const</span> PX_PER_MIN = <span class="num">1</span>; <span class="cm">// 60px per hour, so height is duration</span>
<span class="kw">function</span> <span class="fn">place</span>(ev, overlapping) { <span class="cm">// overlapping = events sharing the same hour, in start order</span>
  <span class="kw">const</span> n = Math.min(overlapping.length, <span class="num">4</span>); <span class="cm">// about four columns is the readable limit, then show "+N"</span>
  <span class="kw">const</span> col = overlapping.indexOf(ev) % n;
  ev.el.style.top    = ev.startMin * PX_PER_MIN + <span class="str">'px'</span>;
  ev.el.style.height = (ev.endMin - ev.startMin) * PX_PER_MIN + <span class="str">'px'</span>; <span class="cm">// 15 minutes = 15px: one clipped line; shorter = a hover bar (title attribute)</span>
  ev.el.style.width  = (<span class="num">100</span> / n) + <span class="str">'%'</span>;   <span class="cm">// two events: half each; three: a third each; never stacked</span>
  ev.el.style.left   = col * (<span class="num">100</span> / n) + <span class="str">'%'</span>;
}
scroller.scrollTop = nowMinutes * PX_PER_MIN - <span class="num">120</span>; <span class="cm">// open scrolled to now (with a little context above), not midnight</span></code></pre>
