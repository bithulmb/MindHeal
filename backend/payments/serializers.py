from rest_framework import serializers
from .models import Payment,Wallet,WalletTransaction

class PaymentSerializer(serializers.ModelSerializer):
    # patient_name = serializers.CharField(source='consultation.patient.user.first_name', read_only=True)
    # psychologist_name = serializers.CharField(source='consultation.time_slot.psychologist.user.first_name', read_only=True)

    class Meta:
        model = Payment
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']

class WalletSerializer(serializers.ModelSerializer):
    class Meta:
        model = Wallet
        fields = ['balance']

class WalletTransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = WalletTransaction
        fields = ['transaction_type', 'amount', 'timestamp', 'description']
