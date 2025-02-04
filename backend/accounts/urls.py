from django.urls import path,include
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from .views import UserRegisterView,VerifyEmailOTPView,MyTokenObtainPairView,LogoutView

urlpatterns = [
   
    path('api/auth/login/', MyTokenObtainPairView.as_view(), name='token-obtain-pair'),
    path('api/auth/login/refresh/', TokenRefreshView.as_view(), name='token-obtain-refresh'),
    path('api/auth/register/',UserRegisterView.as_view(), name = "user-register-view"),
    path('api/auth/register/verify/',VerifyEmailOTPView.as_view(), name = "user-verify-email"),
    path('api/auth/logout/',LogoutView.as_view(), name = "user-logout-view"),
    

]
