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
- [ ] Keresés: debounce, Recent searches (`useSearchStore`), All/Films/Series/People, találati sor Stream/Rent/Buy chipekkel — design: 05, 13
- [ ] Beállítások: My services + Edit, Region & language, Kids corner, About (Notifications rejtve — D-013) — design: 08, 16
- [ ] iPad finomhangolás: rács oszlopszámok, kétoszlopos adatlap, portrait/landscape ellenőrzés a designnal összevetve

### Ship előtt
- [ ] Teljes flow tesztelése iPhone-on és iPaden
- [ ] Edge case-ek: üres szolgáltatólista, nincs találat, hosszú cím, nincs net, lassú net
- [ ] Lint + typecheck hibák nélkül
- [ ] CodeRabbit code review az AI által írt feature-ökhöz
- [ ] Dev utilities eltávolítása (test gombok, console.log-ok, mock data; `components/DevResetButton.tsx` + a sora az `app/_layout.tsx`-ben, D-029)
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

<!-- ÚJ DÖNTÉSEK IDE, ALULRA, NÖVEKVŐ SORSZÁMMAL -->
