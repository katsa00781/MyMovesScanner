## Feature task lista – Mymoviescanner v1

> **Ez a fájl egyben munkanapló is.** Minden elvégzett művelet után ki kell pipálni a
> sort, be kell írni a munkanapló bejegyzést, és commitolni kell (egy művelet = egy commit).
> A részletes szabályok a `CLAUDE.md` „Munkanapló és commitok” szakaszában vannak.

### Setup (egyszeri) — minden sor külön commit
- [x] Expo projekt létrehozása (`npx create-expo-app@latest mymoviescanner -t default`), TypeScript strict
- [x] Git init, első commit: `init`
- [x] `.env`, `.env.example`, `.gitignore` (EXPO_PUBLIC_SUPABASE_URL, EXPO_PUBLIC_SUPABASE_ANON_KEY)
- [x] NativeWind telepítése és konfigurálása
- [x] Függőségek: zustand, @react-native-async-storage/async-storage, expo-image, @supabase/supabase-js
- [x] `docs/design/` mappa elhelyezése a projektben (PDF + 16 PNG)
- [x] Assets elhelyezése (`assets/images/`: logo, tmdb-logo) + `constants/images.ts`
- [x] `npm run lint` és `npm run typecheck` scriptek
- [x] `app.json`: iPad támogatás (`supportsTablet: true`), minden orientáció
- [x] CLAUDE.md és docs/ elhelyezése a projekt gyökerében
- [ ] Push GitHub-ra

### Backend (familyBudget Supabase, `mms` séma) — minden sor külön commit
- [x] Migráció: `mms` séma + `mms.tmdb_cache` tábla + index `expires_at`-ra
- [x] Edge Function `mms-tmdb`: whitelist, cache olvasás/írás TTL-lel, TMDB hívás secretből
- [x] `TMDB_API_KEY` secret beállítása, függvény deploy, curl teszt
- [x] `lib/supabase.ts`, `lib/api.ts`, `lib/tmdbImage.ts`, `types/tmdb.ts`

### Feature-ök (sorrendben) — minden sor külön commit
> Minden képernyőnél a `docs/design/` megfelelő iPhone + iPad PNG-je a forrás.

- [x] Design tokenek és szövegek: `constants/theme.ts` a CLAUDE.md „Design tokenek” alapján, `constants/strings.ts` magyar szövegekkel (D-011)
- [x] Navigációs váz: tab bar (telefon) / oldalsáv + MY SERVICES (iPad), üres képernyőkkel — design: 02, 10
- [x] Onboarding 1. lépés: HU szolgáltatók dinamikus listája, kártyák, CTA számlálóval, Skip — design: 01, 09
- [x] Onboarding 2. lépés: Kids korhatár választás (ideiglenes, lásd CLAUDE.md), átirányítás ha nincs kész
- [x] Közös komponensek: `PosterCard` (szolgáltató / formátum / státusz badge), `PosterRail`, `SectionHeader` (See all), skeleton, üres és hiba állapot
- [x] Főoldal: hero carousel (NEW ON …, Trailer, +, pöttyök) + „New on your services” rail — design: 02, 10
- [x] Főoldal: „New Blu-ray releases” rail (HU → DE fallback, formátum badge — D-006, D-014)
- [x] Főoldal: „Trending in Hungary” sorszámos rail (D-015) + „Kids' picks” fekvő kártyák + forrásmegjelölés lábléc
- [x] Adatlap: hero, meta, korhatár, TMDB értékelés, Trailer, Watchlist gomb, leírás — design: 06, 14
- [x] Adatlap: Where to watch (All/Stream/Rent/Buy, ár nélkül — D-012), On disc kártya (D-013), Cast & crew, iPad About oszlop
- [x] Watchlist: hozzáadás/eltávolítás, szegmens számlálóval, státusz badge-ek — design: 07, 15
- [x] Böngészés: My services szűrő, műfaj chipek, találatszám, rendezés, rács, végtelen görgetés — design: 03, 11
- [x] Gyerek sarok: korhatár chipek, Mature titles hidden, téma chipek (keywordök), Big adventures — design: 04, 12
- [x] Keresés: debounce, Recent searches (`useSearchStore`), All/Films/Series/People, találati sor Stream/Rent/Buy chipekkel — design: 05, 13
- [x] Beállítások: My services + Edit, Region & language, Kids corner, About (Notifications rejtve — D-013) — design: 08, 16
- [x] iPad finomhangolás: rács oszlopszámok, kétoszlopos adatlap, portrait/landscape ellenőrzés a designnal összevetve

### Fiók és szinkron (D-051) — minden sor külön commit
> Nincs design a bejelentkezés / regisztráció képernyőhöz: a design tokenjeivel és a Beállítások kártya-stílusában készül (jóváhagyásra).

- [x] Döntés és dokumentáció: D-051, CLAUDE.md auth szakaszai, feladatlista
- [x] Migráció: `mms.user_data` (felhasználónként egy dokumentum, RLS policy nélkül) — megírva, **alkalmazás csak kérésre**
- [x] Edge Function `mms-sync`: JWT-ből azonosít, `get` / `put`, méret- és alakellenőrzés — megírva, **deploy csak kérésre**
- [x] Kliens: tartós munkamenet (`lib/supabase.ts`), `useAuthStore`, `lib/auth.ts`
- [x] Bejelentkezés / regisztráció képernyő + „Fiók” szekció a Beállításokban
- [x] Szinkron: `lib/syncApi.ts`, `useSyncStore`, belépéskori egyesítés, módosítás utáni feltöltés, előtérbe kerüléskori letöltés
- [ ] Éles bekapcsolás: migráció alkalmazása, függvény deploy, Auth beállítások (felhasználói kérésre), végigpróbálás két eszközön — **elhalasztva (D-055)**; a migráció már alkalmazva, a `mms-sync` nincs deployolva

### Ship előtt
- [x] Fiók törlése az appból — **nem szükséges a v1-ben**: a fiók-létrehozás ki van kapcsolva (D-055), így az App Store 5.1.1(v) nem érvényes; a funkció bekapcsolásakor újra kell nyitni
- [ ] Teljes flow tesztelése iPhone-on és iPaden
- [x] Edge case-ek: üres szolgáltatólista, nincs találat, hosszú cím, nincs net, lassú net
- [x] Lint + typecheck hibák nélkül
- [ ] CodeRabbit code review az AI által írt feature-ökhöz
- [x] Dev utilities eltávolítása (test gombok, console.log-ok, mock data; `components/DevResetButton.tsx` + a sora az `app/_layout.tsx`-ben, D-029)
- [x] Secrets ellenőrzése (kliens bundle + git history: nincs TMDB kulcs, nincs service role)
- [x] Ellenőrzés: familyBudget táblák érintetlenek, csak `mms` séma változott
- [ ] EAS Build + TestFlight a családi eszközökre

---
---

# Munkanapló

Minden befejezett művelet után ide kerül egy bejegyzés, **legfelülre** (fordított
időrend, a legfrissebb legyen elöl). Ugyanabba a commitba, mint a kód.

Sablon:

```
## ÉÉÉÉ-HH-NN – [feladat neve]

**Mit:** egy-két mondat arról, mi készült el.
**Fájlok:** [érintett fájlok]
**Tesztelve:** [eszköz, mit próbáltál]
**Nyitva maradt:** [ha van]
**Commit:** [commit üzenet]
```

<!-- ÚJ BEJEGYZÉSEK IDE, LEGFELÜLRE -->

## 2026-10-18 – Keresés: találati lista szűrői, magyarországi elérhetőség (feature)

**Mit:** A felhasználó észrevételei: a találatok között van, ami Magyarországon nem nézhető, és ami nincs a kiválasztott szolgáltatókon; kért szűrést értékelés, megjelenési dátum és szolgáltató szerint. A Keresés select sorában (Műfaj, Téma mellett) három új select: **Elérhetőség** (alapérték: Magyarországon), **Értékelés**, **Megjelenés**; a sor vízszintesen görgethető. Kategória-keresésnél a TMDB szűr, szöveges keresésnél az app (két oldal, 40 találat). A találati sor adata kapott `date` és `rating` mezőt. Az általános `FilterSelect` felváltja a `CategorySelect`-et, a sort a `SearchSelects` rakja össze. Üres találatnál „Nincs találat ezekkel a szűrőkkel.” D-057.
**Fájlok:** components/{FilterSelect,SearchSelects}.tsx (új), components/CategorySelect.tsx (törölve), data/resultFilters.ts (új), lib/resultFilters.ts (új), lib/searchResults.ts, types/app.ts, hooks/useSearch.ts, app/(tabs)/search.tsx, constants/strings.ts, docs/feature-tasks.md
**Tesztelve:** `npm run lint`, `npm run typecheck`; a szűrő-logika Node-dal (paraméterek, `resolveFilters`, értékelés / dátum / elérhetőség egyezés, szélsőesetek); élő `discover`: vígjáték film bárhol 18 006 → Magyarországon 5 364 → +7+ értékelés 797 → +elmúlt 3 év 513; Netflix + sorozat vígjáték 196 (SPY×FAMILY, Wednesday…); szöveges „batman” / „star”: 40 címből 27 / 28 nézhető Magyarországon. **Képernyőn / eszközön NEM néztem:** a select sor görgetése, a lapok nyitása, a rejtett-majd-megjelenő sorok a szöveges keresésnél, iPad két oszlopos elrendezés.
**Nyitva maradt:** (1) **Nincs design** a szűrőkhöz; szövegek jóváhagyásra (`strings.search.filters`). (2) **Az alapérték elrejti a nem nézhető címeket**, így egy még nem megjelent / mozis cím keresésre nem jön fel, amíg az Elérhetőség „Minden találat” nincs; ha ez zavar, az alapérték `data/resultFilters.ts`-ben egy sor. (3) A szűrők nem perzisztálnak (képernyő életére élnek), a „Mégse” nem állítja vissza őket. (4) Szöveges keresésnél a szűrt találatok száma kevesebb (kb. 15–30 a 40-ből), több oldal nincs. (5) Szolgáltató szerint csak előfizetés (`flatrate`) számít; ingyenes / reklámos kínálatot az app nem kezel (D-012). (6) A `mms.tmdb_cache` több kulcsot kap (szűrő-kombinációk, második oldal); a lejárt sorok takarítása az `mms-tmdb` **deploy** után működik (a deploy még a te lépésed).
**Commit:** `feat: keresés találati szűrők, magyarországi elérhetőség` (D-057)

## 2026-10-18 – Keresés: Műfaj / Téma select és „és” kapcsolat (feature)

**Mit:** A felhasználó kérésére a Keresés kategóriái select menükből is választhatók, és a szűrők „és” kapcsolatban vannak (pl. Sorozatok + Vígjátékok). Új `CategorySelect` (gomb + pipás lap), két példány: **Műfaj** (több választható) és **Téma** (egy). A `useSearch` a `CategorySelection`-t (műfajok + egy téma) kapja; `lib/searchCategories.ts`: `selectionParams` (a régi `categoryParams` helyett), `selectionKey`, `isTheme`, `noSelection`. A begépelt szóra illeszkedő chipek (`SearchCategoryChips`) többes kiválasztásúak lettek, és ugyanazt a kiválasztást kapcsolják. A „Találatok” fejléc (iPad) a kiválasztottakat sorolja („Vígjátékok · Zombik”). A sorozat-oldalról a Hír / Talk műfaj kizárva. Új token `searchLayout.selectTop`. D-056.
**Fájlok:** components/CategorySelect.tsx (új), components/SearchCategoryChips.tsx, app/(tabs)/search.tsx, hooks/useSearch.ts, lib/searchCategories.ts, constants/{strings,theme}.ts, docs/feature-tasks.md
**Tesztelve:** `npm run lint`, `npm run typecheck`; a `selectionParams` Node-dal (film / sorozat, műfaj-műfaj, műfaj-téma, azonos TV-azonosító, üres, sorrendfüggetlen kulcs); élő `discover` az élő függvényen: sorozat + vígjáték, film vígjáték + romantikus (4016 találat), vígjáték + zombi (152: Zombieland, Hotel Transylvania…), sorozat sci-fi + dráma + robot (26: Fallout, Alkonyzóna…). A TMDB vegyes `A,B|C` kulcsszó-alakját is kipróbáltam, ezért nincs több téma (D-056). **Képernyőn / eszközön NEM néztem**: a gombok elhelyezése, a lap (`pageSheet`) nyitása / zárása, a chip-sor és a select együttes viselkedése iPhone-on és iPaden ellenőrizendő.
**Nyitva maradt:** (1) **Nincs design** a selectekhez, jóváhagyásra (D-056); szövegek: „Műfaj”, „Téma”, „Több műfaj is választható, a találatok mindegyikre illeszkednek.”, „Egy téma választható.”, „Kész”. (2) **Több téma „és” kapcsolata nincs** (TMDB-korlát). (3) A szöveg módosítása kiüríti a kiválasztást (a szöveg és a kategória nem kombinálható). (4) A `localeCompare(…, 'hu')` rendezés Hermesen eszközön ellenőrizendő (ha nem ismeri a nyelvet, az alapsorrend szerint rendez, ékezetesek a végére kerülhetnek). (5) A „vígjáték” sorozatok élén még így is egy hongkongi sorozat áll (TMDB népszerűség). (6) A műfaj-lista 17 elem, a téma 40: a lap hosszú, görgethető; keresőmező nincs benne.
**Commit:** `feat: keresés műfaj és téma select, és kapcsolat` (D-056)

## 2026-10-18 – Keresés: 34 új kategória (feature)

**Mit:** A felhasználó kérésére a Keresés kategóriái 23-ról 57-re bővültek (D-048 mintája, az Edge Function nem változott). **13 műfaj:** vígjáték, romantikus, thriller, sci-fi, dráma, fantasy, animáció, dokumentum, rejtély, történelmi, családi, kaland, akció (a TV-ben a sci-fi / fantasy a 10765, a kaland / akció a 10759 összevont műfaj; romantikus, thriller, történelmi csak filmre). **21 téma kulcsszóval:** kalózok, harcművészet, maffia, sorozatgyilkosok, börtön, ókori Róma, második világháború, szellemek, robotok, disztópia / cyberpunk, igaz történetek, bírósági drámák, box, gimis filmek, esküvők, musicalek, sárkányok, mesék, vikingek, összeesküvések, túlélés. A kulcsszó-azonosítókat 30 mintafilm `keywords` listájából vettem, és mind a 34 kategória `discover` lekérdezését élő függvényen futtattam (film és sorozat, népszerűség szerint, találatszám + első 5 cím átnézve). A szótő-illesztést 45 begépelt szóra teszteltem Node-dal (nincs duplikált kulcs).
**Fájlok:** data/searchCategories.ts, constants/strings.ts, docs/feature-tasks.md
**Tesztelve:** `npm run lint`, `npm run typecheck`; élő `discover` a 34 kategóriára; illesztés-teszt (lásd fent). **Képernyőn / eszközön nem néztem** (a chip-sor vízszintes görgetése sok találatnál, pl. „dráma” + „dram” stb.).
**Nyitva maradt:** (1) **Szövegek jóváhagyásra:** a 34 felirat a `strings.search.categories` alatt. (2) **Találati minőség:** a széles műfajoknál (vígjáték, dráma) a TV-lista a TMDB népszerűsége szerint rendez, ezért talk show-k és ázsiai sorozatok is előkerülnek (pl. „vígjáték” sorozatok: Late Night, The Tonight Show); ha zavaró, a `tvGenres` kivehető, és a kategória film-only lesz. A „szellemek” között Harry Potter helyett a Démonok között / Megszállottság jön (a 162846 „ghost” kulcsszót kihagytam). (3) **„Sorozatgyilkos” szóra** csak a „gyilkos” szótő illeszt: a „sorozatgyilkos” szótő a „sorozat” begépelésekor is előhozná a chipet. (4) A „róma” a Romantikus és az Ókori Róma chipet is hozza (közös „roma” előtag). (5) A rövid „kém” (3 betű) továbbra sem illeszkedik a Kémfilmek-re (a meglévő szótövek 5+ betűsek). (6) Első oldal (20 találat) kategóriánként, mint eddig.
**Commit:** `feat: keresés 34 új kategóriával` (D-048)

## 2026-10-18 – Fiók és szinkron kikapcsolása a v1-ben (config)

**Mit:** A felhasználó döntése: auth nem kell a v1-ben, a regisztrációt zárja, a családi összekötés később. Új `constants/features.ts` (`accountEnabled = false`): a Beállítások „Fiók” szekciója rejtett, az auth-figyelő nem indul. A kód megmaradt. A CLAUDE.md Autentikáció szakasza jelzi a kikapcsolást. A „Fiók törlése” sor tárgytalan (nincs fiók-létrehozás), az „Éles bekapcsolás” elhalasztva. D-055.
**Fájlok:** constants/features.ts, app/settings.tsx, app/_layout.tsx, CLAUDE.md, docs/feature-tasks.md
**Tesztelve:** `npm run lint`, `npm run typecheck`. Képernyőn nem néztem (a Beállítások most Szolgáltatóim, Régió és nyelv, Gyerek sarok, Névjegy; iPaden a jobb oszlopban csak a Névjegy).
**Nyitva maradt:** (1) **A Supabase regisztráció zárása a dashboardon (Authentication → Sign In / Providers → „Allow new users to sign up” ki) a te lépésed**, az Auth beállításokhoz kifejezett kérés nélkül nem nyúlok (D-051). Amíg nyitva van, az anon kulccsal bárki regisztrálhat a közös projektben. (2) Az `app/account.tsx` route kódban megvan, de nincs belépési pont. (3) A `useAccountSync` és a store-ok futnak, de felhasználó nélkül nem csinálnak semmit. (4) Az `mms.user_data` tábla az éles adatbázisban megmaradt (üres, `mms` alatt).
**Commit:** `config: fiók és szinkron kikapcsolása a v1-ben` (D-055)

## 2026-10-18 – `mms-tmdb`: lejárt cache sorok törlése íráskor (fn)

**Mit:** A függvény minden cache-írás (tévesztés) után törli az `mms.tmdb_cache` lejárt sorait (`delete … where expires_at < now()`, az `expires_at` indexen). Az ok: a lejárt sorokat csak ugyanaz a kulcs írta felül, a keresés bármilyen szöveggel új kulcsot hoz; az éles tábla 453 sorából 166 lejárt (5,6 MB). A törlés hibája ugyanabban a `try`-ban a meglévő „cache write failed” naplóba megy, a válaszra nincs hatása.
**Fájlok:** supabase/functions/mms-tmdb/index.ts, docs/feature-tasks.md
**Tesztelve:** – **Nem futott**: a gépen nincs `deno`, a függvény a `typecheck`-be sem tartozik, **nincs deployolva**. A kód egy soros, a meglévő `sql` hívások mintájára.
**Nyitva maradt:** (1) **Deploy csak kérésre:** `supabase functions deploy mms-tmdb --project-ref eguhipjgnhbajbmnrskm` (a Claude Code jogosultság-ellenőrzője az éles deployt korábban letiltotta, ezért neked kell futtatnod). Addig az éles függvény a régit futtatja. (2) A már lejárt 166 sor a deploy után az első cache-íráskor törlődik, külön adatbázis-művelet nem kell. (3) Ha a párhuzamos kérések sok törlést okoznának, az ütemezett törlés (pg_cron) a másik út; ennél a forgalomnál nem indokolt.
**Commit:** `fn: mms-tmdb törli a lejárt cache sorokat`

## 2026-10-18 – Watchlist net nélkül (fix)

**Mit:** A Watchlist a visszatöltés után azonnal mutatja a helyi címeket, státusz nélkül; ha minden státusz-lekérés elbukik, a rács fölött egy hibasor + „Újra” áll a teljes képernyős hiba helyett. D-054.
**Fájlok:** hooks/useWatchlist.ts, app/(tabs)/watchlist.tsx, constants/strings.ts, docs/feature-tasks.md
**Tesztelve:** `npm run lint`, `npm run typecheck`. **Képernyőn / repülőgép-móddal nem próbáltam.**
**Nyitva maradt:** (1) Szöveg jóváhagyásra: „A státuszok most nem tölthetők be.” (2) A hibasor kinézete nincs a designban (a Beállítások hibasorának mintájára, tokenekkel). (3) A badge-ek a rács megjelenése után „beúsznak”, ahogy a válaszok érkeznek.
**Commit:** `fix: watchlist a helyi listát net nélkül is mutatja` (D-054)

## 2026-10-18 – Ship előtt: dev utilities eltávolítása (chore)

**Mit:** A felhasználó jóváhagyásával törölve a `components/DevResetButton.tsx` és a sora az `app/_layout.tsx`-ben (D-029 visszavonva, a fájl a git historyban megvan). Átnéztem a forrást `console.log`, `__DEV__`, mock / minta adat, TODO után: más fejlesztői maradvány nincs; a `console.error` hívások csak az Edge Function-ökben vannak (hiba-logok, kulcs nélkül), ezeket meghagytam.
**Fájlok:** app/_layout.tsx, components/DevResetButton.tsx (törölve), docs/feature-tasks.md
**Tesztelve:** `npm run lint`, `npm run typecheck`: hibamentes (a „Lint + typecheck” sor ezzel pipálva).
**Nyitva maradt:** Fejlesztés közben az onboarding újrapróbálásához a Beállítások → Szolgáltatók szerkesztése vagy az app újratelepítése marad.
**Commit:** `chore: dev reset gomb eltávolítása`

## 2026-10-18 – Ship előtt: edge case-ek 2/2, átvizsgálás és keresőmező hosszkorlát (fix)

**Mit:** Kódszintű átvizsgálás a megadott öt esetre (app/, hooks/, a listakomponensek). **Már jól kezelt:** (1) *Üres szolgáltatólista:* a Főoldal „nincs szolgáltató” üzenetet, a Böngészés ugyanazt mutatja, az onboarding Tovább gombja letiltott 0 választásnál, a Kihagyom működik; a szolgáltatólista hibája / üressége külön hiba + „Újra” állapot. (2) *Nincs találat:* minden lista (rail, rács, Keresés, Watchlist szűrő) `EmptyState`-et mutat; részleges hibánál (egy szolgáltató / típus elbukik) a többi eredmény megmarad (`allSettled`). (3) *Hosszú cím:* a kártyák, találati sorok, hero és a cím `numberOfLines`-szal csonkolnak, a hosszabb szövegek (leírás, szolgáltatónevek, adatok) törnek. (4) *Nincs net:* minden adatlekérő hook hiba állapotot + „Újra” gombot ad, a kijelentkezett működés AsyncStorage-ból megy. (5) *Lassú net:* lásd az előző bejegyzés (D-053). **Javítva itt:** a Keresőmező `maxLength` 100 (az Edge Function a 300 karakternél hosszabb paramétert 400-zal elutasítja, ami „Hiba” állapotot adott volna találat helyett).
**Fájlok:** components/SearchField.tsx, docs/feature-tasks.md
**Tesztelve:** `npm run lint`, `npm run typecheck`. Az átvizsgálás kód olvasás, **eszközön / szimulátoron repülőgép-móddal nem próbáltam**.
**Nyitva maradt:** (1) **Watchlist net nélkül:** a lista a státuszokhoz címenként kér adatot, és amíg az első válasz nem érkezik, skeleton, ha mind elbukik, hiba áll a saját (helyi) lista helyett; a felhasználó offline nem látja a mentett címeit. Javítás (a lista mutatása státusz nélkül) UI-változás, jóváhagyásra. (2) **`mms.tmdb_cache` nem takarít:** a lejárt sorokat csak ugyanaz a kulcs írja felül; a 453 sorból 166 lejárt (5,6 MB), és a keresés bármilyen szövege új sort hoz. Lejárt sorok törlése az Edge Functionben vagy ütemezett törlés kell; mindkettő éles változtatás, csak kérésre. (3) Az onboarding „Tovább N szolgáltatóval” számlálója beleszámolja a már nem létező, mentett azonosítókat (szerkesztéskor, ha a TMDB listából kikerült egy szolgáltató): ritka, nem javítottam. (4) A Supabase Auth hívásokon nincs saját időkorlát (D-053).
**Commit:** `fix: keresőmező hosszkorlát`

## 2026-10-18 – Ship előtt: edge case-ek 1/2, függvényhívások időkorlátja (fix)

**Mit:** Az edge case-ek átvizsgálása során (lásd a következő bejegyzést a teljes listáért) kiderült, hogy a függvényhívásoknak nincs időkorlátja: lassú neten a skeleton a 60 mp-es iOS-alapértelmezésig áll. Az `mms-tmdb` és `mms-sync` hívások most 20 mp után hibával térnek vissza (hiba + „Újra”). D-053.
**Fájlok:** lib/api.ts, lib/syncApi.ts, docs/feature-tasks.md
**Tesztelve:** `npm run lint`, `npm run typecheck`; a `timeout` opció helyi, soha nem válaszoló szerverrel (Node, supabase-js): 1,5 mp-es korláttal 1508 ms után `FunctionsFetchError`. Eszközön, valódi lassú hálózaton nem próbáltam.
**Nyitva maradt:** a Supabase Auth hívásokon (belépés) nincs saját korlát (D-053).
**Commit:** `fix: időkorlát a függvényhívásokon` (D-053)

## 2026-10-16 – Ship előtt: familyBudget érintetlenségének ellenőrzése (docs)

**Mit:** Read-only lekérdezések a familyBudget Supabase projekten (`eguhipjgnhbajbmnrskm`, MCP `list_migrations`, `list_edge_functions`, `execute_sql` csak `select`). (1) **Migrációk:** 32 db, ebből az mms-é pontosan kettő (`mms_schema_and_tmdb_cache`, `mms_user_data`); az összes többi a familyBudget / mybillingo / breathing korábbi, nem általam írt migrációja, az mms előtti dátummal. (2) **Függvények:** az `mms-tmdb` az egyetlen mms függvény, a többi (ocr-receipt, wallet-*, send-e-receipt) verziója és dátuma korábbi. **Az `mms-sync` NINCS deployolva** (nem szerepel a listán). (3) **Sémák:** `mms` 2 tábla, mindkettő RLS be; `public` 35 tábla, mind RLS be. (4) **Policy-k a D-051 kockázathoz:** a `public` összes policy-ja felhasználóhoz kötött (`qual` nem nyitott; az INSERT-ek üres `qual`-ja a `with check` miatt normális), egyetlen kivétellel: `investment_price_history` `SELECT` az `authenticated` szerepkörnek, feltétel nélkül. Egy mms-regisztrált felhasználó így olvashatja a befektetési árfolyam-előzményeket (közös piaci adat, felhasználói azonosító nélkül, de a familyBudget adata).
**Fájlok:** docs/feature-tasks.md
**Tesztelve:** csak olvasás, semmit nem módosítottam. Nem vizsgáltam a policy-k kifejezéseit soronként (csak hogy nyitottak-e), a `storage` policy-kat és az RPC / függvény jogosultságokat.
**Nyitva maradt:** (1) **Döntés kell:** a `investment_price_history` olvashatóság elfogadható-e, vagy a regisztrációt zárni kell / a policy-t a familyBudget oldalon szűkíteni (az utóbbit csak te kérheted, a familyBudget objektumaihoz nem nyúlok). (2) `mms-sync` deploy továbbra is vár. (3) A `storage` policy-k és a függvényjogosultságok átnézése, ha a regisztráció nyilvános marad.
**Commit:** `docs: familyBudget érintetlenségének ellenőrzése`

## 2026-10-16 – Ship előtt: secrets ellenőrzése (docs)

