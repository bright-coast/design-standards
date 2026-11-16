> A Bright Coast AI skill, made by Rob Lee. github.com/bright-coast/design-standards
> Copyright 2026 Bright Coast AI. For Bright Coast AI clients and people Bright Coast AI has given this link to. You may build what you find here into your own work; you may not republish or resell the material itself. See LICENSE at github.com/bright-coast/design-standards.

# The Psychology of the User Experience

How people perceive, choose and remember. Everything here is a research-backed heuristic, not a law: each describes a tendency that holds often enough to design around, and each has limits. Fitts, Hick and Jakob have their full entries in this category; the other psychology-driven entries stay in the category where they already were, and the index at the end of this category points to every one of them by entry number.

        Where every psychology-driven entry lives
        Nothing here was moved, copied or deleted: each entry stays in its own category. Proximity and Von Restorff already had full entries in Visual, so they are pointed to rather than duplicated. Entry numbers are as shown in each category.

        Five classic UX heuristics

          Psychology, 01Fitts’s Heuristic important buttons should be easy to reach; practical side in Click Target Sizing (Interaction, 25)

          Psychology, 02Hick’s Heuristic more choices, more time to decide

          Psychology, 03Jakob’s Heuristic users expect your product to work like the ones they already know

          Visual, 14Proximity Rule things placed close together feel related

          Visual, 17Von Restorff Effect the element that is different gets noticed first

        Other psychology-driven entries, and where they live

          Interaction, 18Peak-End Rule people judge an experience by its peak and its end

          Interaction, 25Click Target Sizing the practical side of Fitts’s heuristic

          Feedback, 01Doherty Threshold the 400ms response deadline

          Feedback, 09Zeigarnik Effect an unfinished task holds attention

          Forms, 14Form Field Grouping cognitive load, and grouping by mental model

          Visual, 08Gestalt Laws how the brain groups visual elements

          Psychology, 04Chunking working memory holds about four chunks

          Content, 04Serial Position the first and last items are remembered best

        Never do this to people

          Psychology, 05Decoy Effect a near-identical weaker tier makes another look like value; every tier needs a real buyer

          Psychology, 06Engagement Traps endless feeds, autoplay, variable rewards, streaks and obligation notifications

          Psychology, 07Dark Patterns confirmshaming, hidden costs and the roach motel, with the honest alternative

7 patterns. Use when: how people perceive, choose and remember.

## Fitts’s Heuristic

Important buttons should be easy to reach, so a big Save button beats a small one. This is Fitts’s heuristic, often written up as “Fitts’s law”; it is a research-backed heuristic, not a law. Its practical side is already in Click Target Sizing (Interaction, entry 25): the 44 by 44 pixel touch zone and the 8 pixel gap between adjacent buttons.

**Distance is the other half.** The heuristic is about size and distance together: a target is quicker to hit when it is bigger and when it is closer to where the pointer or thumb already is. So bring the action to the person and cut the travel toward zero: a menu that opens at the cursor (Context Menu, Interaction entry 07), editing in place instead of on a separate form (Inline Editing, Interaction entry 15), a floating action button that is always near the thumb. On a phone, put the primary action within thumb reach near the bottom of the screen, such as a full-width Save fixed above the home indicator, never only in the top corner where a one-handed user has to stretch or shift their grip.

Do:
- The important button (the Save) is big and easy to reach
- Apply the size and gap numbers in Click Target Sizing
- Cut travel distance: menus at the cursor, inline editing, the primary action near the thumb on mobile

Avoid:
- A small, hard-to-reach button for the action that matters most

Code (CSS):

```css
/* the important action is big and easy to reach: a big Save beats a small one (sizes are demo values) */
.btn-save { min-width: 120px; min-height: 44px; }

/* the touch-zone and gap floors from Click Target Sizing still apply to every other button */
.btn-row { display: flex; gap: 8px; }
.btn-row button { min-width: 44px; min-height: 44px; }
```

## Hick’s Heuristic

The more choices there are, the longer it takes to decide: three choices are quick to pick from, fifteen are slow. This is Hick’s heuristic, often written up as “Hick’s law”; it is a research-backed heuristic, not a law.

