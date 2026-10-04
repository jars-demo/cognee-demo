"""Helpers shared by the route modules."""

import time
from collections.abc import Awaitable
from typing import TypeVar

from fastapi import HTTPException

T = TypeVar("T")

NO_LLM_KEY = (
    "This search type writes its answer with an LLM, and no LLM key is configured. "
    "Use Auto or CHUNKS, or add a free Groq key (workshop step 5)."
)


async def run_cognee(call: Awaitable[T]) -> T:
    """Await a cognee call and turn any failure into a readable HTTP error."""
    try:
        return await call
    except Exception as error:
        message = str(error) or error.__class__.__name__
        # A remote cognee server without an LLM key reports this; explain it like local mode does.
        if "LLMAPIKeyNotSetError" in message:
            raise HTTPException(status_code=400, detail=NO_LLM_KEY) from error
        if "DatasetNotFoundError" in message:
            raise HTTPException(
                status_code=404,
                detail="Nothing is remembered in this dataset yet. Click Remember first.",
            ) from error
        raise HTTPException(
            status_code=500, detail=f"{error.__class__.__name__}: {message}"[:600]
        ) from error


def seconds_since(started: float) -> float:
    return round(time.perf_counter() - started, 2)
