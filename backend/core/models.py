from django.contrib.auth.models import AbstractUser
from django.db import models
from django.conf import settings
from .constants import UserRole


class User(AbstractUser):
    role = models.CharField(
        max_length=20,
        choices=UserRole.CHOICES,
        default=UserRole.CUSTOMER,
    )
    is_vendor=models.BooleanField(default=False)

    def is_customer(self):
        return self.role == UserRole.CUSTOMER

    def is_staff_member(self):
        return self.role == UserRole.STAFF

    def is_admin_user(self):
        return self.role == UserRole.ADMIN

    @property
    def is_bookstore_staff(self):
        return self.role in (UserRole.STAFF, UserRole.ADMIN) or self.is_superuser

class HostRequest(models.Model):
    UserStatus=(
            ('approved',"Approved"),
            ('rejected',"Rejected"),
            ('pending',"Pending"),
        )
    user=models.ForeignKey(settings.AUTH_USER_MODEL,on_delete=models.CASCADE,related_name="lecturer_request",blank=True,null=True)
    full_name=models.CharField(max_length=100)
    status=models.CharField(max_length=20,choices=UserStatus,default="pending")
    phone_number=models.IntegerField(max_length=15),
    faculty=models.TextField(max_length=100)
    department=models.TextField(max_length=100)
    declined_reason=models.TextField(blank=True,null=True)
    id_document=models.FileField(upload_to='lecturer/')
    
    def __str___(self):
        return self.full_name