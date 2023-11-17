from datetime import datetime
import uuid
from pydantic import BaseModel, EmailStr, Field


class User(BaseModel):
    uid: str = Field(...)
    email: EmailStr = Field(max_length=100)
    display_name: str = Field(max_length=100)
    first_name: str = Field(max_length=100)
    last_name: str = Field(max_length=100)
    birthdate: datetime = Field(...)

    class Config:
        populate_by_name = True
        json_schema_extra = {
            "example": {
                "id": "00010203-0405-0607-0809-0a0b0c0d0e0f",
                'display_name': "Hello World",
                "first_name": "Hello",
                "last_name": "World",
                "birthdate": "2000-01-01"
            }
        }
