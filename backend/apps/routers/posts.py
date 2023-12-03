from datetime import datetime
from http.client import BAD_REQUEST
from bson import ObjectId
from fastapi import APIRouter, Body, Depends,   HTTPException
from apps.dependencies.auth import authorize
from apps.dependencies.user import current_user
from apps.dependencies.db import db_context
from apps.models.common import PaginationQuery
from apps.models.posts.dto import CreatePostCommand, PostOriginalDto, UpdatePostCommand
from apps.models.posts.model import Post
from apps.models.posts.validator import create_post_validator
from typing import List


router = APIRouter(
    prefix="/posts",
    tags=["posts"],
    dependencies=[Depends(authorize)]
)


@router.get("/")
async def get_posts_query(db_context: db_context, current_user: current_user, pagination: PaginationQuery = Depends()) -> List[PostOriginalDto]:
    filters = {"$or": [
        {"created_by": current_user.id},
        {"receiver_id": current_user.id},
    ], "accepted_on": {"$ne": None}}

    friends_query = await db_context.relationships.find(filters).to_list(None)

    friends = [record["receiver_id"] if record["created_by"] ==
               current_user.id else record["created_by"] for record in friends_query]

    friends.append(current_user.id)

    query = await db_context.posts.aggregate([
        {"$match": {
            "created_by": {"$in": friends}
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
        {"$lookup": {
            "from": "posts",
            "localField": "original_post",
            "foreignField": "_id",
            "as": "original_post_detail"
        }},
        {"$addFields": {
            "original_post": {"$arrayElemAt": ["$original_post_detail", 0]},
            "creator": {"$arrayElemAt": ["$creators", 0]},
            "has_image": {"$ne": ["$image", None]},
            "id": {"$toString": "$_id"}
        }},
        {"$sort": {pagination.order_by: 1 if pagination.is_asc else -1}},
        {"$skip": pagination.skip},
        {"$limit": pagination.page_size}
    ]).to_list(None)

    return [PostOriginalDto(**record) for record in query]


@router.get("/{id}/image")
async def get_post_image_query(id: str, db_context:  db_context) -> str:
    post = await db_context.posts.find_one({"_id": ObjectId(id)})
    if (post) is None:
        raise HTTPException(status_code=404, detail=f"Post {id} not found")
    return post['image']


@router.post("/", dependencies=[Depends(create_post_validator)])
async def create_post_command(db_context:  db_context, current_user: current_user,  command: CreatePostCommand = Body(...)) -> str:
    post = Post(**command.model_dump(),
                created_by=current_user.id).model_dump(exclude=["id"])
    return str((await db_context.posts.insert_one(post)).inserted_id)


@router.put("/{id}")
async def update_post_command(id: str, db_context:  db_context, current_user: current_user,  command: UpdatePostCommand = Body(...)) -> None:
    if id != command.id:
        return BAD_REQUEST()
    updated_post = command.model_dump(exclude="id")
    updated_post['modified_by'] = datetime.now()

    if (await db_context.posts.find_one_and_update({"_id": ObjectId(command.id), "created_by": current_user.id}, {"$set": updated_post})) is None:
        raise HTTPException(status_code=404, detail=f"Post {id} not found")
    return


@router.delete("/{id}")
async def delete_post_command(id: str, db_context:  db_context, current_user: current_user) -> None:
    if (await db_context.posts.find_one_and_delete({"_id": ObjectId(id), "created_by": current_user.id})) is None:
        raise HTTPException(status_code=404, detail=f"Post {id} not found")

    return
