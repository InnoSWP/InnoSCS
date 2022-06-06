import uuid
from http import HTTPStatus

from fastapi import APIRouter, WebSocket, WebSocketDisconnect

from app.api.schemas import SupportThread, SupportCreate
from app.api.services import SupportThreadService
from app.api.managers import WsConnectionManager


router = APIRouter()
ws_manager = WsConnectionManager()


@router.post('/threads', response_model=SupportThread, status_code=HTTPStatus.CREATED)
async def create_thread(thread: SupportCreate) -> SupportThread:
    thread_id = uuid.uuid4()
    thread_new = SupportThread(id=thread_id, questions=thread.questions)

    await SupportThreadService.create(thread_new)

    return thread_new


@router.get('/threads', response_model=list[SupportThread])
async def find_all_threads():
    threads = await SupportThreadService.find_all()

    return threads


@router.websocket('/ws/{thread_id}')
async def websocket_endpoint(
    websocket: WebSocket, thread_id: str
) -> None:
    await ws_manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            await ws_manager.broadcast(data, exp=websocket)
            await SupportThreadService.save_question(thread_id=thread_id, question=data)
    except WebSocketDisconnect:
        ws_manager.disconnect(websocket)


