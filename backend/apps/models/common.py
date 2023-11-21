from dataclasses import Field
from typing import Annotated
from pydantic import BaseModel, BeforeValidator


PyObjectId = Annotated[str, BeforeValidator(str)]


class PaginationQuery:
    def __init__(self, page_index: int = 0, page_size: int = 10, order_by: str = "_id", is_asc: bool = True):
        self.page_index = page_index
        self.page_size = page_size
        self.order_by = order_by
        self.is_asc = is_asc
        self.skip = page_index*page_size


class PaginationDto:
    def __init__(self, records, total: int = 0):
        self.records = records
        self.total = total
