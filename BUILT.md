# Noesis — Built

What actually exists today. Update only when something is real and verified.  
Product intent lives in `WHAT-THIS-IS.md`. Roadmap and todos live in `engineeringprogress.md`.

---

## Product in a sentence

A single, serif-led page that teaches one topic at a time, deepening as you prove you understand. Calm. Beautiful. No fluff.  
**Brand: Noesis.**

---

## What's Built

### Infrastructure

| Piece | Status | Detail |
|-------|--------|--------|
| GitHub | ✅ | https://github.com/shiv-eshwar/Noesis |
| Vercel | ✅ | Project `noesis`, GitHub connected |
| Supabase | ✅ | Project `Noesis` (`ebtayigvsooxoqizjmsf`, Mumbai) |
| Local env | ✅ | `.env.local` with Supabase URL/keys/DB password (gitignored) |
| Vercel env | ✅ | `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` (all envs) |
| LLM keys | ⬜ | Not yet configured for generation |

### Documentation

| File | Status | Role |
|------|--------|------|
| `README.md` | ✅ | Public face of the repo — product, status, workflow |
| `WHAT-THIS-IS.md` | ✅ | Living product spec & philosophy |
| `engineeringprogress.md` | ✅ | Phases, branch plan, todos |
| `BUILT.md` | ✅ | This file — inventory of what exists |

### Application code

| Slice | Status |
|-------|--------|
| Next.js 16 app shell | ✅ |
| Backend libs (`types`, `depth`, `llm`, `prompts`) | ✅ |
| Backend API routes | ✅ All five reference routes |
| Frontend UI | ✅ Full learning surface + optional gaze |
| Database schema | ✅ `journeys` + RLS + client sync |
| Auth | ⬜ Not started |

---

## Target architecture (reference — not all built yet)

Faithful to the reference implementation, branded Noesis.

### Backend (Phase 1)

| File / route | Role |
|--------------|------|
| `app/api/layer/route.ts` | `POST /api/layer` — generate a layer |
| `app/api/layer/revise/route.ts` | `POST /api/layer/revise` — rewrite after fail |
| `app/api/placement/route.ts` | `POST /api/placement` — placement quiz |
| `app/api/quiz/route.ts` | `POST /api/quiz` — grade short answers |
| `app/api/chat/route.ts` | `POST /api/chat` — questions panel |
| `lib/llm.ts` | Anthropic preferred, OpenAI fallback |
| `lib/prompts.ts` | System prompt = product voice |
| `lib/depth.ts` | Depth rail / layer kinds |
| `lib/types.ts` | Shared types |

### Frontend (Phase 2)

| File | Role |
|------|------|
| `app/page.tsx` | Entry — mounts Noesis shell |
| Orchestrator component | State flow + layer fetching |
| `Landing` | Topic input + suggestions |
| `Reader` | Layer display + motion |
| `Quiz` / modals | Active recall gate |
| Zustand store | Journey + localStorage |

### Database & auth (Phases 3–4)

| Piece | Role |
|-------|------|
| Supabase | Persist journeys across devices |
| Auth | Identity when persistence needs it |

---

## The flow (product — when app exists)

1. **Landing** — topic input + suggestions (+ optional placement)
2. **Loading** — fetch layer from backend
3. **Reading** — display content with restrained motion
4. **Quiz** — validate understanding (cadence-aware)
5. **Pass** → next layer · **Fail** → revise current layer
6. Climb the depth rail until synthesis / frontier

---

## Why the backend comes first

- The **prompt + API contracts** are the product’s brain.
- Frontend should only consume stable JSON shapes.
- Database and auth amplify the loop; they must not delay it.

---

## To run (once backend lands)

### 1. API keys in `.env.local`

```bash
# Either (preferred):
ANTHROPIC_API_KEY=sk-ant-...

# Or:
OPENAI_API_KEY=sk-...
```

Supabase keys are already present for later phases.

### 2. Dev server

```bash
npm install
npm run dev
```

### 3. Smoke-test backend

Exercise each `POST /api/*` route before building UI.

---

## Deployment

| Target | Status |
|--------|--------|
| Vercel project | Ready (empty app — no production deployment yet) |
| GitHub → Vercel | Connected; production branch expected: `main` |

---

## Changelog

| Date | What landed |
|------|-------------|
| 2026-07-18 | Infra: GitHub, Vercel, Supabase for Noesis |
| 2026-07-18 | Docs: `README.md`, `WHAT-THIS-IS.md`, `engineeringprogress.md`, `BUILT.md` |
| 2026-07-18 | Default branch renamed `master` → `main`; locked Phase 1 decisions recorded |
| 2026-07-18 | `auth/ui`: AuthButton + AuthModal in top-controls |
| 2026-07-18 | `auth/session`: auth helpers + session-aware journey sync |
| 2026-07-18 | `db/sync`: anonymous auth + journey hydrate/upsert — Phase 3 complete |
| 2026-07-18 | `db/client`: Supabase browser client |
| 2026-07-18 | `db/schema`: `journeys` table + RLS on Supabase |
| 2026-07-18 | `frontend/gaze-optional`: MediaPipe gaze/hand — Phase 2 complete |
| 2026-07-18 | `frontend/placement-chat`: Placement + Questions panel |
| 2026-07-18 | `frontend/reader-quiz`: Reader, DepthRail, Quiz, QuizModal |
| 2026-07-18 | `frontend/journey`: Noesis orchestrator + API wiring |
| 2026-07-18 | `frontend/shell`: Landing, theme, store (`noesis:journey`) |
| 2026-07-18 | `backend/api-chat`: `POST /api/chat` — Phase 1 backend complete |
| 2026-07-18 | `backend/api-quiz`: `POST /api/quiz` + grading |
| 2026-07-18 | `backend/api-placement`: `POST /api/placement` |
| 2026-07-18 | `backend/api-revise`: `POST /api/layer/revise` |
| 2026-07-18 | `backend/api-layer`: `POST /api/layer` + quiz-normalize |
| 2026-07-18 | `backend/foundation`: Next.js shell + `lib/{types,depth,llm,prompts}` (Noesis voice) |

---

*Update this file when a phase or branch merges. Do not claim features that are not in the repo.*
