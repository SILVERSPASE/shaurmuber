from .models import OneTimeCode
from .user_registration_otc import UserRegistrationOTC

class OTCFabric(object):

    def fabric(self, otc_object=None):
        if not otc_object:
            return False
        if otc_object.otc_type == 'user_registration':
            return UserRegistrationOTC(otc_object=otc_object)
        return False
