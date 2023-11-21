from datetime import datetime
from typing import Union
from pydantic import BaseModel,  Field
from apps.models.common import PyObjectId
from apps.models.relationships.enum import RelationshipEnum


class Relationship(BaseModel):
    id: PyObjectId = Field(default=None, alias="_id")
    receiver_id: PyObjectId = Field(...)
    created_by: PyObjectId = Field(...)
    accepted_on: Union[datetime, None] = None
    relationship: RelationshipEnum
