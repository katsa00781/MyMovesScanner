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
  // Műfajok: a Keresésben „vígjáték”, „dráma” stb. is kategória. Ahol a TV-nek nincs megfelelő műfaja
  // (romantikus, thriller, történelmi), csak film jön; a sci-fi / fantasy / kaland / akció a TV-ben
  // összevont műfaj (10765, 10759).
  { key: 'comedy', stems: ['vigjatek', 'komedia', 'comedy'], movieGenres: [35], tvGenres: [35] },
  { key: 'romance', stems: ['romantik', 'szerelmes', 'romance'], movieGenres: [10749] },
  { key: 'thriller', stems: ['thriller', 'feszult'], movieGenres: [53] },
  { key: 'sciFi', stems: ['scifi', 'sci-fi', 'tudomanyos'], movieGenres: [878], tvGenres: [10765] },
  { key: 'drama', stems: ['dram'], movieGenres: [18], tvGenres: [18] },
  { key: 'fantasy', stems: ['fantasy', 'fantazia'], movieGenres: [14], tvGenres: [10765] },
  { key: 'animation', stems: ['animacio', 'rajzfilm', 'animation'], movieGenres: [16], tvGenres: [16] },
  { key: 'documentary', stems: ['dokumentum', 'documentary'], movieGenres: [99], tvGenres: [99] },
  { key: 'mystery', stems: ['rejtely', 'mystery'], movieGenres: [9648], tvGenres: [9648] },
  { key: 'history', stems: ['tortenelem', 'tortenelmi', 'history'], movieGenres: [36] },
  { key: 'family', stems: ['csaladi', 'family'], movieGenres: [10751], tvGenres: [10751] },
  { key: 'adventure', stems: ['kaland', 'adventure'], movieGenres: [12], tvGenres: [10759] },
  { key: 'action', stems: ['akcio', 'action'], movieGenres: [28], tvGenres: [10759] },
  // Témák (TMDB kulcsszavak): a kulcsszó-azonosítókat mintafilmek `keywords` listájából vettem,
  // és `discover` találatokon ellenőriztem.
  { key: 'pirate', stems: ['kaloz', 'pirate'], keywords: [12988] },
  { key: 'martialArts', stems: ['harcmuv', 'kungfu', 'karate', 'martialarts'], keywords: [779, 780] },
  { key: 'mafia', stems: ['maffi', 'mafia', 'gengszter', 'gangster'], keywords: [10391, 155538, 33421] },
  { key: 'serialKiller', stems: ['gyilkos', 'serialkiller'], keywords: [10714] },
  { key: 'prison', stems: ['borton', 'fogoly', 'prison'], keywords: [378, 9777] },
  { key: 'ancientRome', stems: ['romai', 'gladiator', 'ancientrome', 'antik'], keywords: [5049, 1405, 1394] },
  { key: 'worldWar2', stems: ['masodikvilag', 'ww2', 'worldwar2'], keywords: [1956] },
  { key: 'ghost', stems: ['szellem', 'kisert', 'ordogu', 'ghost', 'haunted'], keywords: [3358, 9712] },
  { key: 'robot', stems: ['robot'], keywords: [14544, 1373] },
  { key: 'dystopia', stems: ['disztopi', 'dystopia', 'cyberpunk'], keywords: [4565, 12190] },
  { key: 'trueStory', stems: ['valos', 'igaz', 'truestory', 'biograf'], keywords: [9672] },
  { key: 'courtroom', stems: ['birosag', 'tarsgyalas', 'ugyved', 'courtroom'], keywords: [3012, 163189, 254459] },
  { key: 'boxing', stems: ['boksz', 'box'], keywords: [209476, 2792] },
  { key: 'highSchool', stems: ['gimi', 'gimnazium', 'kozepisk', 'tizenev', 'tini', 'highschool'], keywords: [6270, 155722] },
  { key: 'wedding', stems: ['eskuvo', 'menyegzo', 'wedding'], keywords: [10955, 3584] },
  { key: 'musical', stems: ['musical', 'zenes'], keywords: [4344] },
  { key: 'dragon', stems: ['sarkany', 'dragon'], keywords: [12554] },
  { key: 'fairyTale', stems: ['mese', 'fairytale'], keywords: [3205] },
  { key: 'viking', stems: ['vikin'], keywords: [5895] },
  { key: 'conspiracy', stems: ['osszeeskuv', 'conspiracy'], keywords: [10410] },
  { key: 'survival', stems: ['tuleles', 'survival'], keywords: [10349, 155746] },
] as const satisfies readonly SearchCategory[];

export type SearchCategoryKey = (typeof searchCategories)[number]['key'];
