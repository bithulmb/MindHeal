from rest_framework.routers import DefaultRouter
from django.urls import path,include
from .views import (
    TimeSlotListCreateView,
    TimeSlotDetailView,
    ConsultationDetailView,
    ConsultationListView,
    PsychologistTimeSlotListView,
    RazorpayBookConsultationView,
    TimeSlotBulkCreateView,
    CheckDuplicateConsultationView,
    UpdateConsultationStatus,
    SubmitReviewView,
    PsychologistReviewsView,
    PsychologistDashboardView,
    PatientDashboardView,
    CancelConsultationView,
    WalletBookConsultationView
    )

# router = DefaultRouter( )
# router.register('timeslots', TimeSlotViewSet, basename='timeslot')

urlpatterns = [
    path('timeslots/', TimeSlotListCreateView.as_view(), name='timeslot-list-create'),
    path('timeslots/bulk/', TimeSlotBulkCreateView.as_view(), name='timeslot-bulk-create'),
    path('timeslots/<int:pk>/', TimeSlotDetailView.as_view(), name='timeslot-detail'),
    path('psychologists/<int:psychologist_id>/timeslots/', PsychologistTimeSlotListView.as_view(), name='psychologist-timeslots'),
    
    path('consultations/', ConsultationListView.as_view(), name='consultation-list'),
    path('consultations/book/razorpay/', RazorpayBookConsultationView.as_view(), name='book-consultation-razorpay'),
    path('consultations/book/wallet/', WalletBookConsultationView.as_view(), name='book-consultation-wallet'),
    path('consultations/<int:pk>/', ConsultationDetailView.as_view(), name='consultation-detail'),
    path('consultations/check/', CheckDuplicateConsultationView.as_view(), name='consultation-check'),
    path('consultations/<int:consultation_id>/complete/',UpdateConsultationStatus.as_view(), name='consultation-completion-update'),
    path('consultations/<int:consultation_id>/cancel/',CancelConsultationView.as_view(), name='consultation-cancel'),

    path('consultation/submit-review/',SubmitReviewView.as_view(), name='submit-review'),
    path("psychologists/<int:psychologist_id>/reviews/", PsychologistReviewsView.as_view(), name="psychologist_reviews"),
    path('psychologist/dashboard/',PsychologistDashboardView.as_view(),name='psychologist-dashboard'),
     path('user/dashboard/',PatientDashboardView.as_view(),name='patient-dashboard'),
    ]