---
id: destructive
title: Destructive Actions
category: interaction
order: 9
---
## Rule
<p>Name the action on the button itself: &ldquo;Delete project&rdquo; instead of a generic &ldquo;Yes&rdquo;, because the verb is the actual warning and nobody reads &ldquo;are you sure?&rdquo; Hold-to-confirm turns the gesture itself into the safeguard: a ring fills over roughly 300ms of a held press, and releasing early cancels outright. Never place a destructive button where a confirm button usually lives, since muscle memory clicks the familiar spot without reading it, and spend red only on real destruction; a red logout button cries wolf and makes the real delete look routine.</p>
## Do
- Hold-to-confirm as the actual safeguard, not a dialog
- Cooldown/grace period for genuinely irreversible deletes
## Avoid
- Spending red on anything other than real destruction
## Code: CSS + JS
<pre><code>.hold-confirm { position: relative; overflow: hidden; }
.hold-confirm .ring {
  position: absolute; inset: 0;
  background: rgb(192 57 43 / .25);
  transform: scaleX(0); transform-origin: left;
  transition: transform 300ms linear;
}
.hold-confirm.holding .ring { transform: scaleX(1); }

<span class="kw">let</span> timer;
btn.addEventListener(<span class="str">'pointerdown'</span>, () => {
  btn.classList.add(<span class="str">'holding'</span>);
  timer = setTimeout(() => deleteProject(), <span class="num">300</span>); <span class="cm">// matches the ring's transition</span>
});
[<span class="str">'pointerup'</span>, <span class="str">'pointerleave'</span>].forEach(ev =>
  btn.addEventListener(ev, () => {
    clearTimeout(timer); <span class="cm">// released early, cancelled</span>
    btn.classList.remove(<span class="str">'holding'</span>);
  })
);</code></pre>
