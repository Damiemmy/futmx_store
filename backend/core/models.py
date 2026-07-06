from django.contrib.auth.models import AbstractUser
from django.db import models
from django.conf import settings
from .constants import UserRole
from catalog.models import Author

class User(AbstractUser):
    class Role(models.TextChoices):
        CUSTOMER = "customer"
        LECTURER = "lecturer"
        COURSE_REP = "course_rep"
        VENDOR = "vendor"
        ADMIN = "admin"

    role = models.CharField(
        max_length=20,
        choices=Role.choices,
        default=Role.CUSTOMER
    )

    is_role_verified = models.BooleanField(default=False)
    user_message=models.TextField(blank=True,null=True)

class RoleRequest(models.Model):
    # class Status(models.TextChoices):
    #     PENDING = "pending"
    #     APPROVED = "approved"
    #     REJECTED = "rejected"

    STATUS=(
        ("pending","Pending"),
        ("approved","Approved"),
        ("rejected","Rejected"),
    )

    class RequestedRole(models.TextChoices):
        LECTURER = "lecturer"
        COURSE_REP = "course_rep"
        VENDOR = "vendor"

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    requested_role = models.CharField(max_length=20, choices=RequestedRole.choices)
    full_name = models.CharField(max_length=100)
    phone_number = models.CharField(max_length=15)
    faculty = models.CharField(max_length=100, blank=True, null=True)
    department = models.CharField(max_length=100, blank=True, null=True)
    reason = models.TextField()
    id_document = models.FileField(upload_to="role_requests/",blank=True,null=True)
    # status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING)
    status = models.CharField(max_length=20, choices=STATUS, default="pending")
    declined_reason = models.TextField(blank=True, null=True)
    

    def save(self,*args,**kwargs):
        if self.pk:
            old=RoleRequest.objects.get(pk=self.pk)

            if old.status!='approved' and self.status=="approved":
                self.user.role=self.requested_role
                self.user.is_role_verified=True
                self.user.user_message=self.declined_reason
                self.user.save()
                author_name=f"{self.user.last_name} {self.user.first_name}"
                author=Author.objects.create(name=author_name,bio=self.user.role)
                author.save()

            if old.status!='rejected' and self.status=='rejected':
                self.user.role=self.requested_role
                self.user.is_role_verified=True
                self.user.user_message=self.declined_reasons
                self.user.save()
               

        return super().save(*args,**kwargs)

    def __self__(self):
        return f"{self.full_name} - {self.status}"
