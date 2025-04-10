from django.shortcuts import render
from rest_framework import generics,status,filters
from django.contrib.auth import get_user_model
from accounts.serializers import UserSerializer,PsychologistProfileSerializer
from rest_framework.permissions import IsAdminUser,IsAuthenticated
from rest_framework.response import Response
from accounts.models import PsychologistProfile,ApprovalStatusChoices,UserRole
from rest_framework.pagination import PageNumberPagination
from django_filters.rest_framework import DjangoFilterBackend 
from rest_framework.views import APIView
from consultations.models import Consultation,ConsultationStatus
from consultations.serializers import ConsultationSerializer
from payments.models import Payment,Wallet
from django.db.models import Sum,Count,F,Value
from django.db.models.functions import Concat
from accounts.utils import send_django_email
from django.utils import timezone
from django.db import transaction
import logging

logger = logging.getLogger(__name__)

# Create your views here.
User = get_user_model()

class UserPagination(PageNumberPagination):
    page_size = 5
    page_size_query_param = 'page_size'
    max_page_size = 100

#api view for getting the details of the users
class UserListView(generics.ListAPIView):
    queryset = User.objects.filter(role="Patient").order_by('-id')
    serializer_class = UserSerializer
    permission_classes=[IsAdminUser]
    pagination_class = UserPagination
    filter_backends = [filters.SearchFilter, DjangoFilterBackend]
    search_fields = ['first_name', 'last_name', 'email'] 



#api view for getting the details of the psychologists
class PsychologistListView(generics.ListAPIView):
    queryset = User.objects.filter(role="Psychologist").order_by('-id')
    serializer_class = UserSerializer
    permission_classes=[IsAdminUser]
    pagination_class = UserPagination
    filter_backends = [filters.SearchFilter, DjangoFilterBackend]
    search_fields = ['first_name', 'last_name', 'email'] 

