from rest_framework import serializers
from .models import TimeSlot,Consultation,Review
from django.utils import timezone
from datetime import datetime,timedelta
from accounts.models import PsychologistProfile


class TimeSlotSerializer(serializers.ModelSerializer):
    psychologist = serializers.StringRelatedField(read_only=True)

    def validate(self, data):
        """
        Custom validation for the entire object, using request context for psychologist.
        """
       
        date = data.get('date')
        start_time = data.get('start_time')
        end_time = data.get('end_time')

        # Get psychologist from request context (set by the view)        
        request = self.context.get('request')
        
        if not request :
            raise serializers.ValidationError('Psychologist information is missing or invalid.')

        psychologist = PsychologistProfile.objects.get(user = request.user)

        
        if start_time >= end_time:
            raise serializers.ValidationError({'end_time': 'End time must be after start time'})

        
        now = timezone.now()
        if date < now.date():
            raise serializers.ValidationError({'date': 'Cannot create time slots in the past date'})
        elif date == now.date() and start_time < now.time():
            raise serializers.ValidationError({'start_time': 'Cannot create time slots in the past'})

       
        slot_start = datetime.combine(date, start_time)
        slot_end = datetime.combine(date, end_time)
        duration = slot_end - slot_start
        if duration != timedelta(hours=1):
            raise serializers.ValidationError('Time slot must be exactly 1 hour')

        #Checking  for overlapping time slots
        overlapping_slots = TimeSlot.objects.filter(
            psychologist=psychologist,
            date=date,
            start_time__lt=end_time,  
            end_time__gt=start_time,  
        ).exclude(pk=self.instance.pk if self.instance else None)  

        if overlapping_slots.exists():
            raise serializers.ValidationError('This time slot overlaps with an existing slot.')

        return data
    
    class Meta:
        model = TimeSlot
        fields = '__all__'
        read_only_fields = ['is_booked', 'created_at', 'updated_at','psychologist']

class ConsultationSerializer(serializers.ModelSerializer):
    # patient_name = serializers.CharField(source = 'patient.user.first_name', read_only = True)
    # psychologist_name = serializers.CharField(source = 'time_slot.psychologist.user.first_name', read_only = True)
    patient_name = serializers.SerializerMethodField()
    psychologist_name = serializers.SerializerMethodField()

    class Meta:
        model = Consultation
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at','patient']
        depth = 1
    
    #method for serialzier field
    def get_patient_name(self, obj):
        return f"{obj.patient.user.first_name} {obj.patient.user.last_name}".strip()
    
    #method for serializer field
    def get_psychologist_name(self, obj):
        return f"{obj.time_slot.psychologist.user.first_name} {obj.time_slot.psychologist.user.last_name}".strip()
    
    
    def validate_time_slot(self,value):
        if value.is_booked:
            raise serializers.ValidationError("this time slot is already booked")
        
        if value.date < timezone.now().date():
            raise serializers.ValidationError('Cannot book past time slots.')
        return value


    
class ReviewSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.get_full_name',read_only=True)
    class Meta:
        model = Review
        fields = ["id", "consultation", "user","user_name", "rating", "comment", "created_at"]
        read_only_fields = ["user", 'user_name',"created_at"]  
    

       
     