from celery import shared_task
from django.utils import timezone
from .models import TimeSlot


@shared_task
def expire_unbooked_slots():
  

    try:
        today = timezone.now().date()

        expired_slots = TimeSlot.objects.filter(is_booked=False, date__lt=today, is_expired=False)

        count = expired_slots.update(is_expired = True)

        return f"Marked {count} slots as expired."
    
    except Exception as e:
        
        return f"Error updating timeslots: {str(e)}"