from rest_framework.routers import DefaultRouter
from django.urls import path,include
from .views import (
    TimeSlotListCreateView,
    TimeSlotDetailView,
    ConsultationDetailView,
    ConsultationListCreateView,
    PaymentListCreateView,
    PaymentDetailView,
    PsychologistTimeSlotListView
    )

# router = DefaultRouter( )
# router.register('timeslots', TimeSlotViewSet, basename='timeslot')

urlpatterns = [
    path('timeslots/', TimeSlotListCreateView.as_view(), name='timeslot-list-create'),
    path('timeslots/<int:pk>/', TimeSlotDetailView.as_view(), name='timeslot-detail'),
    path('psychologists/<int:psychologist_id>/timeslots/', PsychologistTimeSlotListView.as_view(), name='psychologist-timeslots'),
    
    path('consultations/', ConsultationListCreateView.as_view(), name='consultation-list-create'),
    path('consultations/<int:pk>/', ConsultationDetailView.as_view(), name='consultation-detail'),

    
    path('payments/', PaymentListCreateView.as_view(), name='payment-list-create'),
    path('payments/<int:pk>/', PaymentDetailView.as_view(), name='payment-detail'),

    ]