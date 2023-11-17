from fastapi import Body
from fastapi.exceptions import RequestValidationError
from apps.dependencies.db import db_context
from apps.models.users.dto import CreateUserDto


async def createUserValidator(db_context: db_context, command: CreateUserDto = Body(...), ):
    if await db_context.users.find_one({"display_name": command.display_name}) != None:
        raise RequestValidationError(body="Display Name is used by others")
    return
