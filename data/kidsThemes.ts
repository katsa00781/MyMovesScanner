// Gyerek sarok téma chipek (04, 12 design): TMDB kulcsszavak (D-015). Az azonosítókat élő
// adaton ellenőriztem: animals, space, princess, dinosaur, musical, sports.
export const kidsThemes = [
  { key: 'animals', keywordId: 18165 },
  { key: 'space', keywordId: 9882 },
  { key: 'princesses', keywordId: 7376 },
  { key: 'dinosaurs', keywordId: 12616 },
  { key: 'music', keywordId: 4344 },
  { key: 'sports', keywordId: 6075 },
] as const;

export type KidsTheme = (typeof kidsThemes)[number];
export type KidsThemeKey = KidsTheme['key'];
