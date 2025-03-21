from rest_framework import serializers
from .models import VideoCallSession


class VideoCallSessionSerializer(serializers.ModelSerializer):
    class Meta:
        model = VideoCallSession
        fields = '__all__'