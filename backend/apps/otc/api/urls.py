from django.conf.urls import url, include
from .views import OTCView

urlpatterns = [
    url(r'^$', OTCView.as_view()),
]
