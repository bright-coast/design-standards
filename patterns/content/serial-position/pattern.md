---
id: serial-position
title: Serial Position
category: content
order: 4
---
## Rule
<p>Recall across any sequence is U-shaped: people remember the first items strongly (primacy), the last items strongly (recency), and forget almost everything sandwiched in the middle. A navbar puts the logo first and the primary CTA last for exactly this reason; both sit in the high-recall positions by construction. On a landing page or pricing list, lead with the single strongest selling point and close with the single strongest piece of proof, and never let a genuinely critical CTA end up stranded in the low-recall middle of a long list of options.</p>
<p>The same shape applies to an onboarding sequence. The first step is the hook, the one thing that shows why the product is worth the setup; the last step is the payoff, the moment the person sees their own result. Lower-value steps (preferences, notification settings) go in the middle, or move out of onboarding altogether (<a href="#lp-first-run-onboarding">First Run Without a Tour</a>, entry 05).</p>
## Do
- Logo leads a navbar, primary CTA closes it
- Onboarding opens on the hook and ends on the payoff, with lower-value steps in the middle
## Avoid
- Burying a critical CTA in the low-recall middle
## Code: HTML structure
<pre><code><span class="tag">&lt;nav&gt;</span>
  <span class="tag">&lt;div</span> <span class="prop">class</span>=<span class="str">"logo"</span><span class="tag">&gt;</span>...<span class="tag">&lt;/div&gt;</span>          <span class="cm">&lt;!-- first position, high recall --&gt;</span>
  <span class="tag">&lt;div</span> <span class="prop">class</span>=<span class="str">"nav-links"</span><span class="tag">&gt;</span>...<span class="tag">&lt;/div&gt;</span>     <span class="cm">&lt;!-- middle, lowest recall, least critical items go here --&gt;</span>
  <span class="tag">&lt;button</span> <span class="prop">class</span>=<span class="str">"cta-primary"</span><span class="tag">&gt;</span>Sign up<span class="tag">&lt;/button&gt;</span> <span class="cm">&lt;!-- last position, high recall --&gt;</span>
<span class="tag">&lt;/nav&gt;</span>
<span class="cm">&lt;!-- pricing list: strongest USP first, strongest proof/guarantee last, nothing critical in the middle --&gt;</span></code></pre>
