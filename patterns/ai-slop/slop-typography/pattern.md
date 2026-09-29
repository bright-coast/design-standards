---
id: slop-typography
title: Typography Tells
category: ai-slop
order: 3
---
## Rule
<p><strong>Don&rsquo;t.</strong> Set one line height on everything, so a large heading and a paragraph of body text share the same leading.</p>
<p><strong>Why it reads as machine-made.</strong> The same line height everywhere is often called an &ldquo;AI tell&rdquo;. That claim is plausible but unverified.</p>
<p><strong>Fix.</strong> Let line height move opposite to size: about 1.1 on headings and about 1.5 on body text. The fix is ordinary typographic practice whether or not the tell claim holds; it is rule 5 of Typography as a System (Visual, entry 24).</p>
## Do
- <span>About 1.1 on headings and about 1.5 on body text, because the rule stands on its own.</span>
## Avoid
- <span>The same line height on headings and body text (often called an AI tell; unverified).</span>
## Extra: caveat-box
<div class="caveat-box"><b>One tell here, and it is unverified.</b> Of the seven rules in Typography as a System, only the line-height one is called an AI tell. The other six (one font family, five sizes on one ratio, three text colours, two weights, letter spacing, and a 45 to 75 character measure with tabular figures) are its defaults for a considered type system, not tells, so they are not repeated as tells here.</div>
## Code: CSS
<pre><code><span class="cm">/* don't: one line height on everything (often called an AI tell; unverified) */</span>
body, h1, h2, p { line-height: 1.4; }

<span class="cm">/* fix: line height moves opposite to size */</span>
h1, h2 { line-height: 1.1; }
p      { line-height: 1.5; }</code></pre>
