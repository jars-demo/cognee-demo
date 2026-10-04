# Troubleshooting

## The first run is slow

That is expected without an LLM key. On first use cognee downloads and installs:

| What | Size | Docker | Running locally |
|---|---|---|---|
| GLiNER model `fastino/gliner2.5-base-v1` | About 750 MB | `cognee_storage` volume | Hugging Face cache |
| Embedding model `BAAI/bge-small-en-v1.5` | About 70 MB | `cognee_storage` volume | fastembed cache |
| CPU PyTorch + GLiNER runtime | About 200 MB | Already in the image | Installed into `.venv` |

Later runs reuse all of it. Do one **Remember** before the workshop so this happens at home, not
on the venue Wi-Fi. `docker compose logs -f cognee` shows the download progress.

## Running locally: the models download again after `uv sync`

cognee installs the GLiNER runtime into your environment the first time it needs it. An exact
`uv sync` removes packages that are not in the lockfile, so it removes the runtime too. After
setup, start things with `uv run …` only. If you need to sync again, use `uv sync --inexact`.

## Windows: `WinError 1314` or symlink warnings while downloading models

The Hugging Face cache tries to create symlinks, which normal Windows accounts are not allowed
to do. The download usually still succeeds through a fallback. If it keeps failing, either:

- turn on **Developer Mode** (Settings → System → For developers), which allows symlinks, or
- run the terminal as Administrator once for the first download.

The symlink warning by itself is harmless.

## `GRAPH_COMPLETION needs an LLM` in the app

No LLM key is configured. Use **Auto** or **CHUNKS**, or add a free Groq key
([step 5](./05-search-types.md)).

## I added a Groq key, but it fails on embeddings or asks for an OpenAI key

Uncomment the **whole** Groq block in `.env`, including the three `EMBEDDING_*` lines. Groq has
no embedding models, so without them cognee falls back to OpenAI embeddings. Restart the server
after editing `.env`.

## Groq: remember is slow or logs `RateLimitError`

Groq's free tier allows `openai/gpt-oss-120b` about **8,000 tokens per minute**, and building a
graph sends several requests of 1,000–3,000 tokens each. Without pacing, a larger remember can
use up the minute's budget and fail with `RateLimitError`.

`scripts/setup.py` (and the Groq block in `.env.example`) therefore turns on cognee's rate
limiter at 4 LLM requests per minute:

```bash
LLM_RATE_LIMIT_ENABLED=true
LLM_RATE_LIMIT_REQUESTS=4
LLM_RATE_LIMIT_INTERVAL=60
```

Remembering is slower with an LLM (a few minutes for a sample), but it does not fail. Each
attendee uses their own key, so attendees do not slow each other down. Keep your own data short.

## Recall returns nothing

- Did `remember` finish? Check the **Under the hood** log.
- Is the dataset name the same in both cards? Recall only searches the dataset in the box.
- Did you `forget` it? Remember it again.

## Port 8000 is already in use

```bash
uv run python -m app --port 8010
```

## Docker: the backend never becomes ready

The backend waits until the cognee container is healthy. Check it with
`docker compose ps` and `docker compose logs cognee`. Docker Desktop needs about 4 GB of memory.

## Start completely fresh

- Docker: `docker compose down -v` deletes all memory **and** the downloaded models.
  `docker compose down` keeps both.
- Locally: stop the backend, then delete `.cognee_data/` and `.cognee_system/`.
