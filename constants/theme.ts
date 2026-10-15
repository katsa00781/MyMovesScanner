import tokens from './theme.json';

// Design tokenek, forrás: constants/theme.json. A NativeWind osztályokhoz
// (bg-surface, text-accent, rounded-card, text-title) a tailwind.config.js ugyanezt
// a JSON-t olvassa. Betűtípus: az iOS rendszerfontja (SF), súly: font-semibold/bold/extrabold.
export const colors = tokens.colors;
export const radius = tokens.radius;
export const fontSize = tokens.fontSize;
export const layout = tokens.layout;

/** `useWindowDimensions().width >= TABLET_MIN_WIDTH` → tablet. */
export const TABLET_MIN_WIDTH = 768;

/** Poszter rail mérete (02, 10 design): kártyaszélesség, köz a kártyák között, oldalsó margó. */
export const railLayout = {
  phone: { cardWidth: 134, gap: 12, inset: 21 },
  tablet: { cardWidth: 146, gap: 16, inset: 35 },
} as const;

/**
 * „Népszerű Magyarországon” rail (02, 10 design): a poszter mérete, a kártya eltolása az elem
 * bal szélétől (`lead`), az elem állandó szélessége (`pitch`; a sorszám a kártya mögé nyúlik),
 * a sorszám betűmérete és hogy a jobb széle mennyivel nyúlik a kártya bal széle mögé.
 */
export const trendingLayout = {
  phone: { cardWidth: 109, gap: 0, inset: 21, lead: 32, pitch: 172, numberSize: 104, numberOverlap: 16 },
  tablet: { cardWidth: 121, gap: 0, inset: 35, lead: 35, pitch: 201, numberSize: 116, numberOverlap: 18 },
} as const;

/** „Gyerekeknek” fekvő kártyák (02, 10 design): kártyaszélesség, köz, oldalsó margó. */
export const wideRailLayout = {
  phone: { cardWidth: 272, gap: 12, inset: 21 },
  tablet: { cardWidth: 288, gap: 16, inset: 35 },
} as const;

/** A fekvő gyerek kártyák felirat előtti pöttyének színei, körbeforgatva (a design sorrendje). */
export const kidsAccents = [
  colors.kidsBlue,
  colors.kidsMint,
  colors.kidsCoral,
  colors.kidsYellow,
] as const;

/**
 * Főoldal hero (02, 10 design): magasság, a szöveg és a felső sáv oldalsó margója, a tartalom
 * alsó kitöltése, a pöttyök alja.
 */
export const heroLayout = {
  phone: { height: 539, padX: 21, barPadX: 21, contentBottom: 24, dotsBottom: 0 },
  tablet: { height: 467, padX: 43, barPadX: 35, contentBottom: 19, dotsBottom: 24 },
} as const;

/**
 * Adatlap hero (06, 14 design): magasság (a gombok aljáig), a szöveg és a felső sáv oldalsó
 * margója. A kép a hero mögött, a gombok alatt már feketébe fakul.
 */
export const titleLayout = {
  phone: { height: 561, padX: 21, barPadX: 17 },
  tablet: { height: 508, padX: 43, barPadX: 26 },
} as const;

/**
 * Adatlap blokkjai (06, 14 design): a szekciók köze, a „Szereplők” kör mérete, elem- és betűmérete,
 * valamint az iPad két oszlopának aránya (a Hol nézhető 489, a Névjegy 362 px, köztük 38 px).
 */
export const titleSections = {
  phone: { gap: 28, castCircle: 76, castItem: 90, castGap: 12, castInitials: 25, castNameGap: 9 },
  tablet: { gap: 34, castCircle: 88, castItem: 104, castGap: 11, castInitials: 30, castNameGap: 7 },
} as const;
export const titleColumns = { left: 489, right: 362, gap: 38 } as const;

/** Monogramos szereplő-körök színátmenete (felül, alul), körbeforgatva (a design sorrendje). */
export const castGradients = [
  ['#5350C3', '#2F2E56'],
  ['#2B96A9', '#21474F'],
  ['#D7870C', '#5C4317'],
  ['#D75770', '#5E303B'],
  ['#2DB342', '#1F4A28'],
  ['#9F4DC9', '#442B52'],
  ['#57AFD3', '#2C4854'],
  ['#90795A', '#3F3830'],
] as const;

/**
 * Poszter rács (07, 15 design): oldalsó margó, oszlopköz, sorköz. A kártyaszélességet az oszlopszám
 * (`gridColumns`) és a képernyő szélessége adja.
 */
export const gridLayout = {
  phone: { inset: 21, gap: 11, rowGap: 15 },
  tablet: { inset: 35, gap: 14, rowGap: 20 },
} as const;

