from django.db.models.signals import post_delete
from django.dispatch import receiver
import cloudinary.uploader
from .models import PsychologistProfile

@receiver(post_delete, sender = PsychologistProfile)
def delete_cloudinary_file(sender, instance, **kwargs):
    print("inside signal")
    
    try:
        cloudinary.uploader.destroy(instance.profile_image.public_id)
        cloudinary.uploader.destroy(instance.id_card.public_id)
        cloudinary.uploader.destroy(instance.education_certificate.public_id)
        cloudinary.uploader.destroy(instance.experience_certificate.public_id)
    except Exception as e:
        print("failed to delete", e)

