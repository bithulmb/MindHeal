from django.contrib import admin
from .models import Consultation, TimeSlot, Payment

# Register your models here.
admin.site.register(Consultation)
admin.site.register(TimeSlot)
admin.site.register(Payment)
