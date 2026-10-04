"""Health, status and the sample datasets."""

from importlib.metadata import version

from fastapi import APIRouter, HTTPException

from app.backend.core import config
from app.backend.services import samples

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


@router.get("/api/samples")
async def list_samples() -> dict:
    """The sample datasets in data/, with suggested questions for each."""
    return {"default": config.SAMPLE_DATASET, "samples": samples.list_samples()}


@router.get("/api/samples/{dataset}")
async def get_sample(dataset: str) -> dict:
    """One sample as text for the Remember box: one document per file, separated by "---"."""
    sample = samples.load_sample(dataset)
    if sample is None:
        raise HTTPException(status_code=404, detail=f"There is no sample called {dataset}.")
    documents = sample.pop("documents")
    return {**sample, "text": "\n\n---\n\n".join(documents)}
