# Könyörtelen köd – kampány-wiki

Statikus, wiki-stílusú weboldal a *Könyörtelen köd* (*The Merciless Mist*) D&D kampányhoz.
Tiszta HTML + CSS + vanilla JavaScript: nincs backend, nincs build lépés, nincs framework.
Statikus tárhelyen és helyben, dupla kattintással megnyitva (`file://`) is működik.

## Tartalomjegyzék

1. [Mappák](#1-mappák)
2. [Alapszabályok szerkesztéshez](#2-alapszabályok-szerkesztéshez)
3. [Zárolás: mindig látható, pipa vagy kód](#3-zárolás-mindig-látható-pipa-vagy-kód)
4. [Közös építőelemek: bekezdés, infobox-sor, kép](#4-közös-építőelemek-bekezdés-infobox-sor-kép)
5. [Enciklopédia: NPC, Monster, Faction, Location, Item/Document](#5-enciklopédia)
6. [Archívum: fejezet, hiányzó lap, levél](#6-archívum)
7. [Kezdőlap](#7-kezdőlap)
8. [Térkép](#8-térkép)
9. [Címkék fordítása](#9-címkék-fordítása)
10. [Beállítások (KK.config)](#10-beállítások-kkconfig)
11. [Kódok és jelszavak](#11-kódok-és-jelszavak)
12. [A két panel: Mesélő és Kód](#12-a-két-panel-mesélő-és-kód)
13. [Automatikus hivatkozások](#13-automatikus-hivatkozások)
14. [Képek](#14-képek)
15. [Feltöltés a tárhelyre](#15-feltöltés-a-tárhelyre)
16. [Billentyűzet, akadálymentesség](#16-billentyűzet-akadálymentesség)

---

## 1. Mappák

```
konyortelen-kod/
├── index.html          kezdőlap
├── archive.html        Archívum (fejezetek, levelek, hiányzó lapok)
├── encyclopedia.html   Enciklopédia (szűrőkkel)
├── article.html        egy cikk:  article.html?id=valami-id
├── map.html            térkép
├── search.html         keresési találatok:  search.html?q=kod
├── css/                stílusok
├── js/                 a „motor” – ehhez általában nem kell nyúlni
├── source/             MINDEN TARTALOM – csak ezt kell szerkesztened
│   ├── ui-strings.js   beállítások, felületi feliratok, címkék
│   ├── archive.js      kezdőlap szövegei + Archívum
│   ├── npcs.js         NPC-k
│   ├── monsters.js     szörnyek
│   ├── factions.js     frakciók
│   ├── locations.js    helyszínek
│   ├── documents.js    tárgyak és iratok
│   └── map-data.js     térkép: kép, útvonal, pontok
└── img/                képek
```

A jelszavak a `jelszavak.txt` fájlban vannak, **a `konyortelen-kod` mappán kívül**, hogy véletlenül se töltsd fel.

## 2. Alapszabályok szerkesztéshez

* A `source/` fájlok JavaScript-fájlok. Minden tartalom egy lista (`[ ... ]`) eleme, és az elemeket
  **vessző** választja el: `[ {…}, {…}, {…} ]`. Az utolsó elem utáni vessző nem baj.
* Szöveg idézőjelek között: `"szöveg"`. Ha a szövegben is idézőjel van, használd a `„ ”` vagy `“ ”` jeleket,
  vagy tegyél elé visszaperjelet: `\"`. Az aposztróf (`'`) gond nélkül használható.
* **Egy- vagy kétnyelvű szöveg.** Minden szövegmező kétféle lehet:
  * egy sima szöveg, amely mindkét nyelven ugyanaz: `title: "Brother Mordekaiser"`.
    Neveknél (NPC, monster, item, helyszín) így maradnak angolul a magyar oldalon is.
  * kétnyelvű objektum: `title: { en: "The Last Bastion", hu: "Az Utolsó Bástya" }`.
    Ha a `hu` hiányzik, az angol jelenik meg.
* **`id`**: egyedi azonosító, csak kisbetű, szám és kötőjel, ékezet és szóköz nélkül (pl. `old-mill`).
  Ezzel hivatkozol a tartalomra más helyekről (`related`, `featured`, térkép), és ez kerül a címbe is
  (`article.html?id=old-mill`). Két tartalomnak nem lehet ugyanaz az id-ja.
* Szerkesztés után a böngészőben **Ctrl+F5**-tel frissíts, különben a régi fájlt láthatod.
* Ha az oldal üres lesz vagy valami eltűnik, nyomj **F12**-t: a **Console** fül megmutatja,
  melyik fájl melyik sorában van a hiba (általában egy hiányzó vessző vagy zárójel).

## 3. Zárolás: mindig látható, pipa vagy kód

Minden tartalomnál (enciklopédia-cikk, fejezet, levél, hiányzó lap) háromféle láthatóság lehetséges:

| mező | jelentés |
|---|---|
| *(egyik sincs)* | **Mindig látható.** |
| `unlock: "chapter-2"` | **Pipához kötött.** Csak akkor látszik, ha a „Chapter 2” fel van oldva: a mesélői panelen bepipálták, vagy a bal oldali kódpanelen beírták a Chapter 2 kódját. Lehetséges értékek: `"chapter-1"`, `"chapter-2"`, `"chapter-3"`, `"chapter-4"`, `"ending"`. |
| `code: "…hash…"` | **Saját kóddal nyílik**, függetlenül a fejezetektől. A zárolt lapon megjelenik egy kódmező, és a bal oldali kódpanel is elfogadja a kódot. Leveleknél kinyitás után egy **Hide / Elrejtés** gomb újra lezárja. A hash elkészítése: [11. pont](#11-kódok-és-jelszavak). |

Egy tartalomnál az `unlock` és a `code` közül csak az egyiket használd. Ha mindkettő meg van adva, a `code` számít.

Zárolt tartalom kinézete: megégett, szakadt szélű lap és „Ez a lap hiányzik…” felirat (kódosnál „le van
pecsételve” és kódmező). A tartalma be sem kerül az oldalba. A szövegben a rá mutató név pontozott aláhúzással
jelenik meg, és nem kattintható. A keresőben csak a címe található meg. A térképen a zárolt helyszín ködbe borul.

## 4. Közös építőelemek: bekezdés, infobox-sor, kép

Ezeket több tartalomtípus is használja, ezért itt egyszer elmagyarázom.

### Bekezdés (blokk) megbízhatósági címkével

Az enciklopédia-cikkek minden bekezdése egy ilyen objektum (a `lead` és a `sections[].blocks` listákban):

```js
{
  text: { en: "He never sleeps.", hu: "Sosem alszik." },   // a bekezdés szövege (kötelező)
  reliability: "rumor",                                     // megbízhatóság (lásd lent)
  source: { en: "Wagon drivers", hu: "Kocsisok" }           // forrás, ez látszik a tooltipben
}
```

| `reliability` | címke | jelentés |
|---|---|---|
| `"verified"` | Igazolt (zöld pecsét) | megerősített információ |
| `"rumor"` | Szóbeszéd (sárga) | hallomás, nincs megerősítve |
| `"contradictory"` | Ellentmondásos (vörös) | a források ellentmondanak; a változatokat a `variants` sorolja fel |
| `"unknown"` | Ismeretlen (szürke „?”) | senki sem tudja biztosan; ilyenkor a `source` elhagyható |

Ha a `reliability` hiányzik, „Ismeretlen” lesz. Ellentmondásos állításnál a változatokat így adod meg:

```js
{
  text: { en: "Nobody agrees what happened to the cargo.", hu: "Senki sem tudja, mi lett a rakománnyal." },
  reliability: "contradictory",
  source: { en: "Two witnesses", hu: "Két szemtanú" },
  variants: [                                               // tetszőleges számú változat
    { text: { en: "A dwarf stole it.", hu: "Egy törpe ellopta." }, source: "Unknown driver" },
    { text: { en: "It was never loaded.", hu: "Fel sem rakták." }, source: "Brother Mordekaiser" }
  ]
}
```

### Infobox-sor

A cikk jobb oldali adatdobozának egy sora:

```js
{ label: { en: "Race", hu: "Faj" }, value: "Dwarf" }                     // egyszerű sor
{ label: { en: "Age", hu: "Kor" }, value: "60?", reliability: "rumor", source: "Old Hedda" }  // címkével
```

`label` = a sor neve, `value` = az értéke. A `reliability` és a `source` opcionális, ugyanúgy működik, mint a bekezdésnél.

### Kép

```js
image: "img/npcs/mordekaiser.jpg"                       // egyszerű forma
image: {                                                // bővebb forma
  src: "img/npcs/mordekaiser.jpg",                      // a kép útvonala
  alt: { en: "Brother Mordekaiser in his robe", hu: "Mordekaiser testvér csuhában" },  // leírás képernyőolvasóknak
  caption: { en: "Sketch by a pilgrim", hu: "Egy zarándok rajza" }                     // képaláírás (opcionális)
}
```

Ha az `image` hiányzik, a kategória helyőrző képe jelenik meg.

## 5. Enciklopédia

Az öt kategória **ugyanazt a felépítést** használja, csak más fájlba kerül:

| kategória | fájl | lista neve |
|---|---|---|
| NPCs | `source/npcs.js` | `KK.npcs` |
| Monsters | `source/monsters.js` | `KK.monsters` |
| Factions | `source/factions.js` | `KK.factions` |
| Locations | `source/locations.js` | `KK.locations` |
| Items & Documents | `source/documents.js` | `KK.documents` |

### Mezők

| mező | kötelező? | jelentés |
|---|---|---|
| `id` | igen | egyedi azonosító (lásd 2. pont) |
| `title` | igen | a cikk címe / a név |
| `aliases` | nem | más nevek, amelyeket a kereső megtalál, és amelyekből automatikus link lesz. Lehet közös lista (`["Morde"]`) vagy nyelvenként: `{ en: ["the monk"], hu: ["a szerzetes"] }` |
| `tags` | nem | címkék listája (pl. `["caravan", "human"]`); a közös címkéjű cikkek a „Kapcsolódó oldalak” blokkban megjelennek. Fordításuk: [9. pont](#9-címkék-fordítása) |
| `unlock` / `code` | nem | zárolás (lásd 3. pont) |
| `image` | nem | kép (lásd 4. pont) |
| `infobox` | nem | infobox-sorok listája (lásd 4. pont) |
| `lead` | nem | a bevezető bekezdések listája (blokkok, lásd 4. pont). Az első bekezdés lesz a kártyákon látható rövid leírás is |
| `sections` | nem | szakaszok listája: `{ id, heading, blocks }`. A `heading` a szakasz címe, a `blocks` a bekezdései; az `id` egyedi a cikken belül (a tartalomjegyzék erre ugrik) |
| `related` | nem | más cikkek id-jai, a „Lásd még” részbe kerülnek |

### Példa: NPC (`source/npcs.js`)

```js
KK.npcs = [
  {
    id: "brother-mordekaiser",
    title: "Brother Mordekaiser",
    aliases: { en: ["Mordekaiser", "the monk"], hu: ["Mordekaiser", "Mordekaiser testvér"] },
    tags: ["human", "order"],
    image: "img/npcs/mordekaiser.jpg",
    infobox: [
      { label: { en: "Role", hu: "Szerep" }, value: { en: "Monk", hu: "Szerzetes" } },
      { label: { en: "Status", hu: "Állapot" }, value: { en: "Dead?", hu: "Halott?" }, reliability: "rumor", source: "Monk's Death Announcement" }
    ],
    lead: [
      {
        text: { en: "A monk who sent the caravan towards The Last Bastion.", hu: "Szerzetes, aki Az Utolsó Bástya felé küldte a karavánt." },
        reliability: "verified",
        source: "Monk's Death Announcement"
      }
    ],
    sections: [
      {
        id: "fate",
        heading: { en: "Fate", hu: "Sorsa" },
        blocks: [
          { text: { en: "Nobody has seen him since the mist arrived.", hu: "Mióta a köd megjött, senki sem látta." }, reliability: "unknown" }
        ]
      }
    ],
    related: ["the-last-bastion"]
  }
];
```

### Példa: Monster (`source/monsters.js`) – pipához kötve

```js
KK.monsters = [
  {
    id: "mist-hound",
    unlock: "chapter-1",                       // csak a Chapter 1 feloldása után látszik
    title: "Mist Hound",
    tags: ["mist", "beast"],
    image: "img/monsters/mist-hound.png",
    infobox: [
      { label: { en: "Type", hu: "Típus" }, value: "Beast" },
      { label: { en: "Challenge", hu: "Nehézség" }, value: "CR 2", reliability: "verified", source: "Fought by the party" }
    ],
    lead: [
      { text: { en: "A grey hound that hunts in the mist.", hu: "Szürke kopó, amely a ködben vadászik." }, reliability: "verified", source: "Fought by the party" }
    ],
    sections: [
      {
        id: "tactics",
        heading: { en: "Tactics", hu: "Taktika" },
        blocks: [
          { text: { en: "They hunt in packs of three.", hu: "Hármas falkában vadásznak." }, reliability: "rumor", source: "Hunters" }
        ]
      }
    ],
    related: []
  }
];
```

### Példa: Faction (`source/factions.js`)

```js
KK.factions = [
  {
    id: "keepers-of-the-bastion",
    title: { en: "Keepers of the Bastion", hu: "A Bástya Őrzői" },
    tags: ["order"],
    image: "img/ui/crest.svg",
    infobox: [
      { label: { en: "Type", hu: "Típus" }, value: { en: "Military order", hu: "Katonai rend" } },
      { label: { en: "Seat", hu: "Székhely" }, value: "The Last Bastion" }
    ],
    lead: [
      { text: { en: "They guard The Last Bastion.", hu: "Az Utolsó Bástyát őrzik." }, reliability: "rumor", source: "Brother Mordekaiser" }
    ],
    sections: [],
    related: ["the-last-bastion"]
  }
];
```

### Példa: Location (`source/locations.js`) – térképponttal

```js
KK.locations = [
  {
    id: "the-last-bastion",
    unlock: "ending",                          // a térképen is ködben marad, amíg zárolt
    title: "The Last Bastion",
    aliases: { en: [], hu: ["Az Utolsó Bástya"] },
    tags: ["mountains"],
    image: "img/locations/bastion.jpg",
    infobox: [
      { label: { en: "Terrain", hu: "Terep" }, value: { en: "Mountain fortress", hu: "Hegyi erőd" } }
    ],
    lead: [
      { text: { en: "The destination of the caravan.", hu: "A karaván úti célja." }, reliability: "verified", source: "Monk's Death Announcement" }
    ],
    sections: [],
    related: ["keepers-of-the-bastion"]
  }
];
```

Ahhoz, hogy a helyszín a térképen is megjelenjen, vegyél fel egy pontot a `source/map-data.js`-be
ugyanezzel az id-val (lásd [8. pont](#8-térkép)).

### Példa: Item / Document (`source/documents.js`) – kóddal

```js
KK.documents = [
  {
    id: "muddy-bill-of-lading",
    code: "…a kód hash-e…",                    // saját kóddal nyílik (lásd 11. pont)
    title: { en: "The Muddy Bill of Lading", hu: "A sáros szállítólevél" },
    tags: ["document", "caravan"],
    image: "img/ui/scroll.svg",
    infobox: [
      { label: { en: "Type", hu: "Típus" }, value: { en: "Trade document", hu: "Kereskedelmi irat" } }
    ],
    lead: [
      { text: { en: "Lists the cargo of a lost wagon.", hu: "Egy elveszett szekér rakományát sorolja fel." }, reliability: "verified", source: "Found by the party" }
    ],
    sections: [],
    related: []
  }
];
```

## 6. Archívum

Fájl: `source/archive.js`, lista: `KK.archive`. Az Archívumban **háromféle** elem lehet; a fajtát a `kind` mező adja meg:

| `kind` | hol jelenik meg | mire való | szokásos zárolás |
|---|---|---|---|
| `"chapter"` | „Fejezetek”, sorszám szerint, tartalomjegyzékkel | a kampány története fejezetenként; díszes iniciálé, keltezés | `unlock: "chapter-N"` |
| `"letter"` | „Levelek” | levél aláírással, viaszpecsét-díszítéssel; kinyitva „Hide” gombbal újra lezárható | `code` |
| `"missing"` | „Hiányzó lapok” | kósza, töredékes lapok, megtalálási hellyel | `unlock` vagy `code` |

Bármelyik fajta lehet mindig látható (sem `unlock`, sem `code`), pipához kötött (`unlock`) vagy kódos (`code`).

### Mezők

| mező | melyik fajtánál | jelentés |
|---|---|---|
| `id` | mind | egyedi azonosító |
| `kind` | mind | `"chapter"`, `"letter"` vagy `"missing"` |
| `title` | mind | cím |
| `body` | mind | bekezdések listája; minden elem egy bekezdés (`"szöveg"` vagy `{ en, hu }`). Itt nincs megbízhatósági címke |
| `unlock` / `code` | mind | zárolás (lásd 3. pont) |
| `number` | `chapter` | a fejezet sorszáma (1, 2, 3…); ez szerint rendeződik, római számmal jelenik meg |
| `date` | `chapter` | opcionális keltezés a cím alatt (pl. „1. nap”) |
| `signature` | `letter` | opcionális aláírás a levél alján, jobbra igazítva |
| `found` | `missing` | opcionális: hol találták a lapot |
| `tags` | mind | opcionális címkék |

### Példa: fejezet (`kind: "chapter"`)

```js
{
  id: "ch-1",
  kind: "chapter",
  number: 1,
  unlock: "chapter-1",
  title: { en: "The Mist Arrives", hu: "Megérkezik a köd" },
  date: { en: "Day 1", hu: "1. nap" },
  body: [
    { en: "First paragraph…", hu: "Első bekezdés…" },
    { en: "Second paragraph…", hu: "Második bekezdés…" }
  ]
},
```

### Példa: levél (`kind: "letter"`)

```js
{
  id: "letter-3",
  kind: "letter",
  code: "…a kód hash-e…",
  title: { en: "A Note Under the Door", hu: "Üzenet az ajtó alatt" },
  body: [
    { en: "Do not trust the dwarf.", hu: "Ne bízzatok a törpében." }
  ],
  signature: { en: "— A friend", hu: "— Egy barát" }
},
```

### Példa: hiányzó lap (`kind: "missing"`)

```js
{
  id: "mp-1",
  kind: "missing",
  unlock: "chapter-2",
  title: { en: "A Torn Ledger Page", hu: "Egy kitépett főkönyvi lap" },
  found: { en: "Under the lantern wagon", hu: "A lámpásos szekér alatt" },
  body: [
    { en: "…twelve wagons, thirteen names…", hu: "…tizenkét szekér, tizenhárom név…" }
  ]
},
```

## 7. Kezdőlap

Fájl: `source/archive.js`, `KK.home`. Ami üres, az nem jelenik meg.

```js
KK.home = {
  intro: [                                    // bevezető bekezdések (díszes iniciálé az elsőn)
    { en: "Twelve wagons. One road.", hu: "Tizenkét szekér. Egy út." },
    { en: "Second paragraph…", hu: "Második bekezdés…" }
  ],
  routeIntro: { en: "The road runs east…", hu: "Az út kelet felé fut…" }  // „Az út” szakasz szövege
};
```

* **Az út:** a kezdőlap felsorolja a térkép pontjait menetirányban (a zárolt helyek „Ismeretlen” néven).
  Ez a szakasz akkor jelenik meg, ha van térképpont vagy `routeIntro`.
* **Legutóbbi fejezet:** automatikus, a legnagyobb sorszámú feloldott fejezet.
* **Kiemelt cikkek:** `source/ui-strings.js` → `KK.config.featured`, pl. `featured: ["brother-mordekaiser", "the-last-bastion"]`.

## 8. Térkép

Fájl: `source/map-data.js`.

```js
KK.mapData = {
  image: "img/map/my-map.jpg",               // a térképkép
  width: 2000,                               // a kép VALÓDI szélessége pixelben
  height: 1400,                              // a kép VALÓDI magassága pixelben
  alt: { en: "Map of the valleys", hu: "A völgyek térképe" },
  route: [                                   // a karaván útja [x, y] pontokban, menetirányban
    [120, 900], [400, 760], [800, 640], [1600, 300]
  ],
  points: [                                  // kattintható helyek, menetirányban
    { id: "first-village",    x: 120,  y: 900, terrain: { en: "River town", hu: "Folyóparti város" } },
    { id: "the-last-bastion", x: 1600, y: 300, terrain: { en: "Mountains",  hu: "Hegység" } }
  ]
};
```

* `x`, `y`: a pont helye a kép pixeleiben (bal felső sarok = 0, 0). Kiolvasás: nyisd meg a képet egy
  képszerkesztőben (Paint, GIMP), és vidd az egeret a helyre; a koordináták a sarokban látszanak.
* `id`: egy `locations.js`-beli helyszín id-ja. A pontra kattintva az a cikk nyílik meg.
* Ha a helyszín zárolt, a pont „?”-ként, ködben látszik. Feloldás után eloszlik felőle a köd.
* Az útvonal a legutolsó felfedezett pontig erős, utána halvány szaggatott vonal.
* `terrain`: a terep neve; a kezdőlap és a térkép alatti lista használja.

## 9. Címkék fordítása

A `tags` mezőben kulcsokat adsz meg (pl. `"caravan"`). Ha a magyar oldalon másképp akarod látni,
írd be a fordítást a `source/ui-strings.js` → `KK.tags` részbe:

```js
KK.tags = {
  caravan: { en: "caravan", hu: "karaván" },
  mist:    { en: "mist",    hu: "köd" }
};
```

Fordítás nélkül a címke a kulcsával jelenik meg. A kereső a kulcsra és a fordításra is talál.

## 10. Beállítások (KK.config)

Fájl: `source/ui-strings.js`.

| kulcs | jelentés |
|---|---|
| `defaultLanguage` | `"en"` vagy `"hu"`: az alapnyelv az első látogatáskor (utána a látogató választása marad meg) |
| `stages` | a mesélői panel pipái: `{ id, label, code }`. Az `id`-ra hivatkozik a tartalmak `unlock` mezője, a `label` a pipa felirata, a `code` a kódjának hash-e (ha törlöd, a pipa kód nélkül is bepipálható) |
| `defaultUnlocked` | pipák, amelyek új látogatónál alapból be vannak pipálva, pl. `["chapter-1"]`. Alapból üres |
| `lockedInSearch` | `"title"`: a zárolt lap címe megtalálható a keresőben, a szövege nem; `"none"`: egyáltalán nem |
| `showKeeperPanel` | `false`: a mesélői panel rejtve van, amíg egyszer meg nem nyitod az oldalt `?keeper=1`-gyel (kikapcsolás: `?keeper=0`) |
| `featured` | a kezdőlapon kiemelt cikkek id-jai |

A felület minden felirata (gombok, menük, üzenetek) a `KK.i18n` részben van, angolul (`en`) és magyarul (`hu`).
A kategóriák neve (NPCs, Monsters, Factions, Locations, Items & Documents) a magyar oldalon is angol;
ha mégis magyart szeretnél, itt írhatod át. A lap szélén lévő díszítő köd erőssége a `css/base.css` `--mist` értéke (0–1).

## 11. Kódok és jelszavak

A forrásfájlokba **nem a kód kerül, hanem a SHA-256 hash-e** (egy 64 karakteres szöveg), így a kód nem olvasható ki belőlük.

**Új kód hash-ének elkészítése:**
1. Nyisd meg az oldalt a böngészőben, és nyomd meg az **F12**-t.
2. Válaszd a **Console** fület, és írd be: `KK.hashCode("3day")`, majd nyomj Entert.
3. A kapott hosszú szöveget másold a `code` mezőbe (a `stages` listában vagy egy tartalomnál).
4. Írd be a kódot sima szövegként a `jelszavak.txt`-be, hogy meglegyen.

A kódnál nem számít a kis- és nagybetű, sem a szóközök az elején és a végén (`3DAY` = `3day`).
Ugyanaz a kód több dolgot is nyithat: ha egy fejezetnek és egy levélnek ugyanaz a kódja, mindkettő kinyílik.

**Biztonság:** a feloldott szövegek benne vannak a forrásfájlokban, és egy rövid kód (pl. 111)
végigpróbálgatással kitalálható. Az átlagos játékost ez megállítja, egy technikás játékost nem.
Igazán titkos szöveget csak akkor tölts fel, amikor már felfedhető.

## 12. A két panel: Mesélő és Kód

* **Kódpanel (bal szél, „Code / Kód” fül):** bárki beírhat ide egy kódot. Jó kódra megmondja, mi nyílt ki
  („Feloldva: Chapter 1”, illetve „Kinyílt: …”), és felsorolja, mi vált láthatóvá, linkkel és helyével
  együtt (pl. „Archívum › Fejezetek”, „Enciklopédia › NPCs”, helyszínnél „· Térkép”).
  Hibás kódra „Hibás kód.” a válasz.
* **Mesélői panel (jobb szél, „Keeper / Mesélő” fül):** egy „Feloldva” mappa a pipákkal
  (Chapter 1–4, Ending). Üres pipára kattintva kódot kér, és csak jó kódra pipálódik be. A pipa kivételéhez nem kell kód.
* A két panel ugyanazt az állapotot kezeli. Az állapot a böngésző `localStorage`-ében tárolódik,
  **böngészőnként külön**: amit te feloldasz, azt a játékosok nem látják. Ők a kódokkal oldják fel maguknak,
  vagy írd be a pipát a `defaultUnlocked` listába, és töltsd fel újra a `source/ui-strings.js`-t.

## 13. Automatikus hivatkozások

A szövegben előforduló cikkcímek és `aliases` nevek maguktól linkké válnak. Egy cikken belül csak az első
előfordulás lesz link, a cikk saját magára nem mutat, zárolt cikkre pedig „hiányzó lap” stílusban jelenik meg.

* A szó eleji kis- vagy nagybetű nem számít.
* Magyarul a toldalékos alakok is működnek (*Ravenfordban*, *Mordekaiserrel*).
* Ha egy alak mégsem linkelődik (tőváltozás, pl. *levél → levelet*), add hozzá a tövet aliasként (`"level"`).
* Túl általános aliast (pl. „Rend”) ne adj meg, mert minden „rendben” szóból link lenne.
* A cikk alján a „Kapcsolódó oldalak” blokk három forrásból áll: `related` („Lásd még”),
  közös címkék, és a „Mi hivatkozik ide” (azok az oldalak, amelyek szövegében szerepel a cikk neve).

## 14. Képek

* Tedd a képet a megfelelő mappába: `img/npcs/`, `img/monsters/`, `img/locations/`, egyéb (frakció, irat): `img/ui/`.
* Hivatkozás a tartalomban: `image: "img/npcs/mordekaiser.jpg"` (bővebb forma: [4. pont](#4-közös-építőelemek-bekezdés-infobox-sor-kép)).
* Ajánlott arány: 4:5 (pl. 480×600 px). Fotóhoz JPG/WebP, rajzhoz PNG/SVG.
* Kép nélkül helyőrző jelenik meg (frakció: `img/ui/crest.svg`, irat: `img/ui/scroll.svg`).
* A fájlnévben ne legyen szóköz vagy ékezet (`old-mill.jpg`, nem `Öreg malom.jpg`).

## 15. Feltöltés a tárhelyre

1. Másold fel a teljes `konyortelen-kod` mappát változatlan szerkezettel (FTP-vel, a tárhely fájlkezelőjével,
   vagy GitHub Pages / Netlify / Cloudflare Pages esetén húzd be a mappát). A `jelszavak.txt`-t **ne** töltsd fel.
2. Nyisd meg: `https://a-te-oldalad.hu/konyortelen-kod/`. Nem kell adatbázis, PHP vagy szerverbeállítás.
3. A betűtípusok a Google Fontsról töltődnek be (Cinzel, Cinzel Decorative, Cormorant Garamond;
   mind támogatja az ő/ű betűket). Internet nélkül Georgia betűvel jelenik meg az oldal.

Helyi kipróbálás: dupla kattintás az `index.html`-re, vagy a mappában `python -m http.server`,
majd a `http://localhost:8000` cím.

## 16. Billentyűzet, akadálymentesség

* `/`: ugrás a keresőbe. A nyilakkal választhatsz, Enterrel megnyitod, Esc-kel bezárod.
* Térkép: nyilak a mozgatáshoz, `+` és `−` a nagyításhoz, `0` a visszaállításhoz.
* A panelek Esc-re bezárulnak.
* `prefers-reduced-motion` beállítás mellett a köd nem animálódik.
