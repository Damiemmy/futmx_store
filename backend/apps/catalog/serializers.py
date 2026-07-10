from rest_framework import serializers

from .models import Author, Book, Category


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ("id", "name", "slug")


class AuthorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Author
        fields = ("id", "name", "bio")


class BookListSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    authors = AuthorSerializer(many=True, read_only=True)

    class Meta:
        model = Book
        fields = (
            "id",
            "title",
            "slug",
            "isbn",
            "pdf",
            "is_paid",
            "price",
            "stock",
            "cover_image",
            "category",
            "authors",
            "is_active",
        )


class BookDetailSerializer(BookListSerializer):
    class Meta(BookListSerializer.Meta):
        fields = BookListSerializer.Meta.fields + ("description", "created_at")


class BookWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Book
        fields = (
            "title",
            "slug",
            "isbn",
            "pdf",
            "description",
            "price",
            "stock",
            "cover_image",
            "category",
            "authors",
            "is_active",
        )
