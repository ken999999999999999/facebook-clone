
from typing import Annotated
from fastapi import Depends, WebSocket,  WebSocketException, status
from apps.dependencies.auth import db_authorize
from apps.dependencies.db import db_context
from apps.models.users.model import User


async def authorize_ws_user(
    websocket: WebSocket,
    db_context: db_context,
):
    token = websocket.cookies.get("token")
    if token is None:
        raise WebSocketException(code=status.WS_1008_POLICY_VIOLATION)
    return await db_authorize(token, db_context)


current_ws_user = Annotated[User, Depends(authorize_ws_user)]
