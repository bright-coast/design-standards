---
id: permission-requests
title: Permission Requests
category: interaction
order: 35
---
## Rule
<p>Never ask for device permissions at first launch. A wall of camera, location, contacts and notification prompts before the person has done anything gets refused out of reflex, and the system dialog is often one shot: once refused, the app cannot show it again and the only way back is the device Settings. Ask for one permission at a time, right after the person chooses the feature that needs it: the camera when they tap Scan receipt, location when they tap Find nearby, notifications after they book something worth a reminder.</p>
<p><strong>Explain first, in the app.</strong> Before the system dialog, show a short in-app card that says what the person gets, in their terms: &ldquo;Scan receipts straight into your expenses&rdquo;, not &ldquo;This app needs camera access&rdquo;. The card has two buttons, Continue (which opens the system dialog) and Not now. A Not now on the in-app card costs nothing, because the card can be shown again the next time they reach for the feature; a refusal in the system dialog may be permanent.</p>
<p><strong>Denied is a state, not a dead end.</strong> When permission is refused, keep the feature visible where it was. Say in one line why it is not working and link straight to the app&rsquo;s page in system Settings (Turn on camera in Settings). Never hide the feature, and never let it fail silently with a blank camera view or an empty map.</p>
## Do
- One permission at a time, asked right after the person picks the feature that needs it
- An in-app card naming the concrete benefit before the system dialog
- A refused feature stays visible, with one line of reason and a direct Settings link
## Avoid
- A run of permission prompts at first launch
- Generic copy such as &ldquo;This app needs access to your camera&rdquo;
- Hiding a feature, or letting it fail silently, after a refusal
## Code: JS
<pre><code><span class="kw">async function</span> <span class="fn">startScan</span>() {
  <span class="kw">const</span> state = <span class="kw">await</span> permissions.query({ name: <span class="str">'camera'</span> });
  <span class="kw">if</span> (state === <span class="str">'granted'</span>) <span class="kw">return</span> openScanner();
  <span class="kw">if</span> (state === <span class="str">'denied'</span>) <span class="kw">return</span> showDenied(<span class="str">'Turn on camera in Settings to scan receipts'</span>);
  <span class="cm">// not asked yet: explain in the app first, the system dialog may be one shot</span>
  <span class="kw">const</span> ok = <span class="kw">await</span> showPrePermissionCard({
    title: <span class="str">'Scan receipts straight into your expenses'</span>,
    confirm: <span class="str">'Continue'</span>, cancel: <span class="str">'Not now'</span>
  });
  <span class="kw">if</span> (!ok) <span class="kw">return</span>; <span class="cm">// Not now: free to ask again next time</span>
  <span class="kw">if</span> (<span class="kw">await</span> requestSystemCamera()) openScanner();
  <span class="kw">else</span> showDenied(<span class="str">'Turn on camera in Settings to scan receipts'</span>);
}</code></pre>
