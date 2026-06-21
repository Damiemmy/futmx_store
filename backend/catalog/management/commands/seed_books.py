from decimal import Decimal

from django.core.management.base import BaseCommand

from catalog.models import Author, Book, Category


BOOKS = [
    {
        "title": "The Midnight Library",
        "slug": "the-midnight-library",
        "isbn": "9780525559474",
        "description": "Between life and death there is a library, and within that library, the shelves go on forever.",
        "price": Decimal("18.99"),
        "stock": 25,
        "category": "fiction",
        "authors": ["Matt Haig"],
    },
    {
        "title": "Atomic Habits",
        "slug": "atomic-habits",
        "isbn": "9780735211292",
        "description": "Tiny changes, remarkable results — an easy and proven way to build good habits.",
        "price": Decimal("16.99"),
        "stock": 40,
        "category": "non-fiction",
        "authors": ["James Clear"],
    },
    {
        "title": "Project Hail Mary",
        "slug": "project-hail-mary",
        "isbn": "9780593135204",
        "description": "A lone astronaut must save the earth from disaster in this propulsive science fiction adventure.",
        "price": Decimal("17.99"),
        "stock": 30,
        "category": "science-fiction",
        "authors": ["Andy Weir"],
    },
    {
        "title": "The Song of Achilles",
        "slug": "the-song-of-achilles",
        "isbn": "9780062060624",
        "description": "A tale of gods, kings, immortal fame and the human heart.",
        "price": Decimal("15.99"),
        "stock": 20,
        "category": "fiction",
        "authors": ["Madeline Miller"],
    },
]


class Command(BaseCommand):
    help = "Seed the database with sample books"

    def handle(self, *args, **options):
        categories = {
            "fiction": Category.objects.get_or_create(
                name="Fiction", defaults={"slug": "fiction"}
            )[0],
            "non-fiction": Category.objects.get_or_create(
                name="Non-Fiction", defaults={"slug": "non-fiction"}
            )[0],
            "science-fiction": Category.objects.get_or_create(
                name="Science Fiction", defaults={"slug": "science-fiction"}
            )[0],
        }

        for book_data in BOOKS:
            author_names = book_data.pop("authors")
            category_slug = book_data.pop("category")
            book, created = Book.objects.get_or_create(
                isbn=book_data["isbn"],
                defaults={
                    **book_data,
                    "category": categories[category_slug],
                },
            )
            for name in author_names:
                author, _ = Author.objects.get_or_create(name=name)
                book.authors.add(author)
            action = "Created" if created else "Updated"
            self.stdout.write(f"{action}: {book.title}")

        self.stdout.write(self.style.SUCCESS("Seed complete."))
