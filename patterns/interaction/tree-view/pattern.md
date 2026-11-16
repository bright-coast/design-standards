---
id: tree-view
title: Tree View
category: interaction
order: 36
---
## Rule
<p>A file tree is read by its indentation, so the indent has to be exact. Indent every level by the same fixed step (16px is a good default) and never by the width of an icon or a label, and draw a thin vertical guide line down from each open folder to its last child, so in a deep tree the eye can follow which folder a row belongs to without counting steps.</p>
<p><strong>Show expansion with the chevron alone.</strong> The chevron to the left of the folder rotates 90 degrees when the folder opens (about 150ms), and the folder icon itself stays the same. Swapping a closed folder icon for an open one as well gives the eye two signals that change at once and a row that jumps width.</p>
<p><strong>A full keyboard model.</strong> The tree is one tab stop. Up and Down move between visible rows. Right opens a closed folder, and on an open folder moves to its first child. Left closes an open folder, and on a closed folder or a file moves to its parent. Home and End jump to the first and last visible row, Enter opens the selected item, and typing a letter jumps to the next row starting with it. Use the tree roles (<code class="tok">role="tree"</code>, <code class="tok">treeitem</code>, <code class="tok">aria-expanded</code>) so a screen reader announces the level and state. Dragging onto a closed folder opens it after a short hover (<a href="#lp-drag-drop">Drag and Drop</a>).</p>
## Do
- A fixed indent per level, with a guide line from each open folder
- The chevron rotates; the folder icon stays the same
- Arrow keys: Right opens, Left closes, Up and Down move between rows
## Avoid
- Indentation that drifts with icon or label widths
- Swapping the folder icon and rotating the chevron at the same time
- A tree that only works with a mouse
## Code: CSS
<pre><code>.tree-row { padding-left: calc(var(--level) * <span class="num">16px</span>); }
.tree-group { position: relative; }
.tree-group::before {           <span class="cm">/* guide line from the open folder */</span>
  content: <span class="str">''</span>; position: absolute; top: <span class="num">0</span>; bottom: <span class="num">0</span>;
  left: calc(var(--level) * <span class="num">16px</span> + <span class="num">7px</span>);
  border-left: <span class="num">1px</span> solid var(--border);
}
.tree-chevron { transition: transform <span class="num">150ms</span> ease-out; }
[aria-expanded=<span class="str">"true"</span>] > .tree-chevron { transform: rotate(<span class="num">90deg</span>); }</code></pre>
