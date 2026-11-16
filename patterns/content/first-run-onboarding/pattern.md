---
id: first-run-onboarding
title: First Run Without a Tour
category: content
order: 5
---
## Rule
<p>A product tour is a slideshow people skip, and every slide stands between them and the product. Replace it with a first run that puts them in the real app almost at once. <strong>Ask the minimum, ideally one question, then open the app:</strong> ask only what changes what they see first (What do you want to track first?), and leave role, company size and preferences for later, when there is a reason to ask. Every extra question before the app appears is another chance to close the tab.</p>
<p><strong>Open on a short checklist that has already started:</strong> three tasks, with one genuine item already ticked (Account created, 1 of 3), so the first screen shows progress under way rather than a blank start (<a href="#lp-zeigarnik">Zeigarnik Effect</a>, Feedback entry 09). Empty areas show one clear action, not a blank list (<a href="#lp-empty-states">Empty States</a>, entry 01). <strong>Coach marks, one at a time:</strong> at most one is visible at any moment, anchored to the control it explains and shown at the moment that control is next needed, near the thumb on a phone; never a sequence of tooltips laid over the whole screen on load. <strong>Skip and return:</strong> the Skip control stays in the same place on every step, and the checklist remembers progress when the person comes back, so leaving early costs nothing.</p>
## Do
- One question at most before the real app appears
- A three-item checklist with one real step already ticked
- One coach mark at a time, beside the control it explains, when it is next needed
- Skip in one fixed place; progress remembered on return
## Avoid
- A multi-slide tour before the product appears
- A setup form of questions that change nothing on the first screen
- Several tooltips shown at once over the whole interface
## Code: JS
<pre><code><span class="kw">const</span> checklist = [
  { key: <span class="str">'account'</span>, label: <span class="str">'Create your account'</span>, done: <span class="kw">true</span> }, <span class="cm">// genuinely done: 1 of 3</span>
  { key: <span class="str">'first-item'</span>, label: <span class="str">'Add your first budget'</span>, done: <span class="kw">false</span> },
  { key: <span class="str">'invite'</span>, label: <span class="str">'Invite someone'</span>, done: <span class="kw">false</span> },
];
<span class="kw">let</span> activeHint = <span class="kw">null</span>; <span class="cm">// at most one coach mark on screen</span>
<span class="kw">function</span> <span class="fn">showHint</span>(anchorEl, text) {
  activeHint?.remove();
  activeHint = placeBeside(anchorEl, text); <span class="cm">// beside the control it explains, when it is next needed</span>
}
localStorage.setItem(<span class="str">'onboarding'</span>, JSON.stringify(checklist)); <span class="cm">// remembered on return</span></code></pre>
