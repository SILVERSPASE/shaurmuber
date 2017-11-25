DEBUG = True

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': 'shaurmuber',
        'USER' : 'shaurmuberadmin',
        'PASSWORD' : "shaurmuber2017",
        'HOST' : '127.0.0.1',
        'PORT' :  '',
        'TEST': {
            'NAME': 'test_shaurmuber',
        }
    },
}

REDIS = {
    "HOST" : "127.0.0.1",
    "PORT" : 6379,
    "LOCATION": "redis://127.0.0.1:6379/1",
    "DB": 1,
}

# Cache settings

CACHES = {
    "default": {
        "BACKEND": "django_redis.cache.RedisCache",
        "LOCATION": REDIS['LOCATION'],
        "OPTIONS": {
            "CLIENT_CLASS": "django_redis.client.DefaultClient",
        }
    }
}

SESSION_ENGINE = "django.contrib.sessions.backends.cache"
SESSION_CACHE_ALIAS = "default"
