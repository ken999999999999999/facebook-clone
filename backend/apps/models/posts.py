import uuid
from pydantic import BaseModel, Field


class PostModel(BaseModel):
    id: str = Field(default_factory=uuid.uuid4, alias="_id")
    image: str = Field(...)
    description: str = Field(...)

    class Config:
        populate_by_name = True
        json_schema_extra = {
            "example": {
                "id": "00010203-0405-0607-0809-0a0b0c0d0e0f",
                "image": "asdsadasdadadasdadadas",
                "description": "dasdasa",
            }
        }
