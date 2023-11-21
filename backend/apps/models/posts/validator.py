from bson import ObjectId
from fastapi import Body
from fastapi.exceptions import RequestValidationError
from apps.dependencies.db import db_context
from apps.models.posts.dto import CreatePostCommand


async def create_post_validator(db_context: db_context, command: CreatePostCommand = Body(...), ):
    if command.original_post_id != None and await db_context.posts.find_one({"_id": ObjectId(command.original_post_id)}) == None:
        raise RequestValidationError(body="Original Post is not exist")
    return
