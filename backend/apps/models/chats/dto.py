from datetime import datetime
from typing import List
from pydantic import BaseModel
from apps.models.common import PyObjectId
from apps.models.users.dto import UserDto


class CreateChatCommand(BaseModel):
    users: List[PyObjectId] = []


class ChatDto(BaseModel):
    message: str
    creator: UserDto
    created: datetime
    chatroom_id: str
