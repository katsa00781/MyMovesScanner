import { strings } from '@/constants/strings';

/** Percből „2 ó 08 p” / „45 p”. */
export function formatRuntime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return hours > 0 ? `${hours} ó ${String(rest).padStart(2, '0')} p` : `${rest} p`;
}

/** ÉÉÉÉ-HH-NN dátumból „szept. 28.”. */
export function formatShortDate(date: string): string {
  return new Date(`${date}T00:00:00`).toLocaleDateString('hu-HU', {
    month: 'short',
    day: 'numeric',
  });
}

/** ÉÉÉÉ-HH-NN dátumból „nov.”. */
export function formatMonth(date: string): string {
  return new Date(`${date}T00:00:00`).toLocaleDateString('hu-HU', { month: 'short' });
}

/** ÉÉÉÉ-HH-NN dátumból „2026. nov. 14.”. */
export function formatFullDate(date: string): string {
  return new Date(`${date}T00:00:00`).toLocaleDateString('hu-HU', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/** Nyelv / ország magyar neve az Intl-ből; ha a motor nem tudja, a TMDB neve. */
export function displayName(type: 'language' | 'region', code: string, fallback: string): string {
  try {
    return new Intl.DisplayNames(['hu'], { type }).of(code) ?? fallback;
  } catch {
    return fallback;
  }
}

/** ÉÉÉÉ-HH-NN dátumból „Ma” / „Tegnap” / „szept. 28.” (helyi idő szerint). */
export function formatRelativeDate(date: string): string {
  const day = new Date(`${date}T00:00:00`);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const daysAgo = Math.round((today.getTime() - day.getTime()) / 86_400_000);
  if (daysAgo === 0) return strings.common.today;
  if (daysAgo === 1) return strings.common.yesterday;
  return formatShortDate(date);
}
