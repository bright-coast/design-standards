---
id: grid-min-width-zero
title: Min-Width Zero for Grid and Flex Children
category: visual
order: 25
---
## Rule
<p>A grid or flex item defaults to <code class="tok">min-width: auto</code>, which means it will not shrink below the intrinsic width of its content. Put a code block or any long unbroken string inside a column (a single-line shell command, a URL, a hash) and that content sets the column&rsquo;s minimum width. The column grows to fit it, the grid ends up wider than its container, and the page overflows or the column is cut off at the edge, instead of the text scrolling inside its own box. The code block&rsquo;s own <code class="tok">overflow-x: auto</code> never gets a chance to work, because the box it was meant to scroll inside has already grown to fit the content.</p>
<p>The fix has two halves that work together. Set <code class="tok">min-width: 0</code> on the grid or flex child, so it is allowed to shrink below its content, and keep <code class="tok">overflow-x: auto</code> on the <code class="tok">&lt;pre&gt;</code>, so the overflow scrolls inside the code block. For a grid you can also fix it at the track: <code class="tok">1fr</code> is shorthand for <code class="tok">minmax(auto, 1fr)</code>, so <code class="tok">minmax(0, 1fr)</code> removes the content-based minimum for that column. Treat it as a standing rule for any layout where a column can hold a code block, not a patch on the one instance that broke, because the same overflow returns on the next side-by-side pair. When the content is genuinely long, such as a full shell command, stacking the blocks top to bottom is safer than trusting side-by-side columns to shrink.</p>
## Do
- <span><code class="tok">min-width: 0</code> on every grid or flex child that can hold a code block or long string</span>
- <span><code class="tok">overflow-x: auto</code> on the <code class="tok">&lt;pre&gt;</code>, so the overflow scrolls inside its own box</span>
- <span><code class="tok">minmax(0, 1fr)</code> in place of <code class="tok">1fr</code> when you control the grid tracks</span>
- Stack genuinely long commands top to bottom instead of side by side
## Avoid
- <span>Trusting <code class="tok">1fr</code> columns to shrink around a long single-line command</span>
- Patching only the one column that broke, and leaving the same layout elsewhere
## Code: CSS
<pre><code>.two-col {
  display: grid;
  grid-template-columns: 1fr 1fr; <span class="cm">/* 1fr is minmax(auto, 1fr): a long command can widen its column */</span>
  gap: 16px;
}
.two-col &gt; * { min-width: 0; } <span class="cm">/* the child may now shrink below its content */</span>
.two-col pre { overflow-x: auto; } <span class="cm">/* the overflow scrolls inside the code block */</span></code></pre>
<pre style="margin-top:6px;"><code><span class="cm">/* alternative for a grid: fix it at the track instead of the child */</span>
.two-col { grid-template-columns: repeat(2, minmax(0, 1fr)); }

<span class="cm">/* same rule for flex: a flex item also defaults to min-width: auto */</span>
.row { display: flex; gap: 16px; }
.row &gt; * { flex: 1; min-width: 0; }</code></pre>
