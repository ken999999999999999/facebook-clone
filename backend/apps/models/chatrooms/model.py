from typing import List
from pydantic import BaseModel, Field
from apps.models.common import PyObjectId


class Chatroom(BaseModel):
    id: PyObjectId = Field(default=None, alias="_id")
    title: str = Field(..., max_length=200)
    users: List[PyObjectId] = Field(...)

    class Config:
        populate_by_name = True
