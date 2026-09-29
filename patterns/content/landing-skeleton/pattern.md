---
id: landing-skeleton
title: Landing Page Skeleton
category: content
order: 2
---
## Rule
<p>Hero &rarr; Proof &rarr; Problem &rarr; Solution &rarr; CTA is the fixed order high-converting landing pages follow, because it mirrors how someone actually decides to trust a page: first orient (what is this), then trust (who else uses it), then feel the pain point, then see the fix, then act. The hero itself needs to answer what/who/why within about three seconds of landing, before anyone has scrolled at all. Repeat the same CTA at both the top and bottom of the page rather than making someone scroll all the way back up once they&rsquo;re convinced. Burying social proof at the very bottom wastes it; it works hardest placed early, right after the hero.</p>
## Do
- Hero answers what/who/why in ~3 seconds
## Avoid
- Burying social proof at the bottom
## Code: HTML structure
<pre><code><span class="tag">&lt;section</span> <span class="prop">class</span>=<span class="str">"hero"</span><span class="tag">&gt;</span>      <span class="cm">&lt;!-- answers what/who/why in ~3s --&gt;</span>
<span class="tag">&lt;section</span> <span class="prop">class</span>=<span class="str">"proof"</span><span class="tag">&gt;</span>     <span class="cm">&lt;!-- logos/testimonials, early, not buried at the bottom --&gt;</span>
<span class="tag">&lt;section</span> <span class="prop">class</span>=<span class="str">"problem"</span><span class="tag">&gt;</span>   <span class="cm">&lt;!-- the pain point, named specifically --&gt;</span>
<span class="tag">&lt;section</span> <span class="prop">class</span>=<span class="str">"solution"</span><span class="tag">&gt;</span>  <span class="cm">&lt;!-- how the product actually fixes it --&gt;</span>
<span class="tag">&lt;section</span> <span class="prop">class</span>=<span class="str">"cta-final"</span><span class="tag">&gt;</span> <span class="cm">&lt;!-- SAME cta as the hero, not a scroll back up --&gt;</span></code></pre>
