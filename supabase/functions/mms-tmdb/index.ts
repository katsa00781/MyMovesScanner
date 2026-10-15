// mms-tmdb: whitelistes TMDB proxy cache-sel.
// Kérés: POST { "path": "discover/movie", "params": { "with_genres": "16" } }
// A TMDB kulcs Supabase secret (TMDB_API_KEY), soha nem kerül válaszba vagy logba.
import postgres from 'npm:postgres@3.4.5';

const TMDB_BASE = 'https://api.themoviedb.org/3';
const HOUR = 60 * 60;
const DAY = 24 * HOUR;

// Engedélyezett végpontok és cache TTL (másodperc). Tükör: lib/api.ts.
const ROUTES: { pattern: RegExp; ttl: number }[] = [
  { pattern: /^discover\/(movie|tv)$/, ttl: 6 * HOUR },
  { pattern: /^trending\/(movie|tv)\/(day|week)$/, ttl: 6 * HOUR },
  { pattern: /^search\/(multi|movie|tv|person)$/, ttl: 6 * HOUR },
  { pattern: /^watch\/providers\/(movie|tv)$/, ttl: DAY },
  { pattern: /^(movie|tv)\/\d+$/, ttl: 7 * DAY },
];

const MAX_PARAMS = 20;
const MAX_VALUE_LENGTH = 300;

const sql = postgres(Deno.env.get('SUPABASE_DB_URL')!, { max: 1, prepare: false });

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

// Csak egyszerű string paramétereket enged, az api_key-t eldobja.
function cleanParams(input: unknown): Record<string, string> | null {
  if (input === undefined) return {};
  if (typeof input !== 'object' || input === null || Array.isArray(input)) return null;
  const entries = Object.entries(input as Record<string, unknown>).filter(
    ([key]) => key !== 'api_key',
  );
  if (entries.length > MAX_PARAMS) return null;
  const params: Record<string, string> = {};
  for (const [key, value] of entries) {
    if (!/^[a-z_.]+$/.test(key)) return null;
    if (typeof value !== 'string' && typeof value !== 'number' && typeof value !== 'boolean') {
      return null;
    }
    const text = String(value);
    if (text.length > MAX_VALUE_LENGTH) return null;
    params[key] = text;
  }
  return params;
}

Deno.serve(async (req) => {
  if (req.method !== 'POST') return json({ error: 'method_not_allowed' }, 405);

  let body: { path?: unknown; params?: unknown };
  try {
    body = await req.json();
  } catch {
    return json({ error: 'invalid_json' }, 400);
  }

  const path = typeof body.path === 'string' ? body.path : '';
  const route = ROUTES.find((r) => r.pattern.test(path));
  if (!route) return json({ error: 'path_not_allowed' }, 403);

  const params = cleanParams(body.params);
  if (!params) return json({ error: 'invalid_params' }, 400);
  if (!params.language) params.language = 'hu-HU';

  const query = new URLSearchParams(Object.entries(params).sort(([a], [b]) => a.localeCompare(b)));
  const key = `${path}?${query.toString()}`;

  try {
    const cached = await sql`
      select payload from mms.tmdb_cache where key = ${key} and expires_at > now()
    `;
    if (cached.length > 0) return json(cached[0].payload);
  } catch (error) {
    console.error('cache read failed', error instanceof Error ? error.message : 'unknown');
  }

  const apiKey = Deno.env.get('TMDB_API_KEY');
  if (!apiKey) return json({ error: 'server_not_configured' }, 500);

  query.set('api_key', apiKey);
  const response = await fetch(`${TMDB_BASE}/${path}?${query.toString()}`);
  if (!response.ok) return json({ error: 'tmdb_error', status: response.status }, 502);
  const payload = (await response.json()) as postgres.JSONValue;
  const expiresAt = new Date(Date.now() + route.ttl * 1000).toISOString();

  try {
    await sql`
      insert into mms.tmdb_cache (key, payload, expires_at)
      values (${key}, ${sql.json(payload)}, ${expiresAt})
      on conflict (key) do update
        set payload = excluded.payload, expires_at = excluded.expires_at
    `;
  } catch (error) {
    console.error('cache write failed', error instanceof Error ? error.message : 'unknown');
  }

  return json(payload);
});
