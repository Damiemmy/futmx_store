from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .models import User,VendorRequest,LecturerRequest


@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = ("username", "email", "role", "is_active", "is_staff")
    list_filter = ("role", "is_active", "is_staff")
    fieldsets = UserAdmin.fieldsets + (("Role", {"fields": ("role",)}),)
    add_fieldsets = UserAdmin.add_fieldsets + (("Role", {"fields": ("role",)}),)

class CustomVendorRequest(admin.ModelAdmin):
    list_display=["user","status"]
    list_filter=["status"]
class CustomLecturerRequest(admin.ModelAdmin):
    list_display=["user","status","faculty","department"]
    list_filter=["status"]
admin.site.register(LecturerRequest,CustomLecturerRequest)
admin.site.register(VendorRequest,CustomVendorRequest)
