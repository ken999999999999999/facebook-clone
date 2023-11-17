from typing import Annotated
from fastapi import Depends
from apps.dependencies.auth import authorize
from apps.models.users.dto import ViewUserDto


current_user = Annotated[ViewUserDto, Depends(authorize)]
