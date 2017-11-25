import uuid
import json
from apps.otc.models import OneTimeCode
from apps.authentication.models import AuthUser

# When TmpUser will be complited
# uncomment 22 and 23 string and delete this comment

class ChangeEmailOTC(object):

    def __init__(self, otc_object=None, auth_user_pk=None, email=None):
        if otc_object:
            self.otc = otc_object
        if auth_user_pk:
            self.otc = OneTimeCode(otc_type='email_changing',\
                                   data={'auth_user_pk': auth_user_pk, 'new_email': email})
            self.otc.save()

    def execute(self):
        user = AuthUser.objects.get(pk=self.otc.data['auth_user_pk'])
        user.changeEmail(self.data['email'])
        self.otc.deactivate()
        return json.dumps({'valid': True, 'type': 'email_changing'})

    def get_url(self):
        return self.otc.get_url()
