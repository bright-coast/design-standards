# Adding or changing a rule

Rules live in `patterns/<category>/<slug>/`. Nothing else is edited by hand: the page, the skill, `release.json` and `catalog.json` are generated.

## One rule, two files

`pattern.md` holds the rule. `demo.html` holds its live demo (the `<div class="demo">...</div>` block). Copy an existing pattern and change it.

```
---
id: accordion
title: Accordion Disclosure
category: interaction
order: 1
---
## Rule
<p>One or more paragraphs of HTML. Use <code class="tok">inline code</code> for identifiers.</p>
## Do
- What to do, as an HTML fragment
## Avoid
- What not to do, as an HTML fragment
## Extra: caveat-box
<div class="caveat-box"><b>Note.</b> Optional extra text.</div>
## Code: CSS
<pre><code>.thing { display: grid; }</code></pre>
```

- `id` equals the folder name. `category` equals the parent folder. `order` is unique within the category, starting at 1.
- Sections: `Rule` (required), `Do`, `Avoid`, any number of `Extra: caveat-box` and `Extra: variant-note`, and any number of `Code: <label>`. A code section holds one or more `<pre><code>` blocks. Write `<` as `&lt;` inside code.
- No line inside a section may start with `## `.
- Where two accepted approaches disagree, keep each as a `variant-note` that says when to use each. Never merge them.
- Use theme tokens in demos (`var(--ds-accent)`, `var(--ds-ink)`, and so on, all defined in `themes/neutral.css`). Never a brand colour, font or logo.
- No credit lines: no creator handles, no lines naming where a rule came from, no post titles or dates. The only handle in this repo is the Bright Coast AI one, in the README and the page footer.
- No client, product or staff names. Use example data (`you@example.com`, "Acme").
- Scripts, docs and page files must be plain ASCII. In patterns, prefer HTML entities (`&rarr;`, `&check;`) for special characters. Never use em or en dashes anywhere.

## Category text

Each category folder has a `_category.html`. It holds the short paragraph under the category heading, plus any note that applies to the whole category. If a category needs something after its last rule (an index, for example), put a line `<!-- patterns -->` and then that HTML: everything before the line is shown above the first rule, everything after it below the last.

A new category: add it to `scripts/lib/categories.js`, create the folder and its `_category.html`.

## Every change

1. Add or edit the pattern folder.
2. `node scripts/build.js`
3. `node --test "test/**/*.test.js"`, then `node scripts/check-release.js --names-file <private names file> --licence-file <canonical licence copy>` and `node scripts/check-render.js`. The two files are kept outside this repo.
4. Add a `CHANGELOG.md` entry under a new version heading, written from `git log` in plain words (what changed for the reader). Its first line becomes the catalog's one-line summary of the change. Bump `VERSION` and `package.json` to match, then run `node scripts/build.js` again so `catalog.json` and `release.json` carry the new version and fingerprints.
5. Commit, then tag `v<version>`.
6. Move the `stable` branch forward to the release with a normal push, never a force-push. Moving `stable` is the moment people can install or update to the new version.

`release.json` lists every released skill file with its fingerprint, so another catalog can pick up a release later.
