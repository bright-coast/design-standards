> A Bright Coast AI skill, made by Rob Lee. github.com/bright-coast/design-standards
> Copyright 2026 Bright Coast AI. For Bright Coast AI clients and people Bright Coast AI has given this link to. You may build what you find here into your own work; you may not republish or resell the material itself. See LICENSE at github.com/bright-coast/design-standards.

# AI Slop: What Not To Do

The defaults that make an interface, a page or a piece of writing read as machine-made, gathered in one place so they can be checked for on purpose. Each entry leads with the thing not to do, says why it reads as generated, and gives the one-line fix. AI Dashboard Tells (Visual, entry 21), AI Landing Page Tells (Visual, entry 22) and Chat UI System (Interaction, entry 23) keep their full write-ups where they are; the entries here point to them and add no new tell. Read every entry as a stylistic baseline to deviate from deliberately, not as a test for who or what made something: the strongest pushback on these tells (major-brand tools also use shadows, per-card icon colours and gradients) is recorded under AI Dashboard Tells and applies to the whole category.

**Standing rule for this category.** Any new AI-slop tell goes here, not only in the Visual category.

7 patterns. Use when: always, for any new screen: the tells that make an interface look machine-made.

## Dashboard Tells

**Don’t.** Ship the five defaults nobody chose: a gradient header that encodes nothing, four accent colours on four stat tiles, every stat at the same size and weight, a shadow on every card, and a templated greeting next to a bare number.

**Why it reads as machine-made.** Each one is decoration or a default standing in for a decision. They are the five small habits that make a generated dashboard read as generated.

**Fix.** One line per tell in the list below. The full write-up, the demo and the CSS live in AI Dashboard Tells (Visual, entry 21), which stays where it is; this entry only points to it.

Avoid:
- A decorative gradient header. Fix: one flat accent colour.
- Four stat tiles in four colours. Fix: one shared tile colour, so the number is the hero.
- Every stat at the same size and weight. Fix: one primary number and three visibly smaller secondaries.
- A drop shadow on every card. Fix: shadow only on what floats (dropdown, popover, toast), a hairline border on the rest.
- “Welcome back, Jordan” beside a bare “+12.5% from last month”. Fix: name the period, use tabular digits, and give the number a shape with a sparkline.

Code (TEXT):

```
review pass, dashboard (details and CSS: Visual, entry 21)
[ ] gradient header that encodes nothing         -> one flat accent
[ ] four accent colours on four stat tiles       -> one shared tile colour
[ ] every stat the same size and weight          -> one primary, three secondary
[ ] a shadow on every card                       -> shadow only on what floats
[ ] "Welcome back, Jordan" and a bare delta      -> name the period, tabular digits, a sparkline
```

## Landing Page Tells

**Don’t.** Ship the landing-page version of the same habit: an adjective stacked on a vague noun as the headline, a big ambient glow behind the hero, two equal-weight buttons, a trust number nobody can check, and a row of icon-plus-adjective feature cards.

**Why it reads as machine-made.** It is the dashboard habit on a different surface, decoration standing in for a real decision, so nothing on the page is attached to the actual product.

**Fix.** One line per tell below. The full write-up, the demo and the CSS live in AI Landing Page Tells (Visual, entry 22), which stays where it is.

Avoid:
- A headline that stacks an adjective on a vague noun (“Supercharge your workflow with AI”). Fix: state the outcome in plain text.
- A big ambient gradient glow behind the hero. Fix: put the colour on the product screenshot itself.
- Two equal-weight calls to action, especially both left-aligned in a row. Fix: one true primary, one visibly quieter secondary.
- “Trusted by 10,000+ teams” with no attribution. Fix: one named quote with a role and a face.
- Feature cards that are an icon plus an adjective (a lightning bolt beside “Fast”). Fix: a card that shows the real product screen doing the thing.

Code (TEXT):

```
review pass, landing page (details and CSS: Visual, entry 22)
[ ] adjective + vague noun headline              -> the outcome, in plain text
[ ] ambient glow behind the hero                 -> colour on the product screenshot
[ ] two equal-weight calls to action             -> one primary, one quieter secondary
[ ] "Trusted by 10,000+ teams", no attribution   -> one named quote, role and face
[ ] icon + adjective feature cards               -> the real product screen in the card
```

## Typography Tells

**Don’t.** Set one line height on everything, so a large heading and a paragraph of body text share the same leading.

**Why it reads as machine-made.** The same line height everywhere is often called an “AI tell”. That claim is plausible but unverified.

**Fix.** Let line height move opposite to size: about 1.1 on headings and about 1.5 on body text. The fix is ordinary typographic practice whether or not the tell claim holds; it is rule 5 of Typography as a System (Visual, entry 24).

Do:
- About 1.1 on headings and about 1.5 on body text, because the rule stands on its own.

Avoid:
- The same line height on headings and body text (often called an AI tell; unverified).

Note: **One tell here, and it is unverified.** Of the seven rules in Typography as a System, only the line-height one is called an AI tell. The other six (one font family, five sizes on one ratio, three text colours, two weights, letter spacing, and a 45 to 75 character measure with tabular figures) are its defaults for a considered type system, not tells, so they are not repeated as tells here.

