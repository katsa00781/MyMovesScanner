const BASE = 'https://image.tmdb.org/t/p';

export function posterUrl(path: string | null): string | null {
  return path ? `${BASE}/w342${path}` : null;
}

export function backdropUrl(path: string | null): string | null {
  return path ? `${BASE}/w1280${path}` : null;
}

export function logoUrl(path: string | null): string | null {
  return path ? `${BASE}/w92${path}` : null;
}
