from datetime import datetime
from pydantic import BaseModel, Field
from apps.models.common import PyObjectId
from apps.models.users.dto import UserDto


class ChatDto(BaseModel):
    message: str
    creator: UserDto
    created: datetime
    chatroom_id: str
