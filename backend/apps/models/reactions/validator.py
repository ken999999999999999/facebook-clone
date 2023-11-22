from bson import ObjectId
from fastapi import Body
from fastapi.exceptions import RequestValidationError
from apps.dependencies.db import db_context
from apps.models.reactions.dto import CreateReactionCommand
from operator import xor


async def create_reaction_validator(db_context: db_context,  command: CreateReactionCommand = Body(...)):

    if not xor(command.post_id != None, command.comment_id != None):
        raise RequestValidationError(
            body="Please choose between post and comment")

    if command.post_id != None and await db_context.posts.find_one({"_id": ObjectId(command.post_id)}) == None:
        raise RequestValidationError(body="Post is not exist")

    if command.comment_id != None and await db_context.comments.find_one({"_id": ObjectId(command.comment_id)}) == None:
        raise RequestValidationError(body="Comment is not exist")
    return
