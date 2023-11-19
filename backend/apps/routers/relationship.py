from datetime import datetime
from bson import ObjectId
from fastapi import APIRouter, Body, Depends,   HTTPException
from apps.dependencies.auth import authorize
from apps.dependencies.user import current_user
from apps.dependencies.db import db_context
from apps.models.relationships.dto import CreateRelationshipCommand
from apps.models.relationships.enum import RelationshipEnum
from apps.models.relationships.model import Relationship
from apps.models.relationships.validatior import create_relationship_validator


router = APIRouter(
    prefix="/relationships",
    tags=["relationships"],
    responses={404: {"description": "Not found"}},
    dependencies=[Depends(authorize)]
)


@router.get("/")
async def get_relationships_with_pagination_query(db_context: db_context, current_user: current_user,):
    return


@router.post("/", dependencies=[Depends(create_relationship_validator)])
async def create_relationship_command(db_context:  db_context, current_user: current_user,  command: CreateRelationshipCommand = Body(...)) -> str:
    relationship = Relationship(**command.model_dump(),
                                created_by=current_user.id, relationship=RelationshipEnum.friend).model_dump(exclude=["id"])

    return str((await db_context.relationships.insert_one(relationship)).inserted_id)


@router.put("/{id}/accept")
async def accept_relationship_command(id: str, db_context:  db_context, current_user: current_user) -> None:
    if (await db_context.relationships.find_one_and_update({"_id": ObjectId(id), "receiver_id": current_user.id, "accepted_on": None}, {"$set": {"accepted_on": datetime.now()}})) is None:
        raise HTTPException(
            status_code=404, detail=f"Relationship {id} not found")
    return


@router.delete("/{id}")
async def delete_relationship_command(id: str, db_context:  db_context, current_user: current_user) -> None:
    if (await db_context.relationships.find_one_and_delete({"_id": ObjectId(id), "$or": [{"created_by": current_user.id}, {"receiver_id": current_user.id}]})) is None:
        raise HTTPException(
            status_code=404, detail=f"Relationship {id} not found")

    return
