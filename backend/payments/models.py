from django.db import models
from django.utils.translation import gettext_lazy as _
from django.contrib.auth import get_user_model
from accounts.models import PatientProfile
from decimal import Decimal


# Create your models here.

User = get_user_model()
class PaymentStatus(models.TextChoices):
    PENDING = 'Pending', _('Pending')
    SUCCESS = 'Success', _('Success')
    FAILED = 'Failed', _('Failed')

class PaymentGateways(models.TextChoices):
    RAZORPAY = "Razorpay", _('Razorpay')
    WALLET = "Wallet", _('Wallet')


class Payment(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, blank=True, null=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_status = models.CharField(max_length=20,choices=PaymentStatus.choices, default=PaymentStatus.PENDING)
    payment_gateway = models.CharField(max_length=20, choices = PaymentGateways.choices)
    transaction_id = models.CharField(max_length=100, blank=True, null=True)
    

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


    def __str__(self):
        return f"Payment for {self.user.first_name} - {self.amount} payment_id={self.id}"


class Wallet(models.Model):
    patient = models.OneToOneField(PatientProfile, on_delete=models.CASCADE, related_name="wallet")
    balance = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    updated_at = models.DateTimeField(auto_now=True)

    def credit(self, amount, description=""):
        """Add amount to the wallet"""
        amount = Decimal(str(amount))
        self.balance += amount
        self.save()
        WalletTransaction.objects.create(wallet=self, amount=amount, transaction_type="CREDIT", description=description)
    def debit(self, amount,description=""):
        """Deduct amount from the wallet (ensure sufficient balance)"""
        amount = Decimal(str(amount))
        if self.balance >= amount:
            self.balance -= amount
            self.save()
            WalletTransaction.objects.create(wallet=self, amount=-amount, transaction_type="DEBIT", description=description)
            return True
        return False

    def __str__(self):
        return f"{self.patient.user.email} - Balance: {self.balance}"

class WalletTransaction(models.Model):
    TRANSACTION_TYPE_CHOICES = (
        ("CREDIT", "CREDIT"),
        ("DEBIT", "DEBIT"),
    )

    wallet = models.ForeignKey(Wallet, on_delete=models.CASCADE, related_name="transactions")
    transaction_type = models.CharField(max_length=10, choices=TRANSACTION_TYPE_CHOICES)
    amount = models.DecimalField(max_digits=8, decimal_places=2)
    description = models.CharField(max_length=250, null=True, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.transaction_type} of {self.amount} "