# cognee-demo

A hands-on workshop for **[cognee](https://github.com/topoteretes/cognee)**, the open-source
memory engine for AI apps. Give it some text, watch it build a knowledge graph, ask it
questions, then build your own use case and open a pull request.

- **One command to run**, no API key needed (open local models by default)
- **30–60 minutes**, for beginners and developers
- **A real app**: FastAPI backend, React + TypeScript frontend, guided **workshop mode**

```text
remember(text)  →  knowledge graph + search index  →  recall(question)  →  forget(dataset)
```

## Get started

You need **[Docker Desktop](https://docs.docker.com/get-docker/)** and **[Git](https://git-scm.com/downloads)**.

```bash
git clone https://github.com/jars-demo/cognee-demo.git
cd cognee-demo
docker compose up -d --build
```

Open **[http://localhost:3000/#/workshop](http://localhost:3000/#/workshop)** and follow the steps on the left.

The first build takes a few minutes, and the first **Remember** downloads cognee's local models
(about 1 GB, once). Everything after that is quick.

**Want a free LLM, Cognee Cloud, or to run without Docker?** Run the guided setup:

```bash
python scripts/setup.py
```

## The workshop

| Step                                               | You will                             | Time   |
| -------------------------------------------------- | ------------------------------------ | ------ |
| [00 · Prerequisites](workshop/00-prerequisites.md) | Install and start the app            | before |
| [01 · Meet cognee](workshop/01-meet-cognee.md)     | Learn the four calls                 | 5 min  |
| [02 · Remember](workshop/02-remember.md)           | Turn text into a knowledge graph     | 8 min  |
| [03 · Recall](workshop/03-recall.md)               | Ask questions                        | 5 min  |
| [04 · Explore the graph](workshop/04-graph.md)     | See what cognee built                | 8 min  |
| [05 · Search types](workshop/05-search-types.md)   | Try LLM answers with a free Groq key | 8 min  |
| [06 · Forget](workshop/06-forget.md)               | Delete from memory                   | 3 min  |
| [07 · Your use case](workshop/07-your-use-case.md) | Use your own data and open a PR      | 15 min |

The app has three pages: **Home**, **Concepts** (the ideas, with examples) and **Workshop**
(these steps, next to a live playground). Stuck? See
[troubleshooting](workshop/troubleshooting.md).

## How to run it

| Option                          | You need                                                                             | Where cognee runs                                                   |
| ------------------------------- | ------------------------------------------------------------------------------------ | ------------------------------------------------------------------- |
| **1 · Docker** (default) | Docker                                                                               | In the`cognee` container, next to the app                         |
| **2 · Develop**          | Docker, Python 3.10–3.13 ([uv](https://docs.astral.sh/uv/) recommended), Node 22.12+ | In Docker; backend and frontend run on your machine with hot reload |
| **3 · Local**            | Python, Node                                                                         | Inside the backend process, no Docker                               |
| **4 · Cognee Cloud**     | A [Cognee Cloud](https://docs.cognee.ai/cognee-cloud/overview) account, Python, Node | In the cloud                                                        |

`python scripts/setup.py` asks which one you want, writes `.env`, installs what is needed and
starts it. Every option works without an LLM key; add a free [Groq](https://console.groq.com/keys)
key when the script asks for LLM-written answers.

## What is inside

```text
cognee-demo/
├── docker-compose.yml      the stack: cognee + backend + frontend
├── .env.example            every setting, explained (setup.py writes .env)
├── app/
│   ├── backend/            FastAPI · start with services/memory.py
│   └── frontend/           React + TypeScript + Vite · start with src/pages/HomePage.tsx
├── data/                   3 sample datasets; each folder becomes a cognee dataset
├── usecases/               attendee use cases · copy _template/
├── workshop/               the step-by-step guide
├── scripts/                setup.py (guided setup) · check_setup.py (end-to-end check)
└── tests/                  backend tests
```

| URL                                                     | What                  |
| ------------------------------------------------------- | --------------------- |
| [http://localhost:3000](http://localhost:3000)           | The app               |
| [http://localhost:8000/docs](http://localhost:8000/docs) | Backend API (Swagger) |
| [http://localhost:8001/docs](http://localhost:8001/docs) | cognee server API     |

## For developers

Keep cognee in Docker and run the code locally with hot reload:

```bash
docker compose up -d cognee                         # cognee only (or: docker compose stop frontend backend)
uv sync && uv run python -m app --reload            # backend  → http://localhost:8000
cd app/frontend && npm install && npm run dev       # frontend → http://localhost:5173
```

Set `COGNEE_SERVICE_URL="http://localhost:8001"` in `.env` (option 2 of `setup.py` does it).
Without uv: `python -m venv .venv`, then `.venv/bin/pip install -r requirements.txt` and
`.venv/bin/python -m app --reload` (Windows: `.venv\Scripts\...`).

All cognee calls live in [`app/backend/services/memory.py`](app/backend/services/memory.py):

| Endpoint               | cognee call                                               |
| ---------------------- | --------------------------------------------------------- |
| `POST /api/remember` | `cognee.remember(documents, dataset_name=…)`           |
| `POST /api/recall`   | `cognee.recall(question, query_type=…, datasets=[…])` |
| `GET /api/graph`     | `visualize_graph_json(dataset=…)`                      |
| `POST /api/forget`   | `cognee.forget(dataset=…)`                             |

Checks, as CI runs them:

```bash
uv run pytest && uv run ruff check . && uv run ruff format --check .
cd app/frontend && npm run lint && npm run build
```

Versions are pinned everywhere: `pyproject.toml` + `uv.lock` (and the full `requirements.txt`
for pip), `app/frontend/package.json` + `package-lock.json`, and `cognee/cognee:1.6.2`.

## Contribute

Add your use case (the workshop's final step) or improve the workshop: see
[CONTRIBUTING.md](CONTRIBUTING.md).

## Learn more about cognee

[GitHub](https://github.com/topoteretes/cognee) · [Docs](https://docs.cognee.ai/) ·
[Cognee Cloud](https://docs.cognee.ai/cognee-cloud/overview) · [Discord](https://discord.gg/NQPKmU5CCg)

This is a community workshop built on cognee, not an official cognee project.
