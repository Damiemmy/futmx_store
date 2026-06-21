from rest_framework.permissions import SAFE_METHODS, BasePermission

from .constants import UserRole


class IsCustomer(BasePermission):
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and request.user.role == UserRole.CUSTOMER
        )


class IsStaffOrAdmin(BasePermission):
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and (
                request.user.role in (UserRole.STAFF, UserRole.ADMIN)
                or request.user.is_superuser
            )
        )


class IsAdmin(BasePermission):
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and (
                request.user.role == UserRole.ADMIN
                or request.user.is_superuser
            )
        )


class IsOwner(BasePermission):
    def has_object_permission(self, request, view, obj):
        owner = getattr(obj, "user", None)
        if owner is None:
            return False
        return owner == request.user


class IsOwnerOrStaff(BasePermission):
    def has_object_permission(self, request, view, obj):
        if (
            request.user.is_authenticated
            and (
                request.user.role in (UserRole.STAFF, UserRole.ADMIN)
                or request.user.is_superuser
            )
        ):
            return True
        owner = getattr(obj, "user", None)
        return owner is not None and owner == request.user


class ReadOnlyOrStaff(BasePermission):
    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True
        return (
            request.user.is_authenticated
            and (
                request.user.role in (UserRole.STAFF, UserRole.ADMIN)
                or request.user.is_superuser
            )
        )
