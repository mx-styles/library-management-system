from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.contrib.auth.models import User
from django.contrib.auth.forms import UserCreationForm
from .models import Book, BorrowRecord
from django.db.models import Q
from django.utils import timezone

def home(request):
    borrowed_books = None
    if request.user.is_authenticated:
        borrowed_books = BorrowRecord.objects.filter(
            user=request.user,
            is_returned=False
        )
    return render(request, 'books/home.html', {'borrowed_books': borrowed_books})

def search_books(request):
    query = request.GET.get('q', '')
    books = Book.objects.all()

    if query:
        books = books.filter(
            Q(title__icontains=query) |
            Q(author__icontains=query) |
            Q(genre__icontains=query)
        )

    context = {
        'books': books,
        'query': query
    }
    return render(request, 'books/search.html', context)

@login_required
def borrow_book(request, book_id):
    book = get_object_or_404(Book, id=book_id)

    if book.is_available():
        BorrowRecord.objects.create(
            user=request.user,
            book=book
        )
        book.available_copies -= 1
        book.save()
        messages.success(request, f'Successfully borrowed {book.title}')
    else:
        messages.error(request, 'This book is not available for borrowing')

    return redirect('search_books')

@login_required
def return_book(request, borrow_id):
    borrow_record = get_object_or_404(BorrowRecord, id=borrow_id, user=request.user)

    if not borrow_record.is_returned:
        borrow_record.is_returned = True
        borrow_record.return_date = timezone.now()
        borrow_record.save()

        book = borrow_record.book
        book.available_copies += 1
        book.save()

        messages.success(request, f'Successfully returned {book.title}')

    return redirect('view_borrowed_books')

@login_required
def view_borrowed_books(request):
    # Get all borrow records for the user, both returned and not returned
    # Order by is_returned first (False values first), then by borrow date (newest first)
    borrowed_books = BorrowRecord.objects.filter(
        user=request.user
    ).order_by('is_returned', '-borrow_date')  # Show active borrows first, then by borrow date

    # Check if user has any active (non-returned) books
    has_active_books = BorrowRecord.objects.filter(
        user=request.user,
        is_returned=False
    ).exists()

    return render(request, 'books/borrowed_books.html', {
        'borrowed_books': borrowed_books,
        'has_active_books': has_active_books
    })

def register(request):
    if request.method == 'POST':
        form = UserCreationForm(request.POST)
        if form.is_valid():
            form.save()
            messages.success(request, 'Account created successfully! Please log in.')
            return redirect('login')
    else:
        form = UserCreationForm()
    return render(request, 'books/register.html', {'form': form})
