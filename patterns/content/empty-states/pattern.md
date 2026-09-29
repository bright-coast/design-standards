---
id: empty-states
title: Empty States
category: content
order: 1
---
## Rule
<p>A completely blank screen reads as broken to whoever lands on it. A small illustration or icon plus a short line of copy signals &ldquo;this is intentionally empty,&rdquo; not &ldquo;something failed to load.&rdquo; Give the screen exactly one clear primary CTA that names the actual next step (&ldquo;Create your first project&rdquo;), not a vague, generic action. Any empty state worth shipping answers three questions at once: why is this empty, what should the person do about it, and does the copy teach them something about the product rather than just stating a fact. Different causes need different copy, not one shared message. First-time use gets an onboarding CTA (&ldquo;Create your first project&rdquo;). A filtered or searched view that came back empty gets a clear-filter affordance (&ldquo;No invoices match &lsquo;overdue&rsquo;, clear filter&rdquo;). Missing permissions gets an explanation plus a real path forward (&ldquo;You don't have access, ask your admin to share this&rdquo;), not a dead end. Something genuinely empty by design gets a plain, calm confirmation (&ldquo;All caught up, no pending reviews&rdquo;) rather than treating an intentional zero like a problem. A bare &ldquo;Try refreshing&rdquo; as the only available action is rarely the real fix and reads as a shrug.</p>
## Do
- One clear primary CTA, the actual next step
- Copy answers why it's empty and what to do, distinct per cause (first-run, filtered, permissions, by design)
## Avoid
- A generic &ldquo;Try refreshing&rdquo; as the only action
## Code: JS
<pre><code><span class="kw">const</span> EMPTY_STATES = {
  <span class="str">'first-run'</span>: { copy: <span class="str">'No projects yet'</span>, cta: { label: <span class="str">'Create your first project'</span>, action: createProject } },
  <span class="str">'filtered'</span>:  { copy: <span class="str">'No results match your filters'</span>, cta: { label: <span class="str">'Clear filters'</span>, action: clearFilters } },
  <span class="str">'error'</span>:     { copy: <span class="str">"Couldn't load projects"</span>, cta: { label: <span class="str">'Retry'</span>, action: reload } },
}; <span class="cm">// distinct copy per type, never one generic message for all three</span>

<span class="kw">function</span> <span class="fn">renderEmpty</span>(type) {
  <span class="kw">const</span> { copy, cta } = EMPTY_STATES[type];
  <span class="kw">return</span> <span class="str">`&lt;EmptyIllustration /&gt;&lt;p&gt;${copy}&lt;/p&gt;&lt;button onclick="${cta.action}"&gt;${cta.label}&lt;/button&gt;`</span>;
}</code></pre>
