from django.urls import path
from .views import (
    UserListView,
    PsychologistListView,
    UserUpdateBlockStatusView,
    PsychologistProfilePendingListView,
    PsychologistRetrieveUpdateView,
    AdminDashboardView
    )


urlpatterns = [
    
    path("api/admin/users/", UserListView.as_view(), name = "admin-user-list"),
    path("api/admin/psychologists/", PsychologistListView.as_view(), name = "admin-psychologist-list"),
    path("api/admin/users/<int:id>", UserUpdateBlockStatusView.as_view(), name = "admin-user-block"),
    path("api/admin/psychologist-profiles/", PsychologistProfilePendingListView.as_view(), name = "admin-psychologist-profile"),
    path("api/admin/psychologist-profiles/<int:pk>/", PsychologistRetrieveUpdateView.as_view(), name = "admin-psychologist-profile-retrieve-update"),
    path('api/admin/dashboard/',AdminDashboardView.as_view(), name='admin-dashboard')
    
]