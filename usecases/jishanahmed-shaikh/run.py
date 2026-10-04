"""Use case: a memory of one contributor's open-source connector work.

Run it from the repo root (works in every setup mode: local, Docker or Cloud):

    docker compose exec backend python usecases/<your-github-handle>/run.py   # Docker
    uv run python usecases/<your-github-handle>/run.py                        # locally

It uses app/backend/services/memory.py, the same small wrapper around cognee's remember,
recall and forget that the app uses. Open that file to see the cognee calls.
"""

import asyncio
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE.parent.parent))

from app.backend.core import config  # noqa: E402  (loads .env before cognee)
from app.backend.services import memory  # noqa: E402

# 1. Your dataset is named after your folder, so it never collides with anyone else's.
DATASET = f"usecase_{HERE.name.strip('_')}"

# 2. Questions the data should answer. Questions 3 and 5 need facts from more than one document.
QUESTIONS = [
    "What is Coral, and how do AI agents connect to it?",
    "Which DataHub ingestion sources did Jishanahmed AR Shaikh build, and what is their status?",
    "Which systems has Jishanahmed connected to both Coral and DataHub?",
    "Which messaging or streaming systems can Coral read from through his sources?",
    "Which earlier work does the proposed cognee DataHub connector build on?",
]


async def main() -> None:
    await memory.connect(config.get_settings())

    # Start clean, so re-running the script does not mix old and new data.
    await memory.forget(DATASET, missing_ok=True)

    # 3. Remember every .md and .txt file in data/, one document per file.
    files = sorted(p for p in (HERE / "data").iterdir() if p.suffix in {".md", ".txt"})
    if not files:
        raise SystemExit(f"Put at least one .md or .txt file in {HERE / 'data'}")
    print(f"Remembering {len(files)} file(s) into '{DATASET}'…")
    await memory.remember([p.read_text(encoding="utf-8") for p in files], DATASET)

    # 4. Ask your questions.
    for question in QUESTIONS:
        print(f"\nQ: {question}")
        for result in (await memory.recall(question, DATASET))[:2]:
            print(f"   - {result['text'][:300]}")


if __name__ == "__main__":
    sys.stdout.reconfigure(errors="replace")
    asyncio.run(main())
