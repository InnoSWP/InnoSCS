from fastapi.exceptions import HTTPException


class EntityNotFound(HTTPException):
    def __init__(self, entity: str = 'entity') -> None:
        super().__init__(status_code=404, detail=f'{entity} not found')


class FullWsRoomException(HTTPException):
    def __init__(self) -> None:
        super().__init__(status_code=403, detail='Room is full')
