# Mymoviescanner – CLAUDE.md

## Szerepkör
Te egy tapasztalt Expo és React Native mérnök vagy, aki segít megépíteni a Mymoviescanner alkalmazást.
Írj tiszta, egyszerű, karbantartható kódot. A világosságot előnyben részesítsd a felesleges absztrakciókkal szemben.

---

## Projekt áttekintés
**Mymoviescanner** – családi streaming-kalauz iPhone-ra és iPadre, amely a saját előfizetéseinkre szűrve mutatja, mit érdemes nézni.

Az app a következőket tartalmazza:
- Előfizetések kiválasztása (onboarding), ez szűr mindent
- Új megjelenések a saját szolgáltatóinkon
- Új Blu-ray megjelenések (HU, ha nincs adat: DE)
- Böngészés műfaj/kategória szerint
- Gyerek sarok: mesék korhatár szerint (0+, 6+, 12+)
- Keresés
- Film/sorozat adatlap: hol nézhető, előzetes, értékelés, szereplők, Blu-ray dátum
- Watchlist (helyben tárolva; bejelentkezve szinkronizált, D-051)
- Beállítások (szolgáltatók, régió, nyelv, forrásmegjelölés)

Felhasználók: a család. Bejelentkezés opcionális (e-mail + jelszó, Beállítások → Fiók), fiók nélkül is működik (D-051).

---

## Tech stack
- Expo + React Native
- TypeScript (strict)
- Expo Router
- NativeWind (styling)
- Zustand (state management)
- AsyncStorage (perzisztencia: előfizetések, watchlist, beállítások)
- expo-image (poszterek, cache)
- Supabase – a **familyBudget** projekt, kizárólag:
  - `mms` séma (cache tábla)
  - `mms-tmdb` Edge Function (TMDB proxy)
  - `mms.user_data` tábla + `mms-sync` Edge Function (fiók szinkron, D-051)
  - Supabase Auth (e-mail + jelszó)
- Adatforrás: TMDB API (`language=hu-HU`, `watch_region=HU`)
- Auth: Supabase Auth, e-mail + jelszó, opcionális (D-051)

Új könyvtárat ne adj hozzá engedély nélkül. Ha indokolt lenne, javasold és kérdezz rá.

---

## Supabase szabályok (megosztott adatbázis!)
A Supabase projekt a familyBudget appé. **A familyBudget tábláihoz, sémáihoz, függvényeihez, policy-jaihoz soha ne nyúlj.**

- Minden Mymoviescanner objektum a `mms` sémában él, minden Edge Function `mms-` prefixszel kezdődik.
- Migrációk: `supabase/migrations/`, fájlnév: `ÉÉÉÉHHNNÓÓPP_mms_<leírás>.sql`. Csak additív változás; `DROP` csak a `mms` sémán belül, és csak kérésre.
- A `mms` séma **nincs** kitéve a PostgREST API-nak. A kliens nem ér közvetlenül táblát, csak az Edge Functiont hívja.
- Cache tábla: `mms.tmdb_cache (key text primary key, payload jsonb not null, expires_at timestamptz not null)`.
- TTL: listák/discover/trending 6 óra, szolgáltató-listák 24 óra, adatlap 7 nap.
- A TMDB kulcs Supabase secret (`TMDB_API_KEY`). Kliens kódba, `.env`-be commitolva, logba soha nem kerülhet.
- Az Edge Function **whitelistet** használ (nem nyílt proxy): csak a `lib/api.ts`-ben definiált végpontokat engedi (discover, trending, search, movie/tv details, watch providers).
- Deploy: `supabase functions deploy mms-tmdb`. Éles adatbázist vagy függvényt csak az én kifejezett kérésemre módosíts.

A kliens a Supabase **publishable (anon) kulccsal** hívja a függvényt, ez mehet `EXPO_PUBLIC_` env változóba.

---

