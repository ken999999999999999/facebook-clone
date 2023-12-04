from fastapi import APIRouter, Body, Depends,  Request
from apps.dependencies.auth import authorize
from apps.dependencies.user import current_user
from apps.dependencies.db import db_context
from apps.models.tickets.dto import CreateTicketCommand
from apps.models.tickets.model import Ticket
from apps.models.tickets.validator import create_ticket_validator


router = APIRouter(
    prefix="/tickets",
    tags=["tickets"],
    dependencies=[Depends(authorize)]
)


@router.post("/", dependencies=[Depends(create_ticket_validator)])
async def create_ticket_command(db_context:  db_context, current_user: current_user, request: Request, command: CreateTicketCommand = Body(...), ) -> str:

    ticket = Ticket(ip_address=request.client.host,
                    chatroom_id=command.chatroom_id, owner=current_user.id).model_dump(exclude=['id'])

    return str((await db_context.tickets.insert_one(ticket.model_dump())).inserted_id)
