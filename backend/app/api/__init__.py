from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.exceptions import EntityAlreadyExists, EntityNotFound
from app.api.exceptions.errorhandlers import (
    entity_already_exists_handler,
    entity_not_found_handler,
)
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

    app.add_exception_handler(EntityNotFound, entity_not_found_handler)
    app.add_exception_handler(EntityAlreadyExists, entity_already_exists_handler)

    return app
