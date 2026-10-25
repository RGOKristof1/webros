/* ==========================================================================
   Shared init: header + navbar, language switch, Keeper's panel (right side),
   mist layer, footer, and page dispatch (body[data-page]).
   ========================================================================== */
(function () {
  const KK = window.KK, U = KK.util, esc = U.esc;
  const NAV = [
    ["home", "index.html", "nav.home"],
    ["archive", "archive.html", "nav.archive"],
    ["encyclopedia", "encyclopedia.html", "nav.encyclopedia"],
    ["map", "map.html", "nav.map"]
  ];
  const WIDE = "(min-width: 1280px)";
  let page = "home";

  /* -------------------------------- header -------------------------------- */
  function headerHTML() {
    return '<a class="skip-link" href="#main" data-i18n="skip"></a>' +
      '<header class="site-header"><div class="header-inner">' +
      '<a class="brand" href="index.html"><img src="img/ui/seal-mark.svg" alt="" width="38" height="38"><span class="brand-text" data-i18n="site.title"></span></a>' +
      '<button class="nav-toggle" type="button" aria-expanded="false" aria-controls="site-nav" data-i18n-attr="aria-label:nav.menu"><span class="burger" aria-hidden="true"></span></button>' +
      '<nav id="site-nav" class="site-nav" data-i18n-attr="aria-label:nav.main"><ul>' +
      NAV.map(([key, href, label]) => '<li><a href="' + href + '"' + (key === page ? ' aria-current="page"' : "") + ' data-i18n="' + label + '"></a></li>').join("") +
      "</ul></nav>" +
      '<div class="quick-search" role="search">' +
      '<label for="qs-input" class="visually-hidden" data-i18n="search.label"></label>' +
      '<svg class="qs-icon" viewBox="0 0 20 20" width="16" height="16" aria-hidden="true" focusable="false"><circle cx="8.5" cy="8.5" r="5.5" fill="none" stroke="currentColor" stroke-width="2"/><path d="M13 13l4.5 4.5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>' +
      '<input id="qs-input" type="search" autocomplete="off" spellcheck="false" role="combobox" aria-autocomplete="list" aria-expanded="false" aria-controls="qs-list" data-i18n-attr="placeholder:search.placeholder">' +
      '<kbd class="qs-kbd" aria-hidden="true">/</kbd>' +
      '<ul id="qs-list" class="qs-list" role="listbox" hidden data-i18n-attr="aria-label:search.label"></ul></div>' +
      '<div class="lang-switch" role="group" data-i18n-attr="aria-label:lang.switch">' +
      '<button type="button" data-lang="en" lang="en">EN</button><span aria-hidden="true">/</span><button type="button" data-lang="hu" lang="hu">HU</button></div>' +
      "</div></header>";
  }
  function syncLangButtons() {
    document.querySelectorAll("[data-lang]").forEach(b => b.setAttribute("aria-pressed", String(b.dataset.lang === KK.lang)));
  }
  function wireHeader() {
    const header = document.querySelector(".site-header");
    const toggle = header.querySelector(".nav-toggle");
    toggle.addEventListener("click", () => {
      const open = header.classList.toggle("nav-open");
      toggle.setAttribute("aria-expanded", String(open));
    });
    header.querySelectorAll("[data-lang]").forEach(b => b.addEventListener("click", () => KK.setLang(b.dataset.lang)));
    syncLangButtons();
    const input = document.getElementById("qs-input");
    KK.initQuickSearch(input, document.getElementById("qs-list"));
    // "/" focuses the search box from anywhere
    document.addEventListener("keydown", e => {
      if (e.key !== "/" || e.ctrlKey || e.metaKey || e.altKey) return;
      const t = e.target;
      if (t && t.closest && t.closest("input, textarea, select, [contenteditable]")) return;
      e.preventDefault();
      input.focus();
      input.select();
    });
    document.addEventListener("keydown", e => {
      if (e.key === "Escape" && header.classList.contains("nav-open")) {
        header.classList.remove("nav-open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.focus();
      }
    });
  }

  /* ------------------------- decorative mist layer ------------------------- */
  function buildMist() {
    const m = document.createElement("div");
    m.className = "mist";
    m.setAttribute("aria-hidden", "true");
    m.innerHTML = '<div class="mist-layer mist-a"></div><div class="mist-layer mist-b"></div>';
    document.body.appendChild(m);
  }

  /* ----------------------------- Keeper's panel ----------------------------- */
  function panelEnabled() {
    if (U.param("keeper") === "1") KK.store.set("keeper", true);
    if (U.param("keeper") === "0") KK.store.remove("keeper");
    return !(KK.config && KK.config.showKeeperPanel === false) || KK.store.get("keeper", false);
  }
  // one folder with one checkbox per stage (KK.config.stages)
  function panelListsHTML() {
    const open = KK.store.get("panelFolderOpen", false);
    return '<details class="panel-group" id="stage-folder"' + (open ? " open" : "") + ">" +
      "<summary>" + esc(KK.t("panel.unlocks")) + ' <span class="panel-count" id="stage-count"></span></summary><ul>' +
      KK.stages.map(s => '<li><label><input type="checkbox" data-stage="' + esc(s.id) + '"' + (KK.isStageOpen(s.id) ? " checked" : "") + "> <span>" +
        esc(KK.tx(s.label)) + "</span></label></li>").join("") + "</ul></details>";
  }
  function showStageCodeBox(li, id) {
    document.querySelectorAll(".stage-code").forEach(f => f.remove());
    const fid = "stage-code-" + id;
    li.insertAdjacentHTML("beforeend",
      '<form class="stage-code" data-stage-form="' + esc(id) + '">' +
      '<label for="' + esc(fid) + '">' + esc(KK.t("code.label")) + "</label>" +
      '<input id="' + esc(fid) + '" type="text" autocomplete="off" autocapitalize="off" spellcheck="false">' +
      '<button type="submit" class="btn btn-small">' + esc(KK.t("code.ok")) + "</button>" +
      '<button type="button" class="btn btn-small btn-ghost stage-code-cancel" aria-label="' + esc(KK.t("code.cancel")) + '">×</button>' +
      '<p class="code-msg" role="status" aria-live="polite"></p></form>');
    li.querySelector("input[type=text]").focus();
  }
  function syncPanel() {
    const panel = document.getElementById("keeper-panel");
    if (!panel) return;
    const boxes = Array.from(panel.querySelectorAll("[data-stage]"));
    boxes.forEach(cb => { cb.checked = KK.isStageOpen(cb.dataset.stage); });
    panel.querySelector("#stage-count").textContent = boxes.filter(b => b.checked).length + "/" + boxes.length;
  }
  function renderPanelLists() {
    const lists = document.getElementById("panel-lists");
    if (!lists) return;
    lists.innerHTML = panelListsHTML();
    syncPanel();
  }
  function setPanel(open, moveFocus) {
    const panel = document.getElementById("keeper-panel");
    const tab = document.getElementById("panel-tab");
    if (open) setCodePanel(false, false);
    panel.classList.toggle("open", open);
    document.body.classList.toggle("panel-open", open);
    tab.setAttribute("aria-expanded", String(open));
    document.getElementById("panel-backdrop").hidden = !open;
    if (window.matchMedia(WIDE).matches) KK.store.set("panelOpen", open);
    if (moveFocus) (open ? panel.querySelector(".panel-close") : tab).focus();
  }
  function buildPanel() {
    const wrap = document.createElement("div");
    wrap.innerHTML =
      '<button class="panel-tab" id="panel-tab" type="button" aria-controls="keeper-panel" aria-expanded="false" data-i18n-attr="aria-label:panel.open">' +
      '<svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true" focusable="false"><path d="M7 3h6M10 1v2M6 5h8l-1 2v7l1 2H6l1-2V7z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>' +
      '<span data-i18n="panel.tab"></span></button>' +
      '<div class="panel-backdrop" id="panel-backdrop" hidden></div>' +
      '<aside id="keeper-panel" class="keeper-panel" aria-labelledby="panel-title">' +
      '<div class="panel-head"><h2 id="panel-title" data-i18n="panel.title"></h2>' +
      '<button type="button" class="panel-close" data-i18n-attr="aria-label:panel.close"><span aria-hidden="true">×</span></button></div>' +
      '<div id="panel-lists" class="panel-section"></div>' +
      "</aside>";
    while (wrap.firstChild) document.body.appendChild(wrap.firstChild);

    const panel = document.getElementById("keeper-panel");
    document.getElementById("panel-lists").innerHTML = panelListsHTML();
    document.getElementById("panel-tab").addEventListener("click", () => setPanel(!panel.classList.contains("open"), true));
    panel.querySelector(".panel-close").addEventListener("click", () => setPanel(false, true));
    document.getElementById("panel-backdrop").addEventListener("click", () => setPanel(false, false));
    panel.addEventListener("keydown", e => { if (e.key === "Escape") setPanel(false, true); });

    // ticking a box that has a code opens a code box under it; unticking needs no code
    panel.addEventListener("change", e => {
      const cb = e.target;
      const id = cb.dataset && cb.dataset.stage;
      if (!id) return;
      if (cb.checked && KK.stageNeedsCode(id)) {
        cb.checked = false;
        showStageCodeBox(cb.closest("li"), id);
        return;
      }
      KK.setStage(id, cb.checked);
    });
    panel.addEventListener("submit", e => {
      const form = e.target.closest(".stage-code");
      if (!form) return;
      e.preventDefault();
      const input = form.querySelector("input");
      if (KK.openStageWithCode(form.dataset.stageForm, input.value)) form.remove();
      else { form.querySelector(".code-msg").textContent = KK.t("code.wrong"); input.select(); }
    });
    panel.addEventListener("click", e => {
      const btn = e.target.closest(".stage-code-cancel");
      if (!btn) return;
      const li = btn.closest("li");
      btn.closest(".stage-code").remove();
      li.querySelector("[data-stage]").focus();
    });
    panel.addEventListener("toggle", e => {
      if (e.target.id === "stage-folder") KK.store.set("panelFolderOpen", e.target.open);
    }, true);

    syncPanel();
    if (window.matchMedia(WIDE).matches && KK.store.get("panelOpen", false)) setPanel(true, false);
  }

  /* --------------------------- code panel (left) --------------------------- */
  // Anyone can type a code here; it says what opened, where to find it, and what it unlocked.
  let lastRedeem = null;

  function placeOf(it) {
    if (it._cat === "archive") {
      const sub = it.kind === "chapter" ? "archive.chapters" : it.kind === "letter" ? "archive.letters" : "archive.missing";
      return KK.t("nav.archive") + " › " + KK.t(sub);
    }
    let place = KK.t("nav.encyclopedia") + " › " + KK.t("cat." + it._cat);
    if (it._cat === "locations" && KK.mapData && (KK.mapData.points || []).some(p => p.id === it.id)) place += " · " + KK.t("nav.map");
    return place;
  }
  const itemLink = it => '<a href="' + KK.urlFor(it) + '">' + esc(KK.tx(it.title)) + "</a>";

  function redeemHTML(r) {
    if (!r) return "";
    if (!r.stages.length && !r.items.length) return '<p class="code-msg">' + esc(KK.t("code.wrong")) + "</p>";
    const already = a => (a ? ' <span class="redeem-already">(' + esc(KK.t("redeem.already")) + ")</span>" : "");
    let html = "";
    r.stages.forEach(s => {
      html += '<div class="redeem-block"><p class="redeem-head">' + esc(KK.t("redeem.stage", { name: KK.tx(s.stage.label) })) + already(s.already) + "</p>";
      html += s.items.length
        ? '<p class="redeem-sub">' + esc(KK.t("redeem.contents")) + "</p><ul>" +
          s.items.map(it => "<li>" + itemLink(it) + '<span class="redeem-place">' + esc(placeOf(it)) + "</span></li>").join("") + "</ul>"
        : '<p class="redeem-sub">' + esc(KK.t("redeem.nothingYet")) + "</p>";
      html += "</div>";
    });
    if (r.items.length) {
      html += '<div class="redeem-block"><p class="redeem-head">' + esc(KK.t("redeem.opened")) + "</p><ul>" +
        r.items.map(x => "<li>" + itemLink(x.it) + already(x.already) + '<span class="redeem-place">' + esc(placeOf(x.it)) + "</span></li>").join("") + "</ul></div>";
    }
    return html;
  }

  function setCodePanel(open, moveFocus) {
    const panel = document.getElementById("code-panel");
    if (!panel) return;
    if (open) setPanelIfBuilt(false);
    const tab = document.getElementById("code-tab");
    panel.classList.toggle("open", open);
    document.body.classList.toggle("code-open", open);
    tab.setAttribute("aria-expanded", String(open));
    document.getElementById("code-backdrop").hidden = !open;
    if (moveFocus) (open ? panel.querySelector("#redeem-input") : tab).focus();
  }
  function setPanelIfBuilt(open) { if (document.getElementById("keeper-panel")) setPanel(open, false); }

  function buildCodePanel() {
    const wrap = document.createElement("div");
    wrap.innerHTML =
      '<button class="code-tab" id="code-tab" type="button" aria-controls="code-panel" aria-expanded="false" data-i18n-attr="aria-label:redeem.openPanel">' +
      '<svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true" focusable="false"><circle cx="7" cy="10" r="3.5" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M10.5 10H18M15 10v3M17.5 10v2.2" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>' +
      '<span data-i18n="redeem.tab"></span></button>' +
      '<div class="panel-backdrop" id="code-backdrop" hidden></div>' +
      '<aside id="code-panel" class="keeper-panel code-panel" aria-labelledby="code-title">' +
      '<div class="panel-head"><h2 id="code-title" data-i18n="redeem.title"></h2>' +
      '<button type="button" class="panel-close" data-i18n-attr="aria-label:panel.close"><span aria-hidden="true">×</span></button></div>' +
      '<form class="redeem-form panel-section" id="redeem-form">' +
      '<label for="redeem-input" data-i18n="code.label"></label>' +
      '<input id="redeem-input" type="text" autocomplete="off" autocapitalize="off" spellcheck="false">' +
      '<button type="submit" class="btn btn-small" data-i18n="code.submit"></button></form>' +
      '<div id="redeem-result" class="redeem-result" role="status" aria-live="polite"></div>' +
      "</aside>";
    while (wrap.firstChild) document.body.appendChild(wrap.firstChild);

    const panel = document.getElementById("code-panel");
    document.getElementById("code-tab").addEventListener("click", () => setCodePanel(!panel.classList.contains("open"), true));
    panel.querySelector(".panel-close").addEventListener("click", () => setCodePanel(false, true));
    document.getElementById("code-backdrop").addEventListener("click", () => setCodePanel(false, false));
    panel.addEventListener("keydown", e => { if (e.key === "Escape") setCodePanel(false, true); });
    panel.querySelector("#redeem-form").addEventListener("submit", e => {
      e.preventDefault();
      const input = panel.querySelector("#redeem-input");
      lastRedeem = KK.redeemCode(input.value);
      panel.querySelector("#redeem-result").innerHTML = redeemHTML(lastRedeem);
      if (lastRedeem.stages.length || lastRedeem.items.length) input.value = "";
      else input.select();
    });
  }

  /* --------------------------------- footer --------------------------------- */
  function footerHTML() {
    return '<footer class="site-footer"><div class="ornament" role="presentation"></div></footer>';
  }

  /* ------------------------------ page dispatch ------------------------------ */
  function renderPage() {
    const main = document.getElementById("main");
    const fn = KK.pages[page];
    if (main && fn) fn(main);
  }

  function init() {
    page = document.body.dataset.page || "home";
    document.getElementById("site-header").innerHTML = headerHTML();
    document.getElementById("site-footer").innerHTML = footerHTML();
    buildMist();
    buildCodePanel();
    if (panelEnabled()) buildPanel();
    KK.applyI18n();
    wireHeader();
    KK.initTooltips();
    KK.initCodeForms();
    renderPage();

    // content is rendered by JS, so jump to #hash after rendering
    if (location.hash) {
      const target = document.getElementById(decodeURIComponent(location.hash.slice(1)));
      if (target) target.scrollIntoView();
    }

    KK.on("langchange", () => {
      renderPage(); renderPanelLists(); syncLangButtons();
      const res = document.getElementById("redeem-result");
      if (res) res.innerHTML = redeemHTML(lastRedeem);
    });
    KK.on("statechange", () => { renderPage(); syncPanel(); });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
