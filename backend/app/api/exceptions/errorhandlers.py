from fastapi import Request
from fastapi.responses import JSONResponse

from app.api.exceptions.entities import EntityAlreadyExists, EntityNotFound


async def entity_not_found_handler(
    request: Request, exc: EntityNotFound
) -> JSONResponse:
    return JSONResponse(
        status_code=404,
        content={'message': 'entity not found'},
    )


async def entity_already_exists_handler(
    request: Request, exc: EntityAlreadyExists
) -> JSONResponse:
    return JSONResponse(
        status_code=409,
        content={'message': 'entity is already exists'},
    )
