# JS jegyzet dolgozatra

## 1. Tipusok

**Primitivek:** number, string, boolean, undefined, null, bigint
- ertek szerint masolodnak
- undefined = nincs ertek adva, null = mi adtuk meg hogy ures

**Referencia:** object, tomb, fuggveny
- hivatkozas masolodik, nem maga az adat
- `{} === {}` false, mert ket kulon objektum

**typeof**
- `typeof null` -> "object" (regi hiba a nyelvben)
- `typeof []` -> "object" (tombhoz: `Array.isArray()`)
- `typeof NaN` -> "number"
- `typeof function(){}` -> "function"

**var / let / const**
| | var | let | const |
|---|---|---|---|
| hatokor | fuggveny | blokk | blokk |
| ujradeklaralas | igen | nem | nem |
| ujraertekadas | igen | igen | nem |

- const-nal a tomb/objektum tartalma valtozhat, csak ujat nem adhatok neki
- alapbol const, ha valtozik akkor let, var-t kerulni

**Konverzio**
```js
"5" + 1   // "51" (osszefuz)
"5" - 1   // 4
Number("12px")   // NaN
parseInt("12px") // 12
String(123)      // "123"
```

**== vs ===**
- `==` atalakitja a tipust, `===` nem
- mindig `===`-t hasznalok
- `NaN === NaN` false -> `Number.isNaN()`

**Falsy (8 db):** false, 0, -0, 0n, "", null, undefined, NaN
- minden mas truthy, pl. "0", [], {}

**Specialis:** `1/0` Infinity, `0/0` NaN

## 2. Vezerlesi szerkezetek

```js
if (x > 5) { } else if (x > 2) { } else { }

switch (n) {
  case 1: console.log("egy"); break;   // break nelkul lecsuszik!
  default: console.log("mas");
}

let szoveg = kor >= 18 ? "felnott" : "kiskoru";   // ternaris
```

**Logikai:** `&&` es, `||` vagy, `!` nem
- `??` -> csak null/undefined eseten ad alaperteket (`0 ?? 10` = 0, de `0 || 10` = 10)
- `?.` -> nem dob hibat ha nincs meg a dolog (`user.cim?.varos`)

**Ciklusok**
- `for` -> ha tudom hanyszor
- `while` -> elobb ellenorzi, lehet hogy egyszer sem fut le
- `do...while` -> legalabb egyszer lefut
- `for...of` -> ertekek (tomb, string, Set, Map)
- `for...in` -> objektum kulcsai
  - tombre nem jo: indexet stringkent adja, oroklott dolgokat is bejarja

`break` = kilep, `continue` = kovetkezo kor (forEach-ben nem mukodik)

**Hibakezeles**
```js
try {
  throw new Error("hiba");
} catch (e) {
  console.log(e.message);
} finally {
  console.log("mindig lefut");
}
```

## 3. Adatszerkezetek

### Tomb
- index 0-tol, `tomb.length`, utolso elem: `tomb.at(-1)`

| metodus | mit csinal | mit ad vissza | modositja? |
|---|---|---|---|
| push | vegere tesz | uj hossz | igen |
| pop | utolsot kiveszi | kivett elem | igen |
| shift | elsot kiveszi | kivett elem | igen |
| unshift | elejere tesz | uj hossz | igen |
| splice | torol/beszur | torolt elemek | igen |
| sort | rendez | ugyanaz a tomb | igen |
| reverse | megfordit | ugyanaz a tomb | igen |
| slice | masolat egy reszrol | uj tomb | nem |
| concat | osszefuz | uj tomb | nem |
| includes | benne van? | true/false | nem |
| indexOf | hanyadik? | index vagy -1 | nem |
| join | szoveget csinal | string | nem |
| forEach | mindegyikre lefut | undefined | nem |
| map | atalakit | uj tomb (ugyanolyan hosszu) | nem |
| filter | szur | uj tomb (rovidebb) | nem |

- **sort buktato:** alapbol szovegkent rendez! `[10, 9, 1].sort()` hibas, kell: `.sort((a, b) => a - b)`
- **spread:** `const ujTomb = [...a, ...b];`
- **destrukturalas:** `const [elso, masodik] = tomb;`
- spread csak sekely masolat

### Set
- egyedi ertekek, nincs benne ismetlodes
- `add`, `has`, `delete`, `clear`, `size`
- bejaras: `for (const x of set)`
```js
const egyedi = [...new Set([1, 2, 2, 3])];   // [1, 2, 3]
```

### Map
- kulcs-ertek parok, a kulcs barmi lehet (nem csak string)
- `set`, `get`, `has`, `delete`, `clear`, `size`
- bejaras: `for (const [k, v] of map)`, `keys()`, `values()`, `entries()`
```js
const m = new Map();
m.set("alma", 3);
console.log(m.get("alma"));   // 3
```

### Object
```js
const diak = { nev: "Anna", kor: 17 };
diak.nev;          // pont
diak["kor"];       // szogletes zarojel
diak.osztaly = "11.B";   // hozzaadas
delete diak.kor;         // torles
Object.keys(diak); Object.values(diak); Object.entries(diak);
const { nev } = diak;            // destrukturalas
const masolat = { ...diak };     // spread
```
- metodus: fuggveny az objektumban, `this` = az objektum amin hivtak
```js
const kutya = { nev: "Morzsi", ugat() { return this.nev + " vau"; } };
```

## 4. Fuggvenyek

```js
function osszeg(a, b) { return a + b; }          // deklaracio (hoisting van)
const osszeg2 = function (a, b) { return a + b; };   // kifejezes
const osszeg3 = (a, b) => a + b;                 // nyil
const negyzet = x => x * x;                      // egy parameter: nem kell zarojel
const obj = n => ({ nev: n });                   // objektum visszaadasa: zarojel kell!
```

- **alapertelmezett ertek:** `function f(a, b = 10) {}`
- **rest:** `function f(...args) {}` -> args egy tomb
- ha nincs `return`, akkor `undefined` jon vissza
- **this:** hagyomanyos fuggvenynek sajat this-e van, nyilfuggvenynek nincs (a kornyezetebol orokli)
  - objektum metodusnak ne irjak nyilat, callbacknek jo

## Onellenorzo kerdesek

1. **let vs const:** let-nek lehet uj erteket adni, const-nak nem (de a tartalma valtozhat, ha tomb/objektum)
2. **typeof null:** "object", furcsa mert a null primitiv. Regi hiba, nem javitottak ki.
3. **for...of vs for...in:** of = ertekekre (tomb), in = objektum kulcsokra
4. **map vs forEach:** map uj tombot ad vissza, forEach undefined-ot (csak vegigmegy)
5. **duplikatumok kiszurese:** `[...new Set(tomb)]`
6. **Map vs Object:** Map kell ha a kulcs nem string, sokat adok hozza/torlok, vagy fontos a sorrend/meret. Object ha fix szerkezetu adat (pl. egy diak adatai).