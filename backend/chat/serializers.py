from rest_framework import serializers
from .models import ChatThread, ChatMessage

class ChatThreadSerializer(serializers.ModelSerializer):
    patient_name = serializers.CharField(source = 'user.user.get_full_name', required = False)
    psychologist_name = serializers.CharField(source = 'psychologist.user.get_full_name', required= False)
    patient_image = serializers.ImageField(source='user.profile_image', required=False)
    psychologist_image = serializers.ImageField(source='psychologist.profile_image', required= False)
    class Meta:
        model = ChatThread
        fields = '__all__'
    

    # def validate(self, data):
    #     """Ensure that user is a patient and psychologist is a psychologist"""
    #     user = data.get('user')
    #     psychologist = data.get('psychologist')

    #     if not hasattr(user, 'patient_profile'):
    #         raise serializers.ValidationError({"user": "The user must be a patient."})
    #     if not hasattr(psychologist, 'psychologist_profile'):
    #         raise serializers.ValidationError({"psychologist": "The psychologist must be a psychologist."})

    #     return data

class ChatMessageSerializer(serializers.ModelSerializer):
    sender_name = serializers.CharField(source="sender.get_full_name", read_only=True)
    sender_profile_image = serializers.SerializerMethodField()

    class Meta:
        model = ChatMessage
        fields = ['id', 'thread', 'sender', 'sender_name', 'message', 'timestamp', 'sender_profile_image']

    def get_sender_profile_image(self, obj):
        """
        Fetch the sender's profile image from either PatientProfile or PsychologistProfile.
        """
        if hasattr(obj.sender, 'patient_profile') and obj.sender.patient_profile.profile_image:
            return obj.sender.patient_profile.profile_image.url  # Fetch from PatientProfile
        elif hasattr(obj.sender, 'psychologist_profile') and obj.sender.psychologist_profile.profile_image:
            return obj.sender.psychologist_profile.profile_image.url  # Fetch from PsychologistProfile
        return None  
