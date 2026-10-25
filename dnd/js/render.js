/* ==========================================================================
   Rendering: reliability badges, article blocks, cards, locked pages and the
   Home / Archive / Encyclopedia / Article pages.
   ========================================================================== */
(function () {
  const KK = window.KK, U = KK.util, esc = U.esc;
  const REL = ["verified", "rumor", "contradictory", "unknown"];
  KK.REL = REL;

  const ICONS = {
    verified: '<svg viewBox="0 0 16 16" width="14" height="14" focusable="false"><circle cx="8" cy="8" r="6.4" fill="currentColor" fill-opacity=".18" stroke="currentColor" stroke-width="1.6" stroke-dasharray="2.1 1.1"/><path d="M5.2 8.3l1.9 1.9 3.8-4.2" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    rumor: '<svg viewBox="0 0 16 16" width="14" height="14" focusable="false"><path d="M2.5 3.2h11v7.2H8l-3.2 2.7v-2.7H2.5z" fill="currentColor" fill-opacity=".18" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/><path d="M5 6h6M5 8.1h4" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg>',
    contradictory: '<svg viewBox="0 0 16 16" width="14" height="14" focusable="false"><path d="M2.5 5.2h9.5M9.6 2.6L12 5.2 9.6 7.8M13.5 10.8H4M6.4 8.2L4 10.8l2.4 2.6" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    unknown: '<svg viewBox="0 0 16 16" width="14" height="14" focusable="false"><circle cx="8" cy="8" r="6.4" fill="currentColor" fill-opacity=".14" stroke="currentColor" stroke-width="1.4"/><path d="M6.1 6.2a2 2 0 1 1 2.8 1.8c-.6.3-.9.7-.9 1.4" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><circle cx="8" cy="11.6" r=".95" fill="currentColor"/></svg>'
  };
  KK.relIcon = r => ICONS[r] || ICONS.unknown;

  const DEFAULT_IMG = {
    npcs: "img/npcs/placeholder.svg", monsters: "img/monsters/placeholder.svg",
    locations: "img/locations/placeholder.svg", factions: "img/ui/crest.svg", documents: "img/ui/scroll.svg"
  };
  const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII", "XIII", "XIV", "XV"];
  KK.roman = n => ROMAN[n - 1] || String(n);

  /* ------------------------------ building blocks ------------------------------ */

  KK.relBadge = function (rel, source, compact) {
    if (!REL.includes(rel)) rel = "unknown";
    const label = KK.t("rel." + rel);
    const src = KK.tx(source) || KK.t("rel.noSource");
    return '<button type="button" class="rel rel-' + rel + (compact ? " rel-compact" : "") + '" aria-label="' +
      esc(label + " – " + KK.t("rel.source") + ": " + src) + '">' +
      '<span class="rel-icon" aria-hidden="true">' + ICONS[rel] + "</span>" +
      '<span class="rel-name" aria-hidden="true">' + esc(label) + "</span>" +
      '<span class="rel-tip" aria-hidden="true"><strong>' + esc(label) + "</strong>" + esc(KK.t("rel.source")) + ": " + esc(src) + "</span></button>";
  };

  function blockHTML(b, ctx) {
    const rel = REL.includes(b.reliability) ? b.reliability : "unknown";
    const p = '<p class="claim claim-' + rel + '">' + KK.autolink(b.text, ctx) + " " + KK.relBadge(rel, b.source) + "</p>";
    if (!b.variants || !b.variants.length) return p;
    return '<div class="claim-group">' + p + '<ul class="variants">' + b.variants.map((v, i) =>
      '<li><span class="variant-label">' + esc(KK.t("rel.account", { n: i + 1 })) + ":</span> <q>" + KK.autolink(v.text, ctx) + "</q>" +
      (v.source ? ' <span class="variant-src">— ' + esc(KK.tx(v.source)) + "</span>" : "") + "</li>").join("") + "</ul></div>";
  }
  const blocksHTML = (list, ctx) => (list || []).map(b => blockHTML(b, ctx)).join("");

  KK.relSet = function (it) {
    const s = new Set();
    const add = b => { if (b && b.reliability) s.add(b.reliability); };
    (it.lead || []).forEach(add);
    (it.sections || []).forEach(sec => (sec.blocks || []).forEach(add));
    (it.infobox || []).forEach(add);
    return REL.filter(r => s.has(r));
  };

  KK.imageOf = function (it) {
    const im = it.image;
    const obj = im && typeof im === "object" ? im : null;
    const src = typeof im === "string" ? im : (obj && obj.src) || DEFAULT_IMG[it._cat] || "img/ui/scroll.svg";
    const alt = (obj && KK.tx(obj.alt)) || KK.t("img." + it._cat, { name: KK.tx(it.title) });
    return { src, alt, caption: obj ? KK.tx(obj.caption) : "" };
  };

  KK.catLabel = (cat, singular) => KK.t((singular ? "cat1." : "cat.") + cat);

  KK.teaser = function (it, len) {
    len = len || 140;
    const t = it._cat === "archive" ? KK.tx((it.body || [])[0]) : KK.tx(((it.lead || [])[0] || {}).text);
    if (t.length <= len) return t;
    const cut = t.lastIndexOf(" ", len);
    return t.slice(0, cut > 40 ? cut : len) + "…";
  };

  // The burned / torn "missing page" look.
  // Pass the item as 2nd argument: code-locked items get a code form and a readable title.
  KK.lockedHTML = function (title, it) {
    if (it && it.code) {
      const fid = "code-" + esc(it.id);
      return '<div class="locked-page"><div class="locked-inner">' +
        '<p class="locked-title is-sealed">' + esc(title) + "</p>" +
        '<p class="locked-msg">' + esc(KK.t(it.kind === "letter" ? "code.sealed" : "code.sealedPage")) + "</p>" +
        '<form class="code-form" data-code-for="' + esc(it.id) + '">' +
        '<label for="' + fid + '">' + esc(KK.t("code.label")) + "</label>" +
        '<input id="' + fid + '" type="text" autocomplete="off" autocapitalize="off" spellcheck="false">' +
        '<button type="submit" class="btn btn-small">' + esc(KK.t("code.submit")) + "</button>" +
        '<p class="code-msg" role="status" aria-live="polite"></p></form></div></div>';
    }
    return '<div class="locked-page"><div class="locked-inner">' +
      (title ? '<p class="locked-title" aria-hidden="true">' + esc(title) + "</p>" : "") +
      '<p class="locked-msg">' + esc(KK.t("locked.title")) + "</p></div></div>";
  };

  // Code forms anywhere on the page (delegated, so it survives re-renders).
  KK.initCodeForms = function () {
    // "Hide": close a code-opened letter again (the code is needed to reopen it)
    document.addEventListener("click", e => {
      const btn = e.target.closest && e.target.closest("[data-hide]");
      if (!btn) return;
      const id = btn.dataset.hide;
      KK.lockCode(id);
      const input = document.getElementById("code-" + id);
      if (input) input.focus();
    });
    document.addEventListener("submit", e => {
      const form = e.target.closest && e.target.closest(".code-form");
      if (!form) return;
      e.preventDefault();
      const id = form.dataset.codeFor;
      const input = form.querySelector("input");
      if (KK.unlockWithCode(id, input.value)) {
        const el = document.getElementById(id);
        if (el) { el.scrollIntoView({ block: "start" }); el.setAttribute("tabindex", "-1"); el.focus({ preventScroll: true }); }
      } else {
        form.querySelector(".code-msg").textContent = KK.t("code.wrong");
        input.select();
      }
    });
  };

  KK.cardHTML = function (it) {
    const cat = KK.catLabel(it._cat, true);
    if (!KK.isUnlocked(it)) {
      return '<li class="card card-locked"><div class="card-burn"><span class="card-cat">' + esc(cat) + "</span>" +
        '<span class="card-title locked-title" aria-hidden="true">' + esc(KK.tx(it.title)) + "</span>" +
        '<span class="locked-msg">' + esc(KK.t("locked.title")) + "</span></div></li>";
    }
    const img = KK.imageOf(it);
    const rels = KK.relSet(it);
    return '<li class="card"><a class="card-link" href="' + KK.urlFor(it) + '">' +
      '<span class="card-img"><img src="' + esc(img.src) + '" alt="" loading="lazy" width="96" height="120"></span>' +
      '<span class="card-body"><span class="card-cat">' + esc(cat) + "</span>" +
      '<span class="card-title">' + esc(KK.tx(it.title)) + "</span>" +
      '<span class="card-text">' + esc(KK.teaser(it)) + "</span>" +
      '<span class="card-rels">' + rels.map(r => '<span class="rel-dot rel-' + r + '" title="' + esc(KK.t("rel." + r)) + '">' + ICONS[r] +
        '<span class="visually-hidden">' + esc(KK.t("rel." + r)) + "</span></span>").join("") + "</span>" +
      "</span></a></li>";
  };

  // One stop of the caravan route (home page + map page).
  KK.stopHTML = function (p, i, n) {
    const it = KK.byId[p.id];
    const known = !!it && KK.isUnlocked(it);
    const role = i === 0 ? KK.t("home.start") : (i === n - 1 ? KK.t("home.destination") : "");
    return '<li class="stop' + (known ? "" : " stop-unknown") + '"><span class="stop-marker" aria-hidden="true">' + (i + 1) + "</span>" +
      '<span class="stop-body">' +
      (known ? '<a href="' + KK.urlFor(it) + '">' + esc(KK.tx(it.title)) + "</a>" : '<span class="stop-fog">' + esc(KK.t("home.unknownStop")) + "</span>") +
      '<span class="stop-terrain">' + esc(KK.tx(p.terrain)) + (role ? " · " + esc(role) : "") + "</span></span></li>";
  };

  /* --------------------------------- tooltips --------------------------------- */
  // Hover / focus shows the source tooltip; click / tap pins it. Escape closes.
  KK.initTooltips = function () {
    function place(b) {
      const tip = b.querySelector(".rel-tip");
      if (!tip) return;
      b.classList.remove("below");
      tip.style.setProperty("--shift", "0px");
      let r = tip.getBoundingClientRect();
      if (r.top < 70) { b.classList.add("below"); r = tip.getBoundingClientRect(); }
      const m = 8;
      let shift = 0;
      if (r.left < m) shift = m - r.left;
      else if (r.right > window.innerWidth - m) shift = window.innerWidth - m - r.right;
      tip.style.setProperty("--shift", shift + "px");
    }
    function show(b) { if (!b.classList.contains("open")) { b.classList.add("open"); place(b); } }
    function hide(b) { if (!b.classList.contains("pinned")) b.classList.remove("open"); }
    const relOf = el => (el && el.closest ? el.closest(".rel:not(.is-static)") : null);

    document.addEventListener("mouseover", e => { const b = relOf(e.target); if (b) show(b); });
    document.addEventListener("mouseout", e => {
      const b = relOf(e.target);
      if (b && !b.contains(e.relatedTarget)) hide(b);
    });
    document.addEventListener("focusin", e => { const b = relOf(e.target); if (b) show(b); });
    document.addEventListener("focusout", e => { const b = relOf(e.target); if (b) { b.classList.remove("pinned"); b.classList.remove("open"); } });
    document.addEventListener("click", e => {
      const b = relOf(e.target);
      document.querySelectorAll(".rel.pinned").forEach(x => { if (x !== b) { x.classList.remove("pinned", "open"); } });
      if (!b) return;
      if (b.classList.contains("pinned")) { b.classList.remove("pinned", "open"); }
      else { b.classList.add("pinned"); show(b); }
    });
    document.addEventListener("keydown", e => {
      if (e.key === "Escape") document.querySelectorAll(".rel.open").forEach(x => x.classList.remove("open", "pinned"));
    });
  };

  /* --------------------------------- home --------------------------------- */
  KK.pages.home = function (main) {
    document.title = KK.t("site.title");
    const h = KK.home || {};
    const ctx = { linked: new Set() };
    const intro = h.intro || [];
    const pts = (KK.mapData && KK.mapData.points) || [];
    const latest = KK.archive.filter(c => c.kind === "chapter" && KK.isUnlocked(c)).sort((a, b) => b.number - a.number)[0];
    const featured = ((KK.config && KK.config.featured) || []).map(id => KK.byId[id]).filter(Boolean);

    main.innerHTML =
      '<section class="hero">' +
      '<img class="hero-seal" src="img/ui/seal-mark.svg" alt="" width="104" height="104">' +
      '<h1 class="hero-title">' + esc(KK.t("site.title")) + "</h1>" +
      '<div class="ornament" role="presentation"></div></section>' +
      (intro.length ? '<section class="intro drop-cap">' + intro.map(p => "<p>" + KK.autolink(p, ctx) + "</p>").join("") + "</section>" : "") +
      (pts.length || h.routeIntro ?
        '<section class="route-section" aria-labelledby="route-h"><h2 id="route-h">' + esc(KK.t("home.route")) + "</h2>" +
        (h.routeIntro ? "<p>" + KK.autolink(h.routeIntro, ctx) + "</p>" : "") +
        '<ol class="route-list">' + pts.map((p, i) => KK.stopHTML(p, i, pts.length)).join("") + "</ol>" +
        '<p><a class="btn" href="map.html">' + esc(KK.t("home.openMap")) + "</a></p></section>" : "") +
      (latest ?
        '<section class="latest" aria-labelledby="latest-h"><h2 id="latest-h">' + esc(KK.t("home.latest")) + "</h2>" +
        '<article class="latest-card"><p class="chapter-num">' + esc(KK.t("archive.chapterN", { n: KK.roman(latest.number) })) + "</p>" +
        '<h3><a href="archive.html#' + esc(latest.id) + '">' + esc(KK.tx(latest.title)) + "</a></h3>" +
        "<p>" + esc(KK.teaser(latest, 220)) + "</p>" +
        '<p><a href="archive.html#' + esc(latest.id) + '">' + esc(KK.t("home.read")) + " →</a></p></article></section>" : "") +
      (featured.length ?
        '<section class="featured" aria-labelledby="feat-h"><h2 id="feat-h">' + esc(KK.t("home.featured")) + "</h2>" +
        '<ul class="card-grid">' + featured.map(KK.cardHTML).join("") + "</ul></section>" : "");
  };

  /* -------------------------------- archive -------------------------------- */
  function chapterHTML(c) {
    const num = KK.t("archive.chapterN", { n: KK.roman(c.number) });
    if (!KK.isUnlocked(c)) {
      return '<article class="chapter chapter-locked" id="' + esc(c.id) + '" aria-label="' + esc(num + ": " + KK.t("locked.title")) + '">' +
        '<p class="chapter-num">' + esc(num) + "</p>" + KK.lockedHTML(KK.tx(c.title), c) + "</article>";
    }
    const ctx = { self: c.id, linked: new Set() };
    return '<article class="chapter" id="' + esc(c.id) + '" aria-labelledby="' + esc(c.id) + '-h">' +
      '<header class="chapter-head"><p class="chapter-num">' + esc(num) + "</p>" +
      '<h2 id="' + esc(c.id) + '-h">' + esc(KK.tx(c.title)) + "</h2>" +
      (c.date ? '<p class="chapter-date">' + esc(KK.tx(c.date)) + "</p>" : "") + "</header>" +
      '<div class="chapter-body drop-cap">' + (c.body || []).map(p => "<p>" + KK.autolink(p, ctx) + "</p>").join("") + "</div>" +
      '<div class="ornament" role="presentation"></div></article>';
  }
  function leafHTML(c) {
    if (!KK.isUnlocked(c)) return '<article class="leaf leaf-locked" id="' + esc(c.id) + '" aria-label="' + esc(KK.t("locked.title")) + '">' + KK.lockedHTML(KK.tx(c.title), c) + "</article>";
    const ctx = { self: c.id, linked: new Set() };
    return '<article class="leaf" id="' + esc(c.id) + '" aria-labelledby="' + esc(c.id) + '-h"><h3 id="' + esc(c.id) + '-h">' + esc(KK.tx(c.title)) + "</h3>" +
      (c.found ? '<p class="leaf-found"><span>' + esc(KK.t("archive.found")) + ":</span> " + esc(KK.tx(c.found)) + "</p>" : "") +
      '<div class="leaf-body">' + (c.body || []).map(p => "<p>" + KK.autolink(p, ctx) + "</p>").join("") + "</div></article>";
  }

  function letterHTML(c) {
    if (!KK.isUnlocked(c)) {
      return '<article class="letter letter-locked" id="' + esc(c.id) + '" aria-label="' + esc(KK.tx(c.title)) + '">' + KK.lockedHTML(KK.tx(c.title), c) + "</article>";
    }
    const ctx = { self: c.id, linked: new Set() };
    return '<article class="letter" id="' + esc(c.id) + '" aria-labelledby="' + esc(c.id) + '-h">' +
      '<img class="letter-seal" src="img/ui/seal-mark.svg" alt="" width="46" height="46">' +
      '<h3 id="' + esc(c.id) + '-h">' + esc(KK.tx(c.title)) + "</h3>" +
      '<div class="letter-body">' + (c.body || []).map(p => "<p>" + KK.autolink(p, ctx) + "</p>").join("") + "</div>" +
      (c.signature ? '<p class="letter-signature">' + KK.autolink(c.signature, ctx) + "</p>" : "") +
      (c.code ? '<p class="letter-actions"><button type="button" class="btn btn-small btn-ghost" data-hide="' + esc(c.id) + '">' + esc(KK.t("code.hide")) + "</button></p>" : "") +
      "</article>";
  }

  KK.pages.archive = function (main) {
    document.title = KK.t("archive.title") + " — " + KK.t("site.title");
    const chapters = KK.archive.filter(c => c.kind === "chapter").sort((a, b) => a.number - b.number);
    const missing = KK.archive.filter(c => c.kind === "missing");
    const letters = KK.archive.filter(c => c.kind === "letter");
    const tocItem = c => {
      const open = KK.isUnlocked(c);
      return '<li class="' + (open ? "" : "is-locked") + '"><a href="#' + esc(c.id) + '"><span class="toc-num">' + KK.roman(c.number) + ".</span> " +
        (open ? esc(KK.tx(c.title)) : '<span class="blurred" aria-hidden="true">' + esc(KK.tx(c.title)) + '</span><span class="visually-hidden">' + esc(KK.t("locked.title")) + "</span>") +
        "</a></li>";
    };
    const head = '<header class="page-head"><h1>' + esc(KK.t("archive.title")) + "</h1>" +
      '<div class="ornament" role="presentation"></div></header>';
    if (!chapters.length && !missing.length && !letters.length) {
      main.innerHTML = head + '<p class="empty">' + esc(KK.t("archive.none")) + "</p>";
      return;
    }
    const extraToc =
      (letters.length ? '<li class="toc-missing"><a href="#letters">✉ ' + esc(KK.t("archive.letters")) + "</a></li>" : "") +
      (missing.length ? '<li class="toc-missing"><a href="#missing-pages">✦ ' + esc(KK.t("archive.missing")) + "</a></li>" : "");
    main.innerHTML = head +
      (chapters.length ?
        '<nav class="archive-toc toc" aria-labelledby="atoc-h"><h2 id="atoc-h" class="toc-h">' + esc(KK.t("archive.chapters")) + "</h2>" +
        "<ol>" + chapters.map(tocItem).join("") + extraToc + "</ol></nav>" +
        '<div class="chapters">' + chapters.map(chapterHTML).join("") + "</div>" : "") +
      (letters.length ?
        '<section id="letters" class="letters" aria-labelledby="letters-h"><h2 id="letters-h">' + esc(KK.t("archive.letters")) + "</h2>" +
        '<div class="leaf-grid">' + letters.map(letterHTML).join("") + "</div></section>" : "") +
      (missing.length ?
        '<section id="missing-pages" class="missing-pages" aria-labelledby="mp-h"><h2 id="mp-h">' + esc(KK.t("archive.missing")) + "</h2>" +
        '<div class="leaf-grid">' + missing.map(leafHTML).join("") + "</div></section>" : "");
  };

  /* ------------------------------ encyclopedia ------------------------------ */
  let encState = null;
  KK.pages.encyclopedia = function (main) {
    document.title = KK.t("enc.title") + " — " + KK.t("site.title");
    if (!encState) {
      const c = U.param("cat"), r = U.param("rel");
      encState = { cat: KK.categories.includes(c) ? c : "all", rel: REL.includes(r) ? r : "all" };
    }
    const st = encState;
    const relOk = it => st.rel === "all" || (KK.isUnlocked(it) && KK.relSet(it).includes(st.rel));
    const catOk = it => st.cat === "all" || it._cat === st.cat;
    const list = KK.articles.filter(it => catOk(it) && relOk(it));
    const byTitle = (a, b) => KK.tx(a.title).localeCompare(KK.tx(b.title), KK.lang);

    const catChip = c => {
      const n = KK.articles.filter(it => (c === "all" || it._cat === c) && relOk(it)).length;
      return '<button type="button" class="chip" data-cat="' + c + '" aria-pressed="' + (st.cat === c) + '">' +
        esc(c === "all" ? KK.t("enc.all") : KK.catLabel(c)) + ' <span class="chip-count">' + n + "</span></button>";
    };
    const relChip = r => '<button type="button" class="chip chip-rel' + (r === "all" ? "" : " chip-" + r) + '" data-rel="' + r + '" aria-pressed="' + (st.rel === r) + '">' +
      (r === "all" ? "" : '<span class="rel-icon" aria-hidden="true">' + ICONS[r] + "</span>") + esc(r === "all" ? KK.t("enc.all") : KK.t("rel." + r)) + "</button>";

    let body;
    if (!KK.articles.length) body = '<p class="empty">' + esc(KK.t("enc.none")) + "</p>";
    else if (!list.length) body = '<p class="empty">' + esc(KK.t("enc.empty")) + "</p>";
    else if (st.cat === "all") {
      body = KK.categories.map(c => {
        const items = list.filter(it => it._cat === c).sort(byTitle);
        if (!items.length) return "";
        return '<section class="enc-group" aria-labelledby="eg-' + c + '"><h2 id="eg-' + c + '">' + esc(KK.catLabel(c)) + "</h2>" +
          '<ul class="card-grid">' + items.map(KK.cardHTML).join("") + "</ul></section>";
      }).join("");
    } else body = '<ul class="card-grid">' + list.sort(byTitle).map(KK.cardHTML).join("") + "</ul>";

    main.innerHTML =
      '<header class="page-head"><h1>' + esc(KK.t("enc.title")) + "</h1>" +
      '<div class="ornament" role="presentation"></div></header>' +
      '<div class="filters">' +
      '<div class="filter-row" role="group" aria-labelledby="f-cat"><span id="f-cat" class="filter-label">' + esc(KK.t("enc.filterCat")) + "</span>" +
      ["all"].concat(KK.categories).map(catChip).join("") + "</div>" +
      '<div class="filter-row" role="group" aria-labelledby="f-rel"><span id="f-rel" class="filter-label">' + esc(KK.t("enc.filterRel")) + "</span>" +
      ["all"].concat(REL).map(relChip).join("") + "</div></div>" +
      '<p class="result-count" role="status">' + esc(KK.t("enc.showing", { n: list.length })) + "</p>" + body;

    const sync = () => {
      const p = new URLSearchParams();
      if (st.cat !== "all") p.set("cat", st.cat);
      if (st.rel !== "all") p.set("rel", st.rel);
      try { history.replaceState(null, "", "encyclopedia.html" + (p.toString() ? "?" + p : "")); } catch (e) { /* file:// */ }
    };
    main.querySelectorAll("[data-cat]").forEach(b => b.addEventListener("click", () => {
      st.cat = b.dataset.cat; sync(); KK.pages.encyclopedia(main);
      main.querySelector('[data-cat="' + st.cat + '"]').focus();
    }));
    main.querySelectorAll("[data-rel]").forEach(b => b.addEventListener("click", () => {
      st.rel = b.dataset.rel; sync(); KK.pages.encyclopedia(main);
      main.querySelector('[data-rel="' + st.rel + '"]').focus();
    }));
  };

  /* -------------------------------- article -------------------------------- */
  function infoboxHTML(it) {
    const img = KK.imageOf(it);
    const ctx = { self: it.id, linked: new Set() };
    return '<aside class="infobox" aria-label="' + esc(KK.t("article.infobox")) + '">' +
      '<div class="infobox-title">' + esc(KK.tx(it.title)) + "</div>" +
      '<figure class="infobox-figure"><img src="' + esc(img.src) + '" alt="' + esc(img.alt) + '" width="240" height="300">' +
      (img.caption ? "<figcaption>" + esc(img.caption) + "</figcaption>" : "") + "</figure>" +
      "<table><tbody>" +
      '<tr><th scope="row">' + esc(KK.t("article.category")) + "</th><td>" + esc(KK.catLabel(it._cat, true)) + "</td></tr>" +
      (it.infobox || []).map(r => '<tr><th scope="row">' + esc(KK.tx(r.label)) + "</th><td>" + KK.autolink(r.value, ctx) +
        (r.reliability ? " " + KK.relBadge(r.reliability, r.source, true) : "") + "</td></tr>").join("") +
      "</tbody></table></aside>";
  }

  function relatedHTML(it) {
    const catOf = o => (o._cat === "archive" ? KK.t("cat.archive") : KK.catLabel(o._cat, true));
    const link = o => KK.isUnlocked(o)
      ? '<a href="' + KK.urlFor(o) + '">' + esc(KK.tx(o.title)) + '</a> <span class="rel-cat">' + esc(catOf(o)) + "</span>"
      : '<span class="missing-link" title="' + esc(KK.t("locked.link")) + '">' + esc(KK.tx(o.title)) + '</span> <span class="rel-cat">' + esc(KK.t("cat1.missing")) + "</span>";

    const explicit = (it.related || []).map(id => KK.byId[id]).filter(o => o && o.id !== it.id);
    const exIds = new Set(explicit.map(o => o.id));
    const mine = new Set(it.tags || []);
    const shared = KK.articles
      .filter(o => o.id !== it.id && !exIds.has(o.id) && KK.isUnlocked(o))
      .map(o => ({ o, tags: (o.tags || []).filter(t => mine.has(t)) }))
      .filter(x => x.tags.length)
      .sort((a, b) => b.tags.length - a.tags.length || KK.tx(a.o.title).localeCompare(KK.tx(b.o.title), KK.lang))
      .slice(0, 6);
    const back = KK.backlinks(it.id).map(id => KK.byId[id]).filter(Boolean)
      .sort((a, b) => (a._cat === "archive") - (b._cat === "archive") || KK.tx(a.title).localeCompare(KK.tx(b.title), KK.lang));

    const group = (title, items) => items.length
      ? '<div class="related-group"><h3>' + esc(title) + "</h3><ul>" + items.join("") + "</ul></div>" : "";
    const html =
      group(KK.t("article.seeAlso"), explicit.map(o => "<li>" + link(o) + "</li>")) +
      group(KK.t("article.sharedTags"), shared.map(x => "<li>" + link(x.o) + ' <span class="rel-tags">' + x.tags.map(t => "#" + esc(KK.tagName(t))).join(" ") + "</span></li>")) +
      group(KK.t("article.whatLinksHere"), back.map(o => "<li>" + link(o) + "</li>"));
    if (!html) return "";
    return '<section class="related" id="related" aria-labelledby="related-h"><h2 id="related-h">' + esc(KK.t("article.related")) + "</h2>" +
      '<div class="related-grid">' + html + "</div></section>";
  }

  function legendHTML() {
    return '<aside class="rel-legend" aria-labelledby="legend-h"><h2 id="legend-h">' + esc(KK.t("rel.legend")) + "</h2><ul>" +
      REL.map(r => '<li><span class="rel rel-' + r + ' is-static"><span class="rel-icon" aria-hidden="true">' + ICONS[r] + '</span><span class="rel-name">' +
        esc(KK.t("rel." + r)) + "</span></span> " + esc(KK.t("rel." + r + ".desc")) + "</li>").join("") + "</ul></aside>";
  }

  KK.pages.article = function (main) {
    const site = KK.t("site.title");
    const it = KK.byId[U.param("id") || ""];
    if (!it || it._cat === "archive") {
      document.title = KK.t("article.notFoundTitle") + " — " + site;
      main.innerHTML = '<div class="page-narrow"><h1>' + esc(KK.t("article.notFoundTitle")) + "</h1><p>" + esc(KK.t("article.notFound")) +
        '</p><p><a href="encyclopedia.html">← ' + esc(KK.t("article.back")) + "</a></p></div>";
      return;
    }
    const cat = KK.catLabel(it._cat);
    const crumbs = '<nav class="breadcrumb" aria-label="' + esc(KK.t("article.breadcrumb")) + '"><a href="encyclopedia.html">' + esc(KK.t("nav.encyclopedia")) +
      '</a> <span aria-hidden="true">›</span> <a href="encyclopedia.html?cat=' + it._cat + '">' + esc(cat) + "</a></nav>";

    if (!KK.isUnlocked(it)) {
      document.title = KK.t("locked.title") + " — " + site;
      main.innerHTML = '<div class="page-narrow">' + crumbs + '<h1 class="visually-hidden">' + esc(KK.t("locked.title")) + "</h1>" +
        KK.lockedHTML(KK.tx(it.title), it) + '<p class="back-link"><a href="encyclopedia.html">← ' + esc(KK.t("article.back")) + "</a></p></div>";
      return;
    }

    const title = KK.tx(it.title);
    document.title = title + " — " + site;
    const ctx = { self: it.id, linked: new Set() };
    const aliases = KK.aliasesOf(it);
    const secs = (it.sections || []).map((s, i) => Object.assign({ id: "s" + (i + 1) }, s)).filter(s => s.heading);
    const related = relatedHTML(it);
    const toc = secs.length
      ? '<nav class="toc" aria-labelledby="toc-h"><h2 id="toc-h" class="toc-h">' + esc(KK.t("article.contents")) + "</h2><ol>" +
        secs.map(s => '<li><a href="#sec-' + esc(s.id) + '">' + esc(KK.tx(s.heading)) + "</a></li>").join("") +
        (related ? '<li><a href="#related">' + esc(KK.t("article.related")) + "</a></li>" : "") + "</ol></nav>" : "";
    const tags = (it.tags || []).length
      ? '<p class="tag-list"><span class="tag-label">' + esc(KK.t("article.tags")) + ":</span> " +
        it.tags.map(t => '<a class="tag" href="search.html?q=' + encodeURIComponent(KK.tagName(t)) + '">#' + esc(KK.tagName(t)) + "</a>").join(" ") + "</p>" : "";

    main.innerHTML =
      '<article class="wiki-article">' + crumbs +
      '<header class="article-head"><h1>' + esc(title) + "</h1>" +
      (aliases.length ? '<p class="aka"><span>' + esc(KK.t("article.aka")) + ":</span> " + aliases.map(a => "<em>" + esc(a) + "</em>").join(", ") + "</p>" : "") +
      "</header>" + infoboxHTML(it) +
      '<div class="article-lead drop-cap">' + blocksHTML(it.lead, ctx) + "</div>" + toc +
      secs.map(s => '<section class="article-section" id="sec-' + esc(s.id) + '" aria-labelledby="h-' + esc(s.id) + '"><h2 id="h-' + esc(s.id) + '">' +
        esc(KK.tx(s.heading)) + "</h2>" + blocksHTML(s.blocks, ctx) + "</section>").join("") +
      '<div class="article-foot">' + related + tags + legendHTML() + "</div></article>";
  };
})();
