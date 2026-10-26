---
id: visual-character
title: Visual Character: One Decision per Axis
category: visual
order: 31
---
## Rule
<p>Every generator has a default look, and a screen left on it reads as machine-made whatever this year&rsquo;s default happens to be. Character comes from making one explicit decision on each of four axes, written down once (in the <a href="#lp-design-contract">Project Design Contract</a>, entry 32) and applied everywhere. This entry does not choose a style; it rules out not choosing. <strong>Type: where does the contrast live?</strong> Either high contrast (display type at 2.5 times the body size or more, a hard weight jump, or a second family) or deliberately low contrast for a dense expert tool; the comfortable middle is no decision. The one family versus two families choice is held as two variants in <a href="#lp-typography-system">Typography as a System</a> (entry 24). <strong>Colour: what is the signature?</strong> One signature colour, picked for the product&rsquo;s temperament and used rarely enough to mean something: the primary action and the one thing that must be found. Its contrast is decided with it: label text on the signature clears 4.5:1, and the signature clears 3:1 against the surface behind it, or the lightness changes until it does. Neutrals are calibrated warm, cool or pure to match the temperament, never the framework&rsquo;s default grey ramp, and status colours stay semantic.</p>
<p><strong>Space: what is the rhythm?</strong> Dense and efficient or airy and editorial, chosen once and then applied everywhere, with compression inside groups and release between them; uniform gaps of about 16px everywhere are the tell of undecided space. <strong>Finish: what is the separation language?</strong> One primary way for surfaces to separate: borders, shadows or flat colour planes. All three on one screen means no decision was made. Finish also lives in consistent radii, optical alignment and real hover, focus and active states. Two checks before shipping. Strip the accent: the screen should still work in neutrals alone, because hierarchy is not colour&rsquo;s job. Then the lineup test: would this screenshot be recognisable among ten generated screens for the same prompt? If not, walk the four axes and find the one still sitting on its default.</p>
## Do
- One written decision per axis: type, colour, space, finish
- Label text on the signature at 4.5:1, the signature itself at 3:1 against its surface
- The screen still works with the accent stripped out
## Avoid
- Borders, shadows and flat planes all separating surfaces on one screen
- Uniform 16px gaps everywhere
- A style adopted because it was the default, with no stated reason
## Code: TEXT
<pre><code>## Character
Type:    high contrast; serif display at 2.6 times the sans body (food is editorial)
Colour:  saffron signature on Start cooking only; warm neutrals, kitchens are not grey
Space:   airy; 8px inside a meta group, 32px between sections
Finish:  flat warm planes, no borders, no shadows</code></pre>
