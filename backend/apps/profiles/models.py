from django.db import models
from django.conf import settings
from django.contrib.postgres.fields import ArrayField, JSONField
import uuid

from apps.common.models import City


class Profile(models.Model):
    default_notifications = {
        'about new orders in my city': True,
        'about new feautures': True,
        'when somebody take my order': True,
        'when customer approved me like a curier': True,
        'when curier cancel my order': True,
        'when somebody comment me': True,
    }

    privacy_policy = {
        'email': True,
        'phone': True,
        'city': True,
        'birth_date': True,
        'about_me': True,
    }

    user = models.OneToOneField(settings.AUTH_USER_MODEL, related_name="profile")
    phone_number = models.CharField(max_length=20, blank=True)
    image = models.ImageField(null=True, blank=True)
    blocked_users = ArrayField(models.IntegerField(), null=True, blank=True)
    rating = models.DecimalField(max_digits=3, decimal_places=2, default=0.0)
    number_of_people_who_vote = models.IntegerField(default=0)
    sum_of_rating = models.IntegerField(default=0)
    city = models.ForeignKey(City, null=True, blank=True)
    notification_info = JSONField(default=default_notifications)
    share_info = JSONField(default=privacy_policy)
    card_number = models.CharField(max_length=16, null=True, blank=True)
    birth_date = models.DateField(null=True, blank=True)
    about_me = models.TextField(null=True, blank=True)
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

    def get_public_email(self):
        if self.share_info['email']:
            return self.user.email
        return "Private"

    def get_public_phone(self):
        if self.share_info['phone']:
            return self.phone_number
        return "Private"

    def get_public_city(self):
        if self.share_info['city']:
            return self.city
        return "Private"

    def get_my_city_lat(self):
        return self.city.latitude

    def get_my_city_lng(self):
        return self.city.longitude

    def get_public_birth_date(self):
        if self.share_info['birth_date']:
            return self.birth_date
        return "Private"

    def get_public_about_me(self):
        if self.share_info['about_me']:
            return self.about_me
        return "Private"

    def get_image(self):
        return self.image

class Places(models.Model):
    type_choices = (
        ('From', 'From'),
        ('To', 'To')
    )
    type = models.CharField(max_length=4, choices=type_choices,null=False, default='From')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='user')
    title = models.CharField(max_length=250, blank=False, null=False)
    coordinates = JSONField()
