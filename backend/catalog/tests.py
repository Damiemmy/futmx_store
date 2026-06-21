from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from catalog.models import Book, Category
from core.constants import UserRole

User = get_user_model()


class CatalogSecurityTests(APITestCase):
    def setUp(self):
        self.category = Category.objects.create(name="Fiction", slug="fiction")
        self.book = Book.objects.create(
            title="Test Book",
            slug="test-book",
            isbn="1234567890",
            description="A test book",
            price="19.99",
            stock=10,
            category=self.category,
        )
        self.customer = User.objects.create_user(
            username="customer",
            email="c@example.com",
            password="pass12345",
            role=UserRole.CUSTOMER,
        )

    def test_customer_cannot_create_book(self):
        self.client.force_authenticate(user=self.customer)
        response = self.client.post(
            reverse("book-list"),
            {
                "title": "New Book",
                "slug": "new-book",
                "isbn": "9876543210",
                "description": "Desc",
                "price": "9.99",
                "stock": 5,
                "category": self.category.id,
            },
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_public_can_list_books(self):
        response = self.client.get(reverse("book-list"))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
