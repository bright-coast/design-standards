---
id: tooltip
title: Tooltip Design
category: interaction
order: 22
---
## Rule
<p>A 300ms delay before a hover tooltip appears stops it firing on every accidental cursor graze. Anchor it to its trigger with an arrow, since a floating label with no arrow above a row of icons leaves people guessing which element it describes. Flip to the opposite side near a viewport edge so it never clips off-screen, and make it dismissible from every direction: mouse-leave, Escape, blur, and an outside tap. Keep the copy tight: cap the width around 300px and hold it to one sentence.</p>
## Do
- ~300ms delay before showing, arrow-anchored
- Dismissible via mouse-leave, Esc, and outside tap
## Avoid
- Documentation-length copy crammed into one tooltip
## Code: JS
<pre><code><span class="kw">let</span> showTimer;
trigger.addEventListener(<span class="str">'mouseenter'</span>, () => {
  showTimer = setTimeout(() => positionAndShow(trigger, tooltip), <span class="num">300</span>);
});
trigger.addEventListener(<span class="str">'mouseleave'</span>, () => { clearTimeout(showTimer); hide(tooltip); });

<span class="kw">function</span> <span class="fn">positionAndShow</span>(trigger, tooltip) {
  <span class="kw">const</span> rect = trigger.getBoundingClientRect();
  <span class="kw">const</span> clipsRight = rect.right + tooltip.offsetWidth > window.innerWidth;
  tooltip.dataset.side = clipsRight ? <span class="str">'left'</span> : <span class="str">'right'</span>; <span class="cm">// flips near an edge</span>
  tooltip.classList.add(<span class="str">'show'</span>);
}
document.addEventListener(<span class="str">'keydown'</span>, (e) => { <span class="kw">if</span> (e.key === <span class="str">'Escape'</span>) hide(tooltip); });</code></pre>
