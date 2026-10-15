# Mymoviescanner – Prompt sablonok

## Munkamenet indítása (új session elején)
```
Olvasd el a CLAUDE.md-et és a docs/feature-tasks.md munkanaplóját és
döntésnaplóját, futtasd a git status-t. Foglald össze egy bekezdésben, hol tartunk
és mi a következő feladat. Még ne kezdj bele semmibe.
```

## Következő feladat
```
Olvasd el a CLAUDE.md-et és kövesd szigorúan.
Csináld meg a docs/feature-tasks.md következő pipálatlan feladatát.
Minden művelet után commit, a munkanapló frissítésével együtt. Ne pushold.
```

## UI képernyő építése
```
Olvasd el a CLAUDE.md-et és kövesd szigorúan.
Implementáld a [képernyő neve] képernyőt pontosan a design alapján:
docs/design/[NN-phone-xxx].png és docs/design/[NN-ipad-xxx].png.
A minta posztereket/címeket ne másold, a tartalom TMDB-ből jön.
Ahol az adat nem tudja követni a designt, a CLAUDE.md D-011–D-015 döntései szerint járj el.
[Opcionális navigáció: pl. "A posztereket koppintva nyissa az adatlapot."]
Ne változtasd meg: [mit ne bántson].
Commit a végén.
```

## Adat bekötése (TMDB)
```
Olvasd el a CLAUDE.md-et és kövesd szigorúan.
Kösd be a [rail/képernyő] adatát a [hook neve] hookkal az mms-tmdb függvényen
keresztül. Lekérdezés: [discover paraméterek]. Kezeld a betöltés, üres és hiba
állapotot. Ha a függvény whitelistjét bővíteni kell, az külön commit legyen.
A meglévő UI-t pontosan őrizd meg.
```

## State integráció
```
Olvasd el a CLAUDE.md-et és kövesd szigorúan.
Integráld a [feature] state-et. Tárold a [adatot] Zustand-dal
@react-native-async-storage/async-storage perzisztenciával.
[Viselkedési szabály, pl. "Ha nincs kiválasztott szolgáltató, irányítsd az onboardingra."]
A meglévő UI-t pontosan őrizd meg. Commit a végén.
```

## Supabase migráció / függvény
```
Olvasd el a CLAUDE.md-et és kövesd szigorúan, különösen a Supabase szabályokat.
[Feladat]. Csak a mms sémát és mms- prefixű függvényt érintheted.
A familyBudget objektumaihoz ne nyúlj. Éles deploy előtt mutasd meg a SQL-t / diffet.
Commit a végén.
```

## Konkrét hiba javítása
```
Olvasd el a CLAUDE.md-et és kövesd szigorúan.
A [dolog] [tényleges viselkedés]. Helyes viselkedés: [elvárt viselkedés].
Semmilyen más viselkedést vagy layoutot ne változtass meg.
Commit a végén, fix: prefixszel.
```

## Feladat lezárása (ha valami kimaradt)
```
Zárd le ezt a feladatot:
1. Pipáld ki a sort a docs/feature-tasks.md-ben
2. Írj munkanapló bejegyzést (mit, mely fájlokban, mi maradt nyitva)
3. Ha döntés született, vedd fel a döntésnaplóba
4. Commitolj — a doksi frissítése ugyanabba a commitba menjen
Ne pushold.
```