Read it precisely. Decision time grows with the number of options; it does not say that fewer options is always better, so it is a cost to weigh against what people need to see, not an instruction to strip choices out. The related rules already in this library are Field Control Thresholds (Forms, entry 15), which picks the control from the option count, and Form Field Grouping (Forms, entry 14), which caps visible fields at seven.

**Applied to a toolbar.** Six concrete fixes for a crowded toolbar are in Crowded Toolbar: Six Fixes (Interaction, entry 33).

Do:
- Weigh the number of options before designing the choice: more options, more time to decide (3 choices are quick, 15 are slow)
- Pair it with the option-count thresholds in Field Control Thresholds

Avoid:
- Reading it as “fewer options is always better”; it says decision time grows with the number of options, nothing more

Code (HTML):

```html
<!-- 3 choices: quick to decide, all visible -->
<fieldset>
  <label><input type="radio" name="plan"> Starter</label>
  <label><input type="radio" name="plan"> Growth</label>
  <label><input type="radio" name="plan"> Scale</label>
</fieldset>

<!-- 15 choices: decision time grows with the number of options; the control to use is in Field Control Thresholds -->
<select name="region"> <!-- 15 options --> </select>
```

## Jakob’s Heuristic

Users expect your product to work like the products they already know. Picture the bottom bars of a photo app, a video app and “your app” all sharing the same layout. This is Jakob’s heuristic, often written up as “Jakob’s law”; it is a research-backed heuristic, not a law.

The rule already in this library that applies it is in Navigation Patterns (Navigation, entry 02): match the pattern to the platform’s own convention rather than personal taste.

Do:
- Reuse the layout and behaviour users already know from the products they use
- Match the platform’s own navigation convention (Navigation Patterns)

Avoid:
- A product that behaves unlike the ones its users already know, with no reason to

Code (CSS):

```css
/* the familiar mobile layout: a bottom bar with a few evenly spaced tabs, as in the apps people already use */
.tab-bar { position: fixed; bottom: 0; left: 0; right: 0; display: flex; justify-content: space-around; }
```

## Chunking

Working memory holds about four chunks (Cowan, 2001), not the seven that is often quoted. Ten loose digits (4155550123) overflow four slots and six are lost; the same number in three groups (415 555 0123) fits, with all three chunks kept. Group anything people must hold in their heads while they act on it: phone numbers, card numbers, reference numbers, codes, long IDs, and the steps of a flow.

It is a research-backed heuristic about memory, not a law of layout. The rules in this library that apply it are Input Masking (Forms, entry 06), which formats as people type, and OTP Input (Forms, entry 07).

Do:
- Show and accept long numbers in groups of 3 to 4
- Keep what people must remember to about four chunks

Avoid:
- A 10-digit reference shown as one unbroken string

Code (JS):

```js
// show and type in chunks: 415 555 0123, not 4155550123
const chunk = (d, sizes = [3, 3, 4]) => { let i = 0; return sizes.map(n => d.slice(i, i += n)).filter(Boolean).join(' '); };
chunk('4155550123'); // "415 555 0123": 3 chunks fit 4 slots
```

## Decoy Effect

People judge a price by comparing it with whatever is easiest to compare it with. Add a third option that is clearly worse than a similar-priced one (Pro at $14 with far fewer features than Premium at $16) and Premium suddenly looks like a bargain, because Pro against Premium is an easy comparison ($2 more, much more included) while Basic, which has no close neighbour, drops out of the decision. This is the decoy effect, also called asymmetric dominance; it is a research-backed heuristic, not a law, and its strength varies a lot from one market to the next.

**Never build a tier whose only job is to look bad.** A plan nobody should buy, priced to push people into a more expensive one, steers them into paying for what they do not need, and it is the kind of thing customers notice and resent. The honest use is the reverse check: every tier on the page is one a real customer could sensibly choose, the tier you highlight is the one that genuinely fits most of them, and the differences between tiers are stated plainly so people compare on substance. When reviewing a pricing page, ask of each tier: who is this actually for? If the answer is nobody, remove it (Pricing Table, Visual).

Do:
- Every tier on the page is a sensible choice for some real customer
- Highlight the tier that genuinely fits most people, with the differences stated plainly
- Ask of each tier who it is actually for, and remove any that is for nobody

Avoid:
- A near-identical, slightly cheaper, much weaker tier added only to make another look good
- Hiding the real differences so the comparison only works one way

