// TMDB szolgáltatónevek (kis-nagybetű nélkül egyeztetve), ebben a sorrendben kerülnek
// az onboarding elejére (D-022). Névre illesztünk, nem ID-ra; ami nincs a HU listában
// (pl. RTL+), az kimarad. A többi szolgáltató a TMDB HU sorrendjében követi őket.
export const featuredProviderNames: readonly string[] = [
  'Netflix',
  'HBO Max',
  'Disney Plus',
  'SkyShowtime',
  'Amazon Prime Video',
  'Apple TV',
  'RTL+',
];
