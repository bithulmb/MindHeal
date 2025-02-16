from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager,User
from django.utils.translation import gettext_lazy as _
from django.utils import timezone
from datetime import timedelta
from cloudinary.models import CloudinaryField

# Create your models here.

#Enum Choices table for storing user roles
class UserRole(models.TextChoices):
    PATIENT = 'Patient', _('Patient')
    PSYCHOLOGIST = 'Psychologist', _('Psychologist')
    ADMIN = 'Admin', _('Admin')

# Custom User Manager
class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError(_('The Email field must be set'))
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('role', UserRole.ADMIN)
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(email, password, **extra_fields)


#Enum choices table for storing gender 
class Gender(models.TextChoices):
    MALE = 'Male', _('Male')
    FEMALE = 'Female', _('Female')
    NON_BINARY = 'NonBinary', _('Non-Binary')
    UNSPECIFIED = 'Unspecified', _('Unspecified')

# Custom User Model
class CustomUser(AbstractBaseUser):
    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=128)
    role = models.CharField(max_length=20, choices=UserRole.choices, default=UserRole.PATIENT)
    is_email_verified = models.BooleanField(default=False)
    is_blocked = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = CustomUserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name']

    def __str__(self):
        return self.email
    
    def has_perm(self, perm, obj=None):
        return self.is_superuser

    def has_module_perms(self, add_label):
        return True

# Patient Profile Model
class PatientProfile(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='patient_profile')
    profile_image = CloudinaryField('profile_image', folder="users/profile_images", blank=True, null=True)
    date_of_birth = models.DateField(blank=True, null=True)
    gender = models.CharField(max_length=20, choices=Gender.choices, default=Gender.UNSPECIFIED)
    mobile_number = models.CharField(max_length=15,blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.first_name} {self.user.last_name} - Patient Profile"


# Psychologist Profile Model
class PsychologistProfile(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='psychologist_profile')
    profile_image = CloudinaryField('profile_image', folder="psychologists/profile_images", blank=True, null=True)
    date_of_birth = models.DateField(null=True, blank=True)
    gender = models.CharField(max_length=20, choices=Gender.choices, default=Gender.UNSPECIFIED)
    mobile_number = models.CharField(max_length=15,blank=True, null=True)
    about_me = models.TextField()
    qualification = models.CharField(max_length=255)
    experience = models.PositiveIntegerField() 
    specialization = models.CharField(max_length=255, null=True, blank=True)
    fees = models.DecimalField(max_digits=10, decimal_places=2)
    id_card = CloudinaryField('id_card', folder="psychologists/id_cards")
    education_certificate = CloudinaryField('education_certificate', folder="psychologists/education_certificates")
    experience_certificate = CloudinaryField('experience_certificate', folder="psychologists/experience_certificates")
    is_admin_verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.first_name} {self.user.last_name} - Psychologist"
    

class EmailVerificationOTP(models.Model):
    user = models.ForeignKey(CustomUser, on_delete= models.CASCADE)
    otp = models.CharField(max_length=8)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()

    def is_valid(self):
        return timezone.now() <= self.expires_at 

    def save(self, *args, **kwargs):
        if not self.expires_at:
            self.expires_at = timezone.now() + timedelta(minutes=5)
        super().save(*args, **kwargs)

class UserMedia(models.Model):
    title = models.CharField(max_length=100)
    media_file = models.ImageField(upload_to='test/')
    image_file = CloudinaryField('image', folder='test/images/', blank=True, null =True)