from fastapi import Depends, WebSocket, WebSocketDisconnect
from apps.dependencies.db import db_context
from apps.models.chats.dto import ChatDto
from apps.models.chats.model import Chat
from apps.webSocket.chat.validator import connect_chat_validator
from apps.webSocket.common import authorize_ws_user
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





async def chat_endpoint(websocket: WebSocket, chatroom_id: str, db_context: db_context):
    await manager.connect(websocket)
    current_ws_user = None
    try:
        while True:
            data = await websocket.receive_text()
            if current_ws_user is None :
               current_ws_user = await authorize_ws_user(db_context, token=data)
               await connect_chat_validator(chatroom_id, db_context, current_ws_user)
               continue
               
            newChat = Chat(message=data, created_by=current_ws_user.id,
                           chatroom_id=chatroom_id)

            message = ChatDto(message=data, created=newChat.created, chatroom_id=chatroom_id,
                              creator=current_ws_user.model_dump()).model_dump_json()

            await manager.broadcast(message)

            db_context.chats.insert_one(newChat.model_dump(exclude=["id"]))

    except:
        current_ws_user = None
        manager.disconnect(websocket)
