from datetime import datetime
from fastapi import Depends, WebSocket, WebSocketDisconnect, WebSocketException, status
from apps.dependencies.auth import db_authorize
from apps.dependencies.db import db_context
from apps.models.chats.dto import ChatDto
from apps.models.chats.model import Chat
from apps.models.users.model import User

from apps.webSocket.connectionManger import ConnectionManager


manager = ConnectionManager()


async def get_ws_user(
    websocket: WebSocket,
    db_context: db_context,
):
    token = websocket.cookies.get("token")
    if token is None:
        raise WebSocketException(code=status.WS_1008_POLICY_VIOLATION)
    return await db_authorize(token, db_context)


async def chat_endpoint(websocket: WebSocket, chatroom_id: str, db_context: db_context, current_user: User = Depends(get_ws_user)):
    await manager.connect(websocket)

    try:
        while True:
            data = await websocket.receive_text()

            newChat = Chat(message=data, created_by=current_user.id,
                           chatroom_id=chatroom_id)

            message = ChatDto(message=data, created=newChat.created, chatroom_id=chatroom_id,
                              creator=current_user.model_dump()).model_dump_json()

            await manager.broadcast(message)

            db_context.chats.insert_one(newChat.model_dump(exclude=["id"]))

    except WebSocketDisconnect:
        manager.disconnect(websocket)
