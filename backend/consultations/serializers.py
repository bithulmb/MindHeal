from rest_framework import serializers
from .models import TimeSlot,Consultation,Payment
from django.utils import timezone
from datetime import datetime,timedelta
from accounts.models import PsychologistProfile


class TimeSlotSerializer(serializers.ModelSerializer):
    psychologist = serializers.StringRelatedField(read_only=True)

    def validate(self, data):
        """
        Custom validation for the entire object, using request context for psychologist.
        """
        # Extract fields from data
        date = data.get('date')
        start_time = data.get('start_time')
        end_time = data.get('end_time')

        # Get psychologist from request context (set by the view)
        print(self.context)
        request = self.context.get('request')
        print(request,request.user)
        if not request :
            raise serializers.ValidationError('Psychologist information is missing or invalid.')

        psychologist = PsychologistProfile.objects.get(user = request.user)

        # 1. Check if end_time is after start_time
        if start_time >= end_time:
            raise serializers.ValidationError({'end_time': 'End time must be after start time'})

        # 2. Check past date/time
        now = timezone.now()
        if date < now.date():
            raise serializers.ValidationError({'date': 'Cannot create time slots in the past date'})
        elif date == now.date() and start_time < now.time():
            raise serializers.ValidationError({'start_time': 'Cannot create time slots in the past'})

        # 3. Check 1-hour duration
        slot_start = datetime.combine(date, start_time)
        slot_end = datetime.combine(date, end_time)
        duration = slot_end - slot_start
        if duration != timedelta(hours=1):
            raise serializers.ValidationError('Time slot must be exactly 1 hour')

        # 4. Check for overlapping time slots
        overlapping_slots = TimeSlot.objects.filter(
            psychologist=psychologist,
            date=date,
            start_time__lt=end_time,  # Starts before this slot ends
            end_time__gt=start_time,  # Ends after this slot starts
        ).exclude(pk=self.instance.pk if self.instance else None)  # Exclude current instance for updates

        if overlapping_slots.exists():
            raise serializers.ValidationError('This time slot overlaps with an existing slot.')

        return data
    
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


    