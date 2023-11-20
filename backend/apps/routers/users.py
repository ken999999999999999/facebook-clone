from fastapi import APIRouter, Body, Depends
from apps.dependencies.auth import authorize, create_firebase_user
from apps.dependencies.user import current_user
from apps.dependencies.db import db_context
from apps.models.users.dto import CreateUserCommand, UserDto
from apps.models.users.validators import create_user_validator
from apps.models.users.model import User

router = APIRouter(
    prefix="/users",
    tags=["users"],
    responses={404: {"description": "Not found"}},
)


@router.post("/sign-up/", dependencies=[Depends(create_user_validator)])
async def create_user_command(db_context: db_context, command: CreateUserCommand = Body(...)) -> None:
    firebase_user = await create_firebase_user(password=command.password, email=command.email, display_name=command.display_name)
    user = User(uid=firebase_user.uid, **
                command.model_dump(exclude=["password"])).model_dump(exclude=['id'])
    await db_context.users.insert_one(user)

    return


@router.get("/", dependencies=[Depends(authorize)])
async def get_current_user_query(current_user: current_user) -> UserDto:
    return UserDto(**current_user.model_dump())
