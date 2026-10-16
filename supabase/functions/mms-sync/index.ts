// mms-sync: a bejelentkezett felhasználó szinkron-dokumentuma (D-051).
// Kérés: POST { "action": "get" } vagy POST { "action": "put", "data": { ... } }
// A felhasználót a JWT-ből azonosítja; kliens által küldött azonosítót nem fogad el.
// A dokumentum alakja tükör: lib/sync.ts (SyncData).
import { createClient } from 'npm:@supabase/supabase-js@2';
import postgres from 'npm:postgres@3.4.5';

const MAX_BODY_BYTES = 200_000;
const MAX_PROVIDERS = 100;
const MAX_WATCHLIST = 500;
const MAX_TITLE_LENGTH = 300;
const MAX_POSTER_PATH_LENGTH = 200;
const AGE_LIMITS = [0, 6, 12];

const sql = postgres(Deno.env.get('SUPABASE_DB_URL')!, { max: 1, prepare: false });
const authClient = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_ANON_KEY')!, {
  auth: { persistSession: false, autoRefreshToken: false },
});

type WatchlistItem = {
  id: number;
  type: 'movie' | 'tv';
  title: string;
  posterPath: string | null;
  addedAt: number;
};

type SyncData = {
  v: 1;
  providerIds: number[];
  onboardingDone: boolean;
  kidsAgeLimit: number;
  hideMature: boolean;
  watchlist: WatchlistItem[];
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function parseWatchlistItem(value: unknown): WatchlistItem | null {
  if (!isRecord(value)) return null;
  const { id, type, title, posterPath, addedAt } = value;
  if (typeof id !== 'number' || !Number.isInteger(id)) return null;
  if (type !== 'movie' && type !== 'tv') return null;
  if (typeof title !== 'string' || title.length > MAX_TITLE_LENGTH) return null;
  if (posterPath !== null && (typeof posterPath !== 'string' || posterPath.length > MAX_POSTER_PATH_LENGTH)) {
    return null;
  }
  if (typeof addedAt !== 'number' || !Number.isFinite(addedAt)) return null;
  return { id, type, title, posterPath, addedAt };
}

// Csak az ismert mezőket engedi át, azokat is ellenőrizve; minden más eldobódik.
function parseSyncData(value: unknown): SyncData | null {
  if (!isRecord(value) || value.v !== 1) return null;
  const { providerIds, onboardingDone, kidsAgeLimit, hideMature, watchlist } = value;

  if (!Array.isArray(providerIds) || providerIds.length > MAX_PROVIDERS) return null;
  if (!providerIds.every((id) => typeof id === 'number' && Number.isInteger(id))) return null;
  if (typeof onboardingDone !== 'boolean' || typeof hideMature !== 'boolean') return null;
  if (typeof kidsAgeLimit !== 'number' || !AGE_LIMITS.includes(kidsAgeLimit)) return null;
  if (!Array.isArray(watchlist) || watchlist.length > MAX_WATCHLIST) return null;

  const items: WatchlistItem[] = [];
  for (const entry of watchlist) {
    const item = parseWatchlistItem(entry);
    if (!item) return null;
    items.push(item);
  }
  return {
    v: 1,
    providerIds: providerIds as number[],
    onboardingDone,
    kidsAgeLimit,
    hideMature,
    watchlist: items,
  };
}

Deno.serve(async (req) => {
  if (req.method !== 'POST') return json({ error: 'method_not_allowed' }, 405);

  const token = (req.headers.get('Authorization') ?? '').replace(/^Bearer\s+/i, '');
  const { data: auth, error: authError } = await authClient.auth.getUser(token);
  if (authError || !auth.user) return json({ error: 'unauthorized' }, 401);
  const userId = auth.user.id;

  const text = await req.text();
  if (text.length > MAX_BODY_BYTES) return json({ error: 'too_large' }, 413);

  let body: unknown;
  try {
    body = JSON.parse(text);
  } catch {
    return json({ error: 'invalid_json' }, 400);
  }
  if (!isRecord(body)) return json({ error: 'invalid_body' }, 400);

  try {
    if (body.action === 'get') {
      const rows = await sql`
        select data, updated_at from mms.user_data where user_id = ${userId}
      `;
      if (rows.length === 0) return json({ data: null, updatedAt: null });
      return json({ data: rows[0].data, updatedAt: rows[0].updated_at });
    }

    if (body.action === 'put') {
      const data = parseSyncData(body.data);
      if (!data) return json({ error: 'invalid_data' }, 400);
      const rows = await sql`
        insert into mms.user_data (user_id, data, updated_at)
        values (${userId}, ${sql.json(data as unknown as postgres.JSONValue)}, now())
        on conflict (user_id) do update
          set data = excluded.data, updated_at = excluded.updated_at
        returning updated_at
      `;
      return json({ ok: true, updatedAt: rows[0].updated_at });
    }
  } catch (error) {
    console.error('sync failed', error instanceof Error ? error.message : 'unknown');
    return json({ error: 'server_error' }, 500);
  }

  return json({ error: 'unknown_action' }, 400);
});
