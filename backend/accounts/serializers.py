from .models import CustomUser, PatientProfile, PsychologistProfile
from rest_framework import serializers
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name', 'email', 'mobile_number', 'role',
            'is_email_verified', 'is_blocked', 'is_active', 'is_staff', 'is_superuser','password',
            'created_at', 'updated_at']
        read_only_fields = ['role','is_email_verified', 'is_blocked', 'is_active', 'is_staff', 'is_superuser',
            'created_at', 'updated_at']
        extra_kwargs = {
            'password' : {
                'write_only' : True
            }
        }
    
    def create(self, validated_data):
        print(self.context)
        request = self.context.get('request')
        if request and request.data.get('isPsychologist'):
            validated_data['role'] = 'Psychologist'
       
        user = User.objects.create_user(**validated_data)
        print("created user",user)
        return user

class PatientProfileSerializer(serializers.ModelField):
    
    user = UserSerializer(read_only=True)

    class Meta:
        model = PatientProfile        
        fields = ['id', 'user', 'profile_image', 'date_of_birth', 
                 'gender', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']



class PsychologistProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = PsychologistProfile
        fields = ('id', 'user', 'profile_image', 'date_of_birth', 'gender',
                 'about_me', 'qualification', 'experience', 'specialization',
                 'fees', 'id_card', 'education_certificate', 
                 'experience_certificate', 'is_admin_verified', 'is_active',
                 'created_at', 'updated_at')
        read_only_fields = ('is_admin_verified', 'is_active', 'created_at', 'updated_at')


#serializer to include user id and role in jwt
class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        token['user_id'] = user.id
        token['role'] = user.role
       

        return token


