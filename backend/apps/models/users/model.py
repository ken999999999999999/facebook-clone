from datetime import datetime
from pydantic import BaseModel, EmailStr, Field
from apps.models.common import PyObjectId


class User(BaseModel):
    id: PyObjectId = Field(default=None, alias="_id")
    uid: str = Field(...)
    email: EmailStr = Field(max_length=100)
    display_name: str = Field(max_length=100)
    first_name: str = Field(max_length=100)
    last_name: str = Field(max_length=100)
    birthdate: datetime = Field(...)
