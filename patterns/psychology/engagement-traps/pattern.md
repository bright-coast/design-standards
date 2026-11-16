---
id: engagement-traps
title: Engagement Traps
category: psychology
order: 6
---
## Rule
<p>Some engagement patterns work by removing the moments where people decide to stop. Never design them in to keep people using a product longer than they meant to; give every one of them its honest alternative. <strong>Endless feeds:</strong> a feed with no end has no point where the person decides whether to carry on. Where wellbeing matters, give it one: a clear end or an All caught up marker once the new items run out, or pages, or a Load more button (<a href="#lp-pagination">Pagination</a>, Navigation entry 03). <strong>Autoplay:</strong> playing the next item automatically removes the pause in which people choose to leave, so autoplay of the next item is off by default and the person opts in; a countdown with a clear Cancel is the least it needs when it is on.</p>
<p><strong>Variable rewards:</strong> never make a refresh or a reveal work like a slot machine, where an unpredictable payoff (sometimes something, often nothing) keeps people pulling. Pull to refresh loads real updates and says so when there are none (No new posts since 9:41). <strong>Streaks:</strong> a streak turns a habit into something people are afraid to lose, so if a product uses streaks it builds in forgiveness: a streak freeze or a missed day allowed each week, and no alarming warnings at midnight. Use them only where coming back genuinely helps the person, such as learning or health. <strong>Social obligation:</strong> limit notifications built on obligation (Someone liked your photo, a friend is waiting for your reply) and let people choose which ones they get, each type with its own switch in settings; never send them in timed drips to pull people back (<a href="#lp-notification-system">Notification System</a>, Feedback entry 04).</p>
## Do
- A clear end or All caught up marker on a feed where wellbeing matters
- Autoplay of the next item off by default, opt in, with a visible Cancel
- Refresh that loads real updates and says plainly when there are none
- Streaks with forgiveness built in, used only where coming back helps the person
- A switch for every type of social notification
## Avoid
- A feed with no end, built so nobody reaches a point to stop
- A refresh or reveal with deliberately unpredictable payoffs
- A streak that is lost forever after one missed day, with warnings designed to cause anxiety
- Social notifications drip-fed to pull people back
## Code: JS
<pre><code><span class="kw">function</span> <span class="fn">renderFeedEnd</span>(newItems) {
  <span class="kw">if</span> (newItems.length === <span class="num">0</span>) <span class="kw">return</span> showMarker(<span class="str">'All caught up'</span>); <span class="cm">// a real stopping point</span>
}
<span class="kw">const</span> settings = {
  autoplayNext: <span class="kw">false</span>,                  <span class="cm">// opt in, never on by default</span>
  streakFreezesPerWeek: <span class="num">1</span>,            <span class="cm">// forgiveness built in</span>
  notify: { likes: <span class="kw">false</span>, replies: <span class="kw">true</span> }, <span class="cm">// each social type has its own switch</span>
};</code></pre>