/** Watchlist fejléc (07, 15 design): a telefon fejlécsor magassága, az iPad szegmens-vezérlő szélessége. */
export const watchlistLayout = {
  phone: { barTop: 3, barHeight: 42, controlGap: 19 },
  tablet: { barTop: 27, barHeight: 41, controlWidth: 438 },
  gridTop: 20,
} as const;

/**
 * Böngészés fejléc (03, 11 design): a fejlécsor teteje és magassága, a függőleges távolságok a
 * sorok között (fejléc → szolgáltatók → műfaj chipek → találatszám → rács), a találatszám-sor
 * magassága (telefon) és a rács sorköze (telefonon 2 px-szel nagyobb, mint a Watchlistben).
 */
export const browseLayout = {
  phone: { barTop: 3, barHeight: 42, servicesGap: 18, genresGap: 18, countGap: 17, countHeight: 20, gridTop: 16, rowGap: 17 },
  tablet: { barTop: 27, barHeight: 41, servicesGap: 19, genresGap: 18, countGap: 0, countHeight: 0, gridTop: 20, rowGap: 20 },
} as const;

/**
 * Gyerek sarok (04, 12 design): a fejlécsor teteje és magassága (a cím 38 pt), a függőleges
 * távolságok a sorok között (cím → felnőtt-tartalom badge → korhatár chipek → téma chipek →
 * szekciócím → rács), az iPad korhatár chipjeinek eltolása a fejléc tetejétől és a badge
 * szélessége, valamint a kártya-rács (oldalsó margó, oszlopköz, sorköz a felirat alatt).
 */
export const kidsLayout = {
  phone: {
    barTop: 7, barHeight: 44, badgeGap: 19, badgeWidth: undefined, ageChipsTop: 0, ageChipsGap: 21,
    themesGap: 19, headingGap: 25, gridTop: 22, inset: 21, gap: 16, rowGap: 21,
  },
  tablet: {
    barTop: 35, barHeight: 44, badgeGap: 23, badgeWidth: 266, ageChipsTop: 52, ageChipsGap: 0,
    themesGap: 21, headingGap: 28, gridTop: 24, inset: 34, gap: 24, rowGap: 26,
  },
} as const;

/**
 * Keresés (05, 13 design): oldalsó margó, a keresőmező magassága és sarka, a függőleges távolságok
 * (cím → mező → legutóbbiak → szűrő chipek → találatok). Az iPad széles nézetében (az oldalsáv
 * nélküli szélesség ≥ `twoColumnsMin`) a Legutóbbiak külön oszlopba kerülnek: az oszlopok a mező
 * alatt `columnsTop` távolságra indulnak, a bal oszlop `recentWidth` széles, köztük `columnGap`
 * a köz; a bal lista a fejléc-sor alatt `recentListTop`, a találatok `columnResultsTop` távolságra
 * indulnak (egy oszlopban a találatok a szűrő chipek alatt `resultsTop` távolságra).
 */
export const searchLayout = {
  phone: {
    inset: 21, fieldGap: 19, fieldHeight: 46, fieldRadius: 12,
    recentGap: 23, chipsGap: 17, filterGap: 16, resultsTop: 17,
  },
  tablet: {
    inset: 34, fieldGap: 29, fieldHeight: 51, fieldRadius: 14,
    recentGap: 23, chipsGap: 17, filterGap: 16, resultsTop: 17,
    twoColumnsMin: 830, columnsTop: 22, recentWidth: 282, columnGap: 38, recentListTop: 8,
    columnResultsTop: 11,
  },
} as const;

/**
 * Beállítások (08, 16 design): a kártyák oldalsó margója, a „Főoldal” link és a cím eltolása a
 * kártyák bal szélétől, a link teteje, a link és a cím köze, a cím sormagassága, a cím és az első
 * szekció köze (a szekciók köze mindenhol `sectionGap`). iPaden a tartalom legfeljebb `maxWidth`
 * széles (a design oldalsáv melletti területe), két oszlopban, köztük `columnGap` a köz; a design
 * iPad címe 40 pt (`text-titleTablet`), a link a cím feletti üres sávba kerül.
 */
export const settingsLayout = {
  phone: {
    inset: 17, backOffset: 7, titleOffset: 4, backTop: 18, titleGap: 23, titleHeight: 42, firstSectionGap: 27,
    maxWidth: undefined,
  },
  tablet: {
    inset: 43, backOffset: 0, titleOffset: 0, backTop: 2, titleGap: 2, titleHeight: 48, firstSectionGap: 26,
    maxWidth: 974, columnGap: 30,
  },
  sectionGap: 27,
} as const;

/** Poszter rács oszlopszámok. */
export const gridColumns = {
  phone: { default: 3, kids: 2 },
  tablet: { default: 6, kids: 4 },
} as const;
