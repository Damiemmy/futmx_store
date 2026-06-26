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
from core.models import RoleRequest
from .serializers import (
    ChangePasswordSerializer,
    RegisterSerializer,
    UserProfileSerializer,
    RoleRequestSerializer,
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
    queryset=RoleRequest.objects.all()
    serializer_class=RoleRequestSerializer

    @action(detail=False,methods=['post'])
    def become_host(self,request):
        print("MY ReQuest",request.data)
        user=self.request.user
        full_name= request.data.get('full_name')
        phone_number= request.data.get('phone_number')
        faculty=request.data.get('faculty')
        department= request.data.get('department')
        requested_role = request.data.get('requested_role')
        reason = request.data.get('reason')   # ✅ FIXED
        id_document = request.FILES.get("id_document",None)


        print("Current user:", user)
        print(RoleRequest.objects.filter(user=user))
        print(RoleRequest.objects.filter(user=user, status="pending"))
        print(RoleRequest.objects.filter(user=user, status="approved"))

        if RoleRequest.objects.filter(user=user,status='pending').exists():
            return Response({"message":"You already have a pending requests"},status=status.HTTP_409_CONFLICT)
        if RoleRequest.objects.filter(user=user,status='approved').exists():
            return Response({"message":"You are Already a Host"},status=status.HTTP_409_CONFLICT)
        RoleRequest.objects.create(user=user,full_name=full_name,phone_number=phone_number, requested_role=requested_role,reason=reason,faculty=faculty,department=department, id_document=id_document)
        return Response({'message':'Verification Request Submitted'},status=status.HTTP_201_CREATED)

    def perform_create(self,serializer):
        return serializer.save(user=self.request.user)

    def get_permissions(self):
        if self.action in ['become_host']:
            return[IsAuthenticated()]
        return super().get_permissions()


class AdminVerificationRequest(ModelViewSet):
    queryset=RoleRequest.objects.all()
    serializer_class=RoleRequestSerializer
    filterset_fields=['status']
    @action(detail=True,methods=['post'])
    def approved(self,request,pk=None):
        # don't use code below in ModelViewSet it only Works in ViewSet, using the results to this error(using this results to an Attribute Error (AttributeError at /user/admin-verify-user/37/approved/ 'AdminVerificationRequest' object has no attribute 'object')
        
        #hostrequest=self.object.get()

        #right code to use:
        hostrequest=self.get_object()


        if hostrequest.status !='pending':
            return Response({"message":"Request has been Processed"})

        hostrequest.status='approved'
        hostrequest.save()

        return Response({"message":"Host request Approved Successfully"})

    @action(detail=True,methods=['post'])
    def rejected(self,request,pk=None):
        # hostrequest=self.object.get() - for ViewSet alone
        hostrequest=self.get_object()
        if hostrequest.status != "pending":
            return Response({"message":"Request has been Processed"})

        hostrequest.status='rejected'
        hostrequest.save()
        return Response({"message":"Host Request rejected"})

    def get_permissions(self):
        if self.action in ['rejected','approved']:
            return[IsAuthenticated(),IsAdmin()]
        return[AllowAny()]

class VerifyAPIView(APIView):
    def get(self,request,uidb64,token):
        print('MYREQ:',request.data)
        try:
            uid=urlsafe_base64_decode(uidb64).decode()
            user=User.objects.get(pk=uid)
           

        except Exception :
            return Response({'error':'invalid_link'},status=status.HTTP_400_BAD_REQUEST)
            
        if default_token_generator.check_token(user,token):
            user.is_active=True
            user.save()
            return Response({"message":"verification is Successful"})
        return Response(
                {"error": "Invalid or expired token"},
                status=status.HTTP_400_BAD_REQUEST
            )
    