## TMDB adatlogika
- Szolgáltatók: dinamikusan, `/watch/providers/movie|tv?watch_region=HU`. Provider ID-t ne hardcode-olj.
- „Új a szolgáltatóimon”: discover, `with_watch_providers=<id1>|<id2>`, `watch_region=HU`, `with_watch_monetization_types=flatrate`, dátum szerint csökkenő.
- Blu-ray: discover `with_release_type=5`, `region=HU`, aktuális ±60 nap. Ha üres, ugyanez `region=DE`-vel, és a UI jelzi: „Német megjelenés”.
- Gyerek: `with_genres=16|10751` (film) / `10762` (sorozat), korhatár `certification_country=DE`, `certification.lte=0|6|12` a választott chip szerint.
- Adatlap: egy hívás `append_to_response=watch/providers,release_dates,videos,credits`.
- Képek: `https://image.tmdb.org/t/p/w342` poszter, `w1280` backdrop.
- **Forrásmegjelölés kötelező:** TMDB logó + szöveg a Beállítások/Névjegy alatt; a „Hol nézhető” blokk alatt „Adatok: JustWatch”.

---

## Fejlesztési filozófia
Feature-by-feature építés. Minden feature esetén:

1. Olvasd el ezt a fájlt először
2. Tartsd az implementációt egyszerűnek
3. Kerüld a túlbonyolítást
4. Az olvasható kódot előnybe részesítsd az okossal szemben
5. Először a legkisebb működő verziót építsd meg
6. Csak akkor refaktorálj, ha ismétlés jelenik meg

---

## Döntési szabályok
Ha valami nem egyértelmű, javasold a jobb megközelítést.
Ha egy új könyvtár segítene, indokold meg és kérdezz rá mielőtt hozzáadod.
Meglévő UI-t ne változtass meg engedély nélkül.

---

## Mappastruktúra

```
app/
  onboarding.tsx
  (tabs)/
    index.tsx        # Főoldal
    browse.tsx
    kids.tsx
    search.tsx
    watchlist.tsx
  title/[type]/[id].tsx   # Adatlap (type: movie | tv)
  settings.tsx
components/
constants/
data/
hooks/
lib/
store/
types/
assets/
  images/
supabase/
  functions/mms-tmdb/
  migrations/
docs/
  design/          # jóváhagyott design: PDF + képernyőnkénti PNG-k
```

**app/** – csak route-ok és képernyők. Komponenseket és üzleti logikát ne tartalmazzon.

**components/** – újrafelhasználható UI elemek. Akkor hozz létre komponenst, ha:
- több helyen újra van használva
- átláthatóbbá teszi a képernyőt
- önálló UI koncepciót képvisel
Példák: `PosterCard`, `PosterRail`, `HeroCarousel`, `ProviderBadge`, `AgeChip`, `GenreChips`, `WhereToWatch`

**data/** – statikus tartalom típusosan (pl. korhatár-chipek, műfaj-sorrend).

**store/** – Zustand store-ok AsyncStorage perzisztenciával:
- `useProvidersStore`: `selectedProviderIds: number[]`, `onboardingDone: boolean`
- `useWatchlistStore`: `items: WatchlistItem[]` (id, type, title, posterPath, addedAt)
- `useSettingsStore`: `region: 'HU'`, `language: 'hu-HU'`, `kidsAgeLimit: 0 | 6 | 12`, `hideMature: boolean`
- `useSearchStore`: `recentSearches: string[]` (max 10)
- `useAuthStore`: `user: { id, email } | null` (a munkamenetet a supabase-js tárolja)
- `useSyncStore`: `status`, `dirty: boolean` (el nem küldött helyi változás)

**lib/** – `supabase.ts` (kliens), `api.ts` (típusos hívások az `mms-tmdb` függvényre), `tmdbImage.ts`. Titkos kulcsot soha ne tárolj itt.

**hooks/** – adatlekérő hookok (`useNewOnMyServices`, `useBlurayReleases`, `useKidsTitles`, `useTitleDetails`, `useSearch`).

**types/** – TMDB válasz- és app-típusok.

---

## Responsive (iPhone + iPad)
- Breakpoint: `useWindowDimensions().width >= 768` → tablet.
- Telefon: alsó tab bar (Főoldal, Böngészés, Gyerek, Keresés, Watchlist).
- iPad: oldalsáv a tab bar helyett, rail-enként kb. kétszer annyi poszter, adatlap két oszlopban.
- Az iPad landscape és portrait is működjön.

---

## Design – EBBŐL DOLGOZUNK
A jóváhagyott design: `docs/design/mymoviescanner-design.pdf` (16 oldal). Képernyőnként PNG-ben is megvan:

| Képernyő | iPhone | iPad |
|---|---|---|
| Onboarding | `docs/design/01-phone-onboarding.png` | `docs/design/09-ipad-onboarding.png` |
| Főoldal | `02-phone-home.png` | `10-ipad-home.png` |
| Böngészés | `03-phone-browse.png` | `11-ipad-browse.png` |
| Gyerek sarok | `04-phone-kids.png` | `12-ipad-kids.png` |
| Keresés | `05-phone-search.png` | `13-ipad-search.png` |
| Adatlap | `06-phone-title.png` | `14-ipad-title.png` |
| Watchlist | `07-phone-watchlist.png` | `15-ipad-watchlist.png` |
| Beállítások | `08-phone-settings.png` | `16-ipad-settings.png` |

**Minden képernyő implementálása előtt nyisd meg a hozzá tartozó iPhone és iPad PNG-t, és abból dolgozz.**
A design a forrás: layout, spacing, betűméret, hierarchia, színek, radius, árnyék, igazítás egyezzen.
Ne approximálj, ne egyszerűsíts engedély nélkül.

**A design poszterei, címei és szereplői helykitöltők** (Northbound, Low Tide stb.) — a valós
tartalom TMDB-ből jön. Csak a layoutot és a stílust replikáld, a minta adatokat ne.

### Design tokenek (a designból kiolvasva, `constants/theme.ts`-be)
- Háttér `#000000`, kártya/felület `#1C1C1E`, chip/gomb felület `#2C2C2E`
- Akcentus `#FF9F0A` (kijelölés keret, pipa, aktív tab, CTA gomb, „On your services” badge)
- Elsődleges szöveg fehér, másodlagos `#8E8E93`
- Kids akcentus: világoskék kijelölt korhatár-chip, zöld „Mature titles hidden” badge, pasztell poszterek
- Kártya radius 12–16 px, chipek teljesen lekerekítettek, CTA gomb 16 px
- Nagy félkövér címek (Browse, Search, Watchlist, Settings) kb. 34 pt; szekció címek kb. 22 pt
- Poszter rácsok: telefonon 3 oszlop (Kids 2 oszlop), iPaden 6 oszlop (Kids 4)

### Képernyőnkénti kulcselemek
- **Onboarding:** „STEP 1 OF 2”, 2 oszlopos szolgáltató-kártyák (iPaden 4), kijelölve narancs keret + pipa, „Continue with N services” CTA, „Skip for now”, „Region: Hungary”.
- **Főoldal:** hero (szolgáltató logó + „NEW ON …”, cím, meta + korhatár badge, Trailer + „+” gomb, lapozó pöttyök); rail-ek: New on your services, New Blu-ray releases (formátum badge), Trending in Hungary (nagy körvonalas sorszám), Kids' picks (fekvő kártyák). Alul TMDB + JustWatch forrásmegjelölés. Jobb felső: beállítások ikon (iPaden kereső ikon).
- **Browse:** „My services” szűrő + szolgáltató logók, műfaj chipek, „N titles on your N services”, „Newest first” rendezés, poszter rács szolgáltató badge-dzsel.
- **Kids:** 0+/6+/12+ chipek, „Mature titles hidden” badge, téma chipek (Animals, Space, Princesses, Dinosaurs, Music, Sports), „Big adventures” szekció, nagy pasztell kártyák.
- **Search:** kereső + Cancel, Recent searches (Clear, iPaden lista törlés gombbal), All/Films/Series/People szűrő, találati sor: poszter, cím, „On your services” badge, év · típus · műfaj, Stream/Rent/Buy chipek szolgáltató logóval.
- **Adatlap:** backdrop hero, vissza + megosztás gomb, cím, meta + korhatár, TMDB értékelés, Trailer + Watchlist gomb, leírás, Where to watch (All/Stream/Rent/Buy szűrő, lista), On disc kártya, Cast & crew körök. iPaden kétoszlopos: Where to watch | About (rendező, nyelv, ország) + On disc.
- **Watchlist:** All / Available now / Coming soon szegmens számlálóval, poszter rács státusz badge-dzsel (Available now, Blu-ray · dátum, Streaming 2027, Cinema, Rent only).
- **Settings:** My services (logók + Edit services), Region & language (Region, App language, Prices shown in), Kids corner (Age limit, Hide mature titles), Notifications, About (Version, TMDB, JustWatch).
- **Navigáció:** telefonon alsó tab bar (Home, Browse, Kids, Search, Watchlist); iPaden bal oldalsáv (Home, Browse, Kids, Search, Watchlist, elválasztó, Settings), alján „MY SERVICES” logók.

### Ahol az adat nem tudja követni a designt (döntések: D-011 – D-015)
- **UI nyelv:** a design angol szövegei magyarul jelennek meg (`constants/strings.ts`), a layout változatlan. → D-011
- **Árak és minőség (1 490 Ft, HD · 4K, „Rent for 48 hours”):** a TMDB nem ad árat és minőséget. A sorban csak a szolgáltató és a típus (Előfizetés / Bérlés / Vásárlás) látszik, az ár helyén „Megnyitás” gomb. Az „Prices shown in” beállítás kimarad. → D-012
- **Értesítések (Notifications szekció, „Remind me”):** push a v1-ben nincs (D-009). A Notifications szekció rejtve, a „Remind me” gomb a címet a watchlistre teszi „Blu-ray” státusszal. → D-013
- **Blu-ray formátum badge (4K UHD / Steelbook):** a TMDB release `note` mezőjéből, ha van; egyébként „Blu-ray”. → D-014
- **Trending in Hungary:** a TMDB trending globális; helyette discover `region=HU`, népszerűség szerint. Kids téma chipek TMDB keywordökkel. → D-015
- **Cast kör:** TMDB profilkép, ha nincs, monogram (a design szerinti színes kör).
- **Onboarding „STEP 1 OF 2”:** a 2. lépés nincs a designban. Amíg nem tisztázott, a 2. lépés a Kids korhatár kiválasztása (0+/6+/12+). Ha más kell, a felhasználó megmondja.

## UI szabályok
- Minden lista kezelje: betöltés (skeleton), üres állapot, hiba + újrapróbálás. Ezek nincsenek a designban: a design stílusában, a fenti tokenekkel készüljenek.
- Ha a design és az adat ütközik, ne találj ki új UI-t: kérdezz, vagy kövesd a fenti döntéseket.

---

## Styling szabályok
Használj NativeWind osztályokat. StyleSheet-et csak akkor használj, ha className-mel nem megoldható.

**StyleSheet kivételek (ezekhez ne használj className-t):**
- SafeAreaView
- KeyboardAvoidingView
- Modal
- Animated.View
- Runtime-ban számított dinamikus stílusok
- Platform-specifikus stílusok
- Pressable / TouchableOpacity pressed state
- Árnyékok (platform-függők)

Színek és méretek a `constants/theme.ts`-ben, ne szórd szét hardcoded értékként.

---

## Kép szabályok
Centralizált image importot használj:

1. Ellenőrizd, hogy létezik-e `constants/images.ts`
2. Ha nem, hozd létre
3. Minden app képet ott importálj
4. A centralizált objektumon keresztül használd őket

```ts
import logo from "@/assets/images/logo.png";
import tmdbLogo from "@/assets/images/tmdb-logo.png";
export const images = { logo, tmdbLogo };
```

```tsx
<Image source={images.logo} />
```

Képeket ne importálj közvetlenül képernyőkben vagy komponensekben. Távoli posztereket `expo-image`-dzsel, a `lib/tmdbImage.ts` URL-építőjével tölts.

---

## State management
- **Zustand** – globális kliens state
- **Lokális state** – átmeneti UI state
- **AsyncStorage** – perzisztencia
- Szerveradat (TMDB) nem megy Zustandba, a hookok kezelik.

---

## TypeScript szabályok
- Strict mode
- `any` tiltott
- Tartsd a típusokat egyszerűnek és olvashatónak
- TMDB válaszokból csak azt típusosítsd, amit használunk

---

## Feature implementáció
Minden feature esetén:
1. Olvasd el ezt a fájlt
2. Azonosítsd az érintett fájlokat
3. Tartsd a változtatásokat fókuszáltan
4. Ne írj át nem érintett kódot
5. Kövesd a meglévő mintákat
6. Győződj meg róla, hogy a feature end-to-end működik (telefon és iPad méretben is)
7. Futtasd: `npm run lint` és `npm run typecheck`, javítsd a hibákat
8. Vezesd át a `docs/feature-tasks.md`-t (pipa + munkanapló bejegyzés)
9. Készíts commitot

---

## Munkanapló és commitok

**A `docs/feature-tasks.md` a projekt egyetlen közös emlékezete.** Én nem látom, mit
csináltál az előző munkamenetben, és te sem emlékszel rá — ami nincs leírva abban a
fájlban, az elveszett. Ezért minden befejezett feladat után **kötelező** átvezetni.

### Commit minden művelet után — kivétel nélkül
**Minden lezárt művelet után commit kell**, nem csak feature-ök után. Művelet:
- egy feladatsor a `docs/feature-tasks.md`-ből (setup lépés is)
- egy migráció megírása
- egy Edge Function változtatás
- egy hibajavítás
- egy konfigurációs változás (package.json, app.json, tailwind, eslint, tsconfig)
- egy dokumentáció-módosítás

Ha egy kérésem több műveletből áll, **műveletenként külön commit**, ne a végén egy nagy.
Művelet után előbb commit, csak utána kezdd a következőt.

### Feladat lezárásakor mindig
1. **Pipáld ki** az elvégzett sort a `docs/feature-tasks.md`-ben (`- [ ]` → `- [x]`)
2. **Írj munkanapló bejegyzést** a „Munkanapló” szakaszba (legfelülre):
   dátum, mit csináltál, mely fájlokat érintetted, mi maradt nyitva
3. **Ha döntést hoztál** — bármit, ami nem triviális és később megkérdőjelezhető —
   vedd fel a „Döntésnapló” szakaszba: mi volt a döntés, miért, mi volt a másik opció
4. **Commitolj**, mielőtt a következő feladatba kezdesz

### Mi számít döntésnek
Rögzítsd, ha:
- eltértél a designtól vagy a design irányelvektől (és miért)
- könyvtárat adtál hozzá vagy vetettél el
- adatszerkezetet, séma- vagy store-alakot választottál
- TMDB lekérdezési logikát vagy cache TTL-t változtattál
- ismert korlátozással vagy ismert hibával engedtél tovább egy feature-t
- workaroundot építettél be (platform bug, teljesítmény, animációs trükk)

Egy döntés egy bekezdés. Ne írj esszét, de a **miért** mindig legyen benne.

### Commit szabályok
- **Egy művelet = egy commit.**
- A `docs/feature-tasks.md` frissítése **ugyanabba a commitba** menjen, mint a kód.
- Commit üzenet magyarul, jelen időben, egy sor, prefixszel:

```
setup: NativeWind konfigurálása
feat: főoldal új megjelenések rail
fix: üres Blu-ray lista DE fallback
db: mms séma és tmdb_cache migrációja
fn: mms-tmdb whitelist bővítése
docs: munkanapló és döntésnapló átvezetése
chore: lint hibák javítása
```

- Ha a commit döntést is tartalmaz, a törzsében hivatkozz rá:
  `Döntés: lásd docs/feature-tasks.md – D-004`
- **Ne pusholj** magadtól, csak ha kérem.
- Ne commitolj félkész, nem forduló kódot. Ha elakadtál, írd be a munkanaplóba,
  hol tartasz, és azt commitold (`docs:` prefixszel).

### Munkamenet indításakor
Először olvasd el a `docs/feature-tasks.md` **munkanaplóját és döntésnaplóját**, és
futtasd a `git status`-t. Ha van commitolatlan változás, előbb jelezd nekem.

---

## Titkok és biztonság
- Titkos kulcsot (TMDB kulcs, Supabase service role) soha ne tegyél kliens kódba
- `.env` gitignore-ban; a `.env.example` csak kulcsneveket tartalmaz
- Kliensben csak `EXPO_PUBLIC_SUPABASE_URL` és `EXPO_PUBLIC_SUPABASE_ANON_KEY`
- Külső API-t csak az `mms-tmdb` Edge Functionön keresztül hívunk

---

## Autentikáció (D-051)
- Supabase Auth, e-mail + jelszó, **opcionális**: fiók nélkül minden felhasználói adat eszközönként, AsyncStorage-ban.
- Bejelentkezve a watchlist, a szolgáltatók, a korhatár és a `hideMature` egy dokumentumként szinkronizálódik (`mms.user_data`, utolsó írás nyer).
- A kliens a szinkronhoz is csak Edge Functiont hív (`mms-sync`), táblát nem ér el. A függvény a felhasználót a JWT-ből azonosítja, a kliens `user_id`-ját nem hiszi el.
- A Supabase Auth felhasználói közösek a familyBudgettel (egy projekt). A familyBudget auth objektumaihoz, beállításaihoz és felhasználóihoz nem nyúlok; a felhasználó törlése és az Auth dashboard beállítások csak kifejezett kérésre.
- A munkamenetet a supabase-js tárolja AsyncStorage-ban (`mms-auth` kulcs), jelszót az app nem tárol.

---

## Kommunikáció
Légy tömör. Magyarázd el mi változott, hogyan lehet tesztelni, és mi lett a commit üzenet.

---

## Emlékeztető
**Minden feature ELŐTT:**
- Olvasd el ezt a fájlt
- Olvasd el a `docs/feature-tasks.md` munkanaplóját és döntésnaplóját
- Kövesd szigorúan
- A familyBudget adatbázis-objektumaihoz ne nyúlj
- Tiszta, egyszerű kódot írj
- Nyisd meg a képernyő design PNG-jét (`docs/design/`), iPhone és iPad változatot is, és pontosan replikáld

**Minden művelet UTÁN — kihagyás nélkül:**
- Pipáld ki az elvégzett sort a `docs/feature-tasks.md`-ben
- Írd be a munkanapló bejegyzést (mit, mely fájlokban, mi maradt nyitva)
- Ha döntés született, vedd fel a döntésnaplóba (mi, miért, mi volt az alternatíva)
- Commitolj — egy művelet, egy commit, a doksi frissítésével együtt

Ha ezt kihagyod, a következő munkamenet vakon indul. Ez nem opcionális lépés.
