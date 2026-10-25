/* ==========================================================================
   Könyörtelen köd / The Merciless Mist
   Site settings (KK.config), UI strings (KK.i18n) and tag names (KK.tags).
   ========================================================================== */
window.KK = window.KK || {};

KK.config = {
  // "en" or "hu" – used until the visitor picks a language with the EN / HU switch.
  defaultLanguage: "en",

  // The checkboxes of the Keeper's panel. Give content an `unlock: "<id>"` field
  // and it stays hidden until that box is ticked. Content without `unlock` is always visible.
  // code = SHA-256 hash of the code needed to tick the box (plain codes: ../jelszavak.txt).
  // Leave `code` out and the box can be ticked freely. New hash: F12 → Console → KK.hashCode("123")
  stages: [
    { id: "chapter-1", label: "Chapter 1", code: "968076be2e38cf897d4d6cea3faca9c037e1a4e3b4b7744fb2533e07751bd30a" },
    { id: "chapter-2", label: "Chapter 2", code: "eaf89db7108470dc3f6b23ea90618264b3e8f8b6145371667c4055e9c5ce9f52" },
    { id: "chapter-3", label: "Chapter 3", code: "db55da3fc3098e9c42311c6013304ff36b19ef73d12ea932054b5ad51df4f49d" },
    { id: "chapter-4", label: "Chapter 4", code: "556d7dc3a115356350f1f9910b1af1ab0e312d4b3e4fc788d2da63668f36d017" },
    { id: "ending",    label: "Ending",    code: "c7e616822f366fb1b5e0756af498cc11d2c0862edcb32ca65882f622ff39de1b" }
  ],

  // Stage ids ticked by default for a new visitor (empty = nothing unlocked).
  defaultUnlocked: [],

  // How locked pages appear in search: "title" = title only, "none" = not at all.
  lockedInSearch: "title",

  // false: the Keeper's panel is hidden unless the page is opened once with ?keeper=1
  showKeeperPanel: true,

  // Article ids shown on the home page.
  featured: []
};

// Optional translations of tag keys, e.g. forest: { en: "forest", hu: "erdő" }
KK.tags = {};

