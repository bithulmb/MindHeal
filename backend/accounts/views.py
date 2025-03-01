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

GOOGLE_CLIENT_ID= os.getenv('GOOGLE_CLIENT_ID')
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
                        # send_otp_email(user.email,otp)
                    
                        otp_instance = EmailVerificationOTP.objects.create(user = user, otp = otp)
                        
                        return Response({
                            'message': 'OTP sent successfully. Please verify your email.',
                            'email': user.email
                        }, status=status.HTTP_200_OK)
                    
                    except Exception as e:
                        
                        print(e)                        
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
            print(otp)
            # send_otp_email(user.email, otp)
            
            EmailVerificationOTP.objects.filter(user=user).delete()
            EmailVerificationOTP.objects.create(user=user, otp=otp)

            return Response({"message": "OTP resent successfully."}, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({"error": "User with this email does not exist."}, status=status.HTTP_400_BAD_REQUEST)


#view function for custom token obtain pair view by adding user id and role
class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

    def post(self, request, *args, **kwargs):

        response = super().post(request, *args, **kwargs)
        
        if response.status_code == status.HTTP_200_OK:
            
            access_token = response.data['access']
            refresh_token = response.data['refresh']
            role = response.data['role']
           
            # response.set_cookie(
            #     key='refresh_token',
            #     value=refresh_token,
            #     httponly=True,  
            #     secure=False, 
            #     samesite=None,  
            #     max_age=7 * 24 * 60 * 60
            # )

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
        print("logged out")
        return response


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
  
            email = id_info["email"]
            first_name = id_info["given_name"]
            last_name = id_info["family_name"]
            

            # Check if user exists or create a new one
            user, created = User.objects.get_or_create(email=email, defaults={
                "first_name" :first_name,
                "last_name" : last_name,
                "is_email_verified" : True,
            })
            
            if not user.is_active:
                return Response({"error": "User account is disabled"}, status=status.HTTP_403_FORBIDDEN)

           
            refresh = CustomRefreshToken.for_user(user)
            access_token = str(refresh.access_token)
            response = Response(
                {
                    'access': access_token,
                    'refresh' : str(refresh),
                    'user': {
                         "id": user.id,
                        'email': user.email,
                        'role': user.role,  
                    },
                    'role' : user.role,
                },
                status=status.HTTP_200_OK
            )
            # response.set_cookie(
            #     key='refresh_token',
            #     value=refresh,
            #     httponly=True,
            #     secure= True,
            #     samesite='Lax'
            # )
            

            return response
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



class CheckRefreshTokenView(APIView):
    def get(self, request):
        if request.COOKIES.get('refresh_token'):  
            return Response({"message": "Refresh token exists"}, status=status.HTTP_200_OK)
        else:
            return Response({"message": "Refresh token not found"}, status=status.HTTP_404_NOT_FOUND)



# class PsychologistProfileView(generics.CreateAPIView):
#     serializer_class = PsychologistProfileSerializer
#     permission_classes = [IsAuthenticated]  

#     def perform_create(self, serializer):
#         print(self.request)
#         serializer.save(user=self.request.user)  


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
            return Response({'detail': 'Password updated succesfully'}, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

# class UserProfileRetrieveUpdateView(generics.RetrieveUpdateAPIView):
#     serializer_class = PatientProfileSerializer
#     permission_classes = [IsPatient]
    
    
#     def get_object(self):
#         return get_object_or_404(PatientProfile, user=self.request.user)

class UserProfileRetrieveCreateUpdateView(APIView):
    permission_classes=[IsPatient]
    
    def get(self,request):
        try:
            profile = PatientProfile.objects.get(user=request.user)
            serializer = PatientProfileSerializer(profile)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except PatientProfile.DoesNotExist:
            return Response({'error': "Patient Profile Not Found"},status=status.HTTP_404_NOT_FOUND)

    def post(self, request, *args, **kwargs):
       
        serializer = PatientProfileSerializer(data = request.data, context = {'request':request})
        
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
    
    def patch(self, request, *args, **kwargs):
        try:
            profile = PatientProfile.objects.get(user=request.user)
            serializer = PatientProfileSerializer(profile, data=request.data, partial=True, context={'request': request})
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except PatientProfile.DoesNotExist:
            return Response({'error': "Patient Profile Not Found"}, status=status.HTTP_404_NOT_FOUND)



#view to handle psychologist profile creation
class PsychologistProfileRetrieveCreateUpdateView(APIView):
    permission_classes=[IsPsychologist]
    def get(self,request):
        try:
            profile = PsychologistProfile.objects.get(user=request.user)
            serializer = PsychologistProfileSerializer(profile)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except PsychologistProfile.DoesNotExist:
            return Response({'error': "PsychologistProfileNotFound"},status=status.HTTP_404_NOT_FOUND)

    def post(self, request, *args, **kwargs):
       
        serializer = PsychologistProfileSerializer(data = request.data, context = {'request':request})
        
        if serializer.is_valid():
            serializer.save(user=request.user,approval_status=ApprovalStatusChoices.PENDING)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
    def patch(self, request, *args, **kwargs):
        try:
            profile = PsychologistProfile.objects.get(user=request.user)
            serializer = PsychologistProfileSerializer(profile, data=request.data, partial=True, context={'request': request})
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except PsychologistProfile.DoesNotExist:
            return Response({'error': "Patient Profile Not Found"}, status=status.HTTP_404_NOT_FOUND)

    