from . import tasks
from django.conf import settings

# settings, which are used in Notification`s methods
# for sending emails and saving data to database
smtp_settings = (settings.EMAIL_HOST_USER, settings.EMAIL_HOST_PASSWORD,
                 settings.EMAIL_HOST, settings.EMAIL_PORT)
database_settings = (settings.DATABASES['default']['NAME'],
                     settings.DATABASES['default']['USER'],
                     settings.DATABASES['default']['PASSWORD'],
                     settings.DATABASES['default']['HOST'])


class Notifications(object):

    @staticmethod
    def send_registration_otc(user, otc_url):
        email = user.email
        context = {
            'first_name': user.first_name,
            'last_name': user.last_name,
            'otc_url': otc_url
        }
        tasks.send_registration_otc_task.delay(email, smtp_settings,
                                               database_settings, context=context)

    @staticmethod
    def send_registration_success(user):
        email = user.email
        context = {
            'first_name': user.first_name,
            'last_name': user.last_name
        }
        tasks.send_registration_success_task.delay(email, smtp_settings,
                                                   database_settings, context=context)

    @staticmethod
    def send_reset_password_otc(user, otc_url):
        email = user.email
        context = {
            'first_name': user.first_name,
            'last_name': user.last_name,
            'otc_url': otc_url
        }
        tasks.send_reset_password_otc_task.delay(email, smtp_settings,
                                                 database_settings, context=context)

    @staticmethod
    def send_reset_password_success(user):
        email = user.email
        context = {
            'first_name': user.first_name,
            'last_name': user.last_name
        }
        tasks.send_reset_password_success_task.delay(email, smtp_settings,
                                                     database_settings, context=context)

    @staticmethod
    def send_reset_email_otc(user, otc_url):
        email = user.email
        context = {
            'first_name': user.first_name,
            'last_name': user.last_name,
            'otc_url': otc_url
        }
        tasks.send_reset_email_otc_task.delay(email, smtp_settings,
                                              database_settings, context=context)

    @staticmethod
    def send_reset_email_success(user):
        email = user.email
        context = {
            'first_name': user.first_name,
            'last_name': user.last_name
        }
        tasks.send_reset_email_success_task.delay(email, smtp_settings,
                                                  database_settings, context=context)
