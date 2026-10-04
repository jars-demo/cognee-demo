# 04 · Explore the graph (8 min)

## Do it

1. In the **Explore the graph** card, click **Load graph**.
2. Click **sofia alvarez**: the panel lists her links, such as `leads → mobile team`.
   Try **ravi patel** and **maya chen** too.
3. Drag nodes around. Use the legend to tell the node types apart.

## What you are looking at

```python
from cognee.api.v1.visualize.visualize import visualize_graph_json

graph = await visualize_graph_json(dataset="northwind_trails")
```

| Node type | What it is |
|---|---|
| `Entity` | People, teams, projects, services found in your text (names are lower-cased) |
| `EntityType` | The category of an entity: person, organization, project, … |
| `DocumentChunk` | The passages your text was split into |
| `TextDocument` | The documents you remembered |
| `TextSummary` | A short summary of each chunk |

Every entity links back to the chunk it was found in. That link is what lets cognee show where
an answer came from.

## Why a graph?

Vector search answers "which passage looks like my question?". A graph can also answer
questions that need **two hops**, like "who leads the team Tom Becker is on?": the answer is
spread across sentences, but the graph connects them (tom becker → mobile team → sofia alvarez).

## Be critical

Without a key, a small local model (GLiNER) builds the graph. It is fast and free but
approximate. Look for what it got wrong:

- **Missing links**: the sample says Ravi *maintains the offline maps service*, but the local
  model may only link him to the company.
- **Odd merges**: a node like `tom becker. sofia alvarez` (two names glued together).
- **Wrong relation names**: `founded_by` where the text says "sponsors".

Write down two mistakes. In step 5 you will rebuild the graph with an LLM and compare.

Next: [05 · Search types and LLM answers](./05-search-types.md)
