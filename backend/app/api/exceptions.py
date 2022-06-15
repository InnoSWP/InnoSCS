from typing import Optional

from fastapi.exceptions import HTTPException


class EntityNotFound(HTTPException):
    def __init__(self, entity: Optional[str] = 'Entity') -> None:
        super().__init__(status_code=404, detail=f'{entity} not found')