**Mit:** Read-only átvizsgálás. (1) Git: csak a `.env.example` követett (üres értékek), a `.env` soha nem került a historyba; a követett fájlokban és a teljes historyban nincs JWT-szerű token, `sb_secret_` kulcs, 32 hexa kulcs; a `service_role` / `TMDB_API_KEY` csak a migrációk és az `mms-tmdb` kommentjeiben / `Deno.env.get`-ben szerepel. (2) Kliens bundle (`expo export --platform ios`, Hermes bytecode): `service_role`, `TMDB_API_KEY`, `api.themoviedb.org`, `api_key=` 0 találat (a TMDB-t a kliens sosem éri el közvetlenül); az egyetlen JWT a bundle-ben `role = anon` (várt, EXPO_PUBLIC). A két gyanús minta ártalmatlan: az `sb_secret_` a supabase-js saját szövegtáblájából való (szomszédos sztringekkel egybe olvasva), a 32 hexás egy React Native belső konstans.
**Fájlok:** docs/feature-tasks.md
**Tesztelve:** git grep + `git log -G` a teljes historyn; bundle `grep -a`; a JWT-ből csak a `role` claimet dekódoltam, a kulcsot nem írtam ki. Az export a scratchpadbe ment, a projektbe nem.
**Nyitva maradt:** A TMDB kulcs értékét nem ismerem (Supabase secret), ezért a bundle-ben mintára (api_key=, themoviedb host, 32 hexa) kerestem, nem az értékére.
**Commit:** `docs: secrets ellenőrzés kliens bundle-ben és historyban`

## 2026-10-16 – Élesítés 1/2: `mms.user_data` migráció alkalmazva (db)

**Mit:** A felhasználó kérésére (`mehet`) alkalmaztam a `202610161000_mms_user_data.sql` tartalmát a familyBudget Supabase projekten (`eguhipjgnhbajbmnrskm`, MCP `apply_migration`, név: `mms_user_data`). Előtte read-only ellenőriztem: az `mms` sémában csak a `tmdb_cache` volt, az `mms.user_data` nem létezett.
**Fájlok:** docs/feature-tasks.md
**Tesztelve:** Utólag lekérdezve: az `mms` sémában `tmdb_cache` és `user_data`, mindkettőn RLS be, policy 0, `anon` és `authenticated` nem olvashat, `service_role` igen. Más séma / tábla nem változott.
**Nyitva maradt:** (1) **Az `mms-sync` deploy NINCS meg:** a `supabase functions deploy mms-sync --project-ref eguhipjgnhbajbmnrskm` parancsot a Claude Code jogosultság-ellenőrzője production deployként letiltotta; a felhasználónak kell futtatnia (vagy engedélyszabályt adnia). Deploy nélkül az app szinkronja „Nem sikerült, újra” állapotba kerül. (2) Auth beállítások a dashboardon (e-mail megerősítés), a familyBudget RLS policy-k read-only átnézése a regisztráció megnyitása előtt (D-051), kétkészülékes próba.
**Commit:** `docs: user_data migráció alkalmazva, mms-sync deploy vár`

## 2026-10-16 – Szinkron: letöltés, egyesítés, feltöltés (feature)

**Mit:** Bejelentkezve a watchlist, a szolgáltatók (+ `onboardingDone`), a korhatár és a `hideMature` egy dokumentumként szinkronizálódik. `lib/syncApi.ts`: `fetchUserData` / `saveUserData` az `mms-sync`-re. `lib/sync.ts`: `startSync(userId)` azonnal letölt, a store-ok módosítása után 1,5 mp késleltetéssel feltölt, az app előtérbe kerülésekor letölt; a műveletek sorban futnak. Szabályok: ha az eszközön még nem volt fiók, a watchlist egyesül (típus + azonosító szerint), a többi a szerveré; ha másik fiók adata volt az eszközön, a szerver felülír (nincs szerver adat → üres lap), így a fiókok adata nem keveredik; ugyanaz a fiók: el nem küldött helyi változásnál (`dirty`) a helyi nyer, egyébként a szerver. `useSyncStore` (`status`, `dirty`, `lastUserId`; a `dirty` és a `lastUserId` perzisztált). `useAccountSync` hook a gyökér layoutban megvárja az összes érintett store visszatöltését. A Fiók képernyőn „Szinkron” sor (Naprakész / Folyamatban… / Nem sikerült, újra; hibánál koppintásra újrapróbál).
**Fájlok:** lib/{sync,syncApi}.ts, store/useSyncStore.ts, hooks/useAccountSync.ts, components/AccountCard.tsx, app/_layout.tsx, constants/strings.ts, docs/feature-tasks.md
**Tesztelve:** `npm run lint`, `npm run typecheck`, `expo export --platform ios` (lefordul); az egyesítés (`mergeWatchlists`) Node-dal: ismétlődő cím egyszer, legújabb elöl. **A szinkron végig NEM futott**: a migráció nincs alkalmazva és az `mms-sync` nincs deployolva, így nincs mivel beszélnie; a letöltés / feltöltés / konfliktus-ágak csak kód szinten ellenőrzöttek.
**Nyitva maradt:** (1) **Élesítés** (utolsó sor a listán): migráció, deploy, Auth beállítások, kétkészülékes próba. (2) Az el nem küldött helyi változás elvész, ha kijelentkezés után másik fiókkal lépnek be az eszközön (a másik fiók adata felülír). (3) Utolsó írás nyer: két eszköz egyidejű módosításánál az egyik elveszhet, D-051. (4) A watchlist státuszai (`useWatchlist`) a szinkron után az új elemekre a következő megjelenítéskor kérnek adatot (a meglévő viselkedés). (5) A Szinkron sor hibánál nem mondja meg az okát (pl. nincs net vs. nincs deploy); a konzolban sincs napló.
**Commit:** `feat: fiók szinkron watchlist, szolgáltatók és beállítások`

## 2026-10-16 – Fiók képernyő és „Fiók” szekció a Beállításokban (feature)

**Mit:** Új route `app/account.tsx` (gyökér `Stack`): fiók nélkül `AuthForm` (Belépés / Regisztráció szegmens, e-mail + jelszó mező a Beállítások kártya-stílusában, hibaüzenet pirosan, narancs CTA töltésjelzővel, jelszókezelő-barát `textContentType` / `autoComplete`), bejelentkezve `AccountCard` (e-mail, Kijelentkezés). Regisztráció e-mail megerősítéssel: tájékoztató üzenet és vissza a Belépésre. A Beállításokban új „Fiók” szekció (telefonon a Gyerek sarok és a Névjegy között, iPaden a jobb oszlop teteje): fiók nélkül „Bejelentkezés” + magyarázó lábjegyzet, bejelentkezve „E-mail” + a cím. `SettingsBackLink` kapott `label` paramétert (alapérték: Főoldal), `SettingsRow` kapott `danger` változatot, és a hosszú érték (e-mail) csonkul.
**Fájlok:** app/{account,settings,_layout}.tsx, components/{AuthForm,AccountCard,SettingsRow,SettingsBackLink}.tsx, constants/{strings,theme}.ts, docs/feature-tasks.md
**Tesztelve:** `npm run lint`, `npm run typecheck`, `expo export --platform ios` (lefordul). **Képernyőn és eszközön NEM nézve** (se szimulátor, se web), és a bejelentkezés élesben sem futott (Auth beállítások és migráció hiányában): a kinézet, a billentyűzet viselkedése (`automaticallyAdjustKeyboardInsets`), a jelszókezelő felajánlása eszközön ellenőrizendő.
**Nyitva maradt:** (1) **Nincs design** a képernyőhöz, jóváhagyásra (D-052). (2) Az iPad kinézete nincs mérve; az űrlap 520 px széles, középre igazított. (3) Szövegek jóváhagyásra (az `account` blokk a `strings.ts`-ben). (4) Nincs „elfelejtett jelszó” és jelszócsere (a levélsablon a familyBudgettel közös, D-051). (5) A szinkron a következő sor; addig a bejelentkezés nem csinál mást, mint azonosít.
**Commit:** `feat: bejelentkezés képernyő és fiók a beállításokban` (D-052)

## 2026-10-16 – Kliens: tartós munkamenet, `useAuthStore`, `lib/auth.ts` (feature)

