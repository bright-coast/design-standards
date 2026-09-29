---
id: jakob
title: Jakob’s Heuristic
category: psychology
order: 3
---
## Rule
<p>Users expect your product to work like the products they already know. Picture the bottom bars of a photo app, a video app and &ldquo;your app&rdquo; all sharing the same layout. This is Jakob&rsquo;s heuristic, often written up as &ldquo;Jakob&rsquo;s law&rdquo;; it is a research-backed heuristic, not a law.</p>
<p>The rule already in this library that applies it is in Navigation Patterns (Navigation, entry 02): match the pattern to the platform&rsquo;s own convention rather than personal taste.</p>
## Do
- Reuse the layout and behaviour users already know from the products they use
- Match the platform&rsquo;s own navigation convention (Navigation Patterns)
## Avoid
- A product that behaves unlike the ones its users already know, with no reason to
## Code: CSS
<pre><code><span class="cm">/* the familiar mobile layout: a bottom bar with a few evenly spaced tabs, as in the apps people already use */</span>
.tab-bar { position: fixed; bottom: 0; left: 0; right: 0; display: flex; justify-content: space-around; }</code></pre>
