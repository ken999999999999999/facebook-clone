from fastapi import Body
from fastapi.exceptions import RequestValidationError
from apps.dependencies.db import db_context
from apps.models.relationships.dto import CreateRelationshipCommand
from apps.dependencies.user import current_user


async def create_relationship_validator(db_context: db_context, current_user: current_user, command: CreateRelationshipCommand = Body(...), ):
    if await db_context.relationships.find_one({
            "$or": [
                {"receiver_id": current_user.id, "created_by": command.receiver_id},
                {"created_by": current_user.id, "receiver_id": command.receiver_id}
            ]}) != None:
        raise RequestValidationError(body="Relationship is exist")
    return
