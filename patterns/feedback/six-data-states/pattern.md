---
id: six-data-states
title: Six Data States
category: feedback
order: 13
---
## Rule
<p>Anything that fetches data, accepts input or does async work has six states, and each one is designed rather than left to whatever the happy path happens to render. <strong>Loading</strong> shows a skeleton that matches the final layout, or a progress indicator with intent (<a href="#lp-loading-system">Loading States System</a>, entry 03). <strong>Empty</strong> explains why and offers the next action (<a href="#lp-empty-states">Empty States</a>, Content entry 01). <strong>Partial</strong> shows what did load and marks what did not. <strong>Error</strong> says what happened and offers a way out (<a href="#lp-error-states">Error States</a>, entry 02). <strong>Success</strong> is a visible confirmation, never just the absence of an error (<a href="#lp-success-states">Success States</a>, entry 12). <strong>Offline</strong> is a degraded mode with an explanation.</p>
<p><strong>Partial is the most skipped state.</strong> When some items have loaded and more are coming, show the loaded items with skeleton placeholders for the rest. When one field or panel fails, mark only that spot with Failed to load, Retry, rather than turning the whole component into an error. When the next page is loading, keep the current page visible and show the loader at the bottom. Never blank the screen on a partial failure; that throws away data the person already had.</p>
<p><strong>Offline, at minimum.</strong> Detect it (navigator.onLine plus failed requests). Say so in a persistent banner (Offline, your changes are saved on this device). Queue changes and replay them on reconnect where possible (<a href="#lp-autosave">Autosave</a>, Forms entry 01). Disable the actions that strictly need the network, and raise no errors for failures that being offline already explains. If the product genuinely cannot work offline, say so the first time it happens rather than failing silently. Before calling a data component done, tick all six states; any unticked one is a gap to fix or to name out loud.</p>
## Do
- All six states handled: loading, empty, partial, error, success, offline
- A partial failure marks one spot and keeps everything else on screen
- A persistent offline banner, with changes queued for reconnect
## Avoid
- A component that only renders the happy path
- Blanking the screen when one request out of five fails
- A wall of network errors for something being offline already explains
## Code: JSX
<pre><code><span class="cm">// all six states, in the order they are checked</span>
if (offline &amp;&amp; !data)  return &lt;OfflineState onRetry={refetch} /&gt;;   <span class="cm">// degraded mode, explained</span>
if (isLoading)         return &lt;ListSkeleton rows={5} /&gt;;           <span class="cm">// same shape as the real list</span>
if (isError)           return &lt;ErrorState title="We couldn't load invoices" onRetry={refetch} /&gt;;
if (data.length === 0) return &lt;EmptyState action="Create your first invoice" /&gt;;
return (&lt;&gt;
  {offline &amp;&amp; &lt;Banner&gt;Offline, your changes are saved on this device&lt;/Banner&gt;}
  &lt;List items={data} failed={failedIds} /&gt;  <span class="cm">{/* partial: a failed row shows Retry inline */}</span>
&lt;/&gt;);</code></pre>
