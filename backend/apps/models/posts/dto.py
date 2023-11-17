from ctypes import Union
from pydantic import BaseModel, Field


class CreatePostDto(BaseModel):
    image: str
    description: str = Field(..., max_length=2000)


class UpdatePostDto(BaseModel):
    id: str = Field(...)
    image: str
    description: str = Field(..., max_length=2000)
