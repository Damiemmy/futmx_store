from allauth.socialaccount.adapter import DefaultSocialAccountAdapter

from core.constants import UserRole


class SocialAccountAdapter(DefaultSocialAccountAdapter):
    def save_user(self, request, sociallogin, form=None):
        user = super().save_user(request, sociallogin, form)
        if not user.role:
            user.role = UserRole.CUSTOMER
            user.save(update_fields=["role"])
        return user
