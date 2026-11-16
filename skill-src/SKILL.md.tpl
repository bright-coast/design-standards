---
name: design-standards
description: Use when someone asks you to build, design, review or restyle any user interface (a page, form, table, dashboard, navigation, settings screen, landing page, empty state or animation), says "apply the design standards to <screen>", or asks why a page looks generic or machine-made. It gives you {{TOTAL}} design rules, loaded one category at a time, and a checklist of the tells that make an interface look machine-made.
version: {{VERSION}}
---

{{HEADER}}

## Before you do anything

1. {{LOCAL_MD_SENTENCE}}

## What this does

It gives you a library of {{TOTAL}} design rules for building clear, easy-to-use interfaces, split into category files under `references/` so you only read what the task needs. It only reads its own files. It never changes the person's project files unless they ask you to build or change something, and it never sends, deletes, pays or publishes anything. The rules are neutral: they never choose colours, fonts or a brand.

## How to use the rules

1. **Project first.** If the project has its own `DESIGN.md`, brand tokens or a design system, those decide colours, fonts, spacing and components. These rules decide behaviour and quality inside that system. If they disagree on a look, the project wins. If they disagree on accessibility or clarity, say so and ask.
2. **Always start with the slop checklist.** For any new screen, read `references/ai-slop.md` first and avoid every tell it lists.
3. **Then load only the categories the task touches:**

{{CATEGORY_TABLE}}

4. **Match the effort to the change.** A small change to an existing screen applies the rules quietly, with no brief and no list. Only a new screen, page or component gets the visible steps below.
5. **Reviewing existing UI.** First say what the screen is for and who uses it; if you cannot tell, ask. On code, run the mechanical pass the UX Audit rule lists before anything else. Then go through the screen one element at a time: for each button, form, table, menu or message, find the matching rule and say whether it passes, and report each miss with the rule's name and the fix. Report only real findings, with no minimum count. When the person asked to audit or review, give the full report, ending with the top three fixes and what is working. When they asked to fix or improve, change the code, saying first only the screen's purpose and the most serious findings you are fixing. With only a description and no screenshot or code, ask once for one, and say what cannot be judged without it.
6. **Reviewing a change before it merges.** Read the diff through these rules and group what you find as must fix, should fix and nice to fix, each with its file and line. "No blocking issue" is a valid answer.
7. **Building new UI.**
   - Start with the Intent Brief rule: ask in one message only when the request is open and someone can answer; otherwise assume, mark each assumption, and build.
   - Settle the project's `DESIGN.md` as the Project Design Contract rule describes: write it when it is missing, add only the missing sections when it is incomplete, and follow it when it is complete. After writing one, offer once to add a pointer to it in the project's `CLAUDE.md` or `AGENTS.md`.
   - Before you write markup, write the character choices and the token layer, and say which actions are primary, secondary and destructive. List the rules you will apply.
   - After you write it, check the result against them, reading the values back from the code (fonts and how they load, colours, gaps), not from memory. Work out the contrast of every text and colour pair with a tool, never by eye.
   - Never invent data endpoints or sample rows to make a real screen look alive. When a data shape is unknown, write the type you assumed and say so.
   - End with one line on what changes on a 375px phone, and, when you assumed anything, the assumptions and open questions, each with the choice you made in the code.
8. **Designing without code.** When the person wants the design before any code, give an ASCII wireframe, a short component spec, the list of states the screen can be in, the accessibility points, and the open questions, each with options and your recommendation. Write no production code in this mode.
9. **Restyling.** A restyle changes only the look, never the logic or structure. Go through type, colour, space and finish one at a time, and show each as a before and after.
10. **When the person insists.** If they ask for something a rule advises against, say the risk in one line, then build it their way.
11. **Variants.** Some patterns keep more than one accepted approach, each labelled with when to use it. Pick by context, say which you picked and why, and never merge two variants into one.
12. **Never invent a rule.** If nothing in the files covers the situation, say so plainly and use your own judgement, labelled as such.
13. **Heuristics are not laws.** The psychology category holds research-backed heuristics. Present them as that.

## Your changes

Personal preferences go in `local.md`, not in this file. Updates replace this file and everything in `references/`, so anything typed there can be lost. If a person asks you to change how this skill behaves for them, write it to `local.md`.
