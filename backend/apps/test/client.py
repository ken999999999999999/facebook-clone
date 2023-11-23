from bson import ObjectId
from fastapi import Body, HTTPException, Request, Security, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from fastapi.testclient import TestClient
from apps.config import settings
from apps.dependencies.auth import authorize
from apps.dependencies.db import db_context
from apps.main import app
from apps.models.users.model import User


security = HTTPBearer()


@app.post("/mock-sign-up")
async def get_mock_user(db_context: db_context, command: User = Body(...)) -> str:
    record = await db_context.users.find_one({"email": command.email})
    id = ""
    if (record != None):
        id = record["_id"]
    else:
        id = (await db_context.users.insert_one(command.model_dump(exclude=["id"]))).inserted_id
    return str(id)

facebook_clone_test_client = TestClient(app)


settings.DB_NAME = "testFbClone"


async def test_authorize(db_context: db_context, credentials: HTTPAuthorizationCredentials = Security(security)):
    user = await db_context.users.find_one({"_id": ObjectId(credentials.credentials)})
    if (user != None):
        return User(**user)
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid authentication credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )


app.dependency_overrides[authorize] = test_authorize
