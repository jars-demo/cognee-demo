"""Turn cognee's return values into the small JSON shapes the frontend uses."""

from typing import Any


def recall_result(item: Any) -> dict:
    """Flatten one recall() entry into {text, source, search_type, score}."""
    data = item.model_dump() if hasattr(item, "model_dump") else dict(item)
    text = data.get("text") or data.get("answer") or data.get("content") or ""
    return {
        "text": str(text).strip(),
        "source": data.get("source"),
        "search_type": data.get("search_type"),
        "score": data.get("score"),
    }


def graph(data: dict, document_ids: set[str] | None = None) -> dict:
    """Reduce cognee's visualization payload to {nodes, edges}, dropping dangling edges.

    With document_ids, keep only that dataset's part of the graph: its documents and chunks,
    everything one hop from those chunks (entities, summaries), and those entities' types.
    """
    raw_nodes = data.get("nodes", [])
    if document_ids is not None:
        raw_nodes = _scope(raw_nodes, data.get("links", []), document_ids)
    nodes = []
    for node in raw_nodes:
        node_id = str(node.get("id"))
        label = node.get("name") or node.get("label") or node.get("type") or node_id[:8]
        nodes.append(
            {
                "id": node_id,
                "label": str(label)[:60],
                "type": str(node.get("type") or "Node"),
                "description": str(node.get("description") or node.get("text") or "")[:400],
            }
        )
    known = {node["id"] for node in nodes}
    edges = []
    for link in data.get("links", []):
        source, target = _endpoint(link.get("source")), _endpoint(link.get("target"))
        if source in known and target in known:
            label = link.get("relation") or link.get("relationship_name") or link.get("label")
            edges.append({"source": source, "target": target, "label": str(label or "")})
    return {"nodes": nodes, "edges": edges}


def _endpoint(value: Any) -> str:
    return str(value.get("id")) if isinstance(value, dict) else str(value)


def _scope(nodes: list[dict], links: list[dict], document_ids: set[str]) -> list[dict]:
    by_id = {str(node.get("id")): node for node in nodes}
    neighbours: dict[str, set[str]] = {node_id: set() for node_id in by_id}
    for link in links:
        source, target = _endpoint(link.get("source")), _endpoint(link.get("target"))
        if source in neighbours and target in neighbours:
            neighbours[source].add(target)
            neighbours[target].add(source)

    chunks = {
        node_id
        for node_id, node in by_id.items()
        if node.get("type") == "DocumentChunk" and str(node.get("document_id")) in document_ids
    }
    keep = (document_ids & by_id.keys()) | chunks
    for chunk in chunks:
        keep |= neighbours[chunk]
    entities = {node_id for node_id in keep if by_id[node_id].get("type") == "Entity"}
    for entity in entities:
        keep |= {n for n in neighbours[entity] if by_id[n].get("type") == "EntityType"}
    # A chunk's neighbours include its document; drop documents from other datasets.
    keep = {
        node_id
        for node_id in keep
        if by_id[node_id].get("type") != "TextDocument" or node_id in document_ids
    }
    return [node for node_id, node in by_id.items() if node_id in keep]
