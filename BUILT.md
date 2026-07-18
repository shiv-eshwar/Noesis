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
| Vercel | ✅ | Project `noesis`, GitHub connected; deploys from `main` |
| Supabase | ✅ | Project `Noesis` (`ebtayigvsooxoqizjmsf`, Mumbai) |
| Local env | ✅ | `.env.local` with Supabase + `OPENAI_API_KEY` (gitignored) |
| Vercel env | 🟡 | Supabase set; LLM keys not on Vercel yet |
| LLM keys | 🟡 | Local OpenAI key set; live generation can hit provider `429` quota |

### Documentation

| File | Status | Role |
|------|--------|------|
| `README.md` | ✅ | Public face of the repo — product, status, how to run |
| `WHAT-THIS-IS.md` | ✅ | Living product spec & philosophy |
| `engineeringprogress.md` | ✅ | Phases, todos, latest focus |
| `BUILT.md` | ✅ | This file — inventory of what exists |

### Application code (Phases 0–4)

| Slice | Status |
|-------|--------|
| Next.js 16 app shell | ✅ |
| Backend libs (`types`, `depth`, `llm`, `prompts`) | ✅ |
| Backend API routes | ✅ All five reference routes |
| Frontend UI | ✅ Full learning surface + optional gaze |
| Database schema | ✅ `journeys` + RLS + client sync |
| Auth | ✅ Optional email magic link (anon upgrade in place) |

`npm run build` green with `/`, `/api/layer`, `/api/layer/revise`, `/api/placement`, `/api/quiz`, `/api/chat`.

---

## Architecture (built)

Faithful to the reference implementation, branded Noesis.

### Backend

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

### Frontend

| File | Role |
|------|------|
| `app/page.tsx` | Entry — mounts `Noesis` shell |
| `components/Noesis.tsx` | Orchestrator — state flow + layer fetching |
| `Landing` | Topic input + suggestions |
| `Reader` | Layer display + motion |
| `Quiz` / modals | Active recall gate |
| Placement + Questions panel | Optional start depth + selection Q&A |
| Zustand store | Journey + `noesis:journey` localStorage |

### Database & auth

| Piece | Role |
|-------|------|
| Supabase `journeys` | Persist journeys across devices (RLS by `auth.uid()`) |
| Anonymous session | Default — learning works without Sign in |
| Email magic link | Optional upgrade in place (same user id) |

---

## The flow

1. **Landing** — topic input + suggestions (+ optional placement)
2. **Loading** — fetch layer from backend
3. **Reading** — display content with restrained motion
4. **Quiz** — validate understanding (cadence-aware)
5. **Pass** → next layer · **Fail** → revise current layer
6. Climb the depth rail until synthesis / frontier

---

## To run

### 1. Keys in `.env.local`

```bash
# Either (preferred when available):
ANTHROPIC_API_KEY=sk-ant-...

# Or:
OPENAI_API_KEY=sk-...
```

Supabase keys are already configured for this project. Put LLM keys in **`.env.local`** (not the empty `.env` stub).

### 2. Dev server

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 3. Manual test checklist

1. Landing loads; theme toggle works
2. Start a topic — layer generation needs a working LLM key (503 = missing key; 429 = provider quota)
3. When generation works: quiz pass → next layer; fail → revise; optional placement; select text for questions
4. Anonymous learning works without Sign in

---

## Deployment

| Target | Status |
|--------|--------|
| Vercel project | ✅ Deploying from `main` |
| GitHub → Vercel | Connected; production branch: `main` |
| Production LLM | ⬜ Add `OPENAI_API_KEY` or `ANTHROPIC_API_KEY` on Vercel |

Production URL: https://noesis-shiv-shahs-projects.vercel.app

---

## Changelog

| Date | What landed |
|------|-------------|
| 2026-07-18 | Ship readiness: docs synced to Phase 0–4 complete; build verified |
| 2026-07-18 | Infra: GitHub, Vercel, Supabase for Noesis |
| 2026-07-18 | Docs: `README.md`, `WHAT-THIS-IS.md`, `engineeringprogress.md`, `BUILT.md` |
| 2026-07-18 | Default branch renamed `master` → `main`; locked Phase 1 decisions recorded |
| 2026-07-18 | `auth/upgrade`: anon→email in place; redirect URLs — Phase 4 complete |
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
