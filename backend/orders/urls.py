from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import CartItemView, CartMeView, CheckoutView, OrderViewSet

router = DefaultRouter()
router.register("orders", OrderViewSet, basename="order")

urlpatterns = [
    path("cart/me/", CartMeView.as_view(), name="cart-me"),
    path("cart/me/items/", CartItemView.as_view(), name="cart-item-add"),
    path("cart/me/items/<int:item_id>/", CartItemView.as_view(), name="cart-item-delete"),
    path("orders/checkout/", CheckoutView.as_view(), name="checkout"),
    path("", include(router.urls)),
]
