---
id: slop-decorative-motion
title: Decorative Motion Tells
category: ai-slop
order: 5
---
## Rule
<p><strong>Don&rsquo;t.</strong> Add choreography that plays after the job is already done and makes the person wait for it. In one popular OTP demo, four digit boxes swing onto a ring, spin a turn and a quarter and settle into one green tile after the code has been typed, about a second of delay. The same family is decoration that carries no information, such as a glowing network-graph animation that looks impressive and says nothing.</p>
<p><strong>Why it reads as machine-made.</strong> This is an audience reaction, not a rule. Audiences call the OTP flourish too much and machine-made, and ask of the network graph whether it means anything or just looks cool.</p>
<p><strong>Fix.</strong> Motion has to carry information and never delay the task. Keep the interface neutral until a verdict, show colour only when the code is right or wrong, and keep interface motion in the 150 to 250ms band with the bounce saved for a celebration. The motion rules that hold this line are in Animation Timing (Motion, entry 01), Easing Curves (Motion, entry 03) and Motion That Stays Cheap (Motion, entry 05).</p>
## Do
- <span>Neutral UI until a verdict: green only when the code is correct, red only when it is wrong.</span>
- <span>Interface motion in the 150 to 250ms band, ease-out, with the bounce kept for a celebration.</span>
## Avoid
- <span>A choreographed flourish after the task is done, adding about a second of delay.</span>
- <span>A glowing, animated visual that carries no information.</span>
## Extra: caveat-box
<div class="caveat-box"><b>Audience reaction, not proof.</b> Audience reaction shows how a piece of motion is received, not how it was made. The OTP animation itself is a sound, established CSS technique (see OTP Input, Forms, entry 07); the objection is to the delay and the flourish, not the technique.</div>
## Code: CSS
<pre><code><span class="cm">/* don't: about a second of choreography after the code is already typed */</span>

<span class="cm">/* fix: colour is reserved for verdicts, neutral while the code is being entered */</span>
.otp-box            { border-color: var(--border); }
.otp-box.is-correct { border-color: var(--ok); }
.otp-box.is-wrong   { border-color: var(--bad); }

<span class="cm">/* fix: interface motion in the 150 to 250ms band, ease-out; the bounce is for a celebration */</span>
.menu.open { animation: menu-in 200ms ease-out both; }</code></pre>
