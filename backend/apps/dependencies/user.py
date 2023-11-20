from typing import Annotated
from fastapi import Depends
from apps.dependencies.auth import authorize
from apps.models.users.model import User


current_user = Annotated[User, Depends(authorize)]
