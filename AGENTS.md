# AGENTS.md

Guidance for AI coding agents and developers working in this repo.

## What this is

A workshop app for [cognee](https://github.com/topoteretes/cognee). It teaches cognee's memory
API (`remember`, `recall`, `forget`) with a FastAPI backend, a React + TypeScript + Vite
frontend, step-by-step docs, and a `usecases/` folder attendees contribute to. Attendees read
the code as a reference, so prefer clear over clever.

## Map

```text
docker-compose.yml           cognee (official image) + backend + frontend
.env.example                 all settings; scripts/setup.py writes .env
pyproject.toml · uv.lock     Python deps (pinned); requirements.txt is the full pinned export

app/backend/
├── main.py                  FastAPI app factory
├── core/config.py           .env loading, paths, run mode (local / local-llm / remote)
├── services/memory.py       EVERY cognee call lives here
├── services/remote.py       graph reads from a remote cognee server (HTTP)
├── services/transforms.py   cognee results → frontend JSON
├── api/routes/system.py     /health, /api/status, /api/sample
├── api/routes/memory.py     /api/remember, /api/recall, /api/graph, /api/forget
├── api/schemas.py · errors.py
└── Dockerfile

app/frontend/src/
├── main.tsx · App.tsx       entry and app shell
├── pages/HomePage.tsx       the page: one card per cognee operation
├── components/cards/        Remember, Recall, Graph, Forget, ActivityLog
├── components/layout/       TopBar, Hero, Footer
├── hooks/useMemory.ts       all state and actions
├── api/                     typed API client
└── workshop/                workshop steps and panel

data/northwind_trails/       sample; folder name = cognee dataset name
scripts/                     setup.py (stdlib only) · check_setup.py (real end-to-end check)
usecases/_template/          what attendees copy
workshop/                    chapters 00–07 + troubleshooting
tests/                       backend tests, cognee layer faked
```

## Commands

```bash
docker compose up -d --build                     # whole stack → http://localhost:3000
docker compose up -d cognee                      # cognee only, for local development
uv run python -m app --reload                    # backend → :8000
cd app/frontend && npm run dev                   # frontend → :5173 (proxies /api to :8000)
uv run pytest && uv run ruff check . && uv run ruff format --check .
cd app/frontend && npm run lint && npm run build
uv run python scripts/check_setup.py             # real cognee, end to end
```

## Rules

1. **Load config before cognee.** `app.backend.core.config` loads `.env` and must be imported
   before `cognee`. Those imports sit in `# isort: off/on` blocks; keep them.
2. **All cognee calls go in `services/memory.py`.** Routes only validate and time.
3. **Every mode keeps working:** local without a key, local with an LLM key, remote (Docker or
   Cloud). Without a key, LLM-only features return a clear 400, never a crash.
   `cognee.serve()` does not route graph reads, so remote graphs go through `services/remote.py`.
4. **One dataset name for the sample:** `northwind_trails`, the same as its folder.
5. **Pins move together:** `cognee==1.6.2` in `pyproject.toml` and `cognee/cognee:1.6.2` in
   `docker-compose.yml`. Regenerate `requirements.txt` after any Python dependency change.
6. **Docs follow the app:** flow changes update `workshop/*.md` and `src/workshop/steps.tsx`.
7. **Never commit** `.env`, `.cognee_data/`, `.cognee_system/`, `node_modules/`, `dist/` or keys.

## Style

Python 3.10+, ruff, line length 100, type hints on public functions. TypeScript strict, function
components and hooks, oxlint. Commits: `type(scope): Imperative summary`.
