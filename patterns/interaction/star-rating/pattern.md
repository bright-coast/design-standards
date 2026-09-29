---
id: star-rating
title: Star Rating
category: interaction
order: 20
---
## Rule
<p>Stars should fill ahead of the cursor on hover so someone sees the value they&rsquo;re about to commit, and snap back to the saved rating when the pointer leaves without clicking. A naive build leaves it stuck on the last hovered star. Averages need fractional fill: a 4.4 renders as four full stars plus a fifth clipped to 44%, since rounding up to five full stars misrepresents the real score. Stagger the fill roughly 30ms per star left to right on commit; popping all five at once reads as flat.</p>
## Do
- Fractional fill for real averages (4.4 &rarr; 5th star at 44%)
- Preview snaps back to saved value on pointer-leave
## Avoid
- Rounding a 4.4 average up to a full 5 stars
## Code: CSS + JS
<pre><code>.star {
  background: linear-gradient(90deg, var(--star-fill) var(--fill, 0%), var(--star-empty) var(--fill, 0%));
}

<span class="kw">function</span> <span class="fn">renderAverage</span>(avg) {
  stars.forEach((star, i) => {
    <span class="kw">const</span> fill = Math.max(<span class="num">0</span>, Math.min(<span class="num">1</span>, avg - i)) * <span class="num">100</span>;
    star.style.setProperty(<span class="str">'--fill'</span>, fill + <span class="str">'%'</span>); <span class="cm">// 4.4 -> stars 1-4 at 100%, star 5 at 40%</span>
  });
}

row.addEventListener(<span class="str">'pointerleave'</span>, () => renderAverage(savedRating)); <span class="cm">// snap back, don't stay stuck</span>
star.addEventListener(<span class="str">'pointerenter'</span>, (i) => previewFill(i));</code></pre>
