from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from ...db.database import get_db
from ...db.models import Book, User, BorrowRecord
from ...schemas.book import Book as BookSchema, BookCreate
from ...schemas.user import User as UserSchema, UserCreate
from ...schemas.borrow import BorrowRecordDetail
from ...core.security import get_current_active_user, get_password_hash

router = APIRouter()

# Admin middleware to check if user is admin
async def get_current_admin_user(current_user: User = Depends(get_current_active_user)):
    if not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access admin resources"
        )
    return current_user

# Admin book management endpoints
@router.get("/books", response_model=List[BookSchema])
def get_all_books(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    books = db.query(Book).all()
    return books

@router.post("/books", response_model=BookSchema)
def create_book(
    book: BookCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
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

@router.put("/books/{book_id}", response_model=BookSchema)
def update_book(
    book_id: int,
    book: BookCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    db_book = db.query(Book).filter(Book.id == book_id).first()
    if not db_book:
        raise HTTPException(status_code=404, detail="Book not found")

    db_book.title = book.title
    db_book.author = book.author
    db_book.genre = book.genre
    db_book.available_copies = book.available_copies
    db_book.total_copies = book.total_copies

    db.commit()
    db.refresh(db_book)
    return db_book

@router.delete("/books/{book_id}", response_model=BookSchema)
def delete_book(
    book_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    db_book = db.query(Book).filter(Book.id == book_id).first()
    if not db_book:
        raise HTTPException(status_code=404, detail="Book not found")

    # Check if book has active borrows
    active_borrows = db.query(BorrowRecord).filter(
        BorrowRecord.book_id == book_id,
        BorrowRecord.is_returned == False
    ).count()

    if active_borrows > 0:
        raise HTTPException(
            status_code=400,
            detail="Cannot delete book with active borrows"
        )

    db.delete(db_book)
    db.commit()
    return db_book

# Admin user management endpoints
@router.get("/users", response_model=List[UserSchema])
def get_all_users(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    users = db.query(User).all()
    return users

@router.get("/users/{user_id}", response_model=UserSchema)
def get_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.put("/users/{user_id}/admin", response_model=UserSchema)
def toggle_admin_status(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Toggle admin status
    user.is_admin = not user.is_admin

    db.commit()
    db.refresh(user)
    return user

# Create admin user endpoint
@router.post("/create-admin", response_model=UserSchema)
def create_admin_user(
    user_data: UserCreate,
    db: Session = Depends(get_db)
):
    # Check if username already exists
    db_user = db.query(User).filter(User.username == user_data.username).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Username already registered")

    # Check if email already exists
    db_email = db.query(User).filter(User.email == user_data.email).first()
    if db_email:
        raise HTTPException(status_code=400, detail="Email already registered")

    # Create new admin user
    hashed_password = get_password_hash(user_data.password)
    db_user = User(
        username=user_data.username,
        email=user_data.email,
        hashed_password=hashed_password,
        is_admin=True  # Set as admin
    )

    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    return db_user

# Admin borrow management endpoints
@router.get("/borrows", response_model=List[BorrowRecordDetail])
def get_all_borrows(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    borrows = db.query(BorrowRecord).all()
    return borrows
