from rest_framework import routers
from django.conf.urls import url

from .views import DialogViewSet, MessageViewSet, DialogDetailViewSet


router = routers.SimpleRouter()

# TODO: at this time user don`t get list of dialogs, for implementation in future
# /api/dialogs
# router.register(r'', DialogViewSet, base_name="dialog_list")

# /api/dialogs/id
router.register(r'', DialogDetailViewSet, base_name="dialog_detail")

# /api/dialogs/id/messages
router.register(r'(?P<pk>[1-9]+)/messages',
                MessageViewSet, base_name='messages')

urlpatterns = router.urls