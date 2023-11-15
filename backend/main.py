from contextlib import asynccontextmanager
from fastapi import Depends, FastAPI
import uvicorn
from config import settings
from apps.dependencies.auth import get_token_header
from motor.motor_asyncio import AsyncIOMotorClient
from apps.internal import admin
from apps.routers import posts, users


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Connect Mongodb
    app.db_client = AsyncIOMotorClient(settings.DB_URL)
    app.db = app.db_client[settings.DB_NAME]
    yield
    # Close connection
    app.db_client.close()

app = FastAPI(lifespan=lifespan)


app.include_router(users.router)
app.include_router(posts.router)
app.include_router(
    admin.router,
    prefix="/admin",
    tags=["admin"],
    dependencies=[Depends(get_token_header)],
    responses={418: {"description": "I'm a teapot"}},
)


if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host=settings.HOST,
        reload=settings.DEBUG_MODE,
        port=settings.PORT,
    )
