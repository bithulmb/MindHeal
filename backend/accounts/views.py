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
import logging
# Create your views here.

User = get_user_model()
logger = logging.getLogger(__name__)
class UserRegisterView(APIView):
        def post(self, request, format=None):
            serializer = UserSerializer(data = request.data, context = {'request' : request})
           

            if serializer.is_valid():
                with transaction.atomic():
                    try:
                        user = serializer.save()
                        user.is_active = False
                        user.save()
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
                        logger.error(f"User registration failed: {e}", exc_info=True)
                        user.delete()
                        return Response({
                            'error': 'Failed to send OTP email'
                        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            

                
                
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
                  
                  return Response({"error": "OTP expired.  Resend OTP again"}, status=status.HTTP_400_BAD_REQUEST)
            
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


#view function to resend otp

class ResendOTPView(APIView):
    def post(self, request):
        email = request.data.get("email")

        try:
            user = User.objects.get(email=email)

           
            otp = generate_otp()
            logger.info((f"otp is {otp}"))
            print(otp)
            send_otp_email(user.email, otp)

            
            EmailVerificationOTP.objects.filter(user=user).delete()
            EmailVerificationOTP.objects.create(user=user, otp=otp)

            return Response({"message": "OTP resent successfully."}, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({"error": "User with this email does not exist."}, status=status.HTTP_400_BAD_REQUEST)


#view function for custom token obtain pair view by adding user id and role
class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

    def post(self, request, *args, **kwargs):

        response = super().post(request, *args, **kwargs)
        
        if response.status_code == status.HTTP_200_OK:
            access_token = response.data['access']
            refresh_token = response.data['refresh']

            response.set_cookie(
                key='refresh_token',
                value=refresh_token,
                httponly=True,
                secure= True,
                samesite='Lax'
            )

            response.data = {
                'access': access_token,
            }
        return response

#view function for loggin out the user
class LogoutView(APIView):
    def post(self, request):
        response = Response({
            'message' : 'logged out succesfully',
        })
        response.delete_cookie('refresh_token')
        return response
