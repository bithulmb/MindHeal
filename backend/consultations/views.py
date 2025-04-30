from django.shortcuts import render
from rest_framework import viewsets, generics
from .models import TimeSlot,Consultation,ConsultationStatus
from .serializers import TimeSlotSerializer,ConsultationSerializer
from rest_framework.permissions import IsAuthenticated,AllowAny
from accounts.models import PsychologistProfile, UserRole, PatientProfile
from accounts.permissions import IsPatient,IsPsychologist
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters
from rest_framework.pagination import PageNumberPagination
from rest_framework.serializers import ValidationError
from rest_framework.views import APIView
from payments.models import Payment, PaymentStatus,Wallet,WalletTransaction,PaymentGateways
from rest_framework.response import Response
from rest_framework import status
from django.conf import settings
import razorpay
from django.db import transaction
from django.db.models import Q
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from .models import Review, Consultation
from .serializers import ReviewSerializer
from datetime import date
from django.db.models import Count, Avg, Sum
import logging
from django.core.exceptions import ObjectDoesNotExist
from decimal import Decimal
from django.utils import timezone
from datetime import timedelta,datetime

logger = logging.getLogger(__name__)


# Create your views here.


razorpay_client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))
class TimeSlotListCreateView(generics.ListCreateAPIView):
    serializer_class = TimeSlotSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):

        #if requested by psychologist it will list only the timeslots of psychologist else it will list all timeslots
        if self.request.user.role == UserRole.PSYCHOLOGIST:
            return TimeSlot.objects.filter(psychologist__user=self.request.user, is_expired=False)
        return TimeSlot.objects.filter(is_booked = False, is_active = True)
    
    def perform_create(self, serializer):
        psychologist = PsychologistProfile.objects.get(user = self.request.user)
        serializer.save(psychologist=psychologist)
        


