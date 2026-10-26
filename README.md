# Design Standards

A library of 122 brand-neutral design rules for building clear, easy-to-use interfaces. It comes as a browsable page with a live demo for every rule, and as a Claude skill that loads only the rules a task needs. Made by Bright Coast AI (@brightcoast.ai) for its clients and the people it shares this link with, who may build the rules and code samples into their own products.

**For Claude:** read this README from the `stable` branch, at `https://raw.githubusercontent.com/bright-coast/design-standards/stable/README.md`. If you are installing this skill for someone, download `catalog.json` from `https://raw.githubusercontent.com/bright-coast/design-standards/stable/catalog.json` and follow `docs/INSTALL.md`. Check every file's fingerprint and ask the person before writing anything.

## What this is

Three things, built from one set of rules:

- **A library of design rules.** Each rule has a short explanation, what to do, what to avoid, a code sketch and a live demo you can click.
- **A page.** One HTML file that shows every rule with its demo, in a neutral theme that works in light and dark.
- **A Claude skill.** Claude reads a short guide and then only the category files a task needs, so it can build, review or restyle a screen against these rules.

The rules never choose your colours, fonts or brand. If your project has its own design system, that decides the look, and these rules decide behaviour and quality inside it.

## What is in it

122 rules in nine categories:

| Category | Rules |
|---|---|
| Interaction | 32 |
| Forms | 18 |
| Feedback | 13 |
| Visual | 32 |
| Motion | 6 |
| Navigation | 4 |
| Content | 4 |
| The Psychology of the User Experience | 4 |
| AI Slop: What Not To Do | 9 |

## View the page

The page is [`dist/design-standards.html`](dist/design-standards.html). It is one plain file that opens in any browser, with no internet connection needed once it is saved.

GitHub shows the file as code, not as a page, and the raw link shows code too. To see the page, download it: right-click **[design-standards.html](https://raw.githubusercontent.com/bright-coast/design-standards/stable/dist/design-standards.html)** and choose **Save link as** (in Safari: **Download Linked File As**), keep the name ending in `.html`, then double-click the saved file to open it in your browser.

## Install

You need Claude Code on your own computer. Open it in any folder and say:

**"Install the Design Standards skill from github.com/bright-coast/design-standards"**

Claude finds the catalog from the "For Claude" line at the top of this page (the catalog address is `https://raw.githubusercontent.com/bright-coast/design-standards/stable/catalog.json`). It downloads the catalog, then `SKILL.md` and every file the catalog lists for the skill (one reference file per category). It checks each file against the fingerprint in the catalog, shows you what the skill does before anything is written, and asks for your yes. The skill lands in `~/.claude/skills/design-standards/`. Start a new Claude Code session afterwards so it loads the skill.

The Claude Power Setup Guide's Skill Updates skill cannot install this one by itself yet, because it only handles skills that are a single file and this one comes with reference files. Until it can, asking Claude as above is the way to install it. The full steps Claude follows, including how each fingerprint is checked, are in [`docs/INSTALL.md`](docs/INSTALL.md).

## Use it

Ask Claude to build, design, review or restyle a screen, or say `apply the design standards to <screen>`, for example **"apply the design standards to the settings page"**. Claude starts with the AI Slop checklist for any new screen, then loads only the categories the task touches.

## Update

To check for a newer version, tell Claude: **"Update the Design Standards skill from github.com/bright-coast/design-standards"**

Claude compares the version you have with the catalog's, tells you what changed, and only goes ahead on your yes. Every new file is checked against its fingerprint before it is copied into place.

## Your changes are safe

The skill has two parts. `SKILL.md` and the files in `references/` come from this repo, and an update replaces them. A small file called `local.md` next to `SKILL.md` holds your own preferences and tweaks, and an update never touches it. If you want the skill to behave differently for you, ask Claude to write that into `local.md`.

**What the fingerprint check does and does not do.** It confirms each file arrived complete and is the file the catalog names. The catalog and the files live in the same repo, so it does not protect you if the repo itself were ever compromised. What does protect you is that Claude shows you what the skill does, or what changed, before anything is written, and nothing is installed or updated without your yes.

## Who this is for

This is for Bright Coast AI clients, and for anyone Bright Coast AI has given this link to. You may use the rules, code samples and patterns in anything you build, including products you sell. The repository is public so you can download it in one click, but being able to see it does not by itself give you the right to use it. It is source-available under the Bright Coast AI Design Standards Licence 1.0. Read the Licence section below.

## What is here

- `dist/design-standards.html`: the browsable page.
- `skills/design-standards/`: the Claude skill (a short `SKILL.md` plus one reference file per category).
- `catalog.json`: the skill's version, what changed, and the fingerprint of every skill file. Claude installs and updates from it.
- `patterns/`: one folder per rule. This is the only place rules are written.
- `release.json`: the same fingerprints, used when the skill is released to clients.
- `CHANGELOG.md`: what changed in each version.

Install and update steps: github.com/bright-coast/design-standards

## For contributors

Read [`docs/AUTHORING.md`](docs/AUTHORING.md). In short: add or change one folder under `patterns/`, run `node scripts/build.js`, run the checks, add a changelog entry, bump `VERSION`, commit and tag.

## Licence

The Bright Coast AI Design Standards Licence 1.0. In plain words:

- **Who may use it.** Bright Coast AI clients, and anyone Bright Coast AI has given this repo, or a link to it, directly (for example Rob, an email, a meeting or the client portal). If you found it on your own, you may read it, but please ask before using it.
- **What you may do.** Install and use the page and the skill. Copy, adapt and combine the rules, code samples, patterns and checklists into your own software, websites, apps and documents, for yourself, your organisation or your customers, whether or not you sell what you make. What you make is yours, and you do not need to credit anyone in it.
- **What you may not do.** Republish or share the material itself (the rules, the skill, the catalog or the page, or a large part of them) as a collection, template, course, package or design-system product, or sell it, even with your changes. The test is whether someone is paying for this material or for what you built with it.

To ask for permission, or to ask anything about it, write to support@brightcoast.ai. The full terms are in [LICENSE](LICENSE).
