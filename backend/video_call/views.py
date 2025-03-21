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

# Create your views here.

class GenerateTokenView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
   
        app_id = settings.AGORA_APP_ID
        app_certificate = settings.AGORA_APP_CERTIFICATE

        channel_name = request.data.get('channel_name')
        uid = request.data.get('uid')

        expiration_time_in_seconds = 3600  # Token valid for 1 hour
        current_timestamp = int(time.time())
        privilege_expired_ts = current_timestamp + expiration_time_in_seconds

        # Generate token
        token = RtcTokenBuilder.buildTokenWithUid(
            app_id, app_certificate, channel_name, uid, 1, privilege_expired_ts
        )

        return Response({
            'token': token,
            'channel_name': channel_name,
            'app_id': app_id,
            'uid': uid
        })


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
                'consultation': consultation_id,  # Add consultation_id to the session
            }

            serializer = VideoCallSessionSerializer(data=channel_data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)