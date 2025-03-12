from django.shortcuts import render
from rest_framework import viewsets, generics
from .models import TimeSlot,Consultation
from .serializers import TimeSlotSerializer,ConsultationSerializer
from rest_framework.permissions import IsAuthenticated,AllowAny
from accounts.models import PsychologistProfile, UserRole, PatientProfile
from accounts.permissions import IsPatient,IsPsychologist
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters
from rest_framework.pagination import PageNumberPagination
from rest_framework.serializers import ValidationError
from rest_framework.views import APIView
from payments.models import Payment, PaymentStatus
from rest_framework.response import Response
from rest_framework import status
from django.conf import settings
import razorpay



# Create your views here.


razorpay_client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))
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
        return TimeSlot.objects.filter(psychologist_id=psychologist_id, is_active=True, is_booked = False,is_expired=False)


#pagination class for implementing pagination
class ConsultationPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100


class ConsultationListView(generics.ListAPIView):
    serializer_class = ConsultationSerializer
    pagination_class = ConsultationPagination
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['consultation_status'] 
    permission_classes = [IsAuthenticated]

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
    
class BookConsultationView(APIView):
    permission_classes = [IsPatient]
    
    def post(self,request):
        time_slot_id = request.data.get('time_slot')
        payment_id = request.data.get('payment_id')
        razorpay_payment_id = request.data.get('razorpay_payment_id')
        razorpay_order_id = request.data.get('razorpay_order_id')

        if not all([time_slot_id, razorpay_payment_id, razorpay_order_id]):
            return Response(
                {"error": "Missing required fields"},
                status=status.HTTP_400_BAD_REQUEST
            )


        try:
            
            payment = razorpay_client.payment.fetch(razorpay_payment_id)
            if payment['order_id'] != razorpay_order_id or payment['status'] != 'captured':
                return Response(
                    {"error": "Payment verification failed"},
                    status=status.HTTP_400_BAD_REQUEST
                )


            try:
                payment_obj = Payment.objects.get(id=payment_id)

                payment_obj.transaction_id = razorpay_payment_id
                payment_obj.payment_status = PaymentStatus.SUCCESS
                payment_obj.save()

                time_slot = TimeSlot.objects.get(id=time_slot_id)
                if time_slot.is_booked:
                    return Response(
                    {"error": "Time slot already booked"},
                    status=status.HTTP_400_BAD_REQUEST
                )

                patient_profile = PatientProfile.objects.get(user=request.user)

                consultation = Consultation.objects.create(
                    patient=patient_profile,
                    time_slot=time_slot,
                    payment=payment_obj,                
                )

                time_slot.is_booked = True
                time_slot.save()

                return Response({
                    "success": True,
                    "consultation_id": consultation.id,
                }, status=status.HTTP_201_CREATED)

            except Payment.DoesNotExist:
                return Response({"error": "Payment not found"}, status=status.HTTP_404_NOT_FOUND)
            
            except TimeSlot.DoesNotExist:
                return Response({"error": "Time slot not found"}, status=status.HTTP_404_NOT_FOUND)
            
            except PatientProfile.DoesNotExist:
                return Response({"error": "Patient profile not found"}, status=status.HTTP_404_NOT_FOUND)
            
            except Exception as e:
                return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
        except razorpay.errors.RazorpayError as e:
            return Response({"error": f"Razorpay error: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)






# class ConsultationListCreateView(generics.ListCreateAPIView):
#     serializer_class = ConsultationSerializer
#     pagination_class = ConsultationPagination
#     filter_backends = [DjangoFilterBackend]
#     filterset_fields = ['consultation_status'] 
   
#     def get_permissions(self):
#         if self.request.method == 'POST':
#             return [IsPatient()]
#         return [IsAuthenticated()]
    
    

#     def get_queryset(self):
        
#         user = self.request.user
#         queryset = Consultation.objects.none()

#         if user.role == 'Patient':
#             queryset = Consultation.objects.filter(patient__user=user).order_by("time_slot__date")
#         elif user.role == 'Psychologist':
#             queryset = Consultation.objects.filter(time_slot__psychologist__user=user).order_by("time_slot__date")
        
#         status = self.request.query_params.get('status', None)  
        
#         if status:
#             queryset = queryset.filter(consultation_status=status) 

#         return queryset
    
#     def perform_create(self, serializer):
#         patient = PatientProfile.objects.get(user=self.request.user)
#         time_slot_id = self.request.data.get('time_slot')
#         print(self.request.data)
        
#         if not time_slot_id:
#             raise ValidationError({'time_slot': 'This field is required.'})
        
#         try:
#             time_slot = TimeSlot.objects.get(id=time_slot_id)
#         except TimeSlot.DoesNotExist:
#             raise ValidationError({'time_slot': 'Invalid time slot.'})

        
#         serializer.save(patient=patient, time_slot=time_slot)
        
class ConsultationDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ConsultationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if self.request.user.role == 'Patient':
            return Consultation.objects.filter(patient__user=self.request.user)
        elif self.request.user.role == 'Psychologist':
            return Consultation.objects.filter(time_slot__psychologist__user=self.request.user)
        return Consultation.objects.none()

