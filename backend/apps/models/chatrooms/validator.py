from bson import ObjectId
from fastapi import Body
from fastapi.exceptions import RequestValidationError
from apps.dependencies.db import db_context
from apps.models.chatrooms.dto import CreateChatroomCommand


async def create_chatroom_validator(db_context: db_context,  command: CreateChatroomCommand = Body(...)):
    users = [ObjectId(userId) for userId in command.users]
    if await db_context.users.count_documents({"_id": {"$in": users}}) != len(users):
        raise RequestValidationError(errors=["Some user is not exist"])
    return
