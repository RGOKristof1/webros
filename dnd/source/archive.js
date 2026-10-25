/* ==========================================================================
   Home page texts + Archive (chapters and missing pages).
   Format and examples: README.md
   ========================================================================== */
window.KK = window.KK || {};

KK.home = {
  intro: [],        // paragraphs: { en: "...", hu: "..." }
  routeIntro: null  // { en: "...", hu: "..." }
};

KK.archive = [
  /* --- Letters: opened with a code, not by a chapter checkbox ---
     code = SHA-256 hash of the code (the plain codes are in ../jelszavak.txt).
     New hash: open the site, press F12 → Console, type  KK.hashCode("yourcode")  */
  {
    id: "letter-1",
    kind: "letter",
    title: { en: "Monk's Death Announcement", hu: "A Monk halálhíre" },
    code: "f6e0a1e2ac41945a9aa7ff8a8aaa0cebc12a3bcc981a929ad5cf810a090e11ae",
    body: [
      {
        en: "It's coming, it's coming... It is arriving, I can already see it: the black mist is settling over our little settlement. Whoever sees this, take hold of your wagon and set out for The Last Bastion.",
        hu: "Jön, jön... Érkezik, már látom is, a fekete köd leszáll a kis településünkre. Aki ezt látja, fogja meg a szekerét, és induljon el Az Utolsó Bástyáig."
      }
    ],
    signature: { en: "— Brother Mordekaiser", hu: "— Mordekaiser testvér" }
  },
  {
    id: "letter-2",
    kind: "letter",
    title: { en: "Lost Path", hu: "Elvesztett út" },
    code: "b33fa2ccaaa7611de4200f1ba843a7cdc6c1d4a76cafe4ff0283315e89530fd9",
    body: [
      {
        en: "I really can't believe this... This goddamn path was here three days ago. My wagon won't go any further, and I have no food left. The cargo... some dwarf fellow stole it. I don't understand what's happening here myself. SAVE ME!",
        hu: "Én ezt tényleg nem hiszem el... Ez a kurva út három napja még itt volt. A szekerem nem megy tovább, élelmem sincs már. A rakományt... valami törpe fickó ellopta. Magam sem értem, mi történik itt. MENTSETEK KI!"
      }
    ],
    signature: { en: "— Unknown", hu: "— Ismeretlen" }
  }
];
