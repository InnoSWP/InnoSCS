from datetime import datetime
from http import HTTPStatus
from typing import Optional

from fastapi import APIRouter, WebSocket, WebSocketDisconnect

from app.api.managers import WsConnectionManager
from app.api.repositories import SupportThreadRepository
from app.api.schemas import (
    Filter,
    MessageCreate,
    SupportThread,
    SupportThreadCreate,
    SupportThreadPatch,
)

router = APIRouter()
ws_manager = WsConnectionManager()


@router.post('/threads', response_model=SupportThread, status_code=HTTPStatus.CREATED)
async def create_thread(thread: SupportThreadCreate) -> SupportThread:
    thread_new = await SupportThreadRepository.create(thread)

    return thread_new


@router.get('/threads', response_model=list[SupportThread])
async def find_all_threads(flt: Optional[Filter] = None) -> list[SupportThread]:
    threads = await SupportThreadRepository.find_all(flt)

    return threads


@router.get('/threads/{thread_id}', response_model=SupportThread)
async def find_thread(thread_id: int) -> SupportThread:
    thread = await SupportThreadRepository.find_by_id(thread_id)

    return thread


@router.patch('/threads/{thread_id}', response_model=SupportThread)
async def patch_thread(thread_id: int, thread_ptc: SupportThreadPatch) -> SupportThread:
    thread = await SupportThreadRepository.patch(thread_ptc, thread_id)

    return thread


@router.delete('/threads/{thread_id}')
async def delete_thread(thread_id: int) -> None:
    await SupportThreadRepository.delete(thread_id)


@router.websocket('/ws/{thread_id}')
async def websocket_endpoint(websocket: WebSocket, thread_id: int) -> None:
    await ws_manager.connect(websocket, room_id=thread_id)
    try:
        while True:
            data = await websocket.receive_text()
            message = MessageCreate(created_at=datetime.utcnow(), content=data)

            await ws_manager.broadcast(data, room_id=thread_id, exp=websocket)
            await SupportThreadRepository.create_message(
                message=message, thread_id=thread_id
            )

    except WebSocketDisconnect:
        ws_manager.disconnect(websocket, room_id=thread_id)
