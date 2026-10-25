/* ==========================================================================
   Map data. Coordinates are in pixels of the map image (width × height).
   - route:  the caravan's path as [x, y] points in travel order (dashed line)
   - points: { id: "<location id>", x, y, terrain: { en, hu } } – clickable places
   ========================================================================== */
window.KK = window.KK || {};

KK.mapData = {
  image: "img/map/map.svg",
  width: 1000,
  height: 700,
  alt: { en: "Map", hu: "Térkép" },
  route: [],
  points: []
};
