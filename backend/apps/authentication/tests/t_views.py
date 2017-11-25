from django.test import TestCase, RequestFactory
from apps.authentication.api.views import UserAuthenticationAPIView


class UserAuthenticationAPIViewTest(TestCase):
    
    def setUp(self):
        self.factory = RequestFactory()
        print("1")

    def test_view(self):
        print("2")
        request = self.factory.post('/api/auth/registration/',
                                    {'first_name': "name",
                                     'last_name': "surname",
                                     'password': "11111",
                                     'email': "user@gmail.com",
                                     'phone_number': "38000000000"},
                                    format='json')
        print("3")
    
        response = UserAuthenticationAPIView.as_view()(request)
        print("4")
        self.assertEqual(response.status_code, 201)
        print("5")
