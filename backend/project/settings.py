"""
Django settings for shaurmuber project.

Generated by 'django-admin startproject' using Django 1.11.5.

For more information on this file, see
https://docs.djangoproject.com/en/1.11/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/1.11/ref/settings/
"""

import os

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

HOSTNAME = 'http://localhost'
# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/1.11/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = '%x^o6__5@u#kxs9rz$uibf#!^(h_d0)fwn_s4#c1w3w3(j!w4c'

# SECURITY WARNING: don't run with debug turned on in production!
# DEBUG = True

import sys
from project.develop import *

ALLOWED_HOSTS = ['95.46.99.233', '127.0.0.1', 'localhost']


# from project.production import *

# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'apps.otc',
    'apps.profiles',
    'apps.comments',
    'apps.authentication',
    'apps.common',
    'apps.notifications',
    'apps.orders',
    'apps.payments',
    'apps.messaging',
    'channels',
]

AUTH_USER_MODEL = 'authentication.AuthUser'


REST_FRAMEWORK = {

    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework.authentication.BasicAuthentication',
        'rest_framework.authentication.SessionAuthentication',
    )
  
}

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'project.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
                'social_django.context_processors.backends',
                'social_django.context_processors.login_redirect',
            ],
        },
    },
]

WSGI_APPLICATION = 'project.wsgi.application'


# Database
# https://docs.djangoproject.com/en/1.11/ref/settings/#databases

# DATABASES = {
#     'default': {
#         'ENGINE': 'django.db.backends.postgresql_psycopg2',
#         'NAME': 'shaurmuber',
#         'USER' : 'shaurmuberadmin',
#         'PASSWORD' : "shaurmuber2017",
#         'HOST' : 'postgres',
#         'PORT' :  '',
#         'TEST': {
#             'NAME': 'test_shaurmuber',
#         }
#     },
# }

# REDIS = {
#     "HOST" : "127.0.0.1",
#     "PORT" : 6379,
#     "LOCATION": "redis://127.0.0.1:6379/1",
#     "DB": 1,
# }



# # Cache settings

# CACHES = {
#     "default": {
#         "BACKEND": "django_redis.cache.RedisCache",
#         "LOCATION": REDIS['LOCATION'],
#         "OPTIONS": {
#             "CLIENT_CLASS": "django_redis.client.DefaultClient",
#         }
#     }
# }

# Password validation
# https://docs.djangoproject.com/en/1.11/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

AUTHENTICATION_BACKENDS = (
   'django.contrib.auth.backends.ModelBackend',
)


# Internationalization
# https://docs.djangoproject.com/en/1.11/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_L10N = True

USE_TZ = True


# Media files (user's data)

MEDIA_TMPUSERS = 'img/authentication/tmpusers/'

MEDIA_ROOT = os.path.join(BASE_DIR, 'media/img/profile')

MEDIA_URL = '/media/'

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/1.11/howto/static-files/

STATIC_URL = '/static/'

# Email settings
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 587
EMAIL_HOST_USER = 'shaurmuber@gmail.com'
EMAIL_HOST_PASSWORD = 'r4T-Rmk-V7g-qgD'
EMAIL_USE_TLS = True
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'

# SESSIONS SETTINGS

# SESSION_ENGINE = "django.contrib.sessions.backends.cache"
# SESSION_CACHE_ALIAS = "default"


# SECRET KEY for access to API
LIQPAY_PRIVATE_KEY = 'UyBwbFH0Q31Q6Ndbv7J5Bzerp9ScuHO7ViCDfFg2'

# Unique identificator of Shaurmuber in the LiqPay system
LIQPAY_PUBLIC_KEY = 'i85447013767'


CELERY_TIMEZONE = 'Europe/Kiev'

CONST = 55

redis_host = os.environ.get('REDIS_HOST', 'localhost')

# Channel layer definitions
CHANNEL_LAYERS = {
   "default": {
       "BACKEND": "asgi_redis.RedisChannelLayer",
       "CONFIG": {
           "hosts": [("localhost", 6379)],
       },
       "ROUTING": "project.routing.channel_routing",
   },
}

