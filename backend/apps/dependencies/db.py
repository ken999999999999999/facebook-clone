from typing import Annotated
from fastapi import Depends
from config import settings
from motor.motor_asyncio import AsyncIOMotorClient


class DBContextManager:
    def __init__(self):
        self.db_client = AsyncIOMotorClient(settings.DB_URL)
        self.db = self.db_client[settings.DB_NAME]
        self.posts = self.db['posts']
        self.users = self.db['users']

    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc_value, traceback):
        self.db_client.close()


async def get_db_context():
    with DBContextManager() as db_context:
        yield db_context

db_context = Annotated[DBContextManager, Depends(get_db_context)]
