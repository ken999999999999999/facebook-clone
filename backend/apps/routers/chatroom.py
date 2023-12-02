from fastapi import APIRouter, Body, Depends
from apps.dependencies.auth import authorize
from apps.dependencies.user import current_user
from apps.dependencies.db import db_context
from apps.models.chatrooms.dto import ChatroomDto, CreateChatroomCommand
from apps.models.chatrooms.model import Chatroom
from apps.models.chatrooms.validator import create_chatroom_validator
from apps.models.common import PaginationQuery


router = APIRouter(
    prefix="/chatrooms",
    tags=["chatrooms"],
    dependencies=[Depends(authorize)]
)


@router.post("/", dependencies=[Depends(create_chatroom_validator)])
async def create_chatroom_command(db_context:  db_context, current_user: current_user,  command: CreateChatroomCommand = Body(...)) -> str:
    command.users.append(current_user.id)
    chatroom = Chatroom(title=command.title,
                        users=command.users).model_dump(exclude=["id"])
    return str((await db_context.chatrooms.insert_one(chatroom)).inserted_id)


@router.get("/")
async def get_chatrooms_command(db_context:  db_context, current_user: current_user,  pagination: PaginationQuery = Depends()) -> str:
    query = await db_context.chatrooms.aggregate([
        {"$match": {
            "users": current_user.id
        }},

        {"$addFields": {
            "id": {"$toString": "$_id"}
        }},
        {"$sort": {pagination.order_by: 1 if pagination.is_asc else -1}},
        {"$skip": pagination.skip},
        {"$limit": pagination.page_size}
    ]).to_list(None)

    return [ChatroomDto(id=record['id'], title=record['title']) for record in query]
