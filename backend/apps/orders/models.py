from django.db import models
from apps.authentication.models import AuthUser
from django.contrib.postgres.fields import JSONField
import uuid


class Order(models.Model):

    class Status:
        draft = 'draft'
        # open for all users
        public = 'public'
        # after choosing a candidate
        waiting_for_payment = 'waiting_for_payment'
        active = 'active'
        # confirm by courier
        delivered = 'delivered'
        canceled_by_customer = 'canceled_by_customer'
        canceled_by_courier = 'canceled_by_courier'
        # confirm by customer
        done = "done"

    STATUS_CHOICES = (
        ("draft", Status.draft),
        ("public", Status.public),
        ("waiting_for_payment", Status.waiting_for_payment),
        ("active", Status.active),
        ("delivered", Status.delivered),
        ("canceled_by_customer", Status.canceled_by_customer),
        ("canceled_by_courier", Status.canceled_by_courier),
        ("done", Status.done)
    )

# geo django
# for price float field (positive decimal field)
# created updated add 
# m2m field through Candidate

    title = models.CharField(max_length=400)
    cordinate_from = JSONField()
    cordinate_to = JSONField()
    distance = models.CharField(max_length=10, default=1)
    customer = models.ForeignKey(AuthUser, related_name='created_orders')
    curier = models.ForeignKey(AuthUser, null=True, blank=True, related_name='related_orders')
    delivery_price = models.IntegerField()
    order_price = models.IntegerField()
    description = models.TextField(null=True, blank=True)
    from_time = models.DateTimeField(null=True, blank=True)
    to_time = models.DateTimeField(null=True, blank=True)
    status = models.CharField(max_length=30, choices=STATUS_CHOICES)
    uuid = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)

    def __str__(self):
        return self.title

    # get customer rate for filtering function on frontend
    def get_customers_rate(self):
        return self.customer.profile.rating


class Candidate(models.Model):
    order = models.ForeignKey(Order, related_name="candidates")
    candidate = models.ForeignKey(AuthUser)
    timeBid = models.DateTimeField(auto_now_add=True)
    isChosen= models.BooleanField(default=False)


# Order.objects.orders-filter(candidates__candidate__id=self.request.user)
