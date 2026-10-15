import { strings } from '@/constants/strings';

/** Percből „2 ó 08 p” / „45 p”. */
export function formatRuntime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return hours > 0 ? `${hours} ó ${String(rest).padStart(2, '0')} p` : `${rest} p`;
}

/** ÉÉÉÉ-HH-NN dátumból „Ma” / „Tegnap” / „szept. 28.” (helyi idő szerint). */
export function formatRelativeDate(date: string): string {
  const day = new Date(`${date}T00:00:00`);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const daysAgo = Math.round((today.getTime() - day.getTime()) / 86_400_000);
  if (daysAgo === 0) return strings.common.today;
  if (daysAgo === 1) return strings.common.yesterday;
  return day.toLocaleDateString('hu-HU', { month: 'short', day: 'numeric' });
}
