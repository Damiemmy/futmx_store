from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .models import User,RoleRequest


@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = ("username", "email", "role", "is_active", "is_staff")
    list_filter = ("role", "is_active", "is_staff")
    fieldsets = UserAdmin.fieldsets + (("Role", {"fields": ("role",)}),)
    add_fieldsets = UserAdmin.add_fieldsets + (("Role", {"fields": ("role",)}),)

class CustomRoleRequest(admin.ModelAdmin):
    list_display=["user","status","faculty","department"]
    list_filter=["status"]
admin.site.register(RoleRequest,CustomRoleRequest)
