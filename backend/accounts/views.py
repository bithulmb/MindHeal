from django.shortcuts import render
from rest_framework.response import Response
from rest_framework import status
from .serializers import UserSerializer,MyTokenObtainPairSerializer
from rest_framework.views import APIView
from .utils import generate_otp,send_otp_email
from .models import EmailVerificationOTP
from django.db  import transaction
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.views import TokenObtainPairView
# Create your views here.

User = get_user_model()
class UserRegisterView(APIView):
    def post(self, request, format=None):
        serializer = UserSerializer(data = request.data, context = {'request' : request})
      

        if serializer.is_valid():
            with transaction.atomic():
                try:
                    user = serializer.save()
                    user.is_active = False
                    otp = generate_otp()
                    print(otp)
                    send_otp_email(user.email,otp)
                    print("otp sent")
                
                    otp_instance = EmailVerificationOTP.objects.create(user = user, otp = otp)
                    
                    return Response({
                        'message': 'OTP sent successfully. Please verify your email.',
                        'email': user.email
                    }, status=status.HTTP_200_OK)
                
                except Exception as e:
                    print(e)
                    return Response({
                        'error': 'Failed to send OTP email'
                    }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        

            
            # return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status= status.HTTP_400_BAD_REQUEST)


class VerifyEmailOTPView(APIView):
    def post(self, request):

        email = request.data.get('email')
        otp = request.data.get('otp')
        
        if not email or not otp:
            return Response({
                'error': 'Email and OTP are required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        

        try:
            user = User.objects.get(email = email)
            otp_instance = EmailVerificationOTP.objects.get(user = user)
            if not otp_instance.is_valid():
                  
                  return Response({"error": "Invalid OTP"}, status=status.HTTP_400_BAD_REQUEST)
            if int(otp_instance.otp) == int(otp):
               
                user.is_email_verified = True
                user.is_active = True
                otp_instance.delete()
                user.save()

                return Response({"message": "Email verified successfully."}, status=status.HTTP_200_OK)
            else:
               
                return Response({"error" : "Invalid OTP. Try again"}, status= status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            print(e)
            return Response({"error" : "OTP verification failed. Try again"}, status= status.HTTP_400_BAD_REQUEST)


#view function for custom token obtain pair view by adding user id and role
class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer
