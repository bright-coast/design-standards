---
id: settings-system
title: Settings System
category: forms
order: 10
---
## Rule
<p>Match the apply model to what&rsquo;s actually at stake: a low-risk toggle (dark mode, notifications) applies instantly with no Save button, while a high-stakes identity field (email, billing) needs an explicit Save so a stray click can&rsquo;t silently change something significant. Group settings by the task someone came to do, not by how the database happens to be organised, and make the whole page searchable once it passes roughly fifteen options. A destructive setting change belongs in a clearly separated danger zone, type-to-confirm gated.</p>
## Do
- Group by task, make it searchable
## Avoid
- One flat list ordered by the data model
## Code: JS
<pre><code><span class="kw">const</span> SETTINGS = [
  { key: <span class="str">'darkMode'</span>, group: <span class="str">'Appearance'</span>, apply: <span class="str">'instant'</span> },   <span class="cm">// low-risk, no Save button</span>
  { key: <span class="str">'email'</span>, group: <span class="str">'Account'</span>, apply: <span class="str">'explicit'</span> },     <span class="cm">// identity field, needs Save</span>
  { key: <span class="str">'deleteAccount'</span>, group: <span class="str">'Danger zone'</span>, apply: <span class="str">'confirm-typed'</span> },
];

<span class="kw">function</span> <span class="fn">onChange</span>(setting, value) {
  <span class="kw">if</span> (setting.apply === <span class="str">'instant'</span>) <span class="kw">return</span> save(setting.key, value); <span class="cm">// fires immediately</span>
  <span class="kw">if</span> (setting.apply === <span class="str">'explicit'</span>) markDirty(setting.key, value);   <span class="cm">// waits for Save click</span>
  <span class="kw">if</span> (setting.apply === <span class="str">'confirm-typed'</span>) openTypeToConfirm(setting);   <span class="cm">// e.g. type account email to delete</span>
}</code></pre>
