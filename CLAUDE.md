# Berry PC Chatbot — Full Project Context for Claude

## How to work with this user

### USER ACTION REQUIRED convention
Any step the user must perform themselves (running a command, clicking something in a dashboard, editing a file manually) **must be explicitly labeled** with `USER ACTION REQUIRED` at the start. The user cannot see tool calls, so if you silently make a code change and then say "done", they won't know they still need to run a terminal command or paste SQL somewhere. Always be explicit.

### Which terminal to use
This user runs everything on **Windows 11**. When telling them to run terminal commands, always specify:
- **Local Windows terminal (PowerShell or Command Prompt)** — for `node`, `npm`, `git` commands
- They must `cd` into the project folder first before running any command
- Never assume they are in the right directory — always include the `cd` step
- Do NOT tell them to run Node.js/npm commands in the Render terminal, Supabase terminal, or any remote environment. Ingest scripts, git commands, and npm commands all run locally.

### Supabase SQL Editor
When the user needs to run SQL, always say **"in Supabase SQL Editor"** specifically. The user knows how to find it: Supabase dashboard → their project → SQL Editor.

### Render dashboard
When the user needs to add/update environment variables, always say **"in Render dashboard → your service → Environment"**. Do not just say "add to Render" — be specific.

### Communication style
- Always tell the user explicitly when all steps are done and what to test
- If there are multiple steps, number them clearly
- Explain WHY a step is needed, not just what to do — this user learns from understanding the reason
- When something might take time (model download, Render redeploy), tell them how long to expect and what to look for to know it's done
- Keep responses concise but complete — don't pad, don't omit critical steps
- Do not use the word "straightforward" or "simple" — if something goes wrong it feels dismissive

---

## Project overview
An AI-powered customer support chatbot for **Berry PC**, a gaming-only PC components and custom build workshop. The bot helps customers find gaming hardware, compare components, get build recommendations, and initiate purchases.

**Berry PC is gaming-only.** No workstations, no office PCs, no everyday computing. If a customer asks about non-gaming topics, the bot redirects warmly.

Two interfaces:
- **Telegram bot** — primary interface
- **Embeddable web widget** — JavaScript snippet that injects a chat bubble into any webpage

---

## Tech stack
- **Runtime:** Node.js (ES modules — `"type": "module"` in package.json, use `import/export` everywhere)
- **Server:** Express
- **LLM:** Groq API — `llama-3.3-70b-versatile` via OpenAI-compatible SDK (baseURL: `https://api.groq.com/openai/v1`)
- **RAG:** Supabase + pgvector, local embeddings via `Xenova/all-MiniLM-L6-v2` (~25MB)
- **Hybrid search:** Vector similarity (70%) + PostgreSQL full-text search BM25 (30%)
- **Database:** Supabase (free tier)
- **Email alerts:** Resend API (`resend` npm package)
- **Deployment:** Render (web service, auto-deploys from GitHub `main` branch on every push)
- **Telegram:** webhook mode (not polling), registered via `bot.setWebHook()`

---

## Language support
The bot responds in 12 languages: English, Spanish, French, Portuguese, Italian, German, Russian, Japanese, Korean, Chinese (Simplified), Arabic, and Persian (Farsi).

**Important:** The LLM (Llama 3.3) handles all language detection and response generation. The embedding model stays English-only (`all-MiniLM-L6-v2`). The multilingual embedding model (`paraphrase-multilingual-MiniLM-L12-v2`) was tried but caused an out-of-memory crash on Render's free tier (512MB RAM limit). Do not attempt to switch back to it unless the user upgrades to a Render plan with at least 2GB RAM.

The web widget has `dir="auto"` on all message elements, so Arabic and Persian text displays right-to-left correctly in the browser automatically.

---

## File structure and what each file does

