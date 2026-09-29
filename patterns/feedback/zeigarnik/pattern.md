---
id: zeigarnik
title: Zeigarnik Effect
category: feedback
order: 9
---
## Rule
<p>The mind keeps an unfinished task active in working memory and drops a finished one almost instantly. A visibly incomplete progress bar pulls attention back in a way a completed one never does. A profile-completeness meter with one deliberate box left unchecked (&ldquo;Add a photo&rdquo;) exploits exactly this to bring someone back to finish it. The open loop has to tie to an outcome the person actually wants, not a made-up metric; manufacturing progress nobody asked to track just reads as manipulative busywork.</p>
## Do
- One deliberate box left unchecked in onboarding
## Avoid
- Manufacturing progress nobody asked to track
## Code: JS
<pre><code><span class="kw">const</span> profileSteps = [
  { key: <span class="str">'name'</span>, done: <span class="kw">true</span> },
  { key: <span class="str">'avatar'</span>, done: <span class="kw">false</span> }, <span class="cm">// deliberately left open, pulls the user back</span>
  { key: <span class="str">'bio'</span>, done: <span class="kw">true</span> },
];
<span class="kw">const</span> pct = Math.round((profileSteps.filter(s => s.done).length / profileSteps.length) * <span class="num">100</span>);
<span class="cm">// "Profile 90% complete, add a photo to finish" ties the open loop to a real, wanted outcome</span></code></pre>
