-- Supabase Auth + Chat Persistence Migration
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor → New query)

-- Conversations table
create table conversations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  title text default '',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Messages table
create table messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid references conversations(id) on delete cascade not null,
  role text not null check (role in ('user', 'assistant')),
  content jsonb not null,
  citations jsonb,
  created_at timestamptz default now()
);

-- Row Level Security
alter table conversations enable row level security;
alter table messages enable row level security;

-- Conversation policies: users can only access their own
create policy "Users read own conversations" on conversations
  for select using (auth.uid() = user_id);
create policy "Users insert own conversations" on conversations
  for insert with check (auth.uid() = user_id);
create policy "Users update own conversations" on conversations
  for update using (auth.uid() = user_id);
create policy "Users delete own conversations" on conversations
  for delete using (auth.uid() = user_id);

-- Message policies: users can only access messages in their own conversations
create policy "Users read own messages" on messages
  for select using (
    conversation_id in (select id from conversations where user_id = auth.uid())
  );
create policy "Users insert own messages" on messages
  for insert with check (
    conversation_id in (select id from conversations where user_id = auth.uid())
  );

-- Indexes for performance
create index idx_conversations_user_id on conversations(user_id);
create index idx_messages_conversation_id on messages(conversation_id);
create index idx_conversations_updated_at on conversations(user_id, updated_at desc);

-- ─────────────────────────────────────────────
-- Brain: Memory system
-- ─────────────────────────────────────────────

-- Memories table — one row per conversation turn, summarised in background
create table memories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  conversation_id uuid references conversations(id) on delete cascade,
  summary text not null,
  keywords text[] not null default '{}',
  turn_index integer not null default 0,
  created_at timestamptz default now()
);

alter table memories enable row level security;

create policy "Users read own memories" on memories
  for select using (auth.uid() = user_id);
create policy "Users insert own memories" on memories
  for insert with check (auth.uid() = user_id);
create policy "Users delete own memories" on memories
  for delete using (auth.uid() = user_id);

-- Indexes: user lookup, conversation lookup, keyword search (GIN for array overlap)
create index idx_memories_user_id on memories(user_id);
create index idx_memories_conversation_id on memories(conversation_id);
create index idx_memories_keywords on memories using gin(keywords);
create index idx_memories_created_at on memories(user_id, created_at desc);
