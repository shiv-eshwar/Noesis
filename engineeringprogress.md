# Noesis — Engineering Progress

Living checklist. **Update this file whenever a slice lands** — mark todos, refresh Latest focus, keep it honest.  
Source of product truth: `WHAT-THIS-IS.md`. Source of “what exists”: `BUILT.md`.

---

## How we work

1. **Docs before code** — product intent and progress stay current.
2. **Reproduce, don’t invent** — behavior and API shapes come from the reference repomix; rename One Page → **Noesis**.
3. **One concern at a time** — Backend → Frontend → Database → Auth.
4. **One branch at a time** — each capability gets its own branch; merge/push when that slice is done.
5. **Push when green** — no half-broken APIs on `main`.
6. **Update this file on every merge** — check boxes, branch status, Latest focus, last-updated line.

### Locked decisions (Phase 1)

- Default branch: **`main`**
- Framework: **Next.js App Router** for everything (`app/api` = backend)
- Only five reference routes — no invented endpoints
- Brand voice → **Noesis**; paths stay `/api/layer`, etc.
- Keep 40-layer depth rail
- Cadence + placement scoring stay client-side (later)
- Grading: LLM + local fallback
- Chat last among backend routes
- LLM: both wired; Anthropic preferred
- Supabase/Auth ignored in Phase 1
- Done bar: `npm run build` + curl
- Package name `noesis`; later UI `Noesis.tsx` / `noesis:journey`

---

## Environment

| Item | Status | Notes |
|------|--------|-------|
| GitHub repo `shiv-eshwar/Noesis` | ✅ | https://github.com/shiv-eshwar/Noesis |
| Vercel project `noesis` | ✅ | Git linked to `main`; Supabase env vars set |
| Supabase project `Noesis` | ✅ | Mumbai `ebtayigvsooxoqizjmsf` |
| Local folder linked | ✅ | `.vercel/`, supabase link, git `origin` |
| Default branch `main` | ✅ | Was `master`; aligned with Vercel |
| `.env.example` tracked | ✅ | Secrets stay gitignored via `.env*` + `!.env.example` |
| LLM keys in `.env.local` | ✅ | `OPENAI_API_KEY` set (OpenAI returned 429 quota on live smoke — billing/quota) |
| Supabase journeys + anon auth | ✅ | Table + RLS; anon + email magic-link upgrade |
| LLM keys on Vercel | ✅ | `OPENAI_API_KEY` set (Production / Preview / Development) |

---

## Phase 0 — Documentation ✅

| Task | Status |
|------|--------|
| `README.md` (repo face) | ✅ |
| `WHAT-THIS-IS.md` (product law) | ✅ |
| `engineeringprogress.md` (this file) | ✅ |
| `BUILT.md` (what actually exists) | ✅ |
| Commit docs to `main` | ✅ |
| Default branch `main` | ✅ |

---

## Phase 1 — Backend ✅

Reproduce server surface from the reference. **No product UI.** Merged to `main`.

### Branch plan

| Order | Branch | Scope | Status |
|-------|--------|-------|--------|
| 1 | `backend/foundation` | Next.js shell + `lib/types`, `depth`, `llm`, `prompts`, `quiz-policy` (Noesis voice) | ✅ Merged |
| 2 | `backend/api-layer` | `POST /api/layer` + `quiz-normalize` | ✅ Merged |
| 3 | `backend/api-revise` | `POST /api/layer/revise` | ✅ Merged |
| 4 | `backend/api-placement` | `POST /api/placement` + `placement-parse` | ✅ Merged |
| 5 | `backend/api-quiz` | `POST /api/quiz` + `quiz-grade` / `quiz-grade-local` | ✅ Merged |
| 6 | `backend/api-chat` | `POST /api/chat` | ✅ Merged |

### Backend todos

- [x] Scaffold minimal Next.js app (App Router) — API-focused; no full UI
- [x] Port `lib/types.ts`, `lib/depth.ts`
- [x] Port `lib/llm.ts`, `lib/prompts.ts` (brand voice → Noesis)
- [x] Port quiz helpers (`quiz-normalize`, `quiz-policy`, `quiz-grade`, `quiz-grade-local`)
- [x] Port `lib/placement-parse.ts`
- [x] `POST /api/layer`
- [x] `POST /api/layer/revise`
- [x] `POST /api/placement`
- [x] `POST /api/quiz`
- [x] `POST /api/chat`
- [x] `npm run build` green with all five routes
- [x] Local smoke tests (curl): validation, missing-key path; `/api/quiz` local grading OK
- [x] `.env.example` for LLM setup
- [x] Update `BUILT.md` after merges
- [x] Add LLM key to `.env.local` (`OPENAI_API_KEY`)
- [x] Add LLM key to Vercel (`OPENAI_API_KEY`)

