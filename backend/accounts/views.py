from django.shortcuts import render,get_object_or_404
from rest_framework.response import Response
from rest_framework import status,generics
from .serializers import (
    UserSerializer,
    MyTokenObtainPairSerializer,
    PasswordResetRequestSerializer,
    PasswordResetConfirmSerializer,
    PsychologistProfileSerializer,
    PasswordChangeSerializer,
    PatientProfileSerializer,
    )
from rest_framework.views import APIView
from .utils import generate_otp,send_otp_email,CustomRefreshToken
from .models import EmailVerificationOTP,PsychologistProfile,ApprovalStatusChoices,PatientProfile
from django.db  import transaction
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.views import TokenObtainPairView,TokenRefreshView
import logging
from dotenv import load_dotenv
import os
from google.auth.transport import requests
from google.oauth2 import id_token
from rest_framework.permissions import AllowAny,IsAdminUser,IsAuthenticated
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.conf import settings
from rest_framework_simplejwt.tokens import RefreshToken, TokenError
from .permissions import IsPatient,IsPsychologist

# Create your views here.


load_dotenv()
User = get_user_model()
logger = logging.getLogger(__name__)

GOOGLE_CLIENT_ID= settings.GOOGLE_CLIENT_ID
class UserRegisterView(APIView):
        def post(self, request, format=None):
            serializer = UserSerializer(data = request.data, context = {'request' : request})           
            if serializer.is_valid():
                with transaction.atomic():
                    try:
                        user = serializer.save()
                        user.is_active = True
                        user.save()
                        otp = generate_otp()
                        print(otp)
                        send_otp_email(user.email,otp)
                    
                        otp_instance = EmailVerificationOTP.objects.create(user = user, otp = otp)
                        
                        logger.info(f"OTP sent successfully to {user.email}")
                        return Response({
                            'message': 'OTP sent successfully. Please verify your email.',
                            'email': user.email
                        }, status=status.HTTP_200_OK)
                    
                    except Exception as e:
                        
                        logger.error(f"Error during registration for {request.data.get('email')}: {e}", exc_info=True)                       
                        user.delete()
                        return Response({
                            'error': 'Failed to send OTP email'
                        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)                
            
            logger.warning(f"User registration failed due to invalid data: {serializer.errors}")    
            return Response(serializer.errors, status= status.HTTP_400_BAD_REQUEST)


class VerifyEmailOTPView(APIView):
    def post(self, request):

        email = request.data.get('email')
        otp = request.data.get('otp')
        
        if not email or not otp:

            logger.warning("Email or OTP not provided in request.")
            return Response({
                'error': 'Email and OTP are required'
            }, status=status.HTTP_400_BAD_REQUEST)        

        try:
            user = User.objects.get(email = email)
            otp_instance = EmailVerificationOTP.objects.get(user = user)
            if not otp_instance.is_valid():
                  logger.info(f"OTP expired for user: {email}")
                  return Response({"error": "OTP expired.  Resend OTP again"}, status=status.HTTP_400_BAD_REQUEST)
            
            if int(otp_instance.otp) == int(otp):
               
                user.is_email_verified = True
                user.is_active = True
                otp_instance.delete()
                user.save()

                logger.info(f"Email verified successfully for user: {email}")
                return Response({"message": "Email verified successfully."}, status=status.HTTP_200_OK)
            else:
                
                logger.warning(f"Invalid OTP entered for user: {email}")
                return Response({"error" : "Invalid OTP. Try again"}, status= status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            
            logger.error(f"OTP verification failed for user {email}: {e}", exc_info=True)
            return Response({"error" : "OTP verification failed. Try again"}, status= status.HTTP_400_BAD_REQUEST)


#view function to resend otp

class ResendOTPView(APIView):
    def post(self, request):
        email = request.data.get("email")

        try:
            user = User.objects.get(email=email)
            
            otp = generate_otp()
            print(otp)
            logger.debug(f"Generated OTP for {email}: {otp}")

            send_otp_email(user.email, otp)
            
            EmailVerificationOTP.objects.filter(user=user).delete()
            EmailVerificationOTP.objects.create(user=user, otp=otp)

            logger.info(f"OTP resent successfully to {email}.")
            return Response({"message": "OTP resent successfully."}, status=status.HTTP_200_OK)
        
        except User.DoesNotExist:
            logger.warning(f"User with email {email} does not exist.")
            return Response({"error": "User with this email does not exist."}, status=status.HTTP_400_BAD_REQUEST)
        
        except Exception as e:
            logger.error(f"Error occurred while resending OTP for {email}: {e}", exc_info=True)
            return Response({"error": "Failed to resend OTP. Try again."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


#view function for custom token obtain pair view by adding user id and role
class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

    def post(self, request, *args, **kwargs):

        response = super().post(request, *args, **kwargs)
        
        if response.status_code == status.HTTP_200_OK:
            
            access_token = response.data['access']
            refresh_token = response.data['refresh']
            role = response.data['role']
           
            response.data = {
                'access': access_token,
                'refresh':refresh_token,
                'role' : role, 
            }
           
        return response
     

#custom token referesh view to obtain refresh token from cookies
class CustomTokenRefreshView(TokenRefreshView):
    def post(self, request, *args, **kwargs):
       
        # refresh_token = request.COOKIES.get('refresh_token')
        refresh_token = request.data.get('refresh')

        
        if not refresh_token:
            return Response(
                {'error': 'Refresh token not found '},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        request.data['refresh'] = refresh_token

        return super().post(request, *args, **kwargs)


#view function for loggin out the user
class LogoutView(APIView):
    def post(self, request):
        response = Response({
            'message' : 'logged out succesfully',
        })
        response.delete_cookie('refresh_token')        
        return response

#login view for google authenticcation
class GoogleLoginView(APIView):
    """Authenticate user using Google OAuth and return JWT tokens"""

    def post(self, request):
        google_token = request.data.get("token")
        
        if not google_token:
            logger.warning("Google token is missing in the request.")
            return Response({"error": "Google token is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Verify the token with Google
            logger.debug("Verifying Google token.")
            id_info = id_token.verify_oauth2_token(google_token, requests.Request(), GOOGLE_CLIENT_ID)

            if "email" not in id_info:
                logger.error("Invalid token: Email not found in the token.")
                return Response({"error": "Invalid token"}, status=status.HTTP_400_BAD_REQUEST)
  
            email = id_info["email"]
            first_name = id_info["given_name"]
            last_name = id_info["family_name"]
            
            logger.info(f"Token verified for user: {email}")

            # Check if user exists or create a new one
            user, created = User.objects.get_or_create(email=email, defaults={
                "first_name": first_name,
                "last_name": last_name,
                "is_email_verified": True,
            })
            
            if created:
                logger.info(f"New user created: {email}")
            else:
                logger.info(f"User already exists: {email}")
            
            if not user.is_active:
                logger.warning(f"User account is disabled for email: {email}")
                return Response({"error": "User account is disabled"}, status=status.HTTP_403_FORBIDDEN)

            # Generate JWT tokens
            refresh = CustomRefreshToken.for_user(user)
            access_token = str(refresh.access_token)

            logger.info(f"JWT tokens generated for user: {email}")

            response = Response(
                {
                    'access': access_token,
                    'refresh': str(refresh),
                    'user': {
                        "id": user.id,
                        'email': user.email,
                        'role': user.role,
                    },
                    'role': user.role,
                },
                status=status.HTTP_200_OK
            )

            return response
        except ValueError as e:
            logger.error(f"Google token verification failed: {e}", exc_info=True)
            return Response({"error": "Invalid Google token"}, status=status.HTTP_400_BAD_REQUEST)

# API for requesting password reset
class PasswordResetRequestView(generics.GenericAPIView):
    serializer_class = PasswordResetRequestSerializer
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        
        if serializer.is_valid():
            serializer.save()
            logger.info("Password reset email sent successfully.")
            return Response({"message": "Password reset email sent."}, status=status.HTTP_200_OK)
        
        logger.warning(f"Invalid password reset request: {serializer.errors}")
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
        
#api view for confirming password reset
class PasswordResetConfirmView(generics.GenericAPIView):
    serializer_class = PasswordResetConfirmSerializer
    permission_classes = [AllowAny]

    def post(self, request, uidb64, token, *args, **kwargs):
      
        serializer = self.get_serializer(data=request.data, context={"uidb64": uidb64, "token": token})
        if serializer.is_valid():
            serializer.save()
            logger.info("Password reseted succesfully")
            return Response({"message": "Password reset successful."}, status=status.HTTP_200_OK)
        
        logger.warning(f"Invalid password reset confirmation: {serializer.errors}")
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



class CheckRefreshTokenView(APIView):
    def get(self, request):
        if request.COOKIES.get('refresh_token'):
            logger.info("Refresh token exists in cookies.")  
            return Response({"message": "Refresh token exists"}, status=status.HTTP_200_OK)
        else:
            logger.warning("Refresh token not found in cookies.")
            return Response({"message": "Refresh token not found"}, status=status.HTTP_404_NOT_FOUND)





#view for changing password of user
class PasswordChangeView(generics.UpdateAPIView):
    serializer_class = PasswordChangeSerializer
    permission_classes = [IsAuthenticated]

    def update(self, request, *args, **kwargs):
        
        serializer = self.get_serializer(data = request.data, context = {'request' : request})
        if serializer.is_valid():
            user = request.user
            user.set_password(serializer.validated_data['new_password'])
            user.save()
            logger.info(f"Password changed successfully for user: {user.email}")
            return Response({'detail': 'Password updated succesfully'}, status=status.HTTP_200_OK)
        
        logger.warning(f"Invalid password change request: {serializer.errors}")
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    


class UserProfileRetrieveCreateUpdateView(APIView):
    permission_classes=[IsPatient]
    
    def get(self,request):
        try:
            profile = PatientProfile.objects.get(user=request.user)
            serializer = PatientProfileSerializer(profile)
            logger.info(f"Retrieved profile for user: {request.user.email}")
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        except PatientProfile.DoesNotExist:
            logger.warning(f"Profile not found for user: {request.user.email}")
            return Response({'error': "Patient Profile Not Found"},status=status.HTTP_404_NOT_FOUND)

    def post(self, request, *args, **kwargs):
       
        serializer = PatientProfileSerializer(data = request.data, context = {'request':request})
        
        if serializer.is_valid():
            serializer.save(user=request.user)
            logger.info(f"Profile created successfully for user: {request.user.email}")
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        logger.warning(f"Invalid profile creation request: {serializer.errors}")
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
    
    def patch(self, request, *args, **kwargs):
        try:
            profile = PatientProfile.objects.get(user=request.user)
            
            serializer = PatientProfileSerializer(profile, data=request.data, partial=True, context={'request': request})
            if serializer.is_valid():
                serializer.save()
                logger.info(f"Profile updated successfully for user: {request.user.email}")
                return Response(serializer.data, status=status.HTTP_200_OK)
            
            logger.warning(f"Invalid profile update request: {serializer.errors}")
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        except PatientProfile.DoesNotExist:
            logger.warning(f"Profile not found for user: {request.user.email}")
            return Response({'error': "Patient Profile Not Found"}, status=status.HTTP_404_NOT_FOUND)



#view to handle psychologist profile creation
class PsychologistProfileRetrieveCreateUpdateView(APIView):
    permission_classes=[IsPsychologist]
    def get(self,request):
        try:
            profile = PsychologistProfile.objects.get(user=request.user)
            serializer = PsychologistProfileSerializer(profile)
            logger.info(f"Retrieved psychologist profile for user: {request.user.email}")   
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        except PsychologistProfile.DoesNotExist:
            logger.warning(f"Psychologist profile not found for user: {request.user.email}")
            return Response({'error': "PsychologistProfileNotFound"},status=status.HTTP_404_NOT_FOUND)

    def post(self, request, *args, **kwargs):
       
        serializer = PsychologistProfileSerializer(data = request.data, context = {'request':request})
        
        if serializer.is_valid():
            serializer.save(user=request.user,approval_status=ApprovalStatusChoices.PENDING)
            logger.info(f"Psychologist profile created successfully for user: {request.user.email}")
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        logger.warning(f"Invalid psychologist profile creation request: {serializer.errors}")
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
    
    def patch(self, request, *args, **kwargs):
        try:
            profile = PsychologistProfile.objects.get(user=request.user)
            serializer = PsychologistProfileSerializer(profile, data=request.data, partial=True, context={'request': request})
            if serializer.is_valid():
                serializer.save()
                logger.info(f"Psychologist profile updated successfully for user: {request.user.email}")
                return Response(serializer.data, status=status.HTTP_200_OK)
            logger.warning(f"Invalid psychologist profile update request: {serializer.errors}")
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        except PsychologistProfile.DoesNotExist:
            logger.warning(f"Psychologist profile not found for user: {request.user.email}")
            return Response({'error': "Patient Profile Not Found"}, status=status.HTTP_404_NOT_FOUND)

#view for getting the profiles of approved psychologists to be displayed in the page        
class GetPsychologistsView(generics.ListAPIView):
    queryset = PsychologistProfile.objects.filter(approval_status = ApprovalStatusChoices.APPROVED,user__is_blocked=False).order_by('-id')
    serializer_class = PsychologistProfileSerializer
    permission_classes = [AllowAny]

class GetPsychologistDetailView(generics.RetrieveAPIView):
    queryset = PsychologistProfile.objects.all()
    serializer_class = PsychologistProfileSerializer
    permission_classes = [AllowAny]


