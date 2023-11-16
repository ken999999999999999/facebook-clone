from fastapi import APIRouter, Body, Depends
from apps.dependencies.auth import create_user
from apps.dependencies.db import db_context
from apps.models.auth.dto import SignUpDto
from apps.models.auth.validators import signUpValidator
from apps.models.users.model import User

router = APIRouter(
    prefix="/auth",
    tags=["auth"],
    responses={404: {"description": "Not found"}},
)


@router.post("/signUp/", dependencies=[Depends(signUpValidator)])
async def signUp(db_context: db_context, command: SignUpDto = Body(...)):
    firebase_user = await create_user(password=command.password, email=command.email, display_name=command.display_name)
    user = User(uid=firebase_user.uid, **
                command.model_dump(exclude=["password"])).model_dump()
    await db_context.users.insert_one(user)

    return
