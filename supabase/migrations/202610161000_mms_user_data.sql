-- Mymoviescanner: fiók szinkron (D-051). Felhasználónként egy dokumentum.
-- Csak additív. A familyBudget objektumokhoz nem nyúl; az auth.users-t csak hivatkozza.

create table if not exists mms.user_data (
  user_id uuid primary key references auth.users (id) on delete cascade,
  data jsonb not null,
  updated_at timestamptz not null default now()
);

-- A kliens nem éri el közvetlenül: RLS be, policy nincs, csak az mms-sync Edge Function
-- (service_role) fér hozzá, és ő is csak a JWT-ből azonosított felhasználó sorához.
alter table mms.user_data enable row level security;

revoke all on mms.user_data from public, anon, authenticated;
grant all on mms.user_data to service_role;