```
src/
  server.js
    — Express app entry point
    — Mounts widget router, registers Telegram webhook
    — /health endpoint: queries Supabase to keep free tier alive (used by cron-job.org)
    — Pre-loads embedding model on startup via embed('warmup')

  core/
    agent.js
      — Main chat pipeline: short-term memory → RAG retrieval → Groq LLM → tool calls → reply
      — Contains SYSTEM_PROMPT (gaming-only focus, multilingual, emoji rules, lead capture rules)
      — Agentic loop: keeps calling Groq until no more tool calls are returned
      — Saves every message to long-term memory (Supabase conversations table)

    rag.js
      — Loads and caches the Xenova embedding model
      — embed(text): generates a 384-dimension vector
      — retrieve(query): calls match_documents_hybrid Supabase RPC function
      — ingest(content, metadata): inserts a chunk into documents table
      — MATCH_THRESHOLD default: 0.55, MATCH_COUNT default: 6 (overridden by env vars)

    memory.js
      — shortTerm(sessionId): in-process Map, keeps last 12 messages per session
      — saveLongTerm(sessionId, role, content): saves to Supabase conversations table
      — fetchLongTerm(sessionId): fetches recent messages from OTHER sessions (cross-session context)

    tools/
      index.js         — Registers all tools, dispatches tool calls by name
      leadCapture.js   — Saves name+email to leads table, sends Resend email alert to shop owner
      orderStatus.js   — Looks up order by ID in orders table, returns status + tracking info

  interfaces/
    telegram/webhook.js
      — Creates TelegramBot instance (polling: false)
      — Calls bot.setWebHook() on every startup to register with Telegram
      — Handles incoming messages: sends typing action, calls chat(), sends reply
      — Session ID format: tg-{chatId}

    widget/routes.js
      — POST /widget/chat: receives message, calls chat(), returns reply + sessionId
      — GET /widget/widget.js: serves self-contained embeddable JS chat bubble
      — Widget has RTL support (dir="auto" on message divs)
      — Session ID stored in browser localStorage

  lib/
    supabase.js        — Supabase client using SUPABASE_SERVICE_ROLE_KEY (bypasses RLS)

scripts/
  ingest.js
    — Run locally to populate the knowledge base
    — Imports ingest() from src/core/rag.js
    — Contains 157 chunks across 26 gaming product categories
    — NEVER run without first doing DELETE FROM documents in Supabase if changing embedding models
```

---

## Bot personality and behavior rules

### Tone
- Warm, enthusiastic, knowledgeable — like a fellow gamer at a gaming shop, not a corporate bot
- Use contractions naturally ("we've got", "you're looking at")
- Short answers by default (1–3 sentences). Only go into detail when the question genuinely requires it.
- Do NOT start replies with "Certainly!", "Of course!", "Absolutely!" or "As an AI..."

### Emoji rules (scale with message length)
- Short reply (1–3 sentences): one emoji maximum
- Medium reply (short paragraph or a few bullets): 1–2 emojis where they genuinely fit
- Long reply (detailed comparison, full build breakdown): 2–3 emojis at natural checkpoints, not all at the start
- Every emoji must be intentional — no decorative filler

### Gaming-only boundary
Berry PC sells gaming hardware only. If a customer asks about workstations, office PCs, or anything unrelated to gaming, redirect with:
> "That's a bit outside our lane here 😊 Berry PC is all about gaming — if you've got questions about a gaming build or any gaming hardware, I'm happy to help!"

### Lead capture (contact info collection)
- ONLY collect name + email when the customer **explicitly** says they are ready to purchase (e.g. "I want to buy this", "I'd like to order", "let's go ahead")
- Browsing, comparing, asking questions, discussing a build = do NOT trigger lead capture
- If the customer declines to share their contact info, accept gracefully and move on — never ask again in the same conversation
- When a lead is saved, an email alert is sent to the shop owner via Resend

