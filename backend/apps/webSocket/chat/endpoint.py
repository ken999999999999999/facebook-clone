from fastapi import Depends, WebSocket, WebSocketDisconnect
from apps.dependencies.db import db_context
from apps.models.chats.dto import ChatDto
from apps.models.chats.model import Chat
from apps.webSocket.common import current_ws_user
from apps.webSocket.connectionManger import ConnectionManager


manager = ConnectionManager()


async def chat_test_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    token = websocket.headers.get("Sec-WebSocket-Protocol")
    try:
        while True:
            data = await websocket.receive_text()

            await manager.broadcast(f"{token} message: {data}")


    except WebSocketDisconnect:
        manager.disconnect(websocket)





async def chat_endpoint(websocket: WebSocket, chatroom_id: str, db_context: db_context, current_ws_user: current_ws_user):
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()

            newChat = Chat(message=data, created_by=current_ws_user.id,
                           chatroom_id=chatroom_id)

            message = ChatDto(message=data, created=newChat.created, chatroom_id=chatroom_id,
                              creator=current_ws_user.model_dump()).model_dump_json()

            await manager.broadcast(message)

            db_context.chats.insert_one(newChat.model_dump(exclude=["id"]))

    except WebSocketDisconnect:
        manager.disconnect(websocket)