Code (JS):

```js
// review check for a pricing page: every tier needs a real audience
const tiers = [
  { name: 'Basic', price: 8, forWhom: 'one person, light use' },
  { name: 'Premium', price: 16, forWhom: 'most teams', highlight: true },
];
const decoys = tiers.filter(t => !t.forWhom); // a tier for nobody is a decoy: remove it
```

## Engagement Traps

Some engagement patterns work by removing the moments where people decide to stop. Never design them in to keep people using a product longer than they meant to; give every one of them its honest alternative. **Endless feeds:** a feed with no end has no point where the person decides whether to carry on. Where wellbeing matters, give it one: a clear end or an All caught up marker once the new items run out, or pages, or a Load more button (Pagination, Navigation entry 03). **Autoplay:** playing the next item automatically removes the pause in which people choose to leave, so autoplay of the next item is off by default and the person opts in; a countdown with a clear Cancel is the least it needs when it is on.

**Variable rewards:** never make a refresh or a reveal work like a slot machine, where an unpredictable payoff (sometimes something, often nothing) keeps people pulling. Pull to refresh loads real updates and says so when there are none (No new posts since 9:41). **Streaks:** a streak turns a habit into something people are afraid to lose, so if a product uses streaks it builds in forgiveness: a streak freeze or a missed day allowed each week, and no alarming warnings at midnight. Use them only where coming back genuinely helps the person, such as learning or health. **Social obligation:** limit notifications built on obligation (Someone liked your photo, a friend is waiting for your reply) and let people choose which ones they get, each type with its own switch in settings; never send them in timed drips to pull people back (Notification System, Feedback entry 04).

Do:
- A clear end or All caught up marker on a feed where wellbeing matters
- Autoplay of the next item off by default, opt in, with a visible Cancel
- Refresh that loads real updates and says plainly when there are none
- Streaks with forgiveness built in, used only where coming back helps the person
- A switch for every type of social notification

Avoid:
- A feed with no end, built so nobody reaches a point to stop
- A refresh or reveal with deliberately unpredictable payoffs
- A streak that is lost forever after one missed day, with warnings designed to cause anxiety
- Social notifications drip-fed to pull people back

Code (JS):

```js
function renderFeedEnd(newItems) {
  if (newItems.length === 0) return showMarker('All caught up'); // a real stopping point
}
const settings = {
  autoplayNext: false,                  // opt in, never on by default
  streakFreezesPerWeek: 1,            // forgiveness built in
  notify: { likes: false, replies: true }, // each social type has its own switch
};
```

## Dark Patterns

A dark pattern is a design choice that tricks people into a decision they would not make if they saw it clearly. These are never acceptable, however well they test, and several are now regulated in many markets. Three are common enough to name, each with its honest alternative. **Confirmshaming:** never write the decline option to make people feel foolish for saying no (No thanks, I prefer paying full price). Write it in neutral words that say what happens (No thanks, or Not now), styled as a real, readable option rather than faint small print.

**Hidden costs:** never show one price and add shipping, service fees and taxes once someone is committed at checkout, so a $29 basket becomes $47 on the last step. Show the full price, fees included, from the first place the price appears, or state the fees beside it, so the figure on the pay button is never a surprise (Checkout That Feels Safe, Forms entry 16). **The roach motel:** never make leaving harder than joining. If signing up takes one click, cancelling takes about the same: a findable Cancel plan link, one short confirmation, done, with no maze of settings pages, guilt screens, waiting periods or required phone calls (Billing Page, Forms entry 19).

Do:
- Neutral decline wording, as readable as the accept option
- The full price, fees included, from the first place a price appears
- Cancelling as easy as signing up: one link, one short confirmation

Avoid:
- A decline option written to shame (No thanks, I like paying more)
- Fees that appear only at the last step of checkout
- A cancellation path through several screens, an email confirmation or a waiting period

Code (HTML):

```html
<!-- decline in neutral words, as readable as accept -->
<button>Get 20% off</button> <button class="secondary">No thanks</button>

<!-- the price people see first already includes the fees -->
<p class="price">$47.00 <small>includes $12 shipping and $6 in fees</small></p>

<!-- one link out, one confirmation, the same effort as signing up -->
<a href="/billing#cancel">Cancel plan</a>
```
