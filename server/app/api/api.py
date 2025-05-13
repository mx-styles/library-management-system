from fastapi import APIRouter

from .endpoints import auth, books, borrow, admin

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["authentication"])
api_router.include_router(books.router, prefix="/books", tags=["books"])
api_router.include_router(borrow.router, prefix="/borrow", tags=["borrow"])
api_router.include_router(admin.router, prefix="/admin", tags=["admin"])
