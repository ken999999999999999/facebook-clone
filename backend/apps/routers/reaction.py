from http.client import BAD_REQUEST
from typing import Union
from apps.models.reactions.dto import CreateReactionCommand, ReactionBriefDto, UpdateReactionCommand
from bson import ObjectId
from fastapi import APIRouter, Body, Depends,   HTTPException
from apps.dependencies.auth import authorize
from apps.dependencies.user import current_user
from apps.dependencies.db import db_context
from apps.models.reactions.model import Reaction
from apps.models.reactions.validator import create_reaction_validator, get_reactions_validator


router = APIRouter(
    prefix="/reactions",
    tags=["reactions"],
    dependencies=[Depends(authorize)]
)


@router.get("/", dependencies=[Depends(get_reactions_validator)])
async def get_reactions(db_context: db_context, post_id: Union[str, None] = None, comment_id: Union[str, None] = None):
    filters = {"post_id": post_id, "comment_id": comment_id}
    query = await db_context.reactions.aggregate([
        {"$match": filters},
        {"$lookup": {
            "from": "users",
            "let": {"created_by_user_id": {"$toObjectId": "$created_by"}},
            "pipeline": [
                {"$match": {
                    "$expr": {"$eq": ["$_id", "$$created_by_user_id"]}}},
                {"$addFields": {"id": {"$toString": "$_id"}}}
            ],
            "as": "creators"
        }},
        {"$addFields": {
            "creator": {"$arrayElemAt": ["$creators", 0]},
            "id": {"$toString": "$_id"}
        }},
    ]).to_list(None)

    return [ReactionBriefDto(**record) for record in query]


@router.post("/", dependencies=[Depends(create_reaction_validator)])
async def create_reaction_command(db_context:  db_context, current_user: current_user,  command: CreateReactionCommand = Body(...)) -> str:
    reaction = Reaction(**command.model_dump(),
                        created_by=current_user.id).model_dump(exclude=["id"])
    return str((await db_context.reactions.insert_one(reaction)).inserted_id)


@router.put("/{id}")
async def update_reaction_command(id: str, db_context:  db_context, current_user: current_user,  command: UpdateReactionCommand = Body(...)) -> None:
    if id != command.id:
        return BAD_REQUEST()
    updated_reaction = command.model_dump(exclude="id")

    if (await db_context.reactions.find_one_and_update({"_id": ObjectId(command.id), "created_by": current_user.id}, {"$set": updated_reaction})) is None:
        raise HTTPException(status_code=404, detail=f"Reaction {id} not found")
    return


@router.delete("/{id}")
async def delete_reaction_command(id: str, db_context:  db_context, current_user: current_user) -> None:
    if (await db_context.reactions.find_one_and_delete({"_id": ObjectId(id), "created_by": current_user.id})) is None:
        raise HTTPException(status_code=404, detail=f"Reaction {id} not found")

    return
