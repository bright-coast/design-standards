---
id: charts-lie
title: Charts That Lie
category: visual
order: 2
---
## Rule
<p>Every bar chart&rsquo;s y-axis starts at zero. Truncating it to, say, 90-100 turns a genuinely small 2% change into a bar that looks three times taller than its neighbour, which is a factual misrepresentation even if every number on the chart is technically correct. Match the chart type to the actual question being asked (trend over time is a line, comparison across categories is a bar, part-of-whole is rarely a pie), and title the chart with the takeaway itself, not the bare metric name. Skip gridlines, 3D extrusion, or decorative elements that encode no real data; they add visual noise without adding information.</p>
## Do
- Chart type matched to the actual question
## Avoid
- Gridlines/3D that encode no real data
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
