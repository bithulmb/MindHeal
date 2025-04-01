from django.db.models.signals import post_delete
from django.dispatch import receiver
from .models import Consultation

@receiver(post_delete, sender=Consultation)
def delete_associated_payment(sender, instance, **kwargs):
    if instance.payment:
        instance.payment.delete()
        print("payment deleted")