---
id: design-rationale-comments
title: Design Rationale Comments
category: interaction
order: 34
---
## Rule
<p>A code comment earns its place when it explains a reason a future reader cannot see in the code itself: why the Delete button sits in the overflow menu, why a table hides two columns under 1024px, why a toast stays for 6 seconds and not 3. The code already says what it does; the comment says why it has to be that way, so the next person does not undo a decision they could not see.</p>
<p>A comment never points at the brief, the ticket thread or the conversation that produced it (as requested, per the brief, as discussed). The next reader has none of that, and the pointer means nothing once the conversation is forgotten. Write the reason itself, in one line, next to the code it explains.</p>
## Do
- A one-line reason the code cannot show on its own
- The comment placed next to the code it explains
## Avoid
- Comments such as as requested, per the brief or as discussed
- A comment that only repeats what the code already says
## Code: JSX
<pre><code><span class="cm">// Avoid: points at a conversation the next reader never saw</span>
<span class="cm">// moved Delete into the menu, as requested in the brief</span>

<span class="cm">// Do: the reason itself</span>
<span class="cm">// Delete lives in the overflow menu: a visible button on every row gets hit by mistake</span>
&lt;RowMenu items={[{ label: <span class="str">'Delete invoice'</span>, onSelect: confirmDelete }]} /&gt;</code></pre>
