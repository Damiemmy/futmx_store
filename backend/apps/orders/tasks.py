from celery import shared_task
from django.core.mail import send_mail
from django.conf import settings

from .models import Order


@shared_task
def send_order_confirmation_email(order_id):
    order = Order.objects.select_related("user").prefetch_related("items__book").get(
        pk=order_id
    )
    items_text = "\n".join(
        f"- {item.book.title} x {item.quantity} @ ${item.price}"
        for item in order.items.all()
    )
    send_mail(
        subject=f"Order Confirmation #{order.id}",
        message=(
            f"Hi {order.user.username},\n\n"
            f"Thank you for your order!\n\n"
            f"Order total: ${order.total}\n"
            f"Shipping to: {order.shipping_address}\n\n"
            f"Items:\n{items_text}"
        ),
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[order.user.email],
        fail_silently=True,
    )
