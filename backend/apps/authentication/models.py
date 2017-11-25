import uuid

from datetime import datetime, timedelta

from django.db import models
from django.conf import settings
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.contrib.postgres.fields import ArrayField, JSONField

from apps.common.models import City
from apps.profiles.models import Profile


class UserManager(BaseUserManager):
    """Define a model manager for User model with no username field."""

    use_in_migrations = True

    def _create_user(self, email, password, **extra_fields):
        """Create and save a User with the given email and password."""
        if not email:
            raise ValueError('The given email must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, email, password=None, **extra_fields):
        """Create and save a regular User with the given email and password."""
        extra_fields.setdefault('is_staff', False)
        extra_fields.setdefault('is_superuser', False)
        return self._create_user(email, password, **extra_fields)

    def create_superuser(self, email, password=None, **extra_fields):
        """Create and save a super User with the given email and password."""
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self._create_user(email, password, **extra_fields)

    def save(self):
        if self.deleted:
            self.purge_date = datetime.now() + timedelta(months=3)
        if not self.deleted:
            self.purge_date = ""
        return super(UserManager, self).save()

    def change_email(self, email):
        self.email = email
        self.save()

# TODO : username = blank, ne unique, charfield

class AuthUser(AbstractUser):
    username = None
    uuid = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    email = models.EmailField(max_length=255, unique=True, blank=True)
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)
    deleted = models.BooleanField(default=False)
    purge_date = models.DateTimeField(blank=True, null=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []
    objects = UserManager()

    def get_image(self):
        return self.profile.image.url

    def get_profile_id(self):
        return self.profile.pk

    def get_profile_uuid(self):
        return self.profile.uuid


class TempUser(models.Model):
    first_name = models.CharField(max_length=30, blank=True)
    last_name = models.CharField(max_length=30, blank=True)
    password = models.CharField(max_length=30, blank=True)
    email = models.EmailField(blank=True)
    phone_number = models.CharField(max_length=20, blank=True)
    image = models.ImageField(upload_to=settings.MEDIA_TMPUSERS, null=True, blank=True, default="profile.png")
    blocked_users = ArrayField(models.IntegerField(), null=True, blank=True)
    rating = models.DecimalField(max_digits=1, decimal_places=1, null=True,
                                 blank=True)
    city = models.CharField(max_length=30, null=True, blank=True)
    notification_info = JSONField(default={}) # TODO : delete this field
    share_info = JSONField(default={}) # TODO : delete this field
    card_number = models.CharField(max_length=16, null=True, blank=True)
    birth_date = models.DateField(null=True, blank=True)
    about_me = models.TextField(null=True, blank=True)
    register_finished = models.BooleanField(default=False)
    created = models.DateTimeField(auto_now_add=True, null=True, blank=True)
    updated = models.DateTimeField(auto_now=True)

    def register(self):
        auth_user_exist = AuthUser.objects.filter(email=self.email).exists()
        if auth_user_exist:
            raise ValueError('User with email {} already exists'.format(
                self.email))

        if self.city and City.objects.filter(city_name=self.city).exists():
            city = City.objects.get(city_name=self.city)
        else:
            city = City.objects.get(city_name='Kyiv') # TODO : DEFAULT_CITY in settings

        user = AuthUser.objects.create_user(self.email, self.password,
                                            first_name=self.first_name,
                                            last_name=self.last_name)
        profile_info = {
            'phone_number': self.phone_number,
            'image': self.image,
            'city': city,
            'card_number': self.card_number,
            'birth_date': self.birth_date,
            'about_me': self.about_me
        }
        profile = Profile.objects.create(user=user, **profile_info)
        self.register_finished = True
        self.save() 
        return True
