# Generated by Django 5.1.5 on 2025-03-07 06:22

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('consultations', '0004_delete_payment'),
        ('payments', '0002_remove_payment_consultation_payment_user'),
    ]

    operations = [
        migrations.AddField(
            model_name='consultation',
            name='payment',
            field=models.OneToOneField(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='payments.payment'),
        ),
    ]
