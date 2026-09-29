---
id: scanning-patterns
title: Scanning Patterns
category: visual
order: 23
---
## Rule
<p>Four scanning shapes cover almost every screen type, and mixing more than one on a single screen destroys scannability rather than adding polish. <strong>F-pattern</strong> suits text-heavy content: article lists, search results, inboxes, log views. Most important information sits top-left, with a horizontal scan across the top, a shorter secondary scan partway down, then a vertical scan down the left edge; headings have to actually carry visual weight for this to hold. <strong>Z-pattern</strong> suits marketing pages and single-screen UIs with few elements: landing pages, modals, empty states. Logo or identity sits top-left, primary action top-right, a diagonal scan runs through the middle, and the call-to-action lands bottom-right. <strong>Layer-cake</strong> fits dashboards: stacked horizontal sections that each scan independently, a KPI summary at the top, drill-down sections in priority order in the middle, secondary data and support links at the bottom. <strong>Spotlight</strong> fits detail pages: one subject identified prominently (avatar, name, status), actions for that subject grouped right next to its identity, related data below in collapsible sections. Pick the one that matches the content before laying anything out, not after the fact.</p>
## Do
- One scanning pattern per screen, chosen before layout starts
- F-pattern headings visually distinct enough to actually carry the scan
## Avoid
- Two patterns fighting on one screen, e.g. a Z-pattern hero glued straight onto an F-pattern list with no visual break
## Code: Notes
<pre><code><span class="cm">// pick one per screen, based on content type. not a CSS pattern, a layout decision</span>
<span class="kw">const</span> SCAN_PATTERN_BY_CONTENT = {
  <span class="str">'article list, search results, inbox, logs'</span>: <span class="str">'F'</span>,
  <span class="str">'landing page, modal, empty state, confirmation'</span>: <span class="str">'Z'</span>,
  <span class="str">'dashboard'</span>: <span class="str">'layer-cake'</span>,
  <span class="str">'detail page (one subject + its actions + related data)'</span>: <span class="str">'spotlight'</span>,
};</code></pre>
