# 01 · Meet cognee (5 min)

## Start the app

If it is not running yet: `docker compose up -d --build` (or `python scripts/setup.py`).

Open <http://localhost:3000/?workshop> and switch on **Workshop mode** if it is not already on.
The badge in the top bar shows which mode you are in.

## What cognee does

Large language models forget everything between conversations, and plain vector search only
finds text that *looks* similar to your question. cognee gives an app a memory that keeps the
**structure** of what it learned:

```text
your text ─► chunks ─► entities + relationships ─► knowledge graph + vector index
                                                        │
                       your question ─► recall() ───────┘─► answer, with its sources
```

## The four calls

| Call | What it does |
|---|---|
| `cognee.remember(data)` | Stores data and builds the graph |
| `cognee.recall(question)` | Searches memory and answers |
| `cognee.improve()` | Enriches the graph over time (not covered today) |
| `cognee.forget(dataset=…)` | Deletes from memory |

All of them are `async`, so you `await` them. That is it: the rest of the workshop is these calls.

Next: [02 · Remember](./02-remember.md)
