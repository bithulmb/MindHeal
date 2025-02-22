# Generated by Django 5.1.5 on 2025-02-22 09:17

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0010_rename_is_admin_verified_psychologistprofile_is_admin_approved_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='patientprofile',
            name='medical_history',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='patientprofile',
            name='occupation',
            field=models.CharField(blank=True, max_length=25, null=True),
        ),
        migrations.AlterField(
            model_name='psychologistprofile',
            name='approval_status',
            field=models.CharField(choices=[('Pending', 'Pending'), ('Approved', 'Approved'), ('Rejected', 'Rejected')], default='Pending', max_length=20),
        ),
    ]
