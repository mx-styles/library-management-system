from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime, timedelta

from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    is_active = Column(Boolean, default=True)
    is_admin = Column(Boolean, default=False)

    borrow_records = relationship("BorrowRecord", back_populates="user")

class Book(Base):
    __tablename__ = "books"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    author = Column(String, index=True)
    genre = Column(String, index=True)
    available_copies = Column(Integer, default=1)
    total_copies = Column(Integer, default=1)

    borrow_records = relationship("BorrowRecord", back_populates="book")

    def is_available(self):
        return self.available_copies > 0

class BorrowRecord(Base):
    __tablename__ = "borrow_records"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    book_id = Column(Integer, ForeignKey("books.id"))
    borrow_date = Column(DateTime, default=datetime.utcnow)
    return_date = Column(DateTime, nullable=True)
    is_returned = Column(Boolean, default=False)

    user = relationship("User", back_populates="borrow_records")
    book = relationship("Book", back_populates="borrow_records")

    @property
    def due_date(self):
        """Calculate due date as 14 days after borrowing date"""
        return self.borrow_date + timedelta(days=14)
