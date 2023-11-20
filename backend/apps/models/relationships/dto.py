from datetime import datetime
from pydantic import BaseModel,  Field
from apps.models.users.dto import UserDto


class CreateRelationshipCommand(BaseModel):
    receiver_id: str = Field(...)


class RelationshipDto(BaseModel):
    id: str
    receiver_id: UserDto
    created_by: UserDto
    accepted_on: datetime
    relationship: str
