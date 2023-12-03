from datetime import datetime
from typing import Union
from pydantic import BaseModel, Field
from apps.models.common import PyObjectId


class Post(BaseModel):
    id: PyObjectId = Field(default=None, alias="_id")
    image:  Union[str, None] = None
    description: str = Field(..., max_length=2000)
    created_by: PyObjectId = Field(...)
    created: datetime = Field(default_factory=datetime.now)
    modified: datetime = Field(default_factory=datetime.now)
    original_post_id: PyObjectId = Field(default=None)

    class Config:
        populate_by_name = True
