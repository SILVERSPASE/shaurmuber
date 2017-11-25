import uuid
from django.db import models
from django.contrib.postgres.fields import JSONField
from django.conf import settings 


OTC_TYPE = [
    ('user_registration', 'user_registration'),
    ('email_changing', 'email_changing'),
]

# Create your models here.
class OneTimeCode(models.Model):
    uuid = models.UUIDField(primary_key=True, default=uuid.uuid1, editable=False)
    otc_type = models.CharField(max_length=20, blank=True)
    data = JSONField(blank=True)
    active = models.BooleanField(default=True)
    created_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.otc_type

    def deactivate(self):
        self.active = False
        self.save()

    def get_url(self):
        return '{hostname}/{url}'.format(hostname=settings.HOSTNAME, url="/".join(['otc', str(self.uuid)]))
