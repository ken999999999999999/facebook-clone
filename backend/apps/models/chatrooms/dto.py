from typing import List
from pydantic import BaseModel
from apps.models.common import PyObjectId
from apps.models.users.dto import UserDto


class CreateChatroomCommand(BaseModel):
    users: List[PyObjectId] = []


class ChatroomDto(BaseModel):
    id: str
    users: List[UserDto] = []
