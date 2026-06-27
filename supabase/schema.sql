-- ─────────────────────────────────────────────────────────────────────────────
-- Smart Chatbot — Supabase schema
-- Run this once in the Supabase SQL editor (Database → SQL Editor → New query)
-- ─────────────────────────────────────────────────────────────────────────────

-- 1. pgvector extension (already available on Supabase)
create extension if not exists vector;

-- ─────────────────────────────────────────────────────────────────────────────
-- 2. Knowledge-base documents (RAG source)
--    voyage-3-lite produces 512-dimensional vectors (free tier)
-- ─────────────────────────────────────────────────────────────────────────────
create table if not exists documents (
  id          uuid primary key default gen_random_uuid(),
  content     text        not null,
  metadata    jsonb       not null default '{}',
  embedding   vector(512),          -- 512 dims = voyage-3-lite
  created_at  timestamptz not null default now()
);

create index if not exists documents_embedding_idx
  on documents using ivfflat (embedding vector_cosine_ops)
  with (lists = 100);

-- ─────────────────────────────────────────────────────────────────────────────
-- 3. Conversation history (long-term memory)
-- ─────────────────────────────────────────────────────────────────────────────
create table if not exists conversations (
  id          uuid primary key default gen_random_uuid(),
  session_id  text        not null,
  role        text        not null check (role in ('user', 'assistant', 'tool')),
  content     text        not null,
  metadata    jsonb       not null default '{}',
  created_at  timestamptz not null default now()
);

create index if not exists conversations_session_idx
  on conversations (session_id, created_at desc);

-- ─────────────────────────────────────────────────────────────────────────────
-- 4. Captured leads
-- ─────────────────────────────────────────────────────────────────────────────
create table if not exists leads (
  id          uuid primary key default gen_random_uuid(),
  session_id  text,
  name        text,
  email       text,
  phone       text,
  message     text,
  source      text,        -- 'telegram' | 'widget'
  metadata    jsonb        not null default '{}',
  created_at  timestamptz  not null default now()
);

-- ─────────────────────────────────────────────────────────────────────────────
-- 5. Orders (for order-status tool)
-- ─────────────────────────────────────────────────────────────────────────────
create table if not exists orders (
  id              text primary key,
  customer_name   text,
  customer_email  text,
  status          text not null default 'processing'
                    check (status in ('processing','shipped','delivered','cancelled')),
  items           jsonb not null default '[]',
  total           numeric(10,2),
  tracking_number text,
  estimated_delivery date,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- Demo orders
insert into orders (id, customer_name, customer_email, status, items, total, tracking_number, estimated_delivery)
values
  ('ORD-1001', 'Alice Johnson', 'alice@example.com', 'shipped',
   '[{"name":"RTX 4070","qty":1,"price":599.99},{"name":"Ryzen 7 7700X","qty":1,"price":299.99}]',
   899.98, 'TRK-998877', current_date + 3),
  ('ORD-1002', 'Bob Smith', 'bob@example.com', 'delivered',
   '[{"name":"Custom Gaming PC (assembled)","qty":1,"price":1350.00}]',
   1350.00, 'TRK-112233', current_date - 2),
  ('ORD-1003', 'Carol White', 'carol@example.com', 'processing',
   '[{"name":"32GB DDR5 RAM","qty":2,"price":89.99},{"name":"1TB NVMe SSD","qty":1,"price":79.99}]',
   259.97, null, current_date + 7)
on conflict (id) do nothing;

-- ─────────────────────────────────────────────────────────────────────────────
-- 6. match_documents() — called by the RAG engine
--    Uses 512-dim vectors to match voyage-3-lite embeddings
-- ─────────────────────────────────────────────────────────────────────────────
create or replace function match_documents(
  query_embedding  vector(512),
  match_threshold  float   default 0.65,
  match_count      int     default 5
)
returns table (
  id          uuid,
  content     text,
  metadata    jsonb,
  similarity  float
)
language sql stable
as $$
  select
    id,
    content,
    metadata,
    1 - (embedding <=> query_embedding) as similarity
  from documents
  where 1 - (embedding <=> query_embedding) > match_threshold
  order by embedding <=> query_embedding
  limit match_count;
$$;
