from typing import Union
from pydantic import BaseModel, Field
from apps.models.common import PyObjectId
from apps.models.reactions.enum import EmojiEnum


class Reaction(BaseModel):
    id: PyObjectId = Field(default=None, alias="_id")
    emoji: EmojiEnum = Field(...)
    post_id: Union[PyObjectId, None] = Field(default=None)
    comment_id: Union[PyObjectId, None] = Field(default=None)
    created_by: PyObjectId = Field(...)

    class Config:
        populate_by_name = True
