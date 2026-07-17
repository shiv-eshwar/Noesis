# Noesis — Engineering Progress

Living checklist. Update this file whenever a slice lands or a todo changes.  
Source of product truth: `WHAT-THIS-IS.md`. Source of “what exists”: `BUILT.md`.

---

## How we work

1. **Docs before code** — product intent and progress stay current.
2. **Reproduce, don’t invent** — behavior and API shapes come from the reference repomix; rename One Page → **Noesis**.
3. **One concern at a time** — Backend → Frontend → Database → Auth.
4. **One branch at a time** — each backend (then frontend) capability gets its own branch; merge/push when that slice is done.
5. **Push when green** — no half-broken APIs on `main`.

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

## Environment (done)

| Item | Status | Notes |
|------|--------|-------|
| GitHub repo `shiv-eshwar/Noesis` | ✅ | Public; connected to Vercel |
| Vercel project `noesis` | ✅ | Git linked; Supabase env vars set |
| Supabase project `Noesis` | ✅ | Mumbai `ebtayigvsooxoqizjmsf`; local `.env.local` |
| Local folder linked | ✅ | `.vercel/`, supabase link, git `origin` |
| Default branch `main` | ✅ | Aligned with Vercel production branch |
| LLM keys on Vercel | ⬜ | Add `ANTHROPIC_API_KEY` or `OPENAI_API_KEY` before backend smoke tests in prod |

---

## Phase 0 — Documentation

| Task | Status |
|------|--------|
| `README.md` (repo face) | ✅ |
| `WHAT-THIS-IS.md` (product law) | ✅ |
| `engineeringprogress.md` (this file) | ✅ |
| `BUILT.md` (what actually exists) | ✅ |
| Commit docs to `main` | ✅ |
| Default branch `main` (align with Vercel production branch) | ✅ |

---

## Phase 1 — Backend (in progress)

Reproduce server surface from the reference. **No UI yet.**  
Work **one branch at a time**, then merge to `main` and push.

### Branch plan

| Order | Branch | Scope | Done when | Status |
|-------|--------|-------|-----------|--------|
| 1 | `backend/foundation` | Next app shell + `lib/types`, `depth`, `llm`, `prompts` (Noesis) | `npm run build` green | ✅ |
| 2 | `backend/api-layer` | `POST /api/layer` + quiz normalize/policy | curl returns `Layer` | ✅ |
| 3 | `backend/api-revise` | `POST /api/layer/revise` | curl revises layer | ✅ |
| 4 | `backend/api-placement` | `POST /api/placement` + `placement-parse` | curl returns questions | ⬜ |
| 5 | `backend/api-quiz` | `POST /api/quiz` + grading libs | curl grades items | ⬜ |
| 6 | `backend/api-chat` | `POST /api/chat` | curl returns chat reply | ⬜ |

### Backend todos (checklist)

- [x] Scaffold minimal Next.js app (App Router) — API-focused; no full UI
- [x] Port `lib/types.ts`, `lib/depth.ts`
- [x] Port `lib/llm.ts`, `lib/prompts.ts` (brand voice → Noesis)
- [x] Port quiz helpers used by APIs (`quiz-normalize`, `quiz-policy` for layer)
- [x] `POST /api/layer`
- [x] `POST /api/layer/revise`
- [ ] `POST /api/placement` (+ parse as in reference)
- [ ] `POST /api/quiz`
- [ ] `POST /api/chat`
- [ ] Local smoke tests (curl) for each route
- [ ] LLM keys in `.env.local` + Vercel
- [x] Update `BUILT.md` after each merged branch

### Backend out of scope (this phase)

- React reader / landing / quiz UI
- Zustand stores
- Gaze / MediaPipe
- Supabase tables / Auth

---

## Phase 2 — Frontend

Consume backend contracts only. Rename orchestrator to Noesis.

### Branch plan (draft — refine when Phase 1 finishes)

| Order | Branch | Scope |
|-------|--------|-------|
| 1 | `frontend/shell` | Layout, fonts, globals, theme, landing |
| 2 | `frontend/journey` | Zustand journey store + orchestrator |
| 3 | `frontend/reader-quiz` | Reader, quiz modal, depth rail, revise flow |
| 4 | `frontend/placement-chat` | Placement + questions panel + selection |
| 5 | `frontend/gaze-optional` | Opt-in camera / hand gestures |

### Frontend todos

- [ ] Landing + topic start
- [ ] Loading / reading / quiz / passed / done states
- [ ] Depth rail + text evolution motion
- [ ] Placement path
- [ ] Questions on selection
- [ ] localStorage persistence
- [ ] Polish: light/dark, motion timing

---

## Phase 3 — Database

- [ ] Schema for journeys / layer progress (Supabase)
- [ ] Replace or sync localStorage with remote persistence
- [ ] RLS policies appropriate to auth model

---

## Phase 4 — Auth

- [ ] Supabase Auth (or equivalent) for multi-device journeys
- [ ] Wire session to persisted journeys
- [ ] Never require auth for a first local learning loop unless product demands it

---

## Latest focus

**Now:** `backend/api-revise` merged → next `backend/api-placement`.

**Do not start:** Frontend UI, database migrations, or auth until Phase 1 backend contracts are merged and smoke-tested.

---

## Notes for agents / contributors

- Prefer the reference repomix file over inventing new endpoints or prompt philosophy.
- Brand: **Noesis** everywhere user-facing and in docs; Vercel project name remains `noesis` (platform lowercase).
- Keep this file honest: check boxes only when merged and verified.
- After each branch merge: update `BUILT.md` and this Latest focus section.

---

*Last updated: 2026-07-18 — Phase 0 documentation.*
