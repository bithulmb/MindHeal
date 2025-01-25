from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager,User
from django.utils.translation import gettext_lazy as _

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
    mobile_number = models.CharField(max_length=15)
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
    profile_image = models.ImageField(upload_to='profile_images/', blank=True, null=True)
    date_of_birth = models.DateField(blank=True, null=True)
    gender = models.CharField(max_length=20, choices=Gender.choices, default=Gender.UNSPECIFIED)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.first_name} {self.user.last_name} - Patient Profile"


# Psychologist Profile Model
class PsychologistProfile(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='psychologist_profile')
    profile_image = models.ImageField(upload_to='profile_images/', blank=True, null=True)
    date_of_birth = models.DateField(blank=True, null=True)
    gender = models.CharField(max_length=20, choices=Gender.choices, default=Gender.UNSPECIFIED)
    about_me = models.TextField()
    qualification = models.CharField(max_length=255)
    experience = models.PositiveIntegerField()  # Years of experience
    specialization = models.CharField(max_length=255, null=True, blank=True)
    fees = models.DecimalField(max_digits=10, decimal_places=2)
    id_card = models.ImageField(upload_to='id_cards/')
    education_certificate = models.ImageField(upload_to='certificates/education/')
    experience_certificate = models.ImageField(upload_to='certificates/experience/')
    is_verified = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.first_name} {self.user.last_name} - Psychologist"