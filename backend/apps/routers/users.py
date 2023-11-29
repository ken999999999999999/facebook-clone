from bson import ObjectId
from fastapi import APIRouter, Body, Depends
from apps.dependencies.auth import authorize, create_firebase_user
from apps.dependencies.user import current_user
from apps.dependencies.db import db_context
from apps.models.common import PaginationQuery
from apps.models.users.dto import CreateUserCommand, UserDto
from apps.models.users.validators import create_user_validator
from apps.models.users.model import User

router = APIRouter(
    prefix="/users",
    tags=["users"]
)


@router.post("/sign-up/", dependencies=[Depends(create_user_validator)])
async def create_user_command(db_context: db_context, command: CreateUserCommand = Body(...)) -> None:
    firebase_user = await create_firebase_user(password=command.password, email=command.email, display_name=command.display_name)
    user = User(uid=firebase_user.uid, **
                command.model_dump(exclude=["password"])).model_dump(exclude=['id'])
    await db_context.users.insert_one(user)

    return


@router.get("/", dependencies=[Depends(authorize)])
async def get_current_user_query(current_user: current_user) -> UserDto:
    return UserDto(**current_user.model_dump())


@router.get("/list", dependencies=[Depends(authorize)])
async def get_users_query(current_user: current_user, pagination: PaginationQuery = Depends()):
    filters = {"$or": [
        {"created_by": current_user.id},
        {"receiver_id": current_user.id},
    ], "accepted_on": {"$ne": None}}

    friends_query = await db_context.relationships.find(filters).to_list(None)

    friends = [record["receiver_id"] if record["created_by"] ==
               current_user.id else record["created_by"] for record in friends_query]
    
    friends =[ObjectId(friend) for friend in friends]

    friends.append(ObjectId(current_user.id))
    
    query = await db_context.users.aggregate([
        {"$match": { "_id": {"$nin": friends}}},
        {"$addFields": {"id": {"$toString": "$_id"} }},
        {"$sort": {pagination.order_by: 1 if pagination.is_asc else -1}},
        {"$skip": pagination.skip},
        {"$limit": pagination.page_size}
    ]).to_list(None)

    return [UserDto(**record) for record in query]

