# 03 · Recall (5 min)

## Do it

Ask these in the **Recall** card with the search type on **Auto**:

1. What is Project Riverbend blocked on?
2. Who leads the Mobile team?
3. Why did the Mobile team ship offline mode on Android first?

## What just happened

```python
results = await cognee.recall(
    "What is Project Riverbend blocked on?", datasets=["northwind_trails"]
)
for item in results:
    print(item.source, item.text)
```

With no `query_type`, `recall()` routes the question to a search strategy by itself. Without an
LLM key it uses `CHUNKS`: it returns the passages closest to your question. Each result carries
a `source` tag saying where it came from (`graph`, or `session` when you use session memory).

## Think about it

Question 3 asks *why*. The answer ("most hikers in the beta use Android phones") is in the
decisions log, not next to the words "Mobile team". Look at which passage came back first: is
the reason in it? Passage search matches words, not meaning, so it can miss. Keep this question
for step 5, where an LLM answers from the graph.

Next: [04 · Explore the graph](./04-graph.md)
