from typing import Union
from bson import ObjectId
from fastapi import Body
from fastapi.exceptions import RequestValidationError
from apps.dependencies.db import db_context
from apps.models.reactions.dto import CreateReactionCommand
from operator import xor


async def get_reactions_validator(post_id: Union[str, None] = None, comment_id: Union[str, None] = None):
    if not xor(post_id != None, comment_id != None):
        raise RequestValidationError(
            errors=["Please choose between post and comment"])


async def create_reaction_validator(db_context: db_context,  command: CreateReactionCommand = Body(...)):

    if not xor(command.post_id != None, command.comment_id != None):
        raise RequestValidationError(
            errors=["Please choose between post and comment"])

    if command.post_id != None and await db_context.posts.find_one({"_id": ObjectId(command.post_id)}) == None:
        raise RequestValidationError(errors=["Post is not exist"])

    if command.comment_id != None and await db_context.comments.find_one({"_id": ObjectId(command.comment_id)}) == None:
        raise RequestValidationError(errors=["Comment is not exist"])

    if await db_context.reactions.find_one({"$or": [{"post_id": command.post_id}, {"comment_id": command.comment_id}]}) != None:
        raise RequestValidationError(errors=["Reaction is exist"])
    return
