from django.contrib import admin
from apps.authentication.models import AuthUser
from .models import Profile


admin.site.register([AuthUser, Profile])
# Register your models here.
