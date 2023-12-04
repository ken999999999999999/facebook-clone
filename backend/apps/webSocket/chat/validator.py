from datetime import datetime
from bson import ObjectId
from fastapi import WebSocket
from fastapi.exceptions import RequestValidationError
from apps.dependencies.db import db_context
from apps.models.users.model import User


async def ticket_validator(token: str, db_context: db_context,  chatroom_id: str, websocket: WebSocket):
    if await db_context.tickets.find_one({"_id": ObjectId(token), "ip_address": websocket.client.host, "chatroom_id": chatroom_id, "connected": None}) == None:
        raise RequestValidationError(errors=["Ticket is not exist"])
    return
