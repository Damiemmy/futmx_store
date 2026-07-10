from decimal import Decimal

from django.db import transaction
from rest_framework.exceptions import ValidationError

from apps.catalog.models import Book

from .models import Cart, Order, OrderItem


def get_or_create_cart(user):
    cart, _ = Cart.objects.get_or_create(user=user)
    return cart


@transaction.atomic
def checkout(user, shipping_address):
    cart = get_or_create_cart(user)
    items = list(cart.items.select_related("book").all())

    if not items:
        raise ValidationError("Your cart is empty.")

    total = Decimal("0.00")
    book_ids = [item.book_id for item in items]
    books = {b.id: b for b in Book.objects.select_for_update().filter(id__in=book_ids)}

    for item in items:
        book = books.get(item.book_id)
        if not book or not book.is_active:
            raise ValidationError(f"{item.book.title} is no longer available.")
        if item.quantity > book.stock:
            raise ValidationError(f"Insufficient stock for {book.title}.")
        total += book.price * item.quantity

    order = Order.objects.create(
        user=user,
        total=total,
        shipping_address=shipping_address,
        status=Order.STATUS_PAID,
    )

    for item in items:
        book = books[item.book_id]
        OrderItem.objects.create(
            order=order,
            book=book,
            quantity=item.quantity,
            price=book.price,
        )
        book.stock -= item.quantity
        book.save(update_fields=["stock"])

    cart.items.all().delete()

    from .tasks import send_order_confirmation_email

    send_order_confirmation_email.delay(order.id)

    return order
