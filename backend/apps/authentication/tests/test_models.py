from django.test import TestCase
from model_mommy import mommy

from apps.authentication.models import AuthUser, TempUser
from apps.common.models import City, Country


class AuthUserModelTest(TestCase):

    def setUp(self):
        self.auth_user = mommy.make(AuthUser, email='test@test.com')

    def test_auth_user_model(self):
        self.assertIsInstance(self.auth_user, AuthUser)
        self.assertEqual(self.auth_user.email, 'test@test.com')


class TempUserModelTest(TestCase):

    def setUp(self):
        self.country = Country.objects.create(country_name='Ukraine')
        self.city = City.objects.create(country=self.country, latitude=1.1234,
                                        longitude=2.1234, city_name='Kyiv')
        self.tmp_user = mommy.make(TempUser, first_name='name',
                                   last_name='surname', city=str(self.city),
                                   password='12345678', email='test@gmail.com',
                                   phone_number='3800000000')
        self.tmp_user1 = mommy.make(TempUser, first_name='name',
                                    last_name='surname', city=str(self.city),
                                    password='12345678',
                                    email='test1@gmail.com',
                                    phone_number='3800000000')

        self.auth_user = mommy.make(AuthUser, email='test@gmail.com')

    def test_tmp_user_model(self):
        self.assertIsInstance(self.tmp_user, TempUser)

    def test_auth_user_exist(self):
        self.assertRaises(ValueError, self.tmp_user.register)

    def test_tmp_user_register_success(self):
        self.assertTrue(self.tmp_user1.register)
