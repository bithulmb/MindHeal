from django.db import models
from django.utils.translation import gettext_lazy as _
from django.contrib.auth import get_user_model

# Create your models here.

User = get_user_model()
class PaymentStatus(models.TextChoices):
    PENDING = 'Pending', _('Pending')
    SUCCESS = 'Success', _('Success')
    FAILED = 'Failed', _('Failed')

class PaymentGateways(models.TextChoices):
    RAZORPAY = "Razorpay", _('Razorpay')


class Payment(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, blank=True, null=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_status = models.CharField(max_length=20,choices=PaymentStatus.choices, default=PaymentStatus.PENDING)
    payment_gateway = models.CharField(max_length=20, choices = PaymentGateways.choices)
    transaction_id = models.CharField(max_length=100, blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


    def __str__(self):
        return f"Payment for {self.user.first_name} - {self.amount}"
