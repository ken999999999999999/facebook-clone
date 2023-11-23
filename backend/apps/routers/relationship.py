from datetime import datetime
from bson import ObjectId
from fastapi import APIRouter, Body, Depends,   HTTPException
from apps.dependencies.auth import authorize
from apps.dependencies.user import current_user
from apps.dependencies.db import db_context
from apps.models.common import PaginationDto, PaginationQuery
from apps.models.relationships.dto import CreateRelationshipCommand, RelationshipDto
from apps.models.relationships.enum import RelationshipEnum
from apps.models.relationships.model import Relationship
from apps.models.relationships.validator import create_relationship_validator


router = APIRouter(
    prefix="/relationships",
    tags=["relationships"],
    dependencies=[Depends(authorize)]
)


@router.get("/")
async def get_relationships_with_pagination_query(db_context: db_context, current_user: current_user, pagination: PaginationQuery = Depends()):

    filters = {"$or": [
        {"created_by": current_user.id},
        {"receiver_id": current_user.id}
    ]}
    query = await db_context.relationships.aggregate([
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

        {"$lookup": {
            "from": "users",
            "let": {"receiver_user_id": {"$toObjectId": "$receiver_id"}},
            "pipeline": [
                {"$match": {"$expr": {"$eq": ["$_id", "$$receiver_user_id"]}}},
                {"$addFields": {"id": {"$toString": "$_id"}}}
            ],
            "as": "receivers"
        }},

        {"$addFields": {
            "creator": {"$arrayElemAt": ["$creators", 0]},
            "receiver": {"$arrayElemAt": ["$receivers", 0]},
            "id": {"$toString": "$_id"}
        }},
        {"$sort": {pagination.order_by: 1 if pagination.is_asc else -1}},
        {"$skip": pagination.skip},
        {"$limit": pagination.page_size}
    ]).to_list(None)

    return PaginationDto(
        [RelationshipDto(**record) for record in query],
        await db_context.relationships.count_documents(filters)
    )


@router.post("/", dependencies=[Depends(create_relationship_validator)])
async def create_relationship_command(db_context:  db_context, current_user: current_user,  command: CreateRelationshipCommand = Body(...)) -> str:
    relationship = Relationship(**command.model_dump(),
                                created_by=current_user.id,
                                relationship=RelationshipEnum.friend.value).model_dump(exclude=["id"])
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
