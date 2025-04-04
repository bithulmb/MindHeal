from django.urls import path
from .views import CreateComplaintView, ListComplaintsView, ResolveComplaintView

urlpatterns = [
    path('complaints/submit/', CreateComplaintView.as_view(), name='create-complaint'),
    path('complaints/', ListComplaintsView.as_view(), name='list-complaints'),
    path('complaints/<int:complaint_id>/resolve/', ResolveComplaintView.as_view(), name='resolve-complaint'),
]
