from contextlib import asynccontextmanager
from fastapi import Depends, FastAPI
import uvicorn
from apps.dependencies.auth import get_current_user
from config import settings
from motor.motor_asyncio import AsyncIOMotorClient
from apps.routers import posts, users
import firebase_admin
from firebase_admin import credentials


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Connect Mongodb
    app.db_client = AsyncIOMotorClient(settings.DB_URL)
    app.db = app.db_client[settings.DB_NAME]

    # Connect Firebase
    cred = credentials.Certificate("serviceAccountKey.json")
    firebase_admin.initialize_app(cred)

    yield
    # Close connection
    app.db_client.close()


app = FastAPI(lifespan=lifespan)


app.include_router(users.router)
app.include_router(posts.router)


if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host=settings.HOST,
        reload=settings.DEBUG_MODE,
        port=settings.PORT,
    )
