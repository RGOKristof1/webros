/* ===== JS jegyzet – interaktivitás ===== */
(() => {
  'use strict';

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v === null ? d : JSON.parse(v); } catch { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* nem baj */ } }
  };

  /* ---------- Téma ---------- */
  const root = document.documentElement;
  const savedTheme = store.get('js-jegyzet-theme', null);
  const prefersDark = window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches;
  const setTheme = (t) => {
    root.dataset.theme = t;
    $('#themeBtn').textContent = t === 'dark' ? '☀️ Világos' : '🌙 Sötét';
    store.set('js-jegyzet-theme', t);
  };
  setTheme(savedTheme || (prefersDark ? 'dark' : 'light'));
  $('#themeBtn').addEventListener('click', () => setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark'));

  /* ---------- Szintaxiskiemelés ---------- */
  const KW = new Set('const let var function return if else for while do switch case break continue default try catch finally throw new class this typeof instanceof in of delete void async await yield extends super static'.split(' '));
  const LIT = new Set(['true', 'false', 'null', 'undefined', 'NaN', 'Infinity']);
  const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const TOKEN = /(\/\/[^\n]*|\/\*[\s\S]*?\*\/)|('(?:\\.|[^'\\\n])*'|"(?:\\.|[^"\\\n])*"|`(?:\\.|[^`\\])*`)|(\b\d[\d_]*(?:\.\d+)?n?\b)|([A-Za-z_$][\w$]*)/g;

  function highlight(src) {
    let out = '', last = 0, m;
    TOKEN.lastIndex = 0;
    while ((m = TOKEN.exec(src))) {
      out += esc(src.slice(last, m.index));
      const [tok, com, str, num, id] = m;
      if (com) out += `<span class="tk-com">${esc(tok)}</span>`;
      else if (str) out += `<span class="tk-str">${esc(tok)}</span>`;
      else if (num) out += `<span class="tk-num">${esc(tok)}</span>`;
      else if (id) {
        if (KW.has(id)) out += `<span class="tk-kw">${id}</span>`;
        else if (LIT.has(id)) out += `<span class="tk-lit">${id}</span>`;
        else if (/^\s*\(/.test(src.slice(m.index + id.length, m.index + id.length + 3)) ) out += `<span class="tk-fn">${id}</span>`;
        else out += id;
      }
      last = m.index + tok.length;
    }
    return out + esc(src.slice(last));
  }

  /* ---------- Konzolszerű kiírás ---------- */
  function inspect(v, d = 0, top = false, seen = new Set()) {
    const t = typeof v;
    if (t === 'string') return top ? v : `'${v.replace(/'/g, "\\'")}'`;
    if (v === null) return 'null';
    if (v === undefined) return 'undefined';
    if (t === 'number') return Object.is(v, -0) ? '-0' : String(v);
    if (t === 'bigint') return v + 'n';
    if (t === 'boolean' || t === 'symbol') return String(v);
    if (t === 'function') return v.name ? `[Function: ${v.name}]` : '[Function (anonymous)]';
    if (seen.has(v)) return '[Circular]';
    if (v instanceof Error) return `${v.name}: ${v.message}`;
    if (d > 2) return Array.isArray(v) ? '[Array]' : '[Object]';
    seen.add(v);
    const sub = (x) => inspect(x, d + 1, false, seen);
    let out;
    if (Array.isArray(v)) {
      out = v.length ? `[ ${Array.from(v, sub).join(', ')} ]` : '[]';
    } else if (v instanceof Set) {
      out = `Set(${v.size}) ` + (v.size ? `{ ${[...v].map(sub).join(', ')} }` : '{}');
    } else if (v instanceof Map) {
      out = `Map(${v.size}) ` + (v.size ? `{ ${[...v].map(([k, x]) => sub(k) + ' => ' + sub(x)).join(', ')} }` : '{}');
    } else {
      const keys = Object.keys(v);
      const cn = v.constructor && v.constructor.name;
      const pre = cn && cn !== 'Object' ? cn + ' ' : '';
      out = keys.length
        ? `${pre}{ ${keys.map((k) => `${/^[A-Za-z_$][\w$]*$/.test(k) ? k : `'${k}'`}: ${sub(v[k])}`).join(', ')} }`
        : pre + '{}';
    }
    seen.delete(v);
    return out;
  }

  function runCode(src) {
    const lines = [];
    const push = (type) => (...a) => lines.push({ type, text: a.map((x) => inspect(x, 0, true)).join(' ') });
    const fake = { log: push('log'), info: push('log'), warn: push('warn'), error: push('err'), debug: push('log') };
    try {
      new Function('console', src)(fake);
    } catch (e) {
      lines.push({ type: 'err', text: `${e.name}: ${e.message}` });
    }
    return lines;
  }

  /* ---------- Kódblokkok felépítése ---------- */
  let runnableCount = 0;
  $$('script[data-code]').forEach((tag) => {
    const original = tag.textContent.replace(/^\n+/, '').replace(/\s+$/, '');
    const runnable = tag.hasAttribute('data-run');
    const wrap = document.createElement('div');
    wrap.className = 'code';
    wrap.innerHTML = `
      <div class="code-bar">
        <span class="dots"><i></i><i></i><i></i></span><span>javascript</span><span class="sp"></span>
        ${runnable ? '<button class="reset" title="Eredeti kód visszaállítása" hidden>↺ Eredeti</button>' : ''}
        <button class="copy">Másolás</button>
        ${runnable ? '<button class="run" title="Futtatás (Ctrl+Enter)">▶ Futtatás</button>' : ''}
      </div>
      <pre><code spellcheck="false"></code></pre>
      ${runnable ? '<div class="out" aria-live="polite"></div>' : ''}`;
    const code = $('code', wrap);
    code.innerHTML = highlight(original);

    $('.copy', wrap).addEventListener('click', async (e) => {
      try { await navigator.clipboard.writeText(code.textContent); e.target.textContent = 'Másolva ✓'; }
      catch { e.target.textContent = 'Jelöld ki kézzel'; }
      setTimeout(() => (e.target.textContent = 'Másolás'), 1500);
    });

    if (runnable) {
      runnableCount++;
      const out = $('.out', wrap);
      const resetBtn = $('.reset', wrap);
      try { code.contentEditable = 'plaintext-only'; } catch { code.contentEditable = 'true'; }
      code.title = 'Szerkesztheted a kódot, majd futtasd újra';

      const run = () => {
        const res = runCode(code.textContent);
        out.innerHTML = '<span class="lbl">Kimenet (konzol)</span>' +
          (res.length ? res.map((l) => `<div class="ln ${l.type}">${esc(l.text) || '&nbsp;'}</div>`).join('') : '<div class="ln">(nincs kiírás)</div>');
        out.classList.add('show');
      };
      $('.run', wrap).addEventListener('click', run);
      code.addEventListener('blur', () => {
        const txt = code.textContent;
        code.innerHTML = highlight(txt);
        resetBtn.hidden = txt === original;
      });
      code.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') { e.preventDefault(); document.execCommand('insertText', false, '  '); }
        if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) { e.preventDefault(); run(); }
      });
      resetBtn.addEventListener('click', () => { code.innerHTML = highlight(original); resetBtn.hidden = true; out.classList.remove('show'); });
    }
    tag.replaceWith(wrap);
  });

  /* ---------- Témák: sorszám, "Tudom" gomb ---------- */
  const topics = $$('.topic');
  const done = new Set(store.get('js-jegyzet-done', []));
  topics.forEach((t, i) => {
    const h3 = $('h3', t);
    const head = document.createElement('div');
    head.className = 'topic-head';
    h3.parentNode.insertBefore(head, h3);
    head.appendChild(h3);
    const btn = document.createElement('button');
    btn.className = 'done-btn'; btn.type = 'button';
    head.appendChild(btn);
    const refresh = () => {
      const is = done.has(t.id);
      t.classList.toggle('done', is);
      btn.textContent = is ? '✓ Tudom' : 'Megtanultam?';
      const link = $(`.nav-group a[href="#${t.id}"]`);
      if (link) link.classList.toggle('done', is);
    };
    btn.addEventListener('click', () => {
      done.has(t.id) ? done.delete(t.id) : done.add(t.id);
      store.set('js-jegyzet-done', [...done]);
      refresh(); updateMeter();
    });
    t._refresh = refresh;
  });

  /* ---------- Oldalsáv ---------- */
  const nav = $('#nav');
  $$('.chapter').forEach((ch) => {
    const g = document.createElement('div');
    g.className = 'nav-group';
    g.innerHTML = `<h4><b>${$('.num', ch).textContent}</b>${$('h2', ch).textContent}</h4>`;
    $$('.topic', ch).forEach((t) => {
      const a = document.createElement('a');
      a.href = '#' + t.id;
      a.innerHTML = `<span>${t.dataset.title}</span><span class="tick">✓</span>`;
      g.appendChild(a);
    });
    nav.appendChild(g);
  });
  const qLink = document.createElement('div');
  qLink.className = 'nav-group';
  qLink.innerHTML = '<h4><b>?</b>Önellenőrzés</h4><a href="#kerdesek"><span>6 kérdés válasszal</span></a>';
  nav.appendChild(qLink);

  function updateMeter() {
    const n = topics.filter((t) => done.has(t.id)).length;
    $('#meterFill').style.width = (n / topics.length * 100) + '%';
    $('#meterText').textContent = `${n} / ${topics.length} téma megtanulva`;
  }
  topics.forEach((t) => t._refresh());
  updateMeter();

  /* Statisztika a hero-ban */
  $('#statTopics').textContent = topics.length;
  $('#statCode').textContent = runnableCount;

  /* ---------- Scroll-spy + olvasási folyamat ---------- */
  const links = $$('.nav-group a');
  const spy = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) {
        links.forEach((l) => l.classList.toggle('active', l.getAttribute('href') === '#' + en.target.id));
        const act = $('.nav-group a.active');
        if (act && window.innerWidth > 960) act.scrollIntoView({ block: 'nearest' });
      }
    });
  }, { rootMargin: '-15% 0px -75% 0px' });
  [...topics, $('#kerdesek')].forEach((el) => el && spy.observe(el));

  const bar = $('#readBar');
  const onScroll = () => {
    const h = document.documentElement;
    bar.style.width = (h.scrollTop / (h.scrollHeight - h.clientHeight || 1) * 100) + '%';
  };
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* Mobil menü */
  const sidebar = $('#sidebar');
  $('#menuBtn').addEventListener('click', () => sidebar.classList.toggle('open'));
  nav.addEventListener('click', (e) => { if (e.target.closest('a')) sidebar.classList.remove('open'); });

  /* ---------- typeof / truthy kipróbáló ---------- */
  const pgIn = $('#pgInput'), pgOut = $('#pgOut');
  const chips = ['0', '""', '"0"', '[]', '{}', 'null', 'undefined', 'NaN', '-1', '"abc"', '"42"', 'true', '[1, 2]', '10n', '() => {}', 'new Date(0)', "'5' + 1", "'5' - 1", '0.1 + 0.2'];
  $('#pgChips').innerHTML = chips.map((c) => `<button type="button" class="chip">${esc(c)}</button>`).join('');
  const safe = (fn) => { try { return { ok: true, v: fn() }; } catch (e) { return { ok: false, v: `${e.name}: ${e.message}` }; } };
  function evaluate() {
    const expr = pgIn.value.trim();
    if (!expr) { pgOut.innerHTML = ''; return; }
    const r = safe(() => new Function('return (' + expr + ')')());
    if (!r.ok) { pgOut.innerHTML = `<div class="pg-card err"><small>Hiba</small><div>${esc(r.v)}</div></div>`; return; }
    const v = r.v;
    const card = (label, res, html) => `<div class="pg-card ${res.ok ? '' : 'err'}"><small>${label}</small><div>${html ?? esc(res.ok ? inspect(res.v) : res.v)}</div></div>`;
    const bool = Boolean(v);
    pgOut.innerHTML =
      card('Érték', { ok: true, v }) +
      card('typeof', { ok: true, v: typeof v }) +
      card('Boolean(x)', { ok: true, v: bool }, `<span class="badge ${bool ? 'truthy' : 'falsy'}">${bool ? 'truthy' : 'falsy'}</span>`) +
      card('Number(x)', safe(() => Number(v))) +
      card('String(x)', safe(() => String(v))) +
      card('x === x', { ok: true, v: v === v }) ;
  }
  pgIn.addEventListener('input', evaluate);
  $('#pgRun').addEventListener('click', evaluate);
  $('#pgChips').addEventListener('click', (e) => {
    const c = e.target.closest('.chip');
    if (c) { pgIn.value = c.textContent; evaluate(); }
  });
  evaluate();

  /* ---------- Nyomtatás: válaszok kinyitása ---------- */
  addEventListener('beforeprint', () => $$('details.q').forEach((d) => (d.open = true)));
})();
