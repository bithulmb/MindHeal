from django.db import models
from django.contrib.auth import get_user_model
from django.utils.translation import gettext_lazy as _

# Create your models here.
User = get_user_model()

class ComplaintStatusChoices(models.TextChoices):
    PENDING = 'Pending', _('Pending')
    RESOLVED = 'Resolved', _('Resolved')
 

class Complaint(models.Model):
   
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='complaints')
    subject = models.CharField(max_length=255)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=10, choices=ComplaintStatusChoices, default=ComplaintStatusChoices.PENDING)
    resolution_message = models.TextField(blank=True, null=True)
    resolved_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"{self.subject} by {self.user}"