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


def graph(data: dict) -> dict:
    """Reduce cognee's visualization payload to {nodes, edges}, dropping dangling edges."""
    nodes = []
    for node in data.get("nodes", []):
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
