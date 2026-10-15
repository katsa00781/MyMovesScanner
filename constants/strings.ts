// A design angol feliratai magyarul (D-011). Layout és stílus a designból jön.
export const strings = {
  appName: 'Mymoviescanner',

  tabs: {
    home: 'Főoldal',
    browse: 'Böngészés',
    kids: 'Gyerek',
    search: 'Keresés',
    watchlist: 'Watchlist',
    settings: 'Beállítások',
    myServices: 'SZOLGÁLTATÓIM',
  },

  common: {
    seeAll: 'Összes',
    trailer: 'Előzetes',
    watchlistAdd: 'Watchlist',
    cancel: 'Mégse',
    clear: 'Törlés',
    retry: 'Újra',
    loadError: 'Nem sikerült betölteni.',
    empty: 'Nincs találat.',
    today: 'Ma',
    yesterday: 'Tegnap',
    onYourServices: 'Előfizetéseim',
    film: 'Film',
    series: 'Sorozat',
    films: 'Filmek',
    seriesPlural: 'Sorozatok',
    people: 'Személyek',
    all: 'Mind',
  },

  onboarding: {
    step: (current: number, total: number) => `${current}. LÉPÉS / ${total}`,
    title: 'Mire fizetsz elő?',
    subtitle: 'Csak azt mutatjuk, ami elérhető a szolgáltatóidon.',
    continueWith: (count: number) => `Tovább ${count} szolgáltatóval`,
    skip: 'Kihagyom',
    region: 'Régió: Magyarország',
    kidsTitle: 'Gyerek korhatár',
    kidsSubtitle:
      'A Gyerek sarok csak eddig a korhatárig mutat meséket. Később a Beállításokban módosítható.',
    done: 'Kész',
  },

  home: {
    newOn: (provider: string) => `ÚJ A(Z) ${provider.toUpperCase()} KÍNÁLATÁBAN`,
    newOnServices: 'Újdonságok a szolgáltatóidon',
    noServices: 'Nincs kiválasztott előfizetés.',
    newBluray: 'Új Blu-ray megjelenések',
    trending: 'Népszerű Magyarországon',
    kidsPicks: 'Gyerekeknek',
    germanRelease: 'Német megjelenés',
    tmdbCredit:
      'Film adatok és képek: TMDB. A termék a TMDB API-t használja, de a TMDB nem támogatja és nem hitelesíti.',
    justWatchCredit: 'Streaming elérhetőség: JustWatch.',
  },

  browse: {
    title: 'Böngészés',
    myServices: 'Előfizetéseim',
    count: (titles: number, services: number) =>
      `${titles} cím a(z) ${services} kínálatában`,
    sortNewest: 'Legújabb elöl',
  },

  kids: {
    title: 'Gyerek sarok',
    matureHidden: 'Felnőtt tartalom elrejtve',
    ageChips: ['0+', '6+', '12+'],
    bigAdventures: 'Nagy kalandok',
    ages: (age: number) => `${age}+ éveseknek`,
  },

  search: {
    title: 'Keresés',
    placeholder: 'Filmek, sorozatok, személyek',
    recent: 'Legutóbbi keresések',
    stream: 'Előfizetés',
    rent: 'Kölcsönzés',
    buy: 'Vásárlás',
  },

  title: {
    back: 'Vissza',
    share: 'Megosztás',
    watchlistAdd: 'Hozzáadás a watchlisthez',
    onWatchlist: 'A watchlistben',
    onYourService: (provider: string) => `ELŐFIZETÉSEIDEN: ${provider.toUpperCase()}`,
    whereToWatch: 'Hol nézhető',
    dataBy: 'Adatok: JustWatch',
    open: 'Megnyitás',
    noOffers: 'Magyarországon jelenleg nem nézhető.',
    onDisc: 'Lemezen',
    releaseInHungary: 'Megjelenés Magyarországon',
    remindMe: 'Emlékeztess',
    cast: 'Szereplők és stáb',
    about: 'Névjegy',
    director: 'Rendező',
    language: 'Nyelv',
    country: 'Ország',
  },

  watchlist: {
    title: 'Watchlist',
    all: 'Mind',
    availableNow: 'Elérhető most',
    comingSoon: 'Hamarosan',
    bluray: 'Blu-ray',
    cinema: 'Moziban',
    rentOnly: 'Csak kölcsönzés',
    buyOnly: 'Csak vásárlás',
    streaming: (year: string) => `Streaming ${year}`,
    empty: 'A watchlist még üres.',
  },

  settings: {
    title: 'Beállítások',
    myServices: 'Szolgáltatóim',
    editServices: 'Szolgáltatók szerkesztése',
    regionLanguage: 'Régió és nyelv',
    region: 'Régió',
    appLanguage: 'Alkalmazás nyelve',
    kidsCorner: 'Gyerek sarok',
    ageLimit: 'Korhatár',
    hideMature: 'Felnőtt tartalom elrejtése',
    about: 'Névjegy',
    version: 'Verzió',
    tmdb: 'TMDB',
    justWatch: 'JustWatch',
  },
} as const;
