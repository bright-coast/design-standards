---
id: breadcrumbs
title: Breadcrumbs
category: navigation
order: 5
---
## Rule
<p>A deep page needs a way back that does not depend on the browser&rsquo;s back button, and a breadcrumb is that way back once a hierarchy is more than two levels deep (<a href="#lp-nav-patterns">Navigation Patterns</a>, entry 02). <strong>Every level is a link except the current page:</strong> each crumb takes the person one click up to that level, and the last crumb is plain text marked with <code class="tok">aria-current="page"</code>, because a link to the page you are on does nothing. <strong>The last crumb matches the page title</strong> word for word (Invoices &rsaquo; INV-2041 on a page headed INV-2041), so the trail and the heading confirm each other.</p>
<p><strong>Past about four levels, fold the middle and keep both ends.</strong> Show the first level, an ellipsis button, and the last two levels (Home &rsaquo; &hellip; &rsaquo; 2026 &rsaquo; INV-2041); the ellipsis opens the hidden levels in a small menu. The ends carry the meaning: where the trail starts and where the person is now. <strong>On mobile, replace the trail with one back link to the parent</strong> (&lsaquo; Invoices), at least 44px tall, because a full trail wraps onto several lines or shrinks into targets too small to tap.</p>
## Do
- Every level a link, the current page plain text with <code class="tok">aria-current="page"</code>
- The last crumb matches the page title exactly
- Past about four levels: first level, an ellipsis that expands, the last two levels
- On mobile, one back link to the parent, at least 44px tall
## Avoid
- The current page shown as a link to itself
- Truncating from the start or the end instead of the middle
- A full trail on a phone that wraps or shrinks below a tappable size
## Code: HTML + CSS
<pre><code>&lt;nav aria-label="Breadcrumb"&gt;
  &lt;ol class="crumbs"&gt;
    &lt;li&gt;&lt;a href="/"&gt;Home&lt;/a&gt;&lt;/li&gt;
    &lt;li&gt;&lt;button aria-label="Show 2 more levels"&gt;&amp;hellip;&lt;/button&gt;&lt;/li&gt; <span class="cm">&lt;!-- the middle folds, the ends stay --&gt;</span>
    &lt;li&gt;&lt;a href="/billing/invoices/2026"&gt;2026&lt;/a&gt;&lt;/li&gt;
    &lt;li aria-current="page"&gt;INV-2041&lt;/li&gt; <span class="cm">&lt;!-- not a link, matches the page title --&gt;</span>
  &lt;/ol&gt;
  &lt;a class="crumb-back" href="/billing/invoices/2026"&gt;&amp;lsaquo; 2026&lt;/a&gt;
&lt;/nav&gt;

.crumb-back { display: none; }
@media (max-width: 600px) {
  .crumbs { display: none; }
  .crumb-back { display: inline-flex; align-items: center; min-height: 44px; } <span class="cm">/* one parent link, a real target */</span>
}</code></pre>
