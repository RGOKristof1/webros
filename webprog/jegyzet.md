# JS jegyzet dolgozatra

## 1. Tipusok

### Primitivek:
>number, string, boolean, undefined, null, bigint
- ertek szerint masolodnak
- undefined = nincs ertek adva, null = mi adtuk meg hogy ures

### Referencia:
> object, tomb, fuggveny
- hivatkozas masolodik, nem maga az adat

**typeof**
- `typeof null`: **object** (regi hiba a nyelvben)
- `typeof []`: **object** (tombhoz: `Array.isArray()`)
- `typeof NaN`: **number**
- `typeof function(){}`: **function**

**var / let / const**
| | var | let | const |
|---|---|---|---|
| hatokor | fuggveny | blokk | blokk |
| ujradeklaralas | igen | nem | nem |
| ujraertekadas | igen | igen | nem |

- const-nal a tomb/objektum tartalma valtozhat, csak ujat nem lehet neki adni
- alapbol const, ha valtozik akkor let

### Konverzio
```js
"5" + 1   // "51" (osszefuz)
"5" - 1   // 4
Number("12px")   // NaN
parseInt("12px") // 12
String(123)      // "123"
```

### "==" vs "==="
- `==` atalakitja a tipust, `===` nem
- `NaN === NaN` false -> `Number.isNaN()`

**Falsy (8 db):** false, 0, -0, 0n, "", null, undefined, NaN
- minden mas truthy, pl. "0"

**Specialis:** `1/0` Infinity, `0/0` NaN

## 2. Vezerlesi szerkezetek

```js
if (x > 5) { } else if (x > 2) { } else { }

switch (n) {
  case 1: console.log("egy"); break;
  default: console.log("mas");
}

let szoveg = kor >= 18 ? "felnott" : "kiskoru";   // ternaris
```

### Logikai operatorok
>`&&` es, `||` vagy, `!` nem
- `??`: csak null/undefined eseten ad alaperteket
>- `0 ?? 10` = 0  
>- `0 || 10` = 10
- `?.`: nem dob hibat ha nincs meg a dolog (`user.cim?.varos`)

### Ciklusok
- `for`: ha tudom hanyszor
- `while`: elobb ellenorzi, lehet hogy egyszer sem fut le
- `do...while`: legalabb egyszer lefut
- `for...of`: ertekek (tomb, string, Set, Map)
- `for...in`: objektum kulcsai
  - tombre nem jo

---

- `break` = kilep
- `continue` = kovetkezo kor (forEach-ben nem mukodik)

### Hibakezeles
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
- index 0-tol
- `tomb.length`
- utolso elem: `tomb.at(-1)`

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

- **spread:** `const ujTomb = [...a, ...b];`
- **destrukturalas:** `const [elso, masodik] = tomb;`

### Set

- egyedi ertekek
- nincs benne ismetlodes
- `add`, `has`, `delete`, `clear`, `size`
- bejaras: `for (const x of set)`
```js
const egyedi = [...new Set([1, 2, 2, 3])];   // [1, 2, 3]
```

### Map
- kulcs-ertek parok
- a kulcs barmi lehet (kiveve string)
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
diak.nev;
diak["kor"];
diak.osztaly = "11.B";
delete diak.kor;
Object.keys(diak); Object.values(diak); Object.entries(diak);
const { nev } = diak;
const masolat = { ...diak };
```
- metodus: fuggveny az objektumban,
- `this` = az objektum amin hivtak
```js
const kutya = { nev: "Jeszi", ugat() { return this.nev + " vau"; } };
```

