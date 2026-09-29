---
id: form-field-grouping
title: Form Field Grouping
category: forms
order: 14
---
## Rule
<p>More than seven visible fields on one screen is a cognitive-load problem before it&rsquo;s a layout problem. Reach for progressive disclosure, a multi-step wizard, or a collapsed &ldquo;advanced&rdquo; section, or go back and ask whether every field is actually needed rather than collected just in case. Group what remains by mental model, not by the shape of the database table behind it: &ldquo;About you&rdquo; / &ldquo;How to reach you&rdquo; / &ldquo;Your preferences&rdquo; reads as a conversation; <code class="tok">user_id, created_at, metadata</code> does not. Three to five fields per group is the ceiling. Past that, split into two groups with their own heading rather than one long one. Every field should carry a default that&rsquo;s right for most people: country read from locale, currency matched to that country, a date field defaulting to today, time zone taken from the browser rather than asked for, notification preferences starting at &ldquo;important only&rdquo; rather than &ldquo;all&rdquo;, and any privacy choice starting on the more private option. None of that applies to a destructive or expensive choice, which is never defaulted on (&ldquo;Yes, subscribe me to everything&rdquo; starts unchecked, always).</p>
## Do
- Groups named by task/mental model (&ldquo;Shipping&rdquo;, &ldquo;Billing&rdquo;), not by table name
- 3-5 fields per group before splitting into a new one
- Smart defaults for the 80% case (locale, currency, today's date, browser time zone); never for a destructive or costly choice
## Avoid
- 15 fields visible at once with no grouping, wizard, or progressive disclosure
## Extra: caveat-box
<div class="caveat-box"><b>The submit button carries the same discipline.</b> Its label names the action, &ldquo;Create account&rdquo; or &ldquo;Send invoice&rdquo;, never a bare &ldquo;Submit&rdquo;. It sits bottom right of the form on desktop and full width, sticky to the bottom, on mobile. A disabled state only ever appears with a visible reason attached, never a greyed-out button with no explanation. Loading swaps in a spinner and a &ldquo;Saving&hellip;&rdquo; label. After success, either navigate somewhere new or show a clear confirmation, never neither, silence after submitting reads as a failure even when it wasn't one.</div>
## Code: JSX
<pre><code><span class="cm">// grouped by mental model, 3-5 fields per group, 7-field ceiling before splitting into steps</span>
&lt;fieldset&gt;&lt;legend&gt;About you&lt;/legend&gt;
  &lt;Field label=<span class="str">"Full name"</span> /&gt;
  &lt;Field label=<span class="str">"Work email"</span> /&gt;
&lt;/fieldset&gt;
&lt;fieldset&gt;&lt;legend&gt;Notifications&lt;/legend&gt;
  &lt;Field label=<span class="str">"Frequency"</span> defaultValue=<span class="str">"important only"</span> /&gt; <span class="cm">{/* smart default, not "all" */}</span>
&lt;/fieldset&gt;
&lt;details&gt;&lt;summary&gt;Add company info (optional)&lt;/summary&gt;
  &lt;fieldset&gt;&lt;Field label=<span class="str">"Company"</span> optional /&gt;&lt;Field label=<span class="str">"Job title"</span> optional /&gt;&lt;/fieldset&gt;
&lt;/details&gt;</code></pre>
