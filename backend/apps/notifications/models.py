from django.db import models
from django.db.models.fields import EmailField


class EmailLog(models.Model):
    email = models.EmailField(max_length=70, null=False)
    subject = models.CharField(max_length=255, null=False)
    html_body = models.TextField(null=False)
    sent_choices = (
        ('OK', 'Sent'),
        ('KO', 'Not sent'),
        ('KK', 'Unexpected problems')
    )
    status = models.CharField(max_length=2, choices=sent_choices,
                              null=False, default='KO')
    sent_log = models.TextField(null=True)
    sent_date = models.DateTimeField(auto_now_add=True, null=False)
