// Keresés kategóriák (D-048): a begépelt magyar szó kategóriára illeszkedik, és `discover`
// találatokat ad. A TMDB kulcsszavai angolok és a `search/keyword` nincs a függvény whitelistjén,
// ezért kurált a lista; bővítése egy sor. A kulcsszó-azonosítókat élő adaton ellenőriztem
// (mintafilmek `keywords` listájából). A `stems` ékezet nélküli, kisbetűs szótövek: egy szó
// akkor illeszkedik, ha valamelyik szótővel kezdődik (pl. „cápás” → `capa`).
// A műfaj-azonosítók filmre és sorozatra különbözhetnek; ahol hiányzik, az a típus kimarad.
export type SearchCategory = {
  key: string;
  stems: readonly string[];
  /** TMDB kulcsszavak, VAGY kapcsolattal. */
  keywords?: readonly number[];
  movieGenres?: readonly number[];
  tvGenres?: readonly number[];
};

export const searchCategories = [
  { key: 'disaster', stems: ['katasztrof', 'disaster'], keywords: [189411, 5096, 10617] },
  { key: 'shark', stems: ['capa', 'shark'], keywords: [2988, 158108, 15098, 324727] },
  { key: 'zombie', stems: ['zombi'], keywords: [12377, 186565] },
  { key: 'superhero', stems: ['szuperhos', 'superhero'], keywords: [9715] },
  { key: 'space', stems: ['vilagur', 'urhajo', 'urfilm', 'space'], keywords: [9882] },
  { key: 'dinosaur', stems: ['dinoszaurusz', 'dinos'], keywords: [12616] },
  { key: 'vampire', stems: ['vampir'], keywords: [3133] },
  { key: 'timeTravel', stems: ['idoutaz', 'timetravel'], keywords: [4379] },
  { key: 'spy', stems: ['kemfilm', 'kemes', 'kemtortenet', 'spy'], keywords: [470] },
  { key: 'heist', stems: ['rablas', 'rablo', 'heist'], keywords: [10051] },
  { key: 'monster', stems: ['szorny', 'monster'], keywords: [1299, 11100, 161791] },
  { key: 'carRace', stems: ['autoversen', 'autos'], keywords: [830] },
  { key: 'christmas', stems: ['karacsony', 'christmas'], keywords: [207317] },
  { key: 'submarine', stems: ['tengeralattjaro', 'submarine'], keywords: [339] },
  { key: 'magic', stems: ['varazs', 'boszorkany', 'magic'], keywords: [2343, 616, 177912] },
  { key: 'alien', stems: ['ufo', 'alien', 'foldonkivuli'], keywords: [9951, 14909] },
  { key: 'postApocalypse', stems: ['apokalip', 'posztapokalip'], keywords: [4458, 12332] },
  { key: 'animals', stems: ['allat'], keywords: [18165] },
  { key: 'sports', stems: ['sport'], keywords: [6075] },
  { key: 'horror', stems: ['horror', 'remfilm'], movieGenres: [27] },
  { key: 'crime', stems: ['krimi', 'bunugy'], movieGenres: [80], tvGenres: [80] },
  { key: 'war', stems: ['haboru', 'haborus'], movieGenres: [10752], tvGenres: [10768] },
  { key: 'western', stems: ['western', 'vadnyugat'], movieGenres: [37], tvGenres: [37] },
] as const satisfies readonly SearchCategory[];

export type SearchCategoryKey = (typeof searchCategories)[number]['key'];