class TimeSlotBulkCreateView(generics.CreateAPIView):
    serializer_class = TimeSlotSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        psychologist = PsychologistProfile.objects.get(user=self.request.user)
        timeslot_data = request.data.get("timeslots", [])

        if not isinstance(timeslot_data, list):
            return Response({"error": "Invalid data format"}, status=status.HTTP_400_BAD_REQUEST)

        created_timeslots = []
        for slot in timeslot_data:
            start_time = slot["start_time"]
            end_time = slot["end_time"]
            date = slot["date"]

            # Check for overlapping slots
            overlap_exists = TimeSlot.objects.filter(
                psychologist=psychologist,
                date=date,
                start_time__lt=end_time,
                end_time__gt=start_time
            ).exists()

            if overlap_exists:
                return Response(
                    {"error": f"Time slot {start_time} - {end_time} on {date} overlaps with an existing slot."},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Use serializer instead of directly creating the object
            serializer = TimeSlotSerializer(data={ 
                "date": date, 
                "start_time": start_time, 
                "end_time": end_time
            }, context={'request': request} )

            if serializer.is_valid():
                serializer.save(psychologist=psychologist)
                created_timeslots.append(serializer.data)
            else:
                logger.error(f"Error creating timeslot: {serializer.errors}")
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        return Response({"message": "Time slots created successfully", "timeslots": created_timeslots}, status=status.HTTP_201_CREATED)


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

        #getting the current date and time
        now = timezone.now()
        today = now.date()
        current_time = now.time()

        available_slots = TimeSlot.objects.filter(
            psychologist_id=psychologist_id, 
            is_active=True, 
            is_booked=False,
            is_expired=False
        ).filter(
            Q(date__gt=today) | 
            Q(date=today, start_time__gt=current_time)
        )
        return available_slots


#pagination class for implementing pagination
class ConsultationPagination(PageNumberPagination):
    page_size = 5
    page_size_query_param = 'page_size'
    max_page_size = 100


class ConsultationListView(generics.ListAPIView):
    serializer_class = ConsultationSerializer
    pagination_class = ConsultationPagination
    # filter_backends = [DjangoFilterBackend,filters.SearchFilter]
    # filterset_fields = ['consultation_status'] 
    # search_fields = ['patient__user__first_name', 'time_slot__psychologist__user__first_name', 'consultation_status']
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        
        user = self.request.user
        queryset = Consultation.objects.none()

        status = self.request.query_params.get('status', None)  
        search_query = self.request.query_params.get('search',None)

        if user.role == 'Patient':
            queryset = Consultation.objects.filter(patient__user=user).order_by("-time_slot__date")
            if search_query:
                queryset = queryset.filter(Q(time_slot__psychologist__user__first_name__icontains=search_query) | 
                Q(time_slot__psychologist__user__last_name__icontains=search_query)     
            )

        elif user.role == 'Psychologist':
            queryset = Consultation.objects.filter(time_slot__psychologist__user=user).order_by("-time_slot__date")
            if search_query:
                queryset = queryset.filter(Q(patient__user__first_name__icontains=search_query) | 
                Q(patient__user__last_name__icontains=search_query) ) 
               

        if status:
            queryset = queryset.filter(consultation_status=status) 
        
        
        return queryset
    
class RazorpayBookConsultationView(APIView):
    permission_classes = [IsPatient]
    
    def post(self,request):
        time_slot_id = request.data.get('time_slot')
        payment_id = request.data.get('payment_id')
        razorpay_payment_id = request.data.get('razorpay_payment_id')
        razorpay_order_id = request.data.get('razorpay_order_id')

        if not all([time_slot_id, razorpay_payment_id, razorpay_order_id]):
            logger.error("Missing required fields for Razorpay payment")
            return Response(
                {"error": "Missing required fields"},
                status=status.HTTP_400_BAD_REQUEST
            )


        try:
            #verifying the razor pay payment
            payment = razorpay_client.payment.fetch(razorpay_payment_id)
            if payment['order_id'] != razorpay_order_id or payment['status'] != 'captured':
                logger.error("Payment verification failed")
                return Response(
                    {"error": "Payment verification failed"},
                    status=status.HTTP_400_BAD_REQUEST
                )


            try:
                with transaction.atomic():
                    
                    #locking the timeslot to prevent the double booking
                    time_slot = TimeSlot.objects.select_for_update().get(id=time_slot_id)
                    
                    #checking whether the timeslot is already booked or not
                    if time_slot.is_booked:
                        logger.error("Time slot already booked")
                        return Response(
                        {"error": "Time slot already booked"},
                        status=status.HTTP_400_BAD_REQUEST
                        )
                
                    #updating the payment object
                    payment_obj = Payment.objects.get(id=payment_id)
                    payment_obj.transaction_id = razorpay_payment_id
                    payment_obj.payment_status = PaymentStatus.SUCCESS
                    payment_obj.save()


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
                logger.error(f"Payment {payment_id} not found for user {request.user.id}.")
                return Response({"error": "Payment not found"}, status=status.HTTP_404_NOT_FOUND)
            
            except TimeSlot.DoesNotExist:
                logger.error(f"Time slot {time_slot_id} not found for user {request.user.id}.")
                return Response({"error": "Time slot not found"}, status=status.HTTP_404_NOT_FOUND)
            
            except PatientProfile.DoesNotExist:
                logger.error(f"Patient profile not found for user {request.user.id}.")
                return Response({"error": "Patient profile not found"}, status=status.HTTP_404_NOT_FOUND)
            
            except Exception as e:
                logger.error(f"Error booking consultation: {str(e)}")
                return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
        except razorpay.errors.RazorpayError as e:
            logger.error(f"Razorpay error: {str(e)}")
            return Response({"error": f"Razorpay error: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)

        
class ConsultationDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ConsultationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if self.request.user.role == 'Patient':
            return Consultation.objects.filter(patient__user=self.request.user)
        elif self.request.user.role == 'Psychologist':
            return Consultation.objects.filter(time_slot__psychologist__user=self.request.user)
        return Consultation.objects.none()



class CheckDuplicateConsultationView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user_id = request.query_params.get('userId')
        psychologist_id = request.query_params.get('psychologistId')

        if not user_id or not psychologist_id:
            return Response({"error": "Missing userId or psychologistId"}, status=status.HTTP_400_BAD_REQUEST)

        # Check if a consultation exists with 'scheduled' status
        has_scheduled = Consultation.objects.filter(
            patient_id=user_id, time_slot__psychologist_id=psychologist_id, consultation_status='Scheduled'
        ).exists()

        return Response({"already_scheduled": has_scheduled}, status=status.HTTP_200_OK)



class UpdateConsultationStatus(APIView):
    def patch(self, request, consultation_id):
        try:
            consultation = Consultation.objects.get(id=consultation_id)
            consultation.consultation_status = ConsultationStatus.COMPLETED
            consultation.save()
            return Response({"message": "Consultation marked as completed"}, status=status.HTTP_200_OK)
        except Consultation.DoesNotExist:
            logger.error(f"Consultation {consultation_id} not found.")
            return Response({"error": "Consultation not found"}, status=status.HTTP_404_NOT_FOUND)




class SubmitReviewView(APIView):
    permission_classes = [IsPatient]

    def post(self, request):
        consultation_id = request.data.get("consultation_id")
        rating = request.data.get("rating")
        comment = request.data.get("comment", "")

        try:
            consultation = Consultation.objects.get(id=consultation_id)
            # Check if consultation is completed
            if consultation.consultation_status != "Completed":
                logger.error(f"Consultation {consultation_id} is not completed.")
                return Response(
                    {"error": "Reviews can only be submitted for completed consultations"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            # Check if the user is the patient
            if consultation.patient.user != request.user:
                logger.error(f"User {request.user.id} is not authorized to review this consultation.")
                return Response(
                    {"error": "You are not authorized to review this consultation"},
                    status=status.HTTP_403_FORBIDDEN
                )
            
            # Try to get existing review or create a new one
            review, created = Review.objects.get_or_create(
                consultation=consultation,
                user=request.user,
                defaults={"rating": rating, "comment": comment}  # Defaults for new review
            )

            if not created:
                # If review already exists, update it
                review.rating = rating
                review.comment = comment
                review.save()
                serializer = ReviewSerializer(review)
                return Response(serializer.data, status=status.HTTP_200_OK)

            # If new review was created, serialize and return it
            serializer = ReviewSerializer(review)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        except Consultation.DoesNotExist:
            logger.error(f"Consultation {consultation_id} not found.")
            return Response({"error": "Invalid consultation ID"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            logger.error(f"Error submitting review: {str(e)}")
            return Response({"error": f"An error occurred: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class PsychologistReviewsView(APIView):
    def get(self, request, psychologist_id):
        try:
            # Fetch reviews for consultations linked to the psychologist
            reviews = Review.objects.filter(
                consultation__time_slot__psychologist_id=psychologist_id
            ).select_related("user", "consultation")
            
            serializer = ReviewSerializer(reviews, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            logger.error(f"Error fetching reviews: {str(e)}")
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        


class PsychologistDashboardView(APIView):
    permission_classes=[IsPsychologist]
    def get(self, request):
        user = request.user  
        psychologist = PsychologistProfile.objects.get(user=user)
        today = date.today()

        upcoming_consultations = Consultation.objects.filter(
            time_slot__psychologist=psychologist,
            consultation_status='Scheduled',
            time_slot__date__gte=today
        ).select_related('patient', 'time_slot').order_by('time_slot__date', 'time_slot__start_time')[:5]

     
        total_consultations = Consultation.objects.filter(time_slot__psychologist=psychologist).count()
        total_earnings = Payment.objects.filter(consultation__time_slot__psychologist=psychologist).exclude(consultation__consultation_status="Cancelled").aggregate(Sum('amount'))['amount__sum'] or 0
        psychologist_earnings = float(total_earnings) * 0.8
       
        reviews = Review.objects.filter(consultation__time_slot__psychologist=psychologist).order_by('-created_at')
        average_rating = reviews.aggregate(Avg('rating'))['rating__avg'] or 0

      

        data = {
            'upcoming_consultations': ConsultationSerializer(upcoming_consultations, many=True).data,            
            'total_consultations': total_consultations,
            'total_earnings': total_earnings,                
            'reviews': ReviewSerializer(reviews,many=True).data,
            'average_rating': average_rating,        
            
        }
        return Response(data)
    
class PatientDashboardView(APIView):
    permission_classes=[IsPatient]
    def get(self, request):
        try:
            user = request.user  
            patient = PatientProfile.objects.get(user=user)
            today = date.today()

            upcoming_consultations = Consultation.objects.filter(
                patient=patient,
                consultation_status='Scheduled',
                time_slot__date__gte=today
            ).select_related('time_slot').order_by('time_slot__date', 'time_slot__start_time')

        
            total_consultations = Consultation.objects.filter(patient=patient,consultation_status = "Completed").count()
            total_payments = Payment.objects.filter(consultation__patient=patient).exclude(consultation__consultation_status="Cancelled").aggregate(Sum('amount'))['amount__sum'] or 0
        
        
        

            data = {
                'upcoming_consultations': ConsultationSerializer(upcoming_consultations, many=True).data,            
                'total_consultations': total_consultations,
                'total_payments': total_payments,                
                
                
            }
            return Response(data)
        
        except ObjectDoesNotExist as e:
            logger.error(f"Error in fetching patient dashboard: {str(e)}")
            return Response({"error": str(e)}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            logger.error(f"Error in fetching patient dashboard: {str(e)}")
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        




class CancelConsultationView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self,request,consultation_id):
        try:
            consultation = Consultation.objects.get(id=consultation_id,patient__user=request.user)

            if consultation.consultation_status != ConsultationStatus.SCHEDULED:
                return Response(
                    {"error": "Only scheduled consultations can be canceled."},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            slot = consultation.time_slot
            consultation_datetime = datetime.combine(slot.date, slot.start_time)
            consultation_datetime = timezone.make_aware(consultation_datetime, timezone.get_current_timezone())

            now = timezone.now()
            if consultation_datetime <= now + timedelta(hours=1):
                return Response(
                    {"error": "Cancellation not allowed within 1 hour of consultation time."},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            with transaction.atomic():
                consultation.consultation_status = ConsultationStatus.CANCELLED
                consultation.save()

                patient_profile = PatientProfile.objects.get(user=request.user)
                wallet, created= Wallet.objects.get_or_create(patient=patient_profile)
                amount = consultation.time_slot.psychologist.fees
                wallet.credit(amount=amount,description=f"Refund for cancelling Consultation(ID: {consultation.id})")

                return Response({"message": "Consultation canceled. Amount credited to wallet."}, status=status.HTTP_200_OK)
            
        except Consultation.DoesNotExist:
            logger.error(f"Consultation {consultation_id} not found for user {request.user.id}.")
            return Response(
                {"error": "Consultation not found or you don’t have permission to cancel it."},
                status=status.HTTP_404_NOT_FOUND
            )
        
        except Exception as e:
            logger.error(f"Error canceling consultation {consultation_id}: {str(e)}")
            return Response(
                {"error": "An unexpected error occurred while canceling the consultation."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
            
class WalletBookConsultationView(APIView):
    permission_classes=[IsPatient]
    def post(self,request):
        time_slot_id = request.data.get("time_slot")
        amount = request.data.get("amount")

        if not time_slot_id:
            return Response(
                {"error": "Time slot is required"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if not amount:
            return Response(
                {"error": "Amount is required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            with transaction.atomic():
                
                patient_profile = PatientProfile.objects.get(user=request.user)

                 # Locking the timeslot to prevent double booking
                time_slot = TimeSlot.objects.select_for_update().get(id=time_slot_id)

                if time_slot.is_booked:
                        logger.error("Time slot already booked")
                        return Response(
                        {"error": "Time slot already booked"},
                        status=status.HTTP_400_BAD_REQUEST
                        )

                wallet, created = Wallet.objects.get_or_create(patient=patient_profile)

                # checking whether enough wallet balance is there or not
                if wallet.balance < Decimal(amount):
                    logger.error("Insufficient wallet balance")
                    return Response(
                        {"error": "Insufficient wallet balance"},
                        status=status.HTTP_400_BAD_REQUEST
                    )
               
                #creating payment object
                payment = Payment.objects.create(
                    user = request.user,
                    amount = amount,
                    transaction_id = f"WALLET-{wallet.id}-{time_slot.id}",
                    payment_status = PaymentStatus.SUCCESS,
                    payment_gateway = PaymentGateways.WALLET,

                )

                #creating consultation object                
                consultation = Consultation.objects.create(
                    patient=patient_profile,
                    time_slot=time_slot,
                    payment=payment,
                )
               
                #marking time slot as booked
                time_slot.is_booked = True
                time_slot.save()
                
                #debiting wallet balance through method
                wallet.debit(amount=amount, description=f" Paid for Consultation booking (ID: {consultation.id})")
                
                return Response({
                    "success": True,
                    "consultation_id": consultation.id,
                }, status=status.HTTP_201_CREATED)

        except ObjectDoesNotExist as e:
            logger.error(f"Object not found: {str(e)}")
            return Response({"error": str(e)}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            logger.error(f"Error booking consultation: {str(e)}")
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)