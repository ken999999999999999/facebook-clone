from pydantic import BaseModel, Field
from apps.models.common import PyObjectId


class Chatroom(BaseModel):
    id: PyObjectId = Field(default=None, alias="_id")
    user: PyObjectId = Field(...)

    class Config:
        populate_by_name = True
