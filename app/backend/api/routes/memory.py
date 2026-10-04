"""The four memory endpoints. Each one calls a single function in services/memory.py."""

import asyncio
import re
import time

from fastapi import APIRouter, HTTPException

from app.backend.api.errors import run_cognee, seconds_since
from app.backend.api.schemas import DatasetName, ForgetRequest, RecallRequest, RememberRequest
from app.backend.core import config
from app.backend.services import memory

router = APIRouter(prefix="/api")

# The embedded databases expect one writer at a time.
_write_lock = asyncio.Lock()

# A line containing only "---" separates documents in the Remember box.
_DOCUMENT_SEPARATOR = re.compile(r"^\s*---\s*$", re.MULTILINE)


@router.post("/remember")
async def remember(body: RememberRequest) -> dict:
    documents = [part.strip() for part in _DOCUMENT_SEPARATOR.split(body.text) if part.strip()]
    if not documents:
        raise HTTPException(status_code=400, detail="There is no text to remember.")
    started = time.perf_counter()
    async with _write_lock:
        await run_cognee(memory.remember(documents, body.dataset))
    return {
        "call": f'cognee.remember(documents, dataset_name="{body.dataset}")',
        "documents": len(documents),
        "seconds": seconds_since(started),
    }


@router.post("/recall")
async def recall(body: RecallRequest) -> dict:
    search_type = (body.search_type or "").strip().upper() or None
    if search_type and search_type not in memory.SEARCH_TYPES:
        raise HTTPException(status_code=400, detail=f"Unknown search type: {search_type}")
    if search_type in memory.LLM_SEARCH_TYPES and config.get_settings().llm_available is False:
        raise HTTPException(
            status_code=400,
            detail=(
                f"{search_type} writes its answer with an LLM, and no LLM key is configured. "
                "Use Auto or CHUNKS, or add a free Groq key (workshop step 5)."
            ),
        )
    started = time.perf_counter()
    results = await run_cognee(memory.recall(body.question, body.dataset, search_type))
    type_arg = f", query_type=SearchType.{search_type}" if search_type else ""
    return {
        "call": f'cognee.recall(question{type_arg}, datasets=["{body.dataset}"])',
        "seconds": seconds_since(started),
        "results": results,
    }


@router.get("/graph")
async def graph(dataset: DatasetName = config.SAMPLE_DATASET, max_nodes: int = 300) -> dict:
    started = time.perf_counter()
    data = await run_cognee(memory.graph(dataset, config.get_settings(), max_nodes))
    return {
        "call": f'visualize_graph_json(dataset="{dataset}")',
        "seconds": seconds_since(started),
        **data,
    }


@router.post("/forget")
async def forget(body: ForgetRequest) -> dict:
    started = time.perf_counter()
    async with _write_lock:
        await run_cognee(memory.forget(body.dataset))
    return {"call": f'cognee.forget(dataset="{body.dataset}")', "seconds": seconds_since(started)}
