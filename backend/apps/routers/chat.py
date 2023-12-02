from typing import List
from bson import ObjectId
from fastapi import APIRouter, Body, Depends
from apps.dependencies.auth import authorize
from apps.dependencies.user import current_user
from apps.dependencies.db import db_context
from apps.models.chatrooms.dto import ChatroomDto, CreateChatroomCommand
from apps.models.chatrooms.model import Chatroom
from apps.models.chatrooms.validator import create_chatroom_validator
from apps.models.chats.dto import ChatDto
from apps.models.common import PaginationQuery


router = APIRouter(
    prefix="/chats",
    tags=["chats"],
    dependencies=[Depends(authorize)]
)


@router.post("/", dependencies=[Depends(create_chatroom_validator)])
async def create_chatroom_command(db_context:  db_context, current_user: current_user,  command: CreateChatroomCommand = Body(...)) -> str:
    users = command.users.append(current_user.id)
    chatroom = Chatroom(title=command.title,
                        users=users).model_dump(exclude=["id"])
    return str((await db_context.chatrooms.insert_one(chatroom)).inserted_id)


@router.get("/")
async def get_chats_command(db_context:  db_context, current_user: current_user, chatroom_id: str, ) -> List[ChatDto]:
    query = await db_context.chats.aggregate([
        {"$match": {
            "$and": [{"chatroom_id": chatroom_id}, {"users": current_user.id}]
        }},
        {"$lookup": {
            "from": "users",
            "let": {"created_by_user_id": {"$toObjectId": "$created_by"}},
            "pipeline": [
                {"$match": {
                    "$expr": {"$eq": ["$_id", "$$created_by_user_id"]}}},
            ],
            "as": "creators"
        }},
        {"$addFields": {
            "creator": {"$arrayElemAt": ["$creators", 0]},
        }},
        {"$sort": {"created": 0}},

    ]).to_list(None)

    return [ChatDto(**record) for record in query]
