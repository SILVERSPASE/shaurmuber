from django.test import TestCase
from apps.otc.user_registration_otc import UserRegistrationOTC
from apps.authentication.models import TempUser
from apps.common.models import City, Country
from django.test import Client
import json
from model_mommy import mommy

class UserRegistrationOTCTests(TestCase):

    def setUp(self):
        self.auth_user = mommy.make(TempUser, email='naidiuk.peter@gmail.com')
        self.country = mommy.make(Country, country_name="Ukraine")
        self.city = mommy.make(City, city_name="Kyiv", country=self.country)
        self.otc = UserRegistrationOTC(tmp_user_pk=self.auth_user.pk)

    def test_create(self):
        self.assertEqual(self.otc.otc.data['tmp_user_pk'], self.auth_user.pk)
        self.assertEqual(self.otc.otc.otc_type, 'user_registration')
        self.assertEqual(type(self.otc.otc.get_url()), str)
        url = '/'.join(['http://localhost/otc', str(self.otc.otc.uuid)])
        self.assertEqual(self.otc.otc.get_url(), url)

    # def test_execute(self):
    #     url = '/api/otc/'
    #     client = Client()
    #     data = {'uuid': str(self.otc.otc.uuid)}
    #     json_data = json.dumps(data)
    #     response = client.put(url,\
    #                      data=json_data,\
    #                      content_type='application/json')
    #     self.assertEqual(response.status_code, 200)
    #     print(response.content)
