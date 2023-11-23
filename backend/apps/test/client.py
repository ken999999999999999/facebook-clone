from fastapi import Request, Security
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from fastapi.testclient import TestClient
from apps.config import settings
from apps.dependencies.auth import authorize
from apps.dependencies.db import DBContextManager, get_db_context, db_context
from apps.main import app


security = HTTPBearer()

facebook_clone_test_client = TestClient(app)


settings.DB_NAME = "testFbClone"


async def test_authorize(db_context: db_context, credentials: HTTPAuthorizationCredentials = Security(security)):
    return True


app.dependency_overrides[authorize] = test_authorize
