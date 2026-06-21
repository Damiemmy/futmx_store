from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

User = get_user_model()


class AuthTests(APITestCase):
    def test_register_user(self):
        response = self.client.post(
            reverse("register"),
            {
                "username": "reader1",
                "email": "reader1@example.com",
                "password": "securepass123",
            },
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(User.objects.filter(username="reader1").exists())

    def test_jwt_login_returns_user_data(self):
        User.objects.create_user(
            username="reader2",
            email="reader2@example.com",
            password="securepass123",
        )
        response = self.client.post(
            reverse("login"),
            {"username": "reader2", "password": "securepass123"},
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access", response.data)
        self.assertIn("refresh", response.data)
        self.assertIn("user", response.data)
        self.assertEqual(response.data["user"]["username"], "reader2")

    def test_expired_token_rejected(self):
        self.client.credentials(HTTP_AUTHORIZATION="Bearer invalidtoken")
        response = self.client.get("/api/auth/me/")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertIn("detail", response.data)
