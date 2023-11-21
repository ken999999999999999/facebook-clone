from datetime import datetime
from typing import Union
from pydantic import BaseModel, Field
from apps.models.users.dto import UserBriefDto


class CreateCommentCommand(BaseModel):
    post_id: str
    image:  Union[str, None] = None
    description: str = Field(..., max_length=2000),


class UpdateCommentCommand(BaseModel):
    id: str = Field(...)
    image:  Union[str, None] = None
    description: str = Field(..., max_length=2000)


class CommentDto(BaseModel):
    id: str
    description: str
    has_image: bool
    creator: UserBriefDto
    created: datetime
    modified: datetime
