from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime

from ...db.database import get_db
from ...db.models import BorrowRecord, Book, User
from ...schemas.borrow import BorrowRecordCreate, BorrowRecord as BorrowRecordSchema, BorrowRecordDetail
from ...core.security import get_current_active_user

router = APIRouter()

@router.get("/", response_model=List[BorrowRecordDetail])
def get_borrowed_books(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    borrow_records = db.query(BorrowRecord).filter(
        BorrowRecord.user_id == current_user.id
    ).order_by(BorrowRecord.is_returned, BorrowRecord.borrow_date.desc()).all()

    return borrow_records

@router.post("/borrow/{book_id}", response_model=BorrowRecordSchema)
def borrow_book(
    book_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    book = db.query(Book).filter(Book.id == book_id).first()
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")

    if not book.is_available():
        raise HTTPException(status_code=400, detail="Book is not available for borrowing")

    # Check if user already has an active borrow for this book
    existing_borrow = db.query(BorrowRecord).filter(
        BorrowRecord.user_id == current_user.id,
        BorrowRecord.book_id == book_id,
        BorrowRecord.is_returned == False
    ).first()

    if existing_borrow:
        raise HTTPException(
            status_code=400,
            detail="You already have a copy of this book borrowed"
        )

    borrow_record = BorrowRecord(
        user_id=current_user.id,
        book_id=book_id
    )

    book.available_copies -= 1

    db.add(borrow_record)
    db.commit()
    db.refresh(borrow_record)

    return borrow_record

@router.post("/return/{borrow_id}", response_model=BorrowRecordSchema)
def return_book(
    borrow_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    borrow_record = db.query(BorrowRecord).filter(
        BorrowRecord.id == borrow_id,
        BorrowRecord.user_id == current_user.id
    ).first()

    if not borrow_record:
        raise HTTPException(status_code=404, detail="Borrow record not found")

    if borrow_record.is_returned:
        raise HTTPException(status_code=400, detail="Book already returned")

    borrow_record.is_returned = True
    borrow_record.return_date = datetime.utcnow()

    book = db.query(Book).filter(Book.id == borrow_record.book_id).first()
    book.available_copies += 1

    db.commit()
    db.refresh(borrow_record)

    return borrow_record
