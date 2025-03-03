from rest_framework import serializers
from .models import TimeSlot,Consultation,Payment
from django.utils import timezone


class TimeSlotSerializer(serializers.ModelSerializer):
    psychologist = serializers.StringRelatedField(read_only=True)
    
    class Meta:
        model = TimeSlot
        fields = '__all__'
        read_only_fields = ['is_booked', 'created_at', 'updated_at','psychologist']

class ConsultationSerializer(serializers.ModelSerializer):
    patient_name = serializers.CharField(source = 'patient.user.first_name', read_only = True)
    psychologist_name = serializers.CharField(source = 'time_slot.psychologist.user.first_name', read_only = True)

    class Meta:
        model = Consultation
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']
    
    def validate_time_slot(self,value):
        if value.is_booked:
            raise serializers.ValidationError("this time slot is already booked")
        
        if value.date < timezone.now().date():
            raise serializers.ValidationError('Cannot book past time slots.')
        return value

class PaymentSerializer(serializers.ModelSerializer):
    patient_name = serializers.CharField(source='consultation.patient.user.first_name', read_only=True)
    psychologist_name = serializers.CharField(source='consultation.time_slot.psychologist.user.first_name', read_only=True)

    class Meta:
        model = Payment
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']


    