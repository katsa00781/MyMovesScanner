// Szolgáltatói keresőlinkek (D-042): a TMDB nem ad szolgáltatónkénti mélylinket, ezért a „Megnyitás”
// a szolgáltató keresőoldalát nyitja a cím nevével (iOS-en a hozzá tartozó app, ha telepítve van).
// TMDB szolgáltatónévre illesztünk (kis-nagybetű nélkül), ID-t nem tartalmaz; amelyik nincs a
// listában, annak a TMDB „hol nézhető” oldala nyílik. A linkformátumok a szolgáltatók webes
// keresőinek mintáját követik, és változhatnak: ha egy link nem működik, itt kell javítani.
export const providerSearchLinks: Record<string, (query: string) => string> = {
  netflix: (q) => `https://www.netflix.com/search?q=${q}`,
  'disney plus': (q) => `https://www.disneyplus.com/search/${q}`,
  'hbo max': (q) => `https://play.hbomax.com/search/result?q=${q}`,
  'amazon prime video': (q) => `https://www.primevideo.com/search/ref=atv_nb_sug?phrase=${q}`,
  'apple tv': (q) => `https://tv.apple.com/search?term=${q}`,
};
