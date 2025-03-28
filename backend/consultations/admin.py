from django.contrib import admin
from .models import Consultation, TimeSlot, Review

# Register your models here.
admin.site.register(Consultation)
admin.site.register(TimeSlot)
admin.site.register(Review)

