from typing import Annotated
from fastapi import Depends
from config import settings
from motor.motor_asyncio import AsyncIOMotorClient


class DBContext:
    def __init__(self):
        self.db_client = AsyncIOMotorClient(settings.DB_URL)
        self.db = self.db_client[settings.DB_NAME]

    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc_value, traceback):
        self.db_client.close()


async def get_db_context():
    with DBContext() as db_context:
        yield db_context

db_context = Annotated[DBContext, Depends(get_db_context)]
