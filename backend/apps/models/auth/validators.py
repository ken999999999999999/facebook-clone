from fastapi import Body
from fastapi.exceptions import RequestValidationError
from apps.dependencies.db import db_context
from apps.models.auth.dto import SignUpDto


async def signUpValidator(db_context: db_context, command: SignUpDto = Body(...), ):
    if await db_context.users.find_one({"display_name": command.display_name}) != None:
        raise RequestValidationError(body="Display Name is used by others")
    return
