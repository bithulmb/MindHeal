from django.urls import path,include
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
   
    path('api/auth/token/', TokenObtainPairView.as_view(), name='token-obtain-pair'),
    path('api/auth/token/refresh/', TokenObtainPairView.as_view(), name='token-obtain-pair')

]
