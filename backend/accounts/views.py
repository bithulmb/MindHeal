from django.shortcuts import render
from rest_framework.response import Response
from rest_framework import status,generics
from .serializers import UserSerializer,MyTokenObtainPairSerializer,PasswordResetRequestSerializer,PasswordResetConfirmSerializer
from rest_framework.views import APIView
from .utils import generate_otp,send_otp_email
from .models import EmailVerificationOTP
from django.db  import transaction
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.views import TokenObtainPairView
import logging
from social_django.utils import load_strategy
from social_core.backends.google import GoogleOAuth2
from social_core.exceptions import AuthException
from rest_framework_simplejwt.tokens import RefreshToken
from dotenv import load_dotenv
import os
from google.auth.transport import requests
from google.oauth2 import id_token
from rest_framework.permissions import AllowAny
from django.utils.http import urlsafe_base64_decode
from django.contrib.auth.tokens import PasswordResetTokenGenerator
# Create your views here.


load_dotenv()
User = get_user_model()
logger = logging.getLogger(__name__)

GOOGLE_CLIENT_ID= os.getenv('GOOGLE_CLIENT_ID')
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


# class GoogleLoginView(APIView):
#     """Authenticate user using Google OAuth and return JWT tokens"""

#     def post(self, request):
#         try:
#             google_token = request.data.get("token")
#             logger.info("google token is",google_token)
#             print(google_token)
#             if not google_token:
#                 return Response({"error": "Google token is required"}, status=400)

#             # Load the Google strategy
#             strategy = load_strategy(request)
           
#             backend = GoogleOAuth2(strategy=strategy)
           

#             # Authenticate user via Google token
#             print("before authentication")
#             user = backend.do_auth(google_token)
#             print("after authentication")


#             if user and user.is_active:
#                 # Generate JWT tokens using Simple JWT
#                 refresh = RefreshToken.for_user(user)
#                 return Response({
#                     "access_token": str(refresh.access_token),
#                     "refresh_token": str(refresh),
#                     "user": {
#                         "id": user.id,
#                         "username": user.username,
#                         "email": user.email,
#                     }
#                 })
#             else:
#                 return Response({"error": "Authentication failed"}, status=400)

#         except AuthException:
#             return Response({"error": "Invalid Google token"}, status=400)


class GoogleLoginView(APIView):
    """Authenticate user using Google OAuth and return JWT tokens"""

    def post(self, request):
        google_token = request.data.get("token")
        

        if not google_token:
            return Response({"error": "Google token is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Verify the token with Google
            id_info = id_token.verify_oauth2_token(google_token, requests.Request(), GOOGLE_CLIENT_ID)
            

            if "email" not in id_info:
                return Response({"error": "Invalid token"}, status=status.HTTP_400_BAD_REQUEST)

            print("3")    
            email = id_info["email"]
            first_name = id_info["given_name"]
            last_name = id_info["family_name"]
            

            # Check if user exists or create a new one
            user, created = User.objects.get_or_create(email=email, defaults={
                "first_name" :first_name,
                "last_name" : last_name,
            })
            
            if not user.is_active:
                return Response({"error": "User account is disabled"}, status=status.HTTP_403_FORBIDDEN)

            # Generate JWT tokens
            refresh = RefreshToken.for_user(user)
            return Response({
                "access_token": str(refresh.access_token),
                "refresh_token": str(refresh),
                "user": {
                    "id": user.id,
                    "email": user.email,
                }
            })
        except ValueError:
            return Response({"error": "Invalid Google token"}, status=status.HTTP_400_BAD_REQUEST)

# API for requesting password reset
class PasswordResetRequestView(generics.GenericAPIView):
    serializer_class = PasswordResetRequestSerializer
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Password reset email sent."}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
        
#api view for confirming password reset
class PasswordResetConfirmView(generics.GenericAPIView):
    serializer_class = PasswordResetConfirmSerializer
    permission_classes = [AllowAny]

    def post(self, request, uidb64, token, *args, **kwargs):
      
        serializer = self.get_serializer(data=request.data, context={"uidb64": uidb64, "token": token})
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Password reset successful."}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)