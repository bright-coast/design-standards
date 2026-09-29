---
id: slop-writing
title: Writing and Copy Tells
category: ai-slop
order: 6
---
## Rule
<p><strong>Don&rsquo;t.</strong> Write with the fingerprints of machine text: the three words a model is said to be told never to use (genuinely, honestly, straightforward), the &ldquo;not X, not Y, but Z&rdquo; pivot, and the social-post hooks and beats. In an interface the same defaults show up as templated copy: a personalised greeting beside a bare number, an adjective-plus-noun headline, and a trust number nobody can check. Those three are covered in Visual, entries 21 and 22.</p>
<p><strong>Why it reads as machine-made.</strong> The word list carries the stated reason that a word which insists on honesty reads as the opposite, so the instruction is to state the point and stop. The negation pivot is a dead giveaway; it comes in three shapes, the drumbeat triad (&ldquo;Not a tool, not a platform, not a budget line. A person.&rdquo;), the reversal (&ldquo;It is not mysterious. It is ten jobs.&rdquo;) and the appositive pivot (&ldquo;a figure, not an adjective&rdquo;). Social-post hooks and beats make a draft read as ghost-written or generated.</p>
<p><strong>Fix.</strong> State the thing that is true and stop. Lead with a fact or a specific detail only the author would know, close with a request or a link rather than a tidy two-beat, and apply one test: if the draft would be equally plausible under 50 other people&rsquo;s names, it is too generic.</p>
## Do
- <span>State the point and stop; lead with a specific fact; keep plain factual negation.</span>
## Avoid
- <span>The words genuinely, honestly and straightforward (said to be banned outright in an extracted AI system prompt; unverified).</span>
- <span>The negation pivot: the drumbeat triad, the reversal and the appositive pivot.</span>
- <span>Hero-line openers and hooks (&ldquo;X is broken.&rdquo;, &ldquo;Here&rsquo;s the thing.&rdquo;, &ldquo;Here&rsquo;s why this matters.&rdquo;, a rhetorical question).</span>
- <span>Rule-of-three beats, parallel negation lists (&ldquo;No layers, no gatekeepers, no waiting.&rdquo;), &ldquo;The bar is simple.&rdquo; setups, a tidy two-part closer, and every sentence on its own line for effect.</span>
## Extra: caveat-box
<div class="caveat-box"><b>Partly unverified.</b> The three words come from a publicly shared copy of an extracted AI system prompt; that copy&rsquo;s authenticity and completeness are unconfirmed, and the claim that banning them makes output stop sounding machine-made is untested. The pivot and the hooks and beats are editing judgements from draft reviews, not researched claims. Plain factual negation (&ldquo;the technology does not supervise itself&rdquo;) is not the tell; the reflexive antithesis used as a constant cadence is.</div>
## Code: TEXT
<pre><code><span class="cm">sweep list, writing and copy</span>
words (from an extracted AI prompt, unverified)
  genuinely   honestly   straightforward

negation pivot, three shapes (plain factual negation stays)
  drumbeat triad     "Not a tool, not a platform, not a budget line. A person."
  reversal           "It is not mysterious. It is ten jobs."
  appositive pivot   "a figure, not an adjective"

hooks and beats
  "X is broken."   "Here's the thing."   "Here's why this matters."   a rhetorical-question opener
  rule of three   parallel negation list   "The bar is simple."   a tidy two-part closer   one sentence per line

test: would this draft be equally plausible under 50 other people's names? If yes, it is too generic.</code></pre>
