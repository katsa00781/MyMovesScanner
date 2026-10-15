// Gyerek korhatár-chipek (0+ / 6+ / 12+): a TMDB `certification.lte` értékei, DE FSK (D-007).
export const kidsAgeLimits = [0, 6, 12] as const;

export type KidsAgeLimit = (typeof kidsAgeLimits)[number];
