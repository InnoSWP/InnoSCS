from fastapi import FastAPI

from app.api.routers import volunteer, threads


def create_app() -> FastAPI:
    app = FastAPI()
    app.include_router(volunteer.router)
    app.include_router(threads.router)

    return app
