"""Helpers shared by the route modules."""

import time
from collections.abc import Awaitable
from typing import TypeVar

from fastapi import HTTPException

T = TypeVar("T")


async def run_cognee(call: Awaitable[T]) -> T:
    """Await a cognee call and turn any failure into a readable HTTP 500."""
    try:
        return await call
    except Exception as error:
        message = str(error) or error.__class__.__name__
        raise HTTPException(
            status_code=500, detail=f"{error.__class__.__name__}: {message}"[:600]
        ) from error


def seconds_since(started: float) -> float:
    return round(time.perf_counter() - started, 2)
