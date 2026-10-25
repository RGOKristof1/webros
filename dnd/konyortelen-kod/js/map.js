/* ==========================================================================
   Map page: image + SVG overlay (route, clickable places, fog of the
   undiscovered), with mouse / touch / keyboard pan & zoom.
   ========================================================================== */
(function () {
  const KK = window.KK, U = KK.util, esc = U.esc;
  let view = null; // { x, y, s } – kept across re-renders (language / unlock changes)

  // Smooth curve through the route points (Catmull-Rom → cubic Bézier).
  function smoothPath(pts) {
    if (pts.length < 2) return "";
    let d = "M" + pts[0][0] + " " + pts[0][1];
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
      const c1x = p1[0] + (p2[0] - p0[0]) / 6, c1y = p1[1] + (p2[1] - p0[1]) / 6;
      const c2x = p2[0] - (p3[0] - p1[0]) / 6, c2y = p2[1] - (p3[1] - p1[1]) / 6;
      d += " C" + c1x.toFixed(1) + " " + c1y.toFixed(1) + " " + c2x.toFixed(1) + " " + c2y.toFixed(1) + " " + p2[0] + " " + p2[1];
    }
    return d;
  }

  function overlaySVG(md, pts) {
    const W = md.width, H = md.height;
    // route is "known" up to the waypoint closest to the furthest discovered place
    let lastKnown = -1;
    pts.forEach((p, i) => { if (p.known) lastKnown = i; });
    let split = 0;
    if (lastKnown >= 0) {
      const kp = pts[lastKnown];
      let best = Infinity;
      md.route.forEach((r, i) => { const d = (r[0] - kp.x) ** 2 + (r[1] - kp.y) ** 2; if (d < best) { best = d; split = i; } });
    }
    const knownRoute = md.route.slice(0, split + 1), hiddenRoute = md.route.slice(split);

    const markers = pts.map(p => {
      const style = ' style="--x:' + p.x + "px;--y:" + p.y + 'px"';
      if (p.known) {
        const title = KK.tx(p.it.title);
        return '<a class="marker marker-known" href="' + KK.urlFor(p.it) + '" aria-label="' + esc(title + " – " + KK.tx(p.terrain)) + '"' + style + ">" +
          '<circle class="marker-halo" r="17"/><circle class="marker-dot" r="9"/>' +
          '<text class="marker-num" y="3.8">' + (p.i + 1) + "</text>" +
          '<text class="marker-label" y="-19">' + esc(title) + "</text></a>";
      }
      return '<g class="marker marker-unknown"' + style + '><title>' + esc(KK.t("map.unknown")) + "</title>" +
        '<circle class="marker-dot" r="9"/><text class="marker-num" y="4">?</text></g>';
    }).join("");

    return '<svg class="map-overlay" viewBox="0 0 ' + W + " " + H + '" width="' + W + '" height="' + H + '" role="group" aria-label="' + esc(KK.t("map.title")) + '">' +
      "<defs>" +
      '<filter id="fog-noise" x="0" y="0" width="100%" height="100%">' +
      '<feTurbulence type="fractalNoise" baseFrequency="0.006 0.011" numOctaves="4" seed="7"/>' +
      '<feColorMatrix type="matrix" values="0 0 0 0 0.13  0 0 0 0 0.12  0 0 0 0 0.14  0 0 0 2.2 -0.55"/></filter>' +
      '<radialGradient id="fog-hole"><stop offset="0" stop-color="#000"/><stop offset=".55" stop-color="#000"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>' +
      '<mask id="fog-mask" maskUnits="userSpaceOnUse" x="0" y="0" width="' + W + '" height="' + H + '">' +
      '<rect width="' + W + '" height="' + H + '" fill="#fff"/>' +
      pts.filter(p => p.known).map(p => '<circle cx="' + p.x + '" cy="' + p.y + '" r="140" fill="url(#fog-hole)"/>').join("") +
      "</mask></defs>" +
      (hiddenRoute.length > 1 ? '<path class="route route-hidden" d="' + smoothPath(hiddenRoute) + '"/>' : "") +
      '<g class="fog" mask="url(#fog-mask)"><rect width="' + W + '" height="' + H + '" fill="rgba(34,30,36,.5)"/>' +
      '<rect class="fog-noise" width="' + W + '" height="' + H + '" filter="url(#fog-noise)"/></g>' +
      (knownRoute.length > 1 ? '<path class="route route-known" d="' + smoothPath(knownRoute) + '"/>' : "") +
      markers + "</svg>";
  }

  KK.pages.map = function (main) {
    const md = KK.mapData;
    document.title = KK.t("map.title") + " — " + KK.t("site.title");
    const W = md.width, H = md.height;
    const pts = md.points.map((p, i) => {
      const it = KK.byId[p.id];
      return Object.assign({}, p, { it, i, known: !!it && KK.isUnlocked(it) });
    });

    main.innerHTML =
      '<header class="page-head"><h1>' + esc(KK.t("map.title")) + '</h1><p class="page-intro">' + esc(KK.t("map.intro")) + "</p></header>" +
      '<div class="map-wrap">' +
      '<div class="map-toolbar">' +
      '<button type="button" class="map-btn" data-zoom="in" aria-label="' + esc(KK.t("map.zoomIn")) + '" title="' + esc(KK.t("map.zoomIn")) + '">+</button>' +
      '<button type="button" class="map-btn" data-zoom="out" aria-label="' + esc(KK.t("map.zoomOut")) + '" title="' + esc(KK.t("map.zoomOut")) + '">−</button>' +
      '<button type="button" class="map-btn" data-zoom="reset" aria-label="' + esc(KK.t("map.reset")) + '" title="' + esc(KK.t("map.reset")) + '">⟲</button></div>' +
      '<div class="map-viewport" tabindex="0" aria-label="' + esc(KK.t("map.viewport")) + '">' +
      '<div class="map-stage" style="width:' + W + "px;height:" + H + 'px">' +
      '<img src="' + esc(md.image) + '" alt="' + esc(KK.tx(md.alt)) + '" width="' + W + '" height="' + H + '" draggable="false">' +
      overlaySVG(md, pts) + "</div></div>" +
      '<ul class="map-legend">' +
      '<li><span class="lg lg-route" aria-hidden="true"></span>' + esc(KK.t("map.legendRoute")) + "</li>" +
      '<li><span class="lg lg-known" aria-hidden="true"></span>' + esc(KK.t("map.legendKnown")) + "</li>" +
      '<li><span class="lg lg-fog" aria-hidden="true"></span>' + esc(KK.t("map.legendFog")) + "</li></ul></div>" +
      (pts.length ?
        '<section class="map-places" aria-labelledby="places-h"><h2 id="places-h">' + esc(KK.t("map.places")) + "</h2>" +
        '<ol class="route-list">' + pts.map((p, i) => KK.stopHTML(p, i, pts.length)).join("") + "</ol></section>" : "");

    setup(main, W, H);
  };

  function setup(main, W, H) {
    const vp = main.querySelector(".map-viewport"), stage = main.querySelector(".map-stage");
    const MAX = 4;
    let minS = 0.2;
    const rect = () => vp.getBoundingClientRect();
    const fitScale = () => { const r = rect(); return Math.min(r.width / W, r.height / H); };
    // narrow screens: fill the viewport (pan sideways); wide screens: show the whole map
    function fit() {
      const r = rect();
      const s = r.width < 640 ? Math.min(MAX, Math.max(r.width / W, r.height / H)) : fitScale();
      return { s, x: (r.width - W * s) / 2, y: (r.height - H * s) / 2 };
    }

    function clamp() {
      const r = rect();
      minS = fitScale() * 0.85;
      view.s = Math.min(MAX, Math.max(minS, view.s));
      const w = W * view.s, h = H * view.s, pad = 60;
      view.x = w <= r.width ? (r.width - w) / 2 : Math.min(pad, Math.max(r.width - w - pad, view.x));
      view.y = h <= r.height ? (r.height - h) / 2 : Math.min(pad, Math.max(r.height - h - pad, view.y));
    }
    function apply() {
      clamp();
      stage.style.transform = "translate(" + view.x + "px," + view.y + "px) scale(" + view.s + ")";
      stage.style.setProperty("--inv", (1 / view.s).toFixed(4));
    }
    function zoomAt(factor, cx, cy) {
      const ns = Math.min(MAX, Math.max(minS, view.s * factor));
      const k = ns / view.s;
      view.x = cx - (cx - view.x) * k;
      view.y = cy - (cy - view.y) * k;
      view.s = ns;
      apply();
    }
    const zoomCenter = f => { const r = rect(); zoomAt(f, r.width / 2, r.height / 2); };

    if (!view) view = fit();
    apply();

    main.querySelectorAll("[data-zoom]").forEach(b => b.addEventListener("click", () => {
      if (b.dataset.zoom === "in") zoomCenter(1.35);
      else if (b.dataset.zoom === "out") zoomCenter(1 / 1.35);
      else { view = fit(); apply(); }
    }));

    vp.addEventListener("wheel", e => {
      e.preventDefault();
      const r = rect();
      zoomAt(Math.exp(-e.deltaY * 0.0015), e.clientX - r.left, e.clientY - r.top);
    }, { passive: false });

    // pointer pan + pinch zoom
    const ptrs = new Map();
    let start = null, dragged = false, pinch = null;
    const pinchInfo = () => {
      const [a, b] = Array.from(ptrs.values());
      return { d: Math.hypot(a.x - b.x, a.y - b.y) || 1, cx: (a.x + b.x) / 2, cy: (a.y + b.y) / 2 };
    };
    vp.addEventListener("pointerdown", e => {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      ptrs.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (ptrs.size === 1) dragged = false;
      start = { x: e.clientX, y: e.clientY, vx: view.x, vy: view.y };
      if (ptrs.size === 2) pinch = pinchInfo();
    });
    vp.addEventListener("pointermove", e => {
      if (!ptrs.has(e.pointerId)) return;
      ptrs.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (ptrs.size === 2 && pinch) {
        const cur = pinchInfo(), r = rect();
        if (!dragged) { dragged = true; try { vp.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ } }
        zoomAt(cur.d / pinch.d, cur.cx - r.left, cur.cy - r.top);
        view.x += cur.cx - pinch.cx;
        view.y += cur.cy - pinch.cy;
        apply();
        pinch = cur;
        return;
      }
      const dx = e.clientX - start.x, dy = e.clientY - start.y;
      if (!dragged && Math.hypot(dx, dy) > 5) {
        dragged = true;
        // capture only once it is a real drag, so plain clicks still reach the markers
        try { vp.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ }
        vp.classList.add("dragging");
      }
      if (dragged) { view.x = start.vx + dx; view.y = start.vy + dy; apply(); }
    });
    const end = e => {
      ptrs.delete(e.pointerId);
      if (ptrs.size < 2) pinch = null;
      if (ptrs.size === 1) { const p = Array.from(ptrs.values())[0]; start = { x: p.x, y: p.y, vx: view.x, vy: view.y }; }
      if (!ptrs.size) vp.classList.remove("dragging");
    };
    vp.addEventListener("pointerup", end);
    vp.addEventListener("pointercancel", end);
    vp.addEventListener("click", e => { if (dragged) { e.preventDefault(); e.stopPropagation(); dragged = false; } }, true);

    vp.addEventListener("keydown", e => {
      const step = 60;
      let handled = true;
      if (e.key === "ArrowLeft") view.x += step;
      else if (e.key === "ArrowRight") view.x -= step;
      else if (e.key === "ArrowUp") view.y += step;
      else if (e.key === "ArrowDown") view.y -= step;
      else if (e.key === "+" || e.key === "=") { zoomCenter(1.25); return e.preventDefault(); }
      else if (e.key === "-" || e.key === "_") { zoomCenter(0.8); return e.preventDefault(); }
      else if (e.key === "0") view = fit();
      else handled = false;
      if (handled) { e.preventDefault(); apply(); }
    });

    window.addEventListener("resize", U.debounce(() => { if (document.body.contains(stage)) apply(); }, 100));
  }
})();
