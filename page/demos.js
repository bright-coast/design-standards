
(function(){
  // ---- page theme toggle (System -> Light -> Dark) ----
  var root = document.documentElement;
  var btn = document.getElementById('pageThemeBtn');
  var states = ['system','light','dark'];
  var labels = {system:'\u25D0 Theme: System', light:'\u2600 Theme: Light', dark:'\u25CF Theme: Dark'};
  var cur = 'system';
  function applyPageTheme(v){
    cur = v;
    if (v === 'system') { root.removeAttribute('data-theme'); }
    else { root.setAttribute('data-theme', v); }
    btn.textContent = labels[v];
    btn.setAttribute('aria-pressed', v !== 'system');
  }
  applyPageTheme('system');
  btn.addEventListener('click', function(){
    var idx = (states.indexOf(cur) + 1) % states.length;
    applyPageTheme(states[idx]);
  });

  // ---- code panel expand/collapse (delegated, covers every .code-panel on the page, including any added later) ----
  document.addEventListener('click', function(e){
    var btn = e.target.closest('.code-toggle');
    if (!btn) return;
    var panel = btn.closest('.code-panel');
    var open = panel.classList.toggle('expanded');
    btn.querySelector('.txt').textContent = open ? 'Hide code' : 'Show code';
  });

  // ---- generic switcher: click a [data-switch-set] button, show the matching [data-switch-panel] ----
  document.addEventListener('click', function(e){
    var btn = e.target.closest('[data-switch-set]');
    if (!btn) return;
    var group = btn.closest('[data-switch-group]').getAttribute('data-switch-group');
    var val = btn.getAttribute('data-switch-set');
    document.querySelectorAll('[data-switch-group="' + group + '"] button').forEach(function(b){ b.setAttribute('aria-pressed', b === btn); });
    document.querySelectorAll('[data-switch-panel="' + group + '"]').forEach(function(p){ p.hidden = p.getAttribute('data-switch-value') !== val; });
  });

  // ---- generic replay: click a [data-replay] button, restart the CSS animation on its target ----
  document.addEventListener('click', function(e){
    var btn = e.target.closest('[data-replay]');
    if (!btn) return;
    var target = document.querySelector(btn.getAttribute('data-replay'));
    if (!target) return;
    target.classList.remove('replay-run');
    void target.offsetWidth;
    target.classList.add('replay-run');
  });

  // ---- generic sliding tabs indicator: [data-tabs] wrapper, buttons inside .tabs-demo-bar, panels via [data-switch-panel] ----
  document.querySelectorAll('[data-tabs]').forEach(function(wrap){
    var bar = wrap.querySelector('.tabs-demo-bar');
    var indicator = wrap.querySelector('.tabs-demo-indicator');
    function moveTo(btn){
      indicator.style.left = btn.offsetLeft + 'px';
      indicator.style.width = btn.offsetWidth + 'px';
    }
    var current = bar.querySelector('button[aria-selected="true"]') || bar.querySelector('button');
    requestAnimationFrame(function(){ moveTo(current); });
    bar.querySelectorAll('button').forEach(function(b){
      b.addEventListener('click', function(){
        bar.querySelectorAll('button').forEach(function(x){ x.setAttribute('aria-selected', x === b); });
        moveTo(b);
      });
    });
  });

  // ---- generic cursor pager: [data-pager] wrapper cycles a fake page count ----
  document.querySelectorAll('[data-pager]').forEach(function(wrap){
    var total = parseInt(wrap.getAttribute('data-pager'), 10);
    var cur = 1;
    var label = wrap.querySelector('.pager-cursor');
    var prev = wrap.querySelector('[data-pager-prev]');
    var next = wrap.querySelector('[data-pager-next]');
    function render(){
      label.textContent = 'cursor: page ' + cur + ' of ' + total;
      prev.disabled = cur === 1;
      next.disabled = cur === total;
    }
    prev.addEventListener('click', function(){ if (cur > 1) { cur--; render(); } });
    next.addEventListener('click', function(){ if (cur < total) { cur++; render(); } });
    render();
  });

  // ---- doherty threshold: simulate a 900ms load, with vs without a skeleton ----
  document.addEventListener('click', function(e){
    var btn = e.target.closest('[data-doherty]');
    if (!btn) return;
    var box = document.querySelector(btn.getAttribute('data-doherty'));
    box.classList.remove('loaded');
    var t0 = performance.now();
    setTimeout(function(){
      box.classList.add('loaded');
      var timerEl = box.parentElement.querySelector('.doherty-timer');
      if (timerEl) timerEl.textContent = 'loaded in ' + Math.round(performance.now() - t0) + 'ms';
    }, 900);
  });

  // ---- skeleton toggle: click to replay the loading -> loaded cycle ----
  document.addEventListener('click', function(e){
    var btn = e.target.closest('[data-skel-toggle]');
    if (!btn) return;
    var box = document.querySelector(btn.getAttribute('data-skel-toggle'));
    box.classList.add('loading');
    setTimeout(function(){ box.classList.remove('loading'); }, 900);
  });

  // ---- toast trigger: fire a real toast inside its own demo stage ----
  document.addEventListener('click', function(e){
    var btn = e.target.closest('[data-fire-toast]');
    if (!btn) return;
    var toast = document.querySelector(btn.getAttribute('data-fire-toast'));
    toast.classList.add('show');
    clearTimeout(toast._t);
    toast._t = setTimeout(function(){ toast.classList.remove('show'); }, 2800);
  });

  // ---- generic optimistic like/save (drives every copy of this demo) ----
  document.addEventListener('click', function(e){
    var likeBtn = e.target.closest('[data-like]');
    if (likeBtn) {
      var span = likeBtn.querySelector('.n');
      var base = parseInt(likeBtn.getAttribute('data-count'), 10);
      var liked = likeBtn.classList.toggle('liked');
      span.textContent = liked ? base + 1 : base;
    }
    var saveBtn = e.target.closest('[data-save]');
    if (saveBtn) {
      var status = saveBtn.parentElement.querySelector('[data-save-status]');
      status.innerHTML = '<span class="spinner"></span> Saving\u2026';
      setTimeout(function(){
        status.textContent = '\u2713 Saved';
        setTimeout(function(){ status.textContent = ''; }, 1800);
      }, 900);
    }
  });

  // ---- generic undo-on-delete (drives every copy of this demo) ----
  document.addEventListener('click', function(e){
    var delBtn = e.target.closest('[data-undodel]');
    if (delBtn) {
      var row = delBtn.closest('[data-undorow]');
      var toast = row.closest('.a-card').querySelector('[data-undo-toast]');
      row.style.display = 'none';
      toast._lastRow = row;
      toast.classList.add('show');
      clearTimeout(toast._timer);
      toast._timer = setTimeout(function(){ toast.classList.remove('show'); }, 4000);
    }
    var undoBtn = e.target.closest('[data-undo-btn]');
    if (undoBtn) {
      var toast = undoBtn.closest('[data-undo-toast]');
      if (toast._lastRow) toast._lastRow.style.display = '';
      toast.classList.remove('show');
      clearTimeout(toast._timer);
    }
  });

  // ---- autosave: debounced save-status cycle ----
  document.querySelectorAll('[data-autosave]').forEach(function(input){
    var status = document.querySelector(input.getAttribute('data-autosave'));
    var t;
    input.addEventListener('input', function(){
      status.innerHTML = 'idle';
      clearTimeout(t);
      t = setTimeout(function(){
        status.innerHTML = '<span class="spinner"></span> saving\u2026';
        setTimeout(function(){ status.textContent = '\u2713 saved'; }, 500);
      }, 700);
    });
  });

  // ---- file upload: simulated progress ----
  document.addEventListener('click', function(e){
    var btn = e.target.closest('[data-upload-sim]');
    if (!btn) return;
    var wrap = document.querySelector(btn.getAttribute('data-upload-sim'));
    var fill = wrap.querySelector('.upload-progress-fill');
    var pctEl = wrap.querySelector('.upload-pct');
    var pct = 0;
    clearInterval(wrap._t);
    wrap.style.display = 'flex';
    wrap._t = setInterval(function(){
      pct += 4;
      if (pct >= 100) { pct = 100; clearInterval(wrap._t); }
      fill.style.width = pct + '%';
      pctEl.textContent = pct + '%';
    }, 60);
  });

  // ---- form field states: switcher just toggles classes/attrs on one shared input ----
  document.querySelectorAll('[data-fieldstate-group]').forEach(function(group){
    var input = group.querySelector('.field-state-input');
    var msg = group.querySelector('.field-state-msg');
    group.querySelectorAll('[data-fieldstate]').forEach(function(btn){
      btn.addEventListener('click', function(){
        group.querySelectorAll('[data-fieldstate]').forEach(function(b){ b.setAttribute('aria-pressed', b === btn); });
        var state = btn.getAttribute('data-fieldstate');
        input.className = 'field-state-input';
        input.disabled = false;
        input.value = state === 'default' ? '' : 'user@example.com';
        msg.style.display = 'none';
        if (state === 'error') { input.classList.add('err'); msg.className = 'field-state-msg err'; msg.textContent = '\u26A0 Enter a valid email'; msg.style.display = 'flex'; }
        if (state === 'success') { input.classList.add('ok'); msg.className = 'field-state-msg ok'; msg.textContent = '\u2713 Looks good'; msg.style.display = 'flex'; }
        if (state === 'disabled') { input.disabled = true; }
        if (state === 'focus') { input.focus(); }
      });
    });
  });

  // ---- validation timing: validate on blur, then live once errored ----
  document.querySelectorAll('[data-validate-email]').forEach(function(input){
    var msg = document.querySelector(input.getAttribute('data-validate-email'));
    var errored = false;
    function check(){
      var ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value);
      input.classList.toggle('err', !ok);
      input.classList.toggle('ok', ok && input.value !== '');
      msg.textContent = ok ? '\u2713 Looks good' : (input.value ? '\u26A0 Enter a valid email' : '');
      msg.className = 'field-state-msg ' + (ok ? 'ok' : 'err');
      errored = !ok;
    }
    input.addEventListener('blur', check);
    input.addEventListener('input', function(){ if (errored) check(); });
  });

  // ---- input masking: card number formatting + brand detection ----
  document.querySelectorAll('[data-mask-card]').forEach(function(input){
    var brand = document.querySelector(input.getAttribute('data-mask-card'));
    input.addEventListener('input', function(){
      var digits = input.value.replace(/\D/g, '').slice(0, 16);
      input.value = digits.replace(/(\d{4})(?=\d)/g, '$1 ');
      brand.textContent = /^4/.test(digits) ? 'VISA' : /^5[1-5]/.test(digits) ? 'MASTERCARD' : /^3[47]/.test(digits) ? 'AMEX' : '';
    });
  });

  // ---- OTP: auto-advance, backspace-back, paste ----
  document.querySelectorAll('[data-otp]').forEach(function(wrap){
    var boxes = [].slice.call(wrap.querySelectorAll('.otp-box'));
    boxes.forEach(function(box, i){
      box.addEventListener('input', function(){
        box.value = box.value.replace(/\D/g, '').slice(-1);
        if (box.value && boxes[i + 1]) boxes[i + 1].focus();
      });
      box.addEventListener('keydown', function(e){
        if (e.key === 'Backspace' && !box.value && boxes[i - 1]) boxes[i - 1].focus();
      });
      box.addEventListener('paste', function(e){
        e.preventDefault();
        var digits = (e.clipboardData.getData('text').match(/\d/g) || []).slice(0, boxes.length);
        digits.forEach(function(d, j){ if (boxes[j]) boxes[j].value = d; });
        if (boxes[digits.length - 1]) boxes[digits.length - 1].focus();
      });
    });
  });

  // ---- password: live checklist + strength bar + visibility + generate ----
  document.querySelectorAll('[data-pw]').forEach(function(wrap){
    var input = wrap.querySelector('input');
    var items = [].slice.call(wrap.querySelectorAll('.pw-checklist li'));
    var fill = wrap.querySelector('.pw-bar-fill');
    var rules = [
      function(v){ return v.length >= 12; },
      function(v){ return /[A-Z]/.test(v) && /[a-z]/.test(v); },
      function(v){ return /\d/.test(v); },
    ];
    function update(){
      var metCount = 0;
      rules.forEach(function(rule, i){
        var ok = rule(input.value);
        items[i].classList.toggle('met', ok);
        if (ok) metCount++;
      });
      var pct = (metCount / rules.length) * 100;
      fill.style.width = pct + '%';
      fill.style.background = metCount === rules.length ? 'var(--ds-good)' : metCount >= 2 ? 'var(--a-warn)' : '#c0392b';
    }
    input.addEventListener('input', update);
    var toggle = wrap.querySelector('[data-pw-toggle]');
    if (toggle) toggle.addEventListener('click', function(){ input.type = input.type === 'password' ? 'text' : 'password'; });
    var gen = wrap.querySelector('[data-pw-gen]');
    if (gen) gen.addEventListener('click', function(){
      var chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%';
      var out = '';
      for (var i = 0; i < 16; i++) out += chars[Math.floor(Math.random() * chars.length)];
      input.value = out; input.type = 'text'; update();
    });
    update();
  });

  // ---- mini wizard: Next/Back through steps ----
  document.querySelectorAll('[data-mini-wizard]').forEach(function(wiz){
    var steps = [].slice.call(wiz.querySelectorAll('.mw-step-body > div'));
    var dots = [].slice.call(wiz.querySelectorAll('.mw-dots > div'));
    var cur = 0;
    function render(){
      steps.forEach(function(s, i){ s.style.display = i === cur ? 'block' : 'none'; });
      dots.forEach(function(d, i){ d.classList.toggle('on', i <= cur); });
      wiz.querySelector('[data-mw-back]').disabled = cur === 0;
      wiz.querySelector('[data-mw-next]').textContent = cur === steps.length - 1 ? 'Done' : 'Next';
    }
    wiz.querySelector('[data-mw-back]').addEventListener('click', function(){ if (cur > 0) { cur--; render(); } });
    wiz.querySelector('[data-mw-next]').addEventListener('click', function(){ if (cur < steps.length - 1) { cur++; render(); } else { cur = 0; render(); } });
    render();
  });

  // ---- toggle anatomy: instant vs simulated-async ----
  document.addEventListener('click', function(e){
    var sw = e.target.closest('.ta-switch');
    if (!sw) return;
    if (sw.hasAttribute('data-ta-async')) {
      if (sw.classList.contains('busy')) return;
      sw.classList.add('busy');
      setTimeout(function(){ sw.classList.remove('busy'); sw.classList.toggle('on'); }, 700);
    } else {
      sw.classList.toggle('on');
    }
  });

  // ---- accordion ----
  document.addEventListener('click', function(e){
    var trig = e.target.closest('.acc-trigger');
    if (!trig) return;
    var open = trig.getAttribute('aria-expanded') === 'true';
    trig.setAttribute('aria-expanded', String(!open));
    trig.nextElementSibling.classList.toggle('open', !open);
  });

  // ---- behind the button: simulated server round-trip ----
  document.addEventListener('click', function(e){
    var btn = e.target.closest('[data-bb-order]');
    if (!btn || btn.classList.contains('busy')) return;
    btn.classList.add('busy');
    var totalEl = document.querySelector(btn.getAttribute('data-bb-order'));
    setTimeout(function(){
      btn.classList.remove('busy');
      totalEl.textContent = '\u2713 Order #4821 confirmed, server total $128.40 (client guessed $120)';
    }, 900);
  });

  // ---- bottom sheet ----
  document.addEventListener('click', function(e){
    var openBtn = e.target.closest('[data-sheet-open]');
    if (openBtn) {
      var wrap = document.querySelector(openBtn.getAttribute('data-sheet-open'));
      wrap.querySelector('.sheet-demo-sheet').classList.add('open');
      wrap.querySelector('.sheet-demo-scrim').classList.add('open');
      return;
    }
    var closeEl = e.target.closest('[data-sheet-close]');
    if (closeEl) {
      var wrap2 = closeEl.closest('.sheet-demo-frame');
      wrap2.querySelector('.sheet-demo-sheet').classList.remove('open');
      wrap2.querySelector('.sheet-demo-scrim').classList.remove('open');
    }
  });

  // ---- bulk actions: tri-state header checkbox ----
  document.querySelectorAll('[data-bulk]').forEach(function(wrap){
    var head = wrap.querySelector('[data-bulk-head]');
    var rows = [].slice.call(wrap.querySelectorAll('[data-bulk-row]'));
    var countEl = wrap.querySelector('.bulk-count');
    function sync(){
      var checked = rows.filter(function(r){ return r.checked; }).length;
      head.indeterminate = checked > 0 && checked < rows.length;
      head.checked = checked === rows.length;
      countEl.textContent = checked + ' of ' + rows.length + ' selected';
    }
    head.addEventListener('click', function(){
      var next = head.indeterminate ? true : !head.checked ? true : head.checked;
      next = (head.checked || head.indeterminate);
      rows.forEach(function(r){ r.checked = next; });
      sync();
    });
    rows.forEach(function(r){ r.addEventListener('change', sync); });
    sync();
  });

  // ---- color picker: hex swatch + live contrast vs white ----
  document.querySelectorAll('[data-colorpicker]').forEach(function(wrap){
    function luminance(hex){
      var c = [1,3,5].map(function(i){ var v = parseInt(hex.substr(i,2),16)/255; return v <= .03928 ? v/12.92 : Math.pow((v+.055)/1.055,2.4); });
      return .2126*c[0] + .7152*c[1] + .0722*c[2];
    }
    function ratio(hex){ var l1 = luminance(hex), l2 = 1; return (Math.max(l1,l2)+.05)/(Math.min(l1,l2)+.05); }
    var box = wrap.querySelector('.cp-box');
    var badge = wrap.querySelector('[data-cp-badge]');
    function setColor(hex){
      box.style.background = hex;
      var r = ratio(hex);
      badge.textContent = (r >= 4.5 ? 'Passes AA ' : 'Fails AA ') + r.toFixed(1) + ':1';
      badge.style.color = r >= 4.5 ? 'var(--ds-good)' : '#c0392b';
      wrap.querySelectorAll('.cp-sw').forEach(function(s){ s.classList.toggle('active', s.getAttribute('data-hex') === hex); });
    }
    wrap.querySelectorAll('.cp-sw').forEach(function(sw){
      sw.style.background = sw.getAttribute('data-hex');
      sw.addEventListener('click', function(){ setColor(sw.getAttribute('data-hex')); });
    });
    setColor(wrap.querySelector('.cp-sw').getAttribute('data-hex'));
  });

  // ---- command palette: fuzzy filter ----
  document.querySelectorAll('[data-cmdk]').forEach(function(wrap){
    var input = wrap.querySelector('.cmd-input');
    var list = wrap.querySelector('.cmd-list');
    var items = [].slice.call(list.querySelectorAll('.cmd-row')).map(function(el){ return { el: el, label: el.textContent }; });
    function score(q, t){
      q = q.toLowerCase(); t = t.toLowerCase();
      var qi = 0;
      for (var i = 0; i < t.length; i++) { if (qi < q.length && t[i] === q[qi]) qi++; }
      return qi === q.length ? q.length / t.length : 0;
    }
    input.addEventListener('input', function(){
      var q = input.value;
      if (!q) { items.forEach(function(it){ it.el.style.display = ''; }); return; }
      var any = false;
      items.forEach(function(it){
        var s = score(q, it.label);
        it.el.style.display = s > 0 ? '' : 'none';
        if (s > 0) any = true;
      });
      var empty = list.querySelector('.cmd-empty');
      if (empty) empty.style.display = any ? 'none' : 'block';
    });
  });

  // ---- context menu ----
  document.addEventListener('contextmenu', function(e){
    var target = e.target.closest('[data-ctx-target]');
    if (!target) return;
    e.preventDefault();
    var menu = target.parentElement.querySelector('.ctx-menu');
    var frame = target.closest('.a-frame');
    var fr = frame.getBoundingClientRect();
    menu.style.left = Math.min(e.clientX - fr.left, fr.width - 150) + 'px';
    menu.style.top = (e.clientY - fr.top) + 'px';
    menu.classList.add('open');
  });
  document.addEventListener('click', function(e){
    if (!e.target.closest('.ctx-menu')) document.querySelectorAll('.ctx-menu.open').forEach(function(m){ m.classList.remove('open'); });
  });

  // ---- sortable table: tri-state sort cycle ----
  document.querySelectorAll('.sortable-table').forEach(function(table){
    var tbody = table.querySelector('tbody');
    var original = [].slice.call(tbody.querySelectorAll('tr'));
    table.querySelectorAll('th[data-sort-key]').forEach(function(th){
      var state = null;
      th.addEventListener('click', function(){
        table.querySelectorAll('th[data-sort-key]').forEach(function(t){ if (t !== th) t.querySelector('.sort-ind').textContent = ''; });
        state = state === null ? 'asc' : state === 'asc' ? 'desc' : null;
        th.querySelector('.sort-ind').textContent = state === 'asc' ? '\u2191' : state === 'desc' ? '\u2193' : '';
        var key = th.getAttribute('data-sort-key');
        var rows;
        if (state === null) { rows = original.slice(); }
        else {
          rows = [].slice.call(tbody.querySelectorAll('tr')).sort(function(a, b){
            var av = a.querySelector('[data-k="' + key + '"]').textContent;
            var bv = b.querySelector('[data-k="' + key + '"]').textContent;
            var an = parseFloat(av.replace(/[^0-9.]/g, '')), bn = parseFloat(bv.replace(/[^0-9.]/g, ''));
            var cmp = !isNaN(an) && !isNaN(bn) ? an - bn : av.localeCompare(bv);
            return state === 'asc' ? cmp : -cmp;
          });
        }
        rows.forEach(function(r){ tbody.appendChild(r); });
      });
    });
  });

  // ---- destructive: hold-to-confirm ----
  document.querySelectorAll('.destr-btn').forEach(function(btn){
    var timer;
    btn.addEventListener('pointerdown', function(){
      btn.classList.add('holding');
      timer = setTimeout(function(){
        btn.querySelector('.lbl').textContent = 'Deleted \u2713';
        btn.classList.remove('holding');
      }, 700);
    });
    ['pointerup','pointerleave'].forEach(function(ev){
      btn.addEventListener(ev, function(){ clearTimeout(timer); btn.classList.remove('holding'); });
    });
  });

  // ---- disabled buttons: validate on click, focus first blocker ----
  document.addEventListener('click', function(e){
    var btn = e.target.closest('[data-validate-submit]');
    if (!btn) return;
    var form = document.querySelector(btn.getAttribute('data-validate-submit'));
    var required = [].slice.call(form.querySelectorAll('[required]'));
    var blocker = required.find(function(f){ return !f.value; });
    if (blocker) {
      blocker.classList.add('err');
      blocker.focus();
      form.querySelector('.field-state-msg').textContent = '\u26A0 Fill in ' + (blocker.placeholder || 'this field') + ' to continue';
      form.querySelector('.field-state-msg').className = 'field-state-msg err';
    } else {
      form.querySelector('.field-state-msg').textContent = '\u2713 Submitted';
      form.querySelector('.field-state-msg').className = 'field-state-msg ok';
    }
  });

  // ---- drag and drop: native DnD between two zones ----
  document.querySelectorAll('.drag-card').forEach(function(card){
    card.setAttribute('draggable', 'true');
    card.addEventListener('dragstart', function(){ card.classList.add('dragging'); });
    card.addEventListener('dragend', function(){ card.classList.remove('dragging'); });
  });
  document.querySelectorAll('.drag-zone').forEach(function(zone){
    zone.addEventListener('dragover', function(e){ e.preventDefault(); zone.classList.add('over'); });
    zone.addEventListener('dragleave', function(){ zone.classList.remove('over'); });
    zone.addEventListener('drop', function(e){
      e.preventDefault();
      zone.classList.remove('over');
      var dragging = document.querySelector('.drag-card.dragging');
      if (dragging) zone.appendChild(dragging);
    });
  });

  // ---- dropdown ----
  document.addEventListener('click', function(e){
    var trig = e.target.closest('[data-ddown-trigger]');
    if (trig) {
      var menu = trig.nextElementSibling;
      document.querySelectorAll('.ddown-menu.open').forEach(function(m){ if (m !== menu) m.classList.remove('open'); });
      menu.classList.toggle('open');
      return;
    }
    var opt = e.target.closest('.ddown-menu button');
    if (opt) {
      var t = opt.closest('.ddown-menu').previousElementSibling;
      t.querySelector('.ddown-label').textContent = opt.textContent;
      opt.closest('.ddown-menu').classList.remove('open');
      return;
    }
    if (!e.target.closest('.ddown-menu')) document.querySelectorAll('.ddown-menu.open').forEach(function(m){ m.classList.remove('open'); });
  });

  // ---- filter chips ----
  document.querySelectorAll('[data-fchips]').forEach(function(wrap){
    var countEl = wrap.querySelector('.fc-count');
    var total = parseInt(wrap.getAttribute('data-fchips'), 10);
    wrap.querySelectorAll('.chip-row button').forEach(function(chip){
      chip.addEventListener('click', function(){
        chip.setAttribute('aria-pressed', chip.getAttribute('aria-pressed') !== 'true');
        var active = wrap.querySelectorAll('.chip-row button[aria-pressed="true"]').length;
        var matching = active === 0 ? total : Math.max(1, total - active * 2);
        countEl.textContent = matching + ' matching';
      });
    });
  });

  // ---- modal / sheet / popover hierarchy ----
  document.addEventListener('click', function(e){
    var opener = e.target.closest('[data-ov-open]');
    if (opener) {
      var stage = opener.closest('.a-frame').querySelector('.overlay-demo-stage');
      var kind = opener.getAttribute('data-ov-open');
      var scrim = stage.querySelector('.ov-scrim');
      stage.querySelectorAll('.ov-modal,.ov-sheet,.ov-popover').forEach(function(o){ o.classList.remove('open'); });
      var target = stage.querySelector('.ov-' + kind);
      target.classList.add('open');
      if (kind === 'modal' || kind === 'sheet') scrim.classList.add('open');
      return;
    }
    if (e.target.closest('.ov-close') || e.target.closest('.ov-scrim')) {
      var st = e.target.closest('.overlay-demo-stage');
      st.querySelectorAll('.ov-modal,.ov-sheet,.ov-popover').forEach(function(o){ o.classList.remove('open'); });
      st.querySelector('.ov-scrim').classList.remove('open');
    }
  });

  // ---- search experience: recent-on-focus + live filter ----
  document.querySelectorAll('[data-search-sys]').forEach(function(wrap){
    var input = wrap.querySelector('input');
    var results = wrap.querySelector('.search-sys-results');
    var all = JSON.parse(wrap.getAttribute('data-items'));
    var recent = all.slice(0, 2);
    function render(list, label){
      results.innerHTML = (label ? '<div class="search-sys-label">' + label + '</div>' : '') +
        (list.length ? list.map(function(i){ return '<div class="sr-row"><span>' + i.name + '</span><span class="sr-cat">' + i.cat + '</span></div>'; }).join('') : '<div class="sr-row" style="color:var(--a-ink2);">No matches, try a broader term</div>');
    }
    input.addEventListener('focus', function(){ if (!input.value) render(recent, 'Recent'); });
    input.addEventListener('input', function(){
      var q = input.value.toLowerCase();
      if (!q) return render(recent, 'Recent');
      render(all.filter(function(i){ return i.name.toLowerCase().indexOf(q) > -1; }), null);
    });
  });

  // ---- star rating ----
  document.querySelectorAll('.star-row').forEach(function(row){
    var stars = [].slice.call(row.querySelectorAll('.star'));
    var valueEl = row.parentElement.querySelector('.star-value');
    var saved = 0;
    function preview(n){ stars.forEach(function(s, i){ s.classList.toggle('filled', i < n); }); }
    stars.forEach(function(s, i){
      s.addEventListener('mouseenter', function(){ preview(i + 1); });
      s.addEventListener('click', function(){ saved = i + 1; valueEl.textContent = saved + ' / 5 saved'; });
    });
    row.addEventListener('mouseleave', function(){ preview(saved); });
  });

  // ---- swipe actions: pointer-drag reveal ----
  document.querySelectorAll('.swipe-row').forEach(function(row){
    var startX = 0, dx = 0, dragging = false;
    row.addEventListener('pointerdown', function(e){ dragging = true; startX = e.clientX; row.setPointerCapture(e.pointerId); });
    row.addEventListener('pointermove', function(e){
      if (!dragging) return;
      dx = Math.min(0, e.clientX - startX);
      row.style.transform = 'translateX(' + dx + 'px)';
    });
    function end(){
      dragging = false;
      row.style.transition = 'transform 200ms ease';
      row.style.transform = dx < -50 ? 'translateX(-70px)' : 'translateX(0)';
      setTimeout(function(){ row.style.transition = ''; }, 200);
    }
    row.addEventListener('pointerup', end);
    row.addEventListener('pointercancel', end);
  });

  // ---- tooltip: 300ms delay ----
  document.querySelectorAll('[data-tooltip]').forEach(function(trigger){
    var bubble = trigger.parentElement.querySelector('.tt-bubble');
    var t;
    trigger.addEventListener('mouseenter', function(){ t = setTimeout(function(){ bubble.classList.add('show'); }, 300); });
    trigger.addEventListener('mouseleave', function(){ clearTimeout(t); bubble.classList.remove('show'); });
  });

  // ---- generic inline editing (drives every copy of this demo) ----
  document.querySelectorAll('[data-inline-edit]').forEach(function(field){
    var input = field.querySelector('input');
    var lastValue = input.value;
    function startEdit(){ field.classList.add('editing'); input.readOnly = false; input.focus(); input.select(); }
    function commit(){ lastValue = input.value; endEdit(); }
    function cancel(){ input.value = lastValue; endEdit(); }
    function endEdit(){ field.classList.remove('editing'); input.readOnly = true; }
    field.addEventListener('click', startEdit);
    input.addEventListener('keydown', function(e){
      if (e.key === 'Enter') { e.preventDefault(); commit(); }
      if (e.key === 'Escape') { e.preventDefault(); cancel(); }
    });
    input.addEventListener('blur', commit);
  });

  // ---- 04: scroll-driven reveal (IntersectionObserver fallback keeps this demo working everywhere) ----
  document.querySelectorAll('.scroll-demo-box').forEach(function(box){
    var reveal = box.querySelector('.sdb-reveal');
    if (!reveal || !('IntersectionObserver' in window)) return;
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(en){ en.target.classList.toggle('in-view', en.isIntersecting); });
    }, { root: box, threshold: .4 });
    io.observe(reveal);
  });

  // ---- per-demo light/dark toggles ----
  document.querySelectorAll('[data-toggle-target]').forEach(function(toggle){
    var targetId = toggle.getAttribute('data-toggle-target');
    var target = document.getElementById(targetId);
    var btns = toggle.querySelectorAll('button');
    btns.forEach(function(b){
      b.addEventListener('click', function(){
        var val = b.getAttribute('data-theme-val');
        target.setAttribute('data-demo-theme', val);
        btns.forEach(function(x){ x.setAttribute('aria-pressed', x === b); });
      });
    });
  });

  // ---- 09: resizable panel (setPointerCapture) ----
  (function(){
    var handle = document.getElementById('resizerHandle');
    var left = document.getElementById('resizerLeft');
    if (!handle || !left) return;
    var dragging = false, startX = 0, startW = 0;
    var MIN = 90, MAX = 320, SNAP = 40;
    handle.addEventListener('pointerdown', function(e){
      dragging = true;
      startX = e.clientX;
      startW = left.offsetWidth;
      handle.classList.add('active');
      handle.setPointerCapture(e.pointerId);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
      e.preventDefault();
    });
    handle.addEventListener('pointermove', function(e){
      if (!dragging) return;
      var w = startW + (e.clientX - startX);
      if (w < SNAP) w = 0; else if (w < MIN) w = MIN;
      if (w > MAX) w = MAX;
      left.style.width = w + 'px';
    });
    function end(e){
      if (!dragging) return;
      dragging = false;
      handle.classList.remove('active');
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      try { handle.releasePointerCapture(e.pointerId); } catch(err){}
    }
    handle.addEventListener('pointerup', end);
    handle.addEventListener('pointercancel', end);
  })();

  // ---- lp-27: time-block dragging (bottom-handle resize, snap-to-grid, live HUD) ----
  (function(){
    var col = document.getElementById('tbdCol');
    var event = document.getElementById('tbdEvent');
    var handle = document.getElementById('tbdHandle');
    var hud = document.getElementById('tbdHud');
    if (!col || !event || !handle || !hud) return;
    var COL_MIN = 180; // column spans 9:00-12:00, 1px == 1 minute
    var DAY_START = 9 * 60;
    var SNAP = 15, MIN_DUR = 15;
    var dragging = false, startY = 0, startH = 0, top = 0;

    function fmt(mins){
      var h = Math.floor(mins / 60), m = mins % 60;
      var ampm = h >= 12 ? 'pm' : 'am';
      var h12 = h % 12; if (h12 === 0) h12 = 12;
      return h12 + (m ? ':' + (m < 10 ? '0' : '') + m : '') + ampm;
    }
    function render(height){
      event.style.height = height + 'px';
      var startMin = DAY_START + top;
      hud.textContent = fmt(startMin) + ' to ' + fmt(startMin + height) + ' \u00B7 ' + height + 'm \u00B7 snap ' + SNAP + 'm';
      hud.style.top = (top + height - 10) + 'px';
    }

    handle.addEventListener('pointerdown', function(e){
      dragging = true;
      startY = e.clientY;
      startH = event.offsetHeight;
      top = parseFloat(event.style.top) || 0;
      handle.setPointerCapture(e.pointerId);
      hud.classList.add('show');
      document.body.style.cursor = 'ns-resize';
      document.body.style.userSelect = 'none';
      render(startH);
      e.preventDefault();
    });
    handle.addEventListener('pointermove', function(e){
      if (!dragging) return;
      var raw = startH + (e.clientY - startY);
      var maxH = COL_MIN - top;
      var snapped = Math.round(raw / SNAP) * SNAP;
      if (snapped < MIN_DUR) snapped = MIN_DUR;
      if (snapped > maxH) snapped = maxH;
      render(snapped);
    });
    function end(e){
      if (!dragging) return;
      dragging = false;
      hud.classList.remove('show');
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      try { handle.releasePointerCapture(e.pointerId); } catch(err){}
    }
    handle.addEventListener('pointerup', end);
    handle.addEventListener('pointercancel', end);
  })();

  // ---- 08: inline editing ----
  (function(){
    var field = document.getElementById('editField');
    var input = document.getElementById('editInput');
    if (!field || !input) return;
    var lastValue = input.value;
    function startEdit(){
      field.classList.add('editing');
      input.readOnly = false;
      input.focus();
      input.select();
    }
    function commit(){ lastValue = input.value; endEdit(); }
    function cancel(){ input.value = lastValue; endEdit(); }
    function endEdit(){ field.classList.remove('editing'); input.readOnly = true; }
    field.addEventListener('click', startEdit);
    field.addEventListener('keydown', function(e){ if (e.key === 'Enter' || e.key === ' ') startEdit(); });
    input.addEventListener('keydown', function(e){
      if (e.key === 'Enter') { e.preventDefault(); commit(); }
      if (e.key === 'Escape') { e.preventDefault(); cancel(); }
    });
    input.addEventListener('blur', commit);
  })();

  // ---- 10: hover capability readout ----
  (function(){
    var el = document.getElementById('hoverReadout');
    if (!el) return;
    var hover = window.matchMedia('(hover: hover)').matches;
    el.textContent = hover
      ? 'hover: hover \u2192 hover affordances are safe on this device'
      : 'hover: none \u2192 primary actions must be visible without hover here';
  })();

  // ---- 12: undo on delete ----
  (function(){
    var toast = document.getElementById('undoToast');
    var undoBtn = document.getElementById('undoBtn'); if (!toast || !undoBtn) return;
    var timer = null;
    var lastRemoved = null, lastParent = null, lastNext = null;
    document.querySelectorAll('[data-del]').forEach(function(b){
      b.addEventListener('click', function(){
        var row = b.closest('[data-row]');
        if (!row) return;
        lastRemoved = row; lastParent = row.parentNode; lastNext = row.nextSibling;
        row.style.display = 'none';
        toast.classList.add('show');
        clearTimeout(timer);
        timer = setTimeout(function(){ toast.classList.remove('show'); }, 4000);
      });
    });
    undoBtn.addEventListener('click', function(){
      if (lastRemoved) { lastRemoved.style.display = ''; }
      toast.classList.remove('show');
      clearTimeout(timer);
    });
  })();

  // ---- 13: optimistic vs pessimistic ----
  (function(){
    var likeBtn = document.getElementById('likeBtn');
    var likeCount = document.getElementById('likeCount');
    var liked = false;
    if (likeBtn && likeCount) likeBtn.addEventListener('click', function(){
      liked = !liked;
      likeCount.textContent = liked ? '248' : '247';
    });
    var saveBtn = document.getElementById('saveBtn');
    var saveStatus = document.getElementById('saveStatus');
    var saving = false;
    if (saveBtn && saveStatus) saveBtn.addEventListener('click', function(){
      if (saving) return;
      saving = true;
      saveStatus.innerHTML = '<span class="spinner"></span> Saving\u2026';
      setTimeout(function(){
        saveStatus.textContent = '\u2713 Saved';
        saving = false;
        setTimeout(function(){ saveStatus.textContent=''; }, 1800);
      }, 900);
    });
  })();

  // ---- 14: wizard vs single page ----
  (function(){
    var single = document.getElementById('wizToggleSingle');
    var wiz = document.getElementById('wizToggleWiz');
    var singleCard = document.getElementById('singlePageCard');
    var wizardCard = document.getElementById('wizardCard');
    if (!single || !wiz) return;
    function show(mode){
      var isWiz = mode === 'wiz';
      wizardCard.style.display = isWiz ? '' : 'none';
      singleCard.style.display = isWiz ? 'none' : '';
      single.setAttribute('aria-pressed', !isWiz);
      wiz.setAttribute('aria-pressed', isWiz);
    }
    single.addEventListener('click', function(){ show('single'); });
    wiz.addEventListener('click', function(){ show('wiz'); });
  })();
})();

