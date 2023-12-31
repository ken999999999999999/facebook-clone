from fastapi import Depends, HTTPException,  status, Security
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from firebase_admin import auth
from apps.dependencies.db import db_context
from apps.models.users.model import User

security = HTTPBearer()


async def db_authorize(token: str, db_context: db_context):
    try:
        decoded_token = auth.verify_id_token(
            id_token=token, check_revoked=True)

        current_user = await db_context.users.find_one({"uid": decoded_token['uid']})

        if current_user is not None:
            return User(**current_user)
        raise auth.InvalidIdTokenError(message="User is not exist in this app")

    except auth.InvalidIdTokenError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"}
        )


async def authorize(db_context: db_context, credentials: HTTPAuthorizationCredentials = Security(security)):

    return await db_authorize(credentials.credentials, db_context)


async def create_firebase_user(display_name: str, email: str, password: str):
    try:
        firebase_user = auth.get_user_by_email(email)
    except auth.UserNotFoundError:
        firebase_user = auth.create_user(
            display_name=display_name,
            email=email,
            password=password
        )
    return firebase_user
