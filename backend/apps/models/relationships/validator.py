from bson import ObjectId
from fastapi import Body
from fastapi.exceptions import RequestValidationError
from apps.dependencies.db import db_context
from apps.models.relationships.dto import CreateRelationshipCommand
from apps.dependencies.user import current_user


async def create_relationship_validator(db_context: db_context, current_user: current_user, command: CreateRelationshipCommand = Body(...), ):
    if current_user.id == command.receiver_id:
        raise RequestValidationError(body="Receiver cannot be yourself")

    if await db_context.users.find_one({"_id": ObjectId(command.receiver_id)}) is None:
        raise RequestValidationError(body="Receiver is not exist")
    if await db_context.relationships.find_one({
            "$or": [
                {"receiver_id": current_user.id, "created_by": command.receiver_id},
                {"created_by": current_user.id, "receiver_id": command.receiver_id}
            ]}) != None:
        raise RequestValidationError(body="Relationship is exist")
    return
