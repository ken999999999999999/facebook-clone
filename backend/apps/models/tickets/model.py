from datetime import datetime
from typing import Union
from pydantic import BaseModel,  Field
from apps.models.common import PyObjectId


class Ticket(BaseModel):
    id: PyObjectId = Field(default=None, alias="_id")
    ip_address: str = Field(...)
    chatroom_id: PyObjectId = Field(...)
    owner: PyObjectId = Field(...)
    created: datetime = Field(default_factory=datetime.now)
    connected: Union[datetime, None] = None
