from django.db import models
from apps.authentication.models import AuthUser
from apps.orders.models import Order


class PayRequest(models.Model):
    order = models.ForeignKey(Order)
    # rename following fields
    payee = models.ForeignKey(AuthUser, related_name='customers')
    payor = models.ForeignKey(AuthUser, null=True, blank=True,
                              related_name='couriers')
    created = models.DateTimeField(auto_now_add=True, null=True, blank=True)


class Transaction(models.Model):

    class Status:
        approved = 'approved'
        declined = 'declined'

    STATUS_CHOICES = (
        ("approved", Status.approved),
        ("declined", Status.declined)
    )

    pay_request = models.ForeignKey(PayRequest)
    created = models.DateTimeField(auto_now_add=True, null=True, blank=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES)
