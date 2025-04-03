
from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Wallet, PatientProfile

@receiver(post_save, sender = PatientProfile)
def create_wallet(sender, instance,created,**kwargs):
    if created:
        Wallet.objects.create(patient=instance)
        