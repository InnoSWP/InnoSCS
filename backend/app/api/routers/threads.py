import uuid
from http import HTTPStatus

from fastapi import APIRouter, WebSocket, WebSocketDisconnect

from app.api.managers import WsConnectionManager
from app.api.schemas import SupportCreate, SupportThread
from app.api.services import SupportThreadService

router = APIRouter()
ws_manager = WsConnectionManager()


@router.post('/threads', response_model=SupportThread, status_code=HTTPStatus.CREATED)
async def create_thread(thread: SupportCreate) -> SupportThread:
    thread.ws_id = uuid.uuid4().int
    thread_new = await SupportThreadService.create(thread)

    return thread_new


@router.get('/threads', response_model=list[SupportThread])
async def find_all_threads() -> list[SupportThread]:
    threads = await SupportThreadService.find_all()

    return threads


@router.websocket('/ws/{thread_id}')
async def websocket_endpoint(websocket: WebSocket, thread_id: int) -> None:
    await ws_manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            await ws_manager.broadcast(data, exp=websocket)
            await SupportThreadService.save_question(thread_id=thread_id, question=data)
    except WebSocketDisconnect:
        ws_manager.disconnect(websocket)
