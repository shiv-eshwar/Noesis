# Noesis

**Learn anything. One page. Deeply.**

Noesis is a single-surface learning experience. Enter a topic. Read the simplest true explanation. Prove you understand it. The same page evolves in place — same story, richer fidelity — until understanding actually sticks.

No course catalog. No sidebar. No gamification theater. One calm page that matures with you.

> The whole point: simplify first, deepen with intention, repeat the topic at rising fidelity, and earn the next layer with questions.

---

## Why Noesis

Topics feel enormous until you see their spine. Rockets are not magic — fuel, a body, and something that pushes exhaust out. Once that lands, everything else has somewhere to attach.

Noesis teaches that way on purpose:

1. Start with the simplest true version  
2. Add complexity only after you show you understand  
3. Stay on one topic — spiral deeper, with occasional top-down checkpoints  
4. Quiz before you go deeper — active recall, not passive reading  

**Success criterion:** someone learns *Rockets* (or anything else) in one sitting and thinks:

> That was calm. Beautiful. And I actually understand more than when I started.

---

## Current status

| Layer | Status |
|-------|--------|
| Product docs | ✅ Ready |
| GitHub · Vercel · Supabase | ✅ Provisioned |
| Backend (API + LLM) | ✅ All five routes on `main` |
| Frontend (reader UI) | ✅ Full learning surface |
| Database · Auth | ✅ Journeys sync + optional email |
| LLM keys | 🟡 Local `OPENAI_API_KEY` set; OpenAI quota/billing blocking generation; not on Vercel yet |

Living docs (read these):

| Doc | Purpose |
|-----|---------|
| [`WHAT-THIS-IS.md`](./WHAT-THIS-IS.md) | Product law — philosophy, UX, architecture |
| [`engineeringprogress.md`](./engineeringprogress.md) | Phases, branch plan, todos |
| [`BUILT.md`](./BUILT.md) | What actually exists right now |

---

## How it works

```text
Topic → Layer (ELI5) → Read → Quiz → Pass → Deeper layer → …
                              └─ Fail → Rewrite this layer → Retry
```

Optional: *I already know some* → placement quiz → start further along the depth rail.

Behind the page:

| Concern | Responsibility |
|---------|----------------|
| **Backend** | Generate layers, placement, quiz grading, chat |
| **Frontend** | One editorial surface — landing, reader, quiz, motion |
| **Database** | Persist journeys across devices (Supabase) |
| **Auth** | Optional — email magic link upgrades anonymous sessions |

Phases 0–4 are complete on `main`. Prefer reproducing the reference over inventing new surfaces.

---

## The learning model

| Beat | What happens |
|------|----------------|
| **ELI5 entry** | Vivid, zero jargon — the gift of maximum simplicity, once |
| **Ordinary layers** | One new slice only — same story, forward motion |
| **Checkpoints** | Every few layers: top-down map at your current level |
| **Quiz gate** | Understanding unlocks depth; fail rewrites the layer |
| **Late climb** | Synthesis → scholar → frontier — still one voice |

The system prompt is the product. Voice, banned clichés, spiral rules, and JSON shape live there — treat them as sacred.

---

## Design principles

- **One beautiful column** — centered, editorial, calm  
- **Serif-led reading** — the page is meant to be *read*  
- **Whitespace is structure** — not emptiness to fill with widgets  
- **Motion serves comprehension** — never startup-demo energy  
- **No XP explosions** — progress is quiet and elegant  
- **Camera is optional** — the product must feel complete with a button  

---

## Tech stack

| Piece | Choice |
|-------|--------|
| App | Next.js (App Router) · React · TypeScript |
| Style | Tailwind CSS · paper & ink tokens |
| Motion | `motion/react` |
| Client state | Zustand · localStorage (v1) |
| LLM | Anthropic (preferred) · OpenAI fallback |
| Hosting | [Vercel](https://vercel.com) · project `noesis` |
| Data / auth | [Supabase](https://supabase.com) · project **Noesis** (anon + optional email) |

Repo: [github.com/shiv-eshwar/Noesis](https://github.com/shiv-eshwar/Noesis)

---

## Getting started

### 1. Install

```bash
npm install
```

### 2. Environment

Put secrets in **`.env.local`** (not the empty `.env` stub — Next.js reads `.env.local` for local dev). Never commit secrets.

```bash
# Required for generation — either key is enough (Anthropic preferred when both set)
# OPENAI_API_KEY=sk-...
# ANTHROPIC_API_KEY=sk-ant-...

# Supabase (already set for this project if you pulled env earlier)
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
# SUPABASE_SERVICE_ROLE_KEY=...   # server only
```

Sign-in is optional. Learning works anonymously. Email magic link upgrades the anonymous user in place so journey rows stay owned.

**Auth redirect URLs** (Supabase Dashboard → Authentication → URL configuration):

| URL | Role |
|-----|------|
| `http://localhost:3000` | Local Site / redirect |
| `https://noesis-shiv-shahs-projects.vercel.app` | Production Site URL + redirect |
| Preview `*.vercel.app` hosts | Allow-listed for PR previews |

### 3. Develop

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 4. Manual test checklist

1. `npm run dev` → [http://localhost:3000](http://localhost:3000)
2. Landing loads; theme toggle works
3. Start a topic — layer generation needs a working LLM key (503 = missing key; 429 = provider quota — not a missing UI)
4. When generation works: quiz pass → next layer; quiz fail → revise; optional placement; select text for questions
5. Learning works without Sign in (anonymous session)

### 5. API surface

| Route | Role |
|-------|------|
| `POST /api/layer` | Generate a layer |
| `POST /api/layer/revise` | Rewrite after quiz fail |
| `POST /api/placement` | Placement questions |
| `POST /api/quiz` | Grade short answers |
| `POST /api/chat` | Anchored Q&A |

---

## Project shape

```text
Noesis/
├── app/
│   ├── api/                 # layer, revise, placement, quiz, chat
│   ├── layout.tsx
│   ├── page.tsx             # mounts <Noesis />
│   └── globals.css
├── components/              # Landing, Reader, Quiz, Placement, gaze, auth
├── lib/                     # llm, prompts, depth, stores, journey-sync
├── WHAT-THIS-IS.md          # Product law
├── engineeringprogress.md   # Phases & todos
├── BUILT.md                 # Honest inventory
└── README.md                # You are here
```

---

## Contributing workflow

1. Read `WHAT-THIS-IS.md` — do not compromise the soul  
2. Check `engineeringprogress.md` — pick the next open item  
3. One concern per branch · merge when green · update `BUILT.md`  
4. Prefer reproducing the reference over inventing new surfaces

---

## License & intent

Private / product development under [shiv-eshwar/Noesis](https://github.com/shiv-eshwar/Noesis).

Noesis is a personal adaptive learning notebook disguised as one immaculate page: one topic, one voice, one surface that grows up with you.

---

*Simplify first. Deepen with intention. Earn the next layer.*
