from rest_framework import serializers
from .models import ChatThread, ChatMessage

class ChatThreadSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatThread
        fields = '__all__'
    

    def validate(self, data):
        """Ensure that user is a patient and psychologist is a psychologist"""
        user = data.get('user')
        psychologist = data.get('psychologist')

        if not hasattr(user, 'patient_profile'):
            raise serializers.ValidationError({"user": "The user must be a patient."})
        if not hasattr(psychologist, 'psychologist_profile'):
            raise serializers.ValidationError({"psychologist": "The psychologist must be a psychologist."})

        return data

class ChatMessageSerializer(serializers.ModelSerializer):
    sender_name = serializers.CharField(source="sender.username", read_only=True)

    class Meta:
        model = ChatMessage
        fields = ['id', 'thread', 'sender', 'sender_name', 'message', 'timestamp']
