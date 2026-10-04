"""Check that cognee works with your settings, end to end.

    uv run python scripts/check_setup.py

It remembers one short text, asks a question about it, reads back the graph, then forgets the
test dataset, using the same code as the app (app/backend/services/memory.py). Without an LLM
key the first run downloads the local models, so give it a few minutes.
"""

import asyncio
import sys
import time
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from app.backend.core import config  # noqa: E402  (loads .env before cognee)
from app.backend.services import memory  # noqa: E402

DATASET = "setup_check"
TEXT = (
    "Ravi Patel is a backend engineer at Northwind Trails. "
    "He maintains the offline maps service used by the TrailMate app."
)


def step(message: str) -> float:
    print(f"\n-> {message}", flush=True)
    return time.perf_counter()


def done(started: float) -> None:
    print(f"   ok ({time.perf_counter() - started:.1f}s)", flush=True)


async def main() -> None:
    settings = config.get_settings()
    summary = settings.describe()
    print(f"Mode: {summary['label']}  ({summary['detail']})")

    started = step("connect")
    await memory.connect(settings)
    done(started)

    started = step("remember(): store a short text and build its graph")
    await memory.remember([TEXT], DATASET)
    done(started)

    started = step("recall(): ask a question about it")
    results = await memory.recall("Who maintains the offline maps service?", DATASET)
    done(started)
    for item in results[:2]:
        print(f"   [{item['search_type'] or item['source']}] {item['text'][:160]}")

    started = step("graph: read back the nodes and edges")
    graph = await memory.graph(DATASET, settings)
    done(started)
    print(f"   {len(graph['nodes'])} nodes, {len(graph['edges'])} edges")

    started = step("forget(): remove the test dataset")
    await memory.forget(DATASET)
    done(started)

    if not results or not graph["nodes"]:
        print("\nSomething is off: no results or an empty graph. See workshop/troubleshooting.md")
        sys.exit(1)
    print("\nAll good. You are ready for the workshop.")


if __name__ == "__main__":
    sys.stdout.reconfigure(errors="replace")
    asyncio.run(main())
