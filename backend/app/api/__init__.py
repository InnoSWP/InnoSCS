from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.exceptions import EntityNotFound
from app.api.exceptions.errorhandlers import entityNotFoundHandler
from app.api.routers import threads, volunteer


def create_app() -> FastAPI:
    app = FastAPI()

    app.add_middleware(
        CORSMiddleware,
        allow_credentials=True,
        allow_origins=['*'],
        allow_methods=['*'],
        allow_headers=['*'],
    )

    app.include_router(volunteer.router)
    app.include_router(threads.router)

    app.add_exception_handler(EntityNotFound, entityNotFoundHandler)

    return app
