# 06 · Forget (3 min)

## Do it

1. Click **Forget this dataset** in the **Forget** card and confirm.
2. Ask a question again: nothing comes back. Load the graph: it is empty.

## What just happened

```python
await cognee.forget(dataset="northwind_trails")
```

`forget()` is cognee's single deletion call:

| Call | Removes |
|---|---|
| `forget(dataset="northwind_trails")` | One dataset: graph, vectors and stored text |
| `forget(data_id=…, dataset="northwind_trails")` | One document inside a dataset |
| `forget(dataset="northwind_trails", memory_only=True)` | The graph and vectors, but keeps the raw text |
| `forget(everything=True)` | Everything you own |

Being able to delete precisely matters for real apps: outdated docs, user data deletion
requests, or simply starting over.

Next: [07 · Build your own use case](./07-your-use-case.md)
