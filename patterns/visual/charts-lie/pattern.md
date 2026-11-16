---
id: charts-lie
title: Charts That Lie
category: visual
order: 2
---
## Rule
<p>Every bar chart&rsquo;s y-axis starts at zero. Truncating it to, say, 90-100 turns a genuinely small 2% change into a bar that looks three times taller than its neighbour, which is a factual misrepresentation even if every number on the chart is technically correct. Match the chart type to the actual question being asked (trend over time is a line, comparison across categories is a bar, part-of-whole is rarely a pie), and title the chart with the takeaway itself, not the bare metric name. Skip gridlines, 3D extrusion, or decorative elements that encode no real data; they add visual noise without adding information.</p>
<p><strong>Zero, and the line chart exception.</strong> Bars always start at zero, because their length is the value. A line chart may skip zero when the change is the point (a temperature or a share price), but only with a clearly labelled axis that shows where it starts. <strong>Pies:</strong> a pie with more than about five slices cannot be read; use a sorted bar chart instead. <strong>Palette type follows the data:</strong> categorical colours (distinct hues) for separate groups, a sequential palette (one hue, light to dark) for magnitude, and a diverging palette (two hues meeting at a neutral midpoint) for values above and below a meaningful middle such as zero or a target.</p>
<p><strong>Emphasis and labels.</strong> The takeaway series is in the accent colour and every other series grey, so title and colour point at the same thing. Label lines at their ends instead of in a legend. Past about five series, a chart turns to spaghetti; switch to a sortable table or to small multiples (one small chart per series, on shared axes). Annotate notable spikes and dips on the chart itself with their cause (Pricing change, Outage). <strong>Aspect ratio:</strong> as a guideline rather than a law, pick a width and height for a line chart that keeps its important slopes near 45 degrees; too wide flattens real change, too tall exaggerates noise.</p>
## Do
- Chart type matched to the actual question
- One accent series, the rest grey
## Avoid
- Gridlines/3D that encode no real data
- A pie with more than about five slices
- A categorical rainbow on data that is really a magnitude
## Code: JS: chart config
<pre><code><span class="kw">const</span> chartConfig = {
  type: <span class="str">'bar'</span>,
  scales: { y: { beginAtZero: <span class="kw">true</span> } }, <span class="cm">// non-negotiable, truncation misrepresents the data</span>
  plugins: {
    title: { text: <span class="str">'Signups grew 34% after the pricing change'</span> }, <span class="cm">// the takeaway, not "Signups"</span>
    legend: { display: <span class="kw">false</span> }, <span class="cm">// only shown when there's more than one series</span>
  },
  elements: { bar: { borderWidth: <span class="num">0</span> } }, <span class="cm">// no 3D bevel, no decorative gridlines</span>
};</code></pre>
