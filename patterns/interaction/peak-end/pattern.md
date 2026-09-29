---
id: peak-end
title: Peak-End Rule
category: interaction
order: 18
---
## Rule
<p>The brain doesn&rsquo;t average an experience. It stores the most intense moment (the peak) and the final moment (the end), then judges the whole flow from those two points alone. Two flows with an identical average satisfaction are remembered completely differently depending on how they finish. Engineer at least one intentional peak (a surprise, a moment of delight) and make sure the ending lands on a high note rather than a flat confirmation. The reverse also holds, and a broken final step tanks the memory of an otherwise smooth flow.</p>
## Do
- Engineer one deliberate peak partway through a flow
- End on a celebratory note, not a flat confirmation
## Avoid
- Spreading effort evenly while the finish gets neglected
## Code: JS: flow annotation
<pre><code><span class="cm">// annotate the flow explicitly, the peak and end are design decisions,</span>
<span class="cm">// not something to discover after the fact</span>
<span class="kw">const</span> onboardingFlow = [
  { step: <span class="str">'Welcome'</span> },
  { step: <span class="str">'Connect calendar'</span> },
  { step: <span class="str">'AI setup'</span>, peak: <span class="kw">true</span>, note: <span class="str">'pre-fills from their own site, the surprise'</span> },
  { step: <span class="str">'Done'</span>, end: <span class="kw">true</span>, note: <span class="str">'a real win shown, not a flat "Setup complete"'</span> },
];</code></pre>
