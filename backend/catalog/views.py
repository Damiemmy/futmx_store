from rest_framework import viewsets
from rest_framework.permissions import AllowAny

from core.permissions import ReadOnlyOrRole

from .filters import BookFilter
from .models import Author, Book, Category
from .serializers import (
    AuthorSerializer,
    BookDetailSerializer,
    BookListSerializer,
    BookWriteSerializer,
    CategorySerializer,
)


class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]
    lookup_field = "slug"


class AuthorViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Author.objects.all()
    serializer_class = AuthorSerializer
    permission_classes = [AllowAny]


class BookViewSet(viewsets.ModelViewSet):
    queryset = Book.objects.filter(is_active=True).select_related("category").prefetch_related("authors")
    permission_classes = []
    filterset_class = BookFilter
    search_fields = ["title", "isbn", "authors__name", "description"]
    ordering_fields = ["price", "created_at", "title"]
    lookup_field = "slug"

    def get_serializer_class(self):
        if self.action == "retrieve":
            return BookDetailSerializer
        if self.action in ("create", "update", "partial_update"):
            return BookWriteSerializer
        return BookListSerializer

    # def get_queryset(self):
    #     qs = Book.objects.select_related("category").prefetch_related("authors")
    #     if self.request.user.is_authenticated and self.request.user.is_bookstore_staff:
    #         return qs
    #     return qs.filter(is_active=True)
