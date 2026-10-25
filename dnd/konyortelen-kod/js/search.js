/* ==========================================================================
   Client-side search: index, accent-insensitive matching, highlighting,
   navbar quick-results dropdown and the search.html results page.
   ========================================================================== */
(function () {
  const KK = window.KK, U = KK.util, esc = U.esc;
  let index = null;
  const GROUP_ORDER = ["archive", "npcs", "monsters", "factions", "locations", "documents"];

  // Normalised string + map from each normalised char back to the original index.
  function normMap(str) {
    let n = "";
    const map = [];
    for (let i = 0; i < str.length; i++) {
      const c = U.norm(str[i]);
      for (let j = 0; j < c.length; j++) { n += c[j]; map.push(i); }
    }
    return { n, map };
  }

  function build() {
    const mode = KK.getLockedSearch();
    const entries = [];
    KK.items.forEach(it => {
      const unlocked = KK.isUnlocked(it);
      if (!unlocked && mode === "none") return;
      const title = KK.tx(it.title);
      // Locked pages: only the title is searchable – never their text, aliases or tags.
      const aliases = unlocked ? KK.aliasesOf(it) : [];
      const tags = unlocked ? (it.tags || []) : [];
      const text = unlocked ? KK.textsOf(it).join(" · ") : "";
      entries.push({
        it, unlocked, title, aliases, text,
        tagNames: tags.map(KK.tagName),
        nTitle: U.norm(title),
        nAliases: aliases.map(U.norm),
        nTags: tags.map(KK.tagName).concat(tags).map(U.norm),
        nText: U.norm(text)
      });
    });
    return { lang: KK.lang, version: KK.stateVersion, entries };
  }
  function get() {
    if (!index || index.lang !== KK.lang || index.version !== KK.stateVersion) index = build();
    return index;
  }

  const tokensOf = q => U.norm(q).split(/\s+/).filter(Boolean);
  KK.searchTokens = tokensOf;

  KK.search = function (q) {
    const tokens = tokensOf(q);
    if (!tokens.length) return [];
    const res = [];
    get().entries.forEach(e => {
      let score = 0;
      for (const tok of tokens) {
        let s = 0;
        if (e.nTitle.startsWith(tok)) s = 100;
        else if ((" " + e.nTitle).includes(" " + tok)) s = 80;
        else if (e.nTitle.includes(tok)) s = 60;
        else if (e.nAliases.some(a => a.includes(tok))) s = 45;
        else if (e.nTags.some(t => t.includes(tok))) s = 30;
        else if (e.nText.includes(tok)) s = 10;
        if (!s) return; // every token must match somewhere
        score += s;
      }
      if (!e.unlocked) score -= 5;
      res.push({ e, score });
    });
    return res.sort((a, b) => b.score - a.score || a.e.title.localeCompare(b.e.title, KK.lang));
  };

  // Wrap every token occurrence in <mark>, accent-insensitively, keeping original characters.
  KK.highlight = function (str, tokens) {
    const { n, map } = normMap(str);
    const marks = new Array(str.length).fill(false);
    tokens.forEach(tok => {
      let i = n.indexOf(tok);
      while (i !== -1) {
        for (let k = i; k < i + tok.length; k++) marks[map[k]] = true;
        i = n.indexOf(tok, i + tok.length);
      }
    });
    let out = "", open = false;
    for (let i = 0; i < str.length; i++) {
      if (marks[i] && !open) { out += "<mark>"; open = true; }
      if (!marks[i] && open) { out += "</mark>"; open = false; }
      out += esc(str[i]);
    }
    return out + (open ? "</mark>" : "");
  };

  function snippet(text, tokens, len) {
    len = len || 170;
    if (!text) return "";
    const { n, map } = normMap(text);
    let pos = -1;
    tokens.forEach(t => { const i = n.indexOf(t); if (i !== -1 && (pos === -1 || i < pos)) pos = i; });
    let start = 0;
    if (pos > 0) {
      const orig = map[pos];
      if (orig > 60) { const sp = text.lastIndexOf(" ", orig - 60); start = sp > 0 ? sp + 1 : orig - 60; }
    }
    const end = Math.min(text.length, start + len);
    return (start > 0 ? "…" : "") + KK.highlight(text.slice(start, end), tokens) + (end < text.length ? "…" : "");
  }

  function typeLabel(it) {
    if (it._cat === "archive") {
      if (it.kind === "chapter") return KK.t("archive.chapterN", { n: KK.roman(it.number) });
      return it.kind === "letter" ? KK.t("cat1.letter") : KK.t("cat1.missing");
    }
    return KK.t("cat1." + it._cat);
  }

  function grouped(results) {
    const groups = {};
    results.forEach(r => { (groups[r.e.it._cat] = groups[r.e.it._cat] || []).push(r); });
    return GROUP_ORDER.filter(g => groups[g]).map(g => ({ key: g, label: KK.t("cat." + g), items: groups[g] }));
  }

  /* ------------------------- navbar quick search ------------------------- */
  KK.initQuickSearch = function (input, list) {
    let active = -1, options = [];

    function close() {
      list.hidden = true;
      input.setAttribute("aria-expanded", "false");
      input.removeAttribute("aria-activedescendant");
      active = -1;
    }
    function setActive(i) {
      options.forEach(o => o.setAttribute("aria-selected", "false"));
      active = i;
      if (i >= 0 && options[i]) {
        options[i].setAttribute("aria-selected", "true");
        input.setAttribute("aria-activedescendant", options[i].id);
        options[i].scrollIntoView({ block: "nearest" });
      } else input.removeAttribute("aria-activedescendant");
    }
    function render() {
      const q = input.value.trim();
      if (!q) { list.innerHTML = ""; close(); return; }
      const tokens = tokensOf(q);
      const res = KK.search(q).slice(0, 8);
      let html = "", n = 0;
      if (!res.length) html += '<li class="qs-empty" role="presentation">' + esc(KK.t("search.none")) + "</li>";
      grouped(res).forEach(g => {
        html += '<li class="qs-group" role="presentation">' + esc(g.label) + "</li>";
        g.items.forEach(r => {
          const it = r.e.it, href = KK.urlFor(it);
          const meta = r.e.unlocked ? typeLabel(it) : KK.t("search.missing");
          html += '<li role="option" id="qs-opt-' + n++ + '" class="qs-option' + (r.e.unlocked ? "" : " is-locked") +
            '" aria-selected="false" data-href="' + esc(href) + '"><a href="' + esc(href) + '" tabindex="-1">' +
            '<span class="qs-title">' + KK.highlight(r.e.title, tokens) + '</span><span class="qs-meta">' + esc(meta) + "</span></a></li>";
        });
      });
      const allHref = "search.html?q=" + encodeURIComponent(q);
      html += '<li role="option" id="qs-opt-' + n + '" class="qs-option qs-all" aria-selected="false" data-href="' + esc(allHref) +
        '"><a href="' + esc(allHref) + '" tabindex="-1">' + esc(KK.t("search.all", { q })) + "</a></li>";
      list.innerHTML = html;
      options = Array.from(list.querySelectorAll('[role="option"]'));
      list.hidden = false;
      input.setAttribute("aria-expanded", "true");
      setActive(-1);
    }

    input.addEventListener("input", render);
    input.addEventListener("focus", () => { if (input.value.trim()) render(); });
    input.addEventListener("keydown", e => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        if (list.hidden) render();
        setActive(Math.min(options.length - 1, active + 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActive(Math.max(-1, active - 1));
      } else if (e.key === "Enter") {
        const q = input.value.trim();
        if (!q) return;
        e.preventDefault();
        location.href = active >= 0 && options[active] ? options[active].dataset.href : "search.html?q=" + encodeURIComponent(q);
      } else if (e.key === "Escape") {
        if (!list.hidden) { e.preventDefault(); close(); } else if (input.value) { input.value = ""; }
        else input.blur();
      }
    });
    // keep focus in the input while clicking results
    list.addEventListener("mousedown", e => e.preventDefault());
    input.addEventListener("blur", () => setTimeout(close, 120));
    KK.on("langchange", () => { if (!list.hidden) render(); });
  };

  /* --------------------------- search.html page --------------------------- */
  function resultsHTML(q) {
    if (!q) return '<p class="empty">' + esc(KK.t("search.empty")) + "</p>";
    const tokens = tokensOf(q);
    const res = KK.search(q);
    if (!res.length) return '<p class="empty">' + esc(KK.t("search.none")) + "</p>";
    return '<p class="result-count">' + esc(KK.t("search.count", { n: res.length })) + "</p>" +
      grouped(res).map(g =>
        '<section class="result-group" aria-labelledby="rg-' + g.key + '"><h2 id="rg-' + g.key + '">' + esc(g.label) +
        ' <span class="chip-count">' + g.items.length + '</span></h2><ul class="result-list">' +
        g.items.map(r => resultItem(r, tokens)).join("") + "</ul></section>").join("");
  }
  function resultItem(r, tokens) {
    const e = r.e, it = e.it, href = KK.urlFor(it);
    if (!e.unlocked) {
      return '<li class="result result-locked"><a class="result-title" href="' + esc(href) + '">' + KK.highlight(e.title, tokens) +
        '</a> <span class="result-cat">' + esc(KK.t("search.missing")) + "</span></li>";
    }
    const extra = [];
    e.aliases.forEach(a => { if (tokens.some(t => U.norm(a).includes(t))) extra.push(KK.highlight(a, tokens)); });
    e.tagNames.forEach(tg => { if (tokens.some(t => U.norm(tg).includes(t))) extra.push("#" + KK.highlight(tg, tokens)); });
    return '<li class="result"><a class="result-title" href="' + esc(href) + '">' + KK.highlight(e.title, tokens) + "</a> " +
      '<span class="result-cat">' + esc(typeLabel(it)) + "</span>" +
      (extra.length ? '<span class="result-extra">' + extra.join(", ") + "</span>" : "") +
      '<p class="result-snippet">' + snippet(e.text, tokens) + "</p></li>";
  }

  KK.pages.search = function (main) {
    const q = U.param("q") || "";
    document.title = KK.t("search.title") + " — " + KK.t("site.title");
    main.innerHTML =
      '<header class="page-head"><h1>' + esc(KK.t("search.title")) + "</h1></header>" +
      '<form class="search-form" role="search" action="search.html">' +
      '<label for="sp-q" class="visually-hidden">' + esc(KK.t("search.label")) + "</label>" +
      '<input id="sp-q" name="q" type="search" autocomplete="off" spellcheck="false" value="' + esc(q) + '">' +
      '<button class="btn" type="submit">' + esc(KK.t("search.label")) + "</button></form>" +
      '<div id="sp-results" aria-live="polite"></div>';
    const input = main.querySelector("#sp-q"), out = main.querySelector("#sp-results");
    const run = () => {
      const v = input.value.trim();
      out.innerHTML = resultsHTML(v);
      try { history.replaceState(null, "", v ? "search.html?q=" + encodeURIComponent(v) : "search.html"); } catch (e) { /* file:// */ }
    };
    input.addEventListener("input", U.debounce(run, 120));
    main.querySelector("form").addEventListener("submit", e => { e.preventDefault(); run(); });
    run();
  };
})();
