/* =====================================================================
   CONTENT FILE - the ONLY file you need to edit to fill in the site.
   Every text on the page comes from here, in English (en) and Hungarian (hu).
   Replace the placeholder text, keep the keys (left side) as they are.
   ===================================================================== */

window.SITE = {

  /* ---------- 1. Language-independent info ---------- */
  info: {
    name: "webros.hu",
    phone: "+36 00 000 0000",
    email: "hello@webros.hu",
    reservationEmail: "foglalas@webros.hu",   // reservations are sent here (mailto)
    mapUrl: "https://maps.google.com/?q=Budapest",
    currency: "Ft",                            // shown after every price
    reservation: {
      minGuests: 1, maxGuests: 12, defaultGuests: 2,
      daysAhead: 60,                           // how far ahead people can book
      closedWeekdays: [6],                     // days nobody can book: 0=Sunday 1=Monday ... 6=Saturday
      slots: [                                 // bookable times, per group
        { group: "lunch",  times: ["12:00", "12:30", "13:00", "13:30", "14:00"] },
        { group: "dinner", times: ["18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00"] }
      ],
      seating: ["indoor", "terrace", "bar"],   // names are translated in section 3/4
      occasions: ["none", "birthday", "anniversary", "business"]
    },
    social: [
      { label: "Facebook",  url: "https://facebook.com/" },
      { label: "Instagram", url: "https://instagram.com/" }
    ]
  },

  /* ---------- 2. MENU - one block per dish, everything in one place ----------
       image     : photo path (put files in img/dishes/). "" = placeholder
       price     : number (currency is set above)
       kcal      : calories per portion
       protein / carbs / fat : grams per portion
       allergens : any of  gluten crustaceans eggs fish peanuts soy milk nuts
                   celery mustard sesame sulphites lupin molluscs   ( [] = none )
     To add a dish copy a { ... } block; to add a category copy a whole
     { category: ..., dishes: [...] } block.                                  */
  menu: [
    { category: { en: "Starters", hu: "Előételek" }, dishes: [
      { image: "", price: 2500, kcal: 220, protein: 8, carbs: 24, fat: 10, allergens: ["gluten", "milk"],
        name: { en: "Dish name", hu: "Étel neve" },
        description: { en: "Short description, ingredients.", hu: "Rövid leírás, összetevők." } },
      { image: "", price: 2800, kcal: 180, protein: 12, carbs: 6, fat: 11, allergens: ["eggs", "fish"],
        name: { en: "Dish name", hu: "Étel neve" },
        description: { en: "Short description, ingredients.", hu: "Rövid leírás, összetevők." } }
    ]},
    { category: { en: "Main courses", hu: "Főételek" }, dishes: [
      { image: "", price: 4500, kcal: 640, protein: 38, carbs: 52, fat: 28, allergens: ["gluten", "celery"],
        name: { en: "Dish name", hu: "Étel neve" },
        description: { en: "Short description, ingredients.", hu: "Rövid leírás, összetevők." } },
      { image: "", price: 5200, kcal: 720, protein: 45, carbs: 40, fat: 37, allergens: ["milk", "mustard", "sulphites"],
        name: { en: "Dish name", hu: "Étel neve" },
        description: { en: "Short description, ingredients.", hu: "Rövid leírás, összetevők." } }
    ]},
    { category: { en: "Desserts", hu: "Desszertek" }, dishes: [
      { image: "", price: 1900, kcal: 410, protein: 6, carbs: 48, fat: 21, allergens: ["gluten", "eggs", "milk", "nuts"],
        name: { en: "Dish name", hu: "Étel neve" },
        description: { en: "Short description, ingredients.", hu: "Rövid leírás, összetevők." } },
      { image: "", price: 2100, kcal: 350, protein: 5, carbs: 44, fat: 17, allergens: [],
        name: { en: "Dish name", hu: "Étel neve" },
        description: { en: "Short description, ingredients.", hu: "Rövid leírás, összetevők." } }
    ]}
  ],

  /* ---------- 3. English texts ---------- */
  en: {
    meta: {
      title: "webros.hu - Restaurant",
      description: "Short description of the restaurant for search engines."
    },
    skip: "Skip to content",
    nav: { menu: "Menu", reservation: "Reservation", about: "About us", contact: "Contact" },
    langLabel: "Language",

    hero: {
      eyebrow: "Welcome to our restaurant",
      title: "Your restaurant slogan",
      description: "One or two sentences about what makes the place special.",
      button: "Book a table",
      imageAlt: "Photo of the restaurant"
    },

    menu: {
      title: "Menu",
      intro: "Short intro about the menu, ingredients, daily offers. Tap a dish for details.",
      details: "Details"
    },

    dish: {
      close: "Close",
      price: "Price",
      energy: "Energy",
      kcal: "kcal",
      perPortion: "per portion",
      macros: "Macronutrients",
      protein: "Protein",
      carbs: "Carbs",
      fat: "Fat",
      allergens: "Allergens",
      noAllergens: "Contains none of the 14 main allergens.",
      allergenNote: "Please tell us about any allergy when you order."
    },

    allergens: {
      gluten: "Gluten", crustaceans: "Crustaceans", eggs: "Eggs", fish: "Fish", peanuts: "Peanuts",
      soy: "Soy", milk: "Milk", nuts: "Tree nuts", celery: "Celery", mustard: "Mustard",
      sesame: "Sesame", sulphites: "Sulphites", lupin: "Lupin", molluscs: "Molluscs"
    },

    reservation: {
      title: "Reservation",
      intro: "Choose your table in a few steps. We will confirm by email or phone.",
      steps: {
        guests: "1. How many guests?",
        date: "2. Which day?",
        time: "3. What time?",
        seating: "4. Where would you like to sit?",
        occasion: "5. Special occasion?",
        contact: "6. Your details"
      },
      guestsUnit: ["guest", "guests"],         // singular, plural
      guestsMinus: "Fewer guests",
      guestsPlus: "More guests",
      today: "Today",
      tomorrow: "Tomorrow",
      otherDate: "Other date",
      calendar: "Choose a date",
      prevMonth: "Previous month",
      nextMonth: "Next month",
      unavailable: "not available",
      closedOn: "Closed on:",
      errors: { date: "Please choose a day for your visit." },
      slotGroups: { lunch: "Lunch", dinner: "Dinner" },
      noSlotsToday: "No more free times today - please choose another day.",
      seating: {
        indoor:  { name: "Indoor",   text: "Dining room" },
        terrace: { name: "Terrace",  text: "Outdoor, weather permitting" },
        bar:     { name: "Bar",      text: "Casual, at the counter" }
      },
      occasions: { none: "No special occasion", birthday: "Birthday", anniversary: "Anniversary", business: "Business meal" },
      fields: {
        name: "Your name", email: "Email", phone: "Phone",
        message: "Message (allergies, high chair...)"
      },
      summary: "Your reservation",
      summaryEmpty: "Pick a day and a time",
      submit: "Send reservation",
      emailSubject: "Table reservation",
      note: "Your table is only confirmed once we reply. Thank you!",
      labels: { guests: "Guests", date: "Date", time: "Time", seating: "Seating", occasion: "Occasion" }
    },

    about: {
      title: "About us",
      lead: "A small kitchen with a big appetite for doing things properly.",
      text: [
        "Everything here is made by hand, from the first loaf of bread to the last spoon of dessert. No shortcuts, no fuss, just honest food cooked with care.",
        "Our menu follows the seasons and the people who grow our ingredients. We keep it short on purpose, so every plate gets the attention it deserves.",
        "Come as you are and stay as long as you like. The table is yours, and we will take care of the rest."
      ],
      quote: "Good food, made by people, for people.",
      values: [
        { title: "Fresh", text: "Ingredients arrive in the morning and are on your plate by evening." },
        { title: "Local", text: "We buy from nearby growers and producers, and we know them by name." },
        { title: "Handmade", text: "Sauces, bread and desserts are made from scratch in our own kitchen." }
      ]
    },

    contact: {
      title: "Contact",
      intro: "We are happy to hear from you.",
      addressLabel: "Address",
      address: "1234 Budapest, Example street 1.",
      phoneLabel: "Phone",
      emailLabel: "Email",
      hoursLabel: "Opening hours",
      hours: [
        { days: "Monday - Friday", time: "11:00 - 22:00" },
        { days: "Saturday",        time: "Closed" },
        { days: "Sunday",          time: "12:00 - 20:00" }
      ],
      mapLink: "Open in maps"
    },

    footer: { rights: "All rights reserved.", backToTop: "Back to top" }
  },

  /* ---------- 4. Magyar szövegek ---------- */
  hu: {
    meta: {
      title: "webros.hu - Étterem",
      description: "Rövid leírás az étteremről a keresőmotorok számára."
    },
    skip: "Ugrás a tartalomhoz",
    nav: { menu: "Étlap", reservation: "Asztalfoglalás", about: "Rólunk", contact: "Kapcsolat" },
    langLabel: "Nyelv",

    hero: {
      eyebrow: "Üdvözöljük az éttermünkben",
      title: "Az étterem szlogenje",
      description: "Egy-két mondat arról, mitől különleges a hely.",
      button: "Asztalt foglalok",
      imageAlt: "Fotó az étteremről"
    },

    menu: {
      title: "Étlap",
      intro: "Rövid bevezető az étlapról, alapanyagokról, napi ajánlatról. Koppintson egy ételre a részletekért.",
      details: "Részletek"
    },

    dish: {
      close: "Bezárás",
      price: "Ár",
      energy: "Energia",
      kcal: "kcal",
      perPortion: "adagonként",
      macros: "Makrotápanyagok",
      protein: "Fehérje",
      carbs: "Szénhidrát",
      fat: "Zsír",
      allergens: "Allergének",
      noAllergens: "A 14 fő allergén egyikét sem tartalmazza.",
      allergenNote: "Kérjük, rendeléskor jelezze az allergiáját."
    },

    allergens: {
      gluten: "Glutén", crustaceans: "Rákfélék", eggs: "Tojás", fish: "Hal", peanuts: "Földimogyoró",
      soy: "Szója", milk: "Tej", nuts: "Diófélék", celery: "Zeller", mustard: "Mustár",
      sesame: "Szezám", sulphites: "Szulfitok", lupin: "Csillagfürt", molluscs: "Puhatestűek"
    },

    reservation: {
      title: "Asztalfoglalás",
      intro: "Néhány lépésben válassza ki az asztalát. E-mailben vagy telefonon visszaigazoljuk.",
      steps: {
        guests: "1. Hányan lesznek?",
        date: "2. Melyik napon?",
        time: "3. Hánykor?",
        seating: "4. Hol szeretnének ülni?",
        occasion: "5. Különleges alkalom?",
        contact: "6. Az Ön adatai"
      },
      guestsUnit: ["fő", "fő"],
      guestsMinus: "Kevesebb vendég",
      guestsPlus: "Több vendég",
      today: "Ma",
      tomorrow: "Holnap",
      otherDate: "Másik nap",
      calendar: "Válasszon dátumot",
      prevMonth: "Előző hónap",
      nextMonth: "Következő hónap",
      unavailable: "nem elérhető",
      closedOn: "Zárva:",
      errors: { date: "Kérjük, válasszon napot a látogatáshoz." },
      slotGroups: { lunch: "Ebéd", dinner: "Vacsora" },
      noSlotsToday: "Mára már nincs szabad időpont - kérjük, válasszon másik napot.",
      seating: {
        indoor:  { name: "Belső tér", text: "Étterem" },
        terrace: { name: "Terasz",    text: "Kint, időjárástól függően" },
        bar:     { name: "Bár",       text: "Kötetlen, a pultnál" }
      },
      occasions: { none: "Nincs különleges alkalom", birthday: "Születésnap", anniversary: "Évforduló", business: "Üzleti ebéd/vacsora" },
      fields: {
        name: "Név", email: "E-mail", phone: "Telefon",
        message: "Üzenet (allergia, etetőszék...)"
      },
      summary: "Az Ön foglalása",
      summaryEmpty: "Válasszon napot és időpontot",
      submit: "Foglalás elküldése",
      emailSubject: "Asztalfoglalás",
      note: "Az asztal csak a mi visszaigazolásunkkal érvényes. Köszönjük!",
      labels: { guests: "Vendégek", date: "Dátum", time: "Időpont", seating: "Ülőhely", occasion: "Alkalom" }
    },

    about: {
      title: "Rólunk",
      lead: "Kicsi konyha, nagy vággyal arra, hogy mindent rendesen csináljunk.",
      text: [
        "Nálunk minden kézzel készül, az első szelet kenyértől az utolsó kanál desszertig. Nincsenek kerülőutak, nincs felhajtás, csak őszinte étel, gondosan elkészítve.",
        "Étlapunk követi az évszakokat és azokat, akik az alapanyagot termesztik. Szándékosan rövid, hogy minden tányér megkapja a figyelmet, amit megérdemel.",
        "Jöjjön úgy, ahogy van, és maradjon, ameddig jólesik. Az asztal az öné, a többit mi intézzük."
      ],
      quote: "Jó étel, emberek keze munkája, emberek számára.",
      values: [
        { title: "Friss", text: "A hozzávalók reggel érkeznek, és estére már a tányérján vannak." },
        { title: "Helyi", text: "Közeli termelőktől vásárolunk, és név szerint ismerjük őket." },
        { title: "Kézzel készült", text: "A szószok, a kenyér és a desszertek nálunk készülnek, a nulláról." }
      ]
    },

    contact: {
      title: "Kapcsolat",
      intro: "Örömmel várjuk megkeresését.",
      addressLabel: "Cím",
      address: "1234 Budapest, Minta utca 1.",
      phoneLabel: "Telefon",
      emailLabel: "E-mail",
      hoursLabel: "Nyitvatartás",
      hours: [
        { days: "Hétfő - Péntek", time: "11:00 - 22:00" },
        { days: "Szombat",        time: "Zárva" },
        { days: "Vasárnap",       time: "12:00 - 20:00" }
      ],
      mapLink: "Megnyitás térképen"
    },

    footer: { rights: "Minden jog fenntartva.", backToTop: "Vissza az elejére" }
  }
};
