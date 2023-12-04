from contextlib import asynccontextmanager
import json
from fastapi import Depends, FastAPI
from fastapi.exceptions import RequestValidationError
from fastapi.responses import PlainTextResponse
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from apps.config import settings
from apps.routers import chat, chatroom, comment, posts, reaction, relationship, ticket, users
import firebase_admin
from firebase_admin import credentials
from apps.webSocket.chat.endpoint import chat_endpoint, chat_test_endpoint
from apps.webSocket.chat.validator import ticket_validator


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Connect Firebase
    cred = credentials.Certificate(
        settings.SERVICE_ACCOUNT_KEY if settings.DEBUG_MODE else json.loads(settings.SERVICE_ACCOUNT_KEY))
    app = firebase_admin.initialize_app(cred)
    yield
    firebase_admin.delete_app(app)


app = FastAPI(
    lifespan=lifespan,
    openapi_url="/openapi.json",
    docs_url="/docs",
    redoc_url="/redoc",
)
app.include_router(users.router)
app.include_router(posts.router)
app.include_router(relationship.router)
app.include_router(comment.router)
app.include_router(reaction.router)
app.include_router(chat.router)
app.include_router(chatroom.router)
app.include_router(ticket.router)

app.add_middleware(
    CORSMiddleware,
    # Allows specific origins (use ["*"] for all origins)
    allow_origins=settings.ALLOW_ORIGINS.split(","),
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

app.add_api_websocket_route(
    "/chatroom/{chatroom_id}", chat_endpoint, dependencies=[Depends(ticket_validator)])


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
