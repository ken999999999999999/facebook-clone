from datetime import datetime
from typing import Union
from pydantic import BaseModel, Field
from apps.models.common import PyObjectId
from apps.models.users.model import User


class Chat(BaseModel):
    id: PyObjectId = Field(default=None, alias="_id")
    message: str = Field(..., max_length=2000)
    created_by: PyObjectId = Field(...)
    created: datetime = Field(default_factory=datetime.now)
    chatroom_id: PyObjectId = Field(...)

    class Config:
        populate_by_name = True
