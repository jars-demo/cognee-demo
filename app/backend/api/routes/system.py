"""Health, status and the sample data."""

from importlib.metadata import version

from fastapi import APIRouter

from app.backend.core import config

router = APIRouter()


@router.get("/health", include_in_schema=False)
async def health() -> dict:
    return {"status": "ok"}


@router.get("/api/status")
async def status() -> dict:
    settings = config.get_settings()
    return {
        "mode": settings.mode,
        **settings.describe(),
        "llm_available": settings.llm_available,
        "cognee_version": version("cognee"),
    }


@router.get("/api/sample")
async def sample() -> dict:
    """The Northwind Trails sample, one document per file, separated by "---" lines."""
    files = sorted(config.SAMPLE_DIR.glob("*.md"))
    documents = [path.read_text(encoding="utf-8").strip() for path in files]
    return {
        "dataset": config.SAMPLE_DATASET,
        "documents": len(documents),
        "text": "\n\n---\n\n".join(documents),
    }
