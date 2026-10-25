/* ==========================================================================
   Content registry + lock / unlock state.
   Content with `unlock: "<stage id>"` is visible only when that stage is
   ticked in the Keeper's panel (KK.config.stages). Saved in localStorage.
   ========================================================================== */
(function () {
  const KK = window.KK;
  const cfg = KK.config || {};

  // ---- registry: every Archive entry and every article, with its category ----
  const SOURCES = [
    ["npcs", KK.npcs], ["monsters", KK.monsters], ["factions", KK.factions],
    ["locations", KK.locations], ["documents", KK.documents]
  ];
  KK.categories = SOURCES.map(s => s[0]);
  KK.items = [];
  KK.byId = {};
  (KK.archive || []).forEach(it => { it._cat = "archive"; KK.items.push(it); });
  SOURCES.forEach(([cat, list]) => (list || []).forEach(it => { it._cat = cat; KK.items.push(it); }));
  KK.items.forEach(it => {
    if (KK.byId[it.id]) console.warn("[Könyörtelen köd] Duplicate id:", it.id);
    KK.byId[it.id] = it;
  });
  KK.articles = KK.items.filter(it => it._cat !== "archive");

  KK.urlFor = it => (it._cat === "archive" ? "archive.html#" + it.id : "article.html?id=" + encodeURIComponent(it.id));

  // aliases: either one list for both languages, or { en: [...], hu: [...] }
  KK.aliasesOf = function (it) {
    const a = it.aliases;
    if (!a) return [];
    if (Array.isArray(a)) return a;
    return a[KK.lang] || [];
  };

  // ---- stages ----
  KK.stages = cfg.stages || [];
  const stageIds = new Set(KK.stages.map(s => s.id));
  KK.items.forEach(it => {
    if (it.unlock && !stageIds.has(it.unlock)) console.warn("[Könyörtelen köd] Unknown unlock stage:", it.unlock, "in", it.id);
  });
  const defaults = new Set(cfg.defaultUnlocked || []);
  let state = KK.store.get("stages", {}) || {};
  KK.stateVersion = 0;

  KK.isStageOpen = id => (Object.prototype.hasOwnProperty.call(state, id) ? !!state[id] : defaults.has(id));
  KK.setStage = function (id, value) {
    state[id] = !!value;
    KK.store.set("stages", state);
    KK.stateVersion++;
    KK.emit("statechange");
  };

  // ---- code-locked content: `code: "<sha-256 of the code>"` ----
  // Only the hash is stored in the data files, so the code itself is not readable there.
  let codes = KK.store.get("codes", {}) || {};
  KK.unlockWithCode = function (id, input) {
    const it = KK.byId[id];
    if (!it || !it.code) return false;
    if (KK.hashCode(input) !== String(it.code).toLowerCase()) return false;
    codes[id] = true;
    KK.store.set("codes", codes);
    KK.stateVersion++;
    KK.emit("statechange");
    return true;
  };

  // re-lock a code-opened item ("Hide" button)
  KK.lockCode = function (id) {
    delete codes[id];
    KK.store.set("codes", codes);
    KK.stateVersion++;
    KK.emit("statechange");
  };

  // a stage with a code can only be ticked with the right code
  KK.stageNeedsCode = id => { const s = KK.stages.find(x => x.id === id); return !!(s && s.code); };
  KK.openStageWithCode = function (id, input) {
    const s = KK.stages.find(x => x.id === id);
    if (!s) return false;
    if (s.code && KK.hashCode(input) !== String(s.code).toLowerCase()) return false;
    KK.setStage(id, true);
    return true;
  };

  // One code box for everything: opens every stage and every code-locked item whose code matches.
  // Returns { stages: [{ stage, already, items }], items: [{ it, already }] } – empty lists = wrong code.
  KK.redeemCode = function (input) {
    const hash = KK.hashCode(input);
    const result = { stages: [], items: [] };
    if (!String(input || "").trim()) return result;
    KK.stages.forEach(s => {
      if (!s.code || String(s.code).toLowerCase() !== hash) return;
      result.stages.push({ stage: s, already: KK.isStageOpen(s.id), items: KK.items.filter(it => it.unlock === s.id && !it.code) });
      state[s.id] = true;
    });
    KK.items.forEach(it => {
      if (!it.code || String(it.code).toLowerCase() !== hash) return;
      result.items.push({ it, already: !!codes[it.id] });
      codes[it.id] = true;
    });
    if (result.stages.length || result.items.length) {
      KK.store.set("stages", state);
      KK.store.set("codes", codes);
      KK.stateVersion++;
      KK.emit("statechange");
    }
    return result;
  };

  KK.isLockable = it => !!it && (!!it.unlock || !!it.code);
  KK.isUnlocked = function (idOrItem) {
    const it = typeof idOrItem === "string" ? KK.byId[idOrItem] : idOrItem;
    if (!it) return false;
    if (it.code) return !!codes[it.id];
    return !it.unlock || KK.isStageOpen(it.unlock);
  };

  // SHA-256 (hex) of a code, ignoring surrounding spaces and letter case.
  // Use it in the browser console to make the hash of a new code: KK.hashCode("111")
  KK.hashCode = function (input) {
    const bytes = new TextEncoder().encode(String(input == null ? "" : input).trim().toLowerCase());
    const K = [], H0 = [];
    const frac = x => ((x - Math.floor(x)) * 0x100000000) | 0;
    for (let n = 2, found = 0; found < 64; n++) {
      let prime = true;
      for (let d = 2; d * d <= n; d++) if (n % d === 0) { prime = false; break; }
      if (!prime) continue;
      if (found < 8) H0[found] = frac(Math.pow(n, 1 / 2));
      K[found++] = frac(Math.pow(n, 1 / 3));
    }
    const len = bytes.length;
    const buf = new Uint8Array(((len + 9 + 63) >> 6) << 6);
    buf.set(bytes);
    buf[len] = 0x80;
    const view = new DataView(buf.buffer);
    view.setUint32(buf.length - 4, (len * 8) >>> 0);
    view.setUint32(buf.length - 8, Math.floor((len * 8) / 0x100000000));
    const h = H0.slice(), w = new Int32Array(64);
    const rotr = (x, n) => (x >>> n) | (x << (32 - n));
    for (let i = 0; i < buf.length; i += 64) {
      for (let t = 0; t < 16; t++) w[t] = view.getInt32(i + t * 4);
      for (let t = 16; t < 64; t++) {
        const s0 = rotr(w[t - 15], 7) ^ rotr(w[t - 15], 18) ^ (w[t - 15] >>> 3);
        const s1 = rotr(w[t - 2], 17) ^ rotr(w[t - 2], 19) ^ (w[t - 2] >>> 10);
        w[t] = (w[t - 16] + s0 + w[t - 7] + s1) | 0;
      }
      let [a, b, c, d, e, f, g, hh] = h;
      for (let t = 0; t < 64; t++) {
        const t1 = (hh + (rotr(e, 6) ^ rotr(e, 11) ^ rotr(e, 25)) + ((e & f) ^ (~e & g)) + K[t] + w[t]) | 0;
        const t2 = ((rotr(a, 2) ^ rotr(a, 13) ^ rotr(a, 22)) + ((a & b) ^ (a & c) ^ (b & c))) | 0;
        hh = g; g = f; f = e; e = (d + t1) | 0; d = c; c = b; b = a; a = (t1 + t2) | 0;
      }
      [a, b, c, d, e, f, g, hh].forEach((v, k) => { h[k] = (h[k] + v) | 0; });
    }
    return h.map(x => (x >>> 0).toString(16).padStart(8, "0")).join("");
  };

  // how locked pages show up in search: "title" | "none"
  KK.getLockedSearch = () => (cfg.lockedInSearch === "none" ? "none" : "title");

  // keep several open tabs in sync
  window.addEventListener("storage", e => {
    if (e.key !== "kk:stages" && e.key !== "kk:codes") return;
    state = KK.store.get("stages", {}) || {};
    codes = KK.store.get("codes", {}) || {};
    KK.stateVersion++;
    KK.emit("statechange");
  });
})();
