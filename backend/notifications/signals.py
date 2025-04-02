from django.db.models.signals import post_save
from django.dispatch import receiver
from channels.layers import get_channel_layer
from consultations.models import Consultation
from chat.models import ChatMessage
from .models import Notification
from asgiref.sync import async_to_sync

@receiver(post_save, sender=ChatMessage)
def message_recieved_notification(sender, instance, created, **kwargs):
    if created:
        message = f"New message from {instance.sender.get_full_name()}: {instance.message}"
        Notification.objects.create(user=instance.receiver,message=message)

        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            f"notifications_{instance.receiver.id}",
            {"type": "send_notification", "message": message},
        )


@receiver(post_save, sender=Consultation)
def consultation_booked_notification(sender, instance, created, **kwargs):
    if created:        
        message = f"New consultation booked by {instance.patient.user.get_full_name()} on {instance.time_slot.date} - {instance.time_slot.start_time}!"
        Notification.objects.create(user=instance.time_slot.psychologist.user, message=message)

        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            f"notifications_{instance.time_slot.psychologist.user.id}",
            {"type": "send_notification", "message": message},
        )



