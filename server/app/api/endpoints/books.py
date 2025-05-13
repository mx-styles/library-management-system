from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from sqlalchemy import or_

from ...db.database import get_db
from ...db.models import Book, User
from ...schemas.book import Book as BookSchema, BookCreate, BookSearch
from ...core.security import get_current_active_user

router = APIRouter()

@router.get("/", response_model=List[BookSchema])
def get_books(
    query: str = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    books = db.query(Book)
    
    if query:
        books = books.filter(
            or_(
                Book.title.ilike(f"%{query}%"),
                Book.author.ilike(f"%{query}%"),
                Book.genre.ilike(f"%{query}%")
            )
        )
    
    return books.all()

@router.get("/{book_id}", response_model=BookSchema)
def get_book(
    book_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    book = db.query(Book).filter(Book.id == book_id).first()
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    return book

@router.post("/", response_model=BookSchema)
def create_book(
    book: BookCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    db_book = Book(
        title=book.title,
        author=book.author,
        genre=book.genre,
        available_copies=book.available_copies,
        total_copies=book.total_copies
    )
    db.add(db_book)
    db.commit()
    db.refresh(db_book)
    return db_book