**Mit:** A `lib/supabase.ts` a munkamenetet AsyncStorage-ban tárolja (`mms-auth` kulcs, automatikus tokenfrissítés, a háttérben leállítva `AppState`-tel). Új `lib/auth.ts`: `startAuthListener` (mentett munkamenet betöltése + változáskövetés), `signIn`, `signUp`, `signOut`; a Supabase hibakódjai magyar szövegre képezve (`strings.account.errors`), hálózati hiba külön üzenettel; már regisztrált címnél (e-mail megerősítésnél üres `identities`) „már van fiók” hiba. Új `store/useAuthStore.ts` (`user`, `hasHydrated`, nem perzisztált: a munkamenetet a supabase-js tárolja). A gyökér layout elindítja a figyelőt, de nem várja meg: az app fiók nélkül is azonnal indul. Új szín token: `danger` (#FF453A, hibaszöveghez).
**Fájlok:** lib/supabase.ts, lib/auth.ts, store/useAuthStore.ts, app/_layout.tsx, constants/{strings.ts,theme.json}, docs/feature-tasks.md
**Tesztelve:** `npm run lint`, `npm run typecheck`. A tényleges bejelentkezés még nem futott: ehhez az élesítési lépés kell (Auth beállítások a dashboardon), és a képernyő a következő sor.
**Nyitva maradt:** (1) A `danger` szín nincs a designban (a design nem mutat hibaszöveget), az iOS rendszerpiros. (2) Kijelentkezéskor a helyi adat az eszközön marad (lásd a következő sor döntése). (3) Eszközön ellenőrizendő: az `AppState` alapú tokenfrissítés és a munkamenet megmaradása újraindítás után.
**Commit:** `feat: tartós munkamenet és auth store`

## 2026-10-16 – Edge Function: `mms-sync` (fn)

**Mit:** Új függvény: `POST { action: 'get' }` a felhasználó dokumentumát adja (vagy `null`), `POST { action: 'put', data }` elmenti. A felhasználót a JWT-ből azonosítja (`auth.getUser`), az anon kulcs mint token 401-et kap; a kliens azonosítót nem fogad el. A `put` a dokumentumot mezőnként ellenőrzi és csak az ismert mezőket menti (`v: 1`, szolgáltatók ≤ 100, watchlist ≤ 500, korhatár 0/6/12), a törzs ≤ 200 KB. Az `mms-tmdb` nem változott.
**Fájlok:** supabase/functions/mms-sync/index.ts, docs/feature-tasks.md
**Tesztelve:** – Nem futott: a gépen nincs `deno`, és a függvény a `supabase/functions` kizárása miatt a `typecheck`-be sem tartozik; a migráció sincs alkalmazva, a függvény nincs deployolva. Az első valós próba az élesítési lépésben lesz.
**Nyitva maradt:** deploy (`supabase functions deploy mms-sync`) és a migráció alkalmazása csak a felhasználó kérésére. A `SUPABASE_ANON_KEY` környezeti változót a platform adja a függvénynek; ha az új publishable kulcsokkal nem érhető el, a deploykor derül ki.
**Commit:** `fn: mms-sync Edge Function a fiók szinkronhoz`

## 2026-10-16 – Migráció: `mms.user_data` (db)

**Mit:** `mms.user_data (user_id uuid pk → auth.users on delete cascade, data jsonb, updated_at)`. RLS be, policy nincs, jogok elvéve `public/anon/authenticated`-től, `service_role`-nak megadva (mint a `tmdb_cache`). Csak `if not exists`, nincs drop.
**Fájlok:** supabase/migrations/202610161000_mms_user_data.sql, docs/feature-tasks.md
**Tesztelve:** – A migráció **nincs alkalmazva** az éles (familyBudget) adatbázison, csak a fájl készült el; az alkalmazás a felhasználó kifejezett kérésére történik.
**Nyitva maradt:** alkalmazás (utolsó sor a „Fiók és szinkron” listán). Az `auth.users`-re mutató külső kulcs miatt a felhasználó törlése (az Auth-ban) törli az mms adatát is.
**Commit:** `db: mms.user_data tábla a fiók szinkronhoz`

## 2026-10-16 – Fiók és szinkron: döntés és dokumentáció (docs)

**Mit:** A felhasználó kérésére bejön az authentikáció. Egyeztetett döntések: cél = szinkron a családtagok / eszközök között, mód = Supabase Auth e-mail + jelszó, a user-pool közös a familyBudgettel (az mms csak a saját `mms` táblát használja), a bejelentkezés opcionális (Beállítások). Felülírja a D-002-t. A CLAUDE.md auth szakaszai, store-listája és a feladatlista („Fiók és szinkron”) frissítve.
**Fájlok:** CLAUDE.md, docs/feature-tasks.md
**Tesztelve:** – (dokumentáció)
**Nyitva maradt:** lásd D-051 „Ismert kockázat”: a közös user-pool miatt a nyilvános regisztráció a familyBudget projektben is `authenticated` felhasználót hoz létre; élesítés előtt a familyBudget RLS policy-jait át kell nézni.
**Commit:** `docs: fiók és szinkron döntése (D-051)`

## 2026-10-15 – iPad finomhangolás: címméretek, álló iPad oszlopok és fejlécek (feature)

**Mit:** A 11–16 iPad design PNG-ket a webes előnézettel (fekvő 1244 és álló 834 px) pixelre összevetve. (1) **Címek:** a designban az iPad címek nagyobbak, mint a telefonon (Böngészés, Keresés, Watchlist, Beállítások ~1,17×, azaz 40 pt; Gyerek sarok ~1,24×, azaz 47 pt); új `ScreenTitle` komponens (telefonon 34, iPaden 40 pt, a kalibrált fejléc-sormagassággal és 2,5 px-es lejjebb tolással), új tokenek `fontSize.titleTablet` (40), `fontSize.kidsTitleTablet` (47). A betűk magassága a designhoz ±0,5 px, a függőleges helyük ±0,5 px (Gyerek sarok: 0 px). A Beállítások iPad cím és az első szekció közti köz ehhez igazítva. (2) **Álló iPad:** új `isWideContent` / `TABLET_WIDE_CONTENT_MIN` (860 px az oldalsáv melletti területen). Szűk (álló) iPaden a poszter rács 4 oszlop (Gyerek sarok: 3), a Böngészés találatszám + rendezés és a Watchlist szegmens-vezérlő a cím alatti sorba kerül (mint telefonon), mert a 40 pt-os cím mellett nem fér el. Fekvő iPaden (11": 924 px) és szélesebben a design elrendezése változatlan. (3) **Adatlap Lemezen kártya:** keskeny oszlopban a „Emlékeztess” gomb a szöveg alá törik (a „Blu-ray” szó nem törik két sorba).
**Fájlok:** components/{ScreenTitle,PosterGrid,DiscCard}.tsx, app/(tabs)/{browse,kids,search,watchlist}.tsx, app/settings.tsx, constants/{theme.json,theme.ts}, docs/feature-tasks.md
**Tesztelve:** `npm run lint`, `npm run typecheck`. Weben (headless Chrome CDP-vel, valós TMDB-adat, `web.output` átmenetileg `single`, visszaállítva, nem commitolva) iPad fekvő (1244) és álló (834) szélességben a Főoldal, Böngészés, Gyerek sarok, Keresés, Watchlist, Adatlap, Beállítások: a címek mérete és helye a designhoz mérve (fenti számok); a Gyerek sarok rács (kártya x/y ±1–2 px), a Böngészés / Watchlist / Gyerek álló nézete képernyőn nézve. A web NEM mutatta: az SF Symbols ikonokat (oldalsáv), az iOS-es betűmetrikát (a webes rendszerfont szélesebb), valós iPad-et / szimulátort (a 1194 × 834 és 1024 × 1366 méret nincs külön nézve; a küszöb számítással: 11" fekvő 924 px, 12,9" álló 754 px).
**Nyitva maradt:** (1) **A Böngészés design iPad szolgáltató- és műfaj-sora hibás** (a PNG-n összenyomott / levágott, lásd a Böngészés bejegyzését), ezért az iPaden a telefon méreteit használja; változatlan. (2) A Főoldal, Keresés és Watchlist fekvő iPad elrendezését az előző feladatok már mérték, itt a címeken kívül nem változott. (3) **Nincs oldalsáv az Adatlapon és a Beállításokon** (D-038, D-049). (4) A 860 px-es küszöb becslés (cél: kártya ≥ ~120 px): ha eszközön más oszlopszám tetszik, egy szám a `constants/theme.ts`-ben. (5) A Gyerek sarok iPad címe a designban lekerekített betűtípus (a többi képernyő SF-szerű, D-027); itt is a rendszerfont, csak a méret követi a designt. (6) Az `isTablet` számítás továbbra is sok helyen ismétlődik (`useIsTablet` hook külön `chore:` commitban).
**Commit:** `feat: ipad finomhangolás címméretek és álló elrendezés` (D-050)

## 2026-10-15 – Beállítások: Szolgáltatóim, Régió és nyelv, Gyerek sarok, Névjegy (feature)

**Mit:** A 08 és 16 design PNG-ből mért méretekkel (Pillow, csak a scratchpadben). `app/settings.tsx`: „‹ Főoldal” link, „Beállítások” cím (telefonon 34, iPaden 40 pt, mint a designban), szekciók nagybetűs felirattal és lekerekített kártyával. (1) **Szolgáltatóim:** a kiválasztott szolgáltatók logói és nevei (`useMyProviders`), „Szolgáltatók szerkesztése” → az onboarding (1. lépés a mentett választással), lábjegyzet; állapotok: skeleton, hiba + „Újra”, „Nincs kiválasztott előfizetés.”. (2) **Régió és nyelv:** Régió (Magyarország), Alkalmazás nyelve (Magyar), nyíl nélküli sorok; az „Árak” sor kimarad (D-012). (3) **Gyerek sarok:** Korhatár (a közös `kidsAgeLimit`, koppintásra rendszer-választólap 0+ / 6+ / 12+), Felnőtt tartalom elrejtése kapcsoló (`hideMature`). (4) **Névjegy:** verzió (`expo-constants`), TMDB logó + szöveg, JustWatch szöveg. A Notifications szekció rejtett (D-013). iPaden két oszlop (bal: Szolgáltatóim, Régió és nyelv, Gyerek sarok; jobb: Névjegy), a tartalom legfeljebb 974 px széles és középre igazított. A `hideMature` bekötve: kikapcsolva a Gyerek sarok és a Főoldal „Gyerekeknek” railje korhatár-szűrés nélkül kér (`kidsDiscoverParams(null)`), a „Felnőtt tartalom elrejtve” badge és a korhatár-chipek eltűnnek. Az onboarding lezárása szerkesztéskor `dismissTo('/')`. Új: `SettingsSection`, `SettingsRow` (+ `SettingsSeparator`), `MyServicesCard`, `AboutCard`, `TmdbLogo`, `SettingsBackLink`; tokenek `settingsLayout`, `fontSize.titleTablet`, színek (`settingsBlue/Purple/Teal/Green`, `chevron`); `useSettingsStore.hideMature`. A már használaton kívüli `ScreenPlaceholder` törölve.
**Fájlok:** app/settings.tsx, app/onboarding.tsx, app/(tabs)/kids.tsx, components/{SettingsSection,SettingsRow,MyServicesCard,AboutCard,TmdbLogo,SettingsBackLink}.tsx, components/ScreenPlaceholder.tsx (törölve), hooks/{useKidsTitles,useKidsPicks}.ts, lib/kidsDiscover.ts, store/useSettingsStore.ts, constants/{theme.json,theme.ts,strings.ts}, docs/feature-tasks.md
**Tesztelve:** `npm run lint`, `npm run typecheck`. Weben (headless Chrome CDP-vel, valós TMDB-adat, `web.output` átmenetileg `single`, visszaállítva, nem commitolva; saját előnézet a 8099-es porton) telefon (407), iPad fekvő (1244) és álló (834) szélességben: a címkék, sorok és kártyák függőleges helye a designhoz ±1–2 px (a webes safe area-hiány, telefon 59 / iPad 16 px, valamint az „Árak” sor és az Értesítések blokk hiányának levonásával), iPaden az oszlopok 429 px szélesek, 30 px közzel (design 430 / 429, 30). Gyerek sarok kikapcsolt `hideMature` mellett: nincs badge. A web NEM mutatta: az SF Symbols ikonokat (a színes négyzetek üresek, a nyilak, a „‹” a linken), az `ActionSheetIOS` választólapot, a natív kapcsoló kinézetét, az `active:` lenyomás-hatást, az onboarding `dismissTo('/')` visszalépést a Beállításokból, az iOS-es betűmetrikát (a webes rendszerfont szélesebb, ezért a Névjegy szöveg itt több sorba törik).
**Nyitva maradt:** (1) **A `tmdb-logo.png` két logót tartalmaz** (TMDB + Mymoviescanner, 1254 × 1254, sötét háttéren); a `TmdbLogo` csak a TMDB jelet vágja ki belőle (a kép átalakítása nélkül), sötét lemezként látszik a kártyán. Ha tiszta, hivatalos TMDB logót adsz (themoviedb.org/about/logos-attribution), a `TmdbLogo` egyszerűsödik. (2) **Nincs oldalsáv / tab bar a Beállításokon** (a design mutatja): gyökér-route, mint az Adatlap, D-038 / D-049; ezért iPaden is van „‹ Főoldal” link a cím feletti üres sávban. (3) **A „Szolgáltatók szerkesztése” a teljes onboardingot nyitja** (1. lépés szolgáltatók, 2. lépés korhatár); ha külön, rövid szerkesztő kell, külön feladat. (4) **Szövegek jóváhagyásra:** „Az újdonságok és a Főoldal ajánlója csak a szolgáltatóidon elérhető címeket mutatja.”, „Magyarország”, „Magyar”, a Névjegy TMDB / JustWatch mondatai (a design „és az árak” része D-012 miatt kimaradt). (5) A Régió és Nyelv sorokon nincs nyíl (nincs mit választani, D-049). (6) Kikapcsolt „Felnőtt tartalom elrejtése” mellett a Beállítások „Korhatár” sora látszik, de nincs hatása. (7) **Meglévő eltérés, nem ennek a feladatnak a része:** a Watchlist, Böngészés és Keresés iPad címe a designban ~1,17× nagyobb (kb. 40 pt), a kódban mindenhol `text-title` (34); az „iPad finomhangolás” feladatnál javítandó. (8) Az `isTablet` számítás már a 9. helyen ismétlődik (`useIsTablet` hook külön `chore:` commitban jöhet).
**Commit:** `feat: beállítások képernyő` (D-049)

## 2026-10-15 – Keresés: kategóriák (katasztrófa, cápa, …) (feature)

**Mit:** A felhasználó kérésére a Keresés kategóriára is keres. A begépelt szavak (ékezet- és kisbetű-függetlenül, szótő-illesztéssel: „cápás”, „katasztrófa film”) a kurált szótárra illeszkednek; az illeszkedő kategóriák chipként jelennek meg a mező alatt (iPaden a jobb oszlopban a fejléc alatt). A chip koppintására a szöveges keresés helyett `discover` találatok jönnek (film és/vagy sorozat a Filmek / Sorozatok szűrő szerint, népszerűség szerint egyesítve, `vote_count.gte=30`), ugyanabban a sorformában, a „Találatok: „Cápás filmek”” fejléccel; újra koppintva kikapcsol, a szöveg módosítása is kikapcsolja. 23 kategória: katasztrófa, cápa, zombi, szuperhős, világűr, dinoszaurusz, vámpír, időutazás, kém, rablás, szörny, autóverseny, karácsony, tengeralattjáró, varázslat, idegenek, posztapokalipszis, állatok, sport (TMDB kulcsszavak), horror, krimi, háborús, western (műfajok). Új: `data/searchCategories.ts`, `lib/searchCategories.ts` (`matchCategories`, `categoryParams`), `SearchCategoryChips`, a `useSearch` kategória-ága, magyar szövegek. Az Edge Function nem változott.
**Fájlok:** data/searchCategories.ts, lib/searchCategories.ts, components/SearchCategoryChips.tsx, hooks/useSearch.ts, app/(tabs)/search.tsx, constants/strings.ts, docs/feature-tasks.md
**Tesztelve:** `npm run lint`, `npm run typecheck`. Az éles függvényen mind a 23 kategória `discover` lekérdezése 200, találatokkal (a kulcsszó-azonosítókat mintafilmek `keywords` listájából ellenőriztem); a cápa kulcsszó-készletét élő adaton szűkítettem (a „shark” kulcsszó rajzfilmeket is hozott, a „shark attack”, „killer shark”, „great white shark”, „megalodon” a Cápa, Meg, 47 méter mélyen típusú filmeket adja). Weben (headless Chrome, valós adat, `web.output` átmenetileg `single`, visszaállítva, nem commitolva) telefonon és iPad fekvőben: „katasztrófa film” → chip, kiválasztva Légikatasztrófák, A siló, Titanic…; „cápás” → Haragos természet, Meg 2., A cápa…; a chip-sor, a fejléc és a sorok a megszokott méretekkel. A web NEM mutatta: az iOS-es `String.prototype.normalize` viselkedését a Hermesben (ha nem érhető el, a kategória-illesztés hibázna), a koppintás tényleges működését eszközön.
**Nyitva maradt:** (1) **Kurált lista:** csak a felsorolt kategóriák érhetők el; új kategória egy sor a `data/searchCategories.ts`-ben (magyar szótő + TMDB kulcsszó / műfaj azonosító + felirat a `strings.search.categories`-ben). (2) A találatok minősége a TMDB felhasználói kulcsszavaitól függ: pl. a Világűr listában a Bosszúállók, a Katasztrófa sorozatai között a Tokyo Ghoul is feltűnik. (3) A kategória nem szűr a saját szolgáltatókra (a szöveges kereséshez hasonlóan); a sorok jelzik, ha nézhető a szolgáltatódon. (4) A Horror csak filmre szűr (a TMDB sorozat-műfajai között nincs), sorozat szűrőnél üres. (5) Ha a szöveges keresésre nincs találat, de van illeszkedő kategória, a lista „Nincs találat.”-ot mutat a chip alatt; nem választja ki magától a kategóriát. (6) Első oldal (20 találat) kategóriánként. (7) A Személyek szűrőnél nincs kategória. (8) **Szövegek jóváhagyásra:** a 23 kategória felirata és a súgó („Keress filmet, sorozatot, személyt vagy kategóriát, pl. „cápa”.”).
**Commit:** `feat: keresés kategóriákra (katasztrófa, cápa, …)` (D-048)

## 2026-10-15 – Keresés: mező, Legutóbbi keresések, szűrők, találati sorok (feature)

**Mit:** Az 05 és 13 design PNG-ből mért méretekkel (Pillow, csak a scratchpadben). `app/(tabs)/search.tsx`: „Keresés” cím (34 pt), keresőmező nagyítóval, törlés-gombbal és „Mégse”-vel, Legutóbbi keresések, Mind / Filmek / Sorozatok / Személyek szűrő, találati sorok. Sor: poszter (telefon 67, iPad 79 px), cím + „A szolgáltatóidon” jelzés, év · típus · műfaj, Előfizetés / Kölcsönzés / Vásárlás chipek a szolgáltató logójával (módonként egy szolgáltató, előfizetésnél a saját előnyben), nyíl; koppintásra az Adatlap. A keresés 350 ms késleltetéssel indul, legalább 2 karaktertől, a szűrőnek megfelelő TMDB végponton (`search/multi|movie|tv|person`, első oldal); a műfaj és a chipek címenként egy `getDetails`-ből érkeznek, a sorok ezek előtt is látszanak (a chip helyén helykitöltő). Legutóbbi keresések: `useSearchStore` (max. 10, kis-nagybetűtől független duplázás nélkül, AsyncStorage); mentés a billentyűzet „Keresés” gombjával és találat koppintásakor. Telefonon vízszintes chip-sor a margóig vágva, iPaden (az oldalsáv nélküli szélesség ≥ 830 px) bal oszlop soronkénti törléssel, jobb oszlopban „Találatok: „…”” fejléc, szűrő és sorok; keskenyebb (álló) iPaden egy oszlop. Állapotok: súgó (nincs keresés), skeleton, hiba + újra, nincs találat. Új: `SearchField`, `RecentChips` / `RecentList`, `SearchFilterChips`, `SearchResultRow` (+ skeleton), `useSearch`, `lib/searchResults.ts` (`toSearchResults`, `pickSearchChips`, `isOnMyServices`), `pickRegionOffers` (a `pickOffers` közös magja), `data/searchFilters.ts`, `PersonSummary` / `SearchHit` típus, `SearchResult` / `SearchRow` app-típus, token `searchLayout`, magyar szövegek. Az Edge Function nem változott (a `search/*` és a `movie|tv/{id}` már a whitelisten volt).
**Fájlok:** app/(tabs)/search.tsx, components/{SearchField,RecentSearches,SearchFilterChips,SearchResultRow}.tsx, hooks/useSearch.ts, store/useSearchStore.ts, lib/{searchResults,titleInfo,api}.ts, data/searchFilters.ts, types/{app,tmdb}.ts, constants/{theme,strings}.ts, docs/feature-tasks.md
**Tesztelve:** `npm run lint`, `npm run typecheck`. Az éles függvényen curl-lel: `search/multi|movie|tv|person` 200, 20 találat oldalanként; a `profile_path` kulcs csak a személy-találatokon van (a `null` értékű is), ez különbözteti meg őket a címektől. Weben (headless Chrome CDP-vel, valós TMDB-adat, `web.output` átmenetileg `single`, visszaállítva, nem commitolva; a saját előnézet a 8099-es porton, a 8081-es nem lett érintve) telefon (407), iPad fekvő (1244) és álló (834) szélességben „harbor” keresésre: a mező, a Legutóbbi sor, a szűrő chipek és a sorok függőleges helye a designhoz ±0–1 px (a webes safe area-hiány levonásával; telefon 59 px, iPad 16 px), a chip-sor és a szűrő x helye, a sorköz (121–122 / 140 px), a poszter 67×101 és a bal lista elválasztói (iPad) egyeznek. Személyek szűrő („nolan”: profilképes sorok, szakma), nincs találat, hiba + „Újra” (hálózat kikapcsolva) és a súgó állapot képernyőn nézve. A web NEM mutatta: az SF Symbols ikonokat (nagyító, óra, ×, nyíl, törlés-gomb x-e), a billentyűzetet / a „Keresés” gombot, az `active:` lenyomás-hatást, a Legutóbbi chip / törlés / sor-koppintás tényleges működését eszközön (a szűrőváltás weben kattintással működött), a hosszú címek és az iOS-es betűmetrika hatását.
**Nyitva maradt:** (1) **Személy-sor:** a designban nincs; chip és nyíl nélküli, nem koppintható sor lett (D-046), mert a v1-ben nincs személy-oldal. Ha kell (pl. a személy címei), külön feladat. A „Mind” szűrő a személyeket is mutatja, a TMDB sorrendjében. (2) **Csak az első oldal** (20 találat) szűrőnként, nincs végtelen görgetés; a „legfontosabb 20” a TMDB relevancia-sorrendjében. (3) **Szövegek jóváhagyásra:** „A szolgáltatóidon” (a design „On your services”-e; a `strings.common.onYourServices` „Előfizetéseim” erre nem volt jó), „Legutóbbi” (iPad), „Találatok: „…””, „Még nincs keresés.”, „Keress filmet, sorozatot vagy személyt.”, a szakmák („Színész”, „Rendező”, „Író”, …). (4) **Magyar feliratok szélesebbek:** a három chip („Előfizetés”, „Kölcsönzés”, „Vásárlás”) telefonon két sorba törik; a szűrő chipek telefonon vízszintesen görgethetők; iPaden a „Találatok: „…”” fejléc és a szűrő chipek együtt kb. 600 px-t kérnek, a 589 px-es jobb oszlopban a szűrő a fejléc alá törik (a designban egy sor). (5) A hosszú cím + „A szolgáltatóidon” jelzés új sorba törik, ilyenkor a sor magasabb a posztornál (a designban nincs ilyen eset). (6) Címenként egy `getDetails` fut (az Edge Function 7 napra cache-eli): 20 találatnál 20 hívás; ha lassú, korlátozni kell a látható sorokra. (7) A „Mégse” törli a szöveget, a szűrőt „Mind”-re állítja és bezárja a billentyűzetet. (8) Az `isTablet` számítás a 8. helyen ismétlődik: `useIsTablet` hook külön `chore:` commitban jöhet. (9) A webes TextInput kék fókusz-keretet mutat; natívan nincs.
**Commit:** `feat: keresés mező, legutóbbi keresések, szűrők és találati sorok` (D-045, D-046, D-047)

## 2026-10-15 – Gyerek sarok: animációs sorozatok is (feature)

**Mit:** A felhasználó kérésére a Gyerek sarok a filmek mellett animációs sorozatokat is mutat. Oldalanként egy `discover/movie` (korhatár szerint, mint eddig) és egy `discover/tv` (`with_genres=16`, korhatár nélkül), népszerűség szerint egyesítve; a téma kulcsszó mindkettőre vonatkozik. A kártya a címtípus szerinti Adatlapra visz. Ha az egyik lekérdezés elbukik, a másik eredménye megmarad. Új: `kidsSeriesDiscoverParams`, `KidsTitle.type`.
**Fájlok:** hooks/useKidsTitles.ts, lib/kidsDiscover.ts, types/app.ts, app/(tabs)/kids.tsx, docs/feature-tasks.md
**Tesztelve:** `npm run lint`, `npm run typecheck`. Éles függvényen curl-lel: `discover/tv` animáció (16) mind a 6 témával 200, találatokkal. Weben (headless Chrome, valós adat, `web.output` átmenetileg `single`, visszaállítva, nem commitolva): oldalanként 40 kártya (20 film + 20 sorozat), a végtelen görgetés tovább tölt (40 → 80 → 120 → 160 → 200). Sorozat Adatlapra navigálás és a képernyőkép eszközön nem lett nézve.
**Nyitva maradt:** (1) **A sorozatok nincsenek korhatárra szűrve:** a 0+ / 6+ / 12+ chip csak a filmekre hat, és az animáció műfaj felnőtt sorozatot is tartalmaz: az alapnézet élén ma A Simpson család, Family Guy, Amerikai fater, Rick és Morty áll. A „Felnőtt tartalom elrejtve” jelzés így sorozatokra nem igaz. Szűkítés: `with_genres=16,10762` (animáció ÉS gyerek-műfaj) egy sor a `lib/kidsDiscover.ts`-ben; ezt kérésre átírom. (2) A téma-találatok sorozatnál is vegyesek (pl. Zene: Hazbin Hotel, Helluva Boss). (3) A film- és sorozatlista oldalanként 20-20, a sorrend csak oldalon belül népszerűség szerinti.
**Commit:** `feat: gyerek sarok animációs sorozatok` (D-044)

## 2026-10-15 – Gyerek sarok: korhatár chipek, téma chipek, Nagy kalandok rács (feature)

**Mit:** A 04 és 12 design PNG-ből mért méretekkel (Pillow, csak a scratchpadben). `app/(tabs)/kids.tsx`: „Gyerek sarok” cím (38 pt), zöld „Felnőtt tartalom elrejtve” badge, 0+ / 6+ / 12+ korhatár-chipek (a `useSettingsStore` közös `kidsAgeLimit`-je: a Főoldal „Gyerekeknek” rail és a Beállítások ugyanazt használja), téma chipek (Állatok, Világűr, Hercegnők, Dinoszauruszok, Zene, Sport; vízszintesen görgethető, a kijelölt világoskék, újra koppintva kikapcsol), „Nagy kalandok” szekció és alatta poszter rács (telefon 2, iPad 4 oszlop; 20 px sarkú kártya, alatta színes pötty + cím, a pötty színe körbeforog), koppintásra az Adatlap. Végtelen görgetés oldalanként (20 cím). Állapotok: skeleton, hiba + újra, üres találat. iPaden a korhatár-chipek a cím jobb oldalán, a badge fix 266 px, mint a designban. Új: `useKidsTitles` (egy `discover/movie` oldalanként, `with_keywords` a témára), `KidsTitleCard`, `KidsThemeChips`, `MatureHiddenBadge`, `data/kidsThemes.ts`, `KidsTitle` típus, tokenek `kidsLayout`, `radius.kidsCard`, `fontSize.kidsTitle`, magyar szövegek. A `PosterGrid` kapott `kids` paramétert (oszlopszám, margó, köz, skeleton). Az eddig használaton kívüli `strings.kids.ageChips` törölve (az `AgeChip` `{limit}+`-t ír).
**Fájlok:** app/(tabs)/kids.tsx, components/{KidsTitleCard,KidsThemeChips,MatureHiddenBadge,PosterGrid}.tsx, hooks/useKidsTitles.ts, data/kidsThemes.ts, types/app.ts, constants/{theme.json,theme.ts,strings.ts}, docs/feature-tasks.md
**Tesztelve:** `npm run lint`, `npm run typecheck`. Az éles függvényen curl-lel: mind a 6 téma × 3 korhatár 200, találatokkal (a legkevesebb: Világűr 0+ 4 cím); a kulcsszó-azonosítókat mintafilmek `keywords` listájából ellenőriztem. Weben (headless Chrome CDP-vel, valós TMDB-adat, `web.output` átmenetileg `single`, visszaállítva, nem commitolva) telefon (407), iPad fekvő (1244) és álló (834) szélességben: cím, badge, chipek, szekciócím, kártyák x / y helye a designhoz ±1–2 px (a webes safe area-hiány levonásával; telefon 59 px, iPad 16 px a Böngészés kalibrációja szerint), kártya 174 / 208 px (design 175 / 209), sorköz, pöttyök; téma-kijelölés (Dinoszauruszok → dínós filmek) és a végtelen görgetés (20 → 40 → 60 → 80 → 100 kártya) működik. A web NEM mutatta: az SF Symbols pajzs ikont a badge-en, az `active:` lenyomás-hatást, a korhatár-chip váltást képernyőn (a lekérdezést curl-lel néztem), a hiba / üres állapotot.
**Nyitva maradt:** (1) **Csak film:** a `discover/tv` nem szűr korhatárra (D-036), ezért sorozat nincs a Gyerek sarokban; ha kell, külön döntés (pl. `10762` sorozat-műfaj korhatár-szűrés nélkül). (2) **Nem szűr a kiválasztott szolgáltatókra** (csak arra, hogy HU-ban valamilyen módon nézhető), mint a Főoldal két railje (D-035, D-036); a „szűr mindent” elv ide is vonatkozik-e, a Te döntésed. (3) **Szövegek jóváhagyásra:** „Gyerek sarok”, „Felnőtt tartalom elrejtve”, „Nagy kalandok”, a téma nevek (Állatok, Világűr, Hercegnők, Dinoszauruszok, Zene, Sport). (4) A „Nagy kalandok” cím állandó: a design egy szekciót mutat, a téma kijelölésekor sem változik. (5) A „Felnőtt tartalom elrejtve” badge mindig látszik; a `hideMature` kapcsoló a Beállítások feladattal jön, addig a szűrés mindig be van kapcsolva. (6) Álló iPaden (834 px) a 4 oszlop miatt a kártyák 106 px szélesek és a címek csonkulnak; az „iPad finomhangolás” feladatnál eldől, kell-e ott kevesebb oszlop. (7) A Zene téma a TMDB „musical” kulcsszava (4344), a Sport a „sports” (6075): a találatok jellegét a kulcsszó adja (pl. Sport: Verdák, GOAT). (8) A kártyán a poszter a TMDB-ből jön; poszter nélküli címek kimaradnak a rácsból. (9) A szolgáltató-logó badge a designban nincs a Gyerek kártyákon, ezért nem is került rá.
**Commit:** `feat: gyerek sarok korhatár, téma chipek és kártya rács` (D-043)

## 2026-10-15 – Gyerek discover paraméterek közös helye (chore)

**Mit:** A „Gyerekeknek” rail `discover` paraméterei (műfajok, DE korhatár, népszerűség, HU elérhetőség) kiemelve a `lib/kidsDiscover.ts`-be, mert a Gyerek sarok ugyanezt kéri (a második előfordulás, CLAUDE.md: ismétlésnél refaktor). Viselkedés nem változott.
**Fájlok:** lib/kidsDiscover.ts, hooks/useKidsPicks.ts, docs/feature-tasks.md
**Tesztelve:** `npm run lint`, `npm run typecheck`. A rail képernyőn nem futott (a kért paraméterek azonosak).
**Nyitva maradt:** –
**Commit:** `chore: gyerek discover paraméterek közös helye`

## 2026-10-15 – „Megnyitás”: a szolgáltató keresőoldala a TMDB oldal helyett (fix)

**Mit:** A felhasználó jelezte, hogy a „Hol nézhető” „Megnyitás” gombja a themoviedb.org oldalt nyitja a szolgáltató helyett (D-039 ismert korlátja: a TMDB nem ad szolgáltatónkénti mélylinket). A gomb most a sor szolgáltatójának keresőoldalát nyitja a cím nevével (iOS-en a szolgáltató appja, ha telepítve van); ha a szolgáltatóhoz nincs link, a korábbi TMDB oldal nyílik. A `WhereToWatch` `onOpen` paramétere megkapja a sort. Link: Netflix, Disney Plus, HBO Max, Amazon Prime Video, Apple TV.
**Fájlok:** data/providerSearchLinks.ts, lib/titleInfo.ts, components/WhereToWatch.tsx, app/title/[type]/[id].tsx, docs/feature-tasks.md
**Tesztelve:** `npm run lint`, `npm run typecheck`. Eszközön NEM futott: a linkek tényleges megnyílása és az app-átirányítás eszközön ellenőrizendő.
**Nyitva maradt:** (1) A linkformátumokat a szolgáltatók webes keresőinek mintájára írtam, nem ellenőriztem őket: ha egy nem működik, a `data/providerSearchLinks.ts`-ben javítandó. (2) SkyShowtime, RTL+ és a többi szolgáltató linkjét nem vettem fel (nem ismerem biztosan a formátumot), náluk marad a TMDB oldal; link küldhető, és bekerül. (3) Keresőoldalra visz, nem a címre: a találati listában kell kiválasztani.
**Commit:** `fix: megnyitás a szolgáltató keresőoldalára` (D-042)

## 2026-10-15 – Böngészés: szolgáltató szűrő, műfaj chipek, találatszám, rendezés, rács, végtelen görgetés (feature)

**Mit:** A 03 és 11 design PNG-ből mért méretekkel (Pillow, csak a scratchpadben). `app/(tabs)/browse.tsx`: „Böngészés” cím, „Előfizetéseim” gomb + a saját szolgáltatók logói (bekapcsolva narancs keret, kikapcsolva halvány; koppintásra be/ki, az utolsót nem lehet kikapcsolni; a gomb mindet visszakapcsolja), műfaj chipek (vízszintesen görgethető, kijelölve fehér), találatszám („N cím M szolgáltatódon”) és rendezés (telefonon szürke szöveg a számláló sorában, iPaden pirula a címsorban), alatta poszter rács szolgáltató-logó badge-dzsel, koppintásra az Adatlap. Rendezés: Legújabb elöl / Legnépszerűbb / Legjobban értékelt (iOS rendszer-választólap, `ActionSheetIOS`). Állapotok: skeleton, hiba + újra, üres találat, „Nincs kiválasztott előfizetés.”. Új: `useBrowseTitles` (szolgáltatónként és típusonként egy `discover` oldalanként, egyesítve; az 1. oldalnál még egy-egy az összes szolgáltatóra a pontos találatszámhoz; a rács 36-os adagokban nő, ha elfogyott a lekért készlet, jön a következő oldal), `ProviderFilter`, `GenreChips`, `data/browseGenres.ts`, `data/browseSorts.ts`, `BrowseTitle` típus, `browseLayout` token, `PosterGrid` `rowGap` paraméter, magyar szövegek.
**Fájlok:** app/(tabs)/browse.tsx, components/{ProviderFilter,GenreChips,PosterGrid}.tsx, hooks/useBrowseTitles.ts, data/{browseGenres,browseSorts}.ts, types/app.ts, constants/{theme,strings}.ts, docs/feature-tasks.md
**Tesztelve:** `npm run lint`, `npm run typecheck`. Az éles függvényen curl-lel: sorozat + Sci-Fi (10765) + `vote_average.desc` + `vote_count.gte`, film + Thriller (53) + népszerűség: 200, találatok. Weben (headless Chrome, valós TMDB-adat, 4 szolgáltató, `web.output` átmenetileg `single`, visszaállítva, nem commitolva) telefon (407) és iPad (1244) szélességben: a sorok függőleges helye (a webes safe area-hiány, 62 px levonásával) ±1 px a designhoz, kártya 114 px, x = 21 / 146 / 271, sorköz 17, a szolgáltató badge-ek és a találatszám jelennek meg. A web NEM mutatta: az SF Symbols ikont az „Előfizetéseim” gombon, az `ActionSheetIOS` választólapot, az `active:` lenyomás-hatást, a végtelen görgetés tényleges betöltését és a műfaj / szolgáltató váltást (képernyőn nem kattintottam végig; a lekérdezéseket curl-lel néztem).
**Nyitva maradt:** (1) **iPad design hiba:** a 11-es PNG szolgáltató és műfaj sora összenyomott / levágott (a logók 26 px magasak, a chipek a rács mögé lógnak), ezért iPaden a telefon méreteit használom; ha az iPad-nak más kell, szólj. (2) **A telefon-design jobb felső csúszka gombja** nincs kirakva (mint a Watchlistnél: funkciója nincs leírva). (3) **Szövegek jóváhagyásra:** „Előfizetéseim”, „N cím M szolgáltatódon” (az eddigi „a(z) M kínálatában” nyelvtanilag hibás volt), a rendezési lehetőségek és a műfaj nevek. (4) A Thriller, Horror, Romantikus szűrő csak filmet ad (a TMDB sorozat-műfajai között nincs megfelelő), D-041. (5) A „Legjobban értékelt” 200+ szavazatú címekre szűr. (6) Az „Előfizetéseim” gomb funkciója (minden szolgáltató visszakapcsolása) saját döntés, a design nem mondja meg. (7) Az oldalak szolgáltatónként külön rendezettek, ezért a lista sorrendje oldalhatáron közelítő (D-041). (8) A szűrők (kikapcsolt szolgáltatók, műfaj, rendezés) nem tárolódnak, a képernyő újranyitásakor alaphelyzetbe állnak. (9) A rács nem virtualizált: nagyon hosszú görgetésnél a kártyák száma nő.
**Commit:** `feat: böngészés szűrők, rendezés, rács és végtelen görgetés` (D-041)

## 2026-10-15 – Watchlist: szegmensek számlálóval, státusz badge-ek, rács (feature)

**Mit:** A 07 és 15 design PNG-ből mért méretekkel (Pillow, csak a scratchpadben). `app/(tabs)/watchlist.tsx`: „Watchlist” cím, „Mind N / Elérhető most N / Hamarosan N” szegmens-vezérlő (telefonon a cím alatt teljes szélességben, iPaden a címmel egy sorban jobbra, 438 px), alatta poszter rács (telefon 3 oszlop, 114 px kártya, köz 11 / 15; iPad 6 oszlop, köz 14 / 20), a kártyákon státusz-pill, koppintásra az Adatlap. Állapotok: skeleton (két sor), hiba + újra, üres watchlist („A watchlist még üres.”), üres szegmens („Nincs találat.”). Új: `SegmentedControl` (a szegmensek a feliratukhoz igazodnak, a maradék helyet egyenlően kapják, mint a designban), `PosterGrid` (a Böngészés is használhatja), `useWatchlist` (címenként egy `getDetails`, 7 napra cache-elt; a státusz a kiválasztott szolgáltatóim szerint számolódik), `lib/watchlistStatus.ts` (`pickAvailability`, `pickStatus`, `matchesSegment`), `formatMonth`. `useWatchlistStore` kapott `hasHydrated`-et (mint a providers store), hogy a lista a visszatöltés előtt ne villanjon üresen. Tokenek: `segmentSelected` (#626264), `gridLayout`, `watchlistLayout`. Az eltávolítás az Adatlap Watchlist gombjával megy (pipa → levesz), a Főoldal hero „+” gombja is vált.
**Fájlok:** app/(tabs)/watchlist.tsx, components/{SegmentedControl,PosterGrid}.tsx, hooks/useWatchlist.ts, lib/{watchlistStatus,format}.ts, store/useWatchlistStore.ts, types/app.ts, constants/{theme.json,theme.ts,strings.ts}, docs/feature-tasks.md
**Tesztelve:** `npm run lint`, `npm run typecheck`, `expo export --platform ios` (lefordul). Weben (headless Chrome CDP-vel, valós TMDB-adat az éles függvényről, 12 előre beírt watchlist-elem, `web.output` átmenetileg `single`, visszaállítva, nem commitolva) telefon (407) és iPad (1244) szélességben: kártyák x = 21 / 146 / 271 és 114×171 (design: 21 / 146 / 271), sorköz 15, iPaden 139×209, oszlop-lépték 153 (design 154), szegmens-vezérlő y és jobb szél ±2 px; a státuszok (Elérhető most, Csak kölcsönzés, Blu-ray · dátum, Moziban · hó, Streaming év) a várt címeken jelentek meg; a „Mind 12 / Elérhető most 3 / Hamarosan 8” számláló és a szegmens-szűrés (3, ill. 8 kártya) helyes. A web NEM mutatta: a safe area-t (a design 59–61 px-es felső sávját a `SafeAreaView` adja), az `adjustsFontSizeToFit`-et (a hosszabb pill-feliratok weben csonkulnak, iOS-en legfeljebb 80%-ig zsugorodnak), az `active:` lenyomás-hatást, és a poszter-képeket (a teszt-elemeknek nem volt posztere).
**Nyitva maradt:** (1) **A design telefon-PNG jobb felső „csúszkák” gombja** (kerek gomb a cím mellett) nincs megvalósítva: sem a CLAUDE.md, sem a feladatlista nem mondja meg, mit csinál, és az iPad design nem mutatja. **Felhasználói döntés (2026-10-15): egyelőre nem kell**; ha később kell, előbb a funkcióját kell megadni. (2) **Szövegek jóváhagyásra:** „A watchlist még üres.”, „Csak vásárlás”, „Streaming 2027”, „Moziban · nov.”, „Blu-ray · okt. 9.”. (3) A hosszabb pill-feliratok („Blu-ray · okt. 22.”, „Streaming 2027”) a 114 px-es kártyán iOS-en zsugorodnak / túllógnak (D-030); eszközön ellenőrizendő. (4) A „Hamarosan” szegmens a design szerint a Blu-ray, Moziban, Streaming és Csak kölcsönzés / vásárlás címeket is tartalmazza; a státusz nélküli cím (pl. már megjelent, de nem a szolgáltatóimon, nem kölcsönözhető) csak a „Mind”-ben látszik. (5) Sorozatnál nincs `release_dates`, ezért nincs Blu-ray / Moziban státusz, csak Elérhető most / kölcsönzés / Streaming. (6) A státusz a `getDetails` adatából számolódik; a TMDB mozis / digitális dátumai hiányosak lehetnek. (7) A watchlist elemei csak az első betöltéskor kérnek adatot; az Adatlapról hozzáadott cím a következő megjelenítéskor kap státuszt.
**Commit:** `feat: watchlist szegmensek, státusz badge-ek és rács` (D-040)

## 2026-10-15 – Adatlap: Hol nézhető, Lemezen, Szereplők és stáb, iPad Névjegy (feature)

**Mit:** A 06 és 14 design PNG-ből mért méretekkel (Pillow, csak a scratchpadben). `WhereToWatch`: „Hol nézhető” + „Adatok: JustWatch”, Mind / Előfizetés / Kölcsönzés / Vásárlás szűrő, szolgáltatónként és módonként egy sor (logó, név, típus), jobbra „Megnyitás” gomb (D-012: ár nélkül), ami a TMDB `watch/providers` HU linkjét (JustWatch adat) nyitja; narancs, ha a cím a saját előfizetésemen nézhető. `DiscCard`: „Lemezen” kártya (legkorábbi fizikai megjelenés, HU, ennek híján DE „Német megjelenés”, formátumok „Blu-ray & 4K UHD”) és „Emlékeztess”, ami a címet a watchlistre teszi (D-013). `CastRail`: rendező + 11 főszereplő, TMDB profilkép vagy színátmenetes monogram-kör. `TitleAbout` (iPad): Névjegy oszlop leírással, Rendező / Nyelv / Ország sorokkal. A route telefonon: leírás, Hol nézhető, Lemezen, Szereplők, forrásmegjelölés; iPaden két oszlop (489 | 362, köz 38) + alatta a Szereplők. Új: `pickOffers`, `pickDisc`, `pickCast`, `pickFacts` (`lib/titleInfo.ts`), `formatFullDate`, `displayName` (`lib/format.ts`), `profileUrl`, tokenek `titleSections`, `titleColumns`, `castGradients`, szín `disc`. A `formatFromNote` a Blu-ray hookból a `lib/titleInfo.ts`-be költözött (két helyen kell, D-014). `SourceCredit` kapott `inset` paramétert.
**Fájlok:** app/title/[type]/[id].tsx, components/{WhereToWatch,DiscCard,CastRail,TitleAbout,SourceCredit}.tsx, hooks/{useTitleDetails,useBlurayReleases}.ts, lib/{titleInfo,format,tmdbImage}.ts, types/{app,tmdb}.ts, constants/{theme.json,theme.ts,strings.ts}, docs/feature-tasks.md
**Tesztelve:** `npm run lint`, `npm run typecheck`, `expo export --platform ios` (lefordul). Éles függvényen curl-lel (`movie/603`, `tv/1396`): a HU `flatrate` / `rent` / `buy` listák, a `link`, a `credits` (rendező, profilképek), a `spoken_languages`, `production_countries` és a DE típus-5 release megvan. Weben (headless Chrome CDP-vel, valós TMDB-adat, `web.output` átmenetileg `single`, visszaállítva, nem commitolva) telefon (407) és iPad (1244) szélességben: sorok, szűrő, kártyák, körök, két oszlop a designhoz egyeznek. A web NEM mutatta: az SF Symbols ikonokat (lemez, harang, lejátszás), a hero sötétítését, az `active:` lenyomás-hatást, a Hermes `Intl.DisplayNames`-ét (weben „angol”, „Egyesült Államok”; ha a Hermes nem tudja, a TMDB angol neve jelenik meg), a „Megnyitás” gomb és az „Emlékeztess” tényleges működését eszközön.
**Nyitva maradt:** (1) **Szövegek jóváhagyásra:** „Magyarországon jelenleg nem nézhető.”, „Megjelenés Magyarországon”; a típusok a Keresés szövegei (Előfizetés / Kölcsönzés / Vásárlás), az „Emlékeztess” a már meglévő. (2) Telefonon a szűrő chipek 15 px-esek, 11 px kitöltéssel (a designban 16 / 16), különben a magyar szavak miatt a „Vásárlás” új sorba törne; iPaden a design mérete, lásd D-039. (3) A „Megnyitás” mindig ugyanazt a TMDB oldalt nyitja (a TMDB nem ad szolgáltatónkénti mélylinket). (4) Sorozatnál nincs rendező / stáb (a `created_by` nincs lekérve), a Névjegy „Rendező” sora ilyenkor kimarad; a Lemezen kártya sorozatnál sincs (nincs `release_dates`). (5) Betöltés közben a hero alatt nincs skeleton a blokkoknak (csak a hero helykitöltője). (6) A „Lemezen” kártya DE adatnál a D-037 szűrést nem alkalmazza (a „Német megjelenés” jelzés mutatja az eredetet). (7) A tab bar / oldalsáv az Adatlapon továbbra sincs, D-038. (8) Az iPad hero „Hozzáadás a watchlisthez” gombja weben csonkul (előző feladat nyitott pontja: a gombszélesség ellenőrizendő eszközön).
**Commit:** `feat: adatlap hol nézhető, lemezen, szereplők és névjegy` (D-039)

## 2026-10-15 – Adatlap: hero, meta, korhatár, értékelés, Előzetes, Watchlist, leírás (feature)

**Mit:** A 06 és 14 design PNG-ből mért méretekkel (Pillow, csak a scratchpadben). Új route: `app/title/[type]/[id].tsx` (CLAUDE.md szerinti hely, gyökér `Stack`). `useTitleDetails`: egy `getDetails` hívás (skeleton / hiba + újra), `TitlePage` nézetmodell (meta „2026 · 2 ó 08 p · Akció, Sci-Fi”, korhatár HU → DE, TMDB értékelés egy tizedessel, előzetes, a kiválasztott szolgáltatóim közül az első, amelyiken előfizetéssel nézhető). `TitleHero`: backdrop + sötétítés (Főoldal hero mintája), vissza és megosztás kör gomb, cím (44 / 72 pt), meta + korhatár-keret, ★ értékelés (telefonon a meta alatt, iPaden mellette), Előzetes és Watchlist gomb (telefonon 165 / 190, iPaden 188 / 205 px széles; a Watchlist pipára vált, ha a listán van), iPaden „ELŐFIZETÉSEIDEN: NETFLIX” sor. Megosztás: rendszer megosztólap a címmel és a TMDB linkkel. A leírás a hero alatt. Bekötve a Főoldalról: a hero (háttérre koppintás), az „Újdonságok”, Blu-ray, Népszerű és Gyerekeknek kártyák az adatlapra visznek; a hero „Előzetes” és az adatlap közös `trailerUrl` helpert használ. Új: `lib/routes.ts` (`titleHref`), `lib/titleInfo.ts` (`trailerUrl`, `tmdbUrl`, `pickMyProvider`), tokenek `star`, `certBorder`, `titleLayout`.
**Fájlok:** app/title/[type]/[id].tsx, app/_layout.tsx, app/(tabs)/index.tsx, components/{TitleHero,HeroCarousel}.tsx, hooks/useTitleDetails.ts, lib/{routes,titleInfo}.ts, types/app.ts, constants/{theme.json,theme.ts,strings.ts}, docs/feature-tasks.md
**Tesztelve:** `npm run lint`, `npm run typecheck`, `expo export --platform ios` (lefordul). Az éles függvényen curl-lel: `movie/603` és `tv/1396` a négy `append_to_response`-szal: magyar cím, év, hossz (filmnél), műfajok, értékelés, leírás és a HU `flatrate` lista megvan (a sorozatnak nincs `runtime`, a Totál szívásnál az `episode_run_time` is üres, ezért a meta ott hossz nélküli). Képernyőn / szimulátoron / eszközön NEM futott: a vizuális egyezés a designnal, a navigáció a Főoldalról, a vissza gomb, a megosztólap, az Előzetes (YouTube) és az SF Symbols ikonok eszközön ellenőrizendők.
**Nyitva maradt:** (1) **A tab bar / oldalsáv az adatlapon nincs:** a design mutatja, de a CLAUDE.md szerinti gyökér-route (és a headless `Tabs`, amely csak a felsorolt triggereket építi) ezt nem adja, lásd D-038; ha kell, külön döntés. (2) A „Hol nézhető”, „Lemezen”, „Szereplők és stáb” blokkok és az iPad „Névjegy” oszlop a következő feladat: addig iPaden a leírás a hero alatt áll (a designban a Névjegy oszlopban), a következő feladat áthelyezi. (3) Új szövegek jóváhagyásra: „Hozzáadás a watchlisthez” (iPad gomb), „A watchlistben”, „ELŐFIZETÉSEIDEN: NETFLIX”, „Vissza”, „Megosztás”. (4) Sorozatnál nincs korhatár (nincs `release_dates`; a `content_ratings` nincs lekérve), mint a Főoldal herónál. (5) A `flex-[165]` / `flex-[190]` arányos gombszélesség NativeWinddel eszközön ellenőrizendő. (6) A telefon-PNG „Watchlist” gombja szegély nélküli `chip` szín (#2C2C2E), a Főoldal hero gombja áttetsző fehér: a két gomb nem azonos stílus, a design szerint. (7) A Blu-ray, Gyerekeknek kártyák mindig filmre mutatnak (ezek a hookok csak filmet adnak).
**Commit:** `feat: adatlap hero, meta, értékelés és gombok` (D-038)

## 2026-10-15 – Blu-ray rail: a DE ágon csak a nálunk is megjelent címek (fix)

**Mit:** A felhasználó kérésére (csak olyan megjelenés kell, ami nálunk is megjelenik) a HU → DE fallbackben csak azok a címek maradnak, amelyeknek van magyar `release_dates` bejegyzése (bármilyen típus, pl. mozi). A HU ág változatlan. A szűrő a már lekért `getDetails` adatot használja, nincs új hívás.
**Fájlok:** hooks/useBlurayReleases.ts, docs/feature-tasks.md
**Tesztelve:** `npm run lint`, `npm run typecheck`. Az éles függvényen a mai 12 DE jelöltből 6-nak van magyar bejegyzése (curl), így a rail ma kb. 6 címet mutat. Képernyőn / eszközön NEM futott.
**Nyitva maradt:** (1) A 12 jelöltből a szűrés után kevesebb marad; ha a rail túl rövid, a `CANDIDATE_LIMIT` emelhető. (2) A magyar bejegyzés csak azt mondja, hogy a cím nálunk is megjelent (jellemzően moziban), azt nem, hogy a lemez is kapható itt; a lemez továbbra is a német megjelenés dátuma és formátuma.
**Commit:** `fix: Blu-ray DE fallback csak a magyar megjelenésű címekre` (D-037)

## 2026-10-15 – Főoldal: Népszerű Magyarországon, Gyerekeknek, forrásmegjelölés (feature)

**Mit:** A 02 és 10 design PNG-ből mért méretekkel (Pillow, csak a scratchpadben). (1) „Népszerű Magyarországon”: `useTrendingInHungary` (film + sorozat `discover`, népszerűség szerint, `watch_region=HU` + monetizációs típusok, egyesítve, top 9), `TrendingCard`: poszter (109 / 121 px), mögötte nagy üreges sorszám (104 / 116 pt; RN-ben nincs szöveg-körvonal, ezért 8 irányba eltolt körvonal-színű példány + háttérszínű kitöltés), állandó elemszélesség (172 / 201 px). (2) „Gyerekeknek”: `useKidsPicks` (népszerű animációs / családi filmek, DE korhatár ≤ a Beállított korhatár, a jelöltekre `getDetails` a korhatárhoz és a magyar műfajnévhez), `KidsPickCard`: fekvő backdrop-kártya (272 / 288 px, 16 px sarok), rajta a cím, alatta színes pötty + „0+ éveseknek · Animációs”, a pöttyök színe körbeforog (kék, menta, korall, sárga). „Összes” → Gyerek fül. (3) `SourceCredit`: TMDB + JustWatch lábléc. A `PosterRail` kapott `variant` (`poster` / `trending` / `wide`: más méret és helykitöltő) és a `renderCard` harmadik, `index` paramétert. `useSettingsStore` kapott `hasHydrated`-et (mint a providers store), a Gyerek hook megvárja. `pickCertification` kapott országlista paramétert (a gyerek ajánlók csak DE-t kérnek). Új tokenek: `outline` (#48484A), `kidsCoral` (#FD8A80), `trendingLayout`, `wideRailLayout`, `kidsAccents`. `TitleSummary` kapott `popularity`-t.
**Fájlok:** app/(tabs)/index.tsx, components/{TrendingCard,KidsPickCard,SourceCredit,PosterRail}.tsx, hooks/{useTrendingInHungary,useKidsPicks}.ts, store/useSettingsStore.ts, lib/titleInfo.ts, types/{app,tmdb}.ts, constants/{theme.json,theme.ts}, docs/feature-tasks.md
**Tesztelve:** `npm run lint`, `npm run typecheck`, `expo export --platform ios` (lefordul). Éles függvényen curl-lel: a trending (film: 20 001 találat, sorozat) és a gyerek (`certification.lte=6`, DE, `16|10751`: 1287 találat, Toy Story 5, Vaiana, Zootropolis 2…) lekérdezés 200. Weben (headless Chrome CDP-vel, valós TMDB-adat, ideiglenes route, nem commitolva) telefon (407) és iPad (974) szélességben a méretek a designhoz egyeznek: trending kártya 109×162 / 121×181, elemlépték 172 / 201 (a design iPaden 198–203, a számjegyek szélessége miatt), kártyák x-pozíciója ±3 px, fekvő kártya 272×156 / 288×~167, köz 12 / 16, szekciók közti és felirat alatti távolságok ±1 px. A web NEM mutatta: az iOS-es SF számjegy-metrikát (a sorszám alapvonala `0,24 × betűméret` becslés, a jobb széle 16 / 18 px-re nyúlik a kártya bal széle mögé: a webes Chrome rendszerfontján jó, eszközön ellenőrizendő), az `experimental_backgroundImage` sötétítést (web nem támogatja), az `active:` lenyomás-hatást, a szövegárnyékot. A dev webes előnézethez a NativeWind „media sötét mód” hibájának overlay-jét CDP-vel kellett eltávolítani (natívan nincs ilyen hiba).
**Nyitva maradt:** (1) A két új rail a CLAUDE.md / D-015 szerinti lekérdezéssel NEM szűr a kiválasztott szolgáltatókra (csak arra, hogy HU-ban valamilyen módon nézhető); ha a „szűr mindent” elv ide is vonatkozik, egy `with_watch_providers` paraméter. (2) A kártyák nem navigálnak az Adatlapra (a route még nincs); a Népszerű railnek nincs „Összes” hivatkozása (nincs célképernyő, mint a Blu-ray railnél), a Gyerekeknek „Összes” a még üres Gyerek fülre visz. (3) A Gyerekeknek csak film (a `discover/tv` nem szűr korhatárra, D-036). (4) A Népszerű lista film + sorozat vegyesen, TMDB népszerűség szerint: talk show-k is előfordulnak (pl. Watch What Happens Live). (5) Top 9, nem 10: a kétjegyű sorszám az előző kártyára nyúlna (D-035). (6) A műfajnév a TMDB magyar elnevezése („Animációs”, nem „Animáció”); a szövegeket Te hagyod jóvá („éveseknek” a design „Ages”-e helyett). (7) Az `isTablet` számítás már 7 helyen ismétlődik (onboarding, AppTabs, HeroCarousel, PosterRail, TrendingCard, KidsPickCard, SourceCredit): `useIsTablet` hook jöhet külön `chore:` commitban. (8) A lábléc betűmérete (12 px, sormagasság 19, bekezdések köze 5) a PNG-ből mért; a telefon-PNG-n a 2. bekezdés a tab bar mögött van. (9) A gyökér layout a `useSettingsStore` visszatöltését nem várja meg (csak a Gyerek hook).
**Commit:** `feat: főoldal népszerű, gyerek ajánló rail és forrásmegjelölés` (D-035, D-036)

## 2026-10-15 – Főoldal: Új Blu-ray megjelenések rail (feature)

**Mit:** `useBlurayReleases`: `discover/movie` `with_release_type=5`, `region=HU`, `release_date` ±60 nap; ha üres, ugyanez `region=DE`-vel (D-006), és ilyenkor a rail címe alatt a „Német megjelenés” sor látszik (új `note` prop a `PosterRail`-en). A fizikai megjelenés dátuma és formátuma csak a `release_dates`-ben van, ezért a legnépszerűbb 12 jelöltre `getDetails` fut (az Edge Function 7 napra cache-eli), a kártya alcíme „okt. 9. · Blu-ray”, a badge a `note`-ból: „4K UHD” (4K/UHD), „Steelbook”, különben „Blu-ray” (D-014). Sorrend: az elmúlt hét óta a mostani és közelgő megjelenések növekvő dátummal elöl, utánuk a régebbiek csökkenőben. Új: `formatShortDate`, `BlurayTitle`.
**Fájlok:** hooks/useBlurayReleases.ts, app/(tabs)/index.tsx, components/PosterRail.tsx, lib/format.ts, types/app.ts, docs/feature-tasks.md
**Tesztelve:** `npm run lint`, `npm run typecheck`, `expo export --platform ios` (lefordul). Az éles függvényen curl-lel: HU a ±60 napos ablakban 0 találat, DE 54; egy DE cím `release_dates` bejegyzése: típus 5, 2026-08-27, `4K Ultra HD Steelbook / Blu-ray / DVD`. A hook és a rail képernyőn / eszközön NEM futott (ezt a lépést vizuálisan nem néztem a webes előnézettel).
**Nyitva maradt:** (1) A mai adat szerint a HU üres, tehát a rail jelenleg DE adattal és „Német megjelenés” jelzéssel jelenik meg. (2) A „Összes” hivatkozás nincs: a Blu-ray listának nincs célképernyője (a Böngészés műfaj/szolgáltató szerint szűr). (3) A „Német megjelenés” sor a designban nincs; a CLAUDE.md előírja a jelzést, ezért a cím alatti kis szürke sor lett, ha más helyen kéred, szólj. (4) Egy cím több fizikai kiadása közül (4K, Steelbook) a badge az első, ablakba eső bejegyzés `note`-ja szerint egy formátumot mutat. (5) A kártyák itt sem navigálnak az Adatlapra.
**Commit:** `feat: főoldal Blu-ray megjelenések rail` (D-034)

## 2026-10-15 – Főoldal: hero carousel + „Újdonságok a szolgáltatóidon” rail (feature)

**Mit:** A 02 és 10 design PNG-ből mért méretekkel (Pillow, csak a scratchpadben). `HeroCarousel`: teljes szélességű, lapozható backdrop (5 lap), rajta a szolgáltató („ÚJ A(Z) … KÍNÁLATÁBAN”), cím, meta (műfaj · év · hossz) + korhatár-pill, Előzetes és Watchlist („+”) gomb; telefonon alul középen, iPaden jobb alul a pöttyök; felső sáv: telefonon márkanév + beállítások ikon, iPaden kereső ikon. Sötétítés a backdropra RN `experimental_backgroundImage` lineáris átmenettel (D-024 mintája, nincs új könyvtár). A Főoldal a herón kívül a `PosterRail`-lel mutatja az új címeket (szolgáltató-logó, „Ma · Netflix” alcím, „Összes” → Böngészés fül). Hookok: `useMyProviders` (kiválasztott szolgáltatók TMDB-adatai), `useNewOnMyServices` (szolgáltatónként és típusonként egy `discover`, egyesítve, rendezve, ismétlődés nélkül), `useHeroItems` (az első 5 hátteres címre `getDetails`). Új: `useWatchlistStore` (a hero „+” gombjához; a Watchlist feladat erre épül), `lib/format.ts` (hossz, „Ma / Tegnap / okt. 9.”), `lib/titleInfo.ts` (előzetes, korhatár, hossz), `types/app.ts`. `getDetails` kapott `include_video_language=hu,en,null`-t (nélküle a hu-HU mellett 0 videó jött, vele 29: curl-lel ellenőrizve). Tokenek: `heroLayout`, `textSoft` (#D1D1D6, a meta/leírás színe a PNG-ből). A `DevResetButton` a jobb felső ikon mellé került (right: 72).
**Fájlok:** app/(tabs)/index.tsx, components/{HeroCarousel,DevResetButton}.tsx, hooks/{useMyProviders,useNewOnMyServices,useHeroItems}.ts, store/useWatchlistStore.ts, lib/{api,format,titleInfo}.ts, types/{app,tmdb}.ts, constants/{theme.json,theme.ts,strings.ts}, docs/feature-tasks.md
**Tesztelve:** `npm run lint`, `npm run typecheck`, `expo export --platform ios` (lefordul). Weben (headless Chrome, valós TMDB-adat az `mms-tmdb`-ről, a localStorage-ba előre beírt szolgáltatókkal és kész onboardinggal; `app.json` `web.output` átmenetileg `single`, visszaállítva; a CORS miatt a preview Chrome-ja külön profillal, webbiztonság nélkül futott, natívan nincs CORS) telefon (407) és iPad (1244) szélességben a méretek a designhoz egyeznek: gombok 463–515 / 397–448 px, pöttyök 536 / 440 px, hero alja 539 / 467 px, a rail kártyái és a fejléc a design helyén. A web NEM mutatta: az átmeneteket (a web nem támogatja az `experimental_backgroundImage`-et), az SF Symbols ikonokat (lejátszás, „+”, fogaskerék, nagyító, pipa, chevron), az `active:` lenyomás-hatást, az `adjustsFontSizeToFit`-et; ezek eszközön ellenőrizendők, és az Előzetes gomb YouTube-megnyitása (`Linking`) sem futott.
**Nyitva maradt:** (1) A rail magyar címe („Újdonságok a szolgáltatóidon”) telefonon 22 pt-on három ponttal csonkul; rövidebb szöveg kellene (pl. „Új a szolgáltatóidon”): a szövegeket Te hagyod jóvá. (2) Sem a hero, sem a kártyák nem navigálnak az Adatlapra (a route még nincs); a „Összes” a Böngészés fülre visz (még üres képernyő). (3) Sorozatnál az „új” a TMDB `first_air_date` (a sorozat premierje), nem az új évad dátuma: a `discover` nem ad évaddátumot; a hero sorozatoknál korhatárt sem mutat (nincs `release_dates`, a `content_ratings` az Adatlap feladat). (4) Ha egy címnek nincs magyar leírása, iPaden a hero leírás sora kimarad. (5) A hero nem lapoz magától (a design nem ír róla). (6) Első betöltéskor szolgáltatónként 2 `discover` + 5 `getDetails` fut (az Edge Function 6 órára / 7 napra cache-eli); sok szolgáltatónál ez sok hívás: ha lassú, korlátozni kell. (7) Az oldalsáv „SZOLGÁLTATÓIM” logósora még nincs; a `useMyProviders` hook kiszolgálja. (8) Az Előzetes gomb letiltott (40% átlátszóság), ha nincs YouTube előzetes vagy a részletek még nem érkeztek meg; a design ezt nem mutatja.
**Commit:** `feat: főoldal hero és új a szolgáltatóimon rail`

## 2026-10-15 – Közös komponensek: poszter kártya, rail, szekciócím, állapotok (feature)

**Mit:** A 02, 03, 07, 10, 11, 15 design PNG-ből pixelre mért méretekkel (Pillow, csak a scratchpadben): `PosterCard` (2:3 poszter, 1 px halvány keret, szolgáltató-logó vagy státusz-pill bal felül, Blu-ray formátum-pill jobb felül, opcionális cím + alcím alatta, nincs-poszter tartalék a címmel), `PosterBadge` (pill, narancs pipával vagy áttetsző fekete), `PosterCardSkeleton`, `SectionHeader` (22 pt cím + „Összes >”), `PosterRail` (szekciócím + vízszintes lista, skeleton / hiba + újra / üres állapot, a design szerinti kártyaszélesség, köz és margó telefonon és iPaden), `EmptyState`. Tokenek: `radius.poster` (14) a `theme.json`-ban, `railLayout` a `theme.ts`-ben (telefon 134 / 12 / 21, iPad 146 / 16 / 35: kártyaszélesség / köz / margó).
**Fájlok:** components/{PosterCard,PosterBadge,PosterRail,SectionHeader,EmptyState}.tsx, constants/theme.json, constants/theme.ts, docs/feature-tasks.md
**Tesztelve:** `npm run lint`, `npm run typecheck`, `expo export --platform ios` (lefordul; a komponenseket még nem importálja képernyő, ezért a bundle őket nem fordítja). Ideiglenes előnézeti route-tal (nem commitolva, törölve; az `app.json` `web.output` átmenetileg `single`, visszaállítva) weben, headless Chrome-ban, valós TMDB-adattal, valódi 407 és 1244 px széles nézetben: rail, rács, állapotok a designhoz egyeznek (kártyaméret, köz, margó, logó, pillek, felirat, hosszú cím három ponttal, „Összes”). A web NEM bizonyítja a natív működést: az SF Symbols (pipa, chevron), az `adjustsFontSizeToFit` és az `active:` lenyomás-hatás csak iOS-en látszik; eszközön ellenőrizendő.
**Nyitva maradt:** (1) **Főoldal-feladat figyelmébe:** a szolgáltató-badge-hez és az „Ma · Netflix” alcímhez tudni kell, melyik szolgáltatón van a cím; a TMDB `discover` ezt nem adja vissza. Megoldás a Főoldalnál (szolgáltatónként külön `discover`, vagy címenként `watch/providers`), a `PosterCard` csak a kapott logót mutatja. (2) A „Elérhető most” (13 betű) hosszabb a 114 px-es kártyánál; a pill a designhoz hasonlóan túllóg, iOS-en a betű legfeljebb 80%-ig zsugorodik, utána három pont. Ha zavaró, rövidebb pill-felirat („Elérhető”) kell: a szövegeket Te hagyod jóvá. (3) A 3 oszlopos rács 407 px-en nem fér el fix 114 px-es kártyával és 12 px közzel (366 > 365): a Böngészés / Watchlist feladatnál a kártyaszélességet a konténerből kell számolni. (4) A „Trending” sorszámos rail és a „Kids' picks” fekvő kártyák külön feladat (más kártyaforma), nem a `PosterRail`-ben. (5) A `PosterCard` nem navigál: az `onPress`-t a képernyő adja, az Adatlap route még nincs. (6) A `PosterRail` a breakpointot maga számolja (`useWindowDimensions`); az `onboarding` és az `AppTabs` mellett ez a 3. hely: ha tovább nő, `useIsTablet` hook jöhet.
**Commit:** `feat: közös poszter komponensek és rail`

## 2026-10-15 – Dev reset gomb (chore)

**Mit:** A felhasználó kérésére egy `__DEV__`-hez kötött „DEV · RESET” gomb: a jobb felső sarokban (a biztonsági sáv alatt) minden képernyőn látszik, megnyomva törli az AsyncStorage-t és újratölti az appot (`DevSettings.reload()`), így az onboarding Expo Go-ban újratelepítés nélkül újra kipróbálható. Release buildben nem renderelődik. Nincs megerősítő kérdés: fejlesztői eszköz.
**Fájlok:** components/DevResetButton.tsx, app/_layout.tsx, docs/feature-tasks.md
**Tesztelve:** `npm run lint`, `npm run typecheck`, `expo export --platform ios` (lefordul). Expo Go-ban NEM futott: a gomb helye, az érinthetősége és az, hogy a `DevSettings.reload()` újratöltés után az onboarding jön-e fel, eszközön ellenőrizendő.
**Nyitva maradt:** (1) A gomb a Főoldal jobb felső beállítások ikonjának helyére esik majd, amikor az elkészül; akkor át kell tenni. (2) `AsyncStorage.clear()` mindent töröl: Expo Go-ban projektenként elkülönített a tár, de dev buildben is csak az app adata van benne. (3) Ship előtt eltávolítandó (a „Ship előtt” sor frissítve).
**Commit:** `chore: dev reset gomb az onboarding teszteléséhez`

## 2026-10-15 – Onboarding 2. lépés: Kids korhatár (feature)

**Mit:** Az onboarding képernyő `step` állapottal vált az 1. (szolgáltatók) és a 2. lépés (Gyerek korhatár: 0+ / 6+ / 12+ chipek, alapból 6+) között. Az 1. „Tovább” csak menti a szolgáltatókat és a 2. lépésre lép; az onboarding a 2. lépés „Kész” gombjával (a választott korhatárt menti) vagy bármelyik lépés „Kihagyom” gombjával zárul, és a főoldalra visz (D-023 terve szerint). Amíg nem zárult, a `(tabs)` őr az onboardingra irányít vissza, és az 1. lépés a mentett szolgáltatókkal indul. Új: `AgeChip` (a Kids design chipje: sötét pill, kijelölve `kidsBlue`), `data/kidsAgeLimits.ts` (`0 | 6 | 12`), `useSettingsStore` (egyelőre csak `kidsAgeLimit`, AsyncStorage). A fejléc `step` paramétert, a lábléc `label`/`disabled` paramétert kapott a `count` helyett; új szövegek: `onboarding.kidsSubtitle`, `onboarding.done`.
**Fájlok:** app/onboarding.tsx, components/{AgeChip,OnboardingHeader,OnboardingFooter}.tsx, data/kidsAgeLimits.ts, store/{useSettingsStore,useProvidersStore}.ts, constants/strings.ts, docs/feature-tasks.md
**Tesztelve:** `npm run lint`, `npm run typecheck`, `expo export --platform ios` (lefordul). Szimulátoron / eszközön NEM futott: a lépésváltás, a chip-választás, a lezárás utáni átirányítás, a mentés újraindítás után, és a vizuális kép (iPhone + iPad) eszközön ellenőrizendő.
**Nyitva maradt:** (1) A 2. lépésnek nincs saját designja (a CLAUDE.md szerint ideiglenes): az elrendezés az 01/09 onboardingból és a 04/12 Kids chipekből áll össze (chip 44 px magas, 17 px oldalpadding, 18 px betű, 12 px köz, a PNG-ből mérve); ha más kell, szólj. (2) Az új szövegeket („Gyerek korhatár” alcíme, „Kész”) hagyd jóvá. (3) Nincs „Vissza” az 1. lépéshez; a szolgáltatók később a Beállításokból szerkeszthetők (ott az onboarding 2. lépése is megjelenik majd). (4) `useSettingsStore` még nem jelzi a visszatöltést: ha a Gyerek sarok / Kids' picks a korhatárt lekérdezési kulcsnak használja, a visszatöltést meg kell várni (a gyökér layoutban vagy `hasHydrated`-del). (5) A `strings.kids.ageChips` (`['0+','6+','12+']`) használaton kívül maradt, az `AgeChip` `{limit}+`-t írja ki; a Kids feladatnál eldől, melyik marad.
**Commit:** `feat: onboarding 2. lépés gyerek korhatár`

## 2026-10-15 – Onboarding: hosszú szolgáltatónév egy sorban (fix)

**Mit:** A design rövid neveket mutat (Netflix, Prime Video), a TMDB nevei hosszabbak („Amazon Prime Video”, „WOW Presents Plus”), és a telefon 174 px-es kártyáján levágódtak („Amazon Prime …”). A név egy sorban marad, iOS-en legfeljebb 75%-ig zsugorodik (`adjustsFontSizeToFit`, `minimumFontScale`), így a kártya magassága és a design elrendezése nem változik.
**Fájlok:** components/ProviderCard.tsx, docs/feature-tasks.md
**Tesztelve:** `npm run lint`, `npm run typecheck`. A zsugorítás iOS-specifikus, a webes előnézeten nem látszik: eszközön ellenőrizendő.
**Nyitva maradt:** A legalább 75%-ra zsugorított név is levágódhat nagyon hosszú névnél (három pontos vége marad).
**Commit:** `fix: hosszú szolgáltatónév egy sorban a kártyán`

## 2026-10-15 – Betűtípus a PDF szerint: rendszerfont a Nunito helyett (fix)

**Mit:** A felhasználó kérésére újra átnéztem a `docs/design/mymoviescanner-design.pdf`-et: az onboarding oldalai (1., 9.) pixelre megegyeznek a PNG-kkel, új információt nem adnak. Az összevetésnél az egyik fő eltérés a betűtípus: a design nem lekerekített (nem Nunito), hanem SF/Inter jellegű, szűk betűközű, ez volt a korábbi „Nunito-szerű” megítélés tévedése. A betűtípus az iOS rendszerfontja (SF) lett: `font-nunito*` → `font-semibold/bold/extrabold` (a normál súlyhoz nincs osztály), töröltem a betűbetöltést a gyökér layoutból (a splash csak a store visszatöltését várja), a `fonts` tokent a `theme.json`/`theme.ts`-ből, a `fontFamily`-t a `tailwind.config.js`-ből, és eltávolítottam a `@expo-google-fonts/nunito` csomagot.
**Fájlok:** app/_layout.tsx, components/{BottomTabBar,ErrorState,OnboardingFooter,OnboardingHeader,ProviderCard,ScreenPlaceholder,Sidebar}.tsx, constants/theme.json, constants/theme.ts, tailwind.config.js, package.json, package-lock.json
**Tesztelve:** `npm run lint`, `npm run typecheck`, `expo export --platform ios` (lefordul). Weben (Chrome, 407×880 és 1244×869, a design 4 kijelölt kártyájával, valós TMDB-adattal) a kép a designhoz hasonló: szűk betűköz, súlyok, kártyaméret, keret, CTA. Natívan továbbra sem futott: eszközön ellenőrizendő.
**Nyitva maradt:** A webes előnézet nem mutatja a pipát (SF Symbols) és a háttérfényt (radial gradient), ezeket csak natívan lehet ellenőrizni; a felhasználó iPad képernyőképén mindkettő megjelent. A nav (oldalsáv, tab bar) szövegei a betűváltással együtt a rendszerfontra váltak: a 02/10 designnal összevetendő.
**Commit:** `fix: rendszerfont a design szerint, Nunito eltávolítva`

## 2026-10-15 – Onboarding: Pressable csak className-nel (fix)

**Mit:** A felhasználó iPad képernyőképe szerint az előző javításom (`Pressable` + `StyleSheet` stílus-függvényben) elrontotta a kártyákat: nincs háttér, keret, méret, a CTA fekete szöveggel fekete háttéren láthatatlan. Az előző diagnózisom hiányos volt: a NativeWind a `Pressable` `style` **függvényét** mindig eldobja, `className` nélkül is, tehát a `StyleSheet`-et sem lehet függvényben átadni. Javítás: a `Pressable` csak `className`-t kap (ez bizonyítottan működik); a futásidőben számolt kártyaméret egy burkoló `View` objektum-stílusán van; a lenyomás-hatás `active:opacity-*` osztállyal; a CTA méretei statikus osztályok `isTablet` szerint, letiltva `opacity-40`. Érintett: `ProviderCard`, az onboarding CTA és Kihagyom, `ErrorState`.
**Fájlok:** components/ProviderCard.tsx, components/OnboardingFooter.tsx, components/ErrorState.tsx, docs/feature-tasks.md
**Tesztelve:** `npm run lint`, `npm run typecheck`. Weben (react-native-web, Chrome, a design méretein: 407×880 és 1244×869, a valós TMDB-adattal) lerenderelve: a kártyák 174×120 / 204×145, 2 / 4 oszlop, 17 / 21 px köz, a CTA 396 px széles, minden a mért design szerint. A web NEM bizonyítja a natív működést (a hibát ott a css-interop okozta), natívan továbbra sem futott: eszközön ellenőrizendő, főleg az `active:` lenyomás-hatás.
**Nyitva maradt:** A `Sidebar`, `BottomTabBar` és a Beállítások link ugyanazt a (`className` + `style` függvény) mintát használja: az elrendezésük a `className`-ből rendben, csak a lenyomás-hatásuk hiányzik; nem nyúltam hozzájuk. A web-előnézethez az `app.json` `web.output` értékét átmenetileg `single`-re kellett állítani (a `static` Node-ban az AsyncStorage `window`-ját nem találja); visszaállítva, nem commitolva.
**Commit:** `fix: Pressable csak className-nel (NativeWind style függvény)`

## 2026-10-15 – Onboarding: névalapú kiemelt szolgáltatólista (feature)

**Mit:** A felhasználó döntése alapján (D-022 nyitott pontja) a szolgáltatók elejére egy névalapú kiemelt lista kerül: Netflix, HBO Max, Disney Plus, SkyShowtime, Amazon Prime Video, Apple TV, RTL+ (a design 7 szolgáltatója, TMDB-nevekkel). A `useProviders` ezeket a lista sorrendjében teszi előre, utánuk a többi a TMDB HU sorrendjében következik. A lista a `data/featuredProviders.ts`-ben él, névre illeszt (kis-nagybetű nélkül), ID-t nem tartalmaz.
**Fájlok:** data/featuredProviders.ts, hooks/useProviders.ts, docs/feature-tasks.md
**Tesztelve:** `npm run lint`, `npm run typecheck`; a hook tényleges rendezőkódját a valós HU TMDB-adaton futtattam: Netflix, HBO Max, Disney Plus, SkyShowtime, Amazon Prime Video, Apple TV, utána JustWatch TV, Apple TV Store, YouTube Premium… (45 szolgáltató). Eszközön NEM futott.
**Nyitva maradt:** (1) Az RTL+ nincs a TMDB HU listájában, ezért nem jelenik meg (a lista tartalmazza, ha a TMDB felveszi, előre kerül). (2) A kiemelt nevek a TMDB aktuális elnevezései („Disney Plus”, „Amazon Prime Video”, „Apple TV”); átnevezésnél a lista karbantartandó. (3) A kiemeltek utáni rész továbbra is a TMDB sorrendje (JustWatch TV, Apple TV Store elöl); ha zavaró, a `featuredProviderNames` bővíthető.
**Commit:** `feat: onboarding kiemelt szolgáltatók név szerint`

## 2026-10-15 – Onboarding: Pressable méretek és kitöltés (fix)

**Mit:** A felhasználó jelezte: a szolgáltató kártyák mérete változó, a „Tovább N szolgáltatóval” gombon nincs kitöltés, a szöveg a gomb széléig ér. Ok: a `Pressable`-n `className` mellett `style` függvény volt (`({ pressed }) => …`); a NativeWind (css-interop) a függvényt nem alkalmazza, így a `width`/`height` és a lenyomás-átlátszóság elveszett, az elemek tartalomhoz méreteződtek. Javítás: ahol `style` függvény van, ott nincs `className`; a statikus stílus `StyleSheet`-ben, a tokenekből (`colors`, `radius`). A CTA kapott 16 px vízszintes kitöltést is. Érintett: `ProviderCard`, az onboarding CTA, az `ErrorState` újrapróbálás gombja.
**Fájlok:** components/ProviderCard.tsx, components/OnboardingFooter.tsx, components/ErrorState.tsx, docs/feature-tasks.md
**Tesztelve:** `npm run lint`, `npm run typecheck`. Az okot a `react-native-css-interop` forrásában követtem végig (a függvény stílusobjektumként kerül a szabálylistába, és nincs deklarációja). Szimulátoron / eszközön NEM futott: a kártyaméretek és a gomb kitöltése eszközön ellenőrizendő.
**Nyitva maradt:** Ugyanez a minta (`className` + `style` függvény) a korábbi `Sidebar`, `BottomTabBar` és `Settings` link `Pressable`-jein is megvan: ott az elrendezés a `className`-ből rendben van, de a lenyomás-átlátszóság sem működik. Nem nyúltam hozzájuk (nem kért változtatás); javítás külön kérésre.
**Commit:** `fix: Pressable méretek és kitöltés NativeWinddel`

## 2026-10-15 – Onboarding 1. lépés (feature)

**Mit:** A 01 és 09 design PNG-ből mért méretekkel (kártya 174×120 / 204×145, radius 16, 2 px narancs keret, 50 px logó, 26 px jelölő, CTA 56/58 px, glow). `app/onboarding.tsx`: telefonon 2, tableten 4 oszlop (max. 880 széles, 21 px köz), skeleton / hiba+újra / üres állapot, fix lábléc (CTA „Tovább N szolgáltatóval”, Kihagyom, Régió). `useProvidersStore` (Zustand + AsyncStorage persist, `selectedProviderIds`, `onboardingDone`, `hasHydrated`, `saveProviders`). `useProviders` hook: `watch/providers/movie` + `tv` HU, egyesítve és a TMDB HU `display_priorities` szerint rendezve. A gyökér layout megvárja a store visszatöltését (splash), a `(tabs)/_layout` `<Redirect>`-tel az onboardingra küld, amíg `onboardingDone` hamis. Új: `components/{ProviderCard,ErrorState,OnboardingHeader,OnboardingFooter}.tsx`, `store/useProvidersStore.ts`, `hooks/useProviders.ts`; módosult: `lib/api.ts` (`REGION` konstans), `types/tmdb.ts` (`display_priorities`).
**Fájlok:** app/onboarding.tsx, app/_layout.tsx, app/(tabs)/_layout.tsx, components/ProviderCard.tsx, components/ErrorState.tsx, components/OnboardingHeader.tsx, components/OnboardingFooter.tsx, store/useProvidersStore.ts, hooks/useProviders.ts, lib/api.ts, types/tmdb.ts
**Tesztelve:** `npm run lint`, `npm run typecheck`, `expo export --platform ios` (lefordul). A `mergeProviders` logikát a valós HU TMDB-adaton futtattam (45 szolgáltató, nincs duplikátum, nincs logó nélküli). Szimulátoron / eszközön NEM futott (a gépen nincs szimulátor-eszköz): a vizuális egyezés a designnal, a tablet elrendezés, a store visszatöltés + átirányítás és a supabase-js futása az appban még ellenőrizendő.
**Nyitva maradt:** (1) **Sorrend:** a TMDB HU listában a HBO Max a 28., a SkyShowtime a 23. helyen van, az RTL+ nincs benne; előttük JustWatch TV, Apple TV Store stb. Provider ID-t nem hardcode-oltam, a javítás (névalapú „kiemelt elöl” lista vagy relevancia szolgáltatónként `discover` darabszámmal) döntésre vár. (2) A design 7 kártyás; a valós lista hosszú, ezért a lábléc fix (D-024). (3) A 2. lépés (Kids korhatár) külön feladat: addig a „Tovább” lezárja az onboardingot és a főoldalra visz; a 2. lépés ide illeszti be magát. (4) Oldalsáv „SZOLGÁLTATÓIM” logósor még nincs: a kiválasztott szolgáltatók logóihoz közös hook kell (a Beállítások „Szolgáltatóim”-nak is), a Settings feladatnál / külön lépésben. (5) A „Szolgáltatók szerkesztése” a Beállításokból ezt a képernyőt használhatja: a kezdő kijelölés a store-ból jön, a „Kihagyom” a mentettet érintetlenül hagyja. (6) A betűtípus (Nunito) vizuális egyezése és a `ErrorState` újrafelhasználása a „Közös komponensek” feladatban.
**Commit:** `feat: onboarding 1. lépés szolgáltató választás`

## 2026-10-15 – Assets és constants/images.ts (setup)

**Mit:** A felhasználó által elhelyezett `assets/images/logo.png` és `tmdb-logo.png` (mindkettő 1254×1254) bekerült a repóba; új `constants/images.ts` a centralizált `images = { logo, tmdbLogo }` objektummal a CLAUDE.md szerint, és `types/images.d.ts`, mert az Expo SDK 57 típusai nem deklarálják a `*.png` importot.
**Fájlok:** assets/images/logo.png, assets/images/tmdb-logo.png, constants/images.ts, types/images.d.ts
**Tesztelve:** `npm run lint`, `npm run typecheck`. Képernyőn még nem használt.
**Nyitva maradt:** A `logo.png` négyzetes, sötét háttérrel (szójel + felirat benne); az oldalsáv/onboarding fejlécében használt méretezés vagy a splash/app ikon cseréje külön döntés (az `app.json` ikonjai még a template-éi). A `tmdb-logo.png` a TMDB hivatalos arculati szabályait követi-e, a Beállítások/Névjegy feladatnál ellenőrizni.
**Commit:** `setup: assets és constants/images.ts`

## 2026-10-15 – Navigációs váz (feature)

**Mit:** A 02 és 10 design alapján (PNG-ből mért méretekkel/színekkel): `expo-router/ui` headless `Tabs`. Telefonon alsó tab bar (`#0F0F0F`, felső vonal, aktív = narancs ikon + félkövér felirat), `width >= 768`-tól bal oldalsáv (270 px, `#151515`, jobb oldali vonal, Mymoviescanner szójel narancs ponttal, kijelölt elem `#2D2D2D` lekerekítve, elválasztó, Settings link). Ikonok: SF Symbols az `expo-symbols`-szal. Route-ok: `app/(tabs)/` index, browse, kids, search, watchlist + `app/settings.tsx`, mind üres, címmel (`ScreenPlaceholder`). Root: `Stack` (tabs + settings), sötét navigációs téma, `StatusBar light`, a splash a betűk betöltése után tűnik el. Új fájlok: `components/{AppTabs,BottomTabBar,Sidebar,ScreenPlaceholder}.tsx`, `data/tabs.ts`; tokenek: `tabBar`, `separator`, `layout.sidebarWidth/tabBarHeight`. A template demót töröltem (komponensek, hookok, demo képernyők, nem használt demo képek) és a `theme.ts` template maradékát is (D-021).
**Fájlok:** app/_layout.tsx, app/(tabs)/*, app/settings.tsx, components/*, data/tabs.ts, constants/theme.json, constants/theme.ts, global.css (+ törölt template fájlok)
**Tesztelve:** `npm run lint`, `npm run typecheck`, `expo export --platform ios` (lefordul). Szimulátoron és Expo Go-n NEM néztem meg, sem iPhone-on, sem iPaden: a tab váltás, az oldalsáv és a vizuális egyezés a designnal ellenőrizendő.
**Nyitva maradt:** (1) „MY SERVICES” logósor az oldalsáv alján: a `useProvidersStore` és a logók az Onboarding feladattal jönnek, addig nincs a sávban. (2) A telefon Home jobb felső beállítások ikonja a Főoldal hero feladatnál készül; addig a Settings telefonon nem elérhető. (3) A `>= 768` szabály miatt az iPhone fekvő állásban (pl. Pro Max, ~932 pt) is oldalsávot kap; a CLAUDE.md szerint így maradt, ha zavaró, finomítani kell. (4) A 270 px-es oldalsávszélesség a design pixelértéke, nem pt-re skálázva; iPad portrait-ban szűk lehet, az „iPad finomhangolás” feladatnál ellenőrizni. (5) A typed routes típusait az Expo generálja (`.expo/types`, gitignore-os): friss klónon egyszer `npx expo start` kell a typecheck előtt. (6) SF Symbols csak iOS-en jelenik meg (az app iPhone/iPad), webre/Androidra nem alkalmas.
**Commit:** `feat: navigációs váz tab bar és oldalsáv`

## 2026-10-15 – Nunito betűtípus (setup)

**Mit:** A jóváhagyásoddal hozzáadtam a `@expo-google-fonts/nunito` csomagot (az `expo-font` már megvolt, a config plugin bekerült az `app.json`-ba). Az `app/_layout.tsx` betölti a 4 súlyt (400, 600, 700, 800), és a betöltésig nem renderel. A `theme.json` új `fonts` kulcsa → `tailwind.config.js` `fontFamily`: `font-nunito`, `font-nunito-semibold`, `font-nunito-bold`, `font-nunito-extrabold`; a `theme.ts` exportálja (`fonts`). A `fontSize` tokenekből kikerült a beágyazott `fontWeight` (egyedi betűcsaláddal nem működik), a súlyt a `font-nunito-*` osztály adja.
**Fájlok:** package.json, package-lock.json, app.json, app/_layout.tsx, constants/theme.json, constants/theme.ts, tailwind.config.js
**Tesztelve:** `npm run lint`, `npm run typecheck`, `expo export --platform ios` (lefordul, a font-assetek bekerültek). Szimulátoron/Expo Go-n még nem néztem.
**Nyitva maradt:** a betűk vizuális egyezése a designnal (Nunito vs. a design tényleges fontja) az első képernyőnél ellenőrzendő. Minden `Text`-nek explicit `font-nunito*` osztály kell (RN-ben nincs globális alapfont); ha ismétlődik, közös szövegkomponens jöhet. A template demo `ThemedText` még a rendszerfontot használja, a navigációs váz törli.
**Commit:** `setup: Nunito betűtípus`

## 2026-10-15 – strings.ts felhasználói átnézése (docs)

**Mit:** A felhasználó átnézte és javította a `constants/strings.ts`-t: „A szolgáltatóimon” → „Előfizetéseim”, „Szolgáltatóim” → „Előfizetéseim” (Böngészés), a találatszám „… cím a(z) N kínálatában”, a „Bérlés” → „Kölcsönzés” (Search chip és Watchlist „Csak kölcsönzés”).
**Fájlok:** constants/strings.ts
**Tesztelve:** –
**Nyitva maradt:** A CLAUDE.md és a D-012 még „Bérlés”-t ír; a `title.*` és későbbi szövegeknél az új szóhasználatot („Kölcsönzés”, „Előfizetéseim”) követem. A Böngészés találatszám-szövegében a „kínálatában” mellé a szolgáltatók számát jelző `services` paraméter már nem szerepel a szövegben (a függvény aláírása változatlan) — a Böngészés feladatnál ellenőrizni.
**Commit:** `docs: strings.ts szóhasználat javítása`

## 2026-10-15 – Design tokenek és magyar szövegek (feature)

**Mit:** Megnyitottam a 02, 10, 04 design PNG-ket, és a színeket pixelből olvastam ki (Pillow, csak a scratchpadben). Tokenek a `constants/theme.json`-ban: háttér/felület/chip/akcentus/szövegek a CLAUDE.md szerint, plusz a PNG-ből: `sidebar #151515`, `sidebarSelected #2D2D2D`, `kidsBlue #62D1FE`, `kidsMint #66E3BD`, `kidsMintSoft #0C1F1B`, `kidsYellow #FED50A`, `ctaText #000`; radius (card 12, cardLarge 16, button 16, pill), fontSize (title 34, section 22). A `tailwind.config.js` ugyanezt a JSON-t olvassa (`bg-surface`, `text-accent`, `rounded-card`, `text-title` stb.), a `constants/theme.ts` típusosan exportálja (`colors`, `radius`, `fontSize`, `TABLET_MIN_WIDTH = 768`, `gridColumns`). `constants/strings.ts`: magyar feliratok képernyőnként. `app.json`: `userInterfaceStyle: dark`. A template `Colors/Fonts/Spacing` exportjai ideiglenesen megmaradtak a `theme.ts` alján, mert a template komponensek használják; a navigációs váz törli.
**Fájlok:** constants/theme.json, constants/theme.ts, constants/strings.ts, tailwind.config.js, app.json
**Tesztelve:** `npm run lint`, `npm run typecheck`, `expo export --platform ios` (lefordul). Vizuálisan nem, még nincs token-t használó képernyő.
**Nyitva maradt:** (1) Betűtípus: a design lekerekített, Nunito-szerű betűtípusnak tűnik, nem a rendszerfontnak. Ehhez új könyvtár kell (`@expo-google-fonts/nunito`), ezért nem adtam hozzá; döntésre vár. (2) A pasztell kids kártyaszínek (rózsaszín, narancs, zöld) a posztereken vannak, nincs hozzájuk token; a Kids képernyőnél dől el. (3) A szövegeket Te hagyd jóvá: ahol a magyar fordítás nem szó szerinti (pl. "Újdonságok a szolgáltatóidon", "Emlékeztess").
**Commit:** `feat: design tokenek és magyar szövegek`

## 2026-10-15 – lib réteg és TMDB típusok (backend)

**Mit:** `lib/supabase.ts` (kliens az env kulcsokkal, auth/session kikapcsolva, hiányzó env esetén hibát dob), `lib/api.ts` (típusos `getProviders`, `discover`, `getTrending`, `search`, `getDetails`, mind az `mms-tmdb`-n át, a whitelist tükre), `lib/tmdbImage.ts` (poszter w342, backdrop w1280, szolgáltatólogó w92), `types/tmdb.ts` (Paged, Provider, TitleSummary, TitleDetails, WatchProviderRegion, ReleaseDate; csak a használt mezők).
**Fájlok:** lib/supabase.ts, lib/api.ts, lib/tmdbImage.ts, types/tmdb.ts
**Tesztelve:** `npm run lint`, `npm run typecheck`. Curl-lel az éles függvényen: discover movie (`with_watch_providers=8|337`, flatrate, HU) 200, `movie/603` és `tv/1396` adatlap a négy `append_to_response`-szal 200, `search/multi` 200. A `supabase.functions.invoke` hívás az appból még NEM futott, és az iOS bundle sem fordította be a `lib/`-et, mert még nincs importálva.
**Nyitva maradt:** az első képernyőn (onboarding) ellenőrizni, hogy a supabase-js Expo Go-n polyfill nélkül fut-e. A `logoUrl` (w92) a CLAUDE.md-ben nincs felsorolva, de a szolgáltatólogókhoz kell; a cast profilkép-méretet (`w185`) a Cast feladatnál adjuk hozzá. Sorozatnál a `release_dates` append értelmetlen (ott `content_ratings` van): a TMDB nem hibázik rá, de a sorozat korhatárát a Adatlap feladatnál külön kell megoldani.
**Commit:** `feat: lib réteg és TMDB típusok`

## 2026-10-15 – mms-tmdb deploy és curl teszt (backend)

**Mit:** A kérésedre deployoltam az `mms-tmdb` függvényt a familyBudget projektre (`supabase functions deploy mms-tmdb --use-api`, csak ez az egy függvény). A `TMDB_API_KEY` secret megvan a projektben (csak a nevet ellenőriztem, az értéket nem láttam). A helyi `.env`-et (gitignore-os) kitöltöttem a projekt URL-jével és a publishable (legacy anon) kulccsal.
**Fájlok:** .env (nincs commitban), docs/feature-tasks.md
**Tesztelve:** curl, anon kulccsal. (1) `watch/providers/movie` `watch_region=HU` → 200, 2,7 s (TMDB hívás + cache írás). (2) ugyanaz → 200, 0,37 s (cache találat). (3) nem whitelistes `account` → 403 `path_not_allowed`. (4) érvénytelen paraméterkulcs → 400 `invalid_params`. (5) a válaszban nincs `api_key`.
**Nyitva maradt:** A `discover`, `search` és adatlap végpontok még nincsenek curl-lel kipróbálva, a `lib/api.ts`-ből jönnek majd. A függvény `verify_jwt` bekapcsolt: a kliens a publishable kulccsal hívja. A legacy anon kulcs használatban van; ha a projekt áttér az új `sb_publishable_` kulcsra, a `.env`-et frissíteni kell. A Supabase CLI elavult (2.24.3 → 2.121.0), nem frissítettem.
**Commit:** `fn: mms-tmdb deploy és curl teszt a naplóban`

## 2026-10-15 – Migráció alkalmazva a familyBudget projekten (backend)

**Mit:** A kérésedre alkalmaztam a `202610150930_mms_schema_and_tmdb_cache.sql` tartalmát a familyBudget Supabase projekten (`eguhipjgnhbajbmnrskm`, MCP `apply_migration`, név: `mms_schema_and_tmdb_cache`). Előtte ellenőriztem, hogy az `mms` séma nem létezett. Utána: `mms.tmdb_cache` + pkey + `expires_at` index megvan, RLS be, `anon`/`authenticated` jog nincs, csak `service_role` fér hozzá. Más sémához nem nyúltam.
**Fájlok:** docs/feature-tasks.md (a migrációs fájl változatlan)
**Tesztelve:** katalóguslekérdezések a pg_class / role_table_grants nézetekből.
**Nyitva maradt:** Az MCP a migrációt saját időbélyeggel regisztrálja a `supabase_migrations`-ben, a repó fájlneve (`202610150930`) ettől eltérhet; ha később `supabase db push`-t használunk, ezt egyeztetni kell. A `mms` nincs az exposed schemas között (nem vettem fel). Hátra: `TMDB_API_KEY` secret ellenőrzése, deploy (külön kérésre), curl teszt.
**Commit:** `docs: mms migráció alkalmazása a naplóban`

## 2026-10-15 – Edge Function mms-tmdb (backend)

**Mit:** Megírtam az `mms-tmdb` függvényt. POST `{ path, params }`; a `path` whitelistes (discover movie/tv, trending, search multi/movie/tv/person, watch/providers movie/tv, movie/:id, tv/:id), minden más 403. A paraméterek validáltak (kulcs-formátum, max 20 db, max 300 karakter, `api_key` eldobva), `language` alapból `hu-HU`. Cache: `mms.tmdb_cache`, kulcs = path + rendezett paraméterek; TTL lista/discover/trending/search 6 óra, szolgáltatólista 24 óra, adatlap 7 nap. Cache hiba nem töri el a kérést. A TMDB kulcs `TMDB_API_KEY` secretből jön, nem kerül válaszba/logba. A `supabase/functions` kikerült a tsconfig és az ESLint hatóköréből (Deno kód).
**Fájlok:** supabase/functions/mms-tmdb/index.ts, tsconfig.json, eslint.config.js
**Tesztelve:** NEM futott. Nincs deno a gépen, a lokális `functions serve` Dockert kér, és a migráció sincs alkalmazva. `npm run lint` és `npm run typecheck` tiszta.
**Nyitva maradt:** A whitelist a függvényben él; a `lib/api.ts`-nek tükröznie kell (D-017). Deploy és curl teszt a következő sor, a migráció és a secret után. A kulcsnévhez nincs érték, a TMDB kulcsot Te állítod be.
**Commit:** `fn: mms-tmdb Edge Function whitelisttel és cache-sel`

## 2026-10-15 – Migráció: mms séma és tmdb_cache (backend)

**Mit:** Megírtam a migrációt: `mms` séma, `mms.tmdb_cache (key, payload, expires_at)`, index az `expires_at`-ra, RLS bekapcsolva policy nélkül, jogok elvéve `public/anon/authenticated`-től, `service_role`-nak megadva. Csak `if not exists`, nincs drop.
**Fájlok:** supabase/migrations/202610150930_mms_schema_and_tmdb_cache.sql
**Tesztelve:** nem futtattam, az éles (familyBudget) adatbázisra NEM lett alkalmazva.
**Nyitva maradt:** Alkalmazás (kifejezett kérésedre, pl. `supabase db push` vagy MCP `apply_migration`). A `mms` sémát nem szabad felvenni a Supabase "Exposed schemas" listába. Lejárt sorok takarítása még nincs (később cron vagy a függvényben).
**Commit:** `db: mms séma és tmdb_cache migrációja`

## 2026-10-15 – app.json: iPad és orientációk (setup)

**Mit:** `ios.supportsTablet: true`, `orientation: "default"` (portrait + landscape iPhone-on és iPaden).
**Fájlok:** app.json
**Tesztelve:** `npm run lint`, `npm run typecheck`; szimulátoron nem.
**Nyitva maradt:** `bundleIdentifier` még nincs megadva (EAS Build előtt kell); `userInterfaceStyle` még `automatic`, a design sötét – a "Design tokenek" feladatnál `dark`-ra kell állítani.
**Commit:** `setup: iPad támogatás és minden orientáció`

## 2026-10-15 – Függőségek (setup)

**Mit:** `npx expo install` zustand, @react-native-async-storage/async-storage, @supabase/supabase-js; az expo-image már a template-ben volt, az `expo install` felvette a config pluginját az `app.json`-ba.
**Fájlok:** package.json, package-lock.json, app.json
**Tesztelve:** `npm run lint`, `npm run typecheck`
**Nyitva maradt:** a supabase-js React Native-on AsyncStorage/URL polyfill igényét a `lib/supabase.ts` írásakor ellenőrizni (auth nincs, így valószínűleg nem kell).
**Commit:** `setup: zustand, async-storage, expo-image, supabase-js`

## 2026-10-15 – NativeWind (setup)

**Mit:** NativeWind 4.2.7 + Tailwind 3 telepítve a hivatalos Expo útmutató szerint (SDK 57, Reanimated 4 → `react-native-worklets` is). Új: `tailwind.config.js`, `babel.config.js`, `metro.config.js`, `nativewind-env.d.ts`; a `global.css` elejére a Tailwind direktívák kerültek (a template webes font változói megmaradtak), és az `app/_layout.tsx` importálja.
**Fájlok:** package.json, package-lock.json, tailwind.config.js, babel.config.js, metro.config.js, nativewind-env.d.ts, global.css, app/_layout.tsx
**Tesztelve:** `npm run lint`, `npm run typecheck`, `expo export --platform ios` (a bundle lefordul). Szimulátoron className még nem volt kipróbálva.
**Nyitva maradt:** első valódi className használatnál vizuális ellenőrzés; a Tailwind `content` csak az `app/` és `components/` mappát nézi.
**Commit:** `setup: NativeWind konfigurálása`

## 2026-10-15 – .env, .env.example, .gitignore (setup)

**Mit:** `.env.example` a két kliens kulcsnévvel (érték nélkül), helyi üres `.env` ugyanezekkel; a `.gitignore` mostantól kizárja a `.env`-et.
**Fájlok:** .env.example, .gitignore (a `.env` gitignore-os, nem kerül commitba)
**Tesztelve:** `git check-ignore .env`
**Nyitva maradt:** a `.env` értékeit (Supabase URL + publishable/anon kulcs) a felhasználónak kell kitöltenie.
**Commit:** `setup: .env.example és .gitignore`

## 2026-10-15 – Expo projekt + lint/typecheck scriptek (setup)

**Mit:** Expo SDK 57 `default` template legenerálva (a nem üres mappa miatt ideiglenes helyen), a tartalma a projekt gyökerébe másolva. A `src/` mappát a CLAUDE.md mappastruktúrája miatt lapítottam (D-016), a `@/*` alias a gyökérre mutat. `npm install`, `npm run lint` (az `expo lint` az első futáskor telepítette az eslintet és létrehozta az `eslint.config.js`-t) és új `typecheck` script (`tsc --noEmit`); mindkettő hibamentes. A template `reset-project` scriptje, LICENSE, README és `.claude/` nem került át. Ezzel két setup sor zárult egy commitban (a lockfile miatt nem szétválasztható).
**Fájlok:** package.json, package-lock.json, tsconfig.json, app.json, eslint.config.js, .gitignore, AGENTS.md, app/, components/, constants/, hooks/, assets/, global.css, .vscode/
**Tesztelve:** `npm run lint`, `npm run typecheck`. Az appot még nem indítottam.
**Nyitva maradt:** A template demo képernyői (app/index, explore, app-tabs, themed-*) és `constants/theme.ts` még a template-é; a "Design tokenek" és "Navigációs váz" feladatok cserélik. A `expo-env.d.ts` gitignore-os és `expo start` generálja; friss klónon a typecheck előtt egyszer `npx expo start`/`npx expo customize` kell, vagy létre kell hozni (`/// <reference types="expo/types" />`). 29 npm audit figyelmeztetés (template függőségek), nem kezeltem.
**Commit:** `setup: Expo projekt, lint és typecheck scriptek`

## 2026-10-15 – Git init és meglévő doksik (setup)

**Mit:** Git repo létrehozva (`main`), az eddigi CLAUDE.md, docs/ (feature-tasks, prompts, design PDF + 16 PNG) bekerült az első commitba. Ezzel három setup sor zárult: git init, design mappa, CLAUDE.md + docs. A sorrend eltér a listától: a git init az Expo scaffold ELŐTT történt, hogy a scaffold külön commitot kaphasson.
**Fájlok:** .gitignore, CLAUDE.md, docs/*
**Tesztelve:** git status
**Nyitva maradt:** Expo scaffold, a többi setup sor
**Commit:** `init`

## 2026-10-15 – Design beemelése

**Mit:** A jóváhagyott design (16 képernyő, iPhone + iPad) bekerült a `docs/design/` mappába PDF-ként és képernyőnkénti PNG-ként. A CLAUDE.md kapott egy „Design” szakaszt (tokenek, képernyőnkénti elemek, adat–design eltérések), a feature lista képernyőnként hivatkozik a designra.
**Fájlok:** docs/design/*, CLAUDE.md, docs/feature-tasks.md
**Tesztelve:** –
**Nyitva maradt:** Onboarding 2. lépés tartalma (ideiglenesen Kids korhatár), D-011 – D-015 felhasználói megerősítése
**Commit:** `docs: jóváhagyott design és design szabályok`

## 2026-10-15 – Projekt előkészítés

**Mit:** Elkészült a CLAUDE.md, a feature task lista és a döntésnapló (D-001 – D-010).
**Fájlok:** CLAUDE.md, docs/feature-tasks.md, docs/prompts.md
**Tesztelve:** –
**Nyitva maradt:** logó és design képernyők generálása (nem blokkoló), Setup szakasz
**Commit:** `docs: projekt előkészítő dokumentáció`

---
---

# Döntésnapló

Ide kerül minden nem triviális döntés, amit később meg lehetne kérdőjelezni.
Sorszámozva (`D-001`, `D-002`, …), hogy commit üzenetből hivatkozni lehessen rá.

**Mit kell rögzíteni:** eltérés a designtól, könyvtár hozzáadása vagy elvetése,
adatszerkezet- és sémaválasztás, ismert korlátozással továbbengedett feature,
workaround (platform bug, teljesítmény, animációs trükk).

Sablon:

```
## D-00N – [rövid cím]
**Dátum:** ÉÉÉÉ-HH-NN
**Döntés:** mit választottunk.
**Miért:** az indok.
**Alternatíva:** mit vetettünk el, és mi lett volna vele a baj.
**Visszavonható?** igen / nem — ha nem, miért nem.
```

---

## D-001 – Expo + React Native, TypeScript
**Dátum:** 2026-10-15
**Döntés:** Expo + React Native + Expo Router, TypeScript strict, NativeWind, Zustand.
**Miért:** iPhone és iPad egy kódbázisból; ismert stack, jól dokumentált, az AI ehhez ad legjobb kódot.
**Alternatíva:** natív SwiftUI – jobb Apple TV-s érzet, de dupla munka, ha Android is kell.
**Visszavonható?** nem olcsón — a teljes UI réteg erre épül.

## D-002 – Nincs auth, eszközönkénti tárolás
**Dátum:** 2026-10-15
**Döntés:** v1-ben nincs bejelentkezés; előfizetések, watchlist, beállítások AsyncStorage-ban.
**Miért:** családi használat, első lépésben elég; nincs fiókkezelés, nincs személyes adat a szerveren.
**Alternatíva:** Supabase Auth + szinkronizált családi watchlist – később bevezethető.
**Visszavonható?** igen — a store-ok alakja átvihető szerveroldalra.

## D-003 – Backend: familyBudget Supabase projekt, `mms` séma
**Dátum:** 2026-10-15
**Döntés:** a meglévő familyBudget Supabase projektet használjuk; minden Mymoviescanner objektum a `mms` sémában, a függvények `mms-` prefixszel.
**Miért:** nincs új projekt és költség; a séma-szétválasztás megvédi a familyBudget adatait.
**Alternatíva:** külön Supabase projekt – tisztább, de plusz projekt-kvóta és kezelés.
**Visszavonható?** igen — a `mms` séma és a függvény átköltöztethető.

## D-004 – TMDB adatforrás Edge Function proxyn keresztül
**Dátum:** 2026-10-15
**Döntés:** a TMDB API-t az `mms-tmdb` Edge Function hívja, whitelisttel és `mms.tmdb_cache` cache-sel; a kulcs Supabase secret.
**Miért:** a kulcs nem kerül a kliensbe; a cache csökkenti a hívásokat és gyorsít.
**Alternatíva:** közvetlen TMDB hívás a kliensből – egyszerűbb, de a kulcs kiolvasható a bundle-ből.
**Visszavonható?** igen.

## D-005 – Streaming-elérhetőség: TMDB watch providers (JustWatch adat), HU régió
**Dátum:** 2026-10-15
**Döntés:** a „hol nézhető” adat a TMDB `watch/providers` végpontjából jön, `watch_region=HU`; provider ID-k dinamikusan.
**Miért:** ingyenes nem kereskedelmi célra, magyar régiót is lefed; nincs saját scraping.
**Alternatíva:** JustWatch scraping – ToS-ellenes és törékeny.
**Visszavonható?** igen. **Feltétel:** TMDB és JustWatch forrásmegjelölés kötelező.

## D-006 – Blu-ray: HU, ha nincs adat, DE
**Dátum:** 2026-10-15
**Döntés:** fizikai megjelenések TMDB `release_type=5` alapján, `region=HU`; üres eredménynél `region=DE`, a UI-ban jelölve.
**Miért:** a magyar fizikai megjelenési adat a TMDB-ben nagyon hiányos; a német lista teljesebb és onnan rendelhető.
**Alternatíva:** UK régió, vagy blu-ray.com scraping (nincs nyilvános API, ToS-kockázat).
**Visszavonható?** igen.

## D-007 – Gyerek korhatár: DE FSK fallback
**Dátum:** 2026-10-15
**Döntés:** korhatár-szűrés `certification_country=DE` alapján (0 / 6 / 12), műfaj: animáció + családi.
**Miért:** magyar korhatár-adat a TMDB-ben hiányos; az FSK fokozatok illeszkednek a 0+/6+/12+ chipekhez.
**Alternatíva:** HU korhatár – kevés találat; US MPAA – nem illeszkedik a fokozatokhoz.
**Visszavonható?** igen.

## D-008 – Design irány: Apple TV app stílus
**Dátum:** 2026-10-15
**Döntés:** sötét felület, nagy hero, poszter-rail-ek, egy akcentus (#FF9F0A); telefonon tab bar, iPaden oldalsáv; gyerek sarok azonos layout, színesebb akcentus.
**Miért:** a felhasználó ezt kérte referenciaként; posztercentrikus tartalomhoz ideális.
**Alternatíva:** világos, kártyás JustWatch-szerű UI.
**Visszavonható?** igen, theme szinten.

## D-009 – Scope: kihagyott funkciók v1-ből
**Dátum:** 2026-10-15
**Döntés:** nem kerül bele: családtag-profilok, fiók/szinkron, push értesítés, TV-app, közösségi funkciók.
**Miért:** a v1 célja a működő alap-flow; ezek egyenként később bővíthetők.
**Alternatíva:** –
**Visszavonható?** igen.

## D-010 – Commit minden művelet után
**Dátum:** 2026-10-15
**Döntés:** egy művelet = egy commit (setup lépés, migráció, függvény, fix, konfig, doksi is), a munkanapló frissítésével együtt.
**Miért:** a felhasználó kifejezett kérése; visszakövethető, könnyen visszaállítható történet.
**Alternatíva:** feature-szintű commitok – kevesebb, de nagyobb, nehezebben visszaállítható commitok.
**Visszavonható?** igen.

## D-011 – Design szövegek magyarul
**Dátum:** 2026-10-15
**Döntés:** a design angol feliratai magyarul jelennek meg, központi `constants/strings.ts`-ből; layout és stílus változatlan.
**Miért:** a család magyarul használja, a design Settings is „App language: Magyar”-t mutat; a TMDB adat is `hu-HU`.
**Alternatíva:** angol UI szó szerint a design szerint – a magyar címekkel keverten furcsa lenne.
**Visszavonható?** igen, egy fájl.

## D-012 – Hol nézhető: ár és minőség nélkül
**Dátum:** 2026-10-15
**Döntés:** a Where to watch sorban szolgáltató + típus (Előfizetés/Bérlés/Vásárlás) látszik; ár és HD/4K jelölés nincs, a gomb a TMDB/JustWatch linket nyitja. A „Prices shown in” beállítás kimarad.
**Miért:** a TMDB watch providers nem ad árat, minőséget, bérlési időt.
**Alternatíva:** JustWatch nem hivatalos API – ToS-kockázat, törékeny.
**Visszavonható?** igen, ha lesz árforrás.

## D-013 – Értesítések nélkül (Notifications, Remind me)
**Dátum:** 2026-10-15
**Döntés:** a Settings Notifications szekciója rejtve; az adatlap „Remind me” gombja watchlistre teszi a címet Blu-ray státusszal.
**Miért:** a push a v1 scope-on kívül van (D-009), de a funkció szándéka a watchlisttel részben teljesül.
**Alternatíva:** lokális értesítés (expo-notifications) a Blu-ray dátumra – új könyvtár, v2-ben jöhet.
**Visszavonható?** igen.

## D-014 – Blu-ray formátum badge
**Dátum:** 2026-10-15
**Döntés:** a 4K UHD / Steelbook / Blu-ray badge a TMDB release `note` mezőjéből jön, ha nincs, „Blu-ray”.
**Miért:** a TMDB-ben nincs külön formátum mező; a note gyakran tartalmazza.
**Alternatíva:** badge elhagyása – eltérne a designtól.
**Visszavonható?** igen.

## D-015 – Trending in Hungary és Kids témák
**Dátum:** 2026-10-15
**Döntés:** a „Trending in Hungary” discover `region=HU`, `watch_region=HU`, népszerűség szerint; a Kids téma chipek TMDB keywordökkel szűrnek (ID-k `data/kidsThemes.ts`-ben).
**Miért:** a TMDB trending végpont csak globális; a téma chipekre nincs műfaj.
**Alternatíva:** globális trending – nem magyar.
**Visszavonható?** igen.

## D-016 – Gyökérszintű mappastruktúra (nincs `src/`)
**Dátum:** 2026-10-15
**Döntés:** az Expo template `src/` mappáját lapítottam: `app/`, `components/`, `constants/`, `hooks/` a projekt gyökerében, `@/*` → `./*`.
**Miért:** a CLAUDE.md mappastruktúrája gyökérszintű; így a doksi és a kód egyezik.
**Alternatíva:** a template `src/` elrendezése megtartva – az Expo alapértelmezése, de eltérne a CLAUDE.md-től és minden útvonalat át kellene írni a doksikban.
**Visszavonható?** igen, mappa-mozgatás és alias.

## D-017 – Közvetlen Postgres a függvényben, whitelist a függvényben
**Dátum:** 2026-10-15
**Döntés:** az `mms-tmdb` a cache-t `npm:postgres`-szel, a beépített `SUPABASE_DB_URL`-en éri el, a whitelist a függvény saját `ROUTES` listája; a `lib/api.ts` csak tükrözi.
**Miért:** a `mms` séma nincs kitéve a PostgREST-nek, így a supabase-js nem érné el; a függvény nem importálhat kliens kódot, ezért két helyen él a lista.
**Alternatíva:** `mms` séma kitétele a PostgREST-nek (tiltott a szabályok szerint), vagy `public` wrapper RPC (a megosztott sémát érintené).
**Visszavonható?** igen.

## D-018 – Tokenek egy JSON-ban, pixelből kiolvasva
**Dátum:** 2026-10-15
**Döntés:** a design tokenek a `constants/theme.json`-ban élnek; a `tailwind.config.js` és a `theme.ts` is ezt olvassa. A CLAUDE.md-ben nem szereplő színeket a design PNG-kből mintavételeztem.
**Miért:** a NativeWind osztályok és a runtime stílusok (árnyék, ikon-szín) ugyanazt az értéket használják, nincs kétszer felvett hex; a Tailwind config nem tud TypeScriptet (react-native importot) betölteni, JSON-t igen.
**Alternatíva:** hexek a `tailwind.config.js`-ben és a `theme.ts`-ben külön – eltérésveszély; vagy `theme.js` CommonJS – típus nélkül.
**Visszavonható?** igen.

## D-019 – Nunito betűtípus (`@expo-google-fonts/nunito`)
**Dátum:** 2026-10-15
**Döntés:** a design lekerekített betűtípusához a Nunito négy súlya (400/600/700/800) külön betűcsaládként töltődik, tailwind `font-nunito*` osztályokkal.
**Miért:** a design szövegei lekerekített végű, Nunito-szerű betűvel készültek; a felhasználó jóváhagyta az új könyvtárat. A csomag csak a betűfájlokat hozza, nincs natív kód.
**Alternatíva:** rendszerfont (SF) – nulla függőség, de eltér a designtól; vagy a fontfájlok kézi bemásolása az `assets/`-be – több karbantartás.
**Visszavonható?** igen, a `fonts` token és a `_layout` betöltés cserélhető.

## D-020 – Headless tabs (`expo-router/ui`) és SF Symbols ikonok
**Dátum:** 2026-10-15
**Döntés:** a tab bar és az iPad oldalsáv az `expo-router/ui` headless `Tabs/TabList/TabTrigger/TabSlot` elemeire épül egyedi komponensekkel; az ikonok SF Symbols (`expo-symbols`).
**Miért:** a design tab bar és az oldalsáv eltér a natív tabtól (narancs aktív állapot, kijelölt pill, Settings elválasztó mögött, alul szolgáltatólogók), ezt a headless réteg engedi pontosan; az `expo-symbols` már a projekt része, nincs új könyvtár, és az SF Symbols vonalas stílusa illik a designhoz.
**Alternatíva:** `NativeTabs` (a template-é) – natív érzet, de nem szabható a designra, iPaden nincs egyedi oldalsáv; saját SVG ikonkészlet – új függőség (react-native-svg) és több karbantartás.
**Visszavonható?** igen, a navigáció egy komponenscsoport.

## D-021 – Template demó eltávolítva
**Dátum:** 2026-10-15
**Döntés:** az Expo template demó fájljai (ThemedText/ThemedView, animated-icon, hint-row, collapsible, demo képernyők, hookok, nem használt demo képek, a `theme.ts` template exportjai) törölve.
**Miért:** a CLAUDE.md szerint az `app/` csak a saját route-okat tartalmazza, és a template exportjai a design tokenekkel keveredtek volna.
**Alternatíva:** megtartani a demót a későbbi törlésig – zaj és félrevezető útvonalak (pl. `src/app/index.tsx` felirat).
**Visszavonható?** a git történetből igen.

## D-022 – Onboarding szolgáltatólista: minden HU szolgáltató, elöl a névalapú kiemeltek
**Dátum:** 2026-10-15
**Döntés:** az onboarding a film és sorozat HU szolgáltatóit egyesítve mutatja (logó nélküliek kihagyva). Elöl a `data/featuredProviders.ts` névlistája (a design szolgáltatói) áll a lista sorrendjében, utánuk a többi a TMDB `display_priorities.HU` szerint, azonos prioritásnál névsorban. A felhasználó választása; szűrés nincs, csak sorrend, és nincs ID-hardcode.
**Miért:** a CLAUDE.md szerint a szolgáltatók dinamikusak, provider ID nem hardcode-olható; a TMDB listája nem jelöli, melyik előfizetéses, a TMDB HU sorrendje viszont rossz (HBO Max a 28., SkyShowtime a 23. volt). A névalapú sorrend a listát továbbra is a TMDB-ből veszi, csak a sorrendjét igazítja.
**Alternatíva:** szolgáltatónként `discover` darabszám relevanciának – adatalapú, de 45 hívás az első indításkor; vagy tisztán a TMDB sorrendje – a design első képernyőjétől messze áll.
**Visszavonható?** igen, egy névlista és egy rendezőfüggvény.

## D-023 – Onboarding őr a tabs layoutban, a store visszatöltését a gyökér megvárja
**Dátum:** 2026-10-15
**Döntés:** a `(tabs)/_layout` `<Redirect href="/onboarding">`-ot ad, amíg `onboardingDone` hamis; a gyökér layout a splashen marad a betűk ÉS a `useProvidersStore` visszatöltéséig (`hasHydrated`, nem perzisztált). A „Tovább” és a „Kihagyom” `saveProviders`-szel lezárja az onboardingot és `router.replace('/')`; a 2. lépés megépítésekor a lezárás a 2. lépésre költözik.
**Miért:** a visszatöltés nélkül minden indításkor egy pillanatra az onboarding villanna fel, vagy a már kész felhasználó is átirányítódna. A `Redirect` a dokumentált auth-minta, és az onboarding útvonal elérhető marad a Beállításokból is.
**Alternatíva:** `Stack.Protected` – az onboarding és a tabs kölcsönösen kizárná egymást, így a „Szolgáltatók szerkesztése” nem nyithatná meg a képernyőt.
**Visszavonható?** igen.

## D-024 – Onboarding eltérések a designtól
**Dátum:** 2026-10-15
**Döntés:** (1) A lábléc (Régió, CTA, Kihagyom) a lista alatt fix sáv, nem fedi át a kártyákat: a telefon-PNG-n a „Region: Hungary” egy kártyára rajzolódik, ez a mock túlcsorduló tartalma. Tableten a CTA így a képernyő aljához kerül, nem közvetlenül a rács alá, mert a valós lista hosszabb, mint a 7 kártyás design. (2) A „Tovább” 0 kijelölésnél letiltott (40% átlátszóság), a design ezt nem mutatja; „Kihagyom” ilyenkor is van. (3) A narancs háttérfény a RN `experimental_backgroundImage: radial-gradient(...)` stílusával készült, a sugarak a PNG-ből kiolvasva; ez nem véglegesített RN API.
**Miért:** (1) olvashatóság és érinthetőség; (2) az üres kijelölés értelmetlen CTA-val folytatna; (3) nincs új könyvtár (`expo-linear-gradient`), a CLAUDE.md tiltja az engedély nélküli bővítést.
**Alternatíva:** (1) a design szó szerinti átfedése – olvashatatlan szöveg a kártyán; (3) `expo-linear-gradient` – stabil API, de új függőség.
**Visszavonható?** igen.

## D-025 – Pressable: `style` függvény mellett nincs `className`
**Állapot:** FELÜLÍRVA (D-026): a diagnózis hiányos volt, a `StyleSheet` stílus-függvényben szintén elvész.
**Dátum:** 2026-10-15
**Döntés:** ha egy `Pressable` lenyomás-állapotot használ (`style={({ pressed }) => …}`), akkor az elemen nincs `className`; a statikus stílus `StyleSheet`-ben van, a tokenekből, a gyerekek viszont használhatnak `className`-t.
**Miért:** a NativeWind (css-interop) a `className` mellett kapott `style` függvényt nem alkalmazza, így a méretek és a lenyomás-hatás elvész (az onboarding kártyák és CTA így nem kaptak méretet). Ez egyezik a CLAUDE.md „StyleSheet kivételek” szabályával (Pressable pressed state).
**Alternatíva:** `active:opacity-70` NativeWind osztály a lenyomásra – elkerüli a függvényt, de eltér a CLAUDE.md szabályától, és a dinamikus méret (`width`/`height`) így is külön `style` kellene.
**Visszavonható?** igen.

## D-026 – Pressable: csak `className`, nincs `style` függvény; futásidejű méret burkoló View-n
**Dátum:** 2026-10-15
**Döntés:** a `Pressable`-n nem használunk `style` függvényt (se `StyleSheet`-et, se objektumot függvényben): a stílus `className`, a lenyomás-hatás `active:opacity-*`. Ha a méret futásidőben számolt (pl. rácskártya), akkor a Pressable egy burkoló `View` objektum-stílusú (`style={{ width, height }}`) gyereke, és `h-full w-full`. Ez eltér a CLAUDE.md „StyleSheet kivételek / Pressable pressed state” szabályától, mert ebben a NativeWind-verzióban (4.2.7) a `style` függvény minden stílusát elveszíti.
**Miért:** a felhasználó eszközén ez bizonyítottan hibát okoz (először méret és kitöltés hiányzott, majd, a `StyleSheet`-es átírás után, a teljes stílus). A `className` a Pressable-n, és a `className` + objektum-`style` a View-n bizonyítottan működik.
**Alternatíva:** `TouchableOpacity` (a lenyomás-hatás beépített, `style` függvény nélkül) vagy `cssInterop` regisztráció a Pressable-re – egyik sem volt kipróbálva eszközön, ezért nem választottam.
**Visszavonható?** igen, ha a NativeWind javítja a függvény-stílust.

## D-027 – Betűtípus: iOS rendszerfont (SF), nincs egyedi betöltés
**Dátum:** 2026-10-15
**Döntés:** az app az iOS rendszerfontját használja, a súlyt a `font-semibold/bold/extrabold` osztályok adják; a Nunito és a `@expo-google-fonts/nunito` csomag megszűnik. Felülírja D-019-et.
**Miért:** a design PDF/PNG-n a betű nem lekerekített, hanem SF/Inter jellegű, szűk betűközzel (a D-019 alapjául szolgáló „lekerekített” megítélés téves volt). A rendszerfont iOS-en pont ezt adja, automatikus optikai betűközzel, és nincs betöltési idő vagy extra csomag. Az app csak iPhone/iPad.
**Alternatíva:** Inter betöltése (`@expo-google-fonts/inter`) – a webes mockhoz hasonló, de új csomag és az iOS-en a rendszerfont ugyanazt a hatást adja; vagy a Nunito megtartása – eltér a designtól.
**Visszavonható?** igen, `fontFamily` token + betöltés visszatehető.

## D-028 – Onboarding 2. lépés: ideiglenes Kids korhatár, lezárás a végén, részleges settings store
**Dátum:** 2026-10-15
**Döntés:** (1) A 2. lépés a Gyerek korhatár (0+/6+/12+), a CLAUDE.md ideiglenes szabálya szerint; saját design nincs, az elrendezés az onboarding és a Kids design chipjeiből áll össze. (2) Az onboarding a 2. lépés végén zárul (`completeOnboarding`); az 1. „Tovább” csak ment (`saveProviders`), így félbehagyott onboarding után az app újra az onboardingra visz. A „Kihagyom” mindkét lépésen lezár, a már mentett értékeket érintetlenül hagyva. (3) A korhatár alapértéke 6 (a design Kids képernyőjén is a 6+ a kijelölt). (4) A `useSettingsStore` egyelőre csak a `kidsAgeLimit`-et tartalmazza, a CLAUDE.md többi mezője (`region`, `language`, `hideMature`) a Beállítások feladattal jön. (5) Nincs „Vissza” gomb a 2. lépésen.
**Miért:** (1) a CLAUDE.md szerint a design „STEP 1 OF 2” 2. lépése nem tisztázott, a Kids korhatár az ideiglenes tartalom; új UI-t nem találunk ki, a design chipjét használjuk. (2) A felhasználó a „Kész” előtt kilépve ne kerüljön a főoldalra korhatár nélkül, és a D-023 is ezt írta elő. (3) A korhatárnak alapérték kell, hogy a „Kihagyom” is érvényes állapotot adjon, és a design ezt mutatja. (4) A legkisebb működő verzió; az ismeretlen mezőket nem előre építjük. (5) A design nem ad rá mintát, és a szolgáltatók úgyis szerkeszthetők a Beállításokból.
**Alternatíva:** (2) az 1. „Tovább” zárja le az onboardingot és a 2. lépés opcionális marad – egyszerűbb, de a korhatár-választás kimaradhatna; (4) a teljes store-alak most – használaton kívüli mezők; (5) „Vissza” szöveggomb – új, a designban nem szereplő elem.
**Visszavonható?** igen, egy képernyő és egy store.

## D-029 – Dev reset: globális `__DEV__` gomb, teljes AsyncStorage-törlés + újratöltés
**Dátum:** 2026-10-15
**Döntés:** a fejlesztői visszaállítás egy lebegő gomb a gyökér layoutban (`{__DEV__ ? <DevResetButton /> : null}`), nem a képernyők része. Megnyomásra `AsyncStorage.clear()` és `DevSettings.reload()`; a store-ok így az újraindításkor üresen töltődnek vissza.
**Miért:** Expo Go-ban nincs projektenkénti adattörlés, az onboarding tesztelése újratelepítést kért volna. A gyökér layoutba tett overlay nem érinti a képernyők kódját, és egy fájl + egy sor törlésével eltávolítható. A `clear()` + újratöltés a későbbi store-oknál (watchlist, keresés) sem igényel karbantartást, és nem kell a futó képernyők helyi állapotát (pl. az onboarding `step`-jét) külön nullázni.
**Alternatíva:** store-onként `persist.clearStorage()` / `setState` újratöltés nélkül – minden új store-ot fel kell venni, és az onboarding képernyő helyi állapota megmaradna; gomb a Beállításokban – a képernyő még nem kész, és az onboarding alatt nem érhető el; `DevSettings.addMenuItem` (a rázásos menüben) – Expo Go saját menüjében nem biztos, hogy megjelenik.
**Visszavonható?** igen, `components/DevResetButton.tsx` és a sora az `app/_layout.tsx`-ben.

## D-030 – Poszter kártya: státusz-pill túllóg, 12 px pill-betű, 14 px sarok, nincs-poszter tartalék
**Dátum:** 2026-10-15
**Döntés:** (1) A bal felső státusz-pill a vágó poszter-konténeren kívül rajzolódik, és a designhoz hasonlóan kissé (legfeljebb 8 px) túllóghat a kártya jobb szélén; a formátum-pill (jobb felül) a poszteren belül marad. Hosszabb felirat: a betű iOS-en legfeljebb 80%-ig zsugorodik, utána három pont. (2) A pill szövege 12 px félkövér (a PNG-ből mért 112 px-es pill-szélességből és 9 px-es nagybetű-magasságból). (3) A poszter sarokrádiusza 14 px (mért), új token: `radius.poster`; a 1 px halvány keret `white/7%`-os, a posztert fedő réteg. (4) Ha a TMDB-nek nincs posztere, a kártya `surface` színű, rajta a cím másodlagos színnel (a design nem mutat ilyet; ez a legkisebb tartalék). (5) A pillek feketéje 70%-os (a design pixelértékeiből).
**Miért:** (1) a design 3 oszlopos telefonos Watchlistjén az „Available now” és „Streaming 2027” pill is túllóg; a poszterhez vágva a felirat csonkulna („Elérhető …”), ami információvesztés. (2) a SF-fel azonos arányok mellett ez adja a design pill-szélességét. (3) a mérés 14 px-et adott, a tokenek 12 és 16 között nem fedik. (4) poszter nélküli cím ne legyen üres, névtelen négyzet.
**Alternatíva:** (1) a pill a poszterbe vágva rövidített felirattal – olvashatatlan; a felirat rövidítése („Elérhető”) – a szöveg a Te döntésed; (3) a meglévő `card` (12) vagy `cardLarge` (16) token – 2 px-es eltérés a designtól.
**Visszavonható?** igen, egy komponens és egy token.

## D-031 – `PosterRail` általános, saját margóval; `PosterCard` adatfüggetlen és nem navigál
**Dátum:** 2026-10-15
**Döntés:** a `PosterRail<T>` általános (`data`, `renderCard(item, cardWidth)`), és a design szerinti kártyaszélességet, közt és oldalsó margót maga veszi a `railLayout` tokenből a breakpoint szerint, így a képernyő csak adatot és állapotot ad. A `PosterCard` csak megjelenítési propokat kap (poszter, logó, formátum, státusz, alcím, `onPress`), nem tud TMDB-típusról és route-ról. Az üres állapot külön `EmptyState` (nincs újrapróbálás), a hiba az `ErrorState`.
**Miért:** a Főoldal több railje (új a szolgáltatóimon, Blu-ray) ugyanígy néz ki, ismétlés nélkül; a TMDB-típus és a szolgáltató-logó eredete (a `discover` nem ad szolgáltatót, lásd a „Közös komponensek” munkanapló-bejegyzés Nyitva pontját) a hookok dolga. Az Adatlap route még nincs, ezért a navigációt a képernyő köti be.
**Alternatíva:** a képernyő adja át a méretet minden railnek – ismétlődő propok; `PosterCard` közvetlenül `TitleSummary`-t kapjon – összekötné a komponenst a TMDB-alakkal, pedig a Watchlist saját elemtípust használ (`WatchlistItem`).
**Visszavonható?** igen.

## D-032 – „Új a szolgáltatóimon”: szolgáltatónkénti discover, hero adatai az adatlapból, videók nyelve
**Dátum:** 2026-10-15
**Döntés:** (1) A lista szolgáltatónként és típusonként (film, sorozat) egy `discover`: `watch_region=HU`, `with_watch_providers=<egy ID>`, `flatrate`, dátum szerint csökkenő (film: `primary_release_date`, sorozat: `first_air_date`), a mai napnál nem későbbi dátummal; az eredményt egyesítem, dátum szerint rendezem, ismétlődést kiszűrök (az első szolgáltató marad), és az első 20-at mutatom. A CLAUDE.md `<id1>|<id2>` alakja helyett nem egy hívás, mert a `discover` nem mondja meg, melyik szolgáltatón van a cím. (2) A hero az első 5 hátteres cím; a műfaj, hossz, korhatár (HU, ennek híján DE; sorozatnál nincs) és előzetes címenként egy `getDetails`-ből jön. (3) A `getDetails` `include_video_language=hu,en,null`-t kap.
**Miért:** (1) a szolgáltató-logó és az „Ma · Netflix” alcím a designban kötelező, és ezt csak a szolgáltatónkénti lekérdezés adja ingyen; 4 szolgáltatónál 8 hívás, szemben a címenkénti `watch/providers` ~22 hívásával. A jövőbeli dátumok kiszűrése kell, mert a megjelenés előtti címek is kaphatnak szolgáltatót. (2) a műfajnevekhez nincs engedélyezett genre-lista végpont, a részletek viszont magyar műfajnevet, hosszt és korhatárt is adnak, és a hívások 7 napra cache-eltek. (3) a `language=hu-HU` mellett a TMDB 0 videót ad (curl: 0 vs. 29).
**Alternatíva:** (1) egy discover az összes szolgáltatóra + címenként `watch/providers` – több hívás; a műfajok statikus id→név táblája (`data/`) – elavulhat és a nevek kézzel vitt fordítások; (3) nincs: videó nélkül az Előzetes gomb mindig halott lenne.
**Visszavonható?** igen, egy hook és egy paraméter.

## D-033 – Watchlist store előrehozva, „+” állapot, hero átmenet könyvtár nélkül
**Dátum:** 2026-10-15
**Döntés:** (1) A `useWatchlistStore` (`items`, `toggle`) a CLAUDE.md alakjával már most elkészült, mert a hero „+” gombja ezt váltja; a Watchlist feladat erre építi a képernyőt. (2) A gomb a listán lévő címnél pipát (akcentszínű) mutat „+” helyett: a design csak az alapállapotot mutatja. (3) A hero kép feletti sötétítés RN `experimental_backgroundImage` lineáris átmenet (alul: feketébe, iPaden balról is), nem `expo-linear-gradient`. (4) A felső sáv ikon-margója iPaden 35 px (a rail margója), nem a hero szövegének 43 px-e: a design szerint.
**Miért:** (1) holt „+” gomb helyett működő; a store alakja már rögzített, nincs kockázat. (2) az állapotjelzés nélküli gomb nem mutatná, hogy a címet felvettük. (3) új könyvtárat nem adunk hozzá engedély nélkül, és a D-024 már bevált eszközön ezen az API-n.
**Alternatíva:** (1) a „+” gomb később kötve – addig dead UI; (3) `expo-linear-gradient` – stabil API, de új függőség.
**Visszavonható?** igen.

## D-034 – Blu-ray rail: dátum és formátum címenkénti adatlapból, „Német megjelenés” a cím alatt, „Összes” nélkül
**Dátum:** 2026-10-15
**Döntés:** (1) A `discover` (`with_release_type=5`, `region`, `release_date` ±60 nap) csak a címlistát adja, a legnépszerűbb 12 jelölttel; a fizikai megjelenés napja és a formátum címenként a `getDetails` `release_dates` bejegyzéséből jön (az ablakba eső típus-5 bejegyzés). (2) A HU → DE váltás a `discover` üres eredményén múlik. (3) A „Német megjelenés” jelzés a rail címe alatti kis szürke sor, csak DE adatnál. (4) A Blu-ray railnek nincs „Összes” hivatkozása.
**Miért:** (1) a `discover` a mozis dátumot adja, nem a lemezét, és a `note` sincs benne; 12 címnél a hívások 7 napra cache-eltek. (3) a CLAUDE.md jelzést kér, a design nem mutat helyet; a cím alatti sor nem módosítja a kártyák elrendezését. (4) nincs célképernyő.
**Alternatíva:** (1) a mozis dátum kiírása – hamis „megjelenés” dátum; (3) a jelzés a kártya alcímében („okt. 9. · Blu-ray · DE”) – zsúfolt, az alcím a designban rövid; (4) „Összes” a Böngészésre – ott a Blu-ray nem szűrhető.
**Visszavonható?** igen.

## D-035 – „Népszerű Magyarországon”: film + sorozat discover, top 9, szám körvonal könyvtár nélkül
**Dátum:** 2026-10-15
**Döntés:** (1) Egy `discover/movie` (`region=HU`) és egy `discover/tv`, mindkettő `sort_by=popularity.desc`, `watch_region=HU` és `with_watch_monetization_types=flatrate|free|ads|rent|buy`; az eredmény egyesítve, `popularity` szerint rendezve, az első 9 poszteres cím. (2) A sorszám körvonalát 8 irányba 1 px-szel eltolt körvonal-színű (`outline`, #48484A) szövegpéldány + egy háttérszínű kitöltés adja. (3) Az elemek szélessége állandó (telefon 172, iPad 201 px), a poszter 32 / 35 px-re kezdődik az elem bal szélétől, a sorszám a poszter bal szélén túlnyúlva van elhelyezve és a poszter eltakarja.
**Miért:** (1) a D-015 `watch_region`-ja önmagában hatástalan, a monetizációs típus teszi tényleges szűrővé (csak HU-ban nézhető címek; a mozis-only cím nem kerül be); a trending végpont csak globális. A film és sorozat egyesítése adja a design vegyes polcát. (2) RN-ben nincs szöveg-körvonal; a `react-native-svg` új könyvtár lenne (engedély nélkül nem adható hozzá), a 9 szövegpéldány × 9 elem elhanyagolható. A design háttere fekete, így a háttérszínű kitöltés a számjegy belsejét üresnek mutatja. (3) a designban a lépték a számjegy szélességétől függően 198–203 px (iPad); az állandó lépték ennek átlaga, a kód egyszerű marad. A top 9: a „10” kétjegyű és az előző kártyára nyúlna.
**Alternatíva:** (2) `react-native-svg` `Text` `stroke`-kal – pontosabb körvonal, de új függőség; (1) a mozis címek is bent – nem „nézhető” lista; (3) természetes szélességű sorszám + negatív margó, mint a mockban – a szélesség az SF számjegy metrikáján múlik, amit eszköz nélkül nem tudok ellenőrizni.
**Visszavonható?** igen, két hook és két komponens.

## D-036 – „Gyerekeknek”: csak film, DE korhatár, a felirat az adatlapból
**Dátum:** 2026-10-15
**Döntés:** a rail a Beállítások / onboarding korhatárát (`kidsAgeLimit`) használja: `discover/movie`, `with_genres=16|10751`, `certification_country=DE`, `certification.lte=<korhatár>`, népszerűség szerint, `watch_region=HU` + monetizációs típusok (mint D-035). Az első 8 backdroppos jelöltre `getDetails` (7 napra cache-elt): a DE korhatár és a magyar műfajnév kerül a felirat alá („0+ éveseknek · Animációs”; a Kids műfajok közül az első). Sorozat nincs: a CLAUDE.md szerinti `10762` sorozat-műfajra a `discover/tv` nem tud korhatárra szűrni. A kártyák száma 8. A hook megvárja a mentett korhatár visszatöltését (`hasHydrated`).
**Miért:** a `discover` nem ad korhatárt és műfajnevet, a `getDetails` a Blu-ray railnél már bevált és magyar műfajnevet is ad, így nincs kézzel vitt műfaj-fordítás (D-032). A korhatár nélküli sorozatok a „korhatár szerint” szűrt polcot hamisítanák. A visszatöltés megvárása elkerüli, hogy az alapérték (6) miatt felesleges, majd a tényleges korhatárral második lekérdezés fusson.
**Alternatíva:** sorozat is (korhatár nélkül) – megsérti a szűrő értelmét; a felirat a kiválasztott korhatárból („6+ éveseknek” minden kártyán) – nem a cím korhatára, a design is címenként mutat; `useKidsTitles`-nek elnevezett hook – a Gyerek sarok feladat adja meg a végleges alakját, a Főoldal rail egyelőre `useKidsPicks`.
**Visszavonható?** igen.

## D-037 – Blu-ray DE fallback: csak a magyar megjelenésű címek
**Dátum:** 2026-10-15
**Döntés:** a D-006 DE fallbackje csak azokat a címeket tartja meg, amelyeknek a `release_dates`-ében van `HU` bejegyzés (bármilyen típus). A HU ág nem változik.
**Miért:** a felhasználó csak olyan megjelenést akar látni, ami nálunk is megjelenik; a mai DE jelöltek fele nálunk nem jelent meg. A magyar bejegyzés a már lekért adatlapból ingyen ellenőrizhető.
**Alternatíva:** a DE fallback törlése – a HU lemezes adat szinte üres, a rail jellemzően üres lenne; a szűrés nélküli DE lista – német-only címeket mutat.
**Visszavonható?** igen, egy feltétel.

## D-038 – Adatlap: gyökér-route tab bar nélkül, iPaden a leírás ideiglenesen a hero alatt
**Dátum:** 2026-10-15
**Döntés:** (1) Az Adatlap a CLAUDE.md szerinti `app/title/[type]/[id].tsx` gyökér `Stack`-route, ezért az alsó tab bar (telefon) és az oldalsáv (iPad) nem látszik rajta, a design viszont mutatja. (2) iPaden a leírás a hero alatt jelenik meg, nem a „Névjegy” oszlopban, amíg a kétoszlopos elrendezés (következő feladat) el nem készül. (3) A hero tetején a „saját szolgáltatóm” sor (iPad) a `watch/providers` HU `flatrate` listájának és a kiválasztott szolgáltatóknak a metszetéből jön, az első találat. (4) A megosztás a rendszer megosztólapját nyitja a címmel és a TMDB linkkel (`themoviedb.org/<type>/<id>`). (5) A TMDB értékelés rejtett, ha 0 (nincs szavazat). (6) A meta legfeljebb két műfajt mutat. (7) A hero a Főoldal hero sötétítését használja, iPaden az oldalsó átmenettel is.
**Miért:** (1) a CLAUDE.md mappastruktúrája kifejezett, az `expo-router/ui` `Tabs` pedig csak a felsorolt `TabTrigger`-eket építi navigátorrá, így egy „rejtett” route-hoz külön trigger kellene, ami nem kipróbált, és a vissza gomb (a designban) amúgy is verem-képernyőt jelez; az egyszerűbb, dokumentált megoldást választottam. (2) a Névjegy oszlop a Rendező / Nyelv / Ország mezőkkel együtt a következő feladat, félkész oszlop nélkül is olvasható az oldal. (3) a design szerint a sor „ON YOUR NETFLIX”; adat a már lekért részletekből jön, nincs új hívás. (4) a TMDB nem ad megosztási linket, a közvetlen TMDB-oldal a legközelebbi nyilvános cím. (5) a nem értékelt cím „0.0”-ja félrevezető. (6) a design két műfajt mutat, egy sorban marad. (7) az iPad design háttere sötét, valós backdropnál a bal oldali szöveg olvashatósága ezt kéri (mint a Főoldal).
**Alternatíva:** (1) a route a `(tabs)` csoportba rejtett `TabTrigger`-rel – megőrizné a chrome-ot, de kipróbálatlan, és eltér a CLAUDE.md-től; saját oldalsáv / tab bar a képernyőn – a navigációs logika duplikálása. (2) a Névjegy oszlop most, üres bal oszloppal – hiányos elrendezés. (4) `Share` csak a címmel – nem nyit semmit a címzettnél.
**Visszavonható?** igen, a route mozgatható és a komponensek változatlanok maradnak.

## D-039 – Adatlap blokkjai: „Megnyitás” gomb, narancs a saját előfizetésen, lemez-kártya régió, telefon chip méret
**Dátum:** 2026-10-15
**Döntés:** (1) A „Hol nézhető” sorok (szolgáltató × mód) „Megnyitás” gombja a HU `watch/providers` `link`-jét nyitja; a gomb narancs (és játék-ikonos), ha a mód előfizetés és a szolgáltató a kiválasztottak között van, különben szürke (a design „Stream” gombja és ár-pirulája helyett, D-012). (2) A „Lemezen” kártya a HU legkorábbi fizikai (típus 5) megjelenését mutatja, ennek híján a DE-ét „Német megjelenés” jelzéssel; a formátum a régió összes fizikai kiadásának `note`-jából („Blu-ray & 4K UHD”, D-014). (3) Az „Emlékeztess” csak hozzáad a watchlisthez (nem vesz le), ha már rajta van, „A watchlistben” pipás, letiltott gomb. (4) A „Szereplők és stáb” a rendezőt (első `Director`) és 11 főszereplőt mutatja; profilkép nélkül monogram, a színátmenet a design 8 körének színeiből körbeforog. (5) A Névjegy nyelve a `spoken_languages`, országa a `production_countries`, magyar névvel az `Intl.DisplayNames`-ből, ennek híján a TMDB neve; a „Hungarian subtitles” (design) nem adható, a TMDB nem ad felirat-adatot. (6) Telefonon a szűrő chipek 15 px-esek, 11 px kitöltéssel, iPaden a design 16 / 16 px-e.
**Miért:** (1) a TMDB nem ad szolgáltatónkénti linket vagy árat; a saját előfizetés kiemelése a design lényege (az orange Stream gomb). (2) a CLAUDE.md D-006 fallbackje és a design két formátuma; a `discover`-hez hasonlóan a TMDB-ben a DVD is típus 5, ezért a „Blu-ray” az alapérték. (3) az „Emlékeztess” a watchlist-hozzáadás (D-013), a levétel véletlen kattintásra veszélyes lenne; a hero gomb már váltja. (4) a design körei színes monogramok; a sorrend stabil. (5) új könyvtár nélkül; a Hermes `Intl.DisplayNames`-támogatása eszközön nem ellenőrizhető, ezért a visszaesés. (6) 407 px-en a magyar „Előfizetés / Kölcsönzés / Vásárlás” a design méretén 371 px, a hely 365.
**Alternatíva:** (1) a „Hol nézhető” szolgáltatónként egy sor több móddal – eltér a designtól, és a szűrő értelmét veszti; (4) csak színészek – a „stáb” nevű blokkból hiányozna; (6) rövidebb szűrőfeliratok („Stream”, „Bérlés”) – a szövegeket Te hagyod jóvá, és a Keresés chipjeivel közösek; vízszintes görgetés a chipeknél – a designban nincs.
**Visszavonható?** igen.

## D-040 – Watchlist státuszok: a szolgáltatóim szerint, részletekből számolva; csúszka gomb nélkül
**Dátum:** 2026-10-15
**Döntés:** (1) A státusz címenként a `getDetails` adatából jön, fontossági sorrendben: **Elérhető most** (HU előfizetéses szolgáltató a kiválasztottak között; ha nincs kiválasztva, bármelyik) → **Blu-ray · dátum** (fizikai megjelenés ma vagy később, HU, ennek híján DE) → **Csak kölcsönzés** / **Csak vásárlás** → **Moziban · hónap** (HU mozis megjelenés az elmúlt 60 napban vagy később) → **Streaming <év>** (még meg nem jelent cím). Ha egyik sem, nincs státusz. (2) „Hamarosan” = minden státuszos cím, ami nem „Elérhető most” (a designban a kölcsönzés is ide számít: 12 + 6 = 18); a státusz nélküli cím csak a „Mind”-ben van. (3) A hook csak a szükséges tényeket (`WatchlistAvailability`) tartja meg, a nagy válasz nem marad a memóriában; a státusz a szolgáltatóim és a mai nap szerint renderkor számolódik. (4) A telefon-design csúszka gombja nincs kirakva (a felhasználó szerint egyelőre nem kell). (5) A `PosterGrid` a kártyaszélességet a képernyő szélességéből számolja (iPaden az oldalsáv nélkül), lefelé kerekítve; a rács nem görgethető, a képernyő ScrollView-jában van.
**Miért:** (1) az app alapelve, hogy a saját előfizetéseinkre szűr, ezért az „Elérhető most” a saját szolgáltatókra vonatkozik; a sorrend a „mit tehetek vele most” logikát követi, és a D-013 szerint az „Emlékeztess” által felvett cím Blu-ray státuszt kap. A TMDB nem ad streaming-premier dátumot, ezért a „Streaming <év>” a megjelenési dátumból jön, ami sorozatnál és streaming-filmnél jó közelítés, mozis filmnél a „Moziban” szabály megelőzi. (2) a design számlálói ezt adják. (3) 20–50 címnél a teljes részletek tárolása felesleges. (4) a gomb funkciója sehol nincs leírva; halott gomb rosszabb a hiányzónál. (5) a Watchlist néhány tíz elemű, a virtualizálás felesleges; a Böngészés végtelen görgetésénél ez külön döntés.
**Alternatíva:** (1) „Elérhető most” bármely HU szolgáltatón – nem tükrözi, hogy nézhető-e nálunk; külön „Nem a szolgáltatóimon” státusz – új UI a designban nincs; (4) a gomb rendezésként (hozzáadás ideje / cím) – kitalált funkció; (5) `FlatList numColumns` – az oszlopszám váltása (forgatás) kulcs-újramountot kér.
**Visszavonható?** igen.

## D-041 – Böngészés: szolgáltatónkénti lekérdezés, statikus műfaj-lista, adagolt rács
**Dátum:** 2026-10-15
**Döntés:** (1) A lista szolgáltatónként és típusonként külön `discover`-ből áll (a találat tudja a szolgáltatóját a badge-hez), az 1. oldalnál az összes szolgáltatóra (`|`) kért `discover` adja a pontos találatszámot. (2) A rács 36-os adagokban nő a lekért készletből, a következő oldal csak akkor jön, ha a készlet elfogyott; az oldalak egymás után, oldalanként rendezve fűződnek. (3) A műfaj chipek statikus listából jönnek (`data/browseGenres.ts`), típusonként külön TMDB azonosítóval; ahol az egyik típusnál nincs megfelelő (Thriller, Horror, Romantikus), csak filmet kérünk. (4) A rendezés `ActionSheetIOS`-sel választható (3 mód). (5) A kikapcsolt szolgáltatók, a műfaj és a rendezés csak helyi állapot. (6) iPaden a szolgáltató és műfaj sor a telefon méreteit használja.
**Miért:** (1) a `discover` nem adja vissza a szolgáltatót, a design viszont minden kártyán mutatja; a külön számláló kérés elkerüli a szolgáltatónkénti összegek kétszeres számolását. (2) a rács nem virtualizált, a szolgáltatónkénti oldalak (akár 160 cím) egyszerre kirajzolva lassítanák; az adagolás egyszerű és nincs új könyvtár. (3) a műfaj-lista nincs az Edge Function whitelistjén, a bővítése éles függvény-módosítás lenne (csak kérésre); a TMDB azonosítók stabilak. (4) a rendezési menü a designban nincs kirajzolva, a rendszer választólapja a legkisebb új UI. (5) a kérés szerint a Böngészés szűrői nem tartósak, a szolgáltatók a Beállításokban szerkeszthetők. (6) a 11-es iPad-PNG ezen a soron hibás (összenyomott logók, levágott chipek).
**Alternatíva:** (1) egyetlen `discover` az összes szolgáltatóra: pontos sorrend és számláló, de nem tudjuk, melyik szolgáltatón van a cím (badge nélkül eltérne a designtól); címenkénti `getDetails`: 20–40 plusz hívás oldalanként. (2) `FlatList numColumns`: az oszlopszám váltása (forgatás) kulcs-újramountot kér (D-040). (3) `genre/movie/list` végpont a whitelistre: dinamikus lista, de éles függvény módosítása.
**Visszavonható?** igen.

## D-042 – „Megnyitás”: szolgáltatói keresőlink névre illesztve, TMDB oldal tartalékként
**Dátum:** 2026-10-15
**Döntés:** A „Hol nézhető” sor „Megnyitás” gombja a szolgáltató keresőoldalát nyitja a cím nevével; a linksablonok a `data/providerSearchLinks.ts`-ben vannak, TMDB szolgáltatónévre illesztve. Ahol nincs sablon, a HU `watch/providers` link (TMDB) nyílik. Módosítja a D-039 (1) pontját.
**Miért:** a felhasználó a szolgáltatót várta; a TMDB nem ad mélylinket, a keresőoldal a legközelebbi megoldás scraping és új könyvtár nélkül. Névre illesztünk, mert szolgáltató ID-t nem hardcode-olunk (D-022 mintája).
**Alternatíva:** marad a TMDB oldal (egy plusz koppintás, de pontos cím); JustWatch mélylink-scraping – ToS-ellenes (D-005).
**Visszavonható?** igen, egy fájl.

## D-043 – Gyerek sarok: egy lista korhatár és téma szerint, kulcsszó-chipek, nagyobb kártya
**Dátum:** 2026-10-15
**Döntés:** (1) A Gyerek sarok egyetlen „Nagy kalandok” lista: `discover/movie` a Főoldal „Gyerekeknek” railével azonos paraméterekkel (`lib/kidsDiscover.ts`: DE korhatár a `kidsAgeLimit` szerint, `16|10751`, népszerűség, HU elérhetőség), a téma chip `with_keywords`-ként szűkíti. (2) A téma chipek kulcsszavai: Állatok 18165 (animals), Világűr 9882 (space), Hercegnők 7376 (princess), Dinoszauruszok 12616 (dinosaur), Zene 4344 (musical), Sport 6075 (sports). (3) A korhatár-chip a közös `useSettingsStore.kidsAgeLimit`-et írja (tárolt, a Főoldal rail és a Beállítások is ezt használja); a téma csak helyi állapot. (4) A kijelölt téma-chip világoskék (mint a korhatár-chip), újra koppintva kikapcsol. (5) A kártya 2:3 poszter 20 px sarokkal (új token `radius.kidsCard`, mért), alatta 10 px-es színes pötty + cím; a Gyerek rácsnak saját `kidsLayout` margó / köz / sorköz értékei vannak, a `PosterGrid` `kids` paramétere kapcsolja. (6) A cím 38 pt (új token `fontSize.kidsTitle`): a Kids design címe nagyobb a 34 pt-os cím-tokennél.
**Miért:** (1) a CLAUDE.md egyetlen kids-lekérdezést ír le, a design egy szekciót mutat; így a Főoldal rail és a Gyerek sarok ugyanazt a „mi gyerekbarát” definíciót használja. (2) a D-015 kulcsszavas megoldás kulcsszó-azonosítókat kér; az azonosítókat nem találgattam: mintafilmek (Dínó tesó, Wall-E, Jégvarázs, Zootropolis, Verdák) `keywords` listájából olvastam ki az éles függvényen, és mind a 6 × 3 kombináció ad találatot. A `with_keywords` az éles függvény módosítása nélkül átmegy (a `discover` paraméterei szabadok, a whitelist az útvonalra szűr). (3) a korhatár egy helyen él, ahogy az onboarding 2. lépése is írja. (4) a design nem mutat kijelölt téma-chipet; a világoskék a Kids akcentus. (5) a mért sarok (20 px) eltér a poszter-kártya 14 px-étől, ezért külön token és komponens, a `PosterCard` változatlan. (6) a PNG-ből mért betűmagasság a Böngészés címénél 12%-kal nagyobb.
**Alternatíva:** (1) téma-szekciók külön rail-ekként (design nincs); sorozat is (D-036: nincs korhatár-szűrő); (2) kulcsszó-keresés végpont (`search/keyword`) a whitelistre – éles függvény módosítása, csak kérésre; (3) téma tárolása – a kérés szerint a szűrők nem tartósak (D-041 mintája); (5) a `PosterCard` `radius` paramétere – a közös komponens bonyolódna.
**Visszavonható?** igen.

## D-044 – Gyerek sarok: animációs sorozatok korhatár-szűrés nélkül
**Dátum:** 2026-10-15
**Döntés:** A Gyerek sarok a filmek mellett `discover/tv` `with_genres=16` (animáció) sorozatokat is mutat, oldalanként a film- és sorozatoldal népszerűség szerint egyesítve. A korhatár-chip csak a filmekre hat. Módosítja a D-043 (1) pontját és a D-036 sorozat nélküli döntését a Gyerek sarokra (a Főoldal „Gyerekeknek” rail változatlanul csak film).
**Miért:** a felhasználó kérte, hogy legyen sorozat, a kategória az animáció, „valamennyire szűr”. A TMDB `discover/tv` nem tud korhatárra szűrni, a CLAUDE.md szerinti `10762` (gyerek) műfaj helyett az animációt választotta.
**Alternatíva:** `with_genres=16,10762` (animáció ÉS gyerek-műfaj): sokkal tisztább gyerek lista, a felnőtt rajzfilmek (Simpson, Family Guy, Rick és Morty) kiesnek, de kevesebb a találat; sorozat nélkül: nincs szűrési gond, de a felhasználó kérésével ellentétes.
**Visszavonható?** igen, egy paraméter.

## D-045 – Keresés: szűrőnként külön végpont, első oldal, címenkénti részletek
**Dátum:** 2026-10-15
**Döntés:** A Mind / Filmek / Sorozatok / Személyek szűrő mind külön TMDB végpontot kér (`search/multi|movie|tv|person`), szűrőnként csak az első oldalt (20 találat). A műfaj és a „hol nézhető” chipek címenként egy `getDetails` hívásból jönnek (a sorok ezek előtt is látszanak), a képernyő élete alatt megőrizve; csak a műfaj és a HU régió adata tárolódik, a „saját előfizetésem” jelölés megjelenítéskor számolódik. A chipek módonként egy szolgáltatót mutatnak (előfizetésnél a sajátot előnyben): a design is ennyit, legfeljebb hármat mutat. A keresés legalább 2 karaktertől, 350 ms késleltetéssel indul; a Legutóbbiakba a billentyűzet „Keresés” gombja és a találat koppintása ment (nem minden gépelt betű).
**Miért:** a `search/multi` 20 találatából a Filmek szűrő kliensoldalon néhány elemre fogyna; a külön végpont teljes oldalnyi szűrt találatot ad (a függvény már cache-eli 6 órára). A `search` válasza nem tartalmaz műfajnevet és elérhetőséget, a `getDetails` az egyetlen forrás, amit az Edge Function már whitelistel és 7 napra cache-el: nem kell új végpont. A módonkénti egy chip követi a designt, és a hosszú szolgáltatólisták nem töltik meg a sort.
**Alternatíva:** `search/multi` + kliensoldali szűrés (kevesebb hívás, de a szűrt lista rövid / üres lehet); új `watch/providers` végpont címenként (kisebb válasz, de függvény- és whitelist-módosítás, ami a `getDetails` mellett kevés nyereség); teljes lista chipekkel (a magyar feliratok miatt több soros, zsúfolt sor).
**Visszavonható?** igen.

## D-046 – Keresés: a személy-találat chip és nyíl nélküli, nem koppintható sor
**Dátum:** 2026-10-15
**Döntés:** A Személyek szűrő (és a Mind szűrő személy-találatai) ugyanolyan sorként jelennek meg, profilképpel, névvel és „Személy · Szakma” alsorral, de chip, „A szolgáltatóidon” jelzés és nyíl nélkül, és a sor nem koppintható.
**Miért:** a design a Személyek szűrőt mutatja, a személy-sort nem; a CLAUDE.md szerint ilyenkor nem találunk ki új UI-t. A v1-ben nincs személy-oldal (a mappastruktúrában sincs), így a koppintásnak nincs célja; a nyíl hiánya jelzi, hogy nem nyílik meg.
**Alternatíva:** a személy koppintásra az ismert címeit keresse (új, nem tervezett viselkedés); a Személyek szűrő elhagyása (eltérés a designtól); nyíllal, de hatás nélkül (félrevezető).
**Visszavonható?** igen, a funkció külön feladatként bővíthető.

## D-047 – Keresés iPad: két oszlop csak elég széles nézetben
**Dátum:** 2026-10-15
**Döntés:** A bal Legutóbbiak oszlop + jobb találati oszlop (13 design) csak akkor jelenik meg, ha az oldalsáv nélküli szélesség legalább 830 px (iPad fekvő); keskenyebb nézetben (álló iPad) egy oszlop van, mint a telefonon (Legutóbbi chip-sor, szűrő, találatok), iPad méretű mezővel és margóval. A szűrő chipek a jobb oszlop fejlécében a fejléc alá törnek, ha a magyar felirat miatt nem férnek el mellette.
**Miért:** a design egyetlen (1244 px-es, fekvő) iPad nézetet mutat: a bal oszlop 282 px, a köz 38 px; álló iPaden (834 px, az oldalsávval 564 px) a jobb oszlop 176 px lenne, a sor használhatatlan. A 830 px-es határ a jobb oszlopnak legalább 440 px-t ad (a poszter, a cím és a chipek még elférnek).
**Alternatíva:** arányos oszlopszélesség (álló iPaden a Legutóbbi sorok szétesnek); mindig két oszlop (álló iPaden használhatatlan); csak telefon-elrendezés iPaden (eltérés a designtól fekvőben).
**Visszavonható?** igen, egy token (`searchLayout.tablet.twoColumnsMin`).

## D-048 – Keresés kategóriára: kurált szótár és kategória chip
**Dátum:** 2026-10-15
**Döntés:** A kategória-keresés (katasztrófa, cápa, …) kurált, magyar szótövekből TMDB kulcsszó / műfaj azonosítóra képező listával működik (`data/searchCategories.ts`); az illeszkedő kategóriák chipként jelennek meg a keresőmező alatt, kiválasztva `discover` találatokat adnak. Az illeszkedést a szó eleje dönti el (szótő), ékezetek nélkül. A kulcsszó-azonosítók élő adaton ellenőrzöttek.
**Miért:** a felhasználó kérte, és a három megoldás közül ezt választotta: a TMDB kulcsszavai angolok és a `search/keyword` nincs a függvény whitelistjén, így a magyar szóhoz szótár úgyis kell; kulcsszó-keresés a függvény módosítása és élesítése nélkül megoldható. A chip a design stílusában készült (narancs árnyalat, mint az „A szolgáltatóidon” jelzés; kijelölve fehér).
**Alternatíva:** a kategória-találatok beleolvasztása a szöveges találatok közé (nem látszik, hogy kategória, nincs új UI); nyílt `search/keyword` (függvény-módosítás és deploy, a szótár így is kell, a lista automatikusan nem lenne jobb); fordítás külső szolgáltatással (új függőség, kulcs).
**Visszavonható?** igen, egy chip-sor és egy adatfájl.

## D-049 – Beállítások: gyökér-route, `hideMature` jelentése, fix régió / nyelv
**Dátum:** 2026-10-15
**Döntés:** (1) A Beállítások a CLAUDE.md szerinti `app/settings.tsx` gyökér-route marad, ezért a tab bar / oldalsáv nincs rajta (mint az Adatlapon, D-038); a „‹ Főoldal” link mindkét méreten megvan. (2) A `hideMature` (alapérték: igaz) igaz esetén a Gyerek sarok és a „Gyerekeknek” rail a korhatár szerint szűr, a badge és a korhatár-chipek látszanak; hamis esetén nincs `certification` szűrés, a badge és a chipek eltűnnek. (3) A `region` és a `language` nincs a store-ban: v1-ben nem választható, a sorok nyíl nélküli, csak megjelenítő sorok. (4) A korhatár választó `ActionSheetIOS` (mint a Böngészés rendezése). (5) A TMDB logót a `tmdb-logo.png`-ből kivágva mutatjuk. (6) Az iPad cím 40 pt, a telefoné 34.
**Miért:** (1) a CLAUDE.md mappastruktúrája és a headless tabs (csak a felsorolt triggerek) ezt adja, az oldalsáv eltűnése már ismert korlát. (2) a kapcsoló hatás nélkül félrevezető; a korhatár-chip szűrés nélkül értelmetlen. (3) egy olyan store-mező, amit senki sem tud átírni, holt állapot; a CLAUDE.md `region` / `language` mezői akkor kerülnek be, ha lesz választás. (4) iOS-only app, nincs új könyvtár. (5) a CLAUDE.md a TMDB logót kötelezővé teszi, a kép viszont két logót tartalmaz. (6) a designból mért.
**Alternatíva:** (1) a Beállítások a `(tabs)` alá, rejtett tabként: a design szerinti oldalsáv, de eltér a mappastruktúrától; (2) a kapcsoló csak a badge-et rejtse; (3) a teljes store-alak most, nyíllal ellátott, hatás nélküli sorokkal; (4) saját modális választó; (5) a teljes kép megjelenítése – a Mymoviescanner logó és sok fekete.
**Visszavonható?** igen.

## D-050 – iPad: cím 40 / 47 pt, álló iPaden kevesebb oszlop és a vezérlők a cím alatt
**Dátum:** 2026-10-15
**Döntés:** (1) Az iPad címek a designból mért 40 pt (Kids: 47 pt), a telefoné marad 34 / 38. (2) Az iPad elrendezése két módú: „széles” (az oldalsáv melletti terület ≥ 860 px, fekvő iPad) a design szerinti, „szűk” (álló iPad) esetén 4 (Kids: 3) oszlop, és a Böngészés / Watchlist vezérlői a cím alatt. (3) A cím lejjebb tolása és a fix sormagasság `ScreenTitle`-ben él, nem a képernyőkön.
**Miért:** (1) a design iPad PNG-in mért betűmagasság (28 px a telefon 24 px-éhez, Kids 33–36 a 29-hez). (2) a design csak fekvő iPadet mutat; álló nézetben a 6 oszlop ~70 px-es poszter, a 4 oszlop Kids 106 px-es kártya csonkolt címekkel, a 40 pt-os cím + vezérlő pedig nem fér egy sorba. (3) négy képernyő használja, ismétlés.
**Alternatíva:** (2) a 6 / 4 oszlop megtartása és kisebb kártya – olvashatatlan poszterek; a telefon elrendezése álló iPaden – a design iPad-érzete elvész; (1) 34 pt marad – a designtól eltér.
**Visszavonható?** igen, tokenek és egy küszöb.

## D-051 – Fiók és szinkron: Supabase Auth (e-mail + jelszó), opcionális, közös user-pool
**Dátum:** 2026-10-16
**Döntés:** (1) Felülírja a D-002-t és a D-009 „fiók/szinkron” pontját. Supabase Auth, e-mail + jelszó; a bejelentkezés **opcionális** (Beállítások → Fiók), fiók nélkül az app a mai módon működik. (2) Bejelentkezve a watchlist, a szolgáltatók (+ `onboardingDone`), a korhatár és a `hideMature` **egy dokumentumként** szinkronizálódik: `mms.user_data (user_id, data jsonb, updated_at)`, felhasználónként egy sor, utolsó írás nyer. (3) A kliens táblát továbbra sem ér: új Edge Function `mms-sync` (`get` / `put`), a felhasználót a JWT-ből azonosítja; az `mms-tmdb` névtelen marad. (4) Konfliktus: belépéskor a watchlist egyesítése (egyik eszköz adata sem vész el), a többi mező a szerveré; később előtérbe kerüléskor a szerver felülír, kivéve ha van el nem küldött helyi változás (`dirty`), ekkor a helyi nyer. (5) Nincs új könyvtár (supabase-js és AsyncStorage már a projektben van). (6) A bejelentkezés / regisztráció képernyőnek nincs designja: a tokenekkel és a Beállítások kártya-stílusában készül.
**Miért:** (1) a család több eszközön használja ugyanazt a listát; opcionális, hogy a meglévő, helyi működés és az offline használat ne sérüljön. (2) egy dokumentum sokkal egyszerűbb, mint három tábla, és a közös állapot kicsi (watchlist + pár szám). (3) a CLAUDE.md szabálya: az `mms` séma nincs kitéve a PostgREST-nek, a kliens csak Edge Functiont hív. (4) a pusztán „szerver nyer” elvesztené az első belépés előtti helyi watchlistet, a pusztán „helyi nyer” a más eszközön végzett törlést; a `dirty` jelző a kettő között dönt. (5) a kérdésre nem kell külső könyvtár.
**Alternatíva:** (1) kötelező bejelentkezés – nincs net → nincs app; (2) táblák watchlistre / szolgáltatókra / beállításokra külön – több migráció és több hívás, ugyanez az eredmény; (3) külön Supabase projekt az mms-nek – teljes elkülönítés, de eltér a D-003-tól; Sign in with Apple – új könyvtár, Apple Developer beállítás; magic link – a levélsablon a familyBudgettel közös.
**Ismert kockázat:** (a) A Supabase Auth felhasználók projekt-szintűek: az mms regisztrációja a familyBudget projektben is `authenticated` felhasználót hoz létre, és ugyanaz az e-mail ugyanaz a fiók. A nyilvános anon kulccsal bárki regisztrálhat; ha a familyBudget bármely táblájának policy-ja az `authenticated` szerepkörnek széles hozzáférést ad, az kiszivároghat. **Élesítés (regisztráció megnyitása) előtt a familyBudget RLS policy-jait read-only át kell nézni**; ha bizonytalan, a regisztráció zárható a Supabase Auth beállításokban és a fiókok kézzel vehetők fel. (b) A fiók törlése az appból nincs kész: a közös pool miatt egy törlés a familyBudget fiókot is törölné, ezért külön döntés (Ship előtti sor). (c) Utolsó írás nyer: két eszköz egyidejű módosításánál az egyik elveszhet.
**Visszavonható?** igen — a kliens oldali réteg kikapcsolható (a Fiók szekció elrejtése), az `mms.user_data` és az `mms-sync` additív, `mms` alatt él.

## D-052 – Fiók képernyő: design nélkül, Beállítások-stílusban; kijelentkezéskor a helyi adat marad; `danger` szín
**Dátum:** 2026-10-16
**Döntés:** (1) A bejelentkezés / regisztráció képernyőnek nincs designja: a Beállítások kártya-stílusát (felület, 14 px sarok, 54 px sorok), a szegmens-vezérlőt és az onboarding CTA gombját használja, tokenekkel; ez jóváhagyásra vár. (2) A Fiók a Beállításokból nyílik (nem az onboardingból, nem tabról). (3) Kijelentkezéskor a watchlist, a szolgáltatók és a beállítások az eszközön maradnak. (4) Új szín token: `danger` (#FF453A) a hibaszövegnek és a Kijelentkezés sornak.
**Miért:** (1) a CLAUDE.md szerint ütközésnél nem találok ki új UI-t; itt nincs minta, a legkisebb eltérés a már jóváhagyott elemek újrahasznosítása. (2) a bejelentkezés opcionális (D-051), nem szabad az első indítást akadályoznia. (3) a kijelentkezés nem törlés; fiók nélkül az app helyi adattal működik, és így nem vész el semmi. (4) a tokenek között nincs hibaszín, a hardcode-olás tilos.
**Alternatíva:** (1) a képernyő designjának megvárása – leállítaná a funkciót; (3) kijelentkezéskor törölni a helyi adatot – közös eszközön tisztább, de adatvesztés és meglepetés; a másik fiókkal belépve a watchlist egyesülne (lásd a szinkron sort); (4) a `kidsCoral` használata hibához – a Gyerek sarok akcentusa, más jelentés.
**Visszavonható?** igen, egy route és két komponens.

## D-053 – Függvényhívások időkorlátja: 20 mp
**Dátum:** 2026-10-18
**Döntés:** Az `mms-tmdb` és `mms-sync` hívások 20 mp után megszakadnak (`supabase.functions.invoke` `timeout` opció, `REQUEST_TIMEOUT_MS` a `lib/api.ts`-ben), és a megszokott hiba + „Újra” állapotba kerülnek. A Supabase Auth hívásokon (belépés, regisztráció) nincs saját korlát.
**Miért:** időkorlát nélkül lassú vagy félig megszakadt hálózaton a skeleton addig áll, amíg az iOS 60 mp-es alapértelmezett kérés-időkorlátja le nem jár; a 20 mp bőven elég a hideg függvényindításnak és a cache-hiányos TMDB hívásnak, de a felhasználó nem néz egy percig töltőképernyőt. Működését helyi, soha nem válaszoló szerverrel ellenőriztem (1,5 mp-es teszt-időkorláttal 1508 ms után `FunctionsFetchError`).
**Alternatíva:** nincs saját korlát (iOS 60 mp) – túl hosszú; 8–10 mp – hideg indításnál a lassú, de működő hálózaton fölösleges hibát adna; Auth-hívások köré saját `AbortController` – a belépés ritka és a hiba azonnal látszik a gombon, nem éri meg a külön kód.
**Visszavonható?** igen, egy konstans és két `timeout` sor.

## D-054 – Watchlist: a helyi lista státusz nélkül is látszik, a státusz-hiba egy sor
**Dátum:** 2026-10-18
**Döntés:** A Watchlist a mentett visszatöltése után azonnal mutatja a címeket; a státusz-badge-ek (és a szegmens-számlálók) akkor jelennek meg, amikor a részletek megérkeznek. Ha minden státusz-lekérés elbukik, a rács fölött egy sor jelzi („A státuszok most nem tölthetők be.” + „Újra”, a Beállítások hibasorának stílusában), a lista marad. Korábban skeleton, majd teljes képernyős hiba állt a lista helyén.
**Miért:** a lista helyi adat; net nélkül a felhasználó eddig a saját mentett címeit sem látta. A státusz csak kiegészítés. A felhasználó jóváhagyta (2026-10-18).
**Alternatíva:** a skeleton + teljes hiba megtartása (tiszta design-egyezés, de offline használhatatlan); a státuszok helyi tárolása – új perzisztált adat, elavulhat, fölösleges.
**Visszavonható?** igen, a `useWatchlist` `loading` sora és a hibasor a képernyőn.

## D-055 – Fiók és szinkron kikapcsolva a v1-ben
**Dátum:** 2026-10-18
**Döntés:** A bejelentkezés és a szinkron (D-051) a v1-ben ki van kapcsolva: `constants/features.ts` `accountEnabled = false`. Ennek hatása: a Beállítások „Fiók” szekciója rejtett, az auth-figyelő (`startAuthListener`) nem indul. A kód (account képernyő, `lib/auth.ts`, `lib/sync.ts`, `mms-sync`) megmarad. Az `mms-sync` nincs deployolva, a Supabase regisztrációt a felhasználó a dashboardon zárja. A „Fiók törlése” Ship előtti sor ezzel tárgytalan. A családi összekötés később, ha szükséges.
**Miért:** a v1 a családi használathoz auth nélkül is teljes, a watchlist és a beállítások eszközönként AsyncStorage-ban vannak. Az `mms-tmdb` biztonságát az auth nem növeli (az anon kulcs nyilvános, nyitott regisztrációval bárki kap JWT-t); a védelem a whitelist, a paraméter-ellenőrzés, a szerver oldali TMDB kulcs és az RLS. A közös user-pool miatt a nyitott regisztráció viszont új felületet adna: a familyBudget `investment_price_history` táblája feltétel nélkül olvasható bármely `authenticated` felhasználónak.
**Alternatíva:** a kód törlése – elveszne a kész munka, a későbbi bekapcsoláshoz újra kellene írni; a Fiók szekció nyitva hagyása zárt regisztrációval – használhatatlan sor; külön Supabase projekt az mms-nek – teljes elkülönítés, de eltér a D-003-tól, és most nincs rá szükség.
**Bekapcsolás előtt:** a regisztráció megnyitása, a `investment_price_history` policy átnézése (familyBudget oldal, csak a felhasználó kérésére), `mms-sync` deploy, kétkészülékes próba, és a „Fiók törlése” (App Store 5.1.1(v)) újranyitása.
**Visszavonható?** igen, egy konstans.

## D-056 – Keresés: Műfaj / Téma select, „és” kapcsolat
**Dátum:** 2026-10-18
**Döntés:** (1) A Keresésben két select (a Mind / Filmek / Sorozatok szűrő alatt, iPaden a jobb oszlopban): **Műfaj** (17 műfaj-kategória, több is választható) és **Téma** (40 kulcsszavas kategória, egy választható). A gomb a kiválasztottat mutatja („Vígjátékok +1”, narancs árnyalattal), koppintásra lapként (RN `Modal`, `pageSheet`) nyíló, pipás lista, „Törlés” / „Kész” fejléccel. (2) **„És” kapcsolat:** a típus-szűrő × műfajok × téma mind „és”: a műfajok a TMDB `with_genres` vesszős („és”) alakjában, a téma külön `with_keywords` (a csoporton belül „vagy”). Ahol egy műfajnak nincs megfelelője a TV-ben (romantikus, thriller, történelmi), a sorozat-oldalon nincs találat, mert a találatnak mindegyikre illeszkednie kell. (3) Több téma „és” kapcsolata nincs: a TMDB nem engedi egy hívásban („vagy” csoportok „és”-e nem fejezhető ki; a vegyes `A,B|C` alakot kipróbáltam, nem DNF-ként értelmezi). (4) A kategóriák a szöveges keresést helyettesítik (mint a D-048-ban): a szöveg módosítása kiüríti a kiválasztást; a begépelt szóra illeszkedő chipek maradnak, és ugyanazt a kiválasztást kapcsolják. (5) A sorozat-oldalon a Hír és Talk műfaj (`without_genres=10763,10767`) kizárva.
**Miért:** (1) 57 kategória egy listában kezelhetetlen; a műfaj / téma szétválasztás egyben a TMDB két paraméterének felel meg, így az „és” hack nélkül, egy hívással megy. (2) a felhasználó kérése: „sorozat és vígjáték”, kategóriák választása select menüből. (3) a lehetséges megoldás (kategóriapáronként keresztszorzat-hívások) 9–18 hívást jelentene egy kereséshez. (4) az ellenőrzésen a „vígjáték” sorozatok élén talk show-k (Late Night, The Tonight Show) voltak; kizárásuk után A Simpson család, A hivatal, Family Guy vezet.
**Alternatíva:** egy kategória-select mindennel – több téma „és” nélkül, vagy keresztszorzat-hívásokkal; `ActionSheetIOS` – 17–40 elemre túl hosszú; több téma kliens oldali metszéssel (több oldal lekérése és címenkénti kulcsszó) – lassú és sok hívás; a szöveges keresés szűrése műfajra (a `search` találatok `genre_ids`-ét használva) – témára nem működik.
**Nincs design:** a select gomb a Böngészés rendezés-gombjának, a lap a Beállítások soroknak a mintájára készült; jóváhagyásra.
**Visszavonható?** igen, `CategorySelect` és a Keresés képernyő bekötése; a `selectionParams` a régi `categoryParams` helyett.

## D-057 – Keresés: találati lista szűrői (elérhetőség, értékelés, megjelenés)
**Dátum:** 2026-10-18
**Döntés:** (1) A Keresés select sora három szűrővel bővült: **Elérhetőség** (Magyarországon / A szolgáltatóimon / egy-egy szolgáltatóm neve / Minden találat), **Értékelés** (bármilyen, 6+, 7+, 8+) és **Megjelenés** (bármikor, elmúlt 1 / 3 / 5 / 10 év). (2) **Az alapérték „Magyarországon”**: alapból csak az a cím látszik, amelyik nálunk előfizetéssel, kölcsönözve vagy megvásárolva nézhető (a sorok chipjeivel azonos három mód); a „Minden találat” egy koppintás. (3) **Kategória-keresésnél a TMDB szűr** (`discover`: `watch_region=HU` + `with_watch_monetization_types`, `with_watch_providers`, `vote_average.gte` + `vote_count.gte=100`, `primary_release_date.gte` / `first_air_date.gte`), így a lista nem fogy el szűrés után. (4) **Szöveges keresésnél kliens oldalon szűrünk:** az értékelés és a dátum a találat adataiból, az elérhetőség a címenként úgyis lekért részletekből; a sor addig rejtett, amíg ez meg nem érkezik (nem tűnik el utólag), ha a lekérés elbukik, a sor látszik. Mivel a szűrés elrejt találatokat, a keresés két oldalt (40 találat) kér. (5) Az elérhetőség a Beállításokban módosított szolgáltatókhoz igazodik (`resolveFilters`: nem kiválasztott szolgáltatóra „Magyarországon” esik vissza). (6) A Személyek szűrőnél nincs szűrés. (7) Az általános `FilterSelect` felváltja a `CategorySelect`-et (D-056).
**Miért:** a felhasználó két észrevétele: a találatok között sok olyan cím van, ami Magyarországon nem nézhető, és olyan is, ami nincs a bejelölt szolgáltatókon. Mérés: a „vígjáték” filmkategóriából 18 006 találat 5 364-re szűkül (a címek ~70%-a nálunk nem nézhető), a „batman” szöveges keresés 40 címéből 27 nézhető. Az alapértéket ezért „Magyarországon”-ra tettem.
**Alternatíva:** alapból „Minden találat” – az észrevétel szerint zavaró; csak kliens oldali szűrés a kategória-keresésben – az első 20 találatból kevés maradna; a szűrők perzisztálása – egyelőre minden keresés friss, a választás a képernyő életére él.
**Ismert korlát:** a szolgáltatónként szűrés és a „A szolgáltatóimon” csak előfizetést (`flatrate`) számít, mint az app többi része; az ingyenes / reklámos (`free`, `ads`) kínálatot az app nem kezeli (D-012), ezért az „Magyarországon” sem számítja.
**Visszavonható?** igen: `data/resultFilters.ts` alapértéke (`availability: 'all'`) kikapcsolja a szűrést; a select sor három gombja kivehető.

<!-- ÚJ DÖNTÉSEK IDE, ALULRA, NÖVEKVŐ SORSZÁMMAL -->
