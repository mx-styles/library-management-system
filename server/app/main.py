from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .api.api import api_router
from .core.config import settings
from .db.database import engine
from .db import models
from .db.migrations import run_migrations

# Create database tables
models.Base.metadata.create_all(bind=engine)

# Run migrations
run_migrations()

app = FastAPI(title=settings.PROJECT_NAME)

# Set up CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API router
app.include_router(api_router, prefix=settings.API_V1_STR)

# Add initial data
@app.on_event("startup")
async def startup_event():
    from sqlalchemy.orm import Session
    from .db.database import SessionLocal
    from .db.models import Book, User
    from .core.security import get_password_hash

    db = SessionLocal()

    # Check if we need to add initial data
    if db.query(Book).count() == 0:
        initial_books = [
            {
                'title': 'To Kill a Mockingbird',
                'author': 'Harper Lee',
                'genre': 'Fiction',
                'available_copies': 3,
                'total_copies': 3
            },
            {
                'title': '1984',
                'author': 'George Orwell',
                'genre': 'Science Fiction',
                'available_copies': 2,
                'total_copies': 2
            },
            {
                'title': 'The Great Gatsby',
                'author': 'F. Scott Fitzgerald',
                'genre': 'Fiction',
                'available_copies': 1,
                'total_copies': 1
            },
            {
                'title': 'Pride and Prejudice',
                'author': 'Jane Austen',
                'genre': 'Romance',
                'available_copies': 2,
                'total_copies': 2
            },
            {
                'title': 'The Hobbit',
                'author': 'J.R.R. Tolkien',
                'genre': 'Fantasy',
                'available_copies': 2,
                'total_copies': 2
            }
        ]

        for book_data in initial_books:
            book = Book(**book_data)
            db.add(book)

        # Create a test user
        if db.query(User).count() == 0:
            test_user = User(
                username="testuser",
                email="test@example.com",
                hashed_password=get_password_hash("password123"),
                is_admin=True
            )
            db.add(test_user)

        db.commit()

    db.close()

@app.get("/")
def read_root():
    return {"message": "Welcome to the Library Management System API"}
