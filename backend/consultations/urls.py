from rest_framework.routers import DefaultRouter
from django.urls import path,include
from .views import (
    TimeSlotListCreateView,
    TimeSlotDetailView,
    ConsultationDetailView,
    ConsultationListView,
    PsychologistTimeSlotListView,
    BookConsultationView,
    TimeSlotBulkCreateView,
    CheckDuplicateConsultationView,
    UpdateConsultationStatus
    )

# router = DefaultRouter( )
# router.register('timeslots', TimeSlotViewSet, basename='timeslot')

urlpatterns = [
    path('timeslots/', TimeSlotListCreateView.as_view(), name='timeslot-list-create'),
    path('timeslots/bulk/', TimeSlotBulkCreateView.as_view(), name='timeslot-bulk-create'),
    path('timeslots/<int:pk>/', TimeSlotDetailView.as_view(), name='timeslot-detail'),
    path('psychologists/<int:psychologist_id>/timeslots/', PsychologistTimeSlotListView.as_view(), name='psychologist-timeslots'),
    
    path('consultations/', ConsultationListView.as_view(), name='consultation-list'),
    path('consultations/book/', BookConsultationView.as_view(), name='consultation-create'),
    path('consultations/<int:pk>/', ConsultationDetailView.as_view(), name='consultation-detail'),
    path('consultations/check/', CheckDuplicateConsultationView.as_view(), name='consultation-check'),
    path('consultations/<int:consultation_id>/complete/',UpdateConsultationStatus.as_view(), name='consultation-completion-update'),

    ]