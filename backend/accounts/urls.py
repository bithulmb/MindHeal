from django.urls import path,include
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from .views import UserRegisterView,VerifyEmailOTPView

urlpatterns = [
   
    path('api/auth/token/', TokenObtainPairView.as_view(), name='token-obtain-pair'),
    path('api/auth/token/refresh/', TokenObtainPairView.as_view(), name='token-obtain-pair'),
    path('api/auth/register/',UserRegisterView.as_view(), name = "user-register-view"),
    path('api/auth/register/verify/',VerifyEmailOTPView.as_view(), name = "user-verify-email")
    

]
