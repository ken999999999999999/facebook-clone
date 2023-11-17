from fastapi import APIRouter, Body, Depends,  status, HTTPException
from fastapi.encoders import jsonable_encoder
from apps.dependencies.auth import authorize
from apps.dependencies.db import db_context
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


@router.get("/{post_id}", response_description="Get single post")
async def read_post(id: str, db_context:  db_context):
    if (post := await db_context.posts.find_one({"_id": id})) is not None:
        return post

    raise HTTPException(status_code=404, detail=f"Task {id} not found")


@router.post("/",
             response_description="Add new post",
             status_code=status.HTTP_201_CREATED,
             response_model_by_alias=False
             )
async def create_task(db_context:  db_context, post: Post = Body(...)):
    new_post = await db_context.posts.insert_one(post.model_dump())
    return new_post.inserted_id
