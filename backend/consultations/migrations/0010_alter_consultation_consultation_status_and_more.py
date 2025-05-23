# Generated by Django 5.1.5 on 2025-04-30 15:41

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0012_alter_customuser_first_name_and_more'),
        ('consultations', '0009_alter_consultation_payment'),
    ]

    operations = [
        migrations.AlterField(
            model_name='consultation',
            name='consultation_status',
            field=models.CharField(choices=[('Scheduled', 'Scheduled'), ('Completed', 'Completed'), ('Cancelled', 'Cancelled')], db_index=True, default='Scheduled', max_length=20),
        ),
        migrations.AlterField(
            model_name='timeslot',
            name='is_expired',
            field=models.BooleanField(db_index=True, default=False),
        ),
        migrations.AddIndex(
            model_name='timeslot',
            index=models.Index(fields=['date', 'start_time'], name='date_start_time_idx'),
        ),
        migrations.AddIndex(
            model_name='timeslot',
            index=models.Index(fields=['psychologist', 'is_active', 'is_booked', 'is_expired'], name='consultatio_psychol_7ef87f_idx'),
        ),
    ]
