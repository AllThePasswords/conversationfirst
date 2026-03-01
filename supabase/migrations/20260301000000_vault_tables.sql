-- Vault Migration: households, connections, connection_accounts, RPC
-- Creates the Layer 1 (Vault) infrastructure for ConversationFirst

-- ─── Households ─────────────────────────────────
create table households (
  id uuid primary key default gen_random_uuid(),
  name text default 'My Household',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table user_households (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  household_id uuid references households(id) on delete cascade not null,
  is_owner boolean default true,
  created_at timestamptz default now(),
  unique(user_id, household_id)
);

-- ─── Helper: check if user belongs to household ──
create or replace function user_in_household(hid uuid)
returns boolean as $$
  select exists (
    select 1 from user_households
    where user_id = auth.uid() and household_id = hid
  );
$$ language sql stable security definer;

-- ─── RLS for households ──────────────────────────
alter table households enable row level security;
alter table user_households enable row level security;

create policy "Users read own households" on households
  for select using (user_in_household(id));

create policy "Users read own user_households" on user_households
  for select using (user_id = auth.uid());

create policy "Users insert own user_households" on user_households
  for insert with check (user_id = auth.uid());

-- ─── ensure_household RPC ────────────────────────
-- Creates a household + links the current user atomically.
-- Returns existing household_id if already exists.
create or replace function ensure_household()
returns uuid as $$
declare
  hid uuid;
begin
  -- Check for existing
  select household_id into hid
  from user_households
  where user_id = auth.uid()
  limit 1;

  if hid is not null then
    return hid;
  end if;

  -- Create new household
  insert into households (name) values ('My Household')
  returning id into hid;

  -- Link user
  insert into user_households (user_id, household_id, is_owner)
  values (auth.uid(), hid, true);

  return hid;
end;
$$ language plpgsql security definer;

-- ─── Connections ─────────────────────────────────
create table connections (
  id uuid primary key default gen_random_uuid(),
  household_id uuid references households(id) on delete cascade not null,
  provider_type text not null check (provider_type in ('bank', 'email', 'api')),
  provider_name text not null,
  display_name text,
  status text not null default 'pending' check (status in ('pending', 'active', 'expired', 'revoked')),
  access_token text,
  refresh_token text,
  token_expires_at timestamptz,
  consent_expires_at timestamptz,
  metadata jsonb default '{}',
  created_by_app text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table connections enable row level security;

create policy "Users read household connections" on connections
  for select using (user_in_household(household_id));
create policy "Users insert household connections" on connections
  for insert with check (user_in_household(household_id));
create policy "Users update household connections" on connections
  for update using (user_in_household(household_id));
create policy "Users delete household connections" on connections
  for delete using (user_in_household(household_id));

create index idx_connections_household on connections(household_id);
create index idx_connections_status on connections(household_id, status);

-- ─── Connection Accounts ─────────────────────────
create table connection_accounts (
  id uuid primary key default gen_random_uuid(),
  connection_id uuid references connections(id) on delete cascade not null,
  household_id uuid references households(id) on delete cascade not null,
  external_id text not null,
  account_type text,
  display_name text,
  currency text default 'EUR',
  metadata jsonb default '{}',
  last_synced_at timestamptz,
  sync_error text,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table connection_accounts enable row level security;

create policy "Users read household accounts" on connection_accounts
  for select using (user_in_household(household_id));
create policy "Users insert household accounts" on connection_accounts
  for insert with check (user_in_household(household_id));
create policy "Users update household accounts" on connection_accounts
  for update using (user_in_household(household_id));

create index idx_connection_accounts_connection on connection_accounts(connection_id);
create index idx_connection_accounts_household on connection_accounts(household_id);
