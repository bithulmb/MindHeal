from .models import CustomUser, PatientProfile, PsychologistProfile
from rest_framework import serializers
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
import re
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
import os
from django.conf import settings
from .utils import send_reset_password_mail
from rest_framework.exceptions import PermissionDenied


User = get_user_model()
FRONTEND_URL = settings.FRONTEND_URL
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name', 'email', 'role',
            'is_email_verified', 'is_blocked', 'is_active', 'is_staff', 'is_superuser','password',
            'created_at', 'updated_at']
        read_only_fields = ['role','is_email_verified', 'is_blocked', 'is_active', 'is_staff', 'is_superuser',
            'created_at', 'updated_at']
        extra_kwargs = {
            'password' : {
                'write_only' : True
            }
        }
    
    def validate_first_name(self, value):
        """ Ensure first name contains only alphabets """
        if not re.match(r"^[A-Za-z]+(\s[A-Za-z]+)*$", value):
            raise serializers.ValidationError("First name should only contain alphabets.")
        return value

    def validate_last_name(self, value):
        """ Ensure last name contains only alphabets """
        if not re.match(r"^[A-Za-z]+(\s[A-Za-z]+)*$", value):
            raise serializers.ValidationError("Last name should only contain alphabets.")
        return value
    
    def create(self, validated_data):
        request = self.context.get('request')
        if request and request.data.get('isPsychologist'):
            validated_data['role'] = 'Psychologist'
       
        user = User.objects.create_user(**validated_data)
     
        return user

class PatientProfileSerializer(serializers.ModelSerializer):
    
    first_name = serializers.CharField(source = 'user.first_name', required = False)
    last_name = serializers.CharField(source='user.last_name', required=False)
    
    class Meta:
        model = PatientProfile        
        fields = ['id', 'user', 'date_of_birth', 
                 'gender','occupation', 'mobile_number', 'medical_history', 'profile_image','created_at', 'updated_at','first_name','last_name']
        read_only_fields = ['created_at', 'updated_at']
        depth = 1
    
    def update(self, instance, validated_data):
        user_data = validated_data.pop('user',{})
        if user_data:
            user = instance.user
            if 'first_name' in user_data:
                user.first_name = user_data['first_name']
            if 'last_name' in user_data:
                user.last_name = user_data['last_name']
            user.save()
        return super().update(instance, validated_data)


class PsychologistProfileSerializer(serializers.ModelSerializer):    
    class Meta:
        model = PsychologistProfile
        fields = ('id', 'user', 'profile_image', 'date_of_birth', 'gender',
                 'mobile_number', 'about_me', 'qualification', 'experience', 'specialization',
                 'fees', 'id_card', 'education_certificate', 
                 'experience_certificate', 'approval_status','is_admin_approved',
                 'created_at', 'updated_at')
        read_only_fields = ('is_admin_verified', 'created_at', 'updated_at')
        depth = 1


#serializer to include user email,name and role in jwt
class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        token['email'] = user.email
        token['name'] = user.first_name + " " + user.last_name
        token['role'] = user.role
        token['is_email_verified'] = user.is_email_verified
        token['is_blocked'] = user.is_blocked
       
        return token
    
    
    def validate(self, attrs):
        data = super().validate(attrs)
        user = self.user  # Get the authenticated user

        if user.is_blocked:
            raise PermissionDenied('Your account is blocked. Access is forbidden.')
        
        # Include role in the response
        data["role"] = user.role  
        self.refresh_token = data['refresh']
        
        return data



#serilaizer for requesting password reset mail
class PasswordResetRequestSerializer(serializers.Serializer):
    email = serializers.EmailField()
    def validate_email(self,value):
        try:
            user = User.objects.get(email=value)
        except User.DoesNotExist:
            raise serializers.ValidationError("User with this email does not exist.")
        return value
    def save(self):
        email = self.validated_data['email']
        user = User.objects.get(email=email)


        # Generate Password Reset Token
        token = PasswordResetTokenGenerator().make_token(user)
        uid = urlsafe_base64_encode(force_bytes(user.pk))

        reset_link = f"{FRONTEND_URL}user/reset-password-confirm/{uid}/{token}"

        send_reset_password_mail(email,reset_link)


class PasswordResetConfirmSerializer(serializers.Serializer):
    password = serializers.CharField(write_only=True, min_length=6)

    def validate(self, data):
        """
        Validate the UID and token from the URL.
        """
        uidb64 = self.context.get("uidb64")
        token = self.context.get("token")
        try:
            uid = urlsafe_base64_decode(uidb64).decode()
            user = User.objects.get(pk=uid)
            

            if not PasswordResetTokenGenerator().check_token(user, token):
                raise serializers.ValidationError("Invalid or expired token.")

            data["user"] = user  # Attach the user object to validated data
        except (User.DoesNotExist, ValueError, TypeError):
            raise serializers.ValidationError("Invalid token or user ID.")

        return data

    def save(self):
        """
        Update the user's password.
        """
      
        user = self.validated_data["user"]      
        password = self.validated_data["password"]
        user.set_password(password)
        user.save()

#serializer for changing password of the user
class PasswordChangeSerializer(serializers.Serializer):
    old_password = serializers.CharField(required = True)
    new_password = serializers.CharField(required = True)

    def validate_old_password(self, value):
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError("Old Password is not correct")
        return value
    def validate_new_password(self, value):
        if len(value) < 8:
            raise serializers.ValidationError("New password must contain atleat 8 characters")
        return value

       
