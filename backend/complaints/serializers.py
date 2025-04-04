from rest_framework import serializers
from .models import Complaint

class ComplaintSerializer(serializers.ModelSerializer):
   
    full_name = serializers.SerializerMethodField()

    class Meta:
        model = Complaint
        fields = '__all__'
        read_only_fields = ['user','resolved_at']

    def get_full_name(self, obj):
        return f"{obj.user.first_name} {obj.user.last_name}".strip()