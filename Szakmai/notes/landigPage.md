# Webros.hu Design System

## Colors
Primary: #800F2F
Secondary: #A4133C
Accent: #FF4D6D
___
Background: #FFF0F3
Surface: #FFCCD5
Text: #590D22

## Typography
Heading font: Ancient Medium
Body font: Spicy Kebab

## General style
Modern
Clean
Human-made
Responsive

---

# Project notes: everything that has happened to this site

## 1. What the site is now
A one-page, bilingual (English / Hungarian) restaurant landing page with:
hero, menu with clickable dishes, step-by-step table reservation, about us, contact + opening hours, footer.
Plain HTML + CSS + JavaScript. No build step, no frameworks, no server: open `index.html` and it works.

## 2. File map
| File | Purpose |
|---|---|
| `index.html` | Semantic page skeleton. Contains no real text, only `data-i18n` hooks. |
| `js/content.js` | **The only file you need to edit.** All texts (EN + HU), menu, prices, hours, contact data, booking rules. |
| `js/main.js` | Language switch, menu + dish popup, booking panel, calendar. No content in here. |
| `css/style.css` | All styling, built on the design-system variables above. |
| `img/joeyy.jpg` | Logo and hero photo (original). |
| `img/dishes/*.svg` | Dish illustrations + `placeholder.svg`. |
| `fonts/` | Ancient Medium, Spicy Kebab (original). |
| `notes/landigPage.md` | This file. |

## 3. How to fill in the site (`js/content.js`)
1. **`info`**: site name, website link, phone, email, reservation email, map link, currency, social links, booking rules.
2. **`menu`**: one block per dish: `image`, `price`, `kcal`, `protein`, `carbs`, `fat`, `allergens`, plus `name` and `description` in `en` and `hu`.
   - Allergen keys: `gluten crustaceans eggs fish peanuts soy milk nuts celery mustard sesame sulphites lupin molluscs` (`[]` = none).
   - Copy a `{ ... }` block to add a dish, a whole `{ category, dishes }` block to add a category.
3. **`en` / `hu`**: all other texts. Keep the keys, change the values.
4. Photos: drop files into `img/dishes/` and point `image:` at them. A missing/empty image falls back to `placeholder.svg`.

## 4. Changelog (in the order it happened)

### Step 1 - Semantic structure + language selection
- Rewrote `index.html` with proper landmarks: skip link, header, nav, main, sections with headings, address, footer.
- Moved every piece of text into `js/content.js` so only that file needs filling in.
- Added the **EN / HU switch** in the header. English is the default the first time the site is opened; the choice is then remembered (localStorage) and the `<html lang>`, page title and meta description change with it.
- Added sections: Menu, Reservation, About, Contact (with opening hours), Footer.
- Body background/text now use the design-system colours (it used a stray `#fff8f1` before).
- Found that **Spicy Kebab has no real accented letters** (á é í ó ö ú ü are drawn as plain a e i o u; ő ű are missing, and Ancient Medium misses ő ű too). Fixed by limiting Spicy Kebab to basic characters with `unicode-range` so accented letters come from a fallback serif (Georgia). Hungarian now reads correctly, but accented letters look slightly different from the rest of the word.

### Step 2 - Dish popups + better reservation
- Every dish is a button. Clicking opens a native `<dialog>` with photo, name, price, description, **kcal per portion**, **macros** (grams + % of calories on a coloured bar) and **allergen badges**. Closes with the X, Esc or a click outside; focus returns to the dish.
- Moved each dish into one block in `content.js` (facts + both languages together).
- New **reservation panel**: guests stepper, day (Today / Tomorrow / calendar), lunch and dinner time chips, seating (indoor / terrace / bar), occasion, contact details, and a live summary card with the send button.
- Times that have already passed today are hidden. Sending opens the visitor's mail app (`mailto:`) with everything filled in.

### Step 3 - Accessibility, all screen sizes, booking rules, About copy
- **No past dates and no Saturdays.** A native date field cannot block a weekday, so it was replaced by an accessible calendar (arrow keys, Home/End, PageUp/PageDown). Past days, closed weekdays and today (when no slots are left) are greyed out and cannot be chosen. Closed days are set with `closedWeekdays: [6]` (0 = Sunday ... 6 = Saturday). Booking is limited to 60 days ahead.
- Opening-hours placeholders changed to match: Saturday closed, Sunday 12:00 - 20:00.
- Submitting without a date shows a clear message and focuses the calendar.
- **Accessibility:** logical tab order, skip link, visible high-contrast focus ring, dialog focus handling, `aria-current` on the nav link of the section in view, live-announced summary and calendar month, 44px touch targets, required fields marked with *, reduced-motion and forced-colors support. Text contrast is at least 5.4:1 on every colour pair.
- **Responsive:** checked 13 sizes from 320px to 2560px plus a small phone in landscape: no sideways overflow; very large screens scale text up slightly.
- Wrote the **About us** copy (headline, 3 paragraphs, quote card, 3 value cards) in both languages, in the "human-made, clean" tone.

### Step 4 - Real menu
- Filled in the menu: Bruschetta, Garlic Bread (starters); Grilled Chicken Breast, Spaghetti Bolognese (main courses); Chocolate Brownie, Cheesecake (desserts), with EN + HU names and descriptions.
- Each dish has kcal, protein/carbs/fat and its allergens.
- Real photos could not be downloaded in the build environment, so each dish got a **hand-drawn SVG illustration** in the brand palette.

### Step 5 - Fixes
- **Menu rows:** the price could drop under the dish name at some screen sizes. Each row is now a two-column grid (name | price): the name wraps on its own and the price always stays on the right. Verified from 320px to 2560px in both languages, and with a very long dish name.
- **Logo / "webros.hu" in the top bar** now links to the real website (`info.website` = https://webros.hu) instead of reloading this page.
- This notes file was rewritten to document all of the above.

## 5. Things to check before going live
- **Prices** are placeholders (2 500 - 5 200 Ft). Set the real ones.
- **kcal / macros are estimates** from typical portion sizes (Bruschetta ~3 pieces, Garlic Bread 2-3 slices, Chicken ~180 g, Bolognese ~350 g, Brownie ~80 g, Cheesecake ~120 g). Replace with values for your own recipes.
- **Allergens** were derived from the ingredients written in each description, i.e. an assumed recipe. Check them against the real recipes; this is customer-safety information. Add a key to a dish's `allergens` list if something is missing.
- **Photos:** replace the SVG illustrations with real photos when you have them.
- **Contact data** (address, phone, email, map link, social links, reservation email) is still placeholder.
- **Opening hours:** Saturday closed / Sunday 12-20 is a placeholder. If you change the closed day, also change `closedWeekdays`.
- **Reservations** are not stored anywhere. They arrive as an email from the visitor's mail app, and the restaurant confirms each one. The calendar rules only stop visitors in the browser. Real availability checking would need a backend.
- **Fonts:** for a perfect Hungarian look, use a font that has all Hungarian letters (ő ű and real accents).
- Everything still reads well with JavaScript only because all content is rendered from `content.js`. Without JavaScript the page shows empty sections.
