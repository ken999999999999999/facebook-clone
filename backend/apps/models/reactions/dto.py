from datetime import datetime
from typing import Union
from pydantic import BaseModel, Field
from apps.models.reactions.enum import EmojiEnum
from apps.models.users.dto import UserBriefDto


class CreateReactionCommand(BaseModel):
    post_id: Union[str, None] = None
    comment_id: Union[str, None] = None
    emoji: EmojiEnum = Field(...)


class UpdateReactionCommand(BaseModel):
    id: str = Field(...)
    emoji: EmojiEnum = Field(...)


class ReactionBriefDto(BaseModel):
    id: str
    emoji: EmojiEnum
    created_by: UserBriefDto
