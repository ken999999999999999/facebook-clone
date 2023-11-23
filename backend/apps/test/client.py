from fastapi import Request, Security
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from fastapi.testclient import TestClient
from apps.config import settings
from apps.dependencies.auth import authorize
from apps.dependencies.db import DBContextManager, get_db_context, db_context
from apps.main import app


security = HTTPBearer()


async def get_test_db_context():
    with DBContextManager(settings.TEST_DB_NAME) as db_context:
        yield db_context


async def test_authorize(db_context: db_context, credentials: HTTPAuthorizationCredentials = Security(security)):
    print(credentials.credentials)
    return True


auth_headers = {"Authorization": 'Bearer 12312412'}

app.dependency_overrides[get_db_context] = get_test_db_context

app.dependency_overrides[authorize] = test_authorize

facebook_clone_test_client = TestClient(app)
