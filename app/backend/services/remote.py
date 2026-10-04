"""Graph reads from a remote cognee server (Docker Compose or Cognee Cloud).

cognee.serve() routes remember/recall/forget to the server, but not graph reads, so this module
calls the server's HTTP API for them: find the dataset id by name, fetch the graph as JSON, and
list the dataset's documents so the graph can be scoped to them.
"""

import httpx

from app.backend.core.config import Settings

TIMEOUT = httpx.Timeout(60.0, connect=10.0)


class RemoteError(RuntimeError):
    """The remote cognee server could not answer."""


async def fetch_graph(settings: Settings, dataset: str, max_nodes: int) -> tuple[dict, set[str]]:
    """The graph around a dataset, plus the ids of the documents in that dataset."""
    headers = {"X-Api-Key": settings.remote_api_key} if settings.remote_api_key else {}
    async with httpx.AsyncClient(
        base_url=settings.remote_url, headers=headers, timeout=TIMEOUT
    ) as client:
        dataset_id = await _dataset_id(client, dataset)
        if dataset_id is None:
            return {"nodes": [], "links": []}, set()

        response = await client.get(
            "/api/v1/visualize/json", params={"dataset_id": dataset_id, "max_nodes": max_nodes}
        )
        _raise_for_status(response)

        documents = await client.get(f"/api/v1/datasets/{dataset_id}/data")
        _raise_for_status(documents)
        return response.json(), {str(item["id"]) for item in documents.json()}


async def _dataset_id(client: httpx.AsyncClient, name: str) -> str | None:
    response = await client.get("/api/v1/datasets")
    _raise_for_status(response)
    for item in response.json():
        if item.get("name") == name:
            return str(item.get("id"))
    return None


def _raise_for_status(response: httpx.Response) -> None:
    if response.is_success:
        return
    if response.status_code in (401, 403):
        raise RemoteError("The cognee server rejected the API key (COGNEE_API_KEY).")
    raise RemoteError(f"The cognee server answered {response.status_code}: {response.text[:200]}")