### Knowledge base authority
The knowledge base always overrides LLM training data. Berry PC carries 2025 hardware (NVIDIA RTX 50 series Blackwell, AMD RX 9000 series RDNA 4) which is newer than Llama 3.3's training cutoff. If the knowledge base says a product exists, it exists — the bot must never deny or contradict it.

---

## Supabase schema
Run this entire block in Supabase SQL Editor to recreate everything from scratch:

```sql
create extension if not exists vector;

create table documents (
  id        uuid primary key default gen_random_uuid(),
  content   text,
  metadata  jsonb,
  embedding vector(384)
);

create table conversations (
  id         bigserial primary key,
  session_id text,
  role       text,
  content    text,
  metadata   jsonb,
  created_at timestamptz default now()
);

create table leads (
  id         bigserial primary key,
  session_id text,
  name       text,
  email      text,
  phone      text,
  message    text,
  source     text,
  created_at timestamptz default now()
);

create table orders (
  id                 text primary key,
  customer_name      text not null,
  customer_email     text,
  status             text not null default 'processing',
  items              text,
  tracking_number    text,
  estimated_delivery text,
  total              numeric(10,2),
  created_at         timestamptz default now(),
  updated_at         timestamptz default now()
);

create or replace function match_documents_hybrid(
  query_embedding vector(384),
  query_text      text,
  match_threshold float,
  match_count     int
)
returns table (id uuid, content text, metadata jsonb, similarity float)
language sql stable
as $$
  with
    vector_results as (
      select id, content, metadata,
        1 - (embedding <=> query_embedding) as vector_score
      from documents
      where 1 - (embedding <=> query_embedding) > match_threshold
    ),
    text_results as (
      select id, content, metadata,
        ts_rank(to_tsvector('simple', content), plainto_tsquery('simple', query_text)) as text_score
      from documents
      where to_tsvector('simple', content) @@ plainto_tsquery('simple', query_text)
    ),
    combined as (
      select
        coalesce(v.id, t.id)             as id,
        coalesce(v.content, t.content)   as content,
        coalesce(v.metadata, t.metadata) as metadata,
        (coalesce(v.vector_score, 0) * 0.7 + coalesce(t.text_score, 0) * 0.3) as similarity
      from vector_results v
      full outer join text_results t using (id)
    )
  select id, content, metadata, similarity
  from combined
  order by similarity desc
  limit match_count;
$$;
```

**No RLS on any table.** The backend uses the service role key which bypasses RLS entirely. Do not enable RLS — it adds complexity with no benefit for this setup.

---

## Environment variables
Must be set in BOTH the local `.env` file AND Render dashboard. Render's values override `.env` — if they differ, Render wins in production.

