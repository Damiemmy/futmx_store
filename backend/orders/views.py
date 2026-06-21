from rest_framework import status, viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from core.permissions import IsOwnerOrStaff

from .models import CartItem, Order
from .serializers import (
    CartItemSerializer,
    CartSerializer,
    CheckoutSerializer,
    OrderSerializer,
)
from .services import checkout, get_or_create_cart


class CartMeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        cart = get_or_create_cart(request.user)
        serializer = CartSerializer(cart)
        return Response(serializer.data)


class CartItemView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        cart = get_or_create_cart(request.user)
        book_id = request.data.get("book_id")
        quantity = int(request.data.get("quantity", 1))

        existing = cart.items.filter(book_id=book_id).first()
        if existing:
            existing.quantity = quantity
            serializer = CartItemSerializer(existing, data={"quantity": quantity}, partial=True)
        else:
            serializer = CartItemSerializer(
                data={"book_id": book_id, "quantity": quantity}
            )

        serializer.is_valid(raise_exception=True)
        if existing:
            serializer.save()
            item = existing
        else:
            item = serializer.save(cart=cart)

        return Response(CartItemSerializer(item).data, status=status.HTTP_200_OK)

    def delete(self, request, item_id):
        cart = get_or_create_cart(request.user)
        try:
            item = cart.items.get(pk=item_id)
        except CartItem.DoesNotExist:
            return Response(
                {"detail": "Not found.", "code": "not_found"},
                status=status.HTTP_404_NOT_FOUND,
            )
        item.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class CheckoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = CheckoutSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        order = checkout(
            request.user,
            serializer.validated_data["shipping_address"],
        )
        return Response(
            OrderSerializer(order).data,
            status=status.HTTP_201_CREATED,
        )


class OrderViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated, IsOwnerOrStaff]

    def get_queryset(self):
        qs = Order.objects.select_related("user").prefetch_related(
            "items__book", "items__book__category", "items__book__authors"
        )
        if self.request.user.is_bookstore_staff:
            return qs
        return qs.filter(user=self.request.user)
