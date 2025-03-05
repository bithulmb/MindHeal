from django.shortcuts import render
from rest_framework import viewsets, generics
from .models import TimeSlot,Consultation,Payment
from .serializers import TimeSlotSerializer,ConsultationSerializer,PaymentSerializer
from rest_framework.permissions import IsAuthenticated,AllowAny
from accounts.models import PsychologistProfile, UserRole, PatientProfile
from accounts.permissions import IsPatient,IsPsychologist
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters
from rest_framework.pagination import PageNumberPagination

# Create your views here.

class TimeSlotListCreateView(generics.ListCreateAPIView):
    serializer_class = TimeSlotSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        #if requested by psychologist it will list only the timeslots of psychologist else it will list all timeslots
        if self.request.user.role == UserRole.PSYCHOLOGIST:
            return TimeSlot.objects.filter(psychologist__user=self.request.user)
        return TimeSlot.objects.filter(is_booked = False, is_active = True)
    
    def perform_create(self, serializer):
        psychologist = PsychologistProfile.objects.get(user = self.request.user)
        serializer.save(psychologist=psychologist)
        



class TimeSlotDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = TimeSlot.objects.all()
    serializer_class = TimeSlotSerializer
    permission_classes = [IsPsychologist]

    def get_queryset(self):
        return TimeSlot.objects.filter(psychologist__user=self.request.user)


class PsychologistTimeSlotListView(generics.ListAPIView):
    serializer_class = TimeSlotSerializer
    permission_classes = [AllowAny] 

    def get_queryset(self):
        # getting the pyschologist id from the url as path parameter
        psychologist_id = self.kwargs['psychologist_id']
        return TimeSlot.objects.filter(psychologist_id=psychologist_id, is_active=True, is_booked = False)


#pagination class for implementing pagination
class ConsultationPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100

class ConsultationListCreateView(generics.ListCreateAPIView):
    serializer_class = ConsultationSerializer
    pagination_class = ConsultationPagination
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['consultation_status'] 
   
    def get_permissions(self):
        if self.request.method == 'POST':
            return [IsPatient()]
        return [IsAuthenticated()]

    def get_queryset(self):
        
        user = self.request.user
        queryset = Consultation.objects.none()

        if user.role == 'Patient':
            queryset = Consultation.objects.filter(patient__user=user).order_by("time_slot__date")
        elif user.role == 'Psychologist':
            queryset = Consultation.objects.filter(time_slot__psychologist__user=user).order_by("time_slot__date")
        
        status = self.request.query_params.get('status', None)  
        
        if status:
            queryset = queryset.filter(consultation_status=status) 

        return queryset
    
    def perform_create(self, serializer):
        patient = PatientProfile.objects.get(user = self.request.user)
        serializer.save(patient = patient)
    
class ConsultationDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ConsultationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if self.request.user.role == 'Patient':
            return Consultation.objects.filter(patient__user=self.request.user)
        elif self.request.user.role == 'Psychologist':
            return Consultation.objects.filter(time_slot__psychologist__user=self.request.user)
        return Consultation.objects.none()

class PaymentListCreateView(generics.ListCreateAPIView):
    serializer_class = PaymentSerializer
    permission_classes = [IsPatient]

    def get_queryset(self):
        return Payment.objects.filter(consultation__patient__user=self.request.user)

class PaymentDetailView(generics.RetrieveUpdateAPIView):
    serializer_class = PaymentSerializer
    permission_classes = [IsPatient]

    def get_queryset(self):
        return Payment.objects.filter(consultation__patient__user=self.request.user)