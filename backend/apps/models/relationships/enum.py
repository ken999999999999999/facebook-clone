from enum import Enum
from fastapi import FastAPI


class RelationshipEnum(str, Enum):
    friend = "friend"
    family = "family"
