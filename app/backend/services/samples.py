"""The sample datasets in data/: one folder per dataset, with an about.json and .md documents."""

import json
import re
from pathlib import Path

from app.backend.core.config import SAMPLES_DIR

_NAME = re.compile(r"^[a-z0-9_]+$")


def list_samples() -> list[dict]:
    """Every sample folder, with its title, description and suggested questions."""
    return [_summary(folder) for folder in _folders()]


def load_sample(name: str) -> dict | None:
    """A sample's documents, or None when there is no such sample."""
    folder = SAMPLES_DIR / name
    if not _NAME.match(name) or folder not in _folders():
        return None
    documents = [path.read_text(encoding="utf-8").strip() for path in _documents(folder)]
    return {**_summary(folder), "documents": documents}


def _folders() -> list[Path]:
    return sorted(
        path for path in SAMPLES_DIR.iterdir() if path.is_dir() and _NAME.match(path.name)
    )


def _documents(folder: Path) -> list[Path]:
    return sorted(folder.glob("*.md"))


def _summary(folder: Path) -> dict:
    about_file = folder / "about.json"
    about = json.loads(about_file.read_text(encoding="utf-8")) if about_file.is_file() else {}
    return {
        "dataset": folder.name,
        "title": about.get("title", folder.name.replace("_", " ").title()),
        "description": about.get("description", ""),
        "questions": about.get("questions", []),
        "files": len(_documents(folder)),
    }
