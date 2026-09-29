---
id: copy-to-clipboard
title: Copy to Clipboard
category: feedback
order: 11
---
## Rule
<p>A copy button changes nothing on screen by itself, so it has to prove it worked. <strong>1. Flip instantly.</strong> The copy icon becomes a check on the same frame the copy fires, with no spinner and no delay; a 480ms spinner feels broken next to a 0ms flip. <strong>2. Reset after two seconds.</strong> Hold the check for about two seconds, then fade back to the copy icon; if it stays stuck, the second copy gives no signal at all. <strong>3. Copy the raw value.</strong> Copy the plain string, not the formatted span with its line breaks and hidden zero-width characters, which break when pasted into a terminal (the demo shows a parse error against &ldquo;authenticated&rdquo;). <strong>4. Say it out loud.</strong> A silent icon change is invisible to a screen reader, so announce &ldquo;Copied&rdquo; through a polite <code class="tok">aria-live</code> region. <strong>5. Fall back, don&rsquo;t lie.</strong> On an insecure origin (for example plain http) the modern clipboard call fails, so try <code class="tok">navigator.clipboard.writeText</code>, catch the failure, fall back to the older <code class="tok">execCommand</code> copy, and show an honest message if both are blocked. A silent button lies.</p>
## Do
- The icon flips to a check on the same frame the copy fires, no spinner
- The check holds for about 2 seconds, then fades back to the copy icon
- Copy the raw string, never the formatted span
- Announce &ldquo;Copied&rdquo; through a polite <code class="tok">aria-live</code> region
- Try the modern call, catch, fall back to <code class="tok">execCommand</code>, and show an honest message if both are blocked
## Avoid
- A spinner or delay between the click and the confirmation
- A check that never resets, so the second copy gives no signal
- A silent failure, or a check shown when nothing was copied
## Extra: caveat-box
<div class="caveat-box"><b>Two accuracy notes.</b> On an insecure origin the modern clipboard API is usually unavailable altogether (<code class="tok">navigator.clipboard</code> is undefined) rather than failing silently, so check for it before calling it. And <code class="tok">document.execCommand(&#39;copy&#39;)</code> is officially deprecated though still widely supported, so treat the fallback as pragmatic, not ideal. Related entries: Toast Notifications, Undo UX and Interactive State &amp; Affordance.</div>
## Code: JS
<pre><code><span class="kw">async function</span> <span class="fn">copyRaw</span>(btn, live) {
  <span class="kw">const</span> raw = btn.dataset.copy;           <span class="cm">// the plain string, never the formatted span's innerText (line breaks, zero-width characters)</span>
  <span class="kw">const</span> ok = <span class="kw">await</span> <span class="fn">writeClipboard</span>(raw); <span class="cm">// no spinner state exists between the click and the check</span>
  <span class="kw">if</span> (!ok) { live.textContent = <span class="str">'Could not copy. Select the text and press Ctrl+C.'</span>; <span class="kw">return</span>; } <span class="cm">// an honest message, not a lying check</span>
  btn.classList.add(<span class="str">'copied'</span>);          <span class="cm">// copy icon becomes a check, instantly</span>
  live.textContent = <span class="str">'Copied'</span>;           <span class="cm">// polite aria-live region: screen readers announce it</span>
  setTimeout(() =&gt; { btn.classList.remove(<span class="str">'copied'</span>); live.textContent = <span class="str">''</span>; }, <span class="num">2000</span>); <span class="cm">// reset after about 2 seconds, fade back</span>
}

<span class="kw">async function</span> <span class="fn">writeClipboard</span>(text) {
  <span class="kw">try</span> { <span class="kw">await</span> navigator.clipboard.writeText(text); <span class="kw">return true</span>; } <span class="cm">// navigator.clipboard is undefined on insecure origins, so this throws</span>
  <span class="kw">catch</span> (_) {
    <span class="kw">const</span> ta = Object.assign(document.createElement(<span class="str">'textarea'</span>), { value: text });
    document.body.appendChild(ta); ta.select();
    <span class="kw">const</span> ok = document.execCommand(<span class="str">'copy'</span>); <span class="cm">// deprecated but still widely supported: pragmatic, not ideal</span>
    ta.remove();
    <span class="kw">return</span> ok; <span class="cm">// false = both paths blocked, so tell the user</span>
  }
}
<span class="cm">&lt;!-- &lt;div id="copy-live" aria-live="polite"&gt;&lt;/div&gt;  the live region must already exist in the DOM --&gt;</span></code></pre>
