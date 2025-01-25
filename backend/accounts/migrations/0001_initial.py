# Generated by Django 5.1.5 on 2025-01-25 14:30

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='CustomUser',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('last_login', models.DateTimeField(blank=True, null=True, verbose_name='last login')),
                ('first_name', models.CharField(max_length=255)),
                ('last_name', models.CharField(max_length=255)),
                ('email', models.EmailField(max_length=254, unique=True)),
                ('mobile_number', models.CharField(max_length=15)),
                ('password', models.CharField(max_length=128)),
                ('role', models.CharField(choices=[('Patient', 'Patient'), ('Psychologist', 'Psychologist'), ('Admin', 'Admin')], default='Patient', max_length=20)),
                ('is_email_verified', models.BooleanField(default=False)),
                ('is_blocked', models.BooleanField(default=False)),
                ('is_active', models.BooleanField(default=True)),
                ('is_staff', models.BooleanField(default=False)),
                ('is_superuser', models.BooleanField(default=False)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='PatientProfile',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('profile_image', models.ImageField(blank=True, null=True, upload_to='profile_images/')),
                ('date_of_birth', models.DateField(blank=True, null=True)),
                ('gender', models.CharField(choices=[('Male', 'Male'), ('Female', 'Female'), ('NonBinary', 'Non-Binary'), ('Unspecified', 'Unspecified')], default='Unspecified', max_length=20)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='patient_profile', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='PsychologistProfile',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('profile_image', models.ImageField(blank=True, null=True, upload_to='profile_images/')),
                ('date_of_birth', models.DateField(blank=True, null=True)),
                ('gender', models.CharField(choices=[('Male', 'Male'), ('Female', 'Female'), ('NonBinary', 'Non-Binary'), ('Unspecified', 'Unspecified')], default='Unspecified', max_length=20)),
                ('about_me', models.TextField()),
                ('qualification', models.CharField(max_length=255)),
                ('experience', models.PositiveIntegerField()),
                ('specialization', models.CharField(blank=True, max_length=255, null=True)),
                ('fees', models.DecimalField(decimal_places=2, max_digits=10)),
                ('id_card', models.ImageField(upload_to='id_cards/')),
                ('education_certificate', models.ImageField(upload_to='certificates/education/')),
                ('experience_certificate', models.ImageField(upload_to='certificates/experience/')),
                ('is_verified', models.BooleanField(default=False)),
                ('is_active', models.BooleanField(default=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='psychologist_profile', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
