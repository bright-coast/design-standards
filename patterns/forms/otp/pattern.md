---
id: otp
title: OTP Input
category: forms
order: 7
---
## Rule
<p>Model the code as a single string in state, not six independent input boxes each tracking their own value; six-box implementations are where paste handling reliably breaks. Treat paste as the primary entry path rather than an edge case, since most codes are copied from an SMS or authenticator app, not typed digit by digit. Auto-advance focus to the next box as each digit lands, let backspace on an empty box jump back to the previous one, and gate resend behind a visible countdown so the retry button isn&rsquo;t just sitting there inviting spam.</p>
<p>Tag the input with <code class="tok">inputmode="numeric"</code> and <code class="tok">autocomplete="one-time-code"</code>. Together they are what let a phone autofill the SMS code.</p>
<p>Colour is reserved for verdicts. Keep the UI neutral (light and grey) while the code is being entered: green appears only when the code is correct and red only when it is wrong, and those two are the only status colours in play. Keep those status colours separate from the brand accent, and see Color Accessibility (Visual, entry 03) for the second-signal rule that any colour-coded verdict still needs.</p>
## Do
- Auto-advance focus, backspace jumps back a box
- <span><code class="tok">inputmode="numeric"</code> and <code class="tok">autocomplete="one-time-code"</code> on the input, so phones autofill the SMS code</span>
- Neutral UI until a verdict: green only when the code is correct, red only when it is wrong
## Avoid
- A wrong code sitting silently, no shake/refocus
- Green or red on the boxes before the code has been judged
## Extra: caveat-box
<div class="caveat-box"><b>A flourish and an opinion, not a recommended pattern.</b> One popular animation moves the CSS <code class="tok">transform-origin</code> to the hub of a ring, so a plain <code class="tok">rotate()</code> draws an exact circle and the whole spin is two keyframes (<code class="tok">rotate(0deg)</code> to <code class="tok">rotate(450deg)</code> on an eased, wind-up-then-brake curve), with no path sampling. That is a sound, established CSS technique, worth knowing for decorative motion. As a UX choice it is a flourish: the choreography (four boxes swing onto a dotted ring, spin a turn and a quarter, settle into one green tile) adds about a second of delay after the person has already typed the code, and audiences push back on it hard, calling it too much and machine-made. It is an animation demo, not a rule, and it is not part of this standard. Its audience reaction is listed with the other tells in <a href="#lp-slop-decorative-motion">AI Slop: What Not To Do</a> (entry 05).</div>
## Code: JS
<pre><code><span class="kw">let</span> code = <span class="str">''</span>; <span class="cm">// one string, not six independent box values</span>

boxes[<span class="num">0</span>].addEventListener(<span class="str">'paste'</span>, (e) => {
  e.preventDefault();
  code = (e.clipboardData.getData(<span class="str">'text'</span>).match(/\d/g) || []).slice(<span class="num">0</span>, <span class="num">6</span>).join(<span class="str">''</span>);
  syncBoxes(); <span class="cm">// paste is the primary path, not an edge case</span>
  <span class="kw">if</span> (code.length === <span class="num">6</span>) submit(code);
});

boxes.forEach((box, i) => box.addEventListener(<span class="str">'input'</span>, () => {
  code = code.slice(<span class="num">0</span>, i) + box.value + code.slice(i + <span class="num">1</span>);
  <span class="kw">if</span> (box.value && boxes[i + <span class="num">1</span>]) boxes[i + <span class="num">1</span>].focus(); <span class="cm">// auto-advance</span>
}));
boxes.forEach((box, i) => box.addEventListener(<span class="str">'keydown'</span>, (e) => {
  <span class="kw">if</span> (e.key === <span class="str">'Backspace'</span> && !box.value && boxes[i - <span class="num">1</span>]) boxes[i - <span class="num">1</span>].focus(); <span class="cm">// jump back</span>
}));

<span class="cm">// phones autofill the SMS code when the input is tagged like this:</span>
<span class="cm">// &lt;input inputmode="numeric" autocomplete="one-time-code"&gt;</span>

<span class="cm">// colour is reserved for verdicts: neutral while typing, green only if the code is correct, red only if it is wrong</span>
<span class="cm">// .otp-box.ok { border-color: var(--ok); }  .otp-box.bad { border-color: var(--bad); }  (the only two status colours)</span></code></pre>
