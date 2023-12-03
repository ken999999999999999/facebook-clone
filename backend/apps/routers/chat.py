from typing import List
from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException
from apps.dependencies.auth import authorize
from apps.dependencies.user import current_user
from apps.dependencies.db import db_context
from apps.models.chats.dto import ChatDto


router = APIRouter(
    prefix="/chats",
    tags=["chats"],
    dependencies=[Depends(authorize)]
)


@router.get("/")
async def get_chats_command(db_context:  db_context, current_user: current_user, chatroom_id: str, ) -> List[ChatDto]:

    chatroom = await db_context.chatrooms.find_one({"_id": ObjectId(chatroom_id)}, {"users": current_user.id})

    if (chatroom is None):
        raise HTTPException(
            status_code=404, detail=f"Chatroom {chatroom_id} not found")

    query = await db_context.chats.aggregate([
        {"$match": {
            "$and": [{"chatroom_id": chatroom_id}]
        }},
        {"$lookup": {
            "from": "users",
            "let": {"created_by_user_id": {"$toObjectId": "$created_by"}},
            "pipeline": [
                {"$match": {
                    "$expr": {"$eq": ["$_id", "$$created_by_user_id"]}}},
                {"$addFields": {"id": {"$toString": "$_id"}}}
            ],
            "as": "creators"
        }},
        {"$addFields": {
            "creator": {"$arrayElemAt": ["$creators", 0]},
        }},
        {"$sort": {"created": 1}},

    ]).to_list(None)

    return [ChatDto(**record) for record in query]
