import os
from celery import Celery
from celery.schedules import crontab


os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")

celery_app = Celery("backend")

celery_app.config_from_object("django.conf:settings", namespace="CELERY")

celery_app.autodiscover_tasks()

celery_app.conf.beat_schedule = {
    "expire-unbooked-slots-every-night" : {
        "task" : 'consultations.tasks.expire_unbooked_slots',
        'schedule' : crontab(hour=0, minute=0)
    },
}