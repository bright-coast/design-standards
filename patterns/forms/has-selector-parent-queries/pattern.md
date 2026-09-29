---
id: has-selector-parent-queries
title: :has() Parent Queries
category: forms
order: 13
---
## Rule
<p>The <code class="tok">:has()</code> relational pseudo-class lets a parent's style react to what's inside it, closing off a whole category of state that used to require JavaScript just to toggle a class. Five uses worth knowing: <strong>selection</strong>, a pricing-plan card highlights itself with <code class="tok">.plan:has(:checked)</code> when its own radio is selected, no click handler. <strong>Validation</strong>, a field wrapper turns red with <code class="tok">.field:has(:user-invalid)</code> the moment its input fails constraint validation, live, with zero <code class="tok">onChange</code>/<code class="tok">useState</code>. <strong>Layout</strong>, a shell can switch to a two-column grid only when a specific child exists, e.g. <code class="tok">.app:has(aside)</code>, so layout follows what's actually in the DOM instead of a JS-tracked boolean prop. <strong>Quantity</strong>, a grid can query its own child count, e.g. <code class="tok">.plans:has(:nth-child(n+5))</code>, and switch to a denser layout once it crosses a threshold: a quantity query in pure CSS. <strong>Document-level reaction</strong>, <code class="tok">body:has(dialog[open])</code> can lock background scroll and dim the app the instant any dialog anywhere opens, in one rule, instead of a JS class toggled on every open/close. Browser support is broad but not universal (Chrome 105+, Safari 15.4+, Firefox 121+, Edge 105+); check the project's actual support target before relying on it for anything load-bearing.</p>
## Do
- <code class="tok">.plan:has(:checked)</code> instead of a click handler + class toggle
- <code class="tok">:has(:user-invalid)</code> for live validation styling with zero JS state
- Check real browser-support targets before depending on <code class="tok">:has()</code>
## Avoid
- Reaching for a JS state toggle when the parent can just query its own children
## Code: CSS
<pre><code><span class="cm">/* 01, selection: the card reacts to its own radio, no click handler */</span>
.plan:has(:checked) { border-color: var(--accent); }

<span class="cm">/* 02, validation: the wrapper reacts to its own input's validity, live */</span>
.field:has(:user-invalid) { border-color: var(--err); }

<span class="cm">/* 03, layout: follows the DOM, not a JS-tracked prop */</span>
.app:has(aside) { grid-template-columns: 280px 1fr; }

<span class="cm">/* 04, quantity: the grid counts its own children */</span>
.plans:has(:nth-child(n+5)) { --density: compact; }

<span class="cm">/* 05, document-level: any open dialog locks + dims the whole app */</span>
body:has(dialog[open]) { overflow: hidden; }
body:has(dialog[open]) .app { opacity: .4; pointer-events: none; }</code></pre>
