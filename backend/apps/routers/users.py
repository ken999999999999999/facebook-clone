from fastapi import APIRouter, Body, Depends
from apps.dependencies.auth import create_user
from apps.dependencies.db import db_context
from apps.models.users.dto import CreateUserDto
from apps.models.users.validators import createUserValidator
from apps.models.users.model import User

router = APIRouter(
    prefix="/users",
    tags=["users"],
    responses={404: {"description": "Not found"}},
)


@router.post("/sign-up/", dependencies=[Depends(createUserValidator)])
async def createUser(db_context: db_context, command: CreateUserDto = Body(...)):
    firebase_user = await create_user(password=command.password, email=command.email, display_name=command.display_name)
    user = User(uid=firebase_user.uid, **
                command.model_dump(exclude=["password"])).model_dump()
    await db_context.users.insert_one(user)

    return
