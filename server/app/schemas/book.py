from pydantic import BaseModel
from typing import Optional

class BookBase(BaseModel):
    title: str
    author: str
    genre: str
    available_copies: int
    total_copies: int

class BookCreate(BookBase):
    pass

class Book(BookBase):
    id: int

    model_config = {
        "from_attributes": True
    }

class BookSearch(BaseModel):
    query: Optional[str] = None
