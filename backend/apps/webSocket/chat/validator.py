from bson import ObjectId
from fastapi.exceptions import RequestValidationError
from apps.dependencies.db import db_context
from apps.models.users.model import User


async def connect_chat_validator(chatroom_id: str, db_context: db_context, current_ws_user: User):
    if await db_context.chatrooms.find_one({"_id": ObjectId(chatroom_id)}, {"users": current_ws_user.id}) == None:
        raise RequestValidationError(errors=["Chatroom is not exist"])
    return
