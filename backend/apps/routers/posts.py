from datetime import datetime
from http.client import BAD_REQUEST
from bson import ObjectId
from fastapi import APIRouter, Body, Depends,   HTTPException
from apps.dependencies.auth import authorize
from apps.dependencies.user import current_user
from apps.dependencies.db import db_context
from apps.models.posts.dto import CreatePostDto, UpdatePostDto
from apps.models.posts.model import Post


router = APIRouter(
    prefix="/posts",
    tags=["posts"],
    responses={404: {"description": "Not found"}},
    dependencies=[Depends(authorize)]
)


fake_posts_db = {"plumbus": {"name": "Plumbus"}, "gun": {"name": "Portal Gun"}}


@router.get("/")
async def read_posts():
    return fake_posts_db


@router.post("/")
async def create_post_command(db_context:  db_context, current_user: current_user,  command: CreatePostDto = Body(...)) -> str:
    post = Post(**command.model_dump(),
                created_by=current_user.id).model_dump(exclude=["id"])
    return str((await db_context.posts.insert_one(post)).inserted_id)


@router.put("/{id}")
async def update_post_command(id: str, db_context:  db_context, current_user: current_user,  command: UpdatePostDto = Body(...)) -> None:
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