### Routes live on `main`

| Route | File |
|-------|------|
| `POST /api/layer` | `app/api/layer/route.ts` |
| `POST /api/layer/revise` | `app/api/layer/revise/route.ts` |
| `POST /api/placement` | `app/api/placement/route.ts` |
| `POST /api/quiz` | `app/api/quiz/route.ts` |
| `POST /api/chat` | `app/api/chat/route.ts` |

### Backend out of scope (deferred)

- React reader / landing / quiz UI → ✅ Phase 2
- Zustand stores → ✅ Phase 2
- Gaze / MediaPipe → ✅ Phase 2
- Supabase tables / Auth → Phases 3–4

---

## Phase 2 — Frontend ✅

Consume backend contracts only. Orchestrator branded **Noesis**.

### Branch plan

| Order | Branch | Scope | Status |
|-------|--------|-------|--------|
| 1 | `frontend/shell` | Layout, fonts, globals, theme, landing | ✅ |
| 2 | `frontend/journey` | Zustand journey store + orchestrator | ✅ |
| 3 | `frontend/reader-quiz` | Reader, quiz modal, depth rail, revise flow | ✅ |
| 4 | `frontend/placement-chat` | Placement + questions panel + selection | ✅ |
| 5 | `frontend/gaze-optional` | Opt-in camera / hand gestures | ✅ |

### Frontend todos

- [x] Landing + topic start
- [x] Loading / reading / quiz / passed / done states
- [x] Depth rail + text evolution motion
- [x] Placement path
- [x] Questions on selection
- [x] localStorage persistence (`noesis:journey`)
- [x] Polish: light/dark, motion timing
- [x] Opt-in gaze / hand gestures (MediaPipe)

---

## Phase 3 — Database ✅

### Branch plan

| Order | Branch | Scope | Status |
|-------|--------|-------|--------|
| 1 | `db/schema` | `journeys` migration + RLS | ✅ |
| 2 | `db/client` | Supabase browser client | ✅ |
| 3 | `db/sync` | Anonymous auth + hydrate/upsert | ✅ |

### Database todos

- [x] Schema for journeys / layer progress (Supabase)
- [x] Replace or sync localStorage with remote persistence (localStorage remains fallback)
- [x] RLS policies (own rows via `auth.uid()`; anonymous auth enabled)
- [x] Soft-fail sync — learning loop works offline

---

## Phase 4 — Auth ✅

Optional email magic link. Anonymous learning still works without signing in.

### Branch plan

| Order | Branch | Scope | Status |
|-------|--------|-------|--------|
| 1 | `auth/session` | Auth helpers + store; journey-sync session-aware | ✅ |
| 2 | `auth/ui` | AuthButton + AuthModal in top-controls | ✅ |
| 3 | `auth/upgrade` | Anonymous→email in place; Supabase redirect URLs | ✅ |

### Auth todos

- [x] Supabase Auth email magic link for multi-device / durable identity
- [x] Wire session to persisted journeys (same `auth.uid()` after upgrade)
- [x] Never require auth for a first local learning loop

---

## Latest focus

**Done:** Phase 0–4 on `main` — full reference-parity app (docs, five APIs, UI, journeys, optional auth). Ship-readiness docs synced; `npm run build` green.

**Now / next:** Use production URL for live learning; product polish as needed.

### Manual test checklist

1. Local: `npm run dev` → http://localhost:3000 — or production URL below
2. Landing loads; theme toggle works
3. Start a topic — layer generation via OpenAI
4. Quiz pass → next layer; fail → revise; placement; text-selection questions
5. Anonymous learning works without Sign in

**Production:** https://noesis-beryl.vercel.app (also https://noesis-shiv-shahs-projects.vercel.app) — `OPENAI_API_KEY` on Vercel.

---

## Notes for agents / contributors

- Prefer the reference repomix over inventing new endpoints or prompt philosophy.
- Brand: **Noesis** everywhere user-facing; Vercel project name remains `noesis`.
- Keep this file honest: check boxes only when merged and verified.
- **After every completed task or branch merge:** update this file and `BUILT.md`.
- Do **not** rebuild Phase 1–2 from scratch — parity is already on `main`.

---

*Last updated: 2026-07-18 — production live on Vercel with OPENAI_API_KEY.*

