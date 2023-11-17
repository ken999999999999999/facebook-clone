from ctypes import Union
from pydantic import BaseModel, Field


class CreatePostDto(BaseModel):
    image: str
    description: str = Field(...)
