from datetime import datetime
from pydantic import BaseModel,  Field
from apps.models.common import PyObjectId
from apps.models.relationships.enum import RelationshipEnum


class Relationship(BaseModel):
    id: PyObjectId = Field(default=None, alias="_id")
    receiver_id: PyObjectId = Field(...)
    created_by: PyObjectId = Field(...)
    accepted_on: datetime
    relationship: RelationshipEnum = Field(...)
