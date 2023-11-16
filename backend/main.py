from contextlib import asynccontextmanager
from fastapi import FastAPI
import uvicorn
from config import settings
from apps.routers import posts, users, auth
import firebase_admin
from firebase_admin import credentials


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Connect Firebase
    cred = credentials.Certificate("serviceAccountKey.json")
    app = firebase_admin.initialize_app(cred)
    yield
    firebase_admin.delete_app(app)


app = FastAPI(lifespan=lifespan)
app.include_router(users.router)
app.include_router(posts.router)
app.include_router(auth.router)


if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host=settings.HOST,
        reload=settings.DEBUG_MODE,
        port=settings.PORT,
    )
