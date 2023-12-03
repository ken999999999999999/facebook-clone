from bson import ObjectId
from fastapi import APIRouter, Body, Depends, HTTPException
from apps.dependencies.auth import authorize
from apps.dependencies.user import current_user
from apps.dependencies.db import db_context
from apps.models.chatrooms.dto import ChatroomDto, CreateChatroomCommand
from apps.models.chatrooms.model import Chatroom
from apps.models.chatrooms.validator import create_chatroom_validator
from apps.models.chats.model import Chat
from apps.models.common import PaginationQuery
from apps.models.users.dto import UserDto


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
    chatroomId = str((await db_context.chatrooms.insert_one(chatroom)).inserted_id)

    newChat = Chat(message=command.title, created_by=current_user.id,
                   chatroom_id=chatroomId)

    await db_context.chats.insert_one(newChat.model_dump(exclude=["id"]))

    return chatroomId


@router.get("/")
async def get_chatrooms_query(db_context:  db_context, current_user: current_user,  pagination: PaginationQuery = Depends()):
    query = await db_context.chatrooms.aggregate([
        {"$match": {
            "users": current_user.id
        }},
        {"$lookup": {
            "from": "users",
            "let": {"users_id": {"$map": {
                "input": "$users",
                "as": "user_id",
                "in": {"$toObjectId": "$$user_id"}
            }}},
            "pipeline": [
                {"$match": {
                    "$expr": {"$in": ["$_id", "$$users_id"]}}},
                {"$addFields": {"id": {"$toString": "$_id"}}}
            ],
            "as": "users"
        }},

        {"$addFields": {
            "id": {"$toString": "$_id"}
        }},
        {"$sort": {pagination.order_by: 1 if pagination.is_asc else -1}},
        {"$skip": pagination.skip},
        {"$limit": pagination.page_size}
    ]).to_list(None)

    return [ChatroomDto(**record) for record in query]


@router.get("/{id}")
async def get_chatroom_query(id: str, db_context:  db_context, current_user: current_user) -> ChatroomDto:

    query = await db_context.chatrooms.aggregate([
        {"$match": {
            "users": current_user.id,
            "_id": ObjectId(id)
        }},
        {"$lookup": {
            "from": "users",
            "let": {"users_id": {"$map": {
                "input": "$users",
                "as": "user_id",
                "in": {"$toObjectId": "$$user_id"}
            }}},
            "pipeline": [
                {"$match": {
                    "$expr": {"$in": ["$_id", "$$users_id"]}}},
                {"$addFields": {"id": {"$toString": "$_id"}}}
            ],
            "as": "users"
        }},

        {"$addFields": {
            "id": {"$toString": "$_id"}
        }},
        {"$limit": 1}
    ]).to_list(None)

    if len(query) < 1:
        raise HTTPException(status_code=404, detail=f"Chatroom {id} not found")

    return ChatroomDto(**query[0])
