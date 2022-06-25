from typing import List

from fastapi import WebSocket


class WsConnectionManager:
    def __init__(self) -> None:
        self.active_connections: dict[int, List[WebSocket]] = {}

    async def connect(self, websocket: WebSocket, room_id: int) -> None:
        await websocket.accept()

        self.active_connections[room_id] = self.active_connections.get(room_id, []) + [
            websocket
        ]

    def disconnect(self, websocket: WebSocket, room_id: int) -> None:
        self.active_connections[room_id].remove(websocket)

    async def broadcast(self, message: str, room_id: int, exp: WebSocket) -> None:
        active_wss = self.active_connections[room_id]
        for connection in active_wss:
            if connection is not exp:
                await connection.send_text(message)
