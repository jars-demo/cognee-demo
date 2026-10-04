# My use case: open-source connector memory

**Author:** Jishanahmed AR Shaikh ([@jishanahmed-shaikh](https://github.com/jishanahmed-shaikh) · [jishanahmed.in](https://jishanahmed.in))
**Mode I used:** Docker, with a free Groq key (`openai/gpt-oss-120b`)

## What I built

A memory of my open-source connector work: what DataHub and Coral are, the sources I contributed
to each, and my two connector proposals for cognee. Once remembered, cognee can answer questions
that connect facts across documents, such as which systems I connected to both Coral and DataHub.

## My data

Four short documents in `data/`, written from my public pull requests and issues on GitHub:

| File | What it covers |
|---|---|
| `01_datahub_and_coral.md` | What DataHub and Coral are |
| `02_coral_sources.md` | My 13 merged Coral sources and one open one, with links |
| `03_datahub_sources.md` | My Pinecone and Langfuse ingestion sources for DataHub |
| `04_cognee_proposals.md` | My Airflow and DataHub connector proposals for cognee |

## Questions

These are the five questions in `run.py`, with the answers the data supports. Questions 3 and 5
need facts from more than one document, which is where the graph helps.

| # | Question | Expected answer (from the data) |
|---|---|---|
| 1 | What is Coral, and how do AI agents connect to it? | One SQL interface over APIs, files and live sources; agents connect over MCP |
| 2 | Which DataHub ingestion sources did Jishanahmed AR Shaikh build, and what is their status? | Pinecone (merged) and Langfuse (approved, awaiting merge) |
| 3 | Which systems has Jishanahmed connected to both Coral and DataHub? | Pinecone and Langfuse |
| 4 | Which messaging or streaming systems can Coral read from through his sources? | Apache Kafka and RabbitMQ |
| 5 | Which earlier work does the proposed cognee DataHub connector build on? | His DataHub source for Coral, and his Pinecone and Langfuse DataHub sources |

## What I learned

- With the free Groq tier, remembering four documents takes a few minutes: cognee's rate limiter
  paces requests to stay under 8,000 tokens per minute.
- Writing the relationships out in plain sentences ("he built a Coral source and a DataHub source
  for each") gives the extractor clear edges to build the graph from.

## How to run it

```bash
docker compose exec backend python usecases/jishanahmed-shaikh/run.py   # Docker
uv run python usecases/jishanahmed-shaikh/run.py                        # locally
```

To see the graph in the app, type `usecase_jishanahmed-shaikh` into the **Dataset** box on the
Workshop page and click **Load graph**.
