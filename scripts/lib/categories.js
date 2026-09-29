'use strict';
// Order here is the order on the page and in the skill's category table.
module.exports = [
  { id: 'interaction', title: 'Interaction', when: 'buttons, menus, tables, dialogs, drawers, drag and drop, keyboard and touch behaviour' },
  { id: 'forms', title: 'Forms', when: 'any input, validation, multi-step flow or settings screen' },
  { id: 'feedback', title: 'Feedback', when: 'loading, empty and error states, toasts, progress and confirmations' },
  { id: 'visual', title: 'Visual', when: 'colour, type, spacing, depth, icons and layout' },
  { id: 'motion', title: 'Motion', when: 'animation timing, easing and transitions' },
  { id: 'navigation', title: 'Navigation', when: 'tabs, breadcrumbs, pagination and moving between screens' },
  { id: 'content', title: 'Content', when: 'wording, headings and page-level structure' },
  { id: 'psychology', title: 'The Psychology of the User Experience', when: 'how people perceive, choose and remember' },
  { id: 'ai-slop', title: 'AI Slop: What Not To Do', when: 'always, for any new screen: the tells that make an interface look machine-made' },
];
