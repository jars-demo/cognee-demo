"""Request bodies for the API."""

from typing import Annotated

from pydantic import BaseModel, Field

from app.backend.core.config import SAMPLE_DATASET

# A cognee dataset name: letters, digits, "_" and "-" only.
DatasetName = Annotated[str, Field(min_length=1, max_length=64, pattern=r"^[\w\-]+$")]


class RememberRequest(BaseModel):
    # Separate documents with a line containing only "---".
    text: str = Field(min_length=1, max_length=200_000)
    dataset: DatasetName = SAMPLE_DATASET


class RecallRequest(BaseModel):
    question: str = Field(min_length=1, max_length=2_000)
    dataset: DatasetName = SAMPLE_DATASET
    search_type: str | None = None


class ForgetRequest(BaseModel):
    dataset: DatasetName = SAMPLE_DATASET
