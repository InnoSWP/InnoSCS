from datetime import datetime
from http import HTTPStatus
from typing import Optional

from fastapi import APIRouter, WebSocket, WebSocketDisconnect

from app.api.exceptions import EntityNotFound
from app.api.managers import WsConnectionManager
from app.api.schemas import Filter, MessageCreate, Sender, SupportCreate, SupportThread
from app.api.services import SupportThreadService

router = APIRouter()
ws_manager = WsConnectionManager()


@router.post('/threads', response_model=SupportThread, status_code=HTTPStatus.CREATED)
async def create_thread(thread: SupportCreate) -> SupportThread:
    thread_new = await SupportThreadService.create(thread)

    return thread_new


@router.get('/threads', response_model=list[SupportThread])
async def find_all_threads(flt: Optional[Filter] = None) -> list[SupportThread]:
    threads = await SupportThreadService.find_all(flt)

    return threads


@router.get('/threads/{thread_id}', response_model=SupportThread)
async def find_thread(thread_id: int) -> SupportThread:
    thread = await SupportThreadService.find_by_id(thread_id)

    if not thread:
        raise EntityNotFound('thread')

    return thread


@router.put('/threads/{thread_id}', response_model=SupportThread)
async def update_thread(thread_id: int, thread: SupportCreate) -> SupportThread:
    thread_upd = await SupportThreadService.update(thread, thread_id)

    return thread_upd


@router.delete('/threads/{thread_id}')
async def delete_thread(thread_id: int) -> None:
    await SupportThreadService.delete(thread_id)


@router.websocket('/ws/{thread_id}')
async def websocket_endpoint(websocket: WebSocket, thread_id: int) -> None:
    await ws_manager.connect(websocket, room_id=thread_id)
    try:
        while True:
            data = await websocket.receive_text()
            message = MessageCreate(
                created_at=datetime.utcnow(), content=data, sender=Sender.client
            )  # TODO: make sender recognizer

            await ws_manager.broadcast(data, room_id=thread_id, exp=websocket)
            await SupportThreadService.create_message(
                message=message, thread_id=thread_id
            )

    except WebSocketDisconnect:
        ws_manager.disconnect(websocket, room_id=thread_id)
