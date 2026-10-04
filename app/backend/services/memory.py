"""Every cognee call the app makes lives in this module. Start reading here.

The rest of the backend only moves data in and out of these functions.
"""

# isort: off
# config loads .env, and must run before cognee is imported. Keep this order.
from app.backend.core import config

import cognee
from cognee.api.v1.visualize.visualize import visualize_graph_json
# isort: on

from app.backend.services import remote, transforms

# Small chunks keep answers focused: roughly one paragraph of the sample per chunk.
CHUNK_SIZE = 128

# Search types that write their answer with an LLM.
LLM_SEARCH_TYPES = {"GRAPH_COMPLETION", "RAG_COMPLETION"}
SEARCH_TYPES = LLM_SEARCH_TYPES | {"CHUNKS", "SUMMARIES"}

_connected = False


async def connect(settings: config.Settings) -> None:
    """Remote: connect to the cognee server. Local: keep cognee's storage inside the repo."""
    global _connected
    if _connected:
        return
    if settings.mode == config.REMOTE:
        # From here on, remember / recall / forget run on the server, not in this process.
        await cognee.serve(url=settings.remote_url, api_key=settings.remote_api_key)
    else:
        config.DATA_DIR.mkdir(exist_ok=True)
        config.SYSTEM_DIR.mkdir(exist_ok=True)
        cognee.config.data_root_directory(str(config.DATA_DIR))
        cognee.config.system_root_directory(str(config.SYSTEM_DIR))
    _connected = True


async def remember(documents: list[str], dataset: str) -> None:
    """Store documents in a dataset and build their knowledge graph."""
    await cognee.remember(
        documents,
        dataset_name=dataset,
        chunk_size=CHUNK_SIZE,
        # improve() enriches the graph further; skipped to keep the workshop fast.
        self_improvement=False,
    )


async def recall(question: str, dataset: str, search_type: str | None = None) -> list[dict]:
    """Ask a dataset a question. With no search type, cognee picks one."""
    query_type = cognee.SearchType[search_type] if search_type else None
    results = await cognee.recall(question, query_type=query_type, datasets=[dataset])
    return [transforms.recall_result(item) for item in results]


async def graph(dataset: str, settings: config.Settings, max_nodes: int = 300) -> dict:
    """Read a dataset's knowledge graph as {nodes, edges}."""
    if settings.mode == config.REMOTE:
        # cognee.serve() does not route graph reads, so ask the server's HTTP API directly.
        data = await remote.fetch_graph(settings, dataset, max_nodes)
    else:
        data = await visualize_graph_json(
            dataset=dataset, include_session_events=False, max_nodes=max_nodes
        )
    return transforms.graph(data)


async def forget(dataset: str) -> None:
    """Delete a dataset from memory: its graph, vectors and stored text."""
    await cognee.forget(dataset=dataset)
