import json
import redis


from django_redis import get_redis_connection
from django.conf import settings
from django.core.cache import cache
from datetime import datetime
from django.conf import settings

from django.core.cache import cache


class WebNotifications():

	def __init__(self, user_uuid, text, action):	
		self.user_uuid = user_uuid
		self.text = text
		self.action = action

	def send(self):
		r = redis.Redis(host=settings.REDIS['HOST'], port=settings.REDIS['PORT'], db=settings.REDIS['DB'],)
		channel = 'django_web_notifications:{user_uuid}:message'.format(
			user_uuid=self.user_uuid,
		)
		message = json.dumps(
			{'text': self.text, 'action': self.action}
		)
		r.publish(channel, message)
		return True

		



