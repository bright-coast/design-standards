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

4 patterns. Use when: how people perceive, choose and remember.

## Fitts’s Heuristic

Important buttons should be easy to reach, so a big Save button beats a small one. This is Fitts’s heuristic, often written up as “Fitts’s law”; it is a research-backed heuristic, not a law. Its practical side is already in Click Target Sizing (Interaction, entry 25): the 44 by 44 pixel touch zone and the 8 pixel gap between adjacent buttons.

Do:
- The important button (the Save) is big and easy to reach
- Apply the size and gap numbers in Click Target Sizing

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
