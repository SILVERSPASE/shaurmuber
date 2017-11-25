import uuid
import json
from apps.otc.models import OneTimeCode
from apps.authentication.models import TempUser
from apps.notifications.notifications import Notifications

class UserRegistrationOTC:

    def __init__(self, otc_object=None, tmp_user_pk=None):
        if otc_object:
            self.otc = otc_object
        if tmp_user_pk:
            self.otc = OneTimeCode(
                otc_type='user_registration',
                data={'tmp_user_pk': tmp_user_pk}
            )
            self.otc.save()

    def execute(self):
        # TODO : get object or 404
        tmp_user = TempUser.objects.get(pk=self.otc.data['tmp_user_pk'])
        tmp_user.register()
        self.otc.deactivate()
        Notifications.send_registration_success(tmp_user)
        return json.dumps({'valid': True, 'type': 'user_registration'})

    def get_url(self):
        return self.otc.get_url()
