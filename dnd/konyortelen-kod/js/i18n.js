/* ==========================================================================
   Core helpers (storage, events, utils) + language handling.
   Loaded right after the source/ files and before every other js/ file.
   ========================================================================== */
(function () {
  const KK = window.KK = window.KK || {};
  KK.pages = KK.pages || {};

  // --- localStorage wrapper: never throws (private mode, blocked storage, file://) ---
  KK.store = {
    get(key, fallback) {
      try {
        const v = localStorage.getItem("kk:" + key);
        return v === null ? fallback : JSON.parse(v);
      } catch (e) { return fallback; }
    },
    set(key, value) {
      try { localStorage.setItem("kk:" + key, JSON.stringify(value)); } catch (e) { /* ignore */ }
    },
    remove(key) {
      try { localStorage.removeItem("kk:" + key); } catch (e) { /* ignore */ }
    }
  };

  // --- tiny event bus: "langchange", "statechange" ---
  const handlers = {};
  KK.on = (ev, fn) => { (handlers[ev] = handlers[ev] || []).push(fn); };
  KK.emit = (ev, data) => { (handlers[ev] || []).forEach(fn => fn(data)); };

  // --- utilities ---
  const ESC = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
  KK.util = {
    esc: s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ESC[c]),
    // accent-insensitive, lower-case form used by search and autolink lookups
    norm: s => String(s == null ? "" : s).normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase(),
    param: name => new URLSearchParams(location.search).get(name),
    debounce(fn, ms) {
      let t;
      return function () { clearTimeout(t); const a = arguments; t = setTimeout(() => fn.apply(null, a), ms); };
    }
  };

  // --- language ---
  const LANGS = ["en", "hu"];
  KK.langs = LANGS;
  KK.lang = KK.store.get("lang", (KK.config && KK.config.defaultLanguage) || "en");
  if (!LANGS.includes(KK.lang)) KK.lang = "en";
  document.documentElement.lang = KK.lang;

  // Pick the current language from a { en, hu } object (plain strings pass through).
  KK.tx = function (v) {
    if (v == null) return "";
    if (typeof v === "string") return v;
    return v[KK.lang] != null ? v[KK.lang] : (v.en != null ? v.en : "");
  };

  // UI string from KK.i18n, with {placeholder} substitution.
  KK.t = function (key, vars) {
    const dict = KK.i18n || {};
    let s = (dict[KK.lang] && dict[KK.lang][key]);
    if (s == null) s = (dict.en && dict.en[key]);
    if (s == null) s = key;
    if (vars) s = s.replace(/\{(\w+)\}/g, (m, k) => (vars[k] != null ? vars[k] : m));
    return s;
  };

  KK.tagName = key => (KK.tags && KK.tags[key] ? KK.tx(KK.tags[key]) : key);

  // Fill elements marked with data-i18n="key" and data-i18n-attr="attr:key;attr2:key2".
  KK.applyI18n = function (root) {
    root = root || document;
    root.querySelectorAll("[data-i18n]").forEach(el => { el.textContent = KK.t(el.dataset.i18n); });
    root.querySelectorAll("[data-i18n-attr]").forEach(el => {
      el.dataset.i18nAttr.split(";").forEach(pair => {
        const i = pair.indexOf(":");
        if (i > 0) el.setAttribute(pair.slice(0, i).trim(), KK.t(pair.slice(i + 1).trim()));
      });
    });
  };

  KK.setLang = function (lang) {
    if (!LANGS.includes(lang) || lang === KK.lang) return;
    KK.lang = lang;
    KK.store.set("lang", lang);
    document.documentElement.lang = lang;
    KK.applyI18n();
    KK.emit("langchange", lang);
  };
})();
