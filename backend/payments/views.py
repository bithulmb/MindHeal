from django.shortcuts import render
from .serializers import PaymentSerializer
from accounts.permissions  import IsPatient
from .models import Payment
from rest_framework import generics
import razorpay
from django.conf import settings
from django.http import JsonResponse
from rest_framework.views import APIView
from accounts.permissions import IsPatient
from rest_framework.response import Response
from rest_framework import status


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
                payment_gateway = "Razorpay"
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
    
