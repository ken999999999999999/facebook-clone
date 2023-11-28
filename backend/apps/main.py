from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.exceptions import RequestValidationError
from fastapi.responses import PlainTextResponse
import uvicorn
from apps.config import settings
from apps.routers import comment, posts, reaction, relationship, users
import firebase_admin
from firebase_admin import credentials


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Connect Firebase
    cred = credentials.Certificate(settings.SERVICE_ACCOUNT_KEY)
    app = firebase_admin.initialize_app(cred)
    yield
    firebase_admin.delete_app(app)


app = FastAPI(lifespan=lifespan)
app.include_router(users.router)
app.include_router(posts.router)
app.include_router(relationship.router)
app.include_router(comment.router)
app.include_router(reaction.router)


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request, exc):
    return PlainTextResponse(str(exc), status_code=400)

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host=settings.HOST,
        reload=settings.DEBUG_MODE,
        port=settings.PORT,
    )
