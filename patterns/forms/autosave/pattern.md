---
id: autosave
title: Autosave
category: forms
order: 1
---
## Rule
<p>Firing a save on every keystroke floods the network with redundant requests, so debounce writes to one clean save after roughly a second of pause. Status needs to be an honest state machine: idle, saving, saved, error, never a lie like a permanent &ldquo;Saved&rdquo; label that stopped being true the moment the network dropped. Queue edits made offline and replay them oldest-first on reconnect, and guard unsaved work with <code class="tok">beforeunload</code> so a stray tab-close doesn&rsquo;t silently lose a paragraph.</p>
## Do
- Queue edits offline, replay oldest-first on reconnect
## Avoid
- Silent last-write-wins across two open tabs
## Code: JS
<pre><code><span class="kw">let</span> saveTimer, status = <span class="str">'idle'</span>;

<span class="kw">function</span> <span class="fn">onEdit</span>(value) {
  setStatus(<span class="str">'idle'</span>);
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => save(value), <span class="num">1000</span>); <span class="cm">// debounced, not per-keystroke</span>
}

<span class="kw">async function</span> <span class="fn">save</span>(value) {
  setStatus(<span class="str">'saving'</span>);
  <span class="kw">try</span> { <span class="kw">await</span> api.save(value); setStatus(<span class="str">'saved'</span>); }
  <span class="kw">catch</span> { setStatus(<span class="str">'error'</span>); queueOffline(value); } <span class="cm">// replayed oldest-first on reconnect</span>
}

window.addEventListener(<span class="str">'beforeunload'</span>, (e) => {
  <span class="kw">if</span> (status === <span class="str">'idle'</span>) e.preventDefault(); <span class="cm">// unsaved edit pending</span>
});</code></pre>
