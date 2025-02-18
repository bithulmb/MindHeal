from django.urls import path,include
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from .views import (
    UserRegisterView,
    VerifyEmailOTPView,
    CustomTokenObtainPairView,
    CustomTokenRefreshView,
    LogoutView,
    ResendOTPView,
    GoogleLoginView,
    PasswordResetRequestView,
    PasswordResetConfirmView,
    UserListView,
    PsychologistListView,
    UserUpdateBlockStatusView,
    CheckRefreshTokenView,
    PsychologistProfileView,
    PsychologistProfileListView,
    PsychologistRetrieveUpdateView
    
)

urlpatterns = [
   
    path('api/auth/login/', CustomTokenObtainPairView.as_view(), name='token-obtain-pair'),
    path('api/auth/login/refresh/', CustomTokenRefreshView.as_view(), name='token-obtain-refresh'),
    path('api/auth/check-refresh-token/', CheckRefreshTokenView.as_view(), name='check-refresh-token'),
    path('api/auth/register/',UserRegisterView.as_view(), name = "user-register-view"),
    path('api/auth/verify-otp/',VerifyEmailOTPView.as_view(), name = "user-verify-email"),
    path('api/auth/resend-otp/',ResendOTPView.as_view(), name = "user-resend-otp"),
    path('api/auth/logout/',LogoutView.as_view(), name = "user-logout-view"),
    path("api/auth/google/", GoogleLoginView.as_view(), name="google-login"),
    path("api/auth/reset-password/", PasswordResetRequestView.as_view(), name="password-reset-request"),
    path("api/auth/reset-password-confirm/<uidb64>/<token>/", PasswordResetConfirmView.as_view(), name="password-reset-confirm"),
    
    path("api/admin/users/", UserListView.as_view(), name = "admin-user-list"),
    path("api/admin/psychologists/", PsychologistListView.as_view(), name = "admin-psychologist-list"),
    path("api/admin/users/<int:id>", UserUpdateBlockStatusView.as_view(), name = "admin-user-block"),
    path("api/admin/psychologist-profiles/", PsychologistProfileListView.as_view(), name = "admin-psychologist-profile"),
    path("api/admin/psychologist-profiles/<int:pk>/", PsychologistRetrieveUpdateView.as_view(), name = "admin-psychologist-profile-retrieve-update"),

    path("api/psychologist/profile/",PsychologistProfileView.as_view(),name='psychologist-profile'),
   

    

]