#api view from admin to block or unblock the user
class UserUpdateBlockStatusView(generics.RetrieveUpdateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    lookup_field = 'id'
    permission_classes = [IsAdminUser]

    def patch(self,request, *args, **kwargs):
        user = self.get_object()
        is_blocked = request.data.get('is_blocked', None)
        name_of_user = user.get_full_name()
        email_of_user = user.email

        if is_blocked is not None:
            user.is_blocked = is_blocked
            user.save()

            #sending email to the user informing about the block status
            if is_blocked:
                email_subject = "Your Account Has Been Blocked "
                email_message = (
                    f"Dear {name_of_user}, \n \nWe want to inform you that your account has been blocked by the admin.\nYou will not be able to access the platform until further notice.\n \n Best regards,\n MindHeal"
                )

                #checking whether the blocked user is psychologist and all upcoming scheduled consultations of psychologist are cancelled and amount is credited back to user
                if user.role==UserRole.PSYCHOLOGIST and hasattr(user,'psychologist_profile'):

                    psychologist = user.psychologist_profile
                    
                    #getting all the upcoming scheduled transactions
                    consultations = Consultation.objects.filter(time_slot__psychologist=psychologist,
                                                                consultation_status=ConsultationStatus.SCHEDULED,
                                                                time_slot__date__gte=timezone.now().date()
                                                                )
                    for consultation in consultations:
                        try:
                            with transaction.atomic():
                                consultation.consultation_status=ConsultationStatus.CANCELLED
                                consultation.save()

                                patient = consultation.patient
                                wallet, _ = Wallet.objects.get_or_create(patient=patient)
                                amount = consultation.time_slot.psychologist.fees
                                wallet.credit(
                                amount=amount,
                                description=f"Refund due to psychologist block - Consultation ID: {consultation.id}"
                                )

                                patient_email = patient.user.email
                                patient_name = patient.user.get_full_name()
                                send_django_email(email=patient_email,
                                                  subject="Consultation Cancelled and Refunded",
                                                  message=f"Dear {patient_name}, \n \nYour consultation (ID: {consultation.id}) has been cancelled because the psychologist has been blocked by admin. ₹{amount} has been credited to your wallet.\n \n Best regards,\n MindHeal")
                        
                        except Exception as e:
                            logger.error(f"Failed to cancel and refund consultation {consultation.id}: {str(e)}")




            else:
                email_subject = "Your Account Has Been Unblocked "               
                email_message = f"Dear {name_of_user}, \n \nGood news! Your account has been unblocked by the admin.\nYou can now access the platform and continue using our services.\n \n Best regards,\n MindHeal"
            send_django_email(email_of_user,email_subject,email_message)

           

            return Response({'message' : "User block status updated succesfully"}, status=status.HTTP_200_OK)
        else:
            return Response({'error' : "is_blocked field is required"}, status=status.HTTP_400_BAD_REQUEST)


#api view for getting the details of the psychologist profiles
class PsychologistProfilePendingListView(generics.ListAPIView):
    queryset = PsychologistProfile.objects.filter(approval_status = "Pending")
    serializer_class = PsychologistProfileSerializer
    permission_classes=[IsAdminUser]

#api view for getting the psychologist profile and for approving or rejecting the profile
class PsychologistRetrieveUpdateView(generics.RetrieveUpdateAPIView):
    queryset = PsychologistProfile.objects.all()
    serializer_class = PsychologistProfileSerializer
    permission_classes=[IsAdminUser]

    def update(self, request, *args, **kwargs):
        
        action = request.data.get('action')
        profile = self.get_object()
        psychologist_email = profile.user.email
        psychologist_name = profile.user.get_full_name()   
        
        if action=="approve":
            profile.approval_status = ApprovalStatusChoices.APPROVED
            profile.is_admin_verified = True
            response_message = "Psychologist Approved Succesfully"
 
            email_subject = "Approval Of Psychologist Profile"
            email_message = f" Dear {psychologist_name}, \n \nCongratulations! Your profile has been approved by the admin. You can now start receiving consultations.\n \n Best regards,\n MindHeal"
        elif action == "reject":
            profile.approval_status = ApprovalStatusChoices.REJECTED
            profile.is_admin_verified = False
            response_message = "Psychologist rejected successfully"

            email_subject = "Rejection of Psychologist Profile"
            email_message = f"Dear {psychologist_name},  \n \nWe regret to inform you that your profile has been rejected by the admin. Please contact support for more details.\n \n Best regards,\n MindHeal"
        else:
            return Response({"error": "Invalid action"}, status=status.HTTP_400_BAD_REQUEST)
        
        profile.save()
        send_django_email(psychologist_email,email_subject,email_message)
       

        return Response({'message' : response_message}, status=status.HTTP_200_OK)
    

class AdminDashboardView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        

        total_users = User.objects.filter(role=UserRole.PATIENT).count()  
        total_psychologists =  User.objects.filter(role=UserRole.PSYCHOLOGIST).count()
        total_consultations = Consultation.objects.count()
        total_revenue = float(Payment.objects.filter(payment_status="Success").aggregate(total=Sum("amount"))["total"] or 0)
        admin_commission = total_revenue * 0.20
        psychologist_earnings = total_revenue * 0.80

        # Pending Psychologists
        pending_psychologists = PsychologistProfile.objects.filter(approval_status = "Pending")

        # Recent Consultations (last 5)
        recent_consultations = Consultation.objects.select_related(
            "patient", "time_slot__psychologist__user"
        ).order_by("-created_at")[:5]

        # Serialize
        pending_serializer = PsychologistProfileSerializer(pending_psychologists, many=True)
        consultation_serializer = ConsultationSerializer(recent_consultations, many=True)

        data = {
            "stats": {
                "total_users": total_users,
                "total_psychologists": total_psychologists,
                "total_consultations": total_consultations,
                "total_revenue": float(total_revenue),
                "admin_commission": float(admin_commission),
                "psychologist_earnings": float(psychologist_earnings),
            },
            "pending_psychologists": pending_serializer.data,
            "recent_consultations": consultation_serializer.data,
        }
        return Response(data)

class ConsultationPagination(PageNumberPagination):
    page_size = 5
    page_size_query_param = 'page_size'
    max_page_size = 100

class AdminConsulatationsView(generics.ListAPIView):
    queryset = Consultation.objects.all().order_by('-created_at')
    serializer_class = ConsultationSerializer
    permission_classes = [IsAdminUser]
    pagination_class = ConsultationPagination

     
    def get_queryset(self):
        queryset = super().get_queryset()
        status = self.request.query_params.get("status", None)
        patient = self.request.query_params.get("patient", None)
        psychologist = self.request.query_params.get("psychologist", None)

        # Annotate full name fields dynamically
        queryset = queryset.annotate(
            patient_full_name=Concat(
                F("patient__user__first_name"), Value(" "), F("patient__user__last_name")
            ),
            psychologist_full_name=Concat(
                F("time_slot__psychologist__user__first_name"), Value(" "), F("time_slot__psychologist__user__last_name")
            ),
        )

        if status:
            queryset = queryset.filter(consultation_status=status)
        if patient:
            queryset = queryset.filter(patient_full_name=patient)
        if psychologist:
            queryset = queryset.filter(psychologist_full_name=psychologist)


        return queryset


class FilterNamesView(APIView):
    permission_classes=[IsAdminUser]

    def get(self, request):
        # Get unique full names of patients
        patient_names = (
            Consultation.objects.annotate(
                full_name=Concat(
                    F("patient__user__first_name"),
                    Value(" "),
                    F("patient__user__last_name"),
                )
            )
            .values_list("full_name", flat=True)
            .distinct()
        )

        # Get unique full names of psychologists
        psychologist_names = (
            Consultation.objects.annotate(
                full_name=Concat(
                    F("time_slot__psychologist__user__first_name"),
                    Value(" "),
                    F("time_slot__psychologist__user__last_name"),
                )
            )
            .values_list("full_name", flat=True)
            .distinct()
        )

        return Response({
            "patient_names": list(patient_names),
            "psychologist_names": list(psychologist_names),
        })


