---
id: chat-ui-system
title: Chat UI System
category: interaction
order: 23
---
## Rule
<p>A chat thread reads as considered or as generated based on six small decisions, not one big one. <strong>Grouping</strong>: consecutive messages from the same sender share one avatar/name, with tight spacing inside the group (~4px) and a visibly looser gap between different senders (~16px), so the eye reads "who's talking" without re-parsing every line. <strong>Timestamps</strong>: a relative date divider by default ("Today", "2 min"), with the precise timestamp only on hover, not printed on every single bubble. <strong>Optimistic send</strong>: the bubble you just sent renders instantly, before the server confirms it, so sending never feels like it's waiting on the network. <strong>Scroll anchoring</strong>: a new incoming message never yanks someone who's scrolled up back to the bottom; show a "new messages" pill instead, and only auto-scroll if they were already at the bottom when it arrived. <strong>Typing indicator</strong>: lives inline in the message flow itself, in the sender's own row, not as a separate fixed status line disconnected from where the message will actually appear. <strong>Composer</strong>: the input grows with content up to a cap (around 5 lines), then switches to its own internal scroll rather than pushing the whole thread up indefinitely.</p>
<p><strong>The composer under load.</strong> Anchored at the bottom, the composer grows upward as lines are added, and its toolbar (attach, options, send) stays fixed in place, so the send button never moves under a thumb. Files dropped or pasted onto the composer upload inline as chips inside the input, each with its own progress and a remove control, never in a separate modal. While a response is generating, send becomes stop in exactly the same spot, and turns back into send when the response ends or is stopped.</p>
<p><strong>Honest indicators.</strong> Show a typing or working indicator only while work is really happening. No padded delay to seem thoughtful, no indicator that starts and stops over and over with nothing sent, and remove it promptly when nothing is coming.</p>
## Do
- Group consecutive same-sender messages under one avatar
- "New messages" pill instead of yanking scroll position
- Composer grows to a capped height, then scrolls internally
- Composer grows upward with a fixed toolbar; attachments upload as chips inside it
- Send swaps to stop in the same spot while a response generates
## Avoid
- A typing indicator floating outside the message flow it refers to
- A timestamp printed on every bubble instead of on hover
- An artificial typing delay, or an indicator that keeps restarting with nothing sent
## Extra: caveat-box
<div class="caveat-box"><b>Back end not included.</b> These six decisions cover front-end behaviour only. Presence, typing indicators and read receipts also need real back-end work (a live connection and presence tracking), and how typing and read receipts behave with several people in one thread is a separate decision.</div>
## Code: CSS
<pre><code><span class="cm">/* tell 01, grouping: tight within a sender, loose between senders */</span>
.msg + .msg[data-same-sender] { margin-top: 4px; }
.msg + .msg:not([data-same-sender]) { margin-top: 16px; }

<span class="cm">/* tell 04, scroll anchoring: pill instead of yanking scroll position */</span>
<span class="kw">if</span> (isScrolledToBottom(list)) list.scrollTop = list.scrollHeight; <span class="cm">// only if already at bottom</span>
<span class="kw">else</span> showNewMessagesPill(); <span class="cm">// otherwise let them stay where they are</span>

<span class="cm">/* tell 06, composer: grows to a cap, then scrolls internally */</span>
.composer { max-height: calc(5 * 1.4em); overflow-y: auto; field-sizing: content; }</code></pre>
