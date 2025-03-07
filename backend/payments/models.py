from django.db import models
from consultations.models import Consultation
from django.utils.translation import gettext_lazy as _

# Create your models here.

class PaymentStatus(models.TextChoices):
    PENDING = 'Pending', _('Pending')
    COMPLETED = 'Completed', _('Completed')
    FAILED = 'Failed', _('Failed')

class PaymentGateways(models.TextChoices):
    RAZORPAY = "Razorpay", _('Razorpay')


class Payment(models.Model):
    consultation = models.OneToOneField(Consultation, on_delete=models.CASCADE, related_name='payment')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_status = models.CharField(max_length=20,choices=PaymentStatus.choices, default=PaymentStatus.PENDING)
    payment_gateway = models.CharField(max_length=20, choices = PaymentGateways.choices)
    transaction_id = models.CharField(max_length=100, blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.amount:
            self.amount = self.consultation.time_slot.psychologist.fees
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Payment for {self.consultation.patient.user.first_name} {self.consultation.patient.user.last_name} - {self.amount}"
