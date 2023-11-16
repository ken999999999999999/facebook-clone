from fastapi import APIRouter, Body
from pydantic import BaseModel
from firebase_admin import auth

from apps.dependencies.auth import get_current_user

router = APIRouter()


async def override_permission_required():
    return None


class SignInModel(BaseModel):
    uuid: str


@router.post("/login/", tags=["users"])
async def login(data: SignInModel = Body(...)):
    custom_token = auth.create_custom_token(data.uuid)
    return custom_token


@router.get("/users/", tags=["users"])
async def read_users():
    return [{"username": "Rick"}, {"username": "Morty"}]


@router.get("/users/me", tags=["users"])
async def read_user_me():
    return {"username": "fakecurrentuser"}


@router.get("/users/{username}", tags=["users"])
async def read_user(username: str):
    return {"username": username}
