from rest_framework.permissions import SAFE_METHODS, BasePermission
from .constants import UserRole

class IsAuthenticated(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated

class IsAdmin(BasePermission):
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated and
            (request.user.role == "admin" or request.user.is_superuser)
        )

class HasRole(BasePermission):
    allowed_roles = []

    def has_permission(self, request, view):
        return (
            request.user.is_authenticated and
            request.user.role in self.allowed_roles
        )

class IsOwner(BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.user == request.user


class ReadOnlyOrRole(BasePermission):
    """
    Allow read for everyone,
    Allow write only for selected roles.
    """

    allowed_roles = [UserRole.ADMIN]  # you can expand later

    def has_permission(self, request, view):
        # SAFE METHODS = GET, HEAD, OPTIONS
        if request.method in SAFE_METHODS:
            return True

        return (
            request.user.is_authenticated and
            (
                request.user.role in self.allowed_roles
                or request.user.is_superuser
            )
        )

class IsOwnerOrAdminOrVendor(BasePermission):
    """
    Allow:
    - Admin
    - Vendor
    - Object owner (customer)
    """

    def has_object_permission(self, request, view, obj):
        if not request.user.is_authenticated:
            return False

        # Admin override
        if request.user.role == UserRole.ADMIN or request.user.is_superuser:
            return True

        # Vendor access (if applicable to your order system)
        if request.user.role == UserRole.VENDOR:
            return True

        # Owner access
        owner = getattr(obj, "user", None)
        return owner == request.user

class BookPermission(BasePermission):
    """
    - SAFE METHODS (GET): everyone
    - CREATE: admin, vendor, lecturer, course_rep
    - UPDATE/DELETE: only owner or admin
    """

    create_roles = [
        UserRole.ADMIN,
        UserRole.VENDOR,
        UserRole.LECTURER,
        UserRole.COURSE_REP,
    ]

    def has_permission(self, request, view):
        # READ access for everyone
        if request.method in SAFE_METHODS:
            return True

        # CREATE access
        if request.method == "POST":
            return (
                request.user.is_authenticated and
                (
                    request.user.role in self.create_roles
                    or request.user.is_superuser
                )
            )

        # UPDATE/DELETE handled in object permission
        return request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        # ADMIN override
        if request.user.role == UserRole.ADMIN or request.user.is_superuser:
            return True

        # OWNER only can edit their own book
        return getattr(obj, "created_by", None) == request.user