Code (CSS):

```css
/* don't: one line height on everything (often called an AI tell; unverified) */
body, h1, h2, p { line-height: 1.4; }

/* fix: line height moves opposite to size */
h1, h2 { line-height: 1.1; }
p      { line-height: 1.5; }
```

## Chat UI Tells

**Don’t.** Leave a chat thread on its defaults: messages from one sender not grouped, a timestamp on every bubble, a spinner while a sent message waits for the server, a list that jumps to the bottom whenever something arrives, a typing indicator pinned away from the thread, and a composer that keeps growing until it pushes the thread out of view.

**Why it reads as machine-made.** Each is a default nobody decided; Chat UI System says a thread reads as considered or as generated on these six decisions. Treat this family as unconsidered rather than proven generated.

**Fix.** One line per decision below. The full write-up and the code live in Chat UI System (Interaction, entry 23), which stays where it is.

Avoid:
- No grouping, so the eye re-parses who is talking on every line. Fix: one avatar per run, about 4px inside a group and about 16px between senders.
- A timestamp printed on every bubble. Fix: a relative date divider, with the exact time on hover.
- A spinner while the sent message waits on the server. Fix: the bubble lands first (optimistic send).
- A list that jumps to the bottom when a message arrives. Fix: a “new messages” pill, and auto-scroll only if the person was already at the bottom.
- A typing indicator in a fixed status line away from the thread. Fix: show it inline, in the sender’s own row.
- A composer that grows forever. Fix: grow to about five lines, then scroll inside the box.

Code (TEXT):

```
review pass, chat UI (details and CSS: Interaction, entry 23)
[ ] messages from one sender not grouped         -> one avatar per run, 4px inside, 16px between
[ ] a timestamp on every bubble                  -> date divider, exact time on hover
[ ] a spinner while a sent message waits         -> the bubble lands first
[ ] the list jumps to the bottom on arrival      -> "new messages" pill
[ ] a typing indicator away from the thread      -> inline, in the sender's own row
[ ] a composer that grows forever                -> about five lines, then it scrolls
```

## Decorative Motion Tells

**Don’t.** Add choreography that plays after the job is already done and makes the person wait for it. In one popular OTP demo, four digit boxes swing onto a ring, spin a turn and a quarter and settle into one green tile after the code has been typed, about a second of delay. The same family is decoration that carries no information, such as a glowing network-graph animation that looks impressive and says nothing.

**Why it reads as machine-made.** This is a judgement about reception, not a rule. The OTP flourish is widely received as too much and machine-made, and a glowing network graph invites the question of whether it means anything at all.

**Fix.** Motion has to carry information and never delay the task. Keep the interface neutral until a verdict, show colour only when the code is right or wrong, and keep interface motion in the 150 to 250ms band with the bounce saved for a celebration. The motion rules that hold this line are in Animation Timing (Motion, entry 01), Easing Curves (Motion, entry 03) and Motion That Stays Cheap (Motion, entry 05).

Do:
- Neutral UI until a verdict: green only when the code is correct, red only when it is wrong.
- Interface motion in the 150 to 250ms band, ease-out, with the bounce kept for a celebration.

Avoid:
- A choreographed flourish after the task is done, adding about a second of delay.
- A glowing, animated visual that carries no information.

Note: **Audience reaction, not proof.** Audience reaction shows how a piece of motion is received, not how it was made. The OTP animation itself is a sound, established CSS technique (see OTP Input, Forms, entry 07); the objection is to the delay and the flourish, not the technique.

Code (CSS):

```css
/* don't: about a second of choreography after the code is already typed */

/* fix: colour is reserved for verdicts, neutral while the code is being entered */
.otp-box            { border-color: var(--border); }
.otp-box.is-correct { border-color: var(--ok); }
.otp-box.is-wrong   { border-color: var(--bad); }

/* fix: interface motion in the 150 to 250ms band, ease-out; the bounce is for a celebration */
.menu.open { animation: menu-in 200ms ease-out both; }
```

## Writing and Copy Tells

**Don’t.** Write with the fingerprints of machine text: the three words a model is said to be told never to use (genuinely, honestly, straightforward), the “not X, not Y, but Z” pivot, and the social-post hooks and beats. In an interface the same defaults show up as templated copy: a personalised greeting beside a bare number, an adjective-plus-noun headline, and a trust number nobody can check. Those three are covered in Visual, entries 21 and 22.

**Why it reads as machine-made.** The word list carries the stated reason that a word which insists on honesty reads as the opposite, so the instruction is to state the point and stop. The negation pivot is a dead giveaway; it comes in three shapes, the drumbeat triad (“Not a tool, not a platform, not a budget line. A person.”), the reversal (“It is not mysterious. It is ten jobs.”) and the appositive pivot (“a figure, not an adjective”). Social-post hooks and beats make a draft read as ghost-written or generated.

**Fix.** State the thing that is true and stop. Lead with a fact or a specific detail only the author would know, close with a request or a link rather than a tidy two-beat, and apply one test: if the draft would be equally plausible under 50 other people’s names, it is too generic.

