from django.db import models
from accounts.models import PsychologistProfile,PatientProfile
from django.utils import timezone
from django.core.exceptions import ValidationError
from datetime import datetime, timedelta
from django.utils.translation import gettext_lazy as _
import uuid
from payments.models import Payment

# Create your models here.

class ConsultationStatus(models.TextChoices):
    PENDING = 'Pending', _('Pending')
    SCHEDULED = 'Scheduled', _('Scheduled')
    COMPLETED = 'Completed', _('Completed')
    CANCELLED = 'Cancelled', _('Cancelled')

class TimeSlot(models.Model):
    psychologist = models.ForeignKey(PsychologistProfile, on_delete=models.CASCADE, related_name='time_slots', blank=True)
    date = models.DateField()
    start_time = models.TimeField()
    end_time = models.TimeField()
    is_booked = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    is_expired = models.BooleanField(default=False)  #for changing to true when not booked at the end of each day.
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['date','start_time']
        constraints = [models.UniqueConstraint(fields=['psychologist','date','start_time'], name="unique_psychologist_timeslot")]
    
    def clean(self):
        
        #checking end time is always greater than start time
        if self.start_time >= self.end_time:
            raise ValidationError({'end_time': 'End time must be after start time'})

        #checking date should not be previous and time shoudl not be before
        if self.date < timezone.now().date():
            raise ValidationError({'date': 'Cannot create time slots in the past date'})
        elif self.date == timezone.now().date() and self.start_time < timezone.now().time():
            raise ValidationError({'start_time': 'Cannot create time slots in the past'})
        
        #checking whether each time slot duration is 1 hour
        slot_start = datetime.combine(datetime.today(), self.start_time)
        slot_end = datetime.combine(datetime.today(), self.end_time)
        duration = slot_end - slot_start
        if duration != timedelta(hours=1):
            raise ValidationError({'TimeSlot must be 1 hour'})

        # Check for overlapping time slots
        overlapping_slots = TimeSlot.objects.filter(
            psychologist=self.psychologist,
            date=self.date,
            start_time__lt=self.end_time,
            end_time__gt=self.start_time,
        ).exclude(pk=self.pk)  

        if overlapping_slots.exists():
            raise ValidationError("This time slot overlaps with an existing slot.")

    def save(self, *args, **kwargs):
        if self.pk is None:
            self.clean()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.psychologist.user.first_name} - {self.date} - {self.start_time} to {self.end_time}"
    

class Consultation(models.Model):
    patient = models.ForeignKey(PatientProfile, on_delete=models.CASCADE, related_name='consultations')
    time_slot = models.OneToOneField(TimeSlot, on_delete=models.CASCADE, related_name='consultation')
    consultation_status = models.CharField(max_length=20, choices=ConsultationStatus, default=ConsultationStatus.SCHEDULED) 
    payment = models.OneToOneField(Payment, on_delete=models.CASCADE, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        
        self.time_slot.is_booked = True
        self.time_slot.save()
        super().save(*args, **kwargs)


    def __str__(self):
        return f"Consultation: {self.patient.user.first_name} with {self.time_slot.psychologist.user.first_name} on {self.time_slot.date} at {self.time_slot.start_time} "

