# 02 · Remember (8 min)

## Do it

1. In the **Remember** card, keep **Northwind Trails** selected and click **Load sample**. It
   loads the three files in
   [`data/northwind_trails/`](../data/northwind_trails): short notes about a fictional company
   (the team, two projects and a decisions log).
2. Keep the dataset name `northwind_trails` and click **Remember**.

## What just happened

```python
await cognee.remember(documents, dataset_name="northwind_trails", chunk_size=128)
```

Each file becomes one document (the box separates them with `---` lines), and the folder name
becomes the dataset name. The real call is in
[`app/backend/services/memory.py`](../app/backend/services/memory.py).

`remember()` runs a pipeline:

1. **Add**: stores the raw text in the `northwind_trails` dataset.
2. **Chunk**: splits it into passages.
3. **Extract**: finds entities (people, teams, projects, services) and the relationships
   between them. Without a key a local GLiNER model does this; with an LLM key, the LLM does.
4. **Store and index**: writes the graph to a graph database (Ladybug by default) and embeds
   chunks and entities into a vector database (LanceDB). Locally, or inside the `cognee`
   container when you use Docker: either way, nothing leaves your machine without an LLM key.

A **dataset** is a named container. Keep different projects in different datasets so you can
search or forget them separately.

## Try

- Pick **Meridian Space Lab** or **Harbor City Library** in the sample list, load it and remember
  it too. Each sample goes into its own dataset (see [`data/`](../data)).
- Paste a paragraph of your own and remember it into a new dataset name.
- Watch the **Under the hood** log: every call and how long it took.

Next: [03 · Recall](./03-recall.md)
