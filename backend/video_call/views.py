from django.shortcuts import render
from rest_framework.views import APIView
from agora_token_builder import RtcTokenBuilder
from django.conf import settings
from rest_framework import status
from rest_framework.response import Response
import time
import random
import string
from rest_framework.permissions import IsAuthenticated
from .serializers import VideoCallSessionSerializer
from .models import VideoCallSession
from consultations.models import Consultation
from src import token04
import json
from accounts.models import PatientProfile, PsychologistProfile


# Create your views here.

class CreateChannelView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        
        consultation_id = request.data.get('consultation_id')
      
        try:
            consultation = Consultation.objects.get(id=consultation_id) 
    
            user_id = consultation.patient.id
            psychologist_id = consultation.time_slot.psychologist.id
        except Consultation.DoesNotExist:
            return Response({'error': "invalid consultation id"}, status=status.HTTP_400_BAD_REQUEST)   
        
        # Check if the requesting user is the patient or psychologist
        if request.user.id not in [user_id, psychologist_id]:
            return Response({'error': "You are not authorized for this consultation"}, status=status.HTTP_403_FORBIDDEN)

        # Check if a session already exists for this consultation
        try:
            existing_session = VideoCallSession.objects.get(consultation_id=consultation_id)
            serializer = VideoCallSessionSerializer(existing_session)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except VideoCallSession.DoesNotExist:
            
            # If no session exists, create a new one
            letters = string.ascii_lowercase
            channel_name = ''.join(random.choice(letters) for i in range(10))

            channel_data = {
                'channel_name': channel_name,
                'user': user_id,
                'psychologist': psychologist_id,
                'consultation': consultation_id,  
            }

            serializer = VideoCallSessionSerializer(data=channel_data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
class GenerateZegoTokenView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        # Get parameters from the request body
        user_id = request.data.get('user_id')
        room_id = request.data.get('room_id', '') 
        is_psychologist = request.data.get('is_psychologist')

        # Validate required input
        if not user_id:
            return Response(
                {"error": "user_id is required"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if is_psychologist:
            profile = PsychologistProfile.objects.get(id=user_id) 
        else:
            profile = PatientProfile.objects.get(id=user_id)
        
        if request.user != profile.user:
            return Response({"error": "You are not authorized to generate this token"}, status=status.HTTP_403_FORBIDDEN)
        
        # Retrieve app_id and server_secret from environment variables
        app_id = int(settings.ZEGO_APP_ID)  
        server_secret = settings.ZEGO_SERVER_SECRET
        effective_time_in_seconds = 3600  

        try:
            # Determine if strict token is needed (e.g., if room_id is provided)
            if room_id:
                
                payload = {
                    "room_id": room_id,
                    "privilege": {
                        1: 1,  # Login privilege enabled
                        2: 1   # Publish privilege enabled
                    },
                    "stream_id_list": None  # No specific stream IDs
                }
                payload_json = json.dumps(payload)
            else:
                # General token with empty payload
                payload_json = ""

            # Generate the token using Zego's token04 module
            token_info = token04.generate_token04(
                app_id=app_id,
                user_id=user_id,
                secret=server_secret,
                effective_time_in_seconds=effective_time_in_seconds,
                payload=payload_json
            )

            # Check for errors in token generation
            if token_info.error_code != token04.ERROR_CODE_SUCCESS:
                return Response(
                    {
                        "error": "Failed to generate token",
                        "error_code": token_info.error_code,
                        "error_message": token_info.error_message
                    },
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )

            # Return the generated token
            return Response(
                {"token": token_info.token},
                status=status.HTTP_200_OK
            )

        except Exception as e:
            
            return Response(
                {"error": f"An error occurred: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )