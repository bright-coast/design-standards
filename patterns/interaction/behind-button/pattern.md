---
id: behind-button
title: Behind the Button
category: interaction
order: 2
---
## Rule
<p>Client-side validation exists purely for speed: instant feedback with zero round trips. It is never the safety boundary, because anyone can forge a request and send whatever price or quantity they want. The server has to re-run every check independently, recompute totals from its own source of truth, and wrap the related writes (order, line items, inventory, payment) in a single transaction so a mid-write failure rolls back everything instead of leaving a half-created order. When the response lands, repaint the UI with the server&rsquo;s real ID and total, not the value you optimistically guessed on the client.</p>
## Do
- Recompute price/total server-side from your own catalog
- One DB transaction for all related writes
## Avoid
- Optimistic UI on a payment or other irreversible action
## Code: Node / Express
<pre><code><span class="fn">app</span>.post(<span class="str">'/orders'</span>, <span class="kw">async</span> (req, res) => {
  <span class="cm">// never trust req.body.price, look it up server-side</span>
  <span class="kw">const</span> items = <span class="kw">await</span> db.getItems(req.body.itemIds);
  <span class="kw">const</span> total = items.reduce((sum, i) => sum + i.price * i.qty, <span class="num">0</span>);

  <span class="kw">const</span> order = <span class="kw">await</span> db.transaction(<span class="kw">async</span> (trx) => {
    <span class="kw">const</span> [order] = <span class="kw">await</span> trx(<span class="str">'orders'</span>)
      .insert({ total, status: <span class="str">'pending'</span> }).returning(<span class="str">'*'</span>);
    <span class="kw">await</span> trx(<span class="str">'order_items'</span>).insert(
      items.map(i => ({ order_id: order.id, ...i }))
    );
    <span class="kw">await</span> trx(<span class="str">'inventory'</span>).decrement(<span class="str">'stock'</span>, items);
    <span class="kw">return</span> order; <span class="cm">// throw anywhere above and the whole transaction rolls back</span>
  });

  res.json({ orderId: order.id, total }); <span class="cm">// server truth, not the client's guess</span>
});</code></pre>
