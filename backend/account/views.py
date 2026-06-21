from django.conf import settings
from django.contrib.auth import get_user_model
from django.contrib.auth.tokens import default_token_generator
from django.shortcuts import redirect
from django.utils.encoding import force_str
from django.utils.http import urlsafe_base64_decode
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.viewsets import ModelViewSet
from rest_framework.decorators import action
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from core.models import LecturerRequest
from .serializers import (
    ChangePasswordSerializer,
    RegisterSerializer,
    UserProfileSerializer,
    LecturerRequestSerializer,
)
from .tasks import send_verification_email_task

User = get_user_model()


class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        send_verification_email_task.delay(user.id)
        return Response(
            {"message": "Registration successful. Please verify your email."},
            status=status.HTTP_201_CREATED,
        )


class LoginView(TokenObtainPairView):
    permission_classes = [AllowAny]


class RefreshTokenView(TokenRefreshView):
    permission_classes = [AllowAny]


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data.get("refresh")
            if not refresh_token:
                return Response(
                    {"detail": "Refresh token is required.", "code": "token_required"},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({"message": "Logged out successfully."})
        except Exception:
            return Response(
                {"detail": "Invalid token.", "code": "invalid_token"},
                status=status.HTTP_400_BAD_REQUEST,
            )


class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserProfileSerializer(request.user)
        return Response(serializer.data)

    def patch(self, request):
        serializer = UserProfileSerializer(
            request.user, data=request.data, partial=True
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)


class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ChangePasswordSerializer(
            data=request.data, context={"request": request}
        )
        serializer.is_valid(raise_exception=True)
        request.user.set_password(serializer.validated_data["new_password"])
        request.user.save()
        return Response({"message": "Password updated successfully."})


class VerifyEmailView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, uidb64, token):
        try:
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            return Response(
                {"detail": "Invalid verification link.", "code": "invalid_link"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if default_token_generator.check_token(user, token):
            user.is_active = True
            user.save()
            return Response({"message": "Email verified successfully."})

        return Response(
            {"detail": "Invalid or expired token.", "code": "invalid_token"},
            status=status.HTTP_400_BAD_REQUEST,
        )


class GoogleLoginRedirectView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        from allauth.socialaccount.providers.google.views import oauth2_login

        return oauth2_login(request)


class GoogleOAuthCallbackView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        from allauth.socialaccount.models import SocialAccount
        from allauth.socialaccount.providers.google.views import oauth2_callback

        response = oauth2_callback(request)
        if request.user.is_authenticated:
            social = SocialAccount.objects.filter(user=request.user).first()
            if social and not request.user.role:
                request.user.role = "customer"
                request.user.save()
            refresh = RefreshToken.for_user(request.user)
            frontend = settings.FRONTEND_URL
            return redirect(
                f"{frontend}/auth/callback"
                f"?access={refresh.access_token}&refresh={refresh}"
            )
        return response

class HostRequest(ModelViewSet):
    queryset=LecturerRequest.objects.all()
    serializer_class=LecturerRequestSerializer

    @action(detail=False,methods=['post'])
    def become_host(self,request):
        print("MY ReQuest",request.data)
        user=self.request.user
        full_name= request.data.get('full_name')
        phone_number= request.data.get('phone_number')
        faculty=request.data.get('faculty')
        department= request.data.get('department')
        id_document = request.FILES.get("id_document")

        if HostRequest.objects.filter(user=user,status='pending').exists():
            return Response({"message":"You already have a pending requests"})
        if HostRequest.objects.filter(user=user,status='approved').exists():
            return Response({"message":"You are Already a Host"})
        print(user,full_name,phone_number,location,hosting_experience,host_reasons)
        HostRequest.objects.create(user=user,email=self.request.user.email,username=self.request.user.username,full_name=full_name,phone_number=phone_number,faculty=faculty,department=department,host_reasons=host_reasons,id_document=id_document)
        return Response({'message':'Verification Request Submitted'})

    def perform_create(self,serializer):
        return serializer.save(user=self.request.user)

    def get_permissions(self):
        if self.action in ['become_host']:
            return[IsAuthenticated()]
        return super().get_permissions()
