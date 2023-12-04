from bson import ObjectId
from fastapi import Body
from fastapi.exceptions import RequestValidationError
from apps.dependencies.db import db_context
from apps.dependencies.user import current_user
from apps.models.tickets.dto import CreateTicketCommand


async def create_ticket_validator(db_context: db_context, current_user: current_user, command: CreateTicketCommand = Body(...)):
    if await db_context.chatrooms.find_one({"_id": ObjectId(command.chatroom_id), "users": current_user.id}) == None:
        raise RequestValidationError(errors=["Chatroom is not exist"])
    return
