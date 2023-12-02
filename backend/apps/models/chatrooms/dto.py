from typing import List
from pydantic import BaseModel, Field
from apps.models.common import PyObjectId
from apps.models.users.dto import UserDto


class CreateChatroomCommand(BaseModel):
    title: str = Field(..., max_length=200)
    users: List[PyObjectId] = []


class ChatroomDto(BaseModel):
    id: str
    title: str = Field(..., max_length=200)
    # users: List[UserDto] = []
