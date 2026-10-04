"""Settings and run modes.

Import this module before anything that imports cognee: cognee reads its settings from the
environment when it is first imported, so .env has to be loaded first.

The run mode comes from .env (write it with `python scripts/setup.py`):

    local       cognee runs inside this app, no API key (local GLiNER + fastembed models)
    local-llm   cognee runs inside this app, with an LLM key (for example Groq)
    remote      this app talks to a cognee server: Docker Compose on this machine, or Cognee Cloud
"""

import os
from dataclasses import dataclass
from pathlib import Path

from dotenv import load_dotenv

REPO_ROOT = Path(__file__).resolve().parents[3]
ENV_FILE = REPO_ROOT / ".env"

# Where cognee stores its databases when it runs inside this process (git-ignored).
DATA_DIR = REPO_ROOT / ".cognee_data"
SYSTEM_DIR = REPO_ROOT / ".cognee_system"

# The workshop sample: the files in data/northwind_trails/ become the cognee dataset of the same
# name, so the folder and the dataset are always called the same thing.
SAMPLE_DATASET = "northwind_trails"
SAMPLE_DIR = REPO_ROOT / "data" / SAMPLE_DATASET

FRONTEND_DIST = REPO_ROOT / "app" / "frontend" / "dist"

load_dotenv(ENV_FILE)
if ENV_FILE.is_file():
    # Point cognee at this .env too, so it never picks up an unrelated one elsewhere on disk.
    os.environ.setdefault("COGNEE_ENV_FILE", str(ENV_FILE))

LOCAL = "local"
LOCAL_LLM = "local-llm"
REMOTE = "remote"

_PLACEHOLDER_KEYS = {"", "your_api_key", "gsk_..."}


@dataclass(frozen=True)
class Settings:
    mode: str
    remote_url: str | None
    remote_api_key: str | None
    llm_model: str | None

    @property
    def llm_available(self) -> bool | None:
        """Whether LLM-written answers can work. None: a remote server decides for itself."""
        if self.mode == REMOTE:
            return None
        return self.mode == LOCAL_LLM

    def describe(self) -> dict:
        """A human-readable summary for the UI badge and the setup check."""
        if self.mode == REMOTE:
            return {"label": "Remote cognee", "detail": f"Connected to {self.remote_url}"}
        if self.mode == LOCAL_LLM:
            return {"label": "Local · LLM", "detail": f"Local engine, LLM {self.llm_model}"}
        return {
            "label": "Local · no key",
            "detail": "Local engine with local models (GLiNER + fastembed). No API key needed.",
        }


def get_settings() -> Settings:
    """Read the run mode from the environment."""
    remote_url = (os.getenv("COGNEE_SERVICE_URL") or "").strip().rstrip("/") or None
    llm_key = (os.getenv("LLM_API_KEY") or "").strip()
    if remote_url:
        mode = REMOTE
    elif llm_key not in _PLACEHOLDER_KEYS:
        mode = LOCAL_LLM
    else:
        mode = LOCAL
    return Settings(
        mode=mode,
        remote_url=remote_url,
        remote_api_key=(os.getenv("COGNEE_API_KEY") or "").strip() or None,
        llm_model=os.getenv("LLM_MODEL"),
    )
