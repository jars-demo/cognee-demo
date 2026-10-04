# 05 · Search types and LLM answers (8 min)

## Search types

`recall()` takes an optional `query_type`. The app offers these:

| Search type | Needs an LLM? | Returns |
|---|---|---|
| `CHUNKS` | No | The most relevant passages |
| `SUMMARIES` | No | Matching document summaries |
| `RAG_COMPLETION` | Yes | An answer written from the top passages |
| `GRAPH_COMPLETION` | Yes | An answer written from graph neighbourhoods |

```python
from cognee import SearchType

await cognee.recall(question, query_type=SearchType.CHUNKS)
await cognee.recall(question, query_type=SearchType.GRAPH_COMPLETION)
```

The full list is in the [recall docs](https://docs.cognee.ai/core-concepts/main-operations/recall).

## Optional: add a free Groq key

1. Create a key at [console.groq.com/keys](https://console.groq.com/keys).
2. Run `python scripts/setup.py`, pick your option again and paste the key when asked.
   (By hand: uncomment the Groq block in `.env`, including the `EMBEDDING_*` lines, because
   Groq has no embedding models.)
3. Restart: `docker compose up -d` (Docker), or restart the backend if it runs locally.
4. **Forget** the `northwind_trails` dataset and **Remember** the sample again, so the graph is rebuilt
   with LLM extraction.
5. Ask the same questions with `GRAPH_COMPLETION` and compare. Load the graph again too.

> Groq's free tier has rate limits. If you see a rate-limit error, wait a minute and retry.

Next: [06 · Forget](./06-forget.md)