| Variable | Value / Description |
|---|---|
| `GROQ_API_KEY` | Groq API key |
| `GROQ_MODEL` | `llama-3.3-70b-versatile` |
| `SUPABASE_URL` | Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key |
| `TELEGRAM_BOT_TOKEN` | From BotFather |
| `WEBHOOK_BASE_URL` | Render deployment URL e.g. `https://your-app.onrender.com` (NOT the ngrok URL — that's local dev only) |
| `RESEND_API_KEY` | Resend API key for lead email alerts |
| `ALERT_EMAIL` | Shop owner email that receives lead notifications |
| `RAG_MATCH_THRESHOLD` | `0.55` |
| `RAG_MATCH_COUNT` | `6` |
| `SHORT_TERM_WINDOW` | `12` |
| `LONG_TERM_FETCH` | `6` |
| `PORT` | `3000` (local only) |

---

## How to run locally
```bash
cd "path/to/project"
npm install
node src/server.js        # production mode
npm run dev               # development mode with nodemon (auto-restart on file save)
```

For Telegram to work locally: start ngrok, set `WEBHOOK_BASE_URL` to the ngrok HTTPS URL in `.env`, restart the server.

---

## Knowledge base — re-ingestion workflow
Do this whenever `scripts/ingest.js` changes OR if the embedding model changes:

**USER ACTION REQUIRED — Step 1:** In Supabase SQL Editor:
```sql
DELETE FROM documents;
```

**USER ACTION REQUIRED — Step 2:** In local Windows terminal:
```bash
cd "path/to/project"
node scripts/ingest.js
```
Wait for the script to fully finish — it logs each chunk. 157 chunks total, takes 2–5 minutes.

**CRITICAL:** Never run the ingest script on top of existing documents from a different embedding model. The vectors will be incompatible and the bot will return garbage or fall back to training data.

---

## Deployment workflow
```bash
git add <files>
git commit -m "description"
git push
```
Render auto-deploys on push to `main`. Wait 1–2 minutes after the push, then test. Check Render logs if something breaks.

---

## Keep-alive setup
- **cron-job.org** pings `{RENDER_URL}/health` every 3 days
- The `/health` endpoint queries Supabase (`SELECT id FROM documents LIMIT 1`) to keep the free tier database active
- This prevents both Render (which sleeps after inactivity on free tier) and Supabase (which pauses after 7 days of no database activity) from going dormant

---

## Viewing conversation logs and leads
All conversations are saved to the `conversations` table in Supabase. All leads (customers who expressed purchase intent) are in the `leads` table. View them via:
- Supabase dashboard → Table Editor
- Or SQL Editor: `SELECT * FROM conversations ORDER BY created_at DESC LIMIT 50;`

---

## Known issues and fixes

### Supabase free tier pauses
**Symptom:** Bot answers from training data, denies RTX 5090 exists, recommends outdated GPUs.
**Cause:** Supabase project went dormant. Schema is NOT wiped, but the project needs to be restored.
**Fix:**
1. Go to Supabase dashboard → restore the project
2. Verify the `documents` table exists (if it doesn't, run the schema SQL above)
3. Run `node scripts/ingest.js` locally if needed

### Bot denies RTX 5090 / recommends old GPUs
**Cause:** RAG retrieval failing (empty knowledge base or incompatible vectors), so LLM answers from its training data (which predates RTX 50 series).
**Fix:**
1. Check if Supabase is active (not paused)
2. Run `DELETE FROM documents;` then `node scripts/ingest.js`
3. If embedding model was recently changed, the DELETE + re-ingest is mandatory

### Out-of-memory crash on Render
**Symptom:** `FATAL ERROR: Ineffective mark-compacts near heap limit — JavaScript heap out of memory`
**Cause:** A large model was loaded (e.g. `paraphrase-multilingual-MiniLM-L12-v2` at ~120MB RAM). Render free tier has 512MB total.
**Fix:** Revert to `Xenova/all-MiniLM-L6-v2` in `src/core/rag.js`. Do NOT upgrade to a larger embedding model unless the Render plan has at least 2GB RAM.

### Bot not responding in Telegram at all
**Possible causes:**
1. Server crashed — check Render logs
2. `WEBHOOK_BASE_URL` is set to the local ngrok URL instead of the Render URL in Render's environment variables
3. Render hasn't finished deploying — wait 2 minutes after a push

### Wrong terminal
**Common user mistake:** Running `node scripts/ingest.js` from the home directory instead of the project directory, causing `Cannot find module` errors.
**Fix:** Always `cd` into the project folder first.

---

## What NOT to do
- Do not run `node scripts/ingest.js` without deleting old documents first if the embedding model changed
- Do not switch to `paraphrase-multilingual-MiniLM-L12-v2` or any large multilingual model — it OOMs on Render free tier
- Do not enable RLS on Supabase tables — service role key bypasses it anyway
- Do not add workstation, office, or non-gaming content to the knowledge base
- Do not trigger lead capture on browsing or questions — only on explicit purchase signals
- Do not commit `.env` — it contains all API keys and must stay out of git
- Do not tell the user to run commands on Render's terminal or Supabase's terminal — Node.js commands always run locally
- Do not update only the code default values for RAG thresholds — also update the Render environment variables, which override the code
