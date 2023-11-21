from datetime import datetime
from typing import Union
from pydantic import BaseModel, Field

from apps.models.users.dto import UserBriefDto


class CreatePostCommand(BaseModel):
    image:  Union[str, None] = None
    description: str = Field(..., max_length=2000),
    original_post: Union[str, None] = None


class UpdatePostCommand(BaseModel):
    id: str = Field(...)
    image:  Union[str, None] = None
    description: str = Field(..., max_length=2000)


class PostDto(BaseModel):
    id: str
    description: str
    has_image: bool
    creator: UserBriefDto
    created: datetime
    modified: datetime


class PostOriginalDto(PostDto):
    original_post: Union[PostDto, None] = None
