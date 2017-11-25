from django.conf.urls import url, include

from apps.common.api.views import CityListAPIView

urlpatterns = [
    url(r'^cities/$', CityListAPIView.as_view())
]