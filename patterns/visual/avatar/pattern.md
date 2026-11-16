---
id: avatar
title: Avatar
category: visual
order: 34
---
## Rule
<p>An avatar always shows something. It falls back in a fixed order: the photo, then initials, then a generic person icon, and an image error handler swaps in the initials the moment a photo fails. A broken image icon or an empty grey circle is never a state.</p>
<p><strong>Initials and colour.</strong> Two initials by default (Ada Lovelace becomes AL), one at the smallest size. The background comes from a hash of the name into a fixed palette of six to eight colours, so the same person gets the same colour everywhere, and every palette colour is checked at 4.5:1 against the initials. <strong>Three sizes:</strong> for example 24px in dense lists, 32px in tables and menus, 40px in headers and profile cards.</p>
<p><strong>Groups.</strong> Grouped avatars overlap by about a quarter of their width, each with a 2px ring in the surface colour. Show three to five, then a neutral +N circle, with the full list on hover or tap. <strong>Presence</strong> on an avatar is a coloured ring around it (2px, after a 2px gap), not a badge stuck to its corner; the small status dot stays the convention for lists without an avatar. Presence also needs a text equivalent (Online, Away) in the accessible name.</p>
## Do
- Photo, then initials, then a generic icon
- Initials colour hashed from the name, from a contrast-checked palette
- Groups capped at three to five, with +N for the rest
## Avoid
- A broken image icon, or a colour that changes on every render
- A separate presence badge on the avatar&rsquo;s corner
## Code: CSS
<pre><code>.avatar { --size: 32px; width: var(--size); height: var(--size); border-radius: 9999px; display: grid; place-items: center; overflow: hidden; }
.avatar-sm { --size: 24px; } .avatar-lg { --size: 40px; } <span class="cm">/* three sizes only */</span>
.avatar.online { box-shadow: 0 0 0 2px var(--surface), 0 0 0 4px var(--good); } <span class="cm">/* gap, then presence ring */</span>
.avatar-group .avatar { box-shadow: 0 0 0 2px var(--surface); }
.avatar-group .avatar + .avatar { margin-left: calc(var(--size) * -.25); } <span class="cm">/* overlap by a quarter */</span></code></pre>
