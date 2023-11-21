
from datetime import datetime
from typing import Union
from pydantic import BaseModel,  Field
from apps.models.users.dto import UserDto


class CreateRelationshipCommand(BaseModel):
    receiver_id: str = Field(...)


class RelationshipDto(BaseModel):
    id: str
    receiver: UserDto
    creator: UserDto
    accepted_on: Union[datetime, None]
    relationship: str
