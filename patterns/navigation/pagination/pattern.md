---
id: pagination
title: Pagination
category: navigation
order: 3
---
## Rule
<p>Cursor-based pagination (a pointer to &ldquo;the row after this ID&rdquo;) stays stable even while rows are actively being inserted or deleted underneath it; offset-based pagination (&ldquo;skip N rows&rdquo;) silently duplicates or skips rows the instant the underlying dataset shifts between page loads, because &ldquo;row 20&rdquo; refers to a different row than it did a second ago. Keep the current page (or cursor) in the URL so a reload or a shared link lands on the same page instead of resetting to page one, and restore the scroll position when returning from a detail view back to a list.</p>
## Do
- Page number lives in the URL
## Avoid
- Rendering every page-number link, not truncated
## Code: JS
<pre><code><span class="cm">// cursor pagination, stable even while rows are being inserted/deleted concurrently</span>
<span class="kw">async function</span> <span class="fn">fetchPage</span>(cursor) {
  <span class="kw">const</span> res = <span class="kw">await</span> api.get(<span class="str">`/items?after=${cursor ?? ''}&limit=20`</span>);
  <span class="kw">const</span> url = <span class="kw">new</span> URL(location);
  url.searchParams.set(<span class="str">'cursor'</span>, res.nextCursor); <span class="cm">// lives in the URL, reload/share lands on the same page</span>
  history.replaceState(<span class="kw">null</span>, <span class="str">''</span>, url);
  <span class="kw">return</span> res.items;
}

<span class="cm">// on returning from a detail view</span>
sessionStorage.setItem(<span class="str">'list-scroll'</span>, String(window.scrollY)); <span class="cm">// saved before navigating away</span>
window.scrollTo(<span class="num">0</span>, Number(sessionStorage.getItem(<span class="str">'list-scroll'</span>) ?? <span class="num">0</span>)); <span class="cm">// restored on return</span></code></pre>
