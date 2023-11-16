from config import settings
from motor.motor_asyncio import AsyncIOMotorClient


async def get_db():
    db_client = AsyncIOMotorClient(settings.DB_URL)
    db = db_client[settings.DB_NAME]
    yield
    db_client.close()
