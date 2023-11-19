from pydantic import BaseModel, Field


class CreatePostCommand(BaseModel):
    image: str
    description: str = Field(..., max_length=2000)


class UpdatePostCommand(BaseModel):
    id: str = Field(...)
    image: str
    description: str = Field(..., max_length=2000)