// ---- Calendar Week View + Copy to Clipboard demos ----
(function(){
  // Calendar Week View: open scrolled to now, not midnight (the view's own rule 1)
  document.querySelectorAll('[data-cwv-scroll]').forEach(function(box){
    var now = box.querySelector('.cwv-now');
    if (now) box.scrollTop = now.offsetTop - 40;
  });

  // Copy to Clipboard: the demo follows its own five rules
  function legacyCopy(text){
    try {
      var ta = document.createElement('textarea');
      ta.value = text; ta.setAttribute('readonly', '');
      ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select();
      var ok = document.execCommand('copy');
      document.body.removeChild(ta);
      return ok;
    } catch (err) { return false; }
  }
  function writeClipboard(text){
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text).then(function(){ return true; }, function(){ return legacyCopy(text); });
    }
    return Promise.resolve(legacyCopy(text));
  }
  document.addEventListener('click', function(e){
    var btn = e.target.closest('[data-cc-copy]');
    if (!btn || btn.classList.contains('copied') || btn.classList.contains('busy')) return;
    var status = btn.parentElement.querySelector('.cc-status');
    var delay = parseInt(btn.getAttribute('data-cc-delay') || '0', 10);
    writeClipboard(btn.getAttribute('data-cc-copy')).then(function(ok){
      function finish(){
        btn.classList.remove('busy');
        if (!ok) {
          status.classList.add('err');
          status.textContent = 'Could not copy. Select the text and press Ctrl+C.';
          return;
        }
        status.classList.remove('err');
        btn.classList.add('copied');
        status.textContent = 'Copied';
        setTimeout(function(){
          btn.classList.remove('copied');
          btn.classList.add('fade');
          status.textContent = '';
          setTimeout(function(){ btn.classList.remove('fade'); }, 200);
        }, 2000);
      }
      if (delay) { btn.classList.add('busy'); setTimeout(finish, delay); } else { finish(); }
    });
  });
})();
