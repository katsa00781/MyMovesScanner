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
 * Főoldal hero (02, 10 design): magasság, a szöveg és a felső sáv oldalsó margója, a tartalom
 * alsó kitöltése, a pöttyök alja.
 */
export const heroLayout = {
  phone: { height: 539, padX: 21, barPadX: 21, contentBottom: 24, dotsBottom: 0 },
  tablet: { height: 467, padX: 43, barPadX: 35, contentBottom: 19, dotsBottom: 24 },
} as const;

/** Poszter rács oszlopszámok. */
export const gridColumns = {
  phone: { default: 3, kids: 2 },
  tablet: { default: 6, kids: 4 },
} as const;
