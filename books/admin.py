from django.contrib import admin
from .models import Book, BorrowRecord

@admin.register(Book)
class BookAdmin(admin.ModelAdmin):
    list_display = ('title', 'author', 'genre', 'available_copies', 'total_copies')
    search_fields = ('title', 'author', 'genre')
    list_filter = ('genre',)

@admin.register(BorrowRecord)
class BorrowRecordAdmin(admin.ModelAdmin):
    list_display = ('user', 'book', 'borrow_date', 'return_date', 'is_returned')
    list_filter = ('is_returned', 'borrow_date')
    search_fields = ('user__username', 'book__title')
