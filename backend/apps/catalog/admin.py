from django.contrib import admin

from .models import Author, Book, Category


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ("name", "slug")
    prepopulated_fields = {"slug": ("name",)}


@admin.register(Author)
class AuthorAdmin(admin.ModelAdmin):
    list_display = ("name",)
    search_fields = ("name",)


@admin.register(Book)
class BookAdmin(admin.ModelAdmin):
    list_display = ("title", "isbn", "price", "stock", "is_active", "category")
    list_filter = ("is_active", "category")
    search_fields = ("title", "isbn")
    prepopulated_fields = {"slug": ("title",)}
    filter_horizontal = ("authors",)
