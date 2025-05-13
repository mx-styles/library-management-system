from django.db import models
from django.contrib.auth.models import User

class Book(models.Model):
    title = models.CharField(max_length=200)
    author = models.CharField(max_length=100)
    genre = models.CharField(max_length=100)
    available_copies = models.IntegerField(default=1)
    total_copies = models.IntegerField(default=1)

    def __str__(self):
        return f"{self.title} by {self.author}"

    def is_available(self):
        return self.available_copies > 0

class BorrowRecord(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    book = models.ForeignKey(Book, on_delete=models.CASCADE)
    borrow_date = models.DateTimeField(auto_now_add=True)
    return_date = models.DateTimeField(null=True, blank=True)
    is_returned = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.user.username} borrowed {self.book.title} on {self.borrow_date}"

    @property
    def due_date(self):
        """Calculate due date as 14 days after borrowing date"""
        from datetime import timedelta
        return self.borrow_date + timedelta(days=14)
