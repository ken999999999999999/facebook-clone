from datetime import datetime
from typing import Union
from pydantic import BaseModel, Field
from apps.models.common import PyObjectId
from apps.models.users.model import User


class Comment(BaseModel):
    id: PyObjectId = Field(default=None, alias="_id")
    image:  Union[datetime, None] = None
    description: str = Field(..., max_length=2000)
    post_id: PyObjectId = Field(...)
    created_by: PyObjectId = Field(...)
    created: datetime = Field(default_factory=datetime.now)
    modified: datetime = Field(default_factory=datetime.now)

    class Config:
        populate_by_name = True
