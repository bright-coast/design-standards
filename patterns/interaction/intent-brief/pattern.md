---
id: intent-brief
title: Before You Build: The Intent Brief
category: interaction
order: 31
---
## Rule
<p>A screen built straight from the data model comes out shaped like the database: every field, every filter and every action at the same volume. Five answers, written down before any markup, shape it around the person instead. <strong>Who</strong> uses it (role, expertise, how often). <strong>Primary action:</strong> the one thing they do here 80% of the time. <strong>Secondary actions:</strong> the next two or three, the 15% case. <strong>Context:</strong> where and how it is used (a phone between jobs, a focused desk session, a shared screen, an incident at 2am). <strong>Worst case:</strong> the worst thing that can happen here (data loss, the wrong recipient, an irreversible action, a missed deadline). Ask for any missing answers in one message, never drip-fed, and keep the five as a short brief at the top of the work; every later decision should trace back to it.</p>
<p><strong>Turning answers into layout.</strong> A primary action used 80% of the time gets one prominent button, never a menu item. An irreversible worst case gets a confirmation step plus undo, never a single click. A wrong-data worst case keeps the identifying context (name, ID, timestamp) on screen at all times. A phone check-in gets one column, no sideways scroll and actions within thumb reach. Focused desk work can carry several panes, visible keyboard shortcuts and higher density. An incident at 2am gets high contrast, big targets and no clever interactions. A frequent expert gets density and batch actions without hand-holding tooltips; an occasional novice gets space, progressive disclosure and inline help.</p>
<p><strong>Shapes the brief rules out.</strong> A table of every field when the primary action needs three. A destructive action sitting next to the primary one. Every available filter shown by default. A modal for the screen&rsquo;s primary action, where inline editing or a dedicated page belongs (<a href="#lp-modal-hierarchy">Modal Hierarchy</a>, entry 17). Tabs for sections that are not mutually exclusive. Mockups and demos use realistic placeholder content (a plausible name, a real-looking invoice number), never Lorem Ipsum and never a real customer&rsquo;s details. When the owner says just build it, write the brief from stated assumptions, mark it as assumed, and keep moving; if the owner overrides a rule after a one-line warning, build it their way.</p>
<p><strong>When to ask and when to build.</strong> Read the request and the project first; most answers are already there. Ask only when all three hold: the request is open, two or more of who, the primary action and the worst case are still unknown, and someone is actually there to answer. Otherwise write down your assumptions, mark them as assumed, and build.</p>
<p><strong>Unknown data, honestly marked.</strong> When the shape of an API is unknown, write the type you are assuming and say plainly that it is assumed. Never add mock routes or hardcoded sample rows to make a real screen look alive; a screen that looks finished but runs on fake data hides the work still to do.</p>
<p><strong>A dashboard brief.</strong> For a dashboard, the primary action becomes the two or three questions the person arrives with at the moment they open it: am I on track this month, what needs me today, what changed since yesterday. Give each panel exactly one of those questions to answer, place the panels in the order the questions get asked, and cut any panel that answers a question nobody brings.</p>
## Do
- Five answers (who, primary, secondary, context, worst case) written down before any markup
- The worst case sets the friction: irreversible means a confirmation plus undo
- Realistic placeholder content in every mockup
- The request and project read first; questions only when the request is open, two of who, primary action and worst case are unknown, and someone can answer
- An assumed API type written down and labelled as assumed
- On a dashboard, each panel answers one of the two or three questions the person opens it with, in that order
## Avoid
- A table of every database field because the data model has them
- A modal or a menu item for the action people take 80% of the time
- Lorem Ipsum, or a real customer&rsquo;s details, in a demo
- Mock routes or hardcoded sample rows wired into a real screen
## Code: TEXT
<pre><code>INTENT BRIEF (assumed until confirmed)
User:          support agent, daily, non-technical
Primary:       look up one customer during a live call
Secondary:     reset password, view recent activity
Context:       desktop, sometimes a phone, always in a hurry
Worst case:    acting on the wrong customer
Implications:  search owns the top of the page
               name, email and ID stay visible once a customer is open
               suspend and delete sit behind a typed confirmation</code></pre>
