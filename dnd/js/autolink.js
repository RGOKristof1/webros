/* ==========================================================================
   Automatic links: article titles and aliases found in text become links.
   - only the first occurrence per article / chapter is linked
   - never links an article to itself
   - locked targets render as a "missing page" link (not clickable)
   - Hungarian: suffixes are allowed (Hollórévben, Lápanyának, Iska Moorral)
   Also computes backlinks ("What links here").
   ========================================================================== */
(function () {
  const KK = window.KK, U = KK.util;
  let cache = null;

  const escRe = s => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  // First letter case-insensitive, the rest exact. Hungarian: final a/e may lengthen to á/é.
  function termPattern(term, lang) {
    const chars = Array.from(term);
    const first = chars.shift();
    const lo = first.toLowerCase(), up = first.toUpperCase();
    let p = lo !== up ? "[" + escRe(lo) + escRe(up) + "]" : escRe(first);
    const rest = chars.map(escRe);
    if (lang === "hu" && rest.length) {
      const last = rest[rest.length - 1];
      if (last === "a") rest[rest.length - 1] = "[aá]";
      else if (last === "e") rest[rest.length - 1] = "[eé]";
    }
    return p + rest.join("");
  }

  function build() {
    const lang = KK.lang;
    const terms = [];
    KK.articles.forEach(it => {
      const names = [KK.tx(it.title)].concat(KK.aliasesOf(it));
      names.forEach(n => { n = (n || "").trim(); if (n.length >= 3) terms.push({ term: n, id: it.id }); });
    });
    terms.sort((a, b) => b.term.length - a.term.length); // longest first wins
    const keyMap = new Map();
    terms.forEach(t => { const k = U.norm(t.term); if (!keyMap.has(k)) keyMap.set(k, t.id); });
    const alt = terms.map(t => termPattern(t.term, lang)).join("|");
    const tail = lang === "hu" ? "(\\p{L}*)" : "((?:'s|s)?)(?![\\p{L}\\p{N}])";
    const re = alt ? new RegExp("(?<![\\p{L}\\p{N}])(" + alt + ")" + tail, "gu") : null;
    return { lang, version: KK.stateVersion, re, keyMap, backlinks: null };
  }

  function get() {
    if (!cache || cache.lang !== KK.lang || cache.version !== KK.stateVersion) cache = build();
    return cache;
  }

  // Returns escaped HTML with links. ctx = { self: id, linked: Set } – share one ctx per page.
  KK.autolink = function (text, ctx) {
    const s = String(KK.tx(text) || "");
    const c = get();
    if (!c.re) return U.esc(s);
    ctx = ctx || { linked: new Set() };
    let out = "", last = 0, m;
    c.re.lastIndex = 0;
    while ((m = c.re.exec(s))) {
      const id = c.keyMap.get(U.norm(m[1]));
      if (!id || id === ctx.self || ctx.linked.has(id)) continue;
      ctx.linked.add(id);
      out += U.esc(s.slice(last, m.index));
      const word = U.esc(m[0]);
      if (KK.isUnlocked(id)) {
        out += '<a class="autolink" href="' + KK.urlFor(KK.byId[id]) + '">' + word + "</a>";
      } else {
        out += '<span class="missing-link" title="' + U.esc(KK.t("locked.link")) + '">' + word + "</span>";
      }
      last = m.index + m[0].length;
    }
    return out + U.esc(s.slice(last));
  };

  // All visible text of an item in the current language (used by search + backlinks).
  KK.textsOf = function (it) {
    const out = [];
    const push = v => { const t = KK.tx(v); if (t) out.push(t); };
    const block = b => { push(b.text); (b.variants || []).forEach(v => push(v.text)); };
    if (it._cat === "archive") { (it.body || []).forEach(push); push(it.signature); }
    else {
      (it.lead || []).forEach(block);
      (it.sections || []).forEach(sec => (sec.blocks || []).forEach(block));
      (it.infobox || []).forEach(r => push(r.value));
    }
    return out;
  };

  // Ids of unlocked items whose text mentions the given article.
  KK.backlinks = function (id) {
    const c = get();
    if (!c.backlinks) {
      c.backlinks = {};
      if (c.re) {
        KK.items.forEach(src => {
          if (!KK.isUnlocked(src)) return;
          KK.textsOf(src).forEach(t => {
            let m;
            c.re.lastIndex = 0;
            while ((m = c.re.exec(t))) {
              const tid = c.keyMap.get(U.norm(m[1]));
              if (tid && tid !== src.id) (c.backlinks[tid] = c.backlinks[tid] || new Set()).add(src.id);
            }
          });
        });
      }
    }
    return Array.from(c.backlinks[id] || []);
  };
})();
