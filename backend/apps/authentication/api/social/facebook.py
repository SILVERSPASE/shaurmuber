import requests


class Facebook(object):

	def get_user_data(self, request):

		if 'access_token' in self.request:
			pass