from contextlib import asynccontextmanager
import json
from fastapi import FastAPI
from fastapi.exceptions import RequestValidationError
from fastapi.responses import PlainTextResponse
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from apps.config import settings
from apps.routers import comment, posts, reaction, relationship, users
import firebase_admin
from firebase_admin import credentials

origins = [
    "http://localhost:3000",  
    "http://localhost:8000",  
]

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
    openapi_url="/openapi.json" if settings.DEBUG_MODE else None,
    docs_url= "/docs",
    redoc_url= "/redoc" if settings.DEBUG_MODE else None
    )
app.include_router(users.router)
app.include_router(posts.router)
app.include_router(relationship.router)
app.include_router(comment.router)
app.include_router(reaction.router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows specific origins (use ["*"] for all origins)
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)


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