KK.i18n = {
  en: {
    "site.title": "The Merciless Mist",
    "skip": "Skip to content",
    "nav.home": "Home",
    "nav.archive": "Archive",
    "nav.encyclopedia": "Encyclopedia",
    "nav.map": "Map",
    "nav.menu": "Menu",
    "nav.main": "Main navigation",
    "lang.switch": "Language",

    "search.label": "Search",
    "search.placeholder": "Search…",
    "search.all": "All results for “{q}”",
    "search.none": "No results.",
    "search.count": "{n} results",
    "search.title": "Search",
    "search.missing": "Missing page",
    "search.empty": "Type to search.",

    "cat.archive": "Archive",
    "cat.npcs": "NPCs",
    "cat.monsters": "Monsters",
    "cat.factions": "Factions",
    "cat.locations": "Locations",
    "cat.documents": "Items & Documents",
    "cat1.archive": "Archive",
    "cat1.chapter": "Chapter",
    "cat1.missing": "Missing page",
    "cat1.npcs": "NPC",
    "cat1.monsters": "Monster",
    "cat1.factions": "Faction",
    "cat1.locations": "Location",
    "cat1.documents": "Item / Document",

    "img.npcs": "Portrait of {name}",
    "img.monsters": "Illustration of {name}",
    "img.factions": "Emblem of {name}",
    "img.locations": "View of {name}",
    "img.documents": "{name}",

    "rel.verified": "Verified",
    "rel.rumor": "Rumor",
    "rel.contradictory": "Contradictory",
    "rel.unknown": "Unknown",
    "rel.source": "Source",
    "rel.noSource": "no known source",
    "rel.account": "Account {n}",
    "rel.legend": "Source reliability",
    "rel.verified.desc": "Confirmed.",
    "rel.rumor.desc": "Hearsay, not confirmed.",
    "rel.contradictory.desc": "The sources disagree.",
    "rel.unknown.desc": "Nobody knows for certain.",

    "locked.title": "This page is missing…",
    "locked.link": "This page is missing",

    "article.contents": "Contents",
    "article.related": "Related pages",
    "article.seeAlso": "See also",
    "article.sharedTags": "Shares tags",
    "article.whatLinksHere": "What links here",
    "article.tags": "Tags",
    "article.aka": "Also known as",
    "article.notFound": "This page does not exist.",
    "article.notFoundTitle": "Page not found",
    "article.back": "Back to the Encyclopedia",
    "article.category": "Category",
    "article.infobox": "Summary",
    "article.breadcrumb": "Breadcrumb",

    "enc.title": "Encyclopedia",
    "enc.filterCat": "Category",
    "enc.filterRel": "Reliability",
    "enc.all": "All",
    "enc.showing": "{n} pages",
    "enc.empty": "No pages match these filters.",
    "enc.none": "No pages yet.",

    "archive.title": "Archive",
    "archive.chapters": "Chapters",
    "archive.missing": "Missing pages",
    "archive.chapterN": "Chapter {n}",
    "archive.found": "Found",
    "archive.none": "No chapters yet.",
    "archive.letters": "Letters",
    "cat1.letter": "Letter",

    "code.sealed": "This letter is sealed.",
    "code.sealedPage": "This page is sealed.",
    "code.label": "Code",
    "code.submit": "Open",
    "code.wrong": "Wrong code.",
    "code.ok": "OK",
    "code.cancel": "Cancel",
    "code.hide": "Hide",

    "redeem.tab": "Code",
    "redeem.openPanel": "Open the code panel",
    "redeem.title": "Enter a code",
    "redeem.stage": "{name} unlocked",
    "redeem.contents": "Unlocked with it:",
    "redeem.nothingYet": "No pages belong to it yet.",
    "redeem.opened": "Opened:",
    "redeem.already": "already open",

    "home.route": "The Road",
    "home.featured": "From the Encyclopedia",
    "home.latest": "Latest chapter",
    "home.read": "Read the chapter",
    "home.openMap": "Open the map",
    "home.unknownStop": "Unknown",
    "home.start": "start",
    "home.destination": "destination",

    "panel.tab": "Keeper",
    "panel.open": "Open the Keeper's panel",
    "panel.title": "Keeper's Panel",
    "panel.close": "Close panel",
    "panel.unlocks": "Unlocked",

    "map.title": "Map",
    "map.intro": "Drag to pan, scroll or pinch to zoom.",
    "map.zoomIn": "Zoom in",
    "map.zoomOut": "Zoom out",
    "map.reset": "Reset view",
    "map.unknown": "Unknown place",
    "map.legendRoute": "Caravan route",
    "map.legendKnown": "Discovered place",
    "map.legendFog": "Hidden in the mist",
    "map.places": "Stops along the road",
    "map.viewport": "Interactive map. Drag or use the arrow keys to pan; scroll, pinch or press + and − to zoom."
  },

  hu: {
    "site.title": "Könyörtelen köd",
    "skip": "Ugrás a tartalomhoz",
    "nav.home": "Kezdőlap",
    "nav.archive": "Archívum",
    "nav.encyclopedia": "Enciklopédia",
    "nav.map": "Térkép",
    "nav.menu": "Menü",
    "nav.main": "Fő navigáció",
    "lang.switch": "Nyelv",

    "search.label": "Keresés",
    "search.placeholder": "Keresés…",
    "search.all": "Összes találat: „{q}”",
    "search.none": "Nincs találat.",
    "search.count": "{n} találat",
    "search.title": "Keresés",
    "search.missing": "Hiányzó lap",
    "search.empty": "Írj be valamit a kereséshez.",

    // D&D terms stay in English on the Hungarian site too.
    "cat.archive": "Archívum",
    "cat.npcs": "NPCs",
    "cat.monsters": "Monsters",
    "cat.factions": "Factions",
    "cat.locations": "Locations",
    "cat.documents": "Items & Documents",
    "cat1.archive": "Archívum",
    "cat1.chapter": "Fejezet",
    "cat1.missing": "Hiányzó lap",
    "cat1.npcs": "NPC",
    "cat1.monsters": "Monster",
    "cat1.factions": "Faction",
    "cat1.locations": "Location",
    "cat1.documents": "Item / Document",

    "img.npcs": "{name} portréja",
    "img.monsters": "{name} illusztrációja",
    "img.factions": "{name} címere",
    "img.locations": "Látkép: {name}",
    "img.documents": "{name}",

    "rel.verified": "Igazolt",
    "rel.rumor": "Szóbeszéd",
    "rel.contradictory": "Ellentmondásos",
    "rel.unknown": "Ismeretlen",
    "rel.source": "Forrás",
    "rel.noSource": "nincs ismert forrás",
    "rel.account": "{n}. változat",
    "rel.legend": "Forrás-megbízhatóság",
    "rel.verified.desc": "Megerősített.",
    "rel.rumor.desc": "Hallomás, nincs megerősítve.",
    "rel.contradictory.desc": "A források ellentmondanak egymásnak.",
    "rel.unknown.desc": "Senki sem tudja biztosan.",

    "locked.title": "Ez a lap hiányzik…",
    "locked.link": "Ez a lap hiányzik",

    "article.contents": "Tartalom",
    "article.related": "Kapcsolódó oldalak",
    "article.seeAlso": "Lásd még",
    "article.sharedTags": "Közös címkék",
    "article.whatLinksHere": "Mi hivatkozik ide",
    "article.tags": "Címkék",
    "article.aka": "Más néven",
    "article.notFound": "Ez a lap nem létezik.",
    "article.notFoundTitle": "A lap nem található",
    "article.back": "Vissza az Enciklopédiához",
    "article.category": "Kategória",
    "article.infobox": "Összefoglaló",
    "article.breadcrumb": "Morzsamenü",

    "enc.title": "Enciklopédia",
    "enc.filterCat": "Kategória",
    "enc.filterRel": "Megbízhatóság",
    "enc.all": "Mind",
    "enc.showing": "{n} lap",
    "enc.empty": "Egy lap sem felel meg a szűrőknek.",
    "enc.none": "Még nincsenek lapok.",

    "archive.title": "Archívum",
    "archive.chapters": "Fejezetek",
    "archive.missing": "Hiányzó lapok",
    "archive.chapterN": "{n}. fejezet",
    "archive.found": "Lelőhely",
    "archive.none": "Még nincsenek fejezetek.",
    "archive.letters": "Levelek",
    "cat1.letter": "Levél",

    "code.sealed": "Ez a levél le van pecsételve.",
    "code.sealedPage": "Ez a lap le van pecsételve.",
    "code.label": "Kód",
    "code.submit": "Kinyitás",
    "code.wrong": "Hibás kód.",
    "code.ok": "OK",
    "code.cancel": "Mégse",
    "code.hide": "Elrejtés",

    "redeem.tab": "Kód",
    "redeem.openPanel": "Kódpanel megnyitása",
    "redeem.title": "Kód beírása",
    "redeem.stage": "Feloldva: {name}",
    "redeem.contents": "Ezzel feloldódott:",
    "redeem.nothingYet": "Még nem tartozik hozzá lap.",
    "redeem.opened": "Kinyílt:",
    "redeem.already": "már nyitva volt",

    "home.route": "Az út",
    "home.featured": "Az Enciklopédiából",
    "home.latest": "Legutóbbi fejezet",
    "home.read": "Tovább a fejezethez",
    "home.openMap": "Térkép megnyitása",
    "home.unknownStop": "Ismeretlen",
    "home.start": "indulás",
    "home.destination": "úti cél",

    "panel.tab": "Mesélő",
    "panel.open": "Mesélői panel megnyitása",
    "panel.title": "Mesélői panel",
    "panel.close": "Panel bezárása",
    "panel.unlocks": "Feloldva",

    "map.title": "Térkép",
    "map.intro": "Húzással mozgathatod, görgetéssel vagy csippentéssel nagyíthatsz.",
    "map.zoomIn": "Nagyítás",
    "map.zoomOut": "Kicsinyítés",
    "map.reset": "Nézet visszaállítása",
    "map.unknown": "Ismeretlen hely",
    "map.legendRoute": "A karaván útvonala",
    "map.legendKnown": "Felfedezett hely",
    "map.legendFog": "Ködbe burkolva",
    "map.places": "Megállók az út mentén",
    "map.viewport": "Interaktív térkép. Húzással vagy a nyílbillentyűkkel mozgathatod; görgetéssel, csippentéssel vagy a + és − gombbal nagyíthatsz."
  }
};
