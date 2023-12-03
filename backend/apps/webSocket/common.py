
from fastapi import  WebSocketException, status
from apps.dependencies.auth import db_authorize
from apps.dependencies.db import db_context


async def authorize_ws_user(
    db_context: db_context,
    token:str, 
):
    if token is None:
        raise WebSocketException(code=status.WS_1008_POLICY_VIOLATION)
    return await db_authorize(token, db_context)

