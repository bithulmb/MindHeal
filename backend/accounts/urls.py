from django.urls import path,include
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from .views import UserRegisterView,VerifyEmailOTPView,MyTokenObtainPairView,LogoutView,ResendOTPView,GoogleLoginView,PasswordResetRequestView,PasswordResetConfirmView

urlpatterns = [
   
    path('api/auth/login/', MyTokenObtainPairView.as_view(), name='token-obtain-pair'),
    path('api/auth/login/refresh/', TokenRefreshView.as_view(), name='token-obtain-refresh'),
    path('api/auth/register/',UserRegisterView.as_view(), name = "user-register-view"),
    path('api/auth/verify-otp/',VerifyEmailOTPView.as_view(), name = "user-verify-email"),
    path('api/auth/resend-otp/',ResendOTPView.as_view(), name = "user-resend-otp"),
    path('api/auth/logout/',LogoutView.as_view(), name = "user-logout-view"),
    path("api/auth/google/", GoogleLoginView.as_view(), name="google-login"),
    path("api/auth/reset-password/", PasswordResetRequestView.as_view(), name="password_reset_request"),
    path("api/auth/reset-password-confirm/<uidb64>/<token>/", PasswordResetConfirmView.as_view(), name="password_reset_confirm"),

    

]
