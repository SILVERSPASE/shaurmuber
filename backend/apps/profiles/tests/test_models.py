from django.test import TestCase
from model_mommy import mommy

from apps.authentication.models import AuthUser
from apps.profiles.models import Profile


class ProfileModelTest(TestCase):

    def setUp(self):
        self.auth_user = mommy.make(AuthUser)
        self.profile = mommy.make(Profile, user=self.auth_user)

    def test_profile_model(self):
        self.assertIsInstance(self.profile, Profile)
        self.assertIsInstance(self.profile.user, AuthUser)