Do:
- State the point and stop; lead with a specific fact; keep plain factual negation.

Avoid:
- The words genuinely, honestly and straightforward (said to be banned outright in an extracted AI system prompt; unverified).
- The negation pivot: the drumbeat triad, the reversal and the appositive pivot.
- Hero-line openers and hooks (“X is broken.”, “Here’s the thing.”, “Here’s why this matters.”, a rhetorical question).
- Rule-of-three beats, parallel negation lists (“No layers, no gatekeepers, no waiting.”), “The bar is simple.” setups, a tidy two-part closer, and every sentence on its own line for effect.

Note: **Partly unverified.** The three words come from a publicly shared copy of an extracted AI system prompt; that copy’s authenticity and completeness are unconfirmed, and the claim that banning them makes output stop sounding machine-made is untested. The pivot and the hooks and beats are editing judgements from draft reviews, not researched claims. Plain factual negation (“the technology does not supervise itself”) is not the tell; the reflexive antithesis used as a constant cadence is.

Code (TEXT):

```
sweep list, writing and copy
words (from an extracted AI prompt, unverified)
  genuinely   honestly   straightforward

negation pivot, three shapes (plain factual negation stays)
  drumbeat triad     "Not a tool, not a platform, not a budget line. A person."
  reversal           "It is not mysterious. It is ten jobs."
  appositive pivot   "a figure, not an adjective"

hooks and beats
  "X is broken."   "Here's the thing."   "Here's why this matters."   a rhetorical-question opener
  rule of three   parallel negation list   "The bar is simple."   a tidy two-part closer   one sentence per line

test: would this draft be equally plausible under 50 other people's names? If yes, it is too generic.
```

## Quick Checklist

**Don’t.** Ship a screen, a page or a piece of copy that trips any of these lines without having decided it on purpose. This is the whole category as one line per tell, grouped by family, for a fast review pass. The fix for each line is in the entry for its family above. Two lines are marked unverified, where the original claim has not been checked.

Do:
- Add every new tell here as one line the moment it is spotted, in the entry for its family.

Avoid:
- **Dashboard.** A gradient header that encodes nothing.
- **Dashboard.** Four accent colours on four stat tiles.
- **Dashboard.** Every stat at the same size and weight.
- **Dashboard.** A drop shadow on every card.
- **Dashboard.** A templated greeting and a bare delta (“Welcome back, Jordan”, “+12.5% from last month”).
- **Landing page.** An adjective-plus-noun headline (“Supercharge your workflow with AI”).
- **Landing page.** An ambient glow behind the hero.
- **Landing page.** Two equal-weight calls to action, both left-aligned.
- **Landing page.** A trust number nobody can check (“Trusted by 10,000+ teams”).
- **Landing page.** Icon-plus-adjective feature cards.
- **Typography.** One line height on everything (unverified).
- **Chat UI.** Messages from one sender not grouped.
- **Chat UI.** A timestamp on every bubble.
- **Chat UI.** A spinner while a sent message waits for the server.
- **Chat UI.** A list that jumps to the bottom on every new message.
- **Chat UI.** A typing indicator away from the thread.
- **Chat UI.** A composer that grows until it pushes the thread out of view.
- **Decorative motion.** Choreography after the job is done (the OTP orbit flourish).
- **Decorative motion.** A glowing visual that carries no information.
- **Writing.** The words genuinely, honestly and straightforward (unverified source).
- **Writing.** The negation pivot (“not X, not Y, but Z”).
- **Writing.** Hero-line openers and hooks (“X is broken.”, “Here’s the thing.”).
- **Writing.** Rule-of-three beats, parallel negation lists and one sentence per line.

Note: **A review aid, not a detector.** A hit means a default nobody decided, not proof that a machine made it.

Code (TEXT):

```
AI SLOP CHECKLIST (23 lines, paste-ready)
DASHBOARD
[ ] a gradient header that encodes nothing
[ ] four accent colours on four stat tiles
[ ] every stat at the same size and weight
[ ] a drop shadow on every card
[ ] a templated greeting and a bare delta
LANDING PAGE
[ ] an adjective-plus-noun headline
[ ] an ambient glow behind the hero
[ ] two equal-weight calls to action, both left-aligned
[ ] a trust number nobody can check
[ ] icon-plus-adjective feature cards
TYPOGRAPHY
[ ] one line height on everything (unverified)
CHAT UI
[ ] messages from one sender not grouped
[ ] a timestamp on every bubble
[ ] a spinner while a sent message waits for the server
[ ] a list that jumps to the bottom on every new message
[ ] a typing indicator away from the thread
[ ] a composer that grows until it pushes the thread out of view
DECORATIVE MOTION
[ ] choreography after the job is done
[ ] a glowing visual that carries no information
WRITING AND COPY
[ ] genuinely, honestly, straightforward (unverified source)
[ ] the negation pivot: not X, not Y, but Z
[ ] hero-line openers and hooks
[ ] rule-of-three beats, parallel negation lists, one sentence per line
```
