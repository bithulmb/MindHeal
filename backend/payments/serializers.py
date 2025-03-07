from rest_framework import serializers
from .models import Payment

class PaymentSerializer(serializers.ModelSerializer):
    # patient_name = serializers.CharField(source='consultation.patient.user.first_name', read_only=True)
    # psychologist_name = serializers.CharField(source='consultation.time_slot.psychologist.user.first_name', read_only=True)

    class Meta:
        model = Payment
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']
