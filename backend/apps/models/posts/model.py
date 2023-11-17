from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field
from apps.models.common import PyObjectId
from apps.models.users.model import User


class Post(BaseModel):
    id: PyObjectId = Field(default=None, alias="_id")
    image: str
    description: str = Field(...)
    created_by: PyObjectId = Field(...)
    created: datetime = Field(default_factory=datetime.now)
    modifiedOn: datetime = Field(default_factory=datetime.now)

    class Config:
        populate_by_name = True
