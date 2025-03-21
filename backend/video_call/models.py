from django.db import models
from accounts.models import PatientProfile,PsychologistProfile
from consultations.models import Consultation

# Create your models here.
    
class VideoCallSession(models.Model):
    user = models.ForeignKey(PatientProfile, on_delete=models.CASCADE, related_name='user_sessions')
    psychologist = models.ForeignKey(PsychologistProfile, on_delete=models.CASCADE, related_name='psychologist_sessions')
    channel_name = models.CharField(max_length=100, unique=True)
    consultation = models.OneToOneField(Consultation, on_delete=models.CASCADE, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.user.first_name} - {self.psychologist.user.first_name} ({self.channel_name})"