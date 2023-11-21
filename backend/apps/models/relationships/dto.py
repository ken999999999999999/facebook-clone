
from datetime import datetime
from typing import Union
from pydantic import BaseModel,  Field
from apps.models.users.dto import UserBriefDto


class CreateRelationshipCommand(BaseModel):
    receiver_id: str = Field(...)


class RelationshipDto(BaseModel):
    id: str
    receiver: UserBriefDto
    creator: UserBriefDto
    accepted_on: Union[datetime, None]
    relationship: str
