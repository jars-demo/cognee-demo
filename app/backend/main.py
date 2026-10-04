"""The FastAPI app: the API under /api, plus the built frontend when it exists.

In Docker, nginx serves the frontend and forwards /api here. Locally, run the Vite dev server
(`npm run dev`), or build once (`npm run build`) and this app serves it on port 8000 too.
"""

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles

from app.backend.api.routes import memory as memory_routes
from app.backend.api.routes import system as system_routes
from app.backend.core import config
from app.backend.services import memory


@asynccontextmanager
async def lifespan(_: FastAPI):
    await memory.connect(config.get_settings())
    yield


def create_app() -> FastAPI:
    app = FastAPI(title="cognee-demo API", lifespan=lifespan)
    app.include_router(system_routes.router)
    app.include_router(memory_routes.router)
    if config.FRONTEND_DIST.is_dir():
        app.mount("/", StaticFiles(directory=config.FRONTEND_DIST, html=True), name="frontend")
    return app


app = create_app()
