from fastapi import APIRouter, Body, status, HTTPException, Request
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse
from motor.motor_asyncio import AsyncIOMotorClient
import os

from apps.models.posts import PostModel

router = APIRouter(
    prefix="/posts",
    tags=["posts"],
    responses={404: {"description": "Not found"}},
)


fake_posts_db = {"plumbus": {"name": "Plumbus"}, "gun": {"name": "Portal Gun"}}


@router.get("/")
async def read_posts():
    return fake_posts_db


@router.get("/{post_id}", response_description="Get single post")
async def read_post(id: str, request: Request):
    if (post := await request.app.mongodb["posts"].find_one({"_id": id})) is not None:
        return post

    raise HTTPException(status_code=404, detail=f"Task {id} not found")


@router.post("/",
             response_description="Add new post",
             response_model=str,
             status_code=status.HTTP_201_CREATED,
             response_model_by_alias=False
             )
async def create_task(request: Request, post: PostModel = Body(...)):
    post = jsonable_encoder(post)
    new_post = await request.app.mongodb["posts"].insert_one(post)

    return new_post.inserted_id
