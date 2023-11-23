from bson import ObjectId
from fastapi import Body
from fastapi.exceptions import RequestValidationError
from apps.dependencies.db import db_context
from apps.models.comments.dto import CreateCommentCommand


async def create_comment_validator(db_context: db_context,  command: CreateCommentCommand = Body(...), ):
    if await db_context.posts.find_one({"_id": ObjectId(command.post_id)}) == None:
        raise RequestValidationError(errors=["Post is not exist"])
    return
