from django.db.models.signals import post_delete,pre_save
from django.dispatch import receiver
import cloudinary.uploader
from .models import PsychologistProfile,PatientProfile

@receiver(post_delete, sender = PsychologistProfile)
def delete_cloudinary_file(sender, instance, **kwargs):
    """ signal to delete the media files of a instance of 
    psychologist profile model when an instance is deleted"""
    
    try:
        if instance.profile_image:
            cloudinary.uploader.destroy(instance.profile_image.public_id)
        if instance.id_card:
            cloudinary.uploader.destroy(instance.id_card.public_id)
        if instance.education_certificate:
            cloudinary.uploader.destroy(instance.education_certificate.public_id)
        if instance.experience_certificate:
            cloudinary.uploader.destroy(instance.experience_certificate.public_id)
        print("deleted")
    except Exception as e:
        print("failed to delete", e)

@receiver(post_delete,sender = PatientProfile)
def delete_profile_image(sender, instance, **kwargs):
    """signal to delete the profile picture of patient when an instance is deleted"""
    try :
        if instance.profile_image:
            cloudinary.uploader.destroy(instance.profile_image.public_id)
            print("deleted")
    except Exception as e:
        print("failed to delete", e)


@receiver(pre_save, sender = PatientProfile)
def delete_old_profile_image(sender, instance, **kwargs):
    """signal to delted the old profile picture when the profile picture is updated"""
    #if the instance is newly created one, skip the signal
    if not instance.pk:
        return 
   
    try:
        old_instance = sender.objects.get(pk=instance.pk)
       
       
        if old_instance.profile_image and instance.profile_image and str(old_instance.profile_image) != str(instance.profile_image):
            old_public_id = old_instance.profile_image.public_id
            try:
                cloudinary.uploader.destroy(old_public_id)
                print(f"Deleted old image: {old_public_id}")
            except Exception as e:
               print(f"Failed to delete old image {old_public_id}: {e}")
    except Exception as e:
        print("no old instance ", e)


