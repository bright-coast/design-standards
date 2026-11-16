---
id: skeleton
title: Skeleton Loading
category: feedback
order: 6
---
## Rule
<p>A skeleton previews the real content&rsquo;s shape (card outlines, text-line bars) so the brain starts parsing the layout before the actual data has arrived, which measurably reduces the perceived wait versus a blank screen or spinner. It needs to animate (a shimmer sweep) and match the real content&rsquo;s dimensions closely, or the layout visibly jumps the moment data replaces it. Skip a loading state entirely for an action just performed by the same user (like a submit that immediately shows its own result); they already know it&rsquo;s working.</p>
<p>Shape each block like the thing it stands in for: a circle for an avatar, a short bar for a name, longer bars for body text, a rounded rectangle for an image. The shimmer sweeps in the reading direction, left to right in a left-to-right language and right to left under <code class="tok">dir="rtl"</code>, so it travels the way the eye will read the content that replaces it.</p>
## Do
- Animate the shimmer, match real dimensions
- Circles for avatars, short bars for names, long bars for body text
- Shimmer in the reading direction, reversed under <code class="tok">dir="rtl"</code>
## Avoid
- A skeleton that jumps to a different layout on load
## Code: CSS
<pre><code>.skeleton {
  background: linear-gradient(90deg, var(--sk-base) 25%, var(--sk-shine) 50%, var(--sk-base) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.4s ease-in-out infinite;
  border-radius: 6px;
}
@keyframes shimmer { to { background-position: -200% 0; } } <span class="cm">/* sweeps left to right */</span>
[dir=<span class="str">"rtl"</span>] .skeleton { animation-direction: reverse; } <span class="cm">/* right to left for RTL reading */</span>

<span class="cm">/* match the REAL element's exact dimensions so nothing jumps on swap */</span>
.skeleton-avatar { width: 40px; height: 40px; border-radius: 50%; }
.skeleton-title  { width: 60%; height: 16px; margin-bottom: 8px; }
.skeleton-line   { width: 100%; height: 12px; }

@media (prefers-reduced-motion: reduce) { .skeleton { animation: none; opacity: .6; } }</code></pre>
