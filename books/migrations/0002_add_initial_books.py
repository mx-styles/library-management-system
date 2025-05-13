from django.db import migrations

def add_initial_books(apps, schema_editor):
    Book = apps.get_model('books', 'Book')
    
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
        Book.objects.create(**book_data)

def remove_initial_books(apps, schema_editor):
    Book = apps.get_model('books', 'Book')
    Book.objects.all().delete()

class Migration(migrations.Migration):
    dependencies = [
        ('books', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(add_initial_books, remove_initial_books),
    ] 