from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from .book import Book
from .user import User

class BorrowRecordBase(BaseModel):
    book_id: int

class BorrowRecordCreate(BorrowRecordBase):
    pass

class BorrowRecord(BorrowRecordBase):
    id: int
    user_id: int
    borrow_date: datetime
    return_date: Optional[datetime] = None
    is_returned: bool

    model_config = {
        "from_attributes": True
    }

class BorrowRecordDetail(BorrowRecord):
    book: Book
    due_date: datetime
