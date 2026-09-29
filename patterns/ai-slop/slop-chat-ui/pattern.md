---
id: slop-chat-ui
title: Chat UI Tells
category: ai-slop
order: 4
---
## Rule
<p><strong>Don&rsquo;t.</strong> Leave a chat thread on its defaults: messages from one sender not grouped, a timestamp on every bubble, a spinner while a sent message waits for the server, a list that jumps to the bottom whenever something arrives, a typing indicator pinned away from the thread, and a composer that keeps growing until it pushes the thread out of view.</p>
<p><strong>Why it reads as machine-made.</strong> Each is a default nobody decided; Chat UI System says a thread reads as considered or as generated on these six decisions. Treat this family as unconsidered rather than proven generated.</p>
<p><strong>Fix.</strong> One line per decision below. The full write-up and the code live in Chat UI System (Interaction, entry 23), which stays where it is.</p>
## Avoid
- <span>No grouping, so the eye re-parses who is talking on every line. Fix: one avatar per run, about 4px inside a group and about 16px between senders.</span>
- <span>A timestamp printed on every bubble. Fix: a relative date divider, with the exact time on hover.</span>
- <span>A spinner while the sent message waits on the server. Fix: the bubble lands first (optimistic send).</span>
- <span>A list that jumps to the bottom when a message arrives. Fix: a &ldquo;new messages&rdquo; pill, and auto-scroll only if the person was already at the bottom.</span>
- <span>A typing indicator in a fixed status line away from the thread. Fix: show it inline, in the sender&rsquo;s own row.</span>
- <span>A composer that grows forever. Fix: grow to about five lines, then scroll inside the box.</span>
## Code: TEXT
<pre><code><span class="cm">review pass, chat UI (details and CSS: Interaction, entry 23)</span>
[ ] messages from one sender not grouped         -&gt; one avatar per run, 4px inside, 16px between
[ ] a timestamp on every bubble                  -&gt; date divider, exact time on hover
[ ] a spinner while a sent message waits         -&gt; the bubble lands first
[ ] the list jumps to the bottom on arrival      -&gt; "new messages" pill
[ ] a typing indicator away from the thread      -&gt; inline, in the sender's own row
[ ] a composer that grows forever                -&gt; about five lines, then it scrolls</code></pre>
