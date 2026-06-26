from django.db import models
from django.conf import settings


class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=120, unique=True)

    class Meta:
        verbose_name_plural = "categories"
        ordering = ["name"]

    def __str__(self):
        return self.name


class Author(models.Model):
    name = models.CharField(max_length=200)
    bio = models.TextField(blank=True)

    class Meta:
        ordering = ["name"]

    def __str__(self):
        return self.name


class Book(models.Model):
    title = models.CharField(max_length=255)
    slug = models.SlugField(max_length=280, unique=True)
    isbn = models.CharField(max_length=20, unique=True)
    description = models.TextField()
    pdf=models.FileField(upload_to="books/pdfs/",default='django_2.jpg')
    is_paid=models.BooleanField(default=False)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.PositiveIntegerField(default=0)
    cover_image = models.ImageField(upload_to="books/covers/", blank=True, null=True)
    category = models.ForeignKey(
        Category, on_delete=models.SET_NULL, null=True, related_name="books"
    )
    authors = models.ManyToManyField(Author, related_name="books", blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(
    settings.AUTH_USER_MODEL,
    on_delete=models.CASCADE,
    related_name="books_created",blank=True,null=True
    )

    class Meta:
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["slug"]),
            models.Index(fields=["isbn"]),
            models.Index(fields=["is_active"]),
        ]

    def __str__(self):
        return self.title
