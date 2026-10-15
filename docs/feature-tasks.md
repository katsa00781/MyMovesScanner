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
- [ ] Assets elhelyezése (`assets/images/`: logo, tmdb-logo) + `constants/images.ts`
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
- [ ] Navigációs váz: tab bar (telefon) / oldalsáv + MY SERVICES (iPad), üres képernyőkkel — design: 02, 10
- [ ] Onboarding 1. lépés: HU szolgáltatók dinamikus listája, kártyák, CTA számlálóval, Skip — design: 01, 09
- [ ] Onboarding 2. lépés: Kids korhatár választás (ideiglenes, lásd CLAUDE.md), átirányítás ha nincs kész
- [ ] Közös komponensek: `PosterCard` (szolgáltató / formátum / státusz badge), `PosterRail`, `SectionHeader` (See all), skeleton, üres és hiba állapot
- [ ] Főoldal: hero carousel (NEW ON …, Trailer, +, pöttyök) + „New on your services” rail — design: 02, 10
- [ ] Főoldal: „New Blu-ray releases” rail (HU → DE fallback, formátum badge — D-006, D-014)
- [ ] Főoldal: „Trending in Hungary” sorszámos rail (D-015) + „Kids' picks” fekvő kártyák + forrásmegjelölés lábléc
- [ ] Adatlap: hero, meta, korhatár, TMDB értékelés, Trailer, Watchlist gomb, leírás — design: 06, 14
- [ ] Adatlap: Where to watch (All/Stream/Rent/Buy, ár nélkül — D-012), On disc kártya (D-013), Cast & crew, iPad About oszlop
- [ ] Watchlist: hozzáadás/eltávolítás, szegmens számlálóval, státusz badge-ek — design: 07, 15
- [ ] Böngészés: My services szűrő, műfaj chipek, találatszám, rendezés, rács, végtelen görgetés — design: 03, 11
- [ ] Gyerek sarok: korhatár chipek, Mature titles hidden, téma chipek (keywordök), Big adventures — design: 04, 12
- [ ] Keresés: debounce, Recent searches (`useSearchStore`), All/Films/Series/People, találati sor Stream/Rent/Buy chipekkel — design: 05, 13
- [ ] Beállítások: My services + Edit, Region & language, Kids corner, About (Notifications rejtve — D-013) — design: 08, 16
- [ ] iPad finomhangolás: rács oszlopszámok, kétoszlopos adatlap, portrait/landscape ellenőrzés a designnal összevetve

### Ship előtt
- [ ] Teljes flow tesztelése iPhone-on és iPaden
- [ ] Edge case-ek: üres szolgáltatólista, nincs találat, hosszú cím, nincs net, lassú net
- [ ] Lint + typecheck hibák nélkül
- [ ] CodeRabbit code review az AI által írt feature-ökhöz
- [ ] Dev utilities eltávolítása (test gombok, console.log-ok, mock data)
- [ ] Secrets ellenőrzése (kliens bundle + git history: nincs TMDB kulcs, nincs service role)
- [ ] Ellenőrzés: familyBudget táblák érintetlenek, csak `mms` séma változott
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

<!-- ÚJ DÖNTÉSEK IDE, ALULRA, NÖVEKVŐ SORSZÁMMAL -->
