-- Mymoviescanner: saját séma és TMDB cache tábla.
-- Csak additív. A familyBudget objektumokhoz nem nyúl.

create schema if not exists mms;

create table if not exists mms.tmdb_cache (
  key text primary key,
  payload jsonb not null,
  expires_at timestamptz not null
);

create index if not exists tmdb_cache_expires_at_idx
  on mms.tmdb_cache (expires_at);

-- A kliens nem éri el közvetlenül: RLS be, policy nincs, csak az Edge Function
-- (service_role) fér hozzá. A séma nincs kitéve a PostgREST API-nak.
alter table mms.tmdb_cache enable row level security;

revoke all on schema mms from public, anon, authenticated;
revoke all on all tables in schema mms from public, anon, authenticated;

grant usage on schema mms to service_role;
grant all on mms.tmdb_cache to service_role;
