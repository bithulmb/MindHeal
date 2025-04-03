from django.shortcuts import render
from .serializers import PaymentSerializer,WalletSerializer,WalletTransactionSerializer
from accounts.permissions  import IsPatient
from .models import Payment, Wallet, WalletTransaction,PaymentGateways
from rest_framework import generics
import razorpay
from django.conf import settings
from django.http import JsonResponse
from rest_framework.views import APIView
from accounts.models import PatientProfile
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from consultations.models import Consultation,ConsultationStatus
import logging

logger = logging.getLogger(__name__)

# Create your views here.

client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))

class RazorpayCreateOrderAPIView(APIView):
    permission_classes = [IsPatient]

    def post(self, request):
        try:
            amount = request.data.get("amount")
            currency = "INR"
            
            if not amount:
                return Response({"message": "Amount is required"}, status=status.HTTP_400_BAD_REQUEST)

            
            client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))

            # Create Order
            payment_data = {
                "amount": float(amount) * 100,  
                "currency": currency,
                "payment_capture": 1,
            }

            order = client.order.create(payment_data)
         
         
            payment = Payment.objects.create(
                user=request.user,
                amount=amount,
                transaction_id=order["id"],
                payment_gateway = PaymentGateways.RAZORPAY
            )

            # serializer = PaymentSerializer(payment)

            return Response({
                "order_id": order["id"],
                "amount": order['amount'],
                "currency": order['currency'],
                "payment_id": payment.id,
            }, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


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
    
class WalletDetailsView(APIView):
    permission_classes = [IsPatient]
    
    def get(self,request,*args,**kwargs):
        try:
            patient_profile = PatientProfile.objects.get(user=request.user)
            wallet, created = Wallet.objects.get_or_create(patient = patient_profile)
            wallet_balance = wallet.balance
            transactions = wallet.transactions.all().order_by("-timestamp")

            data = {
                'balance' : wallet_balance,
                'transactions' : WalletTransactionSerializer(transactions,many=True).data,
            }

            return Response(data, status=status.HTTP_200_OK)
        
        except PatientProfile.DoesNotExist:
            return Response(
                {"error": "Patient profile not found."},
                status=status.HTTP_404_NOT_FOUND
            )
        
        except Exception as e:
            logger.error(f"Error fetching wallet details: {str(e)}")
            return Response(
                {"error": "An unexpected error occurred while fetching wallet details."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
