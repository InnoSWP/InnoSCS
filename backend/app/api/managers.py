from typing import List

from fastapi import WebSocket


class WsConnectionManager:
    def __init__(self) -> None:
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket) -> None:
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket) -> None:
        self.active_connections.remove(websocket)

    async def broadcast(self, message: str, exp: WebSocket) -> None:
        for connection in self.active_connections:
            if connection is not exp:
                await connection.send_text(message)
