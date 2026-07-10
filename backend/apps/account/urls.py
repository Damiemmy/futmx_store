from django.urls import path
from rest_framework.routers import DefaultRouter

from .views import (
    ChangePasswordView,
    GoogleLoginRedirectView,
    GoogleOAuthCallbackView,
    LoginView,
    LogoutView,
    ProfileView,
    RefreshTokenView,
    RegisterView,
    VerifyEmailView,
    HostRequest,

)

router=DefaultRouter()
router.register('roles',HostRequest,basename='roles')

urlpatterns = [
    path("register/", RegisterView.as_view(), name="register"),
    path("login/", LoginView.as_view(), name="login"),
    path("logout/", LogoutView.as_view(), name="logout"),
    path("token/refresh/", RefreshTokenView.as_view(), name="token_refresh"),
    path("me/", ProfileView.as_view(), name="profile"),
    path("change-password/", ChangePasswordView.as_view(), name="change_password"),
    path(
        "verify-email/<uidb64>/<token>/",
        VerifyEmailView.as_view(),
        name="verify_email",
    ),
    path("google/login/", GoogleLoginRedirectView.as_view(), name="google_login"),
    path(
        "google/callback/",
        GoogleOAuthCallbackView.as_view(),
        name="google_callback",
    ),
]

urlpatterns += router.urls
