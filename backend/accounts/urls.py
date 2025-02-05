from django.urls import path,include
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from .views import UserRegisterView,VerifyEmailOTPView,MyTokenObtainPairView,LogoutView,ResendOTPView,GoogleLoginView,GoogleLogin

urlpatterns = [
   
    path('api/auth/login/', MyTokenObtainPairView.as_view(), name='token-obtain-pair'),
    path('api/auth/login/refresh/', TokenRefreshView.as_view(), name='token-obtain-refresh'),
    path('api/auth/register/',UserRegisterView.as_view(), name = "user-register-view"),
    path('api/auth/verify-otp/',VerifyEmailOTPView.as_view(), name = "user-verify-email"),
    path('api/auth/resend-otp/',ResendOTPView.as_view(), name = "user-resend-otp"),
    path('api/auth/logout/',LogoutView.as_view(), name = "user-logout-view"),
    path("api/auth/google/", GoogleLoginView.as_view(), name="google-login"),
    path('api/dj-rest-auth/google/', GoogleLogin.as_view(), name='google_login2')
    

]
