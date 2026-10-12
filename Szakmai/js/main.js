(function () {
  "use strict";
  var SITE = window.SITE, LANGS = ["en", "hu"], KEY = "lang", PLACEHOLDER = "img/dishes/placeholder.svg";
  var R = SITE.info.reservation;
  var lang = "en";
  var $ = function (id) { return document.getElementById(id); };

  /* ---------- helpers ---------- */
  function get(obj, path) { return path.split(".").reduce(function (o, k) { return o == null ? o : o[k]; }, obj); }
  function el(tag, cls, text) { var n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; }
  function store(v) { try { if (v) localStorage.setItem(KEY, v); else return localStorage.getItem(KEY); } catch (e) {} }
  function money(n) { return n.toLocaleString(lang === "hu" ? "hu-HU" : "en-GB") + " " + SITE.info.currency; }
  function iso(d) { return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); }
  function addDays(n) { var d = new Date(); d.setDate(d.getDate() + n); return d; }
  function fromIso(s) { var p = s.split("-"); return new Date(+p[0], +p[1] - 1, +p[2]); }
  function longDate(s) {
    return fromIso(s).toLocaleDateString(lang === "hu" ? "hu-HU" : "en-GB", { weekday: "long", day: "numeric", month: "long" });
  }
  function guestsText(n) { var u = SITE[lang].reservation.guestsUnit; return n + " " + (n === 1 ? u[0] : u[1]); }

  /* ---------- static texts ---------- */
  function renderStatic() {
    var t = SITE[lang], info = SITE.info;
    document.documentElement.lang = lang;
    document.title = t.meta.title;
    document.querySelector('meta[name="description"]').setAttribute("content", t.meta.description);

    document.querySelectorAll("[data-i18n]").forEach(function (n) { var v = get(t, n.dataset.i18n); if (v != null) n.textContent = v; });
    document.querySelectorAll("[data-i18n-attr]").forEach(function (n) {
      n.dataset.i18nAttr.split(";").forEach(function (pair) { var p = pair.split(":"), v = get(t, p[1]); if (v != null) n.setAttribute(p[0], v); });
    });
    document.querySelectorAll("[data-info]").forEach(function (n) { n.textContent = info[n.dataset.info]; });
    document.querySelectorAll("[data-info-link]").forEach(function (n) {
      var k = n.dataset.infoLink; n.textContent = info[k];
      n.href = k === "phone" ? "tel:" + info.phone.replace(/[^+\d]/g, "") : "mailto:" + info.email;
    });
    document.querySelectorAll("[data-map]").forEach(function (n) { n.href = info.mapUrl; n.target = "_blank"; n.rel = "noopener"; });

    var at = $("about-text"); at.textContent = "";
    t.about.text.forEach(function (p) { at.appendChild(el("p", null, p)); });
    var av = $("about-values"); av.textContent = "";
    t.about.values.forEach(function (v) { var li = el("li", "value"); li.appendChild(el("h3", null, v.title)); li.appendChild(el("p", null, v.text)); av.appendChild(li); });

    var hours = $("hours"); hours.textContent = "";
    t.contact.hours.forEach(function (h) { var row = el("div", "hours-row"); row.appendChild(el("dt", null, h.days)); row.appendChild(el("dd", null, h.time)); hours.appendChild(row); });

    var soc = $("social"); soc.textContent = "";
    info.social.forEach(function (s) { var li = el("li"), a = el("a", null, s.label); a.href = s.url; a.target = "_blank"; a.rel = "noopener"; li.appendChild(a); soc.appendChild(li); });
    $("year").textContent = new Date().getFullYear();

    document.querySelectorAll(".lang-switch button").forEach(function (b) { b.setAttribute("aria-pressed", String(b.dataset.lang === lang)); });
    document.querySelector(".lang-switch").setAttribute("aria-label", t.langLabel);
  }

  /* ---------- menu + dish popup ---------- */
  function renderMenu() {
    var root = $("menu-list"); root.textContent = "";
    SITE.menu.forEach(function (cat, ci) {
      var art = el("article", "menu-category");
      art.appendChild(el("h3", null, cat.category[lang]));
      var ul = el("ul", "menu-items");
      cat.dishes.forEach(function (d, di) {
        var li = el("li"), b = el("button", "menu-item");
        b.type = "button"; b.dataset.cat = ci; b.dataset.dish = di;
        var thumb = el("img", "menu-thumb"); thumb.alt = ""; thumb.loading = "lazy"; setImg(thumb, d.image);
        var txt = el("span", "menu-item-text");
        var head = el("span", "menu-item-head");
        head.appendChild(el("span", "menu-item-name", d.name[lang]));
        head.appendChild(el("span", "menu-item-price", money(d.price)));
        txt.appendChild(head);
        txt.appendChild(el("span", "menu-item-desc", d.description[lang]));
        b.appendChild(thumb); b.appendChild(txt); li.appendChild(b); ul.appendChild(li);
      });
      art.appendChild(ul); root.appendChild(art);
    });
  }
  function setImg(img, src) {
    img.onerror = function () { img.onerror = null; img.src = PLACEHOLDER; };
    img.src = src || PLACEHOLDER;
  }

  var dlg = $("dish-dialog"), openDish = null;
  function fillDish() {
    if (!openDish) return;
    var d = openDish, t = SITE[lang];
    setImg($("dish-photo"), d.image); $("dish-photo").alt = d.name[lang];
    $("dish-title").textContent = d.name[lang];
    $("dish-price").textContent = money(d.price);
    $("dish-desc").textContent = d.description[lang];
    $("dish-kcal").textContent = d.kcal;
    $("dish-close").setAttribute("aria-label", t.dish.close);

    var kc = { protein: d.protein * 4, carbs: d.carbs * 4, fat: d.fat * 9 };
    var total = kc.protein + kc.carbs + kc.fat || 1;
    var bar = $("macro-bar"), list = $("macro-list"); bar.textContent = ""; list.textContent = "";
    ["protein", "carbs", "fat"].forEach(function (k) {
      var pct = Math.round(kc[k] / total * 100);
      var seg = el("span", "seg seg-" + k); seg.style.width = pct + "%"; bar.appendChild(seg);
      var li = el("li"); li.appendChild(el("span", "dot dot-" + k));
      li.appendChild(el("span", "macro-name", t.dish[k]));
      li.appendChild(el("strong", null, d[k] + " g"));
      li.appendChild(el("small", null, pct + "%"));
      list.appendChild(li);
    });

    var al = $("dish-allergens"); al.textContent = "";
    if (!d.allergens.length) al.appendChild(el("li", "allergen-none", t.dish.noAllergens));
    d.allergens.forEach(function (a) { al.appendChild(el("li", "allergen", t.allergens[a] || a)); });
  }
  $("menu-list").addEventListener("click", function (e) {
    var b = e.target.closest(".menu-item"); if (!b) return;
    openDish = SITE.menu[b.dataset.cat].dishes[b.dataset.dish];
    fillDish();
    if (dlg.showModal) dlg.showModal(); else dlg.setAttribute("open", "");
  });
  $("dish-close").addEventListener("click", function () { dlg.close(); });
  dlg.addEventListener("click", function (e) { if (e.target === dlg) dlg.close(); }); // click on backdrop
  dlg.addEventListener("close", function () { openDish = null; });

  /* ---------- reservation panel ---------- */
  var guests = R.defaultGuests;

  function setGuests(n) {
    guests = Math.max(R.minGuests, Math.min(R.maxGuests, n));
    $("guests").value = guests; $("guests-out").textContent = guestsText(guests);
    $("guests-minus").disabled = guests <= R.minGuests; $("guests-plus").disabled = guests >= R.maxGuests;
    updateSummary();
  }

  function chip(name, value, label, checked) {
    var l = el("label", "chip"), i = el("input"); i.type = "radio"; i.name = name; i.value = value; i.checked = !!checked;
    l.appendChild(i); l.appendChild(el("span", null, label)); return l;
  }

  function renderDateQuick() {
    var t = SITE[lang].reservation, box = $("date-quick"), cur = $("r-date").value; box.textContent = "";
    [[0, t.today], [1, t.tomorrow]].forEach(function (p) {
      var v = iso(addDays(p[0])); box.appendChild(chip("dateq", v, p[1], cur === v));
    });
  }

  function renderSlots() {
    var t = SITE[lang].reservation, box = $("time-slots"), prev = (document.querySelector('input[name="time"]:checked') || {}).value;
    box.textContent = "";
    var today = iso(new Date()), isToday = $("r-date").value === today, now = new Date();
    var nowMin = now.getHours() * 60 + now.getMinutes(), any = false;
    R.slots.forEach(function (g) {
      var wrap = el("div", "slot-group"); wrap.appendChild(el("p", "slot-group-name", t.slotGroups[g.group] || g.group));
      var chips = el("div", "chips");
      g.times.forEach(function (tm) {
        var m = tm.split(":"); if (isToday && +m[0] * 60 + +m[1] <= nowMin + 30) return;
        any = true; chips.appendChild(chip("time", tm, tm, prev === tm));
      });
      if (chips.children.length) { wrap.appendChild(chips); box.appendChild(wrap); }
    });
    if (!any) box.appendChild(el("p", "slot-empty", t.noSlotsToday));
    var first = box.querySelector("input"); if (first) first.required = true;   // one required radio is enough for the group
  }

  function renderSeating() {
    var t = SITE[lang].reservation, box = $("seating"), prev = (document.querySelector('input[name="seating"]:checked') || {}).value || R.seating[0];
    box.textContent = "";
    R.seating.forEach(function (id) {
      var l = el("label", "card"), i = el("input"); i.type = "radio"; i.name = "seating"; i.value = id; i.checked = id === prev;
      l.appendChild(i); var s = el("span"); s.appendChild(el("strong", null, t.seating[id].name)); s.appendChild(el("small", null, t.seating[id].text));
      l.appendChild(s); box.appendChild(l);
    });
  }

  function renderOccasions() {
    var t = SITE[lang].reservation, sel = $("r-occasion"), prev = sel.value || R.occasions[0]; sel.textContent = "";
    R.occasions.forEach(function (id) { var o = el("option", null, t.occasions[id]); o.value = id; o.selected = id === prev; sel.appendChild(o); });
  }

  function checked(name) { var c = document.querySelector('input[name="' + name + '"]:checked'); return c ? c.value : ""; }
  function summaryData() {
    var t = SITE[lang].reservation, date = $("r-date").value, time = checked("time"), occ = $("r-occasion").value;
    return [
      [t.labels.guests, guestsText(guests)],
      [t.labels.date, date ? longDate(date) : ""],
      [t.labels.time, time],
      [t.labels.seating, checked("seating") ? t.seating[checked("seating")].name : ""],
      [t.labels.occasion, occ && occ !== R.occasions[0] ? t.occasions[occ] : ""]
    ];
  }
  function updateSummary() {
    var dl = $("summary"); if (!dl) return; dl.textContent = "";
    var rows = summaryData().filter(function (r) { return r[1]; });
    var t = SITE[lang].reservation;
    rows.forEach(function (r) { var d = el("div"); d.appendChild(el("dt", null, r[0])); d.appendChild(el("dd", null, r[1])); dl.appendChild(d); });
    if (!$("r-date").value || !checked("time")) { var h = el("p", "summary-hint", t.summaryEmpty); dl.appendChild(h); }
  }

  function renderReservation() {
    renderDateQuick(); renderSlots(); renderSeating(); renderOccasions(); setGuests(guests);
  }

  var form = $("reservation-form");
  $("guests-minus").addEventListener("click", function () { setGuests(guests - 1); });
  $("guests-plus").addEventListener("click", function () { setGuests(guests + 1); });
  $("r-date").min = iso(new Date()); $("r-date").max = iso(addDays(R.daysAhead));
  $("r-date").addEventListener("change", function () { renderDateQuick(); renderSlots(); updateSummary(); });
  form.addEventListener("change", function (e) {
    if (e.target.name === "dateq") { $("r-date").value = e.target.value; renderSlots(); }
    if (e.target.id === "r-date") return;
    updateSummary();
  });
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var t = SITE[lang].reservation, lines = [];
    summaryData().forEach(function (r) { if (r[1]) lines.push(r[0] + ": " + r[1]); });
    ["name", "email", "phone", "message"].forEach(function (k) { var v = form.elements[k].value; if (v) lines.push(t.fields[k] + ": " + v); });
    location.href = "mailto:" + SITE.info.reservationEmail + "?subject=" + encodeURIComponent(t.emailSubject) + "&body=" + encodeURIComponent(lines.join("\n"));
  });

  /* ---------- language ---------- */
  function render() { renderStatic(); renderMenu(); renderReservation(); fillDish(); }
  function setLang(l) { lang = l; store(l); render(); }
  document.querySelectorAll(".lang-switch button").forEach(function (b) { b.addEventListener("click", function () { setLang(b.dataset.lang); }); });

  var saved = store();
  lang = LANGS.indexOf(saved) > -1 ? saved : "en";      // English on first visit
  render();
})();
