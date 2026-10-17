/* =====================================================================
   AZ OLDAL MŰKÖDÉSE

   Ezt a fájlt általában NEM kell szerkeszteni. Minden szöveg és adat
   a content.js-ben van – ez a fájl csak "összerakja" belőlük az oldalt.

   Tartalom (sorrendben):
     1. Beállítások és segédfüggvények
     2. Fix szövegek kiírása (fejléc, rólunk, kapcsolat, lábléc)
     3. Étlap és étel-kártya (felugró ablak)
     4. Asztalfoglalás (vendégszám, nap, időpont, ülőhely, alkalom)
     5. Összegzés doboz
     6. Naptár
     7. Foglalás elküldése
     8. Nyelvváltás és indulás
     9. Menüpont kiemelése görgetéskor
   ===================================================================== */

(function () {
  "use strict";


  /* -------------------------------------------------------------------
     1. BEÁLLÍTÁSOK ÉS SEGÉDFÜGGVÉNYEK
     ------------------------------------------------------------------- */

  var SITE = window.SITE;                              // minden adat a content.js-ből
  var BOOKING = SITE.info.reservation;                 // foglalási beállítások
  var LANGUAGES = ["en", "hu"];                        // választható nyelvek
  var STORAGE_KEY = "lang";                            // ezen a néven jegyzi meg a böngésző a nyelvet
  var PLACEHOLDER_IMAGE = "img/dishes/placeholder.svg"; // ha egy ételnek nincs képe

  var lang = "en";                                     // az éppen kiválasztott nyelv

  // Elem keresése az id-je alapján
  function byId(id) {
    return document.getElementById(id);
  }

  // Az aktuális nyelv szövegei (SITE.en vagy SITE.hu)
  function texts() {
    return SITE[lang];
  }

  // Szöveg kikeresése pontokkal elválasztott útvonal alapján, pl. "hero.title"
  function getByPath(obj, path) {
    return path.split(".").reduce(function (current, key) {
      return current == null ? current : current[key];
    }, obj);
  }

  // Új HTML elem létrehozása: címke, CSS osztály, szöveg
  function createElement(tag, className, text) {
    var element = document.createElement(tag);
    if (className) element.className = className;
    if (text != null) element.textContent = text;
    return element;
  }

  // A kiválasztott nyelv megjegyzése a böngészőben
  function saveLanguage(value) {
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch (error) {}
  }

  function loadLanguage() {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch (error) {
      return null;
    }
  }

  // Dátum- és számformátum a nyelvhez
  function locale() {
    return lang === "hu" ? "hu-HU" : "en-GB";
  }

  // Ár kiírása, pl. "2 500 Ft"
  function formatPrice(amount) {
    return amount.toLocaleString(locale()) + " " + SITE.info.currency;
  }

  // Dátum -> "2026-10-17" formátumú szöveg
  function toIsoDate(date) {
    var month = String(date.getMonth() + 1).padStart(2, "0");
    var day = String(date.getDate()).padStart(2, "0");
    return date.getFullYear() + "-" + month + "-" + day;
  }

  // "2026-10-17" formátumú szöveg -> dátum
  function fromIsoDate(text) {
    var parts = text.split("-");
    return new Date(+parts[0], +parts[1] - 1, +parts[2]);
  }

  // A mai naptól számított n-edik nap
  function daysFromToday(n) {
    var date = new Date();
    date.setDate(date.getDate() + n);
    return date;
  }

  // Dátum időpont nélkül (éjfélre állítva)
  function startOfDay(date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }

  // Hosszú dátum, pl. "szombat, október 17."
  function formatLongDate(isoText) {
    return fromIsoDate(isoText).toLocaleDateString(locale(), {
      weekday: "long",
      day: "numeric",
      month: "long"
    });
  }

  // Vendégszám szövegesen, pl. "2 guests" / "2 fő"
  function formatGuests(count) {
    var units = texts().reservation.guestsUnit;   // [egyes szám, többes szám]
    return count + " " + (count === 1 ? units[0] : units[1]);
  }

  // "18:30" -> percek éjfél óta (1110)
  function timeToMinutes(time) {
    var parts = time.split(":");
    return +parts[0] * 60 + +parts[1];
  }

  // Most hány perc telt el éjfél óta
  function minutesNow() {
    var now = new Date();
    return now.getHours() * 60 + now.getMinutes();
  }

  // Egy rádiógomb-csoportban kiválasztott érték ("" ha nincs)
  function checkedValue(name) {
    var input = document.querySelector('input[name="' + name + '"]:checked');
    return input ? input.value : "";
  }


  /* -------------------------------------------------------------------
     2. FIX SZÖVEGEK KIÍRÁSA
     ------------------------------------------------------------------- */

  function renderStaticTexts() {
    var t = texts();
    var info = SITE.info;

    // Oldal nyelve, címe és leírása (böngészőfül, keresők)
    document.documentElement.lang = lang;
    document.title = t.meta.title;
    document.querySelector('meta[name="description"]').setAttribute("content", t.meta.description);

    // Minden data-i18n="..." elem megkapja a hozzá tartozó szöveget
    document.querySelectorAll("[data-i18n]").forEach(function (element) {
      var value = getByPath(t, element.dataset.i18n);
      if (value != null) element.textContent = value;
    });

    // data-i18n-attr="alt:hero.imageAlt" -> az "alt" tulajdonság kap szöveget
    document.querySelectorAll("[data-i18n-attr]").forEach(function (element) {
      element.dataset.i18nAttr.split(";").forEach(function (pair) {
        var parts = pair.split(":");
        var value = getByPath(t, parts[1]);
        if (value != null) element.setAttribute(parts[0], value);
      });
    });

    // Logó link, oldal neve
    document.querySelectorAll(".brand").forEach(function (link) {
      link.href = info.website;
    });
    document.querySelectorAll("[data-info]").forEach(function (element) {
      element.textContent = info[element.dataset.info];
    });

    // Telefonszám és e-mail linkek
    document.querySelectorAll("[data-info-link]").forEach(function (link) {
      var key = link.dataset.infoLink;
      link.textContent = info[key];
      if (key === "phone") {
        link.href = "tel:" + info.phone.replace(/[^+\d]/g, "");
      } else {
        link.href = "mailto:" + info.email;
      }
    });

    // Térkép link (új lapon nyílik)
    document.querySelectorAll("[data-map]").forEach(function (link) {
      link.href = info.mapUrl;
      link.target = "_blank";
      link.rel = "noopener";
    });

    // Rólunk
    byId("about-lead").textContent = t.about.lead;
    byId("about-quote").textContent = t.about.quote;

    var aboutText = byId("about-text");
    aboutText.textContent = "";
    t.about.text.forEach(function (paragraph) {
      aboutText.appendChild(createElement("p", null, paragraph));
    });

    var aboutValues = byId("about-values");
    aboutValues.textContent = "";
    t.about.values.forEach(function (value) {
      var item = createElement("li", "value");
      item.appendChild(createElement("h3", null, value.title));
      item.appendChild(createElement("p", null, value.text));
      aboutValues.appendChild(item);
    });

    // Nyitvatartás
    var hours = byId("hours");
    hours.textContent = "";
    t.contact.hours.forEach(function (row) {
      var line = createElement("div", "hours-row");
      line.appendChild(createElement("dt", null, row.days));
      line.appendChild(createElement("dd", null, row.time));
      hours.appendChild(line);
    });

    // Közösségi oldalak a láblécben
    var social = byId("social");
    social.textContent = "";
    info.social.forEach(function (site) {
      var item = createElement("li");
      var link = createElement("a", null, site.label);
      link.href = site.url;
      link.target = "_blank";
      link.rel = "noopener";
      item.appendChild(link);
      social.appendChild(item);
    });

    // Aktuális év a láblécben
    byId("year").textContent = new Date().getFullYear();

    // Nyelvváltó: melyik gomb az aktív
    document.querySelectorAll(".lang-switch button").forEach(function (button) {
      button.setAttribute("aria-pressed", String(button.dataset.lang === lang));
    });
    document.querySelector(".lang-switch").setAttribute("aria-label", t.langLabel);
  }


  /* -------------------------------------------------------------------
     3. ÉTLAP ÉS ÉTEL-KÁRTYA
     ------------------------------------------------------------------- */

  // Kép beállítása; ha nem töltődik be, a helyettesítő kép jelenik meg
  function setImage(img, src) {
    img.onerror = function () {
      img.onerror = null;
      img.src = PLACEHOLDER_IMAGE;
    };
    img.src = src || PLACEHOLDER_IMAGE;
  }

  // Az étlap felépítése: kategóriánként egy doboz, benne az ételek
  function renderMenu() {
    var menuList = byId("menu-list");
    menuList.textContent = "";

    SITE.menu.forEach(function (category, categoryIndex) {
      var box = createElement("article", "menu-category");
      box.appendChild(createElement("h3", null, category.category[lang]));

      var list = createElement("ul", "menu-items");

      category.dishes.forEach(function (dish, dishIndex) {
        // Minden étel egy gomb – ezt jegyezzük meg, melyik étel
        var button = createElement("button", "menu-item");
        button.type = "button";
        button.dataset.cat = categoryIndex;
        button.dataset.dish = dishIndex;

        // Kis kép
        var thumb = createElement("img", "menu-thumb");
        thumb.alt = "";
        thumb.loading = "lazy";
        setImage(thumb, dish.image);

        // Név + ár, alatta a leírás
        var head = createElement("span", "menu-item-head");
        head.appendChild(createElement("span", "menu-item-name", dish.name[lang]));
        head.appendChild(createElement("span", "menu-item-price", formatPrice(dish.price)));

        var textBox = createElement("span", "menu-item-text");
        textBox.appendChild(head);
        textBox.appendChild(createElement("span", "menu-item-desc", dish.description[lang]));

        button.appendChild(thumb);
        button.appendChild(textBox);

        var item = createElement("li");
        item.appendChild(button);
        list.appendChild(item);
      });

      box.appendChild(list);
      menuList.appendChild(box);
    });
  }

  var dishDialog = byId("dish-dialog");
  var openDish = null;   // az az étel, amelyiknek a kártyája éppen nyitva van

  // Az étel-kártya kitöltése a kiválasztott étel adataival
  function fillDishCard() {
    if (!openDish) return;

    var dish = openDish;
    var t = texts();

    // Kép, név, ár, leírás, kalória
    var photo = byId("dish-photo");
    setImage(photo, dish.image);
    photo.alt = dish.name[lang];

    byId("dish-title").textContent = dish.name[lang];
    byId("dish-price").textContent = formatPrice(dish.price);
    byId("dish-desc").textContent = dish.description[lang];
    byId("dish-kcal").textContent = dish.kcal;
    byId("dish-close").setAttribute("aria-label", t.dish.close);

    // Tápanyagok aránya kalóriában számolva
    // (1 g fehérje = 4 kcal, 1 g szénhidrát = 4 kcal, 1 g zsír = 9 kcal)
    var calories = {
      protein: dish.protein * 4,
      carbs: dish.carbs * 4,
      fat: dish.fat * 9
    };
    var totalCalories = calories.protein + calories.carbs + calories.fat || 1;

    var bar = byId("macro-bar");
    var list = byId("macro-list");
    bar.textContent = "";
    list.textContent = "";

    ["protein", "carbs", "fat"].forEach(function (nutrient) {
      var percent = Math.round(calories[nutrient] / totalCalories * 100);

      // Egy darab a színes csíkból
      var segment = createElement("span", "seg seg-" + nutrient);
      segment.style.width = percent + "%";
      bar.appendChild(segment);

      // Egy sor a listában: ● Fehérje   58 g   56%
      var row = createElement("li");
      row.appendChild(createElement("span", "dot dot-" + nutrient));
      row.appendChild(createElement("span", "macro-name", t.dish[nutrient]));
      row.appendChild(createElement("strong", null, dish[nutrient] + " g"));
      row.appendChild(createElement("small", null, percent + "%"));
      list.appendChild(row);
    });

    // Allergének
    var allergens = byId("dish-allergens");
    allergens.textContent = "";

    if (!dish.allergens.length) {
      allergens.appendChild(createElement("li", "allergen-none", t.dish.noAllergens));
    }
    dish.allergens.forEach(function (key) {
      allergens.appendChild(createElement("li", "allergen", t.allergens[key] || key));
    });
  }

  // Kattintás egy ételre -> kártya megnyitása
  byId("menu-list").addEventListener("click", function (event) {
    var button = event.target.closest(".menu-item");
    if (!button) return;

    openDish = SITE.menu[button.dataset.cat].dishes[button.dataset.dish];
    fillDishCard();

    if (dishDialog.showModal) {
      dishDialog.showModal();
    } else {
      dishDialog.setAttribute("open", "");   // nagyon régi böngészőkhöz
    }
  });

  // Bezárás: × gomb, vagy kattintás a kártya mellé (a sötét háttérre)
  byId("dish-close").addEventListener("click", function () {
    dishDialog.close();
  });

  dishDialog.addEventListener("click", function (event) {
    if (event.target === dishDialog) dishDialog.close();
  });

  dishDialog.addEventListener("close", function () {
    openDish = null;
  });


  /* -------------------------------------------------------------------
     4. ASZTALFOGLALÁS
     ------------------------------------------------------------------- */

  var guests = BOOKING.defaultGuests;   // jelenlegi vendégszám

  // Vendégszám beállítása (a megengedett határok között)
  function setGuests(count) {
    guests = Math.max(BOOKING.minGuests, Math.min(BOOKING.maxGuests, count));

    byId("guests").value = guests;
    byId("guests-out").textContent = formatGuests(guests);
    byId("guests-minus").disabled = guests <= BOOKING.minGuests;
    byId("guests-plus").disabled = guests >= BOOKING.maxGuests;

    updateSummary();
  }

  // Egy kerek választógomb ("chip") készítése
  function createChip(name, value, label, isChecked, isDisabled) {
    var wrapper = createElement("label", "chip");

    var input = createElement("input");
    input.type = "radio";
    input.name = name;
    input.value = value;
    input.checked = !!isChecked;
    input.disabled = !!isDisabled;

    wrapper.appendChild(input);
    wrapper.appendChild(createElement("span", null, label));
    return wrapper;
  }

  // "Ma" és "Holnap" gombok
  function renderQuickDates() {
    var t = texts().reservation;
    var box = byId("date-quick");
    var selectedDate = byId("r-date").value;
    box.textContent = "";

    [[0, t.today], [1, t.tomorrow]].forEach(function (option) {
      var date = daysFromToday(option[0]);
      var value = toIsoDate(date);
      box.appendChild(createChip("dateq", value, option[1], selectedDate === value, !isBookable(date)));
    });
  }

  // Szabad időpontok (ma csak azok, amelyek legalább 30 perc múlva vannak)
  function renderTimeSlots() {
    var t = texts().reservation;
    var box = byId("time-slots");
    var previousTime = checkedValue("time");
    box.textContent = "";

    var isToday = byId("r-date").value === toIsoDate(new Date());
    var now = minutesNow();
    var anyFreeSlot = false;

    BOOKING.slots.forEach(function (group) {
      var groupBox = createElement("div", "slot-group");
      groupBox.appendChild(createElement("p", "slot-group-name", t.slotGroups[group.group] || group.group));

      var chips = createElement("div", "chips");

      group.times.forEach(function (time) {
        if (isToday && timeToMinutes(time) <= now + 30) return;   // már elmúlt / túl közel van
        anyFreeSlot = true;
        chips.appendChild(createChip("time", time, time, previousTime === time));
      });

      if (chips.children.length) {
        groupBox.appendChild(chips);
        box.appendChild(groupBox);
      }
    });

    if (!anyFreeSlot) {
      box.appendChild(createElement("p", "slot-empty", t.noSlotsToday));
    }

    // Elég egy gombot kötelezőnek jelölni, az egész csoportra érvényes
    var firstInput = box.querySelector("input");
    if (firstInput) firstInput.required = true;
  }

  // Ülőhely-kártyák (Belső tér, Terasz, Bár)
  function renderSeating() {
    var t = texts().reservation;
    var box = byId("seating");
    var previous = checkedValue("seating") || BOOKING.seating[0];
    box.textContent = "";

    BOOKING.seating.forEach(function (id) {
      var card = createElement("label", "card");

      var input = createElement("input");
      input.type = "radio";
      input.name = "seating";
      input.value = id;
      input.checked = id === previous;

      var content = createElement("span");
      content.appendChild(createElement("strong", null, t.seating[id].name));
      content.appendChild(createElement("small", null, t.seating[id].text));

      card.appendChild(input);
      card.appendChild(content);
      box.appendChild(card);
    });
  }

  // Alkalom legördülő lista
  function renderOccasions() {
    var t = texts().reservation;
    var select = byId("r-occasion");
    var previous = select.value || BOOKING.occasions[0];
    select.textContent = "";

    BOOKING.occasions.forEach(function (id) {
      var option = createElement("option", null, t.occasions[id]);
      option.value = id;
      option.selected = id === previous;
      select.appendChild(option);
    });
  }


  /* -------------------------------------------------------------------
     5. ÖSSZEGZÉS DOBOZ (jobb oldalt)
     ------------------------------------------------------------------- */

  // Az eddig kiválasztott adatok: [felirat, érték] párok
  function summaryRows() {
    var t = texts().reservation;
    var date = byId("r-date").value;
    var time = checkedValue("time");
    var seating = checkedValue("seating");
    var occasion = byId("r-occasion").value;

    return [
      [t.labels.guests, formatGuests(guests)],
      [t.labels.date, date ? formatLongDate(date) : ""],
      [t.labels.time, time],
      [t.labels.seating, seating ? t.seating[seating].name : ""],
      // a "nincs különleges alkalom" nem jelenik meg
      [t.labels.occasion, occasion && occasion !== BOOKING.occasions[0] ? t.occasions[occasion] : ""]
    ];
  }

  function updateSummary() {
    var list = byId("summary");
    if (!list) return;
    list.textContent = "";

    // Csak a kitöltött sorok jelennek meg
    summaryRows().forEach(function (row) {
      if (!row[1]) return;
      var line = createElement("div");
      line.appendChild(createElement("dt", null, row[0]));
      line.appendChild(createElement("dd", null, row[1]));
      list.appendChild(line);
    });

    // Emlékeztető, amíg nincs nap és időpont kiválasztva
    if (!byId("r-date").value || !checkedValue("time")) {
      list.appendChild(createElement("p", "summary-hint", texts().reservation.summaryEmpty));
    }
  }


  /* -------------------------------------------------------------------
     6. NAPTÁR
     Múltbeli napok és a zárva tartó napok nem választhatók.
     ------------------------------------------------------------------- */

  var closedWeekdays = BOOKING.closedWeekdays || [];   // 0 = vasárnap ... 6 = szombat
  var firstBookableDay = startOfDay(new Date());          // ma
  var lastBookableDay = startOfDay(daysFromToday(BOOKING.daysAhead));

  var shownYear = firstBookableDay.getFullYear();   // melyik hónap látszik a naptárban
  var shownMonth = firstBookableDay.getMonth();
  var focusedDate = "";                              // melyik napra ugrik a billentyűzet

  // Van-e még ma szabad időpont?
  function hasSlotsLeftToday() {
    var now = minutesNow();
    return BOOKING.slots.some(function (group) {
      return group.times.some(function (time) {
        return timeToMinutes(time) > now + 30;
      });
    });
  }

  // Foglalható-e az adott nap?
  function isBookable(date) {
    date = startOfDay(date);

    if (date < firstBookableDay) return false;                       // múltbeli nap
    if (date > lastBookableDay) return false;                        // túl messze van
    if (closedWeekdays.indexOf(date.getDay()) > -1) return false;    // zárva tartunk

    var isToday = date.getTime() === firstBookableDay.getTime();
    return !isToday || hasSlotsLeftToday();
  }

  // Nap kiválasztása (naptárból vagy a Ma / Holnap gombbal)
  function selectDate(isoText, fromCalendar) {
    byId("r-date").value = isoText;
    byId("date-error").hidden = true;

    if (isoText) {
      var date = fromIsoDate(isoText);
      shownYear = date.getFullYear();
      shownMonth = date.getMonth();
      focusedDate = isoText;
    }

    renderQuickDates();
    renderCalendar(!!fromCalendar);
    renderTimeSlots();
    updateSummary();
  }

  // Melyik nap kapja a billentyűzet-fókuszt a látható hónapban
  function chooseFocusedDate() {
    // Ha még nincs: az első foglalható nap
    if (!focusedDate) {
      var day = new Date(firstBookableDay);
      for (var tries = 0; tries < 400 && !isBookable(day); tries++) {
        day.setDate(day.getDate() + 1);
      }
      focusedDate = toIsoDate(day);
    }

    // Ha nem a látható hónapban van: a hónap első foglalható napja
    var focused = fromIsoDate(focusedDate);
    if (focused.getFullYear() === shownYear && focused.getMonth() === shownMonth) return;

    focusedDate = null;
    for (var i = 0; i < 31; i++) {
      var candidate = new Date(shownYear, shownMonth, 1 + i);
      if (candidate.getMonth() === shownMonth && isBookable(candidate)) {
        focusedDate = toIsoDate(candidate);
        break;
      }
    }
    if (!focusedDate) focusedDate = toIsoDate(new Date(shownYear, shownMonth, 1));
  }

  // A naptár felépítése; ha moveFocus igaz, a kijelölt napra ugrik a fókusz
  function renderCalendar(moveFocus) {
    var t = texts().reservation;
    var box = byId("calendar");
    var selectedDate = byId("r-date").value;
    box.textContent = "";

    chooseFocusedDate();

    /* --- Fejléc: ‹  hónap neve  › --- */
    var isFirstMonth = shownYear === firstBookableDay.getFullYear() && shownMonth === firstBookableDay.getMonth();
    var isLastMonth = shownYear === lastBookableDay.getFullYear() && shownMonth === lastBookableDay.getMonth();

    var prevButton = createElement("button", "cal-nav", "‹");
    prevButton.type = "button";
    prevButton.setAttribute("aria-label", t.prevMonth);
    prevButton.setAttribute("aria-disabled", String(isFirstMonth));
    prevButton.addEventListener("click", function () {
      if (isFirstMonth) return;
      shownMonth--;
      if (shownMonth < 0) {
        shownMonth = 11;
        shownYear--;
      }
      focusedDate = "";
      renderCalendar(false);
    });

    var nextButton = createElement("button", "cal-nav", "›");
    nextButton.type = "button";
    nextButton.setAttribute("aria-label", t.nextMonth);
    nextButton.setAttribute("aria-disabled", String(isLastMonth));
    nextButton.addEventListener("click", function () {
      if (isLastMonth) return;
      shownMonth++;
      if (shownMonth > 11) {
        shownMonth = 0;
        shownYear++;
      }
      focusedDate = "";
      renderCalendar(false);
    });

    var monthName = new Date(shownYear, shownMonth, 1).toLocaleDateString(locale(), { month: "long", year: "numeric" });
    var title = createElement("p", "cal-title", monthName);
    title.id = "cal-title";
    title.setAttribute("aria-live", "polite");

    var head = createElement("div", "cal-head");
    head.appendChild(prevButton);
    head.appendChild(title);
    head.appendChild(nextButton);
    box.appendChild(head);

    /* --- Táblázat --- */
    var table = createElement("table", "cal-grid");
    table.setAttribute("role", "grid");
    table.setAttribute("aria-labelledby", "cal-title");

    // A hét napjainak neve (hétfőtől). 2026. jan. 5. egy hétfő.
    var headRow = createElement("tr");
    for (var weekday = 0; weekday < 7; weekday++) {
      var sampleDay = new Date(2026, 0, 5 + weekday);
      var cell = createElement("th", null, sampleDay.toLocaleDateString(locale(), { weekday: "short" }));
      cell.scope = "col";
      cell.setAttribute("abbr", sampleDay.toLocaleDateString(locale(), { weekday: "long" }));
      headRow.appendChild(cell);
    }
    var thead = createElement("thead");
    thead.appendChild(headRow);
    table.appendChild(thead);

    // A hónap napjai
    var tbody = createElement("tbody");
    var firstOfMonth = new Date(shownYear, shownMonth, 1);
    var emptyCellsBefore = (firstOfMonth.getDay() + 6) % 7;            // hány üres cella hétfőtől az 1-jéig
    var daysInMonth = new Date(shownYear, shownMonth + 1, 0).getDate();
    var totalCells = Math.ceil((emptyCellsBefore + daysInMonth) / 7) * 7;
    var today = toIsoDate(new Date());
    var row = null;

    for (var i = 0; i < totalCells; i++) {
      if (i % 7 === 0) {           // új hét = új sor
        row = createElement("tr");
        tbody.appendChild(row);
      }

      var td = createElement("td");
      var dayNumber = i - emptyCellsBefore + 1;

      if (dayNumber >= 1 && dayNumber <= daysInMonth) {
        var date = new Date(shownYear, shownMonth, dayNumber);
        var isoText = toIsoDate(date);
        var bookable = isBookable(date);
        var isSelected = isoText === selectedDate;

        td.setAttribute("role", "gridcell");
        td.setAttribute("aria-selected", String(isSelected));

        var classes = "cal-day";
        if (!bookable) classes += " is-disabled";
        if (isSelected) classes += " is-selected";
        if (isoText === today) classes += " is-today";

        var dayButton = createElement("button", classes, String(dayNumber));
        dayButton.type = "button";
        dayButton.dataset.date = isoText;
        dayButton.tabIndex = isoText === focusedDate ? 0 : -1;
        dayButton.setAttribute("aria-label", formatLongDate(isoText) + (bookable ? "" : ", " + t.unavailable));
        if (!bookable) dayButton.setAttribute("aria-disabled", "true");

        td.appendChild(dayButton);
      }

      row.appendChild(td);
    }

    table.appendChild(tbody);
    box.appendChild(table);

    // "Zárva: szombat" felirat. 2026. jan. 4. egy vasárnap (= 0).
    var closedNames = closedWeekdays.map(function (weekdayNumber) {
      return new Date(2026, 0, 4 + weekdayNumber).toLocaleDateString(locale(), { weekday: "long" });
    });
    byId("closed-note").textContent = closedNames.length ? t.closedOn + " " + closedNames.join(", ") : "";

    if (moveFocus) {
      var focusButton = box.querySelector('.cal-day[tabindex="0"]');
      if (focusButton) focusButton.focus();
    }
  }

  // Kattintás egy napra
  byId("calendar").addEventListener("click", function (event) {
    var dayButton = event.target.closest(".cal-day");
    if (!dayButton || dayButton.getAttribute("aria-disabled") === "true") return;
    selectDate(dayButton.dataset.date, true);
  });

  // Mozgás a naptárban billentyűzettel (nyilak, Home, End, PageUp, PageDown)
  byId("calendar").addEventListener("keydown", function (event) {
    var dayButton = event.target.closest(".cal-day");
    if (!dayButton) return;

    var date = fromIsoDate(dayButton.dataset.date);
    var arrowSteps = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 };
    var mondayOffset = (date.getDay() + 6) % 7;   // hány nap telt el hétfő óta

    if (arrowSteps[event.key]) {
      date.setDate(date.getDate() + arrowSteps[event.key]);
    } else if (event.key === "Home") {
      date.setDate(date.getDate() - mondayOffset);        // a hét eleje
    } else if (event.key === "End") {
      date.setDate(date.getDate() + (6 - mondayOffset));  // a hét vége
    } else if (event.key === "PageUp") {
      date.setMonth(date.getMonth() - 1);                 // előző hónap
    } else if (event.key === "PageDown") {
      date.setMonth(date.getMonth() + 1);                 // következő hónap
    } else {
      return;
    }

    event.preventDefault();
    if (date < firstBookableDay || date > lastBookableDay) return;

    shownYear = date.getFullYear();
    shownMonth = date.getMonth();
    focusedDate = toIsoDate(date);
    renderCalendar(true);
  });

  // A teljes foglalási rész újrarajzolása
  function renderReservation() {
    renderQuickDates();
    renderCalendar(false);
    renderTimeSlots();
    renderSeating();
    renderOccasions();
    setGuests(guests);
  }


  /* -------------------------------------------------------------------
     7. FOGLALÁS ELKÜLDÉSE
     ------------------------------------------------------------------- */

  var form = byId("reservation-form");

  // − és + gombok
  byId("guests-minus").addEventListener("click", function () {
    setGuests(guests - 1);
  });

  byId("guests-plus").addEventListener("click", function () {
    setGuests(guests + 1);
  });

  // Bármilyen változás az űrlapon -> összegzés frissítése
  form.addEventListener("change", function (event) {
    if (event.target.name === "dateq") {     // Ma / Holnap gomb
      selectDate(event.target.value, false);
      return;
    }
    updateSummary();
  });

  // Először a napot ellenőrizzük, hogy ez a hibaüzenet jöjjön a böngésző saját üzenetei előtt
  form.querySelector('button[type="submit"]').addEventListener("click", function (event) {
    if (byId("r-date").value) return;

    event.preventDefault();

    var error = byId("date-error");
    error.textContent = texts().reservation.errors.date;
    error.hidden = false;

    var focusButton = document.querySelector('#calendar .cal-day[tabindex="0"]');
    if (focusButton) focusButton.focus();
  });

  // Küldés: megnyílik a levelezőprogram a kitöltött foglalással
  form.addEventListener("submit", function (event) {
    event.preventDefault();

    var t = texts().reservation;
    var lines = [];

    summaryRows().forEach(function (row) {
      if (row[1]) lines.push(row[0] + ": " + row[1]);
    });

    ["name", "email", "phone", "message"].forEach(function (field) {
      var value = form.elements[field].value;
      if (value) lines.push(t.fields[field] + ": " + value);
    });

    location.href = "mailto:" + SITE.info.reservationEmail
      + "?subject=" + encodeURIComponent(t.emailSubject)
      + "&body=" + encodeURIComponent(lines.join("\n"));
  });


  /* -------------------------------------------------------------------
     8. NYELVVÁLTÁS ÉS INDULÁS
     ------------------------------------------------------------------- */

  // Az egész oldal újrarajzolása az aktuális nyelven
  function renderAll() {
    renderStaticTexts();
    renderMenu();
    renderReservation();
    fillDishCard();      // ha nyitva van egy étel-kártya, az is lefordul
  }

  function setLanguage(newLang) {
    lang = newLang;
    saveLanguage(newLang);
    renderAll();
  }

  document.querySelectorAll(".lang-switch button").forEach(function (button) {
    button.addEventListener("click", function () {
      setLanguage(button.dataset.lang);
    });
  });

  // Indulás: a korábban választott nyelv, első látogatáskor angol
  var savedLanguage = loadLanguage();
  lang = LANGUAGES.indexOf(savedLanguage) > -1 ? savedLanguage : "en";
  renderAll();
})();


/* ---------------------------------------------------------------------
   9. MENÜPONT KIEMELÉSE GÖRGETÉSKOR
   Az a menüpont lesz aláhúzva, amelyik szakaszban éppen jár a látogató.
   --------------------------------------------------------------------- */
(function () {
  if (!("IntersectionObserver" in window)) return;

  // Menüpontok a szakaszok id-je szerint: { menu: <a>, reservation: <a>, ... }
  var links = {};
  document.querySelectorAll("nav a[href^='#']").forEach(function (link) {
    links[link.getAttribute("href").slice(1)] = link;
  });

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting || !links[entry.target.id]) return;

      Object.keys(links).forEach(function (id) {
        links[id].removeAttribute("aria-current");
      });
      links[entry.target.id].setAttribute("aria-current", "true");
    });
  }, { rootMargin: "-40% 0px -55% 0px" });

  Object.keys(links).forEach(function (id) {
    var section = document.getElementById(id);
    if (section) observer.observe(section);
  });
})();
