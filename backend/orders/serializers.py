from rest_framework import serializers

from catalog.models import Book
from catalog.serializers import BookListSerializer

from .models import Cart, CartItem, Order, OrderItem


class CartItemSerializer(serializers.ModelSerializer):
    book = BookListSerializer(read_only=True)
    book_id = serializers.PrimaryKeyRelatedField(
        queryset=Book.objects.filter(is_active=True),
        source="book",
        write_only=True,
    )
    subtotal = serializers.SerializerMethodField()

    class Meta:
        model = CartItem
        fields = ("id", "book", "book_id", "quantity", "subtotal")

    def get_subtotal(self, obj):
        return obj.subtotal

    def validate_quantity(self, value):
        if value < 1:
            raise serializers.ValidationError("Quantity must be at least 1.")
        return value

    def validate(self, attrs):
        book = attrs.get("book") or getattr(self.instance, "book", None)
        quantity = attrs.get("quantity", getattr(self.instance, "quantity", 1))
        if book and quantity > book.stock:
            raise serializers.ValidationError(
                {"quantity": f"Only {book.stock} items available in stock."}
            )
        return attrs


class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)
    total = serializers.SerializerMethodField()

    class Meta:
        model = Cart
        fields = ("id", "items", "total", "updated_at")

    def get_total(self, obj):
        return obj.total


class OrderItemSerializer(serializers.ModelSerializer):
    book = BookListSerializer(read_only=True)
    subtotal = serializers.SerializerMethodField()

    class Meta:
        model = OrderItem
        fields = ("id", "book", "quantity", "price", "subtotal")

    def get_subtotal(self, obj):
        return obj.subtotal


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = (
            "id",
            "status",
            "total",
            "shipping_address",
            "items",
            "created_at",
        )
        read_only_fields = ("id", "status", "total", "created_at")


class CheckoutSerializer(serializers.Serializer):
    shipping_address = serializers.CharField(min_length=10)
