---
id: date-picker
title: Date Pickers
category: forms
order: 2
---
## Rule
<p>Presets (Today, Last 7 days, Last 30 days, This month) cover roughly 90% of real use, so lead with them and treat a full custom range as the fallback, not the default view. Show two months side by side so a range can cross a month boundary without extra navigation, and support full keyboard control including month/year jumps for anyone picking a date far from today rather than forcing repeated &ldquo;next&rdquo; clicks. On mobile, hand the job to the platform's native date input rather than shipping a custom calendar; reach for a custom one on desktop only once the native control genuinely can't do what the screen needs. Either way, keep a typed text field as a real fallback, and let it parse plain language such as &ldquo;tomorrow&rdquo; or &ldquo;next friday&rdquo; rather than demanding a strict format.</p>
## Do
- Two months side by side, ranges cross boundaries
- A typed, parsed text field for far-past dates (birthdates), not arrow-only navigation
- Native date input on mobile; a custom calendar only where native genuinely falls short
## Avoid
- Repeated &ldquo;next&rdquo; clicks for a nearby date
## Extra: caveat-box
<div class="caveat-box"><b>Concrete cost of arrow-only navigation:</b> a calendar that opens on today's date makes a 1994 birthday cost roughly 390 clicks of a single arrow. Nobody does that, they abandon the form.</div>
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
