from datetime import datetime
from http.client import BAD_REQUEST
from bson import ObjectId
from fastapi import APIRouter, Body, Depends,   HTTPException
from apps.dependencies.auth import authorize
from apps.dependencies.user import current_user
from apps.dependencies.db import db_context
from apps.models.common import PaginationDto, PaginationQuery
from apps.models.comments.dto import CreateCommentCommand,  UpdateCommentCommand
from apps.models.comments.model import Comment
from apps.models.comments.validator import create_comment_validator


router = APIRouter(
    prefix="/comments",
    tags=["comments"],
    responses={404: {"description": "Not found"}},
    dependencies=[Depends(authorize)]
)


@router.get("/")
async def read_comments(db_context: db_context, current_user: current_user, pagination: PaginationQuery = Depends()):
    return


@router.get("${id}/image")
async def get_comment_image_query(id: str, db_context:  db_context) -> str:
    comment = await db_context.comments.find_one({"_id": ObjectId(id)})
    if (comment) is None:
        raise HTTPException(status_code=404, detail=f"Comment {id} not found")
    return Comment(comment).image


@router.post("/", dependencies=[Depends(create_comment_validator)])
async def create_comment_command(db_context:  db_context, current_user: current_user,  command: CreateCommentCommand = Body(...)) -> str:
    comment = Comment(**command.model_dump(),
                      created_by=current_user.id).model_dump(exclude=["id"])
    return str((await db_context.comments.insert_one(comment)).inserted_id)


@router.put("/{id}")
async def update_comment_command(id: str, db_context:  db_context, current_user: current_user,  command: UpdateCommentCommand = Body(...)) -> None:
    if id != command.id:
        return BAD_REQUEST()
    updated_comment = command.model_dump(exclude="id")
    updated_comment['modified_by'] = datetime.now()

    if (await db_context.comments.find_one_and_update({"_id": ObjectId(command.id), "created_by": current_user.id}, {"$set": updated_comment})) is None:
        raise HTTPException(status_code=404, detail=f"Comment {id} not found")
    return


@router.delete("/{id}")
async def delete_comment_command(id: str, db_context:  db_context, current_user: current_user) -> None:
    if (await db_context.comments.find_one_and_delete({"_id": ObjectId(id), "created_by": current_user.id})) is None:
        raise HTTPException(status_code=404, detail=f"Comment {id} not found")

    return
