from decimal import Decimal

from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from catalog.models import Book, Category
from core.constants import UserRole
from orders.models import Cart, Order
from orders.services import checkout, get_or_create_cart

User = get_user_model()


class OrderSecurityTests(APITestCase):
    def setUp(self):
        self.category = Category.objects.create(name="Fiction", slug="fiction")
        self.book = Book.objects.create(
            title="Novel",
            slug="novel",
            isbn="1111111111",
            description="A novel",
            price=Decimal("20.00"),
            stock=5,
            category=self.category,
        )
        self.user_a = User.objects.create_user(
            username="usera", email="a@example.com", password="pass12345"
        )
        self.user_b = User.objects.create_user(
            username="userb", email="b@example.com", password="pass12345"
        )

    def _place_order(self, user):
        cart = get_or_create_cart(user)
        cart.items.create(book=self.book, quantity=1)
        return checkout(user, "123 Main St, City, Country")

    def test_user_cannot_view_other_users_order(self):
        order_b = self._place_order(self.user_b)
        self.client.force_authenticate(user=self.user_a)
        response = self.client.get(reverse("order-detail", kwargs={"pk": order_b.pk}))
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_user_cannot_modify_other_users_cart(self):
        cart_b = get_or_create_cart(self.user_b)
        item = cart_b.items.create(book=self.book, quantity=1)
        self.client.force_authenticate(user=self.user_a)
        response = self.client.delete(
            reverse("cart-item-delete", kwargs={"item_id": item.pk})
        )
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_checkout_reduces_stock(self):
        self._place_order(self.user_a)
        self.book.refresh_from_db()
        self.assertEqual(self.book.stock, 4)

    def test_checkout_creates_order(self):
        order = self._place_order(self.user_a)
        self.assertEqual(order.total, Decimal("20.00"))
        self.assertEqual(Order.objects.filter(user=self.user_a).count(), 1)
