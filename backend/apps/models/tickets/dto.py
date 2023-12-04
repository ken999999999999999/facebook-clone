
from pydantic import BaseModel,  Field


class CreateTicketCommand(BaseModel):
    chatroom_id: str = Field(...)
