from django.db import models
from apps.authentication.models import AuthUser
import uuid
import datetime
from django.utils.timezone import utc
from django.conf import settings
class Comments(models.Model):

    class Status:
        # open for all users
        public = 'public'
        #deleted
        deleted = 'deleted'

    STATUS_CHOICES = (
        ("public", Status.public),
        ("deleted", Status.deleted)
    )
    uuid = models.UUIDField(default=uuid.uuid4, editable=False, unique=True, primary_key=True)
    sender = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='comments_from_customer')
    recipient = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='comments_from_curier')
    date = models.DateTimeField(auto_now_add=True)
    content = models.TextField(null=False, blank=False)
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default='public')

    def get_sender_first_name(self):
        return self.sender.first_name

    def get_sender_last_name(self):
        return self.sender.last_name

    def get_recipient_first_name(self):
        return self.recipient.first_name

    def get_recipient_last_name(self):
        return self.recipient.last_name

    def get_sender_uuid(self):
        return self.sender.uuid

    def get_recipient_uuid(self):
        return self.recipient.uuid


    def get_time_diff(self):
        if self.date:
            now = datetime.datetime.utcnow().replace(tzinfo=utc)
            timediff = now - self.date
            return timediff.total_seconds()
