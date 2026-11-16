---
id: date-picker
title: Date Pickers
category: forms
order: 2
---
## Rule
<p>Presets (Today, Last 7 days, Last 30 days, This month) cover roughly 90% of real use, so lead with them and treat a full custom range as the fallback, not the default view. Show two months side by side so a range can cross a month boundary without extra navigation, and support full keyboard control including month/year jumps for anyone picking a date far from today rather than forcing repeated &ldquo;next&rdquo; clicks. On mobile, hand the job to the platform's native date input rather than shipping a custom calendar; reach for a custom one on desktop only once the native control genuinely can't do what the screen needs. Either way, keep a typed text field as a real fallback, and let it parse plain language such as &ldquo;tomorrow&rdquo; or &ldquo;next friday&rdquo; rather than demanding a strict format.</p>
<p><strong>Picking a range.</strong> The first click sets the start and the second sets the end; between them, hovering a date previews the range as it would be, so people see the span before they commit. Once set, both edges can be dragged to adjust the range without starting again. On wide screens (about 1200px and up) show a third month, so a range of several weeks fits without paging.</p>
## Do
- Two months side by side, ranges cross boundaries
- Two clicks for a range, a hover preview between them, and draggable edges once set
- A typed, parsed text field for far-past dates (birthdates), not arrow-only navigation
- Native date input on mobile; a custom calendar only where native genuinely falls short
## Avoid
- Repeated &ldquo;next&rdquo; clicks for a nearby date
## Extra: caveat-box
<div class="caveat-box"><b>Concrete cost of arrow-only navigation:</b> a calendar that opens on today's date makes a 1994 birthday cost roughly 390 clicks of a single arrow. Nobody does that, they abandon the form.</div>
## Extra: variant-note
<div class="variant-note"><b>Mobile date picking, two variants.</b> Variant A: hand the job to the platform&rsquo;s native date input (this entry). Use when: picking a single date, which native inputs do well. Variant B: a full-screen sheet with months scrolling vertically, the range filled in as it is picked, and a large confirm button fixed at the bottom (Select 12 to 15 Mar). Use when: picking a range, which native inputs handle poorly, since they need two separate fields and show no span between them. Both are kept on purpose.</div>
## Code: JS
<pre><code><span class="kw">const</span> PRESETS = [
  { label: <span class="str">'Today'</span>, range: () => [today(), today()] },
  { label: <span class="str">'Last 7 days'</span>, range: () => [daysAgo(<span class="num">7</span>), today()] },
  { label: <span class="str">'Last 30 days'</span>, range: () => [daysAgo(<span class="num">30</span>), today()] },
  { label: <span class="str">'This month'</span>, range: () => [startOfMonth(), today()] },
]; <span class="cm">// custom range is a separate, secondary tab, not the default view</span>

picker.addEventListener(<span class="str">'keydown'</span>, (e) => {
  <span class="kw">if</span> (e.key === <span class="str">'PageUp'</span>) shiftMonth(e.shiftKey ? -<span class="num">12</span> : -<span class="num">1</span>); <span class="cm">// shift+PageUp = year jump</span>
  <span class="kw">if</span> (e.key === <span class="str">'PageDown'</span>) shiftMonth(e.shiftKey ? <span class="num">12</span> : <span class="num">1</span>);
});</code></pre